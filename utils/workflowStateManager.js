/**
 * Workflow State Manager for Multi-Agent Content Automation System
 * Handles state transitions from file-based to database-based management
 */

const fs = require('fs').promises;
const path = require('path');
const supabaseClient = require('./supabaseClient');

class WorkflowStateManager {
  constructor() {
    this.supabase = supabaseClient;
    this.workflowDir = './workflow';
    this.dataDir = './data';
  }

  /**
   * Initialize a new workflow state
   * @param {string} postId - Unique post identifier
   * @param {string} topic - Blog topic
   * @param {object} metadata - Additional metadata
   */
  async initializeWorkflow(postId, topic, metadata = {}) {
    try {
      // Create database record
      const workflowData = {
        postId,
        topic,
        metadata: {
          ...metadata,
          initialized_at: new Date().toISOString()
        }
      };

      const dbState = await this.supabase.createWorkflowState(workflowData);

      // Create local file for backward compatibility
      await this.createLocalStateFile(postId, {
        postId,
        topic,
        status: 'initialized',
        currentPhase: 'seo_research',
        metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log(`✅ Workflow initialized for post ${postId}`);
      return dbState;
    } catch (error) {
      console.error(`❌ Failed to initialize workflow for post ${postId}:`, error.message);
      throw error;
    }
  }

  /**
   * Update workflow state
   * @param {string} postId - Post identifier
   * @param {object} updates - State updates
   */
  async updateWorkflowState(postId, updates) {
    try {
      // Update database
      const dbState = await this.supabase.updateWorkflowState(postId, updates);

      // Update local file for backward compatibility
      await this.updateLocalStateFile(postId, updates);

      console.log(`✅ Workflow state updated for post ${postId}`);
      return dbState;
    } catch (error) {
      console.error(`❌ Failed to update workflow state for post ${postId}:`, error.message);
      throw error;
    }
  }

  /**
   * Get current workflow state
   * @param {string} postId - Post identifier
   */
  async getWorkflowState(postId) {
    try {
      // Try database first
      const dbState = await this.supabase.getWorkflowState(postId);
      return dbState;
    } catch (error) {
      console.warn(`⚠️ Database state not found for post ${postId}, trying local file`);
      
      // Fallback to local file
      try {
        const localState = await this.getLocalStateFile(postId);
        return localState;
      } catch (localError) {
        throw new Error(`No workflow state found for post ${postId}`);
      }
    }
  }

  /**
   * Transition to next phase
   * @param {string} postId - Post identifier
   * @param {string} nextPhase - Next workflow phase
   * @param {object} phaseData - Data for the next phase
   */
  async transitionToPhase(postId, nextPhase, phaseData = {}) {
    const phases = [
      'seo_research',
      'blog_ideas',
      'content_generation',
      'content_review',
      'image_generation',
      'social_media',
      'publishing',
      'completed'
    ];

    const currentIndex = phases.indexOf(nextPhase);
    if (currentIndex === -1) {
      throw new Error(`Invalid phase: ${nextPhase}`);
    }

    const updates = {
      current_phase: nextPhase,
      status: currentIndex === phases.length - 1 ? 'completed' : 'in_progress',
      phase_data: phaseData,
      phase_started_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return await this.updateWorkflowState(postId, updates);
  }

  /**
   * Store agent results
   * @param {string} postId - Post identifier
   * @param {string} agentName - Agent name
   * @param {object} results - Agent results
   */
  async storeAgentResults(postId, agentName, results) {
    try {
      // Store in database
      const dbResults = await this.supabase.storeAgentResults(postId, agentName, results);

      // Store in local file for backward compatibility
      await this.storeLocalAgentResults(postId, agentName, results);

      console.log(`✅ Agent results stored for ${agentName} on post ${postId}`);
      return dbResults;
    } catch (error) {
      console.error(`❌ Failed to store agent results for ${agentName}:`, error.message);
      throw error;
    }
  }

  /**
   * Get agent results
   * @param {string} postId - Post identifier
   * @param {string} agentName - Optional agent name filter
   */
  async getAgentResults(postId, agentName = null) {
    try {
      // Try database first
      const dbResults = await this.supabase.getAgentResults(postId, agentName);
      return dbResults;
    } catch (error) {
      console.warn(`⚠️ Database results not found for post ${postId}, trying local files`);
      
      // Fallback to local files
      try {
        const localResults = await this.getLocalAgentResults(postId, agentName);
        return localResults;
      } catch (localError) {
        throw new Error(`No agent results found for post ${postId}`);
      }
    }
  }

  /**
   * Create local state file (for backward compatibility)
   * @param {string} postId - Post identifier
   * @param {object} state - State data
   */
  async createLocalStateFile(postId, state) {
    const filePath = path.join(this.dataDir, 'workflow_templates', `${postId}_state.json`);
    
    try {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(state, null, 2));
    } catch (error) {
      console.warn(`⚠️ Failed to create local state file: ${error.message}`);
    }
  }

  /**
   * Update local state file (for backward compatibility)
   * @param {string} postId - Post identifier
   * @param {object} updates - State updates
   */
  async updateLocalStateFile(postId, updates) {
    const filePath = path.join(this.dataDir, 'workflow_templates', `${postId}_state.json`);
    
    try {
      const existingState = await this.getLocalStateFile(postId);
      const updatedState = { ...existingState, ...updates };
      await fs.writeFile(filePath, JSON.stringify(updatedState, null, 2));
    } catch (error) {
      console.warn(`⚠️ Failed to update local state file: ${error.message}`);
    }
  }

  /**
   * Get local state file (for backward compatibility)
   * @param {string} postId - Post identifier
   */
  async getLocalStateFile(postId) {
    const filePath = path.join(this.dataDir, 'workflow_templates', `${postId}_state.json`);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Local state file not found: ${filePath}`);
    }
  }

  /**
   * Store local agent results (for backward compatibility)
   * @param {string} postId - Post identifier
   * @param {string} agentName - Agent name
   * @param {object} results - Agent results
   */
  async storeLocalAgentResults(postId, agentName, results) {
    const filePath = path.join(this.workflowDir, `${agentName}_results`, `${postId}.json`);
    
    try {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(results, null, 2));
    } catch (error) {
      console.warn(`⚠️ Failed to store local agent results: ${error.message}`);
    }
  }

  /**
   * Get local agent results (for backward compatibility)
   * @param {string} postId - Post identifier
   * @param {string} agentName - Optional agent name filter
   */
  async getLocalAgentResults(postId, agentName = null) {
    const agents = agentName ? [agentName] : ['seo', 'blog', 'review', 'image', 'social', 'publishing'];
    const results = [];

    for (const agent of agents) {
      const filePath = path.join(this.workflowDir, `${agent}_results`, `${postId}.json`);
      
      try {
        const data = await fs.readFile(filePath, 'utf8');
        results.push({
          agent_name: agent,
          results: JSON.parse(data),
          created_at: new Date().toISOString()
        });
      } catch (error) {
        // File doesn't exist, skip
        continue;
      }
    }

    return results;
  }

  /**
   * Get all workflow states
   * @param {object} filters - Optional filters
   */
  async getAllWorkflowStates(filters = {}) {
    try {
      return await this.supabase.getAllWorkflowStates(filters);
    } catch (error) {
      console.warn(`⚠️ Failed to get workflow states from database: ${error.message}`);
      return [];
    }
  }

  /**
   * Subscribe to real-time updates
   * @param {function} callback - Callback function
   */
  subscribeToUpdates(callback) {
    return this.supabase.subscribeToUpdates('blog_workflow_state', callback);
  }

  /**
   * Migrate existing file-based states to database
   * @param {string} workflowDir - Directory containing existing workflow files
   */
  async migrateFileStates(workflowDir = './workflow') {
    try {
      const files = await fs.readdir(workflowDir);
      const stateFiles = files.filter(file => file.endsWith('_state.json'));

      console.log(`🔄 Found ${stateFiles.length} state files to migrate`);

      for (const file of stateFiles) {
        try {
          const filePath = path.join(workflowDir, file);
          const data = await fs.readFile(filePath, 'utf8');
          const state = JSON.parse(data);

          // Extract postId from filename
          const postId = file.replace('_state.json', '');

          // Create database record
          await this.supabase.createWorkflowState({
            postId,
            topic: state.topic,
            metadata: state.metadata || {}
          });

          console.log(`✅ Migrated state for post ${postId}`);
        } catch (error) {
          console.warn(`⚠️ Failed to migrate ${file}: ${error.message}`);
        }
      }

      console.log('✅ File state migration completed');
    } catch (error) {
      console.error('❌ Failed to migrate file states:', error.message);
      throw error;
    }
  }
}

// Create singleton instance
const workflowStateManager = new WorkflowStateManager();

module.exports = workflowStateManager;
