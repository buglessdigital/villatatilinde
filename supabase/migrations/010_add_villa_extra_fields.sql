-- Adım 1: SEO ve Sayfa Bilgileri
ALTER TABLE villas
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT;

-- Adım 2: Villa Sahibi Bilgileri
ALTER TABLE villas
ADD COLUMN IF NOT EXISTS owner_iban TEXT,
ADD COLUMN IF NOT EXISTS owner_notes TEXT;

-- Adım 3: Temel Villa Bilgileri ve Toggles
ALTER TABLE villas
ADD COLUMN IF NOT EXISTS reference_code TEXT,
ADD COLUMN IF NOT EXISTS self_checkin BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS pool_security_fence BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS cleaning_fee_min_nights INTEGER DEFAULT 1;

-- Adım 4: Mesafeler (Metre bazlı saklanacak)
ALTER TABLE villas
ADD COLUMN IF NOT EXISTS distance_center INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS distance_sea INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS distance_airport INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS distance_clinic INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS distance_hospital INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS distance_market INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS distance_restaurant INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS distance_public_transport INTEGER DEFAULT 0;

-- Adım 5: Harita Koordinatları
ALTER TABLE villas
ADD COLUMN IF NOT EXISTS map_lat TEXT,
ADD COLUMN IF NOT EXISTS map_lng TEXT;
