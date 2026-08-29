-- ═══════════════════════════════════════════════════════════════════
--  JanSetu AI — CLEANUP / ERASE SCRIPT
--
--  THREE OPTIONS — uncomment the block you want to run:
--
--   Option A  →  TRUNCATE ALL DATA (keeps tables, wipes all rows)
--   Option B  →  DELETE ONLY SEED DATA (leaves real user data)
--   Option C  →  DROP EVERYTHING (removes tables, types, extensions)
--
--  ⚠️  WARNING: These operations are IRREVERSIBLE.
--      Always take a Supabase backup before running.
-- ═══════════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────────────────────────
-- OPTION A : TRUNCATE ALL DATA
-- Empties every table in dependency-safe order.
-- Tables and schema are preserved. Identity sequences reset.
-- ─────────────────────────────────────────────────────────────────
/*

TRUNCATE TABLE public.notifications    RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.audit_logs       RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.ai_settings      RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.team_members     RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.teams            RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.solutions        RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.challenges       RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.role_permissions RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.permissions      RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.profiles         RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.organizations    RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.sectors          RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.roles            RESTART IDENTITY CASCADE;

*/


-- ─────────────────────────────────────────────────────────────────
-- OPTION B : DELETE ONLY SAMPLE / SEED DATA
-- Removes exactly the 10 seed rows per table by their known UUIDs.
-- Any real production data inserted after seeding is untouched.
-- ─────────────────────────────────────────────────────────────────
/*

-- Notifications (10 seed rows)
DELETE FROM public.notifications
WHERE id IN (
  'eeeeeeee-eeee-eeee-eeee-000000000001',
  'eeeeeeee-eeee-eeee-eeee-000000000002',
  'eeeeeeee-eeee-eeee-eeee-000000000003',
  'eeeeeeee-eeee-eeee-eeee-000000000004',
  'eeeeeeee-eeee-eeee-eeee-000000000005',
  'eeeeeeee-eeee-eeee-eeee-000000000006',
  'eeeeeeee-eeee-eeee-eeee-000000000007',
  'eeeeeeee-eeee-eeee-eeee-000000000008',
  'eeeeeeee-eeee-eeee-eeee-000000000009',
  'eeeeeeee-eeee-eeee-eeee-000000000010'
);

-- Audit Logs (10 seed rows)
DELETE FROM public.audit_logs
WHERE id IN (
  'bbbbbbbb-bbbb-bbbb-bbbb-000000000001',
  'bbbbbbbb-bbbb-bbbb-bbbb-000000000002',
  'bbbbbbbb-bbbb-bbbb-bbbb-000000000003',
  'bbbbbbbb-bbbb-bbbb-bbbb-000000000004',
  'bbbbbbbb-bbbb-bbbb-bbbb-000000000005',
  'bbbbbbbb-bbbb-bbbb-bbbb-000000000006',
  'bbbbbbbb-bbbb-bbbb-bbbb-000000000007',
  'bbbbbbbb-bbbb-bbbb-bbbb-000000000008',
  'bbbbbbbb-bbbb-bbbb-bbbb-000000000009',
  'bbbbbbbb-bbbb-bbbb-bbbb-000000000010'
);

-- AI Settings (all 10 seed keys)
DELETE FROM public.ai_settings
WHERE key IN (
  'model', 'temperature', 'max_tokens',
  'auto_categorize', 'auto_prioritize', 'sentiment_analysis',
  'language', 'voice_recognition', 'summary_language', 'ai_suggestions'
);

-- Team Members (seed rows)
DELETE FROM public.team_members
WHERE team_id LIKE 'tttttttt-%';

-- Teams (10 seed rows)
DELETE FROM public.teams
WHERE id LIKE 'tttttttt-%';

-- Solutions (10 seed rows)
DELETE FROM public.solutions
WHERE id LIKE 'ssssssss-%';

-- Challenges (10 seed rows)
DELETE FROM public.challenges
WHERE id LIKE 'cccccccc-%';

-- Role Permissions for seed roles
DELETE FROM public.role_permissions
WHERE role_id LIKE '11111111-%';

-- Permissions (10 seed rows)
DELETE FROM public.permissions
WHERE id LIKE '44444444-%';

-- Profiles / Users (10 seed rows)
DELETE FROM public.profiles
WHERE id LIKE 'aaaaaaaa-%';

-- Organizations (10 seed rows)
DELETE FROM public.organizations
WHERE id LIKE '33333333-%';

-- Sectors (10 seed rows)
DELETE FROM public.sectors
WHERE id LIKE '22222222-%';

-- Roles (10 seed rows)
DELETE FROM public.roles
WHERE id LIKE '11111111-%';

*/


-- ─────────────────────────────────────────────────────────────────
-- OPTION C : DROP ALL TABLES + CUSTOM TYPES (complete wipe)
-- Removes schema completely. Run supabase_schema.sql afterwards
-- to rebuild from scratch.
-- ─────────────────────────────────────────────────────────────────
/*

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS public.notifications    CASCADE;
DROP TABLE IF EXISTS public.audit_logs       CASCADE;
DROP TABLE IF EXISTS public.ai_settings      CASCADE;
DROP TABLE IF EXISTS public.team_members     CASCADE;
DROP TABLE IF EXISTS public.teams            CASCADE;
DROP TABLE IF EXISTS public.solutions        CASCADE;
DROP TABLE IF EXISTS public.challenges       CASCADE;
DROP TABLE IF EXISTS public.role_permissions CASCADE;
DROP TABLE IF EXISTS public.permissions      CASCADE;
DROP TABLE IF EXISTS public.profiles         CASCADE;
DROP TABLE IF EXISTS public.organizations    CASCADE;
DROP TABLE IF EXISTS public.sectors          CASCADE;
DROP TABLE IF EXISTS public.roles            CASCADE;

-- Drop custom enum types
DROP TYPE IF EXISTS public.verification_level CASCADE;
DROP TYPE IF EXISTS public.challenge_severity  CASCADE;
DROP TYPE IF EXISTS public.challenge_status    CASCADE;
DROP TYPE IF EXISTS public.task_status         CASCADE;
DROP TYPE IF EXISTS public.org_type            CASCADE;

*/
