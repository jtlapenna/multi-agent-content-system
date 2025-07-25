/**
 * Blog Agent Implementation
 * Generates high-quality, SEO-optimized blog content using Cursor agents
 */

const WorkflowStateManager = require('../../utils/workflowStateManager');
const AgentRouter = require('../../utils/agentRouter');
const path = require('path');
const fs = require('fs').promises;

class BlogAgent {
  constructor(config = {}) {
    this.config = config;
    this.workflowManager = new WorkflowStateManager();
    this.agentRouter = new AgentRouter();
    this.agentName = 'BlogAgent';
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
      
      // Load SEO results
      const seoResults = await this.loadSEOResults(postId);
      
      // Generate blog content
      const blogContent = await this.generateBlogContent(postId, seoResults, workflowState);
      
      // Save blog draft
      await this.saveBlogDraft(postId, blogContent);
      
      // Update workflow state
      const updatedState = await this.completeWork(postId, blogContent);
      
      console.log(`✅ ${this.agentName} completed work for ${postId}`);
      console.log(`   Next agent: ${updatedState.next_agent}`);
      
      return {
        success: true,
        postId,
        blogContent,
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
   * Load SEO results from previous agent
   * @param {string} postId - Post identifier
   */
  async loadSEOResults(postId) {
    const seoResultsPath = path.join(`content/blog-posts/${postId}`, 'seo-results.json');
    
    try {
      const seoData = await fs.readFile(seoResultsPath, 'utf8');
      const seoResults = JSON.parse(seoData);
      
      console.log(`📊 Loaded SEO results for ${postId}`);
      console.log(`   Primary topic: ${seoResults.primary_topic}`);
      console.log(`   Target keywords: ${seoResults.target_keywords?.length || 0}`);
      
      return seoResults;
    } catch (error) {
      throw new Error(`Failed to load SEO results: ${error.message}`);
    }
  }

  /**
   * Generate blog content using Cursor agent
   * @param {string} postId - Post identifier
   * @param {object} seoResults - SEO research results
   * @param {object} workflowState - Current workflow state
   */
  async generateBlogContent(postId, seoResults, workflowState) {
    console.log(`✍️ Generating blog content for ${postId}`);
    
    // Prepare content generation parameters
    const contentParams = {
      topic: seoResults.primary_topic,
      targetKeywords: seoResults.target_keywords,
      contentStrategy: seoResults.content_strategy,
      estimatedWordCount: seoResults.content_strategy?.estimatedWordCount || 2500,
      contentType: seoResults.content_strategy?.contentType || 'gift_guide'
    };
    
    // Generate content using Cursor agent
    // Note: This is a placeholder for Cursor agent integration
    // In practice, this would trigger a Cursor agent to generate the content
    const blogContent = await this.generateContentWithCursor(contentParams);
    
    console.log(`✅ Blog content generated`);
    console.log(`   Word count: ${blogContent.wordCount}`);
    console.log(`   Content type: ${blogContent.contentType}`);
    console.log(`   Affiliate products: ${blogContent.affiliateProducts?.length || 0}`);
    
    return blogContent;
  }

  /**
   * Generate content using Cursor agent (placeholder implementation)
   * @param {object} contentParams - Content generation parameters
   */
  async generateContentWithCursor(contentParams) {
    // This is a placeholder for Cursor agent integration
    // In practice, this would:
    // 1. Create a Cursor agent prompt with the content parameters
    // 2. Trigger the Cursor agent to generate content
    // 3. Return the generated content
    
    console.log(`🤖 Triggering Cursor agent for content generation`);
    console.log(`   Topic: ${contentParams.topic}`);
    console.log(`   Target keywords: ${contentParams.targetKeywords?.length || 0}`);
    console.log(`   Content type: ${contentParams.contentType}`);
    
    // Simulate content generation (replace with actual Cursor agent call)
    const blogContent = {
      title: `Best ${contentParams.topic} - Complete Guide`,
      content: this.generatePlaceholderContent(contentParams),
      wordCount: contentParams.estimatedWordCount,
      contentType: contentParams.contentType,
      affiliateProducts: this.generatePlaceholderAffiliateProducts(contentParams),
      internalLinks: [],
      targetKeywords: contentParams.targetKeywords,
      metaDescription: `Discover the best ${contentParams.topic}. Our comprehensive guide includes expert recommendations and helpful tips.`
    };
    
    return blogContent;
  }

  /**
   * Generate placeholder content (for testing)
   * @param {object} contentParams - Content generation parameters
   */
  generatePlaceholderContent(contentParams) {
    const { topic, targetKeywords, estimatedWordCount } = contentParams;
    
    return `# Best ${topic} - Complete Guide

## Introduction

Finding the perfect ${topic} can be challenging. In this comprehensive guide, we'll help you discover the best options available, whether you're looking for quality, affordability, or something unique.

## Why This Matters

Choosing the right ${topic} is important because it shows thoughtfulness and consideration. Our recommendations are based on extensive research and real user feedback.

## Top Recommendations

### 1. Premium Option
**Why it's great:** High-quality materials and excellent craftsmanship
**Practical tip:** Consider this for special occasions
**Price Range:** $50-$100

### 2. Budget-Friendly Choice
**Why it's great:** Great value without compromising quality
**Practical tip:** Perfect for everyday use
**Price Range:** $20-$50

### 3. Unique Find
**Why it's great:** Stands out from typical options
**Practical tip:** Great conversation starter
**Price Range:** $30-$80

## How to Choose

- Consider the recipient's preferences
- Think about the occasion
- Set a realistic budget
- Read reviews and ratings
- Check return policies

## Conclusion

With these recommendations, you're sure to find the perfect ${topic}. Remember, the best choice is one that shows you care.

*Ready to find more gift ideas? Try our Gift Idea Generator for personalized recommendations.*`;
  }

  /**
   * Generate placeholder affiliate products (for testing)
   * @param {object} contentParams - Content generation parameters
   */
  generatePlaceholderAffiliateProducts(contentParams) {
    return [
      {
        platform: 'amazon',
        name: 'Premium Product',
        price: '$75',
        description: 'High-quality option with excellent reviews',
        link: 'https://amazon.com/affiliate-link-1'
      },
      {
        platform: 'bookshop',
        name: 'Related Book',
        price: '$25',
        description: 'Helpful guide for better understanding',
        link: 'https://bookshop.org/affiliate-link-1'
      },
      {
        platform: 'afrofiliate',
        name: 'Black-Owned Business Product',
        price: '$45',
        description: 'Unique option from a Black-owned business',
        link: 'https://afrofiliate.com/affiliate-link-1'
      }
    ];
  }

  /**
   * Save blog draft to file
   * @param {string} postId - Post identifier
   * @param {object} blogContent - Generated blog content
   */
  async saveBlogDraft(postId, blogContent) {
    const postDir = `content/blog-posts/${postId}`;
    
    // Create directory if it doesn't exist
    await fs.mkdir(postDir, { recursive: true });
    
    // Create blog draft with frontmatter
    const blogDraft = this.createBlogDraftWithFrontmatter(blogContent);
    
    // Save blog draft
    const blogDraftPath = path.join(postDir, 'blog-draft.md');
    await fs.writeFile(blogDraftPath, blogDraft);
    
    console.log(`💾 Blog draft saved to ${blogDraftPath}`);
  }

  /**
   * Create blog draft with frontmatter
   * @param {object} blogContent - Generated blog content
   */
  createBlogDraftWithFrontmatter(blogContent) {
    const frontmatter = {
      title: blogContent.title,
      description: blogContent.metaDescription,
      keywords: blogContent.targetKeywords,
      contentType: blogContent.contentType,
      wordCount: blogContent.wordCount,
      affiliateProducts: blogContent.affiliateProducts,
      internalLinks: blogContent.internalLinks,
      generatedAt: new Date().toISOString()
    };
    
    return `---
${Object.entries(frontmatter).map(([key, value]) => {
  if (Array.isArray(value)) {
    return `${key}:\n${value.map(item => `  - ${item}`).join('\n')}`;
  } else if (typeof value === 'object') {
    return `${key}:\n${JSON.stringify(value, null, 2).split('\n').map(line => `  ${line}`).join('\n')}`;
  } else {
    return `${key}: ${value}`;
  }
}).join('\n')}
---

${blogContent.content}`;
  }

  /**
   * Complete agent work and hand off to next agent
   * @param {string} postId - Post identifier
   * @param {object} blogContent - Generated blog content
   */
  async completeWork(postId, blogContent) {
    // Update workflow state
    const updates = {
      current_phase: 'BLOG_COMPLETE',
      next_agent: 'ReviewAgent',
      agent_outputs: {
        ...(await this.workflowManager.getWorkflowState(postId)).agent_outputs,
        [this.agentName]: 'blog-draft.md'
      },
      blog_metadata: {
        word_count: blogContent.wordCount,
        content_type: blogContent.contentType,
        affiliate_products: {
          amazon: blogContent.affiliateProducts?.filter(p => p.platform === 'amazon').length || 0,
          bookshop: blogContent.affiliateProducts?.filter(p => p.platform === 'bookshop').length || 0,
          afrofiliate: blogContent.affiliateProducts?.filter(p => p.platform === 'afrofiliate').length || 0
        },
        internal_links: blogContent.internalLinks?.length || 0,
        target_keywords: blogContent.targetKeywords
      },
      last_updated: new Date().toISOString()
    };
    
    const updatedState = await this.workflowManager.updateWorkflowState(postId, updates);
    
    // Trigger next agent
    await this.agentRouter.completeWork(
      postId,
      this.agentName,
      'ReviewAgent',
      'REVIEW_COMPLETE',
      { blogDraft: 'blog-draft.md' }
    );
    
    return updatedState;
  }

  /**
   * Find next work for this agent
   */
  async findNextWork() {
    return await this.agentRouter.findNextWork(this.agentName, 'SEO_COMPLETE');
  }
}

module.exports = BlogAgent; 