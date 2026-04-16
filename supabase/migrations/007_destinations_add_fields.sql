-- ============================================================
-- 007: DESTINATIONS — villa_count, tags, image_url alanları ekle
-- ============================================================

-- Yeni sütunlar ekle
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS villa_count INT DEFAULT 0;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- image_url zaten var ama boş — tüm kayıtlara unsplash görselleri ekle
UPDATE destinations SET image_url = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80', villa_count = 115, tags = ARRAY['Muhafazakar', 'Özel Havuzlu', 'Deniz Manzaralı', 'Plaja Yakın Villalar', 'Uygun Fiyatlarla'] WHERE slug = 'kalkan-merkez';
UPDATE destinations SET image_url = 'https://images.unsplash.com/photo-1602391833977-358a52198938?w=800&q=80', villa_count = 19, tags = ARRAY['Muhafazakar', 'Özel Havuzlu', 'Deniz Manzaralı', 'Plaja Yakın Villalar', 'Uygun Fiyatlarla'] WHERE slug = 'kalkan-kalamar';
UPDATE destinations SET image_url = 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80', villa_count = 1, tags = ARRAY['Muhafazakar', 'Özel Havuzlu', 'Deniz Manzaralı', 'Plaja Yakın Villalar', 'Uygun Fiyatlarla'] WHERE slug = 'kalkan-komurluk';
UPDATE destinations SET image_url = 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800&q=80', villa_count = 19, tags = ARRAY['Muhafazakar', 'Özel Havuzlu', 'Deniz Manzaralı', 'Plaja Yakın Villalar', 'Uygun Fiyatlarla'] WHERE slug = 'kalkan-kisla';
UPDATE destinations SET image_url = 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80', villa_count = 42, tags = ARRAY['Muhafazakar', 'Özel Havuzlu', 'Deniz Manzaralı', 'Plaja Yakın Villalar', 'Uygun Fiyatlarla'] WHERE slug = 'kalkan-ortaalan';
UPDATE destinations SET image_url = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', villa_count = 35, tags = ARRAY['Muhafazakar', 'Özel Havuzlu', 'Deniz Manzaralı', 'Plaja Yakın Villalar', 'Uygun Fiyatlarla'] WHERE slug = 'kalkan-kiziltas';
UPDATE destinations SET image_url = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', villa_count = 12, tags = ARRAY['Muhafazakar', 'Özel Havuzlu', 'Deniz Manzaralı', 'Plaja Yakın Villalar', 'Uygun Fiyatlarla'] WHERE slug = 'kalkan-patara';
UPDATE destinations SET image_url = 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80', villa_count = 8, tags = ARRAY['Muhafazakar', 'Özel Havuzlu', 'Deniz Manzaralı', 'Plaja Yakın Villalar', 'Uygun Fiyatlarla'] WHERE slug = 'kalkan-ulugol';
UPDATE destinations SET image_url = 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80', villa_count = 74, tags = ARRAY['Muhafazakar', 'Özel Havuzlu', 'Deniz Manzaralı', 'Plaja Yakın Villalar', 'Uygun Fiyatlarla'] WHERE slug = 'kalkan-kordere';
UPDATE destinations SET image_url = 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80', villa_count = 63, tags = ARRAY['Muhafazakar', 'Özel Havuzlu', 'Deniz Manzaralı', 'Plaja Yakın Villalar', 'Uygun Fiyatlarla'] WHERE slug = 'kalkan-islamlar';
UPDATE destinations SET image_url = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', villa_count = 28, tags = ARRAY['Muhafazakar', 'Özel Havuzlu', 'Deniz Manzaralı', 'Plaja Yakın Villalar', 'Uygun Fiyatlarla'] WHERE slug = 'kalkan-uzumlu';
UPDATE destinations SET image_url = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80', villa_count = 7, tags = ARRAY['Muhafazakar', 'Özel Havuzlu', 'Deniz Manzaralı', 'Plaja Yakın Villalar', 'Uygun Fiyatlarla'] WHERE slug = 'kalkan-bezirgan';
UPDATE destinations SET image_url = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', villa_count = 9, tags = ARRAY['Muhafazakar', 'Özel Havuzlu', 'Deniz Manzaralı', 'Plaja Yakın Villalar', 'Uygun Fiyatlarla'] WHERE slug = 'kalkan-saribelen';
UPDATE destinations SET image_url = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', villa_count = 15, tags = ARRAY['Muhafazakar', 'Özel Havuzlu', 'Deniz Manzaralı', 'Plaja Yakın Villalar', 'Uygun Fiyatlarla'] WHERE slug = 'kalkan-yesilkoy';
UPDATE destinations SET image_url = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80', villa_count = 24, tags = ARRAY['Muhafazakar', 'Özel Havuzlu', 'Deniz Manzaralı', 'Plaja Yakın Villalar', 'Uygun Fiyatlarla'] WHERE slug = 'kas-merkez';
UPDATE destinations SET image_url = 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80', villa_count = 34, tags = ARRAY['Muhafazakar', 'Özel Havuzlu', 'Deniz Manzaralı', 'Plaja Yakın Villalar', 'Uygun Fiyatlarla'] WHERE slug = 'fethiye';
UPDATE destinations SET image_url = 'https://images.unsplash.com/photo-1582610116397-edb318620f90?w=800&q=80', villa_count = 15, tags = ARRAY['Muhafazakar', 'Özel Havuzlu', 'Deniz Manzaralı', 'Plaja Yakın Villalar', 'Uygun Fiyatlarla'] WHERE slug = 'belek';
