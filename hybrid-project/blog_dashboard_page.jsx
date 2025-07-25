import { BlogStatusTable } from '@/components/BlogStatusTable'
import { useBlogWorkflowPosts } from '@/hooks/useBlogWorkflowPosts'

export default function BlogDashboardPage() {
  const { posts, loading, error } = useBlogWorkflowPosts()

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Blog Workflow Dashboard</h1>

      {/* Dashboard Overview */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow p-4">Total Blogs: {posts.length}</div>
          <div className="bg-white rounded-xl shadow p-4">In Preview: {posts.filter(p => p.current_phase === 'preview').length}</div>
          <div className="bg-white rounded-xl shadow p-4">Approved (Waiting Live): {posts.filter(p => p.status === 'approved').length}</div>
        </div>
      </section>

      {/* Blog Table */}
      <section>
        <h2 className="text-xl font-semibold mt-8 mb-2">Blog Posts</h2>
        {loading && <p className="text-gray-500">Loading blog posts...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {!loading && posts.length === 0 && (
          <p className="text-gray-400 italic">No blog posts found.</p>
        )}

        {!loading && posts.length > 0 && <BlogStatusTable posts={posts} />}
      </section>

      {/* Holding Areas */}
      <section>
        <h2 className="text-xl font-semibold mt-8 mb-2">Holding Areas</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Preview links awaiting approval</li>
          <li>Rejected blog drafts</li>
          <li>Approved blogs ready for publishing</li>
        </ul>
      </section>

      {/* Keyword/SEO Bank */}
      <section>
        <h2 className="text-xl font-semibold mt-8 mb-2">Keyword Bank</h2>
        <p className="text-sm text-gray-500">(Coming Soon) A centralized list of top-performing keywords and SEO opportunities</p>
      </section>

      {/* Analytics */}
      <section>
        <h2 className="text-xl font-semibold mt-8 mb-2">Published Blog Directory & Analytics</h2>
        <p className="text-sm text-gray-500">(Coming Soon) View published blog performance at-a-glance</p>
      </section>
    </div>
  )
}
