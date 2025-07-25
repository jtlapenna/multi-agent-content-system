// hooks/useBlogWorkflowPosts.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export function useBlogWorkflowPosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('blog_workflow_state')
        .select('*')
        .order('last_updated', { ascending: false })

      if (error) {
        setError(error.message)
        setPosts([])
      } else {
        setPosts(data || [])
      }

      setLoading(false)
    }

    fetchPosts()
  }, [])

  return { posts, loading, error }
}
