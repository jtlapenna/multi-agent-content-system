const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8788;

app.use(cors());
app.use(express.json());

// Serve static files from frontend/dist
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Approval Hub API is running (dev server)',
    timestamp: new Date().toISOString(),
    endpoints: {
      'GET /api/health': 'Health check',
      'GET /api/posts': 'List pending posts',
      'GET /api/posts/:id': 'Get post details',
      'POST /api/posts/:id/approve': 'Approve post',
      'POST /api/posts/:id/reject': 'Reject post'
    }
  });
});

// List posts endpoint
app.get('/api/posts', (req, res) => {
  const mockPosts = [
    {
      name: 'test-post-1.md',
      path: 'src/content/blog/test-post-1.md',
      sha: 'abc123',
      url: 'https://github.com/jtlapenna/bright-gift/blob/preview/src/content/blog/test-post-1.md'
    },
    {
      name: 'test-post-2.md',
      path: 'src/content/blog/test-post-2.md',
      sha: 'def456',
      url: 'https://github.com/jtlapenna/bright-gift/blob/preview/src/content/blog/test-post-2.md'
    },
    {
      name: 'coffee-lover-gifts-2025.md',
      path: 'src/content/blog/coffee-lover-gifts-2025.md',
      sha: 'ghi789',
      url: 'https://github.com/jtlapenna/bright-gift/blob/preview/src/content/blog/coffee-lover-gifts-2025.md'
    }
  ];

  res.json(mockPosts);
});

// Get post details endpoint
app.get('/api/posts/:id', (req, res) => {
  const postId = req.params.id;

  const mockPost = {
    id: postId,
    name: `${postId}.md`,
    path: `src/content/blog/${postId}.md`,
    sha: 'abc123def456',
    url: `https://github.com/jtlapenna/bright-gift/blob/preview/src/content/blog/${postId}.md`,
    content: {
      title: postId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: `This is a test post: ${postId}`,
      date: new Date().toISOString(),
      tags: ['test', 'sample'],
      image: '/images/test-image.jpg',
      body: `# ${postId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}\n\nThis is the content of ${postId}. It contains sample text for testing purposes.\n\n## Features\n\n- Feature 1\n- Feature 2\n- Feature 3\n\n## Conclusion\n\nThis is a test post that demonstrates the approval hub functionality.`
    },
    meta: {
      size: 1024,
      encoding: 'base64',
      lastModified: new Date().toISOString()
    }
  };

  res.json(mockPost);
});

// Approve post endpoint
app.post('/api/posts/:id/approve', (req, res) => {
  const postId = req.params.id;
  const { name = 'Admin', email = 'admin@brightgift.com', notes = '' } = req.body;

  const result = {
    success: true,
    message: 'Post approved successfully (dev server)',
    pullRequest: {
      url: `https://github.com/jtlapenna/bright-gift/pull/123`,
      number: 123,
      title: `Approve: ${postId}`
    },
    approval: {
      postId,
      approver: { name, email },
      notes,
      approvedAt: new Date().toISOString(),
      pullRequestUrl: `https://github.com/jtlapenna/bright-gift/pull/123`,
      pullRequestNumber: 123
    }
  };

  res.json(result);
});

// Reject post endpoint
app.post('/api/posts/:id/reject', (req, res) => {
  const postId = req.params.id;
  const { reason = 'No reason provided', rejectorInfo = { name: 'Admin', email: 'admin@brightgift.com' } } = req.body;

  const result = {
    success: true,
    message: 'Post rejected successfully (dev server)',
    rejection: {
      postId,
      rejector: rejectorInfo,
      reason,
      rejectedAt: new Date().toISOString(),
      originalPath: `src/content/blog/${postId}.md`,
      originalSha: 'abc123def456'
    }
  };

  res.json(result);
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Approval Hub dev server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 API docs: http://localhost:${PORT}/api/health`);
}); 