-- Migration: Create campaigns table for managing promotional texts and holiday descriptions

CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    date_text TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active campaigns
CREATE POLICY "Public can view active campaigns" ON public.campaigns
    FOR SELECT USING (is_active = true);

-- Allow full access for authenticated users (admins)
CREATE POLICY "Admins have full access to campaigns" ON public.campaigns
    FOR ALL USING (auth.role() = 'authenticated');
