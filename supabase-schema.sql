-- ARIS Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security
ALTER TABLE IF EXISTS employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS skill_requests ENABLE ROW LEVEL SECURITY;

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  skills JSONB DEFAULT '[]'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  trainings JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create training_programs table
CREATE TABLE IF NOT EXISTS training_programs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  skills_covered JSONB DEFAULT '[]'::jsonb,
  est_days INTEGER DEFAULT 0,
  provider TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skill_requests table
CREATE TABLE IF NOT EXISTS skill_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requested_by TEXT NOT NULL CHECK (requested_by IN ('delivery', 'hr', 'system')),
  skills JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_review', 'fulfilled', 'closed')),
  analysis_snapshot JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_employees_updated_at ON employees;
CREATE TRIGGER update_employees_updated_at 
  BEFORE UPDATE ON employees 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_training_programs_updated_at ON training_programs;
CREATE TRIGGER update_training_programs_updated_at 
  BEFORE UPDATE ON training_programs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_skill_requests_updated_at ON skill_requests;
CREATE TRIGGER update_skill_requests_updated_at 
  BEFORE UPDATE ON skill_requests 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO employees (id, name, role, skills, certifications, trainings) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Arjun Sharma', 'Senior Developer', 
 '[{"name": "Java", "level": 4, "last_used": "2025-08-23T00:00:00Z"}, {"name": "AWS", "level": 4, "last_used": "2025-08-18T00:00:00Z"}, {"name": "Kubernetes", "level": 3, "last_used": "2025-08-13T00:00:00Z"}]',
 '[{"name": "AWS Solutions Architect", "issuer": "AWS", "expires_at": "2025-11-02T00:00:00Z"}]',
 '[]'),
('550e8400-e29b-41d4-a716-446655440002', 'Priya Singh', 'Cloud Engineer',
 '[{"name": "Java", "level": 3, "last_used": "2025-08-03T00:00:00Z"}, {"name": "AWS", "level": 3, "last_used": "2025-08-26T00:00:00Z"}, {"name": "Kubernetes", "level": 2, "last_used": "2025-07-04T00:00:00Z"}]',
 '[{"name": "CKA", "issuer": "CNCF", "expires_at": "2026-02-02T00:00:00Z"}]',
 '[]'),
('550e8400-e29b-41d4-a716-446655440003', 'Rajesh Kumar', 'Full-stack Developer',
 '[{"name": "Java", "level": 2, "last_used": "2025-05-05T00:00:00Z"}, {"name": "AWS", "level": 2, "last_used": "2025-07-14T00:00:00Z"}, {"name": "React", "level": 4, "last_used": "2025-08-30T00:00:00Z"}]',
 '[{"name": "AWS Cloud Practitioner", "issuer": "AWS", "expires_at": "2025-10-02T00:00:00Z"}]',
 '[]'),
('550e8400-e29b-41d4-a716-446655440004', 'Kavya Patel', 'DevOps Engineer',
 '[{"name": "Kubernetes", "level": 4, "last_used": "2025-08-28T00:00:00Z"}, {"name": "AWS", "level": 4, "last_used": "2025-08-24T00:00:00Z"}, {"name": "Terraform", "level": 3, "last_used": "2025-08-21T00:00:00Z"}]',
 '[{"name": "CKA", "issuer": "CNCF", "expires_at": "2025-09-02T00:00:00Z"}]',
 '[]'),
('550e8400-e29b-41d4-a716-446655440005', 'Aditya Gupta', 'Software Engineer',
 '[{"name": "Java", "level": 3, "last_used": "2025-08-08T00:00:00Z"}, {"name": "React", "level": 3, "last_used": "2025-08-25T00:00:00Z"}, {"name": "AWS", "level": 2, "last_used": "2025-07-19T00:00:00Z"}]',
 '[{"name": "Oracle Java SE 11", "issuer": "Oracle", "expires_at": "2026-05-02T00:00:00Z"}]',
 '[]'),
('550e8400-e29b-41d4-a716-446655440006', 'Sneha Reddy', 'Frontend Developer',
 '[{"name": "React", "level": 4, "last_used": "2025-08-31T00:00:00Z"}, {"name": "Java", "level": 2, "last_used": "2025-06-04T00:00:00Z"}, {"name": "Kubernetes", "level": 1, "last_used": "2025-03-06T00:00:00Z"}]',
 '[]',
 '[]');

INSERT INTO training_programs (id, name, skills_covered, est_days, provider) VALUES
('tp-aws-adv', 'AWS Advanced Upskilling', '[{"name": "AWS", "to_level": 4}]', 14, 'Internal Academy'),
('tp-k8s-bootcamp', 'Kubernetes Bootcamp', '[{"name": "Kubernetes", "to_level": 3}]', 10, 'Internal Academy'),
('tp-java-accelerator', 'Java Accelerator', '[{"name": "Java", "to_level": 4}]', 12, 'Partner');

-- Create RLS policies (adjust as needed for your security requirements)
CREATE POLICY "Enable read access for all users" ON employees FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON employees FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON employees FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON employees FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON training_programs FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON training_programs FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON training_programs FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON training_programs FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON skill_requests FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON skill_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON skill_requests FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON skill_requests FOR DELETE USING (true);
