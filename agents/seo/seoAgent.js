/**
 * SEO Agent Implementation
 * Integrates with enhancedSEOProcessor.js for comprehensive SEO research
 */

const EnhancedSEOProcessor = require('../../utils/enhancedSEOProcessor');
const WorkflowStateManager = require('../../utils/workflowStateManager');
const AgentRouter = require('../../utils/agentRouter');
const path = require('path');
const fs = require('fs').promises;

class SEOAgent {
  constructor(config = {}) {
    this.config = config;
    this.seoProcessor = new EnhancedSEOProcessor(config);
    this.workflowManager = new WorkflowStateManager();
    this.agentRouter = new AgentRouter();
    this.agentName = 'SEOAgent';
  }

  /**
   * Main agent execution method
   * @param {string} postId - Blog post identifier
   */
  async run(postId) {
    console.log(`🤖 ${this.agentName} starting work for ${postId}`);
    
    try {
      // Initialize SEO processor
      await this.seoProcessor.initialize();
      
      // Get current workflow state
      const workflowState = await this.workflowManager.getWorkflowState(postId);
      
      // Run SEO research
      const seoResults = await this.runSEOResearch(postId, workflowState);
      
      // Save results
      await this.saveResults(postId, seoResults);
      
      // Update workflow state
      const updatedState = await this.completeWork(postId, seoResults);
      
      console.log(`✅ ${this.agentName} completed work for ${postId}`);
      console.log(`   Next agent: ${updatedState.next_agent}`);
      
      return {
        success: true,
        postId,
        seoResults,
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
   * Run comprehensive SEO research
   * @param {string} postId - Post identifier
   * @param {object} workflowState - Current workflow state
   */
  async runSEOResearch(postId, workflowState) {
    console.log(`🔍 Running SEO research for ${postId}`);
    
    const topic = workflowState.topic;
    if (!topic) {
      throw new Error('No topic found in workflow state');
    }

    // Run SEO research using enhanced processor
    const seoResults = await this.seoProcessor.processSEOResearch(topic);
    
    console.log(`✅ SEO research completed`);
    console.log(`   Primary topic: ${seoResults.primary_topic}`);
    console.log(`   Target keywords: ${seoResults.target_keywords?.length || 0}`);
    console.log(`   Content strategy: ${seoResults.content_strategy?.contentType || 'N/A'}`);
    
    return seoResults;
  }

  /**
   * Save SEO results to blog post directory
   * @param {string} postId - Post identifier
   * @param {object} seoResults - SEO research results
   */
  async saveResults(postId, seoResults) {
    const postDir = `content/blog-posts/${postId}`;
    
    // Create directory if it doesn't exist
    await fs.mkdir(postDir, { recursive: true });
    
    // Save SEO results
    const seoResultsPath = path.join(postDir, 'seo-results.json');
    await fs.writeFile(seoResultsPath, JSON.stringify(seoResults, null, 2));
    
    console.log(`💾 SEO results saved to ${seoResultsPath}`);
  }

  /**
   * Complete agent work and hand off to next agent
   * @param {string} postId - Post identifier
   * @param {object} seoResults - SEO research results
   */
  async completeWork(postId, seoResults) {
    // Update workflow state
    const updates = {
      current_phase: 'SEO_COMPLETE',
      next_agent: 'BlogAgent',
      agent_outputs: {
        [this.agentName]: 'seo-results.json'
      },
      seo_analysis: {
        primary_topic: seoResults.primary_topic,
        target_keywords: seoResults.target_keywords,
        content_strategy: seoResults.content_strategy,
        estimated_word_count: seoResults.content_strategy?.estimatedWordCount || 2500,
        commercial_intent: seoResults.content_strategy?.commercialIntent || 'mixed'
      },
      last_updated: new Date().toISOString()
    };
    
    const updatedState = await this.workflowManager.updateWorkflowState(postId, updates);
    
    // Trigger next agent
    await this.agentRouter.completeWork(
      postId,
      this.agentName,
      'BlogAgent',
      'BLOG_COMPLETE',
      { seoResults: 'seo-results.json' }
    );
    
    return updatedState;
  }

  /**
   * Find next work for this agent
   */
  async findNextWork() {
    return await this.agentRouter.findNextWork(this.agentName, 'INITIALIZED');
  }
}

module.exports = SEOAgent; 