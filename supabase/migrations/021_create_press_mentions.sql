-- Create press_mentions table
CREATE TABLE IF NOT EXISTS public.press_mentions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    publisher TEXT NOT NULL,
    url TEXT NOT NULL,
    image_url TEXT,
    content TEXT,
    published_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.press_mentions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to SELECT (for the public /basinda-biz page)
CREATE POLICY "Anyone can view press mentions"
    ON public.press_mentions FOR SELECT
    TO anon, authenticated
    USING (true);

-- Allow authenticated to INSERT (admin panel)
CREATE POLICY "Authenticated can insert press mentions"
    ON public.press_mentions FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow authenticated to UPDATE (admin panel)
CREATE POLICY "Authenticated can update press mentions"
    ON public.press_mentions FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow authenticated to DELETE (admin panel)
CREATE POLICY "Authenticated can delete press mentions"
    ON public.press_mentions FOR DELETE
    TO authenticated
    USING (true);
