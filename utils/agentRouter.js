/**
 * Agent Router Utility
 * Helps agents find and manage their work based on workflow state files
 */

const WorkflowStateTemplate = require('./workflowStateTemplate');
const { execSync } = require('child_process');
const path = require('path');

class AgentRouter {
  constructor() {
    this.workflowTemplate = new WorkflowStateTemplate();
  }

  /**
   * Find the next blog post for a specific agent
   * @param {string} agentName - Agent name (e.g., 'SEOAgent', 'BlogAgent')
   * @param {string} expectedPhase - Expected current phase
   */
  async findNextWork(agentName, expectedPhase) {
    console.log(`🔍 ${agentName} looking for work...`);
    console.log(`   Expected phase: ${expectedPhase}`);
    
    const blogs = await this.workflowTemplate.findBlogsForAgent(agentName, expectedPhase);
    
    if (blogs.length === 0) {
      console.log(`❌ No work found for ${agentName} (phase: ${expectedPhase})`);
      return null;
    }
    
    // Sort by creation date (oldest first)
    blogs.sort((a, b) => new Date(a.state.created_at) - new Date(b.state.created_at));
    
    const nextWork = blogs[0];
    console.log(`✅ Found work: ${nextWork.postId}`);
    console.log(`   Topic: ${nextWork.state.topic}`);
    console.log(`   Current phase: ${nextWork.state.current_phase}`);
    
    return nextWork;
  }

  /**
   * Complete agent work and hand off to next agent
   * @param {string} postId - Post identifier
   * @param {string} agentName - Current agent name
   * @param {string} nextAgent - Next agent name
   * @param {string} nextPhase - Next phase
   * @param {object} outputs - Agent outputs
   */
  async completeWork(postId, agentName, nextAgent, nextPhase, outputs = {}) {
    console.log(`🏁 ${agentName} completing work for ${postId}`);
    
    // Update workflow state
    const updates = {
      current_phase: nextPhase,
      next_agent: nextAgent,
      agents_run: [...(await this.workflowTemplate.loadWorkflowState(postId)).agents_run, agentName],
      agent_outputs: {
        ...(await this.workflowTemplate.loadWorkflowState(postId)).agent_outputs,
        [agentName]: outputs
      }
    };
    
    const updatedState = await this.workflowTemplate.updateWorkflowState(postId, updates);
    
    console.log(`✅ Work completed for ${postId}`);
    console.log(`   Next agent: ${nextAgent}`);
    console.log(`   Next phase: ${nextPhase}`);
    
    // Trigger next agent via n8n webhook
    await this.triggerNextAgent(nextAgent, postId, updatedState);
    
    return updatedState;
  }

  /**
   * Trigger the next agent via n8n webhook
   * @param {string} agentName - Agent to trigger
   * @param {string} postId - Post identifier
   * @param {object} state - Current workflow state
   */
  async triggerNextAgent(agentName, postId, state) {
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    
    if (!n8nWebhookUrl) {
      console.log(`⚠️ N8N_WEBHOOK_URL not set, skipping agent trigger`);
      return;
    }
    
    try {
      const payload = {
        agent_name: agentName,
        post_id: postId,
        blog_slug: postId,
        topic: state.topic,
        current_phase: state.current_phase,
        timestamp: new Date().toISOString()
      };
      
      // Send webhook to n8n
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        console.log(`✅ Triggered ${agentName} via n8n webhook`);
      } else {
        console.log(`⚠️ Failed to trigger ${agentName}: ${response.status}`);
      }
    } catch (error) {
      console.log(`⚠️ Error triggering ${agentName}: ${error.message}`);
    }
  }

  /**
   * Create a new blog workflow
   * @param {string} topic - Blog topic
   * @param {object} metadata - Additional metadata
   */
  async createNewWorkflow(topic, metadata = {}) {
    const postId = this.generatePostId(topic);
    
    console.log(`🚀 Creating new workflow for: ${topic}`);
    console.log(`   Post ID: ${postId}`);
    
    // Create workflow state
    const state = this.workflowTemplate.createWorkflowState(postId, topic, metadata);
    
    // Create directory structure
    await this.workflowTemplate.createBlogStructure(postId);
    
    // Save workflow state
    await this.workflowTemplate.saveWorkflowState(postId, state);
    
    console.log(`✅ New workflow created: ${postId}`);
    
    // Trigger first agent
    await this.triggerNextAgent('SEOAgent', postId, state);
    
    return { postId, state };
  }

  /**
   * Generate a unique post ID from topic
   * @param {string} topic - Blog topic
   */
  generatePostId(topic) {
    const date = new Date().toISOString().split('T')[0];
    const slug = topic
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    return `${date}-${slug}`;
  }

  /**
   * Get status of all active workflows
   */
  async getWorkflowStatus() {
    const workflows = await this.workflowTemplate.getAllActiveWorkflows();
    
    console.log(`📊 Active Workflows: ${workflows.length}`);
    
    workflows.forEach(workflow => {
      console.log(`   ${workflow.postId}:`);
      console.log(`     Topic: ${workflow.state.topic}`);
      console.log(`     Phase: ${workflow.state.current_phase}`);
      console.log(`     Next Agent: ${workflow.state.next_agent}`);
      console.log(`     Status: ${workflow.state.status}`);
    });
    
    return workflows;
  }

  /**
   * Commit and push workflow changes
   * @param {string} postId - Post identifier
   * @param {string} message - Commit message
   */
  async commitChanges(postId, message) {
    try {
      // Add all changes
      execSync('git add .', { stdio: 'inherit' });
      
      // Commit changes
      execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
      
      // Push to remote
      execSync('git push origin main', { stdio: 'inherit' });
      
      console.log(`✅ Changes committed and pushed for ${postId}`);
    } catch (error) {
      console.error(`❌ Error committing changes: ${error.message}`);
    }
  }
}

module.exports = AgentRouter; 