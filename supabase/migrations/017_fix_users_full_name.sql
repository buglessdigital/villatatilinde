-- Fix: Ensure full_name column exists on users table
-- The 002 migration created first_name + last_name but the app uses full_name
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS provider TEXT;
