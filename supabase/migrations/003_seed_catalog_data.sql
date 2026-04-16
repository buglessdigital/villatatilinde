-- ============================================================
-- 003: KATALOG VERİLERİ (Seed Data)
-- destinations, categories, features tablolarına başlangıç verileri
-- ============================================================


-- ═══════════════════════════════════════════════════════════
-- 1. DESTINATIONS — Tatil Bölgeleri (17 adet)
-- ═══════════════════════════════════════════════════════════

INSERT INTO destinations (slug, name, location_label, description, filter_param, sort_order) VALUES
    -- Kalkan bölgeleri
    ('kalkan-merkez',     'Kalkan Merkez Villalar',     'Kalkan Merkez',     'Harika Plajlar, Tarihi Yapılar ve Çok daha Fazlası', 'kalkan-merkez',     1),
    ('kalkan-kalamar',    'Kalkan Kalamar Villalar',    'Kalkan Kalamar',    'Harika Plajlar, Tarihi Yapılar ve Çok daha Fazlası', 'kalkan-kalamar',    2),
    ('kalkan-komurluk',   'Kalkan Kömürlük Villalar',   'Kalkan Kömürlük',   'Harika Plajlar, Tarihi Yapılar ve Çok daha Fazlası', 'kalkan-komurluk',   3),
    ('kalkan-kisla',      'Kalkan Kışla Villalar',      'Kalkan Kışla',      'Harika Plajlar, Tarihi Yapılar ve Çok daha Fazlası', 'kalkan-kisla',      4),
    ('kalkan-ortaalan',   'Kalkan Ortaalan Villalar',   'Kalkan Ortaalan',   'Harika Plajlar, Tarihi Yapılar ve Çok daha Fazlası', 'kalkan-ortaalan',   5),
    ('kalkan-kiziltas',   'Kalkan Kızıltaş Villalar',   'Kalkan Kızıltaş',   'Harika Plajlar, Tarihi Yapılar ve Çok daha Fazlası', 'kalkan-kiziltas',   6),
    ('kalkan-patara',     'Kalkan Patara Villalar',     'Kalkan Patara',     'Harika Plajlar, Tarihi Yapılar ve Çok daha Fazlası', 'kalkan-patara',     7),
    ('kalkan-ulugol',     'Kalkan Ulugöl Villalar',     'Kalkan Ulugöl',     'Harika Plajlar, Tarihi Yapılar ve Çok daha Fazlası', 'kalkan-ulugol',     8),
    ('kalkan-kordere',    'Kalkan Kördere Villalar',    'Kalkan Kördere',    'Harika Plajlar, Tarihi Yapılar ve Çok daha Fazlası', 'kalkan-kordere',    9),
    ('kalkan-islamlar',   'Kalkan İslamlar Villalar',   'Kalkan İslamlar',   'Harika Plajlar, Tarihi Yapılar ve Çok daha Fazlası', 'kalkan-islamlar',   10),
    ('kalkan-uzumlu',     'Kalkan Üzümlü Villalar',     'Kalkan Üzümlü',     'Harika Plajlar, Tarihi Yapılar ve Çok daha Fazlası', 'kalkan-uzumlu',     11),
    ('kalkan-bezirgan',   'Kalkan Bezirgan Villalar',   'Kalkan Bezirgan',   'Harika Plajlar, Tarihi Yapılar ve Çok daha Fazlası', 'kalkan-bezirgan',   12),
    ('kalkan-saribelen',  'Kalkan Sarıbelen Villalar',  'Kalkan Sarıbelen',  'Harika Plajlar, Tarihi Yapılar ve Çok daha Fazlası', 'kalkan-saribelen',  13),
    ('kalkan-yesilkoy',   'Kalkan Yeşilköy Villalar',   'Kalkan Yeşilköy',   'Harika Plajlar, Tarihi Yapılar ve Çok daha Fazlası', 'kalkan-yesilkoy',   14),
    -- Diğer bölgeler
    ('kas-merkez',        'Kaş Merkez Villalar',        'Kaş Merkez',        'Harika Plajlar, Tarihi Yapılar ve Çok daha Fazlası', 'kas-merkez',        15),
    ('fethiye',           'Fethiye Villalar',           'Fethiye',           'Harika Plajlar, Tarihi Yapılar ve Çok daha Fazlası', 'fethiye',           16),
    ('belek',             'Belek''da Bulunan Villalar', 'Belek',             'Harika Plajlar, Tarihi Yapılar ve Çok daha Fazlası', 'belek',             17);


-- ═══════════════════════════════════════════════════════════
-- 2. CATEGORIES — Villa Kategorileri (12 adet)
-- ═══════════════════════════════════════════════════════════

INSERT INTO categories (slug, name, description, image_url, badge_text, filter_param, sort_order) VALUES
    ('ekonomik-villalar',           'Ekonomik Villalar',                          'Uygun fiyatlı tatil villaları',                  '/images/econo.jpg',       'Ekonomik Villalar',              'affordableVillas',     1),
    ('muhafazakar-villalar',        'Muhafazakar Villalar',                       'Dışarıdan görünmeyen tatil villaları',           '/images/muhafazakar.jpg', 'Muhafazakar Villalar',           'isolatedVillas',       2),
    ('balayi-villalari',            'Balayı Villaları',                           'Çift kişilik lüks balayı villaları',             '/images/bala.jpg',        'Balayı Villaları',               'honeyMoon',            3),
    ('ultralux-villalar',           'Ultralüks Villalar',                         'Ultralüks villalar',                             '/images/ulux.jpeg',       'Ultralüks Villalar',             'ultraLux',             4),
    ('merkezi-konumda-villalar',    'Merkezi Konumda Bulunan Villalar',           'Canlı merkeze ve denize yakın villalar',         '/images/central.jpg',     'Merkezi Konumda Bulunanlar',     'centralVillas',        5),
    ('denize-yakin-villalar',       'Denize Yakın Konumda Bulunan Villalar',      'Denize yakın villalar',                          '/images/deniz.webp',      'Denize Yakın Villalar',          'beachVillas',          6),
    ('deniz-manzarali-villalar',    'Deniz Manzaralı Villalar',                   'Deniz manzaralı villalar',                       '/images/denman.jpeg',     'Deniz Manzaralı Villalar',       'seaview',              7),
    ('doga-manzarali-villalar',     'Doğa Manzaralı Villalar',                    'Doğa manzaralı villalar',                        '/images/natureview.jpg',  'Doğa Manzaralı Villalar',        'natureview',           8),
    ('muhafazakar-havuzlu-villalar','Muhafazakar Havuzlu Villalar',               'Muhafazakar havuzlu villalar',                   '/images/muhhav.jpg',      'Muhafazakar Havuzlu Villalar',   'isolatedPoolVillas',   9),
    ('jakuzili-villalar',           'Jakuzili Villalar',                          'Bir veya daha fazla jakuzi bulunan villalar',     '/images/jacuzzi.jpg',     'Jakuzili Villalar',              'jacuzziVillas',        10),
    ('cocuk-havuzlu-villalar',      'Çocuk Havuzlu Villalar',                     'Çocuk havuzu bulunan villalar',                  '/images/kidpool.jpg',     'Çocuk Havuzlu Villalar',         'kidPoolVillas',        11),
    ('yeni-villalar',               'Yeni Villalar',                              'Yeni yapılmış villalar',                         '/images/new.jpg',         'Yeni Villalar',                  'newVillas',            12);


-- ═══════════════════════════════════════════════════════════
-- 3. FEATURES — Villa Özellikleri (32 adet)
-- ═══════════════════════════════════════════════════════════

-- Premium özellikler (öne çıkan)
INSERT INTO features (key, label_tr, label_en, icon_url, group_type, sort_order) VALUES
    ('privatePool',       'Özel Havuz',                'Private Pool',           '/images/ppool.png',      'premium', 1),
    ('infinityPool',      'Sonsuzluk Havuzu',          'Infinity Pool',          '/images/ipool.png',      'premium', 2),
    ('indoorPool',        'Kapalı Havuz',              'Indoor Pool',            '/images/inpool.png',     'premium', 3),
    ('heatedPool',        'Isıtmalı Havuz',            'Heated Pool',            '/images/hpool.png',      'premium', 4),
    ('kidPoolVillas',     'Çocuk Havuzu',              'Kids Pool',              '/images/kidpool.png',    'premium', 5),
    ('jacuzziVillas',     'Jakuzi',                    'Jacuzzi',                '/images/jak.png',        'premium', 6),
    ('gymRoom',           'Spor Odası',                'Gym Room',               '/images/gym.png',        'premium', 7),
    ('sauna',             'Sauna',                     'Sauna',                  '/images/sauna.png',      'premium', 8),
    ('hamam',             'Hamam',                     'Turkish Bath',           '/images/hamam.png',      'premium', 9),
    ('cinemaRoom',        'Sinema Odası',              'Cinema Room',            '/images/cinema.png',     'premium', 10),
    ('winterGarden',      'Kış Bahçesi',               'Winter Garden',          '/images/cold.png',       'premium', 11),
    ('tennisTable',       'Masa Tenisi',               'Table Tennis',           '/images/masa.png',       'premium', 12),
    ('poolTable',         'Bilardo Masası',            'Pool Table',             '/images/ppol.png',       'premium', 13),
    ('isolatedPoolVillas','Muhafazakar Havuz',         'Private Pool Area',      '/images/poolfence.png',  'premium', 14);

-- Genel özellikler
INSERT INTO features (key, label_tr, label_en, icon_url, group_type, sort_order) VALUES
    ('kitchen',           'Mutfak',                    'Kitchen',                NULL, 'general', 20),
    ('enSuite',           'Ebeveyn Banyosu',           'En-Suite Bathroom',      NULL, 'general', 21),
    ('balcony',           'Balkon',                    'Balcony',                NULL, 'general', 22),
    ('gardenLounge',      'Bahçe Mobilyası',           'Garden Lounge',          NULL, 'general', 23),
    ('sunbedUmbrella',    'Şezlong ve Şemsiye',        'Sunbed & Umbrella',      NULL, 'general', 24),
    ('airConditioning',   'Klima',                     'Air Conditioning',       NULL, 'general', 25),
    ('wifi',              'WiFi',                      'WiFi',                   NULL, 'general', 26),
    ('smartTv',           'Akıllı TV',                 'Smart TV',               NULL, 'general', 27),
    ('fridge',            'Buzdolabı',                 'Refrigerator',           NULL, 'general', 28),
    ('washingMac',        'Çamaşır Makinesi',          'Washing Machine',        NULL, 'general', 29),
    ('dryingMac',         'Çamaşır Kurutma Makinesi',  'Dryer',                  '/images/drying.png', 'general', 30),
    ('dishWasher',        'Bulaşık Makinesi',          'Dishwasher',             NULL, 'general', 31),
    ('oven',              'Fırın',                     'Oven',                   NULL, 'general', 32),
    ('iron',              'Ütü',                       'Iron',                   NULL, 'general', 33);

-- Kategori özellikleri (villa kartlarında gösterilen)
INSERT INTO features (key, label_tr, label_en, icon_url, group_type, sort_order) VALUES
    ('affordableVillas',  'Ekonomik Fiyatlı Villa',    'Affordable Villa',       '/images/affordable.png', 'category', 40),
    ('isolatedVillas',    'Muhafazakar Villa',         'Isolated Villa',         '/images/tent.png',       'category', 41),
    ('honeyMoon',         'Balayı Villası',            'Honeymoon Villa',        '/images/honeymoon.png',  'category', 42),
    ('ultraLux',          'Ultra Lüks',                'Ultra Luxury',           '/images/diamond.png',    'category', 43),
    ('centralVillas',     'Merkezi Konumda',           'Central Location',       '/images/central.png',    'category', 44),
    ('natureview',        'Doğa Manzaralı Villa',      'Nature View Villa',      '/images/landscape.png',  'category', 45),
    ('seaview',           'Deniz Manzaralı Villa',     'Sea View Villa',         '/images/sea.png',        'category', 46),
    ('beachVillas',       'Denize Yakın Villa',        'Beach Villa',            '/images/vacations.png',  'category', 47),
    ('newVillas',         'Yeni Villa',                'New Villa',              NULL,                     'category', 48);


-- ═══════════════════════════════════════════════════════════
-- ✅ DOĞRULAMA SORGUSU — Aşağıdaki sorguyu çalıştırarak kontrol edin
-- ═══════════════════════════════════════════════════════════

-- SELECT 'destinations' AS tablo, COUNT(*) AS kayit FROM destinations
-- UNION ALL
-- SELECT 'categories', COUNT(*) FROM categories
-- UNION ALL
-- SELECT 'features', COUNT(*) FROM features;
--
-- Beklenen sonuç:
-- destinations → 17
-- categories   → 12
-- features     → 37
