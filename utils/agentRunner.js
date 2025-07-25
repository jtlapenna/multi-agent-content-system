/**
 * Agent Runner Utility
 * Centralized agent execution and workflow management
 */

const WorkflowStateTemplate = require('./workflowStateTemplate');
const EnhancedSEOProcessor = require('./enhancedSEOProcessor');
const ContentChecker = require('./contentChecker');
const AgentRouter = require('./agentRouter');

class AgentRunner {
  constructor() {
    this.workflowTemplate = new WorkflowStateTemplate();
    this.agentRouter = new AgentRouter();
    
    // Initialize agent instances
    this.agents = {
      SEOAgent: new EnhancedSEOProcessor(),
      ReviewAgent: new ContentChecker()
      // Additional agents will be added as utilities are updated
    };
  }

  /**
   * Run a specific agent for a blog post
   * @param {string} agentName - Agent to run (e.g., 'SEOAgent', 'ReviewAgent')
   * @param {string} postId - Blog post identifier
   */
  async runAgent(agentName, postId) {
    console.log(`🚀 Running ${agentName} for ${postId}`);
    
    try {
      // Load current workflow state
      const workflowState = await this.workflowTemplate.loadWorkflowState(postId);
      
      // Validate agent can run
      if (workflowState.next_agent !== agentName) {
        throw new Error(`Agent ${agentName} is not next in workflow. Expected: ${workflowState.next_agent}`);
      }
      
      // Check if agent exists
      if (!this.agents[agentName]) {
        throw new Error(`Agent ${agentName} not implemented yet`);
      }
      
      // Run the agent
      const agentMethod = `run${agentName}`;
      if (typeof this.agents[agentName][agentMethod] !== 'function') {
        throw new Error(`Agent method ${agentMethod} not found`);
      }
      
      const result = await this.agents[agentName][agentMethod](postId, workflowState);
      
      if (result.success) {
        console.log(`✅ ${agentName} completed successfully`);
        return result;
      } else {
        throw new Error(`Agent ${agentName} failed: ${result.error}`);
      }
      
    } catch (error) {
      console.error(`❌ Failed to run ${agentName}:`, error.message);
      throw error;
    }
  }

  /**
   * Find and run the next available agent
   * @param {string} agentName - Agent to run
   * @param {string} expectedPhase - Expected current phase
   */
  async findAndRunAgent(agentName, expectedPhase) {
    console.log(`🔍 Looking for work for ${agentName}...`);
    
    // Find available work
    const availableWork = await this.workflowTemplate.findBlogsForAgent(agentName, expectedPhase);
    
    if (availableWork.length === 0) {
      console.log(`ℹ️ No work available for ${agentName} (phase: ${expectedPhase})`);
      return null;
    }
    
    // Take the first available work
    const work = availableWork[0];
    console.log(`📝 Found work: ${work.postId} (${work.state.topic})`);
    
    // Run the agent
    return await this.runAgent(agentName, work.postId);
  }

  /**
   * Run the complete workflow for a blog post
   * @param {string} postId - Blog post identifier
   */
  async runCompleteWorkflow(postId) {
    console.log(`🔄 Running complete workflow for ${postId}`);
    
    const workflow = [
      { agent: 'SEOAgent', phase: 'INITIALIZED' },
      { agent: 'BlogAgent', phase: 'SEO_COMPLETE' },
      { agent: 'ReviewAgent', phase: 'BLOG_COMPLETE' },
      { agent: 'ImageAgent', phase: 'REVIEW_COMPLETE' },
      { agent: 'PublishingAgent', phase: 'IMAGE_COMPLETE' },
      { agent: 'SocialAgent', phase: 'PUBLISHING_COMPLETE' }
    ];
    
    const results = [];
    
    for (const step of workflow) {
      try {
        console.log(`\n🎯 Running ${step.agent}...`);
        const result = await this.runAgent(step.agent, postId);
        results.push({ agent: step.agent, success: true, result });
        
        // Wait a moment between agents
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ ${step.agent} failed:`, error.message);
        results.push({ agent: step.agent, success: false, error: error.message });
        break; // Stop workflow on error
      }
    }
    
    return {
      postId,
      completed: results.filter(r => r.success).length,
      total: workflow.length,
      results
    };
  }

  /**
   * Get status of all agents and workflows
   */
  async getSystemStatus() {
    console.log('📊 Getting system status...');
    
    const status = {
      agents: {},
      workflows: [],
      summary: {}
    };
    
    // Check agent availability
    for (const [agentName, agent] of Object.entries(this.agents)) {
      status.agents[agentName] = {
        available: true,
        methods: Object.getOwnPropertyNames(Object.getPrototypeOf(agent))
          .filter(name => name.startsWith('run'))
      };
    }
    
    // Get active workflows
    const activeWorkflows = await this.workflowTemplate.getAllActiveWorkflows();
    status.workflows = activeWorkflows.map(w => ({
      postId: w.postId,
      topic: w.state.topic,
      currentPhase: w.state.current_phase,
      nextAgent: w.state.next_agent,
      status: w.state.status
    }));
    
    // Generate summary
    status.summary = {
      totalAgents: Object.keys(this.agents).length,
      activeWorkflows: status.workflows.length,
      workflowsByPhase: status.workflows.reduce((acc, w) => {
        acc[w.currentPhase] = (acc[w.currentPhase] || 0) + 1;
        return acc;
      }, {})
    };
    
    return status;
  }

  /**
   * Initialize a new blog workflow
   * @param {string} topic - Blog topic
   * @param {object} metadata - Additional metadata
   */
  async initializeWorkflow(topic, metadata = {}) {
    console.log(`🚀 Initializing new workflow for: ${topic}`);
    
    return await this.agentRouter.createNewWorkflow(topic, metadata);
  }
}

module.exports = AgentRunner; 