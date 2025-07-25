/**
 * Supabase Client Utility for Multi-Agent Content Automation System
 * Handles database operations, state management, and real-time updates
 */

const { createClient } = require('@supabase/supabase-js');

class SupabaseClient {
  constructor() {
    this.client = null;
    this.initialized = false;
  }

  /**
   * Initialize Supabase client
   */
  async initialize() {
    if (this.initialized) return this.client;

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and Service Role Key are required');
    }

    try {
      this.client = createClient(supabaseUrl, supabaseKey);
      
      // Test connection
      const { data, error } = await this.client
        .from('blog_workflow_state')
        .select('count')
        .limit(1);

      if (error) {
        throw error;
      }

      this.initialized = true;
      console.log('✅ Supabase client initialized successfully');
      return this.client;
    } catch (error) {
      console.error('❌ Failed to initialize Supabase client:', error.message);
      throw error;
    }
  }

  /**
   * Create a new blog workflow state
   * @param {object} workflowData - Initial workflow data
   */
  async createWorkflowState(workflowData) {
    await this.initialize();

    const { data, error } = await this.client
      .from('blog_workflow_state')
      .insert([{
        post_id: workflowData.postId,
        topic: workflowData.topic,
        status: 'initialized',
        current_phase: 'seo_research',
        metadata: workflowData.metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      throw error;
    }

    return data[0];
  }

  /**
   * Update workflow state
   * @param {string} postId - Blog post ID
   * @param {object} updates - State updates
   */
  async updateWorkflowState(postId, updates) {
    await this.initialize();

    const { data, error } = await this.client
      .from('blog_workflow_state')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('post_id', postId)
      .select();

    if (error) {
      throw error;
    }

    return data[0];
  }

  /**
   * Get workflow state by post ID
   * @param {string} postId - Blog post ID
   */
  async getWorkflowState(postId) {
    await this.initialize();

    const { data, error } = await this.client
      .from('blog_workflow_state')
      .select('*')
      .eq('post_id', postId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Get all workflow states
   * @param {object} filters - Optional filters
   */
  async getAllWorkflowStates(filters = {}) {
    await this.initialize();

    let query = this.client
      .from('blog_workflow_state')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.current_phase) {
      query = query.eq('current_phase', filters.current_phase);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Store agent results
   * @param {string} postId - Blog post ID
   * @param {string} agentName - Agent name
   * @param {object} results - Agent results
   */
  async storeAgentResults(postId, agentName, results) {
    await this.initialize();

    const { data, error } = await this.client
      .from('agent_results')
      .insert([{
        post_id: postId,
        agent_name: agentName,
        results: results,
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      throw error;
    }

    return data[0];
  }

  /**
   * Get agent results
   * @param {string} postId - Blog post ID
   * @param {string} agentName - Optional agent name filter
   */
  async getAgentResults(postId, agentName = null) {
    await this.initialize();

    let query = this.client
      .from('agent_results')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (agentName) {
      query = query.eq('agent_name', agentName);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Subscribe to real-time updates
   * @param {string} table - Table name
   * @param {function} callback - Callback function
   */
  subscribeToUpdates(table, callback) {
    if (!this.client) {
      throw new Error('Supabase client not initialized');
    }

    return this.client
      .channel('public:' + table)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: table
      }, callback)
      .subscribe();
  }

  /**
   * Create blog post record
   * @param {object} postData - Blog post data
   */
  async createBlogPost(postData) {
    await this.initialize();

    const { data, error } = await this.client
      .from('blog_posts')
      .insert([{
        title: postData.title,
        slug: postData.slug,
        content: postData.content,
        status: postData.status || 'draft',
        metadata: postData.metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      throw error;
    }

    return data[0];
  }

  /**
   * Update blog post
   * @param {string} postId - Blog post ID
   * @param {object} updates - Post updates
   */
  async updateBlogPost(postId, updates) {
    await this.initialize();

    const { data, error } = await this.client
      .from('blog_posts')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)
      .select();

    if (error) {
      throw error;
    }

    return data[0];
  }

  /**
   * Get blog post by ID
   * @param {string} postId - Blog post ID
   */
  async getBlogPost(postId) {
    await this.initialize();

    const { data, error } = await this.client
      .from('blog_posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Get all blog posts
   * @param {object} filters - Optional filters
   */
  async getAllBlogPosts(filters = {}) {
    await this.initialize();

    let query = this.client
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data;
  }
}

// Create singleton instance
const supabaseClient = new SupabaseClient();

module.exports = supabaseClient;
