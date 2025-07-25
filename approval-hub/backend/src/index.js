const express = require('express');
const cors = require('cors');

console.log('Starting server...');

const app = express();
const PORT = process.env.PORT || 4000;

console.log('Port set to:', PORT);

app.use(cors());
app.use(express.json());

// Import routes
console.log('Loading routes...');
const postsRouter = require('./routes/posts');
const approvalsRouter = require('./routes/approvals');
console.log('Routes loaded successfully');

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({ status: 'ok', message: 'Approval Hub backend is running.' });
});

// API routes
console.log('Registering API routes...');
app.use('/api/posts', postsRouter);
app.use('/api/approvals', approvalsRouter);
console.log('API routes registered');

console.log('About to start listening...');

app.listen(PORT, () => {
  console.log(`Approval Hub backend listening on port ${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET  /api/health');
  console.log('  GET  /api/posts');
  console.log('  GET  /api/posts/:id');
  console.log('  POST /api/posts/:id/approve');
  console.log('  POST /api/posts/:id/reject');
  console.log('  GET  /api/approvals');
  console.log('  GET  /api/approvals/stats');
}).on('error', (err) => {
  console.error('Server error:', err);
}); 