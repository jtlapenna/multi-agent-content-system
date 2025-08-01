-- Final Multi-Agent Content Automation System Database Schema Update

-- Add missing 'topic' column to blog_workflow_state
ALTER TABLE blog_workflow_state ADD COLUMN IF NOT EXISTS topic TEXT;

-- Add missing 'updated_at' column to blog_workflow_state
ALTER TABLE blog_workflow_state ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing rows to have updated_at value
UPDATE blog_workflow_state SET updated_at = last_updated WHERE updated_at IS NULL;

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  post_id TEXT REFERENCES blog_workflow_state(post_id),
  title TEXT NOT NULL,
  content TEXT,
  slug TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'draft',
  seo_score INTEGER,
  word_count INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for blog_posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_post_id ON blog_posts(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);

-- Enable RLS for blog_posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for blog_posts (ignore errors if they already exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blog_posts' AND policyname = 'Users can view blog posts') THEN
        CREATE POLICY "Users can view blog posts" ON blog_posts
          FOR SELECT USING (auth.role() = 'authenticated');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blog_posts' AND policyname = 'Users can insert blog posts') THEN
        CREATE POLICY "Users can insert blog posts" ON blog_posts
          FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blog_posts' AND policyname = 'Users can update blog posts') THEN
        CREATE POLICY "Users can update blog posts" ON blog_posts
          FOR UPDATE USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Grant permissions
GRANT ALL ON blog_posts TO authenticated; 