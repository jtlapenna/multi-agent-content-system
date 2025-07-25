/**
 * Main Express Server
 * Serves agent API endpoints for n8n integration
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Import API routes
const agentRoutes = require('./api/agents');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'multi-agent-content-system'
  });
});

// API routes
app.use('/api/agents', agentRoutes);

// Webhook endpoints for n8n
app.post('/webhook/agent-trigger', (req, res) => {
  console.log('🤖 Agent trigger webhook received:', req.body);
  
  // Forward to appropriate agent endpoint
  const { agent_name, post_id, topic, current_phase } = req.body;
  
  if (!agent_name || !post_id) {
    return res.status(400).json({
      success: false,
      error: 'agent_name and post_id are required'
    });
  }
  
  // This would typically forward to the appropriate agent endpoint
  // For now, just acknowledge receipt
  res.json({
    success: true,
    message: 'Agent trigger received',
    agent: agent_name,
    postId: post_id
  });
});

app.post('/webhook/state-sync', (req, res) => {
  console.log('📊 State sync webhook received:', req.body);
  
  // This would sync state with Supabase
  res.json({
    success: true,
    message: 'State sync received'
  });
});

app.post('/webhook/error-handler', (req, res) => {
  console.log('🚨 Error handler webhook received:', req.body);
  
  // This would handle errors and send notifications
  res.json({
    success: true,
    message: 'Error handled'
  });
});

// Serve static files (if any)
app.use(express.static(path.join(__dirname, 'public')));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: error.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Multi-Agent Content System Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 Agent API: http://localhost:${PORT}/api/agents`);
  console.log(`🔗 Webhooks:`);
  console.log(`   - Agent Trigger: http://localhost:${PORT}/webhook/agent-trigger`);
  console.log(`   - State Sync: http://localhost:${PORT}/webhook/state-sync`);
  console.log(`   - Error Handler: http://localhost:${PORT}/webhook/error-handler`);
});

module.exports = app; 