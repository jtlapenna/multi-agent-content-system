/**
 * Review Agent Implementation
 * Integrates with contentChecker.js for comprehensive content review and optimization
 */

const ContentChecker = require('../../utils/contentChecker');
const WorkflowStateManager = require('../../utils/workflowStateManager');
const AgentRouter = require('../../utils/agentRouter');
const path = require('path');
const fs = require('fs').promises;

class ReviewAgent {
  constructor(config = {}) {
    this.config = config;
    this.contentChecker = new ContentChecker();
    this.workflowManager = new WorkflowStateManager();
    this.agentRouter = new AgentRouter();
    this.agentName = 'ReviewAgent';
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
      
      // Load blog draft and SEO results
      const blogDraft = await this.loadBlogDraft(postId);
      const seoResults = await this.loadSEOResults(postId);
      
      // Review and optimize content
      const optimizedContent = await this.reviewAndOptimizeContent(postId, blogDraft, seoResults);
      
      // Save optimized content
      await this.saveOptimizedContent(postId, optimizedContent);
      
      // Update workflow state
      const updatedState = await this.completeWork(postId, optimizedContent);
      
      console.log(`✅ ${this.agentName} completed work for ${postId}`);
      console.log(`   Next agent: ${updatedState.next_agent}`);
      
      return {
        success: true,
        postId,
        optimizedContent,
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
   * Load blog draft from previous agent
   * @param {string} postId - Post identifier
   */
  async loadBlogDraft(postId) {
    const blogDraftPath = path.join(`content/blog-posts/${postId}`, 'blog-draft.md');
    
    try {
      const blogData = await fs.readFile(blogDraftPath, 'utf8');
      
      console.log(`📄 Loaded blog draft for ${postId}`);
      
      return blogData;
    } catch (error) {
      throw new Error(`Failed to load blog draft: ${error.message}`);
    }
  }

  /**
   * Load SEO results from SEO agent
   * @param {string} postId - Post identifier
   */
  async loadSEOResults(postId) {
    const seoResultsPath = path.join(`content/blog-posts/${postId}`, 'seo-results.json');
    
    try {
      const seoData = await fs.readFile(seoResultsPath, 'utf8');
      const seoResults = JSON.parse(seoData);
      
      console.log(`📊 Loaded SEO results for ${postId}`);
      
      return seoResults;
    } catch (error) {
      throw new Error(`Failed to load SEO results: ${error.message}`);
    }
  }

  /**
   * Review and optimize content using content checker
   * @param {string} postId - Post identifier
   * @param {string} blogDraft - Blog draft content
   * @param {object} seoResults - SEO research results
   */
  async reviewAndOptimizeContent(postId, blogDraft, seoResults) {
    console.log(`🔍 Reviewing and optimizing content for ${postId}`);
    
    // Use content checker to review and optimize
    const optimizedContent = await this.contentChecker.reviewAndOptimizeContent(blogDraft, seoResults);
    
    console.log(`✅ Content review and optimization completed`);
    console.log(`   Optimization score: ${optimizedContent.optimizationScore || 'N/A'}`);
    console.log(`   Word count: ${optimizedContent.wordCount || 'N/A'}`);
    console.log(`   Keyword coverage: ${optimizedContent.keywordCoverage || 'N/A'}`);
    
    return optimizedContent;
  }

  /**
   * Save optimized content to file
   * @param {string} postId - Post identifier
   * @param {object} optimizedContent - Optimized content
   */
  async saveOptimizedContent(postId, optimizedContent) {
    const postDir = `content/blog-posts/${postId}`;
    
    // Create directory if it doesn't exist
    await fs.mkdir(postDir, { recursive: true });
    
    // Save optimized blog content
    const blogFinalPath = path.join(postDir, 'blog-final.md');
    await fs.writeFile(blogFinalPath, optimizedContent.content);
    
    // Save review metadata
    const reviewMetadataPath = path.join(postDir, 'review-metadata.json');
    const reviewMetadata = {
      optimizationScore: optimizedContent.optimizationScore,
      wordCount: optimizedContent.wordCount,
      keywordCoverage: optimizedContent.keywordCoverage,
      affiliateLinks: optimizedContent.affiliateLinks,
      internalLinks: optimizedContent.internalLinks,
      duplicateCheck: optimizedContent.duplicateCheck,
      contentType: optimizedContent.contentType,
      qualityNotes: optimizedContent.qualityNotes,
      reviewedAt: new Date().toISOString()
    };
    await fs.writeFile(reviewMetadataPath, JSON.stringify(reviewMetadata, null, 2));
    
    console.log(`💾 Optimized content saved to ${blogFinalPath}`);
    console.log(`💾 Review metadata saved to ${reviewMetadataPath}`);
  }

  /**
   * Complete agent work and hand off to next agent
   * @param {string} postId - Post identifier
   * @param {object} optimizedContent - Optimized content
   */
  async completeWork(postId, optimizedContent) {
    // Update workflow state
    const updates = {
      current_phase: 'REVIEW_COMPLETE',
      next_agent: 'ImageAgent',
      agent_outputs: {
        ...(await this.workflowManager.getWorkflowState(postId)).agent_outputs,
        [this.agentName]: 'blog-final.md'
      },
      review_metadata: {
        optimization_score: optimizedContent.optimizationScore,
        word_count: optimizedContent.wordCount,
        keyword_coverage: optimizedContent.keywordCoverage,
        affiliate_links: optimizedContent.affiliateLinks,
        internal_links: optimizedContent.internalLinks,
        duplicate_check: optimizedContent.duplicateCheck,
        content_type: optimizedContent.contentType,
        quality_notes: optimizedContent.qualityNotes
      },
      last_updated: new Date().toISOString()
    };
    
    const updatedState = await this.workflowManager.updateWorkflowState(postId, updates);
    
    // Trigger next agent
    await this.agentRouter.completeWork(
      postId,
      this.agentName,
      'ImageAgent',
      'IMAGE_COMPLETE',
      { blogFinal: 'blog-final.md' }
    );
    
    return updatedState;
  }

  /**
   * Find next work for this agent
   */
  async findNextWork() {
    return await this.agentRouter.findNextWork(this.agentName, 'BLOG_COMPLETE');
  }
}

module.exports = ReviewAgent; 