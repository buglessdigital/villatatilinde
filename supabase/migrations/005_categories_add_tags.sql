-- ============================================================
-- 005: Categories tablosuna eksik alanları ekle + tags verisi güncelle
-- KategorilerContent sayfası tags ve villaCount kullanıyor
-- ============================================================

-- 1. Tags kolonu ekle (text array)
ALTER TABLE categories ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- 2. Villa count kolonu ekle (şimdilik statik, ileride trigger ile otomatik sayılabilir)
ALTER TABLE categories ADD COLUMN IF NOT EXISTS villa_count INT DEFAULT 0;

-- 3. Tags ve villa_count verilerini güncelle
UPDATE categories SET tags = ARRAY['Özel Havuzlu', 'Deniz Manzaralı', 'Plaja Yakın ve Uygun Fiyatlı Villalar'], villa_count = 227 WHERE slug = 'ekonomik-villalar';
UPDATE categories SET tags = ARRAY['Özel Havuzlu', 'Deniz Manzaralı', 'Plaja Yakın ve Uygun Fiyatlı Villalar'], villa_count = 143 WHERE slug = 'muhafazakar-villalar';
UPDATE categories SET tags = ARRAY['Özel Havuzlu', 'Deniz Manzaralı', 'Plaja Yakın ve Uygun Fiyatlı Villalar'], villa_count = 155 WHERE slug = 'balayi-villalari';
UPDATE categories SET tags = ARRAY['Özel Havuzlu', 'Deniz Manzaralı', 'Plaja Yakın ve Uygun Fiyatlı Villalar'], villa_count = 49  WHERE slug = 'ultralux-villalar';
UPDATE categories SET tags = ARRAY['Özel Havuzlu', 'Deniz Manzaralı', 'Plaja Yakın ve Uygun Fiyatlı Villalar'], villa_count = 174 WHERE slug = 'merkezi-konumda-villalar';
UPDATE categories SET tags = ARRAY['Özel Havuzlu', 'Deniz Manzaralı', 'Plaja Yakın ve Uygun Fiyatlı Villalar'], villa_count = 152 WHERE slug = 'denize-yakin-villalar';
UPDATE categories SET tags = ARRAY['Özel Havuzlu', 'Deniz Manzaralı', 'Plaja Yakın ve Uygun Fiyatlı Villalar'], villa_count = 233 WHERE slug = 'deniz-manzarali-villalar';
UPDATE categories SET tags = ARRAY['Özel Havuzlu', 'Deniz Manzaralı', 'Plaja Yakın ve Uygun Fiyatlı Villalar'], villa_count = 292 WHERE slug = 'doga-manzarali-villalar';
UPDATE categories SET tags = ARRAY['Özel Havuzlu', 'Deniz Manzaralı', 'Plaja Yakın ve Uygun Fiyatlı Villalar'], villa_count = 89  WHERE slug = 'muhafazakar-havuzlu-villalar';
UPDATE categories SET tags = ARRAY['Özel Havuzlu', 'Deniz Manzaralı', 'Plaja Yakın ve Uygun Fiyatlı Villalar'], villa_count = 67  WHERE slug = 'jakuzili-villalar';
UPDATE categories SET tags = ARRAY['Özel Havuzlu', 'Deniz Manzaralı', 'Plaja Yakın ve Uygun Fiyatlı Villalar'], villa_count = 75  WHERE slug = 'cocuk-havuzlu-villalar';
UPDATE categories SET tags = ARRAY['Özel Havuzlu', 'Deniz Manzaralı', 'Plaja Yakın ve Uygun Fiyatlı Villalar'], villa_count = 38  WHERE slug = 'yeni-villalar';

-- ✅ Doğrulama
-- SELECT slug, name, villa_count, tags FROM categories ORDER BY sort_order;
