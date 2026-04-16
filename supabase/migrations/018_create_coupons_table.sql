-- Migration: Create coupons table for campaign and discount management

CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    discount_amount NUMERIC(12,2) NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    valid_until TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    usage_limit INT,
    used_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active coupons
CREATE POLICY "Public can view active coupons" ON public.coupons
    FOR SELECT USING (is_active = true);

-- Allow full access for authenticated users (admins)
CREATE POLICY "Admins have full access to coupons" ON public.coupons
    FOR ALL USING (auth.role() = 'authenticated');
