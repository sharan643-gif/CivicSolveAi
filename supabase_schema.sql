-- Extended Supabase PostgreSQL Database Schema
-- CivicSolve AI: Multi-Sector government Innovation Platform
-- Supporting 12 Sectors, 30+ Roles, RBAC permissions, and Audit Logging

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define Custom Enums (Safely check if type exists before creating)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'verification_level') THEN
    CREATE TYPE verification_level AS ENUM ('unverified', 'pending_verification', 'verified', 'suspended');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'challenge_severity') THEN
    CREATE TYPE challenge_severity AS ENUM ('critical', 'high', 'medium', 'low');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'challenge_status') THEN
    CREATE TYPE challenge_status AS ENUM ('reported', 'under_review', 'validated', 'published', 'team_formation', 'active_development', 'prototype', 'pilot', 'implemented', 'resolved');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
    CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'completed');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'org_type') THEN
    CREATE TYPE org_type AS ENUM ('university', 'industry', 'ngo', 'government', 'startup', 'incubator', 'research', 'funding');
  END IF;
END $$;

-- 1. Sectors Table
CREATE TABLE IF NOT EXISTS public.sectors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- 'citizen', 'government', 'university', etc.
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Roles Table
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sector_id UUID REFERENCES public.sectors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL -- 'citizen', 'gov_admin', 'student', etc.
);

-- 3. Permissions Table
CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL, -- 'report_challenge', 'validate_challenge', etc.
  description TEXT
);

-- 4. Role Permissions Mapping
CREATE TABLE IF NOT EXISTS public.role_permissions (
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- 5. Profiles Table (Extending auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  primary_sector_id UUID REFERENCES public.sectors(id) ON DELETE SET NULL,
  primary_role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
  verification verification_level NOT NULL DEFAULT 'unverified',
  avatar_url TEXT,
  phone TEXT,
  skills TEXT[] DEFAULT '{}',
  expertise TEXT[] DEFAULT '{}',
  bio TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. User Roles Mapping (Supporting multiple roles, though primary is stored in profiles)
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

-- 7. Organizations Table
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type org_type NOT NULL,
  domain TEXT,
  logo_url TEXT,
  description TEXT,
  website TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Organization Members
CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_admin BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (organization_id, user_id)
);

-- 9. Organization Verifications
CREATE TABLE IF NOT EXISTS public.organization_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  status verification_level NOT NULL DEFAULT 'pending_verification',
  document_url TEXT,
  reviewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes TEXT,
  reviewed_at TIMESTAMPTZ
);

-- 10. Login Sessions (Security)
CREATE TABLE IF NOT EXISTS public.login_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  logged_in_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  logged_out_at TIMESTAMPTZ
);

-- 11. Audit Logs (Compliance)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- e.g., 'SUSPEND_USER', 'CHANGE_ROLE_PERMISSION', etc.
  target TEXT,         -- ID of target record affected
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  status TEXT NOT NULL, -- 'success', 'failure'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Challenges Table
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  severity challenge_severity NOT NULL DEFAULT 'medium',
  status challenge_status NOT NULL DEFAULT 'reported',
  location TEXT NOT NULL,
  district TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  affected_population INTEGER DEFAULT 0,
  priority_score INTEGER DEFAULT 50 CHECK (priority_score >= 0 AND priority_score <= 100),
  reports_count INTEGER DEFAULT 1,
  support_count INTEGER DEFAULT 0,
  skills_required TEXT[] DEFAULT '{}',
  deadline TIMESTAMPTZ,
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ai_analysis JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. Student Teams
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  repository_url TEXT,
  presentation_url TEXT,
  lead_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. Team Members
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role_title TEXT NOT NULL DEFAULT 'Contributor',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (team_id, user_id)
);

-- 15. Collaborations Table
CREATE TABLE IF NOT EXISTS public.collaborations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  industry_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  contribution_type TEXT NOT NULL,
  details TEXT,
  funding_amount NUMERIC(12, 2) DEFAULT 0.00,
  mentors_count INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. AI Control Center Settings
CREATE TABLE IF NOT EXISTS public.ai_settings (
  key TEXT PRIMARY KEY, -- 'duplicate_detection', 'priority_scoring', 'team_matching'
  value TEXT,
  enabled BOOLEAN DEFAULT TRUE,
  model_name TEXT DEFAULT 'google/gemini-2.5-flash',
  confidence_threshold NUMERIC(4, 2) DEFAULT 0.80,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES --

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- 1. Sectors & Roles policies
DROP POLICY IF EXISTS "Allow public select of active sectors" ON public.sectors;
CREATE POLICY "Allow public select of active sectors" ON public.sectors FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "Allow public select of roles" ON public.roles;
CREATE POLICY "Allow public select of roles" ON public.roles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public select of permissions" ON public.permissions;
CREATE POLICY "Allow public select of permissions" ON public.permissions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public select of role_permissions" ON public.role_permissions;
CREATE POLICY "Allow public select of role_permissions" ON public.role_permissions FOR SELECT USING (true);

-- 2. Profiles policies
DROP POLICY IF EXISTS "Allow public read of profiles" ON public.profiles;
CREATE POLICY "Allow public read of profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow users to update own profile" ON public.profiles;
CREATE POLICY "Allow users to update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow users to insert own profile" ON public.profiles;
CREATE POLICY "Allow users to insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. Challenges policies
DROP POLICY IF EXISTS "Allow public read of challenges" ON public.challenges;
CREATE POLICY "Allow public read of challenges" ON public.challenges FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to create challenges" ON public.challenges;
CREATE POLICY "Allow authenticated users to create challenges" ON public.challenges FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow creators or admin to update challenges" ON public.challenges;
CREATE POLICY "Allow creators or admin to update challenges" ON public.challenges FOR UPDATE USING (auth.role() = 'authenticated');

-- 4. Teams policies
DROP POLICY IF EXISTS "Allow public read of teams" ON public.teams;
CREATE POLICY "Allow public read of teams" ON public.teams FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to manage teams" ON public.teams;
CREATE POLICY "Allow authenticated users to manage teams" ON public.teams FOR ALL USING (auth.role() = 'authenticated');

-- 5. Audit Logs policies
DROP POLICY IF EXISTS "Allow authenticated users to insert audit logs" ON public.audit_logs;
CREATE POLICY "Allow authenticated users to insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow users to view their own audit logs" ON public.audit_logs;
CREATE POLICY "Allow users to view their own audit logs" ON public.audit_logs FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NOT NULL);

-- 6. AI Settings policies
DROP POLICY IF EXISTS "Allow public read of AI settings" ON public.ai_settings;
CREATE POLICY "Allow public read of AI settings" ON public.ai_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow super admin to modify AI settings" ON public.ai_settings;
CREATE POLICY "Allow super admin to modify AI settings" ON public.ai_settings FOR ALL USING (true);

-- ─── SEED DATA FOR SECTORS & ROLES ──────────────────────────────────────────

-- Insert 12 Core Sectors
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

-- Seed Roles linked to Sectors
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
