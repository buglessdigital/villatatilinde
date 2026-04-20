-- Promotions tablosuna kupon oluşturulabilirlik alanı ekle
ALTER TABLE promotions
    ADD COLUMN IF NOT EXISTS is_couponable BOOLEAN DEFAULT TRUE;

-- Ziraat Bankası Kredi Kartı gibi kupon üretilemeyen promosyonları kapat
-- (slug veya title ile eşleştir - slug varsa daha güvenli)
UPDATE promotions
SET is_couponable = FALSE
WHERE
    title ILIKE '%ziraat%'
    OR title ILIKE '%kredi kart%'
    OR slug ILIKE '%ziraat%';
