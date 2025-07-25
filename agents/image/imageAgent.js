/**
 * Image Agent Implementation
 * Integrates with images.js for image generation and optimization
 */

const { generateImages } = require('../../utils/images');
const WorkflowStateManager = require('../../utils/workflowStateManager');
const AgentRouter = require('../../utils/agentRouter');
const path = require('path');
const fs = require('fs').promises;

class ImageAgent {
  constructor(config = {}) {
    this.config = config;
    this.workflowManager = new WorkflowStateManager();
    this.agentRouter = new AgentRouter();
    this.agentName = 'ImageAgent';
  }

  /**
   * Main agent execution method
   * @param {string} postId - Blog post identifier
   */
  async run(postId) {
    console.log(`🤖 ${this.agentName} starting work for ${postId}`);
    
    try {
      // Get current workflow state
      const workflowState = await this.workflowManager.getWorkflowState(postId);
      
      // Load blog content
      const blogContent = await this.loadBlogContent(postId);
      
      // Generate images
      const generatedImages = await this.generateImages(postId, blogContent);
      
      // Save image metadata
      await this.saveImageMetadata(postId, generatedImages);
      
      // Update workflow state
      const updatedState = await this.completeWork(postId, generatedImages);
      
      console.log(`✅ ${this.agentName} completed work for ${postId}`);
      console.log(`   Next agent: ${updatedState.next_agent}`);
      
      return {
        success: true,
        postId,
        generatedImages,
        updatedState
      };
      
    } catch (error) {
      console.error(`❌ ${this.agentName} failed for ${postId}:`, error.message);
      
      // Update workflow state with error
      await this.workflowManager.updateWorkflowState(postId, {
        status: 'error',
        errors: [{
          agent: this.agentName,
          error: error.message,
          timestamp: new Date().toISOString()
        }]
      });
      
      return {
        success: false,
        postId,
        error: error.message
      };
    }
  }

  /**
   * Load blog content from previous agent
   * @param {string} postId - Post identifier
   */
  async loadBlogContent(postId) {
    const blogFinalPath = path.join(`content/blog-posts/${postId}`, 'blog-final.md');
    
    try {
      const blogData = await fs.readFile(blogFinalPath, 'utf8');
      
      // Parse frontmatter and content
      const { frontmatter, content } = this.parseMarkdownWithFrontmatter(blogData);
      
      console.log(`📄 Loaded blog content for ${postId}`);
      console.log(`   Title: ${frontmatter.title}`);
      console.log(`   Content type: ${frontmatter.contentType}`);
      
      return {
        frontmatter,
        content,
        slug: postId
      };
    } catch (error) {
      throw new Error(`Failed to load blog content: ${error.message}`);
    }
  }

  /**
   * Parse markdown with frontmatter
   * @param {string} markdown - Markdown content with frontmatter
   */
  parseMarkdownWithFrontmatter(markdown) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = markdown.match(frontmatterRegex);
    
    if (!match) {
      // No frontmatter, treat entire content as body
      return {
        frontmatter: {},
        content: markdown
      };
    }
    
    const frontmatterText = match[1];
    const content = match[2];
    
    // Parse frontmatter (simple YAML-like parsing)
    const frontmatter = {};
    const lines = frontmatterText.split('\n');
    
    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        
        // Handle different value types
        if (value.startsWith('[') && value.endsWith(']')) {
          // Array
          frontmatter[key] = value.slice(1, -1).split(',').map(item => item.trim());
        } else if (value === 'true' || value === 'false') {
          // Boolean
          frontmatter[key] = value === 'true';
        } else if (!isNaN(value)) {
          // Number
          frontmatter[key] = Number(value);
        } else {
          // String
          frontmatter[key] = value;
        }
      }
    }
    
    return { frontmatter, content };
  }

  /**
   * Generate images using images.js utility
   * @param {string} postId - Post identifier
   * @param {object} blogContent - Blog content with frontmatter
   */
  async generateImages(postId, blogContent) {
    console.log(`🖼️ Generating images for ${postId}`);
    
    // Prepare content object for image generation
    const contentObject = {
      frontmatter: blogContent.frontmatter,
      content: blogContent.content,
      slug: postId,
      seoData: {
        title: blogContent.frontmatter.title,
        description: blogContent.frontmatter.description,
        keywords: blogContent.frontmatter.keywords
      }
    };
    
    // Generate images using the images.js utility
    const generatedImages = await generateImages(contentObject, this.config);
    
    console.log(`✅ Images generated successfully`);
    console.log(`   Banner image: ${generatedImages.banner || 'Not generated'}`);
    console.log(`   OG image: ${generatedImages.og || 'Not generated'}`);
    console.log(`   OG JPG: ${generatedImages.ogJpg || 'Not generated'}`);
    
    return generatedImages;
  }

  /**
   * Save image metadata
   * @param {string} postId - Post identifier
   * @param {object} generatedImages - Generated images metadata
   */
  async saveImageMetadata(postId, generatedImages) {
    const postDir = `content/blog-posts/${postId}`;
    
    // Create directory if it doesn't exist
    await fs.mkdir(postDir, { recursive: true });
    
    // Save image metadata
    const imageMetadataPath = path.join(postDir, 'image-metadata.json');
    const imageMetadata = {
      postId,
      generatedImages,
      generatedAt: new Date().toISOString()
    };
    await fs.writeFile(imageMetadataPath, JSON.stringify(imageMetadata, null, 2));
    
    console.log(`💾 Image metadata saved to ${imageMetadataPath}`);
  }

  /**
   * Complete agent work and hand off to next agent
   * @param {string} postId - Post identifier
   * @param {object} generatedImages - Generated images metadata
   */
  async completeWork(postId, generatedImages) {
    // Update workflow state
    const updates = {
      current_phase: 'IMAGE_COMPLETE',
      next_agent: 'PublishingAgent',
      agent_outputs: {
        ...(await this.workflowManager.getWorkflowState(postId)).agent_outputs,
        [this.agentName]: 'images/'
      },
      image_metadata: {
        banner_image: generatedImages.banner,
        og_image: generatedImages.og,
        og_image_jpg: generatedImages.ogJpg,
        image_prompts: generatedImages.metadataPath,
        generation_time: new Date().toISOString()
      },
      last_updated: new Date().toISOString()
    };
    
    const updatedState = await this.workflowManager.updateWorkflowState(postId, updates);
    
    // Trigger next agent
    await this.agentRouter.completeWork(
      postId,
      this.agentName,
      'PublishingAgent',
      'PUBLISHING_COMPLETE',
      { images: 'images/' }
    );
    
    return updatedState;
  }

  /**
   * Find next work for this agent
   */
  async findNextWork() {
    return await this.agentRouter.findNextWork(this.agentName, 'REVIEW_COMPLETE');
  }
}

module.exports = ImageAgent; 