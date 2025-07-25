/**
 * Main Agent Runner
 * Orchestrates all agents and runs the complete workflow
 */

const SEOAgent = require('./seo/seoAgent');
const BlogAgent = require('./blog/blogAgent');
const ReviewAgent = require('./review/reviewAgent');
const ImageAgent = require('./image/imageAgent');
const PublishingAgent = require('./publishing/publishingAgent');
const WorkflowStateManager = require('../utils/workflowStateManager');
const AgentRouter = require('../utils/agentRouter');

class AgentRunner {
  constructor(config = {}) {
    this.config = config;
    this.workflowManager = new WorkflowStateManager();
    this.agentRouter = new AgentRouter();
    
    // Initialize all agents
    this.agents = {
      SEOAgent: new SEOAgent(config),
      BlogAgent: new BlogAgent(config),
      ReviewAgent: new ReviewAgent(config),
      ImageAgent: new ImageAgent(config),
      PublishingAgent: new PublishingAgent(config)
    };
  }

  /**
   * Run complete workflow for a blog post
   * @param {string} postId - Blog post identifier
   * @param {string} topic - Blog topic
   */
  async runCompleteWorkflow(postId, topic) {
    console.log(`🚀 Starting complete workflow for ${postId}`);
    console.log(`   Topic: ${topic}`);
    
    try {
      // Initialize workflow state
      await this.workflowManager.initializeWorkflow(postId, topic);
      
      // Run all agents in sequence
      const results = await this.runAllAgents(postId);
      
      console.log(`✅ Complete workflow finished for ${postId}`);
      console.log(`   Results: ${results.successful} successful, ${results.failed} failed`);
      
      return {
        success: results.failed === 0,
        postId,
        results
      };
      
    } catch (error) {
      console.error(`❌ Complete workflow failed for ${postId}:`, error.message);
      
      return {
        success: false,
        postId,
        error: error.message
      };
    }
  }

  /**
   * Run all agents in sequence
   * @param {string} postId - Blog post identifier
   */
  async runAllAgents(postId) {
    const agentSequence = [
      'SEOAgent',
      'BlogAgent', 
      'ReviewAgent',
      'ImageAgent',
      'PublishingAgent'
    ];
    
    const results = {
      successful: 0,
      failed: 0,
      agentResults: []
    };
    
    for (const agentName of agentSequence) {
      try {
        console.log(`\n🤖 Running ${agentName}...`);
        
        const agent = this.agents[agentName];
        const result = await agent.run(postId);
        
        if (result.success) {
          console.log(`✅ ${agentName} completed successfully`);
          results.successful++;
        } else {
          console.log(`❌ ${agentName} failed: ${result.error}`);
          results.failed++;
        }
        
        results.agentResults.push({
          agent: agentName,
          success: result.success,
          error: result.error
        });
        
        // If an agent failed, stop the workflow
        if (!result.success) {
          console.log(`🛑 Stopping workflow due to ${agentName} failure`);
          break;
        }
        
        // Wait a moment between agents
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ ${agentName} crashed:`, error.message);
        results.failed++;
        results.agentResults.push({
          agent: agentName,
          success: false,
          error: error.message
        });
        break;
      }
    }
    
    return results;
  }

  /**
   * Run a specific agent
   * @param {string} agentName - Agent name
   * @param {string} postId - Blog post identifier
   */
  async runAgent(agentName, postId) {
    console.log(`🤖 Running ${agentName} for ${postId}`);
    
    if (!this.agents[agentName]) {
      throw new Error(`Unknown agent: ${agentName}`);
    }
    
    const agent = this.agents[agentName];
    return await agent.run(postId);
  }

  /**
   * Find and run next work for a specific agent
   * @param {string} agentName - Agent name
   */
  async runNextWork(agentName) {
    console.log(`🔍 Finding next work for ${agentName}`);
    
    if (!this.agents[agentName]) {
      throw new Error(`Unknown agent: ${agentName}`);
    }
    
    const agent = this.agents[agentName];
    const nextWork = await agent.findNextWork();
    
    if (!nextWork) {
      console.log(`❌ No work found for ${agentName}`);
      return null;
    }
    
    console.log(`✅ Found work for ${agentName}: ${nextWork.postId}`);
    return await agent.run(nextWork.postId);
  }

  /**
   * Get workflow status for a post
   * @param {string} postId - Blog post identifier
   */
  async getWorkflowStatus(postId) {
    try {
      const state = await this.workflowManager.getWorkflowState(postId);
      return {
        postId,
        currentPhase: state.current_phase,
        nextAgent: state.next_agent,
        status: state.status,
        lastUpdated: state.last_updated,
        agentOutputs: state.agent_outputs
      };
    } catch (error) {
      return {
        postId,
        error: error.message
      };
    }
  }

  /**
   * Get all workflow statuses
   */
  async getAllWorkflowStatuses() {
    try {
      const states = await this.workflowManager.getAllWorkflowStates();
      return states.map(state => ({
        postId: state.postId,
        currentPhase: state.current_phase,
        nextAgent: state.next_agent,
        status: state.status,
        lastUpdated: state.last_updated
      }));
    } catch (error) {
      console.error('Failed to get workflow statuses:', error.message);
      return [];
    }
  }

  /**
   * Create a new workflow
   * @param {string} topic - Blog topic
   * @param {object} metadata - Additional metadata
   */
  async createWorkflow(topic, metadata = {}) {
    const postId = this.generatePostId(topic);
    
    console.log(`📝 Creating new workflow for ${postId}`);
    console.log(`   Topic: ${topic}`);
    
    await this.workflowManager.initializeWorkflow(postId, topic, metadata);
    
    return {
      postId,
      topic,
      status: 'initialized'
    };
  }

  /**
   * Generate post ID from topic
   * @param {string} topic - Blog topic
   */
  generatePostId(topic) {
    const date = new Date().toISOString().split('T')[0];
    const slug = topic
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    
    return `blog-${date}-${slug}`;
  }
}

module.exports = AgentRunner; 