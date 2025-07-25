import React from 'react'
import Link from 'next/link'

export function BlogStatusTable({ posts }: { posts: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border-b">Title</th>
            <th className="p-2 border-b">Phase</th>
            <th className="p-2 border-b">Status</th>
            <th className="p-2 border-b">Preview</th>
            <th className="p-2 border-b">Live</th>
            <th className="p-2 border-b">Updated</th>
            <th className="p-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.post_id} className="hover:bg-gray-50">
              <td className="p-2 border-b font-medium">{post.title}</td>
              <td className="p-2 border-b">
                <span className="rounded bg-blue-100 text-blue-800 px-2 py-1 text-xs">
                  {post.current_phase}
                </span>
              </td>
              <td className="p-2 border-b text-gray-700">{post.status}</td>
              <td className="p-2 border-b">
                {post.preview_url ? (
                  <Link
                    href={post.preview_url}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                  >
                    Preview
                  </Link>
                ) : (
                  <span className="text-gray-400 italic">—</span>
                )}
              </td>
              <td className="p-2 border-b">
                {post.final_url ? (
                  <Link
                    href={post.final_url}
                    className="text-green-600 hover:underline"
                    target="_blank"
                  >
                    Live
                  </Link>
                ) : (
                  <span className="text-gray-400 italic">—</span>
                )}
              </td>
              <td className="p-2 border-b text-gray-500">
                {new Date(post.last_updated).toLocaleString()}
              </td>
              <td className="p-2 border-b">
                {/* Optional action buttons */}
                <Link
                  href={`/posts/${post.post_id}`}
                  className="text-indigo-600 hover:underline text-sm"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
