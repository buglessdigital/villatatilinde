-- RLS policies for reservations table

-- Allow anyone to INSERT (for public reservation form)
CREATE POLICY "Anyone can insert reservations"
    ON reservations FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Allow anyone to SELECT (for admin panel and user account page)
CREATE POLICY "Anyone can view reservations"
    ON reservations FOR SELECT
    TO anon, authenticated
    USING (true);

-- Allow anyone to UPDATE (for admin status changes)
CREATE POLICY "Anyone can update reservations"
    ON reservations FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Allow anyone to DELETE (for admin cleanup)
CREATE POLICY "Anyone can delete reservations"
    ON reservations FOR DELETE
    TO anon, authenticated
    USING (true);
