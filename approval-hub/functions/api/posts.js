export async function onRequestGet() {
  // Mock data for testing - replace with GitHub API call later
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
    }
  ];

  return new Response(JSON.stringify(mockPosts), {
    headers: { 'Content-Type': 'application/json' }
  });
} 