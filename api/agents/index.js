/**
 * Agent API Endpoints
 * Handles agent triggering from n8n workflows
 */

const express = require('express');
const AgentRunner = require('../../agents/agentRunner');

const router = express.Router();
const agentRunner = new AgentRunner();

/**
 * POST /api/agents/seo
 * Trigger SEO Agent
 */
router.post('/seo', async (req, res) => {
  try {
    const { postId, topic, currentPhase } = req.body;
    
    if (!postId) {
      return res.status(400).json({
        success: false,
        error: 'postId is required'
      });
    }
    
    console.log(`🤖 Triggering SEO Agent for ${postId}`);
    
    const result = await agentRunner.runAgent('SEOAgent', postId);
    
    res.json({
      success: result.success,
      postId,
      agent: 'SEOAgent',
      result: result.success ? 'completed' : 'failed',
      error: result.error
    });
    
  } catch (error) {
    console.error('SEO Agent API error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/agents/blog
 * Trigger Blog Agent
 */
router.post('/blog', async (req, res) => {
  try {
    const { postId, topic, currentPhase } = req.body;
    
    if (!postId) {
      return res.status(400).json({
        success: false,
        error: 'postId is required'
      });
    }
    
    console.log(`🤖 Triggering Blog Agent for ${postId}`);
    
    const result = await agentRunner.runAgent('BlogAgent', postId);
    
    res.json({
      success: result.success,
      postId,
      agent: 'BlogAgent',
      result: result.success ? 'completed' : 'failed',
      error: result.error
    });
    
  } catch (error) {
    console.error('Blog Agent API error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/agents/review
 * Trigger Review Agent
 */
router.post('/review', async (req, res) => {
  try {
    const { postId, topic, currentPhase } = req.body;
    
    if (!postId) {
      return res.status(400).json({
        success: false,
        error: 'postId is required'
      });
    }
    
    console.log(`🤖 Triggering Review Agent for ${postId}`);
    
    const result = await agentRunner.runAgent('ReviewAgent', postId);
    
    res.json({
      success: result.success,
      postId,
      agent: 'ReviewAgent',
      result: result.success ? 'completed' : 'failed',
      error: result.error
    });
    
  } catch (error) {
    console.error('Review Agent API error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/agents/image
 * Trigger Image Agent
 */
router.post('/image', async (req, res) => {
  try {
    const { postId, topic, currentPhase } = req.body;
    
    if (!postId) {
      return res.status(400).json({
        success: false,
        error: 'postId is required'
      });
    }
    
    console.log(`🤖 Triggering Image Agent for ${postId}`);
    
    const result = await agentRunner.runAgent('ImageAgent', postId);
    
    res.json({
      success: result.success,
      postId,
      agent: 'ImageAgent',
      result: result.success ? 'completed' : 'failed',
      error: result.error
    });
    
  } catch (error) {
    console.error('Image Agent API error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/agents/publishing
 * Trigger Publishing Agent
 */
router.post('/publishing', async (req, res) => {
  try {
    const { postId, topic, currentPhase } = req.body;
    
    if (!postId) {
      return res.status(400).json({
        success: false,
        error: 'postId is required'
      });
    }
    
    console.log(`🤖 Triggering Publishing Agent for ${postId}`);
    
    const result = await agentRunner.runAgent('PublishingAgent', postId);
    
    res.json({
      success: result.success,
      postId,
      agent: 'PublishingAgent',
      result: result.success ? 'completed' : 'failed',
      error: result.error
    });
    
  } catch (error) {
    console.error('Publishing Agent API error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/agents/complete-workflow
 * Run complete workflow for a topic
 */
router.post('/complete-workflow', async (req, res) => {
  try {
    const { topic, metadata = {} } = req.body;
    
    if (!topic) {
      return res.status(400).json({
        success: false,
        error: 'topic is required'
      });
    }
    
    console.log(`🚀 Starting complete workflow for topic: ${topic}`);
    
    const workflow = await agentRunner.createWorkflow(topic, metadata);
    const result = await agentRunner.runCompleteWorkflow(workflow.postId, topic);
    
    res.json({
      success: result.success,
      postId: workflow.postId,
      topic,
      result: result.success ? 'completed' : 'failed',
      error: result.error
    });
    
  } catch (error) {
    console.error('Complete Workflow API error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/agents/status/:postId
 * Get workflow status for a post
 */
router.get('/status/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    
    const status = await agentRunner.getWorkflowStatus(postId);
    
    res.json({
      success: true,
      status
    });
    
  } catch (error) {
    console.error('Status API error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/agents/status
 * Get all workflow statuses
 */
router.get('/status', async (req, res) => {
  try {
    const statuses = await agentRunner.getAllWorkflowStatuses();
    
    res.json({
      success: true,
      statuses
    });
    
  } catch (error) {
    console.error('Statuses API error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router; 