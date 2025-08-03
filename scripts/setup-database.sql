-- Database schema for PostgreSQL
-- Run this script to set up your database tables

CREATE TABLE IF NOT EXISTS captured_pages (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    category VARCHAR(20) CHECK (category IN ('job', 'business', 'other')),
    summary TEXT,
    insights TEXT,
    priority VARCHAR(10) CHECK (priority IN ('high', 'medium', 'low')),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_captured_pages_category ON captured_pages(category);
CREATE INDEX IF NOT EXISTS idx_captured_pages_priority ON captured_pages(priority);
CREATE INDEX IF NOT EXISTS idx_captured_pages_captured_at ON captured_pages(captured_at);
CREATE INDEX IF NOT EXISTS idx_captured_pages_url ON captured_pages(url);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_captured_pages_search ON captured_pages 
USING GIN (to_tsvector('english', title || ' ' || content));

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_captured_pages_updated_at 
    BEFORE UPDATE ON captured_pages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO captured_pages (url, title, content, category, priority) VALUES
('https://example.com/job1', 'Senior Developer Position', 'We are looking for a senior developer with React experience...', 'job', 'high'),
('https://example.com/company1', 'TechCorp Inc - About Us', 'TechCorp is a leading technology company with 500+ employees...', 'business', 'medium');
