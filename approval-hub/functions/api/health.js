export async function onRequestGet() {
  return new Response(JSON.stringify({
    status: 'ok',
    message: 'Approval Hub API is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      'GET /api/health': 'Health check',
      'GET /api/posts': 'List pending posts',
      'GET /api/posts/:id': 'Get post details',
      'POST /api/posts/:id/approve': 'Approve post',
      'POST /api/posts/:id/reject': 'Reject post'
    }
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
} 