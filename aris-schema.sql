-- ARIS Database Schema: AI Resource Intelligence System
-- Advanced skill matching, predictive analytics, and automated workflow management

-- Core Employee Skills and Competencies
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  department VARCHAR(100) NOT NULL,
  role VARCHAR(100) NOT NULL,
  hire_date DATE NOT NULL,
  tenure_months INTEGER GENERATED ALWAYS AS (
    EXTRACT(YEAR FROM AGE(NOW(), hire_date)) * 12 + 
    EXTRACT(MONTH FROM AGE(NOW(), hire_date))
  ) STORED,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Comprehensive Skills Taxonomy
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'technical', 'soft', 'certification', 'tool'
  subcategory VARCHAR(50),
  market_demand_score INTEGER DEFAULT 50, -- 1-100 based on market analysis
  growth_trajectory VARCHAR(20) DEFAULT 'stable', -- 'growing', 'stable', 'declining'
  average_salary_impact DECIMAL(5,2) DEFAULT 0.00, -- percentage impact on salary
  created_at TIMESTAMP DEFAULT NOW()
);

-- Employee Skill Proficiency Matrix
CREATE TABLE employee_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  current_level INTEGER NOT NULL CHECK (current_level BETWEEN 1 AND 5),
  required_level INTEGER DEFAULT 3 CHECK (required_level BETWEEN 1 AND 5),
  verified_date DATE,
  verification_method VARCHAR(50), -- 'assessment', 'certification', 'project', 'peer_review'
  last_used_date DATE,
  proficiency_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(employee_id, skill_id)
);

-- Certification Management with Auto-Alerts
CREATE TABLE certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  certification_name VARCHAR(255) NOT NULL,
  issuing_organization VARCHAR(255) NOT NULL,
  earned_date DATE NOT NULL,
  expiry_date DATE,
  certification_id VARCHAR(100), -- External certification ID
  verification_url TEXT,
  skill_ids UUID[], -- Array of related skill IDs
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'expired', 'pending_renewal'
  renewal_cost DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Competency Matrix: Role Requirements
CREATE TABLE role_competencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  required_level INTEGER NOT NULL CHECK (required_level BETWEEN 1 AND 5),
  priority VARCHAR(10) DEFAULT 'medium', -- 'critical', 'high', 'medium', 'nice_to_have'
  years_experience_required INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(role_name, department, skill_id)
);

-- Training Programs and Pathways
CREATE TABLE training_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_name VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  program_type VARCHAR(50) NOT NULL, -- 'certification', 'course', 'workshop', 'bootcamp'
  duration_weeks INTEGER NOT NULL,
  cost DECIMAL(10,2),
  skill_ids UUID[] NOT NULL, -- Skills this program develops
  target_level INTEGER NOT NULL CHECK (target_level BETWEEN 1 AND 5),
  prerequisites TEXT,
  success_rate DECIMAL(5,2) DEFAULT 85.00, -- Historical completion rate
  avg_satisfaction_score DECIMAL(3,2) DEFAULT 4.00, -- 1-5 scale
  next_available_date DATE,
  max_participants INTEGER DEFAULT 20,
  delivery_method VARCHAR(50) DEFAULT 'online', -- 'online', 'in_person', 'hybrid'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Employee Training Enrollment and Progress
CREATE TABLE employee_training (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  program_id UUID REFERENCES training_programs(id) ON DELETE CASCADE,
  enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  start_date DATE,
  expected_completion_date DATE,
  actual_completion_date DATE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
  status VARCHAR(20) DEFAULT 'enrolled', -- 'enrolled', 'in_progress', 'completed', 'failed', 'dropped'
  final_score DECIMAL(5,2),
  cost DECIMAL(10,2),
  manager_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(employee_id, program_id)
);

-- Client Skill Requests (The Core ARIS Workflow)
CREATE TABLE skill_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id VARCHAR(50) UNIQUE NOT NULL,
  client_name VARCHAR(255),
  project_name VARCHAR(255) NOT NULL,
  requested_by VARCHAR(255) NOT NULL, -- Delivery team member
  request_date DATE NOT NULL DEFAULT CURRENT_DATE,
  required_start_date DATE NOT NULL,
  project_duration_weeks INTEGER NOT NULL,
  team_size_required INTEGER NOT NULL,
  priority VARCHAR(10) DEFAULT 'medium', -- 'urgent', 'high', 'medium', 'low'
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'analyzing', 'proposed', 'approved', 'fulfilled', 'cancelled'
  budget_range VARCHAR(50),
  additional_requirements TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Required Skills for Each Request
CREATE TABLE request_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES skill_requests(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  required_level INTEGER NOT NULL CHECK (required_level BETWEEN 1 AND 5),
  number_of_people INTEGER NOT NULL DEFAULT 1,
  is_mandatory BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(request_id, skill_id)
);

-- ARIS Analysis Results (AI-Generated Recommendations)
CREATE TABLE skill_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES skill_requests(id) ON DELETE CASCADE,
  analysis_date TIMESTAMP DEFAULT NOW(),
  
  -- Ready Resources
  ready_now_count INTEGER DEFAULT 0,
  ready_employees UUID[], -- Array of employee IDs
  
  -- Trainable Resources
  trainable_2weeks_count INTEGER DEFAULT 0,
  trainable_2weeks_employees UUID[],
  trainable_4weeks_count INTEGER DEFAULT 0,
  trainable_4weeks_employees UUID[],
  
  -- Gaps and Recommendations
  external_hire_needed INTEGER DEFAULT 0,
  recommended_training_programs UUID[], -- Array of program IDs
  estimated_preparation_time INTEGER, -- weeks
  confidence_score DECIMAL(5,2) DEFAULT 85.00, -- AI confidence in analysis
  
  -- Alternative Solutions
  alternative_solutions JSONB,
  risk_assessment TEXT,
  cost_analysis JSONB,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Market Intelligence and Trend Analysis
CREATE TABLE market_trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  period VARCHAR(20) NOT NULL, -- 'Q1_2025', 'Q2_2025', etc.
  demand_score INTEGER NOT NULL CHECK (demand_score BETWEEN 1 AND 100),
  supply_score INTEGER NOT NULL CHECK (supply_score BETWEEN 1 AND 100),
  salary_trend VARCHAR(20) DEFAULT 'stable', -- 'increasing', 'stable', 'decreasing'
  job_postings_count INTEGER DEFAULT 0,
  growth_prediction VARCHAR(20) DEFAULT 'stable', -- 'high_growth', 'growth', 'stable', 'decline'
  geographical_demand JSONB, -- Demand by region/city
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(skill_id, period)
);

-- Automated Alerts and Notifications
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type VARCHAR(50) NOT NULL, -- 'cert_expiry', 'skill_demand', 'training_deadline', 'gap_identified'
  target_type VARCHAR(20) NOT NULL, -- 'employee', 'manager', 'hr', 'delivery'
  target_id UUID, -- Employee, manager, or team ID
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  priority VARCHAR(10) DEFAULT 'medium', -- 'urgent', 'high', 'medium', 'low'
  action_required BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- System Configuration for ARIS Intelligence
CREATE TABLE system_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key VARCHAR(100) UNIQUE NOT NULL,
  config_value JSONB NOT NULL,
  description TEXT,
  updated_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert Default System Configuration
INSERT INTO system_config (config_key, config_value, description) VALUES
('certification_alert_days', '[90, 60, 30, 7]', 'Days before expiry to send alerts'),
('skill_demand_threshold', '{"high": 80, "medium": 50, "low": 20}', 'Thresholds for skill demand classification'),
('training_auto_enrollment', '{"enabled": true, "max_cost": 5000, "manager_approval_required": true}', 'Auto-enrollment settings'),
('ai_confidence_threshold', '85', 'Minimum confidence score for auto-recommendations'),
('market_analysis_refresh_days', '7', 'How often to refresh market intelligence data');

-- Indexes for Performance
CREATE INDEX idx_employees_department_role ON employees(department, role);
CREATE INDEX idx_employee_skills_employee_skill ON employee_skills(employee_id, skill_id);
CREATE INDEX idx_certifications_expiry ON certifications(expiry_date) WHERE status = 'active';
CREATE INDEX idx_skill_requests_status_date ON skill_requests(status, request_date);
CREATE INDEX idx_alerts_target_unread ON alerts(target_type, target_id, is_read);
CREATE INDEX idx_market_trends_skill_period ON market_trends(skill_id, period);

-- Functions for ARIS Intelligence

-- Function to calculate skill gap for a role
CREATE OR REPLACE FUNCTION calculate_role_skill_gap(
  emp_id UUID,
  target_role VARCHAR(100),
  target_department VARCHAR(100)
)
RETURNS TABLE(
  skill_name VARCHAR(100),
  current_level INTEGER,
  required_level INTEGER,
  gap INTEGER,
  priority VARCHAR(10)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.name,
    COALESCE(es.current_level, 0) as current_level,
    rc.required_level,
    rc.required_level - COALESCE(es.current_level, 0) as gap,
    rc.priority
  FROM role_competencies rc
  JOIN skills s ON rc.skill_id = s.id
  LEFT JOIN employee_skills es ON (es.skill_id = s.id AND es.employee_id = emp_id)
  WHERE rc.role_name = target_role 
    AND rc.department = target_department
    AND rc.required_level > COALESCE(es.current_level, 0)
  ORDER BY 
    CASE rc.priority 
      WHEN 'critical' THEN 1 
      WHEN 'high' THEN 2 
      WHEN 'medium' THEN 3 
      ELSE 4 
    END,
    gap DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to find available resources for skill request
CREATE OR REPLACE FUNCTION find_available_resources(req_id UUID)
RETURNS TABLE(
  employee_id UUID,
  employee_name VARCHAR(255),
  match_percentage DECIMAL(5,2),
  readiness_status VARCHAR(20),
  training_needed TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  WITH request_requirements AS (
    SELECT rs.skill_id, rs.required_level, rs.number_of_people
    FROM request_skills rs
    WHERE rs.request_id = req_id
  ),
  employee_matches AS (
    SELECT 
      e.id,
      e.name,
      COUNT(CASE WHEN es.current_level >= rr.required_level THEN 1 END) * 100.0 / COUNT(*) as match_pct,
      CASE 
        WHEN COUNT(CASE WHEN es.current_level >= rr.required_level THEN 1 END) = COUNT(*) THEN 'ready_now'
        WHEN COUNT(CASE WHEN es.current_level >= rr.required_level - 1 THEN 1 END) = COUNT(*) THEN 'ready_2weeks'
        WHEN COUNT(CASE WHEN es.current_level >= rr.required_level - 2 THEN 1 END) = COUNT(*) THEN 'ready_4weeks'
        ELSE 'needs_hiring'
      END as readiness,
      ARRAY_AGG(
        CASE WHEN es.current_level < rr.required_level 
        THEN s.name || ' (L' || rr.required_level || ')'
        END
      ) FILTER (WHERE es.current_level < rr.required_level) as training_needed
    FROM employees e
    CROSS JOIN request_requirements rr
    LEFT JOIN employee_skills es ON (e.id = es.employee_id AND es.skill_id = rr.skill_id)
    LEFT JOIN skills s ON rr.skill_id = s.id
    WHERE e.status = 'active'
    GROUP BY e.id, e.name
  )
  SELECT em.id, em.name, em.match_pct, em.readiness, em.training_needed
  FROM employee_matches em
  WHERE em.match_pct > 50
  ORDER BY em.match_pct DESC, em.readiness;
END;
$$ LANGUAGE plpgsql;
