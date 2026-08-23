-- =============================================================================
-- CivicSolve AI: Database Cleanup & Live Production Seed Script
-- Execute this script in your Supabase SQL Editor to wipe demo data & start fresh
-- =============================================================================

-- 1. TRUNCATE DEMO DATA TABLES (Cascading deletes)
TRUNCATE TABLE public.collaborations CASCADE;
TRUNCATE TABLE public.team_members CASCADE;
TRUNCATE TABLE public.teams CASCADE;
TRUNCATE TABLE public.challenges CASCADE;
TRUNCATE TABLE public.audit_logs CASCADE;
TRUNCATE TABLE public.login_sessions CASCADE;
TRUNCATE TABLE public.organization_verifications CASCADE;
TRUNCATE TABLE public.organization_members CASCADE;
TRUNCATE TABLE public.organizations CASCADE;

-- 2. ENSURE SECTORS ARE PRESENT
INSERT INTO public.sectors (name, slug, description) VALUES
  ('Citizens & Community', 'citizen', 'Report issues and support solutions in your locality.'),
  ('Government Departments', 'government', 'Validate problems, coordinate pilots, and deliver programs.'),
  ('Universities & Colleges', 'university', 'Oversee student engineering teams, capabilities, and faculty.'),
  ('Students & Developers', 'student', 'Form project cohorts, compile codebases, and build prototypes.'),
  ('Industry & Corporate', 'industry', 'Sponsor solutions, supply telemetry data, and guide teams.'),
  ('Experts & Mentors', 'expert', 'Validate engineering feasibility and score solutions.'),
  ('NGOs & Field Partners', 'ngo', 'Connect local societies and verify implementation impact.'),
  ('Startups & Innovators', 'startup', 'Pitch existing products, run pilot test projects, and scale.'),
  ('Incubators & Hubs', 'incubator', 'Mentor teams, manage cohorts, and recommend funding.'),
  ('Research Organizations', 'research', 'Propose scholarly research and collaborate on deep sciences.'),
  ('Funding & CSR Partners', 'funding', 'Fund high-impact projects, sponsor pilots, and audit metrics.'),
  ('Super Admin Center', 'super_admin', 'Manage users, permissions, AI controls, and audit system logs.')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- 3. ENSURE ROLES ARE PRESENT
INSERT INTO public.roles (sector_id, name, slug)
SELECT s.id, r.name, r.slug
FROM (VALUES
  ('citizen', 'Citizen', 'citizen'),
  ('citizen', 'Community Leader', 'community_leader'),
  ('government', 'Government Officer', 'gov_officer'),
  ('government', 'Government Administrator', 'gov_admin'),
  ('university', 'University Administrator', 'uni_admin'),
  ('university', 'Faculty', 'faculty'),
  ('student', 'Student', 'student'),
  ('student', 'Team Leader', 'team_leader'),
  ('industry', 'Company Administrator', 'company_admin'),
  ('industry', 'Mentor', 'mentor'),
  ('expert', 'Domain Expert', 'domain_expert'),
  ('expert', 'Technical Expert', 'tech_expert'),
  ('ngo', 'NGO Administrator', 'ngo_admin'),
  ('startup', 'Startup Founder', 'startup_founder'),
  ('incubator', 'Incubator Administrator', 'incubator_admin'),
  ('research', 'Research Administrator', 'research_admin'),
  ('funding', 'CSR Administrator', 'csr_admin'),
  ('super_admin', 'Super Admin', 'super_admin')
) AS r(sector_slug, name, slug)
JOIN public.sectors s ON s.slug = r.sector_slug
ON CONFLICT (slug) DO NOTHING;

-- 4. LINK SUPER ADMIN PROFILE (admin@admin.com)
-- (Make sure admin@admin.com was created under Auth -> Users first)
INSERT INTO public.profiles (id, full_name, email, verification, primary_role_id, primary_sector_id)
SELECT 
  u.id,
  'Super Administrator',
  'admin@admin.com',
  'verified',
  r.id,
  s.id
FROM auth.users u
JOIN public.roles r ON r.slug = 'super_admin'
JOIN public.sectors s ON s.slug = 'super_admin'
WHERE u.email = 'admin@admin.com'
ON CONFLICT (id) DO UPDATE SET verification = 'verified', primary_role_id = EXCLUDED.primary_role_id, primary_sector_id = EXCLUDED.primary_sector_id;

-- 5. INITIALIZE DEFAULT AI SETTINGS
INSERT INTO public.ai_settings (key, enabled, model_name, confidence_threshold) VALUES
  ('duplicate_detection', TRUE, 'google/gemini-2.5-flash', 0.80),
  ('priority_scoring', TRUE, 'google/gemini-2.5-flash', 0.80),
  ('team_matching', TRUE, 'google/gemini-2.5-flash', 0.80)
ON CONFLICT (key) DO NOTHING;
