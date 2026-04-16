-- Migration: Add account page fields to users table and create user_wishes table

-- Add missing columns to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone_code TEXT DEFAULT '+90';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS subscription BOOLEAN DEFAULT false;

-- Create user_wishes table for favorite villas
CREATE TABLE IF NOT EXISTS public.user_wishes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    villa_id UUID NOT NULL REFERENCES public.villas(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, villa_id)
);

-- Enable RLS on user_wishes
ALTER TABLE public.user_wishes ENABLE ROW LEVEL SECURITY;

-- Users can view their own wishes
CREATE POLICY "Users can view own wishes" ON public.user_wishes
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own wishes
CREATE POLICY "Users can insert own wishes" ON public.user_wishes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own wishes
CREATE POLICY "Users can delete own wishes" ON public.user_wishes
    FOR DELETE USING (auth.uid() = user_id);
