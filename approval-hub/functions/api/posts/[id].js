export async function onRequestGet(context) {
  const { params } = context;
  const postId = params.id;

  // Mock data for testing
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

  return new Response(JSON.stringify(mockPost), {
    headers: { 'Content-Type': 'application/json' }
  });
} 