export async function onRequestPost(context) {
  const { params } = context;
  const postId = params.id;

  try {
    const body = await context.request.json();
    const { reason = 'No reason provided', rejectorInfo = { name: 'Admin', email: 'admin@brightgift.com' } } = body;

    // Mock rejection response for testing
    const result = {
      success: true,
      message: 'Post rejected successfully (mock)',
      rejection: {
        postId,
        rejector: rejectorInfo,
        reason,
        rejectedAt: new Date().toISOString(),
        originalPath: `src/content/blog/${postId}.md`,
        originalSha: 'abc123def456'
      }
    };

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 