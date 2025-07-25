-- Updated Multi-Agent Content Automation System Database Schema

-- Drop existing table if it exists (for updates)
DROP TABLE IF EXISTS blog_workflow_state CASCADE;

-- Create the blog workflow state table with all required columns
CREATE TABLE blog_workflow_state (
  post_id TEXT PRIMARY KEY,
  title TEXT,
  current_phase TEXT,
  next_agent TEXT,
  status TEXT DEFAULT 'in_progress',
  preview_url TEXT,
  final_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  agents_run JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}'
);

-- Create indexes for better performance
CREATE INDEX idx_blog_workflow_state_current_phase ON blog_workflow_state(current_phase);
CREATE INDEX idx_blog_workflow_state_next_agent ON blog_workflow_state(next_agent);
CREATE INDEX idx_blog_workflow_state_status ON blog_workflow_state(status);
CREATE INDEX idx_blog_workflow_state_last_updated ON blog_workflow_state(last_updated);
CREATE INDEX idx_blog_workflow_state_created_at ON blog_workflow_state(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE blog_workflow_state ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Users can view blog workflow state" ON blog_workflow_state
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert blog workflow state" ON blog_workflow_state
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update blog workflow state" ON blog_workflow_state
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create a function to automatically update last_updated timestamp
CREATE OR REPLACE FUNCTION update_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update last_updated
CREATE TRIGGER update_blog_workflow_state_last_updated
  BEFORE UPDATE ON blog_workflow_state
  FOR EACH ROW
  EXECUTE FUNCTION update_last_updated_column();

-- Create agent_results table
CREATE TABLE agent_results (
  id SERIAL PRIMARY KEY,
  post_id TEXT REFERENCES blog_workflow_state(post_id),
  agent_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  output JSONB DEFAULT '{}',
  errors JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}'
);

-- Create indexes for agent_results
CREATE INDEX idx_agent_results_post_id ON agent_results(post_id);
CREATE INDEX idx_agent_results_agent_name ON agent_results(agent_name);
CREATE INDEX idx_agent_results_status ON agent_results(status);

-- Enable RLS for agent_results
ALTER TABLE agent_results ENABLE ROW LEVEL SECURITY;

-- Create policies for agent_results
CREATE POLICY "Users can view agent results" ON agent_results
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert agent results" ON agent_results
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update agent results" ON agent_results
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert sample data for testing
INSERT INTO blog_workflow_state (
  post_id,
  title,
  current_phase,
  next_agent,
  status,
  preview_url,
  agents_run,
  metadata
) VALUES (
  '2025-01-XX-sample-blog-post',
  'Sample Blog Post Title',
  'SEO_COMPLETE',
  'BlogAgent',
  'in_progress',
  'https://preview.example.com/sample-blog-post',
  '["SEOAgent"]',
  '{
    "primary_keyword": "sample keyword",
    "secondary_keywords": ["keyword1", "keyword2"],
    "content_type": "gift-guide",
    "estimated_word_count": 1500,
    "target_audience": "gift shoppers",
    "seo_score": 85,
    "competition_level": "medium",
    "search_volume": "high"
  }'
);

-- Create a view for dashboard queries
CREATE OR REPLACE VIEW blog_workflow_dashboard AS
SELECT 
  post_id,
  title,
  current_phase,
  next_agent,
  status,
  preview_url,
  final_url,
  created_at,
  last_updated,
  agents_run,
  metadata->>'primary_keyword' as primary_keyword,
  metadata->>'content_type' as content_type,
  metadata->>'estimated_word_count' as estimated_word_count,
  metadata->>'seo_score' as seo_score
FROM blog_workflow_state
ORDER BY last_updated DESC;

-- Grant permissions
GRANT ALL ON blog_workflow_state TO authenticated;
GRANT ALL ON agent_results TO authenticated;
GRANT ALL ON blog_workflow_dashboard TO authenticated; 