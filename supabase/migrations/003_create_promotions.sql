-- Promosyonlar tablosu
CREATE TABLE IF NOT EXISTS promotions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           TEXT NOT NULL,
    slug            TEXT NOT NULL UNIQUE,
    description     TEXT,
    image_url       TEXT,
    gallery_images  TEXT[] DEFAULT '{}',
    discount_text   TEXT,
    category        TEXT DEFAULT 'general',
    address         TEXT,
    map_embed_url   TEXT,
    external_url    TEXT,
    validity_start  DATE,
    validity_end    DATE,
    is_active       BOOLEAN DEFAULT TRUE,
    sort_order      INT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- Herkese açık okuma (aktif olanlar)
CREATE POLICY "Public can read active promotions"
    ON promotions FOR SELECT
    USING (is_active = true);

-- Authenticate kullanıcılar tam erişim
CREATE POLICY "Authenticated users can manage promotions"
    ON promotions FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
