import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useBlogWorkflowPosts() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<null | string>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('blog_workflow_state')
        .select('*')
        .order('last_updated', { ascending: false })

      if (error) {
        setError(error.message)
      } else {
        setPosts(data || [])
      }
      setLoading(false)
    }

    fetchPosts()

    // Optional: Supabase Realtime subscription
    const channel = supabase
      .channel('blog_updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'blog_workflow_state' },
        () => fetchPosts()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { posts, loading, error }
}
