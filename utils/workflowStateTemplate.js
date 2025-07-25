/**
 * Workflow State Template Utility
 * Provides templates and utilities for managing workflow state across agents
 */

const fs = require('fs').promises;
const path = require('path');

class WorkflowStateTemplate {
  constructor() {
    this.baseDir = path.join(process.cwd(), 'content', 'blog-posts');
  }

  /**
   * Create a new workflow state for a blog post
   * @param {string} postId - Unique post identifier
   * @param {string} topic - Blog topic
   * @param {object} metadata - Additional metadata
   */
  createWorkflowState(postId, topic, metadata = {}) {
    const now = new Date().toISOString();
    
    return {
      post_id: postId,
      title: metadata.title || `Blog Post: ${topic}`,
      topic: topic,
      current_phase: 'INITIALIZED',
      next_agent: 'SEOAgent',
      last_updated: now,
      created_at: now,
      updated_at: now,
      human_review_required: false,
      branch: `preview/${postId}`,
      preview_url: null,
      final_url: null,
      status: 'in_progress',
      agents_run: [],
      agent_outputs: {},
      metadata: {
        primary_keyword: metadata.primary_keyword || topic,
        secondary_keywords: metadata.secondary_keywords || [],
        content_type: metadata.content_type || 'blog-post',
        estimated_word_count: metadata.estimated_word_count || 1500,
        target_audience: metadata.target_audience || 'general',
        ...metadata
      }
    };
  }

  /**
   * Save workflow state to file
   * @param {string} postId - Post identifier
   * @param {object} state - Workflow state object
   */
  async saveWorkflowState(postId, state) {
    const postDir = path.join(this.baseDir, postId);
    const stateFile = path.join(postDir, 'workflow_state.json');
    
    // Ensure directory exists
    await fs.mkdir(postDir, { recursive: true });
    
    // Save state file
    await fs.writeFile(stateFile, JSON.stringify(state, null, 2));
    
    console.log(`✅ Workflow state saved: ${stateFile}`);
    return stateFile;
  }

  /**
   * Load workflow state from file
   * @param {string} postId - Post identifier
   */
  async loadWorkflowState(postId) {
    const stateFile = path.join(this.baseDir, postId, 'workflow_state.json');
    
    try {
      const data = await fs.readFile(stateFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Failed to load workflow state for ${postId}: ${error.message}`);
    }
  }

  /**
   * Update workflow state
   * @param {string} postId - Post identifier
   * @param {object} updates - State updates
   */
  async updateWorkflowState(postId, updates) {
    const state = await this.loadWorkflowState(postId);
    const updatedState = {
      ...state,
      ...updates,
      last_updated: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    await this.saveWorkflowState(postId, updatedState);
    return updatedState;
  }

  /**
   * Find blogs ready for a specific agent
   * @param {string} agentName - Agent name (e.g., 'SEOAgent', 'BlogAgent')
   * @param {string} expectedPhase - Expected current phase
   */
  async findBlogsForAgent(agentName, expectedPhase) {
    const blogs = [];
    
    try {
      const entries = await fs.readdir(this.baseDir);
      
      for (const entry of entries) {
        const stateFile = path.join(this.baseDir, entry, 'workflow_state.json');
        
        try {
          const data = await fs.readFile(stateFile, 'utf8');
          const state = JSON.parse(data);
          
          if (state.current_phase === expectedPhase && 
              state.next_agent === agentName && 
              state.status === 'in_progress') {
            blogs.push({
              postId: entry,
              state: state
            });
          }
        } catch (error) {
          // Skip files that can't be read
          continue;
        }
      }
    } catch (error) {
      console.error('Error scanning blog directories:', error.message);
    }
    
    return blogs;
  }

  /**
   * Get all active blog workflows
   */
  async getAllActiveWorkflows() {
    const workflows = [];
    
    try {
      const entries = await fs.readdir(this.baseDir);
      
      for (const entry of entries) {
        const stateFile = path.join(this.baseDir, entry, 'workflow_state.json');
        
        try {
          const data = await fs.readFile(stateFile, 'utf8');
          const state = JSON.parse(data);
          
          if (state.status === 'in_progress') {
            workflows.push({
              postId: entry,
              state: state
            });
          }
        } catch (error) {
          // Skip files that can't be read
          continue;
        }
      }
    } catch (error) {
      console.error('Error scanning blog directories:', error.message);
    }
    
    return workflows;
  }

  /**
   * Create blog post directory structure
   * @param {string} postId - Post identifier
   */
  async createBlogStructure(postId) {
    const postDir = path.join(this.baseDir, postId);
    const subdirs = ['images', 'logs'];
    
    // Create main directory
    await fs.mkdir(postDir, { recursive: true });
    
    // Create subdirectories
    for (const subdir of subdirs) {
      await fs.mkdir(path.join(postDir, subdir), { recursive: true });
    }
    
    console.log(`✅ Blog structure created: ${postDir}`);
    return postDir;
  }
}

module.exports = WorkflowStateTemplate; 