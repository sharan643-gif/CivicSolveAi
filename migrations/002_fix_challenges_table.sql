-- Migration: Fix challenges table — add missing columns and fix RLS
-- Run this on your existing Supabase database to fix the data storage issues.

-- 1. Add missing columns that the app uses but the original schema didn't include
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS evidence JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS evidence_files JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS department_id TEXT;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS department_name TEXT;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS department_head TEXT;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS sla_days INTEGER;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS sla_deadline TIMESTAMPTZ;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS who_affected TEXT;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS duration TEXT;

-- 2. Fix RLS policies: allow anyone to insert/update/delete challenges
-- (The original policy required auth.role() = 'authenticated' which blocks anonymous submissions)

DROP POLICY IF EXISTS "Allow authenticated users to create challenges" ON public.challenges;
CREATE POLICY "Allow anyone to create challenges" ON public.challenges
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow creators or admin to update challenges" ON public.challenges;
CREATE POLICY "Allow anyone to update challenges" ON public.challenges
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow anyone to delete challenges" ON public.challenges;
CREATE POLICY "Allow anyone to delete challenges" ON public.challenges
  FOR DELETE USING (true);

-- 3. Ensure SELECT policy allows public read (should already exist)
DROP POLICY IF EXISTS "Allow public read of challenges" ON public.challenges;
CREATE POLICY "Allow public read of challenges" ON public.challenges
  FOR SELECT USING (true);
