-- Create villa_reviews table
CREATE TABLE IF NOT EXISTS public.villa_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    villa_id UUID REFERENCES public.villas(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_email TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for reviews
ALTER TABLE public.villa_reviews ENABLE ROW LEVEL SECURITY;

-- Allow public to INSERT new reviews (with is_approved = false)
CREATE POLICY "Public can insert reviews"
    ON public.villa_reviews FOR INSERT
    TO public
    WITH CHECK (true);

-- Allow public to SELECT only approved reviews
CREATE POLICY "Public can view approved reviews"
    ON public.villa_reviews FOR SELECT
    TO public
    USING (is_approved = true);

-- Allow authenticated (admin) to manage all reviews
CREATE POLICY "Admin full access to reviews"
    ON public.villa_reviews FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);


-- Create villa_questions table
CREATE TABLE IF NOT EXISTS public.villa_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    villa_id UUID REFERENCES public.villas(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT,
    is_answered BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for questions
ALTER TABLE public.villa_questions ENABLE ROW LEVEL SECURITY;

-- Allow public to INSERT new questions
CREATE POLICY "Public can insert questions"
    ON public.villa_questions FOR INSERT
    TO public
    WITH CHECK (true);

-- Allow public to SELECT answered questions (optional: public can view answered ones)
CREATE POLICY "Public can view answered questions"
    ON public.villa_questions FOR SELECT
    TO public
    USING (is_answered = true);

-- Allow authenticated (admin) to manage all questions
CREATE POLICY "Admin full access to questions"
    ON public.villa_questions FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
