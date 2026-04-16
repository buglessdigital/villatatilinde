-- ============================================================
-- 008: 5 YENİ VİLLA EKLEMESİ
-- Farklı bölge, fiyat ve özelliklerde 5 villa + ilişkili veriler
-- ============================================================

-- ═══════════════════════════════════════════════════════════
-- 1. VILLA KALKAN ELITE — Kalkan Merkez, Ultra Lüks
-- ═══════════════════════════════════════════════════════════

DO $$
DECLARE
    v_villa_id UUID;
    v_destination_id UUID;
BEGIN

SELECT id INTO v_destination_id FROM destinations WHERE slug = 'kalkan-merkez';

INSERT INTO villas (
    slug, name, ref_code,
    destination_id, location_label, address,
    position_lat, position_lng, map_iframe_url,
    max_guests, bedrooms, beds, bathrooms, rooms,
    pool_width, pool_length, pool_depth, pool_shared, pool_fence,
    currency, min_price, max_price,
    cover_image_url,
    description_tr, description_en, description_html, summary_tr,
    seo_title, seo_description,
    deposit_amount, cleaning_fee,
    min_nights, min_nights_cleaning, check_in_time, check_out_time,
    commission_pct, license_no,
    pets_allowed, smoking_allowed, parties_allowed, loud_music_allowed,
    avg_rating, review_count,
    owner_name, owner_phone, owner_iban, owner_notes,
    is_published, sort_order,
    has_active_discount, max_discount_pct
) VALUES (
    'villa-kalkan-elite', 'Villa Kalkan Elite', 'VTO71',
    v_destination_id, 'Kalkan Merkez', 'Merkez Mah.',
    36.2648, 29.4132, '',
    8, 4, 4, 4, 5,
    4.0, 10.0, 1.60, false, true,
    'TRY', 18000, 28000,
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    'Villa Kalkan Elite, Kalkan Merkez''de deniz manzaralı, 4 yatak odalı ultra lüks bir villadır. Sonsuzluk havuzu, jakuzi, sauna ve sinema odası gibi premium özellikler sunar.',
    'Villa Kalkan Elite is an ultra-luxury 4-bedroom villa in Kalkan Center with sea views, infinity pool, jacuzzi, sauna and cinema room.',
    '<p>Villa Kalkan Elite, Kalkan Merkez''de deniz manzaralı, 4 yatak odalı ultra lüks bir villadır. Sonsuzluk havuzu, jakuzi, sauna ve sinema odası gibi premium özellikler sunar. Modern mimarisi ve geniş terasıyla unutulmaz bir tatil deneyimi yaşatır.</p>',
    'Kalkan Merkez''de deniz manzaralı ultra lüks 4 yatak odalı villa.',
    'Villa Kalkan Elite | Kalkan Merkez Kiralık Ultra Lüks Villa',
    'Kalkan Merkez''de ultra lüks kiralık villa. 4 yatak, 8 kişi, sonsuzluk havuzu, jakuzi, sauna.',
    10000, 6000,
    5, 5, '16:00', '10:00',
    25, '07-8001',
    false, false, false, false,
    4.9, 5,
    'Mustafa Demir', '+905551112233', 'TR00 0001 0002 0003 0004 0005 01', 'VIP misafirler için ek hizmet verilir',
    true, 2,
    true, 12
) RETURNING id INTO v_villa_id;

-- Görseller
INSERT INTO villa_images (villa_id, url, media_type, is_cover, sort_order) VALUES
    (v_villa_id, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200', 'image', true, 1),
    (v_villa_id, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200', 'image', false, 2),
    (v_villa_id, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200', 'image', false, 3),
    (v_villa_id, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200', 'image', false, 4),
    (v_villa_id, 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200', 'image', false, 5);

-- Özellikler
INSERT INTO villa_features (villa_id, feature_id)
SELECT v_villa_id, id FROM features WHERE key IN (
    'infinityPool', 'jacuzziVillas', 'sauna', 'cinemaRoom', 'seaview', 'ultraLux',
    'balcony', 'gardenLounge', 'airConditioning', 'wifi', 'smartTv', 'fridge', 'dishWasher', 'oven', 'iron'
);

-- Kategoriler
INSERT INTO villa_categories (villa_id, category_id)
SELECT v_villa_id, id FROM categories WHERE slug IN (
    'ultralux-villalar', 'deniz-manzarali-villalar', 'jakuzili-villalar'
);

-- Fiyat Dönemleri
INSERT INTO villa_price_periods (villa_id, label, start_date, end_date, nightly_price, weekly_price, discount_pct, original_price, min_nights, sort_order) VALUES
    (v_villa_id, '01 - 31 Mayıs',           '2026-05-01', '2026-05-31', 18000,  126000, 0,  NULL,  5, 1),
    (v_villa_id, '01 Haziran - 15 Temmuz',   '2026-06-01', '2026-07-15', 24000,  168000, 10, 26700, 5, 2),
    (v_villa_id, '16 Temmuz - 31 Ağustos',   '2026-07-16', '2026-08-31', 28000,  196000, 12, 31800, 5, 3),
    (v_villa_id, '01 - 30 Eylül',           '2026-09-01', '2026-09-30', 22000,  154000, 5,  23200, 5, 4),
    (v_villa_id, '01 - 31 Ekim',            '2026-10-01', '2026-10-31', 18000,  126000, 0,  NULL,  5, 5);

-- Dolu Tarihler
INSERT INTO villa_disabled_dates (villa_id, start_date, end_date, block_type, notes) VALUES
    (v_villa_id, '2026-06-20', '2026-06-30', 'reserved', 'Onaylı rezervasyon'),
    (v_villa_id, '2026-07-20', '2026-08-03', 'reserved', 'Onaylı rezervasyon');

-- Yorumlar
INSERT INTO reviews (villa_id, author_name, rating, comment, nights_stayed, stay_period, is_published) VALUES
    (v_villa_id, 'Selin A.', 5.0, 'Rüya gibi bir villaydı! Sonsuzluk havuzu manzarasıyla nefes kesici. Jakuzi ve sauna harika. Kesinlikle tekrar geleceğiz.', 7, 'Temmuz 2025', true),
    (v_villa_id, 'Burak M.', 4.8, 'Ultra lüks diye abartmamışlar. Her detay düşünülmüş. Sinema odası çocukların favorisi oldu. Merkeze de yürüme mesafesinde.', 5, 'Ağustos 2025', true),
    (v_villa_id, 'Deniz K.', 5.0, 'En iyi tatilimiz! Villa gerçekten her şeyiyle mükemmeldi. Manzara, havuz, temizlik... Hepsi 10/10.', 6, 'Haziran 2025', true);

RAISE NOTICE '✅ Villa Kalkan Elite eklendi';
END $$;


-- ═══════════════════════════════════════════════════════════
-- 2. VILLA SUNSET — Kalkan Kızıltaş, Balayı
-- ═══════════════════════════════════════════════════════════

DO $$
DECLARE
    v_villa_id UUID;
    v_destination_id UUID;
BEGIN

SELECT id INTO v_destination_id FROM destinations WHERE slug = 'kalkan-kiziltas';

INSERT INTO villas (
    slug, name, ref_code,
    destination_id, location_label, address,
    position_lat, position_lng, map_iframe_url,
    max_guests, bedrooms, beds, bathrooms, rooms,
    pool_width, pool_length, pool_depth, pool_shared, pool_fence,
    currency, min_price, max_price,
    cover_image_url,
    description_tr, description_en, description_html, summary_tr,
    seo_title, seo_description,
    deposit_amount, cleaning_fee,
    min_nights, min_nights_cleaning, check_in_time, check_out_time,
    commission_pct, license_no,
    pets_allowed, smoking_allowed, parties_allowed, loud_music_allowed,
    avg_rating, review_count,
    owner_name, owner_phone, owner_iban, owner_notes,
    is_published, sort_order
) VALUES (
    'villa-sunset', 'Villa Sunset', 'VTO35',
    v_destination_id, 'Kalkan Kızıltaş', 'Kızıltaş Mevkii, Kalkan',
    36.2712, 29.4081, '',
    4, 2, 2, 2, 3,
    3.0, 6.0, 1.40, false, true,
    'TRY', 8000, 14000,
    'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800',
    'Villa Sunset, Kalkan Kızıltaş''ta muhafazakar havuzlu, 2 yatak odalı balayı villasıdır. Mahremiyet ve huzur arayanlar için idealdir.',
    'Villa Sunset is a 2-bedroom honeymoon villa in Kalkan Kızıltaş with a private pool — ideal for couples.',
    '<p>Villa Sunset, Kalkan Kızıltaş''ta muhafazakar havuzlu özel bir balayı villasıdır. 2 yatak odası ve 4 kişi kapasitesiyle çiftler ve küçük aileler için tasarlanmıştır. Havuz tamamen dışarıdan görünmez, gün batımı manzarası muhteşemdir.</p>',
    'Kalkan Kızıltaş''ta muhafazakar havuzlu balayı villası.',
    'Villa Sunset | Kalkan Kızıltaş Balayı Villası | Villa Tatilinde',
    'Kalkan Kızıltaş''ta muhafazakar havuzlu kiralık balayı villası. 2 yatak odası, 4 kişi kapasiteli.',
    3000, 2500,
    3, 3, '16:00', '10:00',
    30, '07-7055',
    false, false, false, false,
    4.7, 4,
    'Zeynep Kaya', '+905442223344', 'TR00 0001 0002 0003 0004 0005 02', '',
    true, 3
) RETURNING id INTO v_villa_id;

INSERT INTO villa_images (villa_id, url, media_type, is_cover, sort_order) VALUES
    (v_villa_id, 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=1200', 'image', true, 1),
    (v_villa_id, 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200', 'image', false, 2),
    (v_villa_id, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200', 'image', false, 3),
    (v_villa_id, 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200', 'image', false, 4);

INSERT INTO villa_features (villa_id, feature_id)
SELECT v_villa_id, id FROM features WHERE key IN (
    'privatePool', 'isolatedPoolVillas', 'honeyMoon', 'isolatedVillas',
    'balcony', 'gardenLounge', 'airConditioning', 'wifi', 'smartTv', 'fridge', 'washingMac', 'oven'
);

INSERT INTO villa_categories (villa_id, category_id)
SELECT v_villa_id, id FROM categories WHERE slug IN (
    'balayi-villalari', 'muhafazakar-villalar', 'muhafazakar-havuzlu-villalar'
);

INSERT INTO villa_price_periods (villa_id, label, start_date, end_date, nightly_price, weekly_price, discount_pct, original_price, min_nights, sort_order) VALUES
    (v_villa_id, '01 - 31 Mayıs',           '2026-05-01', '2026-05-31', 8000,  56000,  0,  NULL,  3, 1),
    (v_villa_id, '01 Haziran - 31 Ağustos',  '2026-06-01', '2026-08-31', 14000, 98000,  10, 15600, 3, 2),
    (v_villa_id, '01 - 30 Eylül',           '2026-09-01', '2026-09-30', 10000, 70000,  0,  NULL,  3, 3),
    (v_villa_id, '01 - 31 Ekim',            '2026-10-01', '2026-10-31', 8000,  56000,  0,  NULL,  3, 4);

INSERT INTO villa_disabled_dates (villa_id, start_date, end_date, block_type, notes) VALUES
    (v_villa_id, '2026-07-01', '2026-07-10', 'reserved', 'Onaylı rezervasyon');

INSERT INTO reviews (villa_id, author_name, rating, comment, nights_stayed, stay_period, is_published) VALUES
    (v_villa_id, 'Elif S.', 5.0, 'Balayımız için mükemmel bir seçimdi. Havuz tam muhafazakar, dışarıdan kesinlikle görünmüyor. Gün batımı manzarası efsane!', 5, 'Ağustos 2025', true),
    (v_villa_id, 'Can B.', 4.5, 'Sessiz ve huzurlu bir ortam. Çiftler için biçilmiş kaftan. Sadece markete biraz uzak.', 3, 'Temmuz 2025', true);

RAISE NOTICE '✅ Villa Sunset eklendi';
END $$;


-- ═══════════════════════════════════════════════════════════
-- 3. VILLA AQUA — Kalkan Kalamar, Denize Yakın
-- ═══════════════════════════════════════════════════════════

DO $$
DECLARE
    v_villa_id UUID;
    v_destination_id UUID;
BEGIN

SELECT id INTO v_destination_id FROM destinations WHERE slug = 'kalkan-kalamar';

INSERT INTO villas (
    slug, name, ref_code,
    destination_id, location_label, address,
    position_lat, position_lng, map_iframe_url,
    max_guests, bedrooms, beds, bathrooms, rooms,
    pool_width, pool_length, pool_depth, pool_shared, pool_fence,
    currency, min_price, max_price,
    cover_image_url,
    description_tr, description_en, description_html, summary_tr,
    seo_title, seo_description,
    deposit_amount, cleaning_fee,
    min_nights, min_nights_cleaning, check_in_time, check_out_time,
    commission_pct, license_no,
    pets_allowed, smoking_allowed, parties_allowed, loud_music_allowed,
    avg_rating, review_count,
    owner_name, owner_phone, owner_iban, owner_notes,
    is_published, sort_order,
    has_active_discount, max_discount_pct
) VALUES (
    'villa-aqua', 'Villa Aqua', 'VTO42',
    v_destination_id, 'Kalkan Kalamar', 'Kalamar Koyu, Kalkan',
    36.2580, 29.4220, '',
    10, 5, 5, 5, 6,
    5.0, 12.0, 1.65, false, false,
    'TRY', 22000, 35000,
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    'Villa Aqua, Kalkan Kalamar''da denize yürüme mesafesinde, 5 yatak odalı geniş bir villadır. Büyük aileler ve arkadaş grupları için idealdir.',
    'Villa Aqua is a 5-bedroom villa in Kalkan Kalamar, walking distance to the sea, ideal for large families.',
    '<p>Villa Aqua, ünlü Kalamar Koyu''na sadece 200 metre mesafede konumlanmış geniş ve ferah bir villadır. 5 yatak odası, büyük havuzu ve deniz manzarasıyla 10 kişiye kadar rahat konaklama imkânı sunar. Aileler ve arkadaş grupları için mükemmel.</p>',
    'Kalkan Kalamar''da denize yakın, 5 yatak odalı geniş villa.',
    'Villa Aqua | Kalkan Kalamar Denize Yakın Villa | Villa Tatilinde',
    'Kalkan Kalamar''da denize yürüme mesafesinde kiralık villa. 5 yatak, 10 kişi kapasiteli.',
    8000, 5000,
    5, 5, '16:00', '10:00',
    25, '07-8015',
    false, false, false, false,
    4.6, 3,
    'Ali Aydın', '+905333445566', 'TR00 0001 0002 0003 0004 0005 03', 'Denize 200m',
    true, 4,
    true, 8
) RETURNING id INTO v_villa_id;

INSERT INTO villa_images (villa_id, url, media_type, is_cover, sort_order) VALUES
    (v_villa_id, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200', 'image', true, 1),
    (v_villa_id, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200', 'image', false, 2),
    (v_villa_id, 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200', 'image', false, 3),
    (v_villa_id, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200', 'image', false, 4),
    (v_villa_id, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200', 'image', false, 5);

INSERT INTO villa_features (villa_id, feature_id)
SELECT v_villa_id, id FROM features WHERE key IN (
    'privatePool', 'kidPoolVillas', 'seaview', 'beachVillas',
    'balcony', 'gardenLounge', 'airConditioning', 'wifi', 'smartTv',
    'fridge', 'washingMac', 'dishWasher', 'oven', 'iron', 'kitchen'
);

INSERT INTO villa_categories (villa_id, category_id)
SELECT v_villa_id, id FROM categories WHERE slug IN (
    'denize-yakin-villalar', 'deniz-manzarali-villalar', 'cocuk-havuzlu-villalar'
);

INSERT INTO villa_price_periods (villa_id, label, start_date, end_date, nightly_price, weekly_price, discount_pct, original_price, min_nights, sort_order) VALUES
    (v_villa_id, '15 Mayıs - 15 Haziran',    '2026-05-15', '2026-06-15', 22000, 154000, 0,  NULL,  5, 1),
    (v_villa_id, '16 Haziran - 15 Temmuz',    '2026-06-16', '2026-07-15', 28000, 196000, 5,  29500, 5, 2),
    (v_villa_id, '16 Temmuz - 31 Ağustos',    '2026-07-16', '2026-08-31', 35000, 245000, 8,  38000, 7, 3),
    (v_villa_id, '01 - 30 Eylül',            '2026-09-01', '2026-09-30', 25000, 175000, 0,  NULL,  5, 4);

INSERT INTO villa_disabled_dates (villa_id, start_date, end_date, block_type, notes) VALUES
    (v_villa_id, '2026-07-15', '2026-07-25', 'reserved', 'Onaylı rezervasyon'),
    (v_villa_id, '2026-08-10', '2026-08-20', 'reserved', 'Onaylı rezervasyon');

INSERT INTO reviews (villa_id, author_name, rating, comment, nights_stayed, stay_period, is_published) VALUES
    (v_villa_id, 'Hakan T.', 4.5, 'Kalamar Koyu''na yürüyerek indik her gün. Villa çok geniş, 3 aile birden rahatça kaldık. Havuz büyük ve çocuklar için güvenli alan var.', 7, 'Ağustos 2025', true),
    (v_villa_id, 'Pınar G.', 5.0, 'Denize bu kadar yakın bir villada bu kaliteyi bulmak zor. Her şey mükemmeldi. Tekrar geleceğiz!', 5, 'Temmuz 2025', true);

RAISE NOTICE '✅ Villa Aqua eklendi';
END $$;


-- ═══════════════════════════════════════════════════════════
-- 4. VILLA HUZUR — Kalkan İslamlar, Ekonomik
-- ═══════════════════════════════════════════════════════════

DO $$
DECLARE
    v_villa_id UUID;
    v_destination_id UUID;
BEGIN

SELECT id INTO v_destination_id FROM destinations WHERE slug = 'kalkan-islamlar';

INSERT INTO villas (
    slug, name, ref_code,
    destination_id, location_label, address,
    position_lat, position_lng, map_iframe_url,
    max_guests, bedrooms, beds, bathrooms, rooms,
    pool_width, pool_length, pool_depth, pool_shared, pool_fence,
    currency, min_price, max_price,
    cover_image_url,
    description_tr, description_en, description_html, summary_tr,
    seo_title, seo_description,
    deposit_amount, cleaning_fee,
    min_nights, min_nights_cleaning, check_in_time, check_out_time,
    commission_pct, license_no,
    pets_allowed, smoking_allowed, parties_allowed, loud_music_allowed,
    avg_rating, review_count,
    owner_name, owner_phone, owner_iban, owner_notes,
    is_published, sort_order
) VALUES (
    'villa-huzur', 'Villa Huzur', 'VTO18',
    v_destination_id, 'Kalkan İslamlar', 'İslamlar Köyü, Kalkan',
    36.3100, 29.3900, '',
    6, 3, 3, 2, 4,
    3.0, 7.0, 1.40, false, false,
    'TRY', 6000, 10000,
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
    'Villa Huzur, Kalkan İslamlar Köyü''nde doğa içinde ekonomik fiyatlı bir villadır. Aileler için ideal.',
    'Villa Huzur is an affordable villa in Kalkan Islamlar Village surrounded by nature.',
    '<p>Villa Huzur, İslamlar Köyü''nün huzurlu atmosferinde, uygun fiyatlarla kaliteli bir tatil sunar. 3 yatak odası, özel havuzu ve geniş bahçesiyle aileler için mükemmel bir seçimdir. Doğa yürüyüş rotalarına yakın konumdadır.</p>',
    'İslamlar''da ekonomik fiyatlı, doğa içinde 3 yatak odalı villa.',
    'Villa Huzur | Kalkan İslamlar Ekonomik Villa | Villa Tatilinde',
    'İslamlar Köyü''nde ekonomik fiyatlı kiralık villa. 3 yatak, 6 kişi, özel havuz.',
    2000, 2000,
    3, 3, '16:00', '10:00',
    35, '07-7012',
    false, false, false, false,
    4.4, 2,
    'Fatma Yıldız', '+905667788990', 'TR00 0001 0002 0003 0004 0005 04', '',
    true, 5
) RETURNING id INTO v_villa_id;

INSERT INTO villa_images (villa_id, url, media_type, is_cover, sort_order) VALUES
    (v_villa_id, 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200', 'image', true, 1),
    (v_villa_id, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200', 'image', false, 2),
    (v_villa_id, 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200', 'image', false, 3),
    (v_villa_id, 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200', 'image', false, 4);

INSERT INTO villa_features (villa_id, feature_id)
SELECT v_villa_id, id FROM features WHERE key IN (
    'privatePool', 'affordableVillas', 'natureview',
    'balcony', 'gardenLounge', 'airConditioning', 'wifi', 'fridge', 'washingMac', 'oven', 'iron'
);

INSERT INTO villa_categories (villa_id, category_id)
SELECT v_villa_id, id FROM categories WHERE slug IN (
    'ekonomik-villalar', 'doga-manzarali-villalar'
);

INSERT INTO villa_price_periods (villa_id, label, start_date, end_date, nightly_price, weekly_price, discount_pct, original_price, min_nights, sort_order) VALUES
    (v_villa_id, '01 - 31 Mayıs',           '2026-05-01', '2026-05-31', 6000,  42000,  0,  NULL, 3, 1),
    (v_villa_id, '01 Haziran - 31 Ağustos',  '2026-06-01', '2026-08-31', 10000, 70000,  0,  NULL, 4, 2),
    (v_villa_id, '01 - 30 Eylül',           '2026-09-01', '2026-09-30', 8000,  56000,  0,  NULL, 3, 3),
    (v_villa_id, '01 - 31 Ekim',            '2026-10-01', '2026-10-31', 6000,  42000,  0,  NULL, 3, 4);

INSERT INTO reviews (villa_id, author_name, rating, comment, nights_stayed, stay_period, is_published) VALUES
    (v_villa_id, 'Kemal Y.', 4.5, 'Fiyat/performans olarak çok iyi. Doğa içinde sessiz ve huzurlu bir villa. Havuz temiz ve bakımlıydı.', 4, 'Haziran 2025', true),
    (v_villa_id, 'Meral K.', 4.3, 'Ekonomik bütçeyle güzel bir tatil geçirdik. Villa yeterli büyüklükteydi. İslamlar köyü çok sevdik.', 5, 'Temmuz 2025', true);

RAISE NOTICE '✅ Villa Huzur eklendi';
END $$;


-- ═══════════════════════════════════════════════════════════
-- 5. VILLA PANORAMA — Kaş Merkez, Deniz Manzaralı
-- ═══════════════════════════════════════════════════════════

DO $$
DECLARE
    v_villa_id UUID;
    v_destination_id UUID;
BEGIN

SELECT id INTO v_destination_id FROM destinations WHERE slug = 'kas-merkez';

INSERT INTO villas (
    slug, name, ref_code,
    destination_id, location_label, address,
    position_lat, position_lng, map_iframe_url,
    max_guests, bedrooms, beds, bathrooms, rooms,
    pool_width, pool_length, pool_depth, pool_shared, pool_fence,
    currency, min_price, max_price,
    cover_image_url,
    description_tr, description_en, description_html, summary_tr,
    seo_title, seo_description,
    deposit_amount, cleaning_fee,
    min_nights, min_nights_cleaning, check_in_time, check_out_time,
    commission_pct, license_no,
    pets_allowed, smoking_allowed, parties_allowed, loud_music_allowed,
    avg_rating, review_count,
    owner_name, owner_phone, owner_iban, owner_notes,
    is_published, sort_order,
    has_active_discount, max_discount_pct
) VALUES (
    'villa-panorama', 'Villa Panorama', 'VTO55',
    v_destination_id, 'Kaş Merkez', 'Çukurbağ Yarımadası, Kaş',
    36.1971, 29.6352, '',
    6, 3, 3, 3, 4,
    4.0, 8.0, 1.50, false, false,
    'TRY', 15000, 24000,
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    'Villa Panorama, Kaş Merkez''de 180 derece deniz manzaralı, modern mimarili 3 yatak odalı villadır.',
    'Villa Panorama is a modern 3-bedroom villa in Kaş with 180-degree sea views.',
    '<p>Villa Panorama, Kaş Çukurbağ Yarımadası''nda 180 derece kesintisiz deniz manzarasıyla büyüleyen bir tatil villasıdır. Modern mimarisi, geniş havuzu ve zarif tasarımıyla hem romantik kaçamaklar hem de aile tatilleri için idealdir.</p>',
    'Kaş''ta 180 derece deniz manzaralı modern villa.',
    'Villa Panorama | Kaş Merkez Deniz Manzaralı Villa | Villa Tatilinde',
    'Kaş Merkez''de 180 derece deniz manzaralı kiralık villa. 3 yatak, 6 kişi, modern tasarım.',
    5000, 4000,
    4, 4, '16:00', '10:00',
    28, '07-9022',
    false, false, false, false,
    4.8, 4,
    'Oğuz Çelik', '+905221234567', 'TR00 0001 0002 0003 0004 0005 05', 'Çukurbağ yarımadası - araba gerekli',
    true, 6,
    true, 10
) RETURNING id INTO v_villa_id;

INSERT INTO villa_images (villa_id, url, media_type, is_cover, sort_order) VALUES
    (v_villa_id, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200', 'image', true, 1),
    (v_villa_id, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200', 'image', false, 2),
    (v_villa_id, 'https://images.unsplash.com/photo-1602391833977-358a52198938?w=1200', 'image', false, 3),
    (v_villa_id, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200', 'image', false, 4),
    (v_villa_id, 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200', 'image', false, 5);

INSERT INTO villa_features (villa_id, feature_id)
SELECT v_villa_id, id FROM features WHERE key IN (
    'privatePool', 'seaview', 'centralVillas',
    'balcony', 'gardenLounge', 'sunbedUmbrella', 'airConditioning', 'wifi', 'smartTv',
    'fridge', 'washingMac', 'dishWasher', 'oven', 'iron', 'kitchen', 'enSuite'
);

INSERT INTO villa_categories (villa_id, category_id)
SELECT v_villa_id, id FROM categories WHERE slug IN (
    'deniz-manzarali-villalar', 'merkezi-konumda-villalar'
);

INSERT INTO villa_price_periods (villa_id, label, start_date, end_date, nightly_price, weekly_price, discount_pct, original_price, min_nights, sort_order) VALUES
    (v_villa_id, '01 - 31 Mayıs',           '2026-05-01', '2026-05-31', 15000, 105000, 0,  NULL,  4, 1),
    (v_villa_id, '01 Haziran - 15 Temmuz',   '2026-06-01', '2026-07-15', 20000, 140000, 8,  21700, 4, 2),
    (v_villa_id, '16 Temmuz - 31 Ağustos',   '2026-07-16', '2026-08-31', 24000, 168000, 10, 26700, 5, 3),
    (v_villa_id, '01 - 30 Eylül',           '2026-09-01', '2026-09-30', 18000, 126000, 5,  19000, 4, 4),
    (v_villa_id, '01 - 31 Ekim',            '2026-10-01', '2026-10-31', 15000, 105000, 0,  NULL,  4, 5);

INSERT INTO villa_disabled_dates (villa_id, start_date, end_date, block_type, notes) VALUES
    (v_villa_id, '2026-06-25', '2026-07-05', 'reserved', 'Onaylı rezervasyon'),
    (v_villa_id, '2026-08-05', '2026-08-15', 'reserved', 'Onaylı rezervasyon'),
    (v_villa_id, '2026-08-20', '2026-08-27', 'option', 'Opsiyonlu');

INSERT INTO reviews (villa_id, author_name, rating, comment, nights_stayed, stay_period, is_published) VALUES
    (v_villa_id, 'Cem A.', 5.0, 'Kaş''ın en güzel manzarasına sahip villa! 180 derece deniz gören terasda kahvaltı yapmak paha biçilemez. Her şey kusursuzdu.', 6, 'Ağustos 2025', true),
    (v_villa_id, 'Gül S.', 4.5, 'Muhteşem manzara, temiz ve bakımlı villa. Kaş merkezine 10 dk araba mesafesinde. Kesinlikle tavsiye ederim.', 4, 'Temmuz 2025', true),
    (v_villa_id, 'Okan D.', 5.0, 'Ailecek harika vakit geçirdik. Havuz büyük, manzara muhteşem. Villa modern ve konforlu.', 5, 'Haziran 2025', true);

RAISE NOTICE '✅ Villa Panorama eklendi';
END $$;


-- ═══════════════════════════════════════════════════════════
-- ✅ DOĞRULAMA
-- ═══════════════════════════════════════════════════════════
SELECT name, location_label, min_price, max_guests, bedrooms, avg_rating, is_published
FROM villas WHERE is_published = true ORDER BY sort_order;
