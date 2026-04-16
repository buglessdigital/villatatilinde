-- ============================================================
-- 004: ÖRNEK VİLLA EKLEMESİ (Test Data)
-- Bir villayı tüm ilişkileriyle birlikte ekler:
--   → villa_images (6 görsel)
--   → villa_features (10 özellik)
--   → villa_categories (3 kategori)
--   → villa_price_periods (4 dönem)
--   → villa_disabled_dates (3 dolu tarih)
--   → reviews (2 yorum)
-- ============================================================

-- Geçici değişkenler için DO bloğu kullanıyoruz
DO $$
DECLARE
    v_villa_id UUID;
    v_destination_id UUID;
BEGIN

-- ─── 1. Bölge ID'sini al ───
SELECT id INTO v_destination_id FROM destinations WHERE slug = 'kalkan-bezirgan';

-- ─── 2. Villa Ekle ───
INSERT INTO villas (
    slug, name, ref_code,
    destination_id, location_label, address,
    position_lat, position_lng, map_iframe_url,
    max_guests, bedrooms, beds, bathrooms, rooms,
    pool_width, pool_length, pool_depth, pool_shared, pool_fence,
    currency, min_price, max_price,
    cover_image_url,
    description_tr, description_en, description_html,
    summary_tr,
    seo_title, seo_description,
    deposit_amount, cleaning_fee,
    min_nights, min_nights_cleaning, check_in_time, check_out_time,
    commission_pct, license_no,
    pets_allowed, smoking_allowed, parties_allowed, loud_music_allowed,
    avg_rating, review_count,
    owner_name, owner_phone, owner_iban, owner_notes,
    is_published, sort_order
) VALUES (
    'villa-doga', 'Villa Doğa', 'VTO26',
    v_destination_id, 'Kalkan Bezirgan', 'Bezirgan Köyü, Kalkan',
    36.3957, 29.4164, 'https://yandex.com.tr/map-widget/v1/?um=constructor%3A323dd7906d9e6dd2d30af325b36db8cd0918a90a66969f767a8041223d445e25&source=constructor',
    6, 3, 3, 3, 4,
    3.0, 7.0, 1.55, false, false,
    'TRY', 12000, 14904,
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
    'Villa Doğa, Kalkan Bezirgan Köyü''nde doğa içerisinde, 3 yatak odası ve 6 kişi konaklama kapasitesine sahiptir. Villamız taş ve ahşap mimariye sahiptir.',
    'Villa Doga is located in the nature of Kalkan Bezirgan Village, with 3 bedrooms and a capacity of 6 people.',
    '<p>Villa Doğa, Kalkan Bezirgan Köyü''nde doğa içerisinde, 3 yatak odası ve 6 kişi konaklama kapasitesine sahiptir. Villamız taş ve ahşap mimariye sahiptir. Villamızda badem ağaçlarının yer aldığı yemyeşil geniş bahçe alanı, özel havuzu, terası, enerji kesilmesi durumda güneş enerji sistemi bulunmaktadır.</p><p><strong>NOT: Elektrikli aracı olan misafirlerimiz için villamızda şarj istasyonu mevcuttur.</strong></p>',
    'Kalkan Bezirgan''da doğa içinde, taş ve ahşap mimarili, özel havuzlu 3 yatak odalı villa.',
    'Villa Doğa | Kalkan Bezirgan Kiralık Villa | Villa Tatilinde',
    'Villa Doğa - Kalkan Bezirgan Köyü''nde doğa içerisinde özel havuzlu kiralık villa. 3 yatak odası, 6 kişi kapasiteli.',
    5000, 4000,
    4, 4, '16:00', '10:00',
    30, '07-7039',
    false, false, false, false,
    4.8, 3,
    'Ahmet Yılmaz', '+905321234567', 'TR00 0001 0002 0003 0004 0005 00', 'Elektrik şarj istasyonu mevcut',
    true, 1
) RETURNING id INTO v_villa_id;

RAISE NOTICE 'Villa eklendi: %', v_villa_id;

-- ─── 3. Villa Görselleri ───
INSERT INTO villa_images (villa_id, url, media_type, is_cover, sort_order) VALUES
    (v_villa_id, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200', 'image', true, 1),
    (v_villa_id, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200', 'image', false, 2),
    (v_villa_id, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200', 'image', false, 3),
    (v_villa_id, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200', 'image', false, 4),
    (v_villa_id, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200', 'image', false, 5),
    (v_villa_id, 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200', 'image', false, 6);

RAISE NOTICE 'Görseller eklendi';

-- ─── 4. Villa Özellikleri ───
INSERT INTO villa_features (villa_id, feature_id)
SELECT v_villa_id, id FROM features WHERE key IN (
    'privatePool',
    'kidPoolVillas',
    'balcony',
    'gardenLounge',
    'airConditioning',
    'wifi',
    'fridge',
    'washingMac',
    'dishWasher',
    'oven',
    'iron'
);

RAISE NOTICE 'Özellikler eklendi';

-- ─── 5. Villa Kategorileri ───
INSERT INTO villa_categories (villa_id, category_id)
SELECT v_villa_id, id FROM categories WHERE slug IN (
    'ekonomik-villalar',
    'doga-manzarali-villalar',
    'cocuk-havuzlu-villalar'
);

RAISE NOTICE 'Kategoriler eklendi';

-- ─── 6. Fiyat Dönemleri ───
INSERT INTO villa_price_periods (villa_id, label, start_date, end_date, nightly_price, weekly_price, discount_pct, original_price, min_nights, sort_order) VALUES
    (v_villa_id, '01 - 31 Mayıs',             '2026-05-01', '2026-05-31', 12000, 84000,  0,  NULL,  4, 1),
    (v_villa_id, '01 Haziran - 31 Ağustos',    '2026-06-01', '2026-08-31', 14904, 104328, 8,  16200, 4, 2),
    (v_villa_id, '01 - 30 Eylül',             '2026-09-01', '2026-09-30', 13440, 94080,  4,  14000, 4, 3),
    (v_villa_id, '01 - 31 Ekim',              '2026-10-01', '2026-10-31', 12000, 84000,  0,  NULL,  4, 4);

RAISE NOTICE 'Fiyat dönemleri eklendi';

-- ─── 7. Dolu Tarihler ───
INSERT INTO villa_disabled_dates (villa_id, start_date, end_date, block_type, notes) VALUES
    (v_villa_id, '2026-06-15', '2026-06-22', 'reserved', 'Onaylı rezervasyon'),
    (v_villa_id, '2026-07-10', '2026-07-17', 'reserved', 'Onaylı rezervasyon'),
    (v_villa_id, '2026-08-01', '2026-08-07', 'option',   'Opsiyonlu — onay bekliyor');

RAISE NOTICE 'Dolu tarihler eklendi';

-- ─── 8. Yorumlar ───
INSERT INTO reviews (villa_id, author_name, rating, comment, nights_stayed, stay_period, is_published) VALUES
    (v_villa_id, 'Mehmet K.', 5.0, 'Harika bir tatil geçirdik. Villa çok temiz ve bakımlıydı. Havuz mükemmeldi. Doğa ile iç içe bir deneyim yaşadık. Kesinlikle tekrar geleceğiz.', 7, 'Ağustos 2025', true),
    (v_villa_id, 'Ayşe T.',  4.5, 'Villa gerçekten çok güzeldi. Sadece markete biraz uzak ama araçla sorun değil. Bahçe muhteşemdi, çocuklar çok eğlendi.', 4, 'Temmuz 2025', true),
    (v_villa_id, 'Ali Y.',   5.0, 'Mükemmel bir villa. Sessiz, huzurlu ve doğa ile iç içe. Taş ve ahşap mimarisi çok hoşumuza gitti. Havuz yeterli büyüklükteydi.', 5, 'Haziran 2025', true);

RAISE NOTICE 'Yorumlar eklendi';

END $$;


-- ═══════════════════════════════════════════════════════════
-- ✅ DOĞRULAMA — Villanın tüm verileriyle geldiğini kontrol et
-- ═══════════════════════════════════════════════════════════

-- Villa temel bilgileri
SELECT v.name, v.ref_code, v.location_label, v.max_guests, v.bedrooms, v.min_price, v.is_published
FROM villas v WHERE v.slug = 'villa-doga';

-- Villa görselleri
SELECT vi.url, vi.is_cover, vi.sort_order
FROM villa_images vi
JOIN villas v ON v.id = vi.villa_id
WHERE v.slug = 'villa-doga'
ORDER BY vi.sort_order;

-- Villa özellikleri
SELECT f.label_tr, f.group_type
FROM villa_features vf
JOIN features f ON f.id = vf.feature_id
JOIN villas v ON v.id = vf.villa_id
WHERE v.slug = 'villa-doga';

-- Villa kategorileri
SELECT c.name
FROM villa_categories vc
JOIN categories c ON c.id = vc.category_id
JOIN villas v ON v.id = vc.villa_id
WHERE v.slug = 'villa-doga';

-- Fiyat dönemleri
SELECT vpp.label, vpp.nightly_price, vpp.weekly_price, vpp.discount_pct
FROM villa_price_periods vpp
JOIN villas v ON v.id = vpp.villa_id
WHERE v.slug = 'villa-doga'
ORDER BY vpp.sort_order;

-- Dolu tarihler
SELECT vdd.start_date, vdd.end_date, vdd.block_type
FROM villa_disabled_dates vdd
JOIN villas v ON v.id = vdd.villa_id
WHERE v.slug = 'villa-doga';

-- Yorumlar
SELECT r.author_name, r.rating, r.nights_stayed, r.stay_period
FROM reviews r
JOIN villas v ON v.id = r.villa_id
WHERE v.slug = 'villa-doga';
