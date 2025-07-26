/**
 * Supabase State Sync Utility
 * Handles real-time synchronization of workflow state to Supabase
 */

class SupabaseSync {
  constructor() {
    this.supabaseUrl = process.env.SUPABASE_URL;
    this.supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  }

  /**
   * Update workflow state in Supabase
   * @param {string} postId - Blog post identifier
   * @param {object} updates - State updates to apply
   */
  async updateWorkflowState(postId, updates) {
    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/blog_workflow_state`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.supabaseKey}`,
          'apikey': this.supabaseKey
        },
        body: JSON.stringify({
          post_id: postId,
          ...updates,
          last_updated: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Supabase update failed: ${response.statusText}`);
      }

      console.log(`✅ Supabase state updated for ${postId}`);
      return await response.json();
    } catch (error) {
      console.error(`❌ Supabase sync error for ${postId}:`, error);
      throw error;
    }
  }

  /**
   * Insert new workflow state
   * @param {string} postId - Blog post identifier
   * @param {object} state - Initial state
   */
  async insertWorkflowState(postId, state) {
    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/blog_workflow_state`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.supabaseKey}`,
          'apikey': this.supabaseKey
        },
        body: JSON.stringify({
          post_id: postId,
          ...state,
          last_updated: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Supabase insert failed: ${response.statusText}`);
      }

      console.log(`✅ New workflow state inserted for ${postId}`);
      return await response.json();
    } catch (error) {
      console.error(`❌ Supabase insert error for ${postId}:`, error);
      throw error;
    }
  }

  /**
   * Get current workflow state
   * @param {string} postId - Blog post identifier
   */
  async getWorkflowState(postId) {
    try {
      const response = await fetch(
        `${this.supabaseUrl}/rest/v1/blog_workflow_state?post_id=eq.${postId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.supabaseKey}`,
            'apikey': this.supabaseKey
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Supabase fetch failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data[0] || null;
    } catch (error) {
      console.error(`❌ Supabase fetch error for ${postId}:`, error);
      throw error;
    }
  }
}

module.exports = SupabaseSync; 