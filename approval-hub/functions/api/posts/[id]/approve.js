export async function onRequestPost(context) {
  const { params } = context;
  const postId = params.id;

  try {
    const body = await context.request.json();
    const { name = 'Admin', email = 'admin@brightgift.com', notes = '' } = body;

    // Mock approval response for testing
    const result = {
      success: true,
      message: 'Post approved successfully (mock)',
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