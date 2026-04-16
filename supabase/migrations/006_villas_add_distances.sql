-- ============================================================
-- 006: Villas tablosuna mesafe ve video alanları ekle
-- Villa detay sayfası bu alanları kullanıyor
-- ============================================================

-- Mesafe alanları (metre cinsinden)
ALTER TABLE villas ADD COLUMN IF NOT EXISTS to_beach INT DEFAULT 0;
ALTER TABLE villas ADD COLUMN IF NOT EXISTS to_restaurant INT DEFAULT 0;
ALTER TABLE villas ADD COLUMN IF NOT EXISTS to_shop INT DEFAULT 0;
ALTER TABLE villas ADD COLUMN IF NOT EXISTS to_centre INT DEFAULT 0;
ALTER TABLE villas ADD COLUMN IF NOT EXISTS to_hospital INT DEFAULT 0;
ALTER TABLE villas ADD COLUMN IF NOT EXISTS to_health_center INT DEFAULT 0;
ALTER TABLE villas ADD COLUMN IF NOT EXISTS to_airport INT DEFAULT 0;

-- Video URL array
ALTER TABLE villas ADD COLUMN IF NOT EXISTS video_urls TEXT[] DEFAULT '{}';

-- Örnek villayı güncelle
UPDATE villas SET
    to_beach = 3500,
    to_restaurant = 2000,
    to_shop = 2000,
    to_centre = 3000,
    to_hospital = 8000,
    to_health_center = 3000,
    to_airport = 65000,
    video_urls = '{}'
WHERE slug = 'villa-doga';
