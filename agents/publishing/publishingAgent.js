/**
 * Publishing Agent Implementation
 * Integrates with GitHub API, Cloudflare API, and notification service for comprehensive publishing workflow
 */

const GitHubAPI = require('../../utils/githubAPI');
const CloudflareAPI = require('../../utils/cloudflareAPI');
const NotificationService = require('../../utils/notificationService');
const WorkflowStateManager = require('../../utils/workflowStateManager');
const AgentRouter = require('../../utils/agentRouter');
const path = require('path');
const fs = require('fs').promises;

class PublishingAgent {
  constructor(config = {}) {
    this.config = config;
    this.githubAPI = new GitHubAPI(config);
    this.cloudflareAPI = new CloudflareAPI(config);
    this.notificationService = new NotificationService(config);
    this.workflowManager = new WorkflowStateManager();
    this.agentRouter = new AgentRouter();
    this.agentName = 'PublishingAgent';
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
      
      // Load blog content and images
      const blogContent = await this.loadBlogContent(postId);
      const imageFiles = await this.loadImageFiles(postId);
      
      // Prepare publishing data
      const publishingData = await this.preparePublishingData(postId, blogContent, imageFiles);
      
      // Create preview branch and upload content
      const githubResult = await this.createPreviewBranch(postId, publishingData);
      
      // Deploy to Cloudflare Pages
      const cloudflareResult = await this.deployToCloudflare(postId, githubResult.branchName);
      
      // Create pull request
      const prResult = await this.createPullRequest(postId, githubResult, cloudflareResult);
      
      // Send approval notification
      await this.sendApprovalNotification(postId, prResult, blogContent);
      
      // Update workflow state
      const updatedState = await this.completeWork(postId, prResult, cloudflareResult);
      
      console.log(`✅ ${this.agentName} completed work for ${postId}`);
      console.log(`   Preview URL: ${cloudflareResult.previewUrl}`);
      console.log(`   Pull Request: #${prResult.pullRequest.number}`);
      
      return {
        success: true,
        postId,
        githubResult,
        cloudflareResult,
        prResult,
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
      
      return {
        frontmatter,
        content,
        fullContent: blogData
      };
    } catch (error) {
      throw new Error(`Failed to load blog content: ${error.message}`);
    }
  }

  /**
   * Load image files from previous agent
   * @param {string} postId - Post identifier
   */
  async loadImageFiles(postId) {
    const imagesDir = path.join(`content/blog-posts/${postId}`, 'images');
    
    try {
      const files = await fs.readdir(imagesDir);
      const imageFiles = files.filter(file => 
        file.endsWith('.webp') || file.endsWith('.jpg') || file.endsWith('.png')
      );
      
      console.log(`🖼️ Loaded ${imageFiles.length} image files for ${postId}`);
      
      return imageFiles.map(file => path.join(imagesDir, file));
    } catch (error) {
      console.warn(`⚠️ No images directory found for ${postId}`);
      return [];
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
          frontmatter[key] = value.slice(1, -1).split(',').map(item => item.trim());
        } else if (value === 'true' || value === 'false') {
          frontmatter[key] = value === 'true';
        } else if (!isNaN(value)) {
          frontmatter[key] = Number(value);
        } else {
          frontmatter[key] = value;
        }
      }
    }
    
    return { frontmatter, content };
  }

  /**
   * Prepare publishing data
   * @param {string} postId - Post identifier
   * @param {object} blogContent - Blog content
   * @param {array} imageFiles - Image file paths
   */
  async preparePublishingData(postId, blogContent, imageFiles) {
    console.log(`📋 Preparing publishing data for ${postId}`);
    
    // Generate branch name
    const branchName = `preview/${postId}`;
    
    // Prepare social posts (placeholder for now)
    const socialPosts = this.generateSocialPosts(blogContent.frontmatter);
    
    // Add social posts to blog content frontmatter
    const updatedContent = this.addSocialPostsToContent(blogContent, socialPosts);
    
    return {
      branchName,
      blogContent: updatedContent,
      imageFiles,
      socialPosts,
      postId
    };
  }

  /**
   * Generate social posts (placeholder implementation)
   * @param {object} frontmatter - Blog frontmatter
   */
  generateSocialPosts(frontmatter) {
    const title = frontmatter.title || 'Blog Post';
    const description = frontmatter.description || 'Check out this amazing content!';
    
    return {
      x: `🚀 ${title} - ${description.substring(0, 200)}... #gifts #recommendations`,
      bluesky: `Discover amazing ${title.toLowerCase()} recommendations. ${description.substring(0, 200)}...`,
      pinterest: `${title} - ${description} Perfect for gift-giving and thoughtful recommendations.`,
      facebook: `Looking for the best ${title.toLowerCase()}? Our comprehensive guide has you covered with expert recommendations and helpful tips.`,
      instagram: `🎁 ${title} - ${description.substring(0, 150)}... #gifts #recommendations #thoughtful`
    };
  }

  /**
   * Add social posts to blog content
   * @param {object} blogContent - Blog content
   * @param {object} socialPosts - Social posts
   */
  addSocialPostsToContent(blogContent, socialPosts) {
    // Add social posts to frontmatter
    const updatedFrontmatter = {
      ...blogContent.frontmatter,
      social_posts: socialPosts
    };
    
    // Reconstruct the markdown with updated frontmatter
    const frontmatterText = Object.entries(updatedFrontmatter)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}:\n${value.map(item => `  - ${item}`).join('\n')}`;
        } else if (typeof value === 'object') {
          return `${key}:\n${JSON.stringify(value, null, 2).split('\n').map(line => `  ${line}`).join('\n')}`;
        } else {
          return `${key}: ${value}`;
        }
      })
      .join('\n');
    
    const updatedContent = `---
${frontmatterText}
---

${blogContent.content}`;
    
    return {
      ...blogContent,
      fullContent: updatedContent,
      frontmatter: updatedFrontmatter
    };
  }

  /**
   * Create preview branch and upload content
   * @param {string} postId - Post identifier
   * @param {object} publishingData - Publishing data
   */
  async createPreviewBranch(postId, publishingData) {
    console.log(`🌿 Creating preview branch: ${publishingData.branchName}`);
    
    // Create branch
    await this.githubAPI.createBranch(publishingData.branchName);
    
    // Upload blog content
    const blogPath = `content/blog-posts/${postId}/blog-final.md`;
    await this.githubAPI.uploadFile(
      publishingData.branchName,
      blogPath,
      publishingData.blogContent.fullContent,
      `Add blog content: ${publishingData.blogContent.frontmatter.title}`
    );
    
    // Upload images
    for (const imagePath of publishingData.imageFiles) {
      const imageContent = await fs.readFile(imagePath);
      const relativePath = path.relative(`content/blog-posts/${postId}`, imagePath);
      const githubPath = `content/blog-posts/${postId}/${relativePath}`;
      
      await this.githubAPI.uploadFile(
        publishingData.branchName,
        githubPath,
        imageContent,
        `Add image: ${path.basename(imagePath)}`
      );
    }
    
    console.log(`✅ Preview branch created and content uploaded`);
    
    return {
      branchName: publishingData.branchName,
      blogPath,
      imageCount: publishingData.imageFiles.length
    };
  }

  /**
   * Deploy to Cloudflare Pages
   * @param {string} postId - Post identifier
   * @param {object} githubResult - GitHub operation results
   */
  async deployToCloudflare(postId, branchName) {
    console.log(`☁️ Deploying to Cloudflare Pages: ${branchName}`);
    
    // Create preview deployment
    const deployment = await this.cloudflareAPI.createPreviewDeployment(branchName);
    
    // Wait for deployment to complete
    await this.cloudflareAPI.waitForDeployment(deployment.id);
    
    console.log(`✅ Cloudflare deployment completed`);
    console.log(`   Preview URL: ${deployment.url}`);
    
    return {
      deploymentId: deployment.id,
      previewUrl: deployment.url,
      status: 'success'
    };
  }

  /**
   * Create pull request
   * @param {string} postId - Post identifier
   * @param {object} githubResult - GitHub operation results
   * @param {object} cloudflareResult - Cloudflare deployment results
   */
  async createPullRequest(postId, githubResult, cloudflareResult) {
    console.log(`🔀 Creating pull request for ${postId}`);
    
    const title = `Add blog post: ${postId}`;
    const description = `## Blog Post: ${postId}

### Preview
- **Preview URL:** ${cloudflareResult.previewUrl}
- **Branch:** ${githubResult.branchName}

### Content
- Blog content with SEO optimization
- Generated images (banner, OG)
- Social media posts ready for scheduling

### Review Checklist
- [ ] Content quality and accuracy
- [ ] SEO optimization
- [ ] Image quality and relevance
- [ ] Social posts appropriateness
- [ ] Affiliate link accuracy

Ready for review and approval! 🚀`;

    const pullRequest = await this.githubAPI.createPullRequest(
      githubResult.branchName,
      'main',
      title,
      description
    );
    
    console.log(`✅ Pull request created: #${pullRequest.number}`);
    
    return {
      pullRequest,
      branchName: githubResult.branchName,
      previewUrl: cloudflareResult.previewUrl
    };
  }

  /**
   * Send approval notification
   * @param {string} postId - Post identifier
   * @param {object} prResult - Pull request results
   * @param {object} blogContent - Blog content
   */
  async sendApprovalNotification(postId, prResult, blogContent) {
    console.log(`📧 Sending approval notification for ${postId}`);
    
    const topic = {
      title: blogContent.frontmatter.title,
      contentType: blogContent.frontmatter.contentType || 'gift_guide',
      primaryKeyword: blogContent.frontmatter.keywords?.[0] || 'N/A',
      estimatedWordCount: blogContent.frontmatter.wordCount || 'N/A'
    };
    
    const socialPosts = blogContent.frontmatter.social_posts || {};
    
    await this.notificationService.sendApprovalNotification(
      prResult,
      topic,
      socialPosts
    );
    
    console.log(`✅ Approval notification sent`);
  }

  /**
   * Complete agent work and hand off to next agent
   * @param {string} postId - Post identifier
   * @param {object} prResult - Pull request results
   * @param {object} cloudflareResult - Cloudflare deployment results
   */
  async completeWork(postId, prResult, cloudflareResult) {
    // Update workflow state
    const updates = {
      current_phase: 'PUBLISHING_COMPLETE',
      next_agent: 'SocialAgent', // Disabled for now
      agent_outputs: {
        ...(await this.workflowManager.getWorkflowState(postId)).agent_outputs,
        [this.agentName]: 'published/'
      },
      publishing_metadata: {
        preview_url: cloudflareResult.previewUrl,
        pr_number: prResult.pullRequest.number,
        pr_url: prResult.pullRequest.url,
        branch_name: prResult.branchName,
        deployment_id: cloudflareResult.deploymentId,
        deployment_status: cloudflareResult.status,
        approval_status: 'pending',
        content_files: ['blog-final.md', 'banner.webp', 'og.webp', 'og.jpg'],
        social_posts: prResult.socialPosts || {},
        publish_time: new Date().toISOString()
      },
      last_updated: new Date().toISOString()
    };
    
    const updatedState = await this.workflowManager.updateWorkflowState(postId, updates);
    
    // Note: Social Agent is disabled, so workflow ends here for now
    console.log(`🏁 Publishing workflow completed for ${postId}`);
    console.log(`   Social posts ready for manual posting`);
    
    return updatedState;
  }

  /**
   * Find next work for this agent
   */
  async findNextWork() {
    return await this.agentRouter.findNextWork(this.agentName, 'IMAGE_COMPLETE');
  }
}

module.exports = PublishingAgent; 