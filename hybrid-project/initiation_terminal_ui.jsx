// components/InitiationTerminal.tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useBlogWorkflowPosts } from '@/hooks/useBlogWorkflowPosts'
import { supabase } from '@/lib/supabaseClient'

export default function InitiationTerminal() {
  const [starting, setStarting] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const { posts } = useBlogWorkflowPosts()

  const handleStart = async () => {
    setStarting(true)
    setStatus('Starting SEO Agent...')

    // Simulate trigger (e.g., n8n or Slack-triggered Cursor agent)
    const { error } = await supabase.from('blog_workflow_state').insert([
      {
        title: 'Untitled Blog',
        current_phase: 'seo',
        status: 'initiated',
        metadata: {},
      },
    ])

    if (error) {
      setStatus(`Error: ${error.message}`)
    } else {
      setStatus('SEO Agent triggered.')
    }

    setStarting(false)
  }

  return (
    <div className="p-4 border rounded-md bg-white shadow-md">
      <h2 className="text-lg font-bold mb-2">Initiation Terminal</h2>
      <Button onClick={handleStart} disabled={starting}>
        {starting ? 'Starting...' : 'Start New Blog Workflow'}
      </Button>
      {status && <p className="mt-2 text-sm text-gray-600">{status}</p>}
    </div>
  )
}
