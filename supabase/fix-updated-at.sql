-- Fix: Add missing updated_at column to blog_workflow_state

ALTER TABLE blog_workflow_state ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing rows to have updated_at value
UPDATE blog_workflow_state SET updated_at = last_updated WHERE updated_at IS NULL; 