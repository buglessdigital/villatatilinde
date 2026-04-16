-- Create villa_applications table
CREATE TABLE IF NOT EXISTS public.villa_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone_code TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    tourism_license_no TEXT,
    location TEXT NOT NULL,
    pool_type TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.villa_applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to INSERT (public form)
CREATE POLICY "Anyone can insert applications"
    ON public.villa_applications FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Allow authenticated to SELECT (admin panel)
CREATE POLICY "Authenticated can view applications"
    ON public.villa_applications FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated to UPDATE (admin status changes)
CREATE POLICY "Authenticated can update applications"
    ON public.villa_applications FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow authenticated to DELETE
CREATE POLICY "Authenticated can delete applications"
    ON public.villa_applications FOR DELETE
    TO authenticated
    USING (true);
