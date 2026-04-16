-- ============================================================
-- 002: YENİ TABLOLARI OLUŞTUR
-- Villa Tatilinde — Sıfırdan Normalize Database Şeması
-- Toplam: 22 tablo
-- ============================================================


-- ═══════════════════════════════════════════════════════════
-- GRUP 1: KATALOG (bağımsız tablolar)
-- ═══════════════════════════════════════════════════════════

-- 1. Tatil Bölgeleri
CREATE TABLE destinations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug            TEXT UNIQUE NOT NULL,
    name            TEXT NOT NULL,
    location_label  TEXT,
    description     TEXT,
    image_url       TEXT,
    filter_param    TEXT,
    sort_order      INT DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Villa Kategorileri
CREATE TABLE categories (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug            TEXT UNIQUE NOT NULL,
    name            TEXT NOT NULL,
    description     TEXT,
    image_url       TEXT,
    badge_text      TEXT,
    filter_param    TEXT,
    sort_order      INT DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Özellikler (Havuz, WiFi, Jakuzi vb.)
CREATE TABLE features (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key             TEXT UNIQUE NOT NULL,
    label_tr        TEXT NOT NULL,
    label_en        TEXT,
    icon_url        TEXT,
    group_type      TEXT NOT NULL DEFAULT 'general',
    sort_order      INT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);


-- ═══════════════════════════════════════════════════════════
-- GRUP 3: KULLANICILAR (villas'tan önce — FK için gerekli)
-- ═══════════════════════════════════════════════════════════

-- 4. Kullanıcılar
CREATE TABLE users (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_uid            UUID UNIQUE,
    first_name          TEXT,
    last_name           TEXT,
    email               TEXT,
    email_verified      BOOLEAN DEFAULT FALSE,
    phone_code          TEXT,
    phone_number        TEXT,
    tc_number           TEXT,
    passport_number     TEXT,
    avatar_url          TEXT,
    language            TEXT DEFAULT 'tr',
    preferred_currency  TEXT DEFAULT 'TRY',
    role                TEXT DEFAULT 'user',
    is_subscribed       BOOLEAN DEFAULT FALSE,
    subscribed_at       TIMESTAMPTZ,
    is_active           BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_auth ON users(auth_uid);


-- ═══════════════════════════════════════════════════════════
-- GRUP 5: İÇERİK & ADMIN (bağımsız)
-- ═══════════════════════════════════════════════════════════

-- 5. Politikalar
CREATE TABLE policies (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug            TEXT UNIQUE NOT NULL,
    title           TEXT,
    content_html    TEXT,
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Site Ayarları
CREATE TABLE site_settings (
    key             TEXT PRIMARY KEY,
    value           JSONB NOT NULL DEFAULT '{}',
    description     TEXT,
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);


-- ═══════════════════════════════════════════════════════════
-- GRUP 2: VİLLA YÖNETİMİ
-- ═══════════════════════════════════════════════════════════

-- 7. Ana Villa Tablosu
CREATE TABLE villas (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug                TEXT UNIQUE NOT NULL,
    name                TEXT NOT NULL,
    ref_code            TEXT,
    -- Konum
    destination_id      UUID REFERENCES destinations(id) ON DELETE SET NULL,
    address             TEXT,
    location_label      TEXT,
    position_lat        DOUBLE PRECISION,
    position_lng        DOUBLE PRECISION,
    map_iframe_url      TEXT,
    -- Kapasite
    max_guests          INT DEFAULT 0,
    bedrooms            INT DEFAULT 0,
    beds                INT DEFAULT 0,
    bathrooms           INT DEFAULT 0,
    rooms               INT DEFAULT 1,
    -- Havuz
    pool_width          NUMERIC(5,2),
    pool_length         NUMERIC(5,2),
    pool_depth          NUMERIC(5,2),
    pool_shared         BOOLEAN DEFAULT FALSE,
    pool_fence          BOOLEAN DEFAULT FALSE,
    -- Fiyat
    currency            TEXT DEFAULT 'TRY',
    min_price           NUMERIC(12,2) DEFAULT 0,
    max_price           NUMERIC(12,2) DEFAULT 0,
    -- Görseller
    cover_image_url     TEXT,
    -- Açıklamalar
    description_tr      TEXT,
    description_en      TEXT,
    description_html    TEXT,
    summary_tr          TEXT,
    summary_en          TEXT,
    -- SEO
    seo_title           TEXT,
    seo_description     TEXT,
    -- Konaklama Kuralları
    deposit_amount      NUMERIC(12,2) DEFAULT 0,
    cleaning_fee        NUMERIC(12,2) DEFAULT 0,
    min_nights          INT DEFAULT 1,
    min_nights_cleaning INT DEFAULT 1,
    min_nights_winter   INT DEFAULT 1,
    check_in_time       TEXT DEFAULT '16:00',
    check_out_time      TEXT DEFAULT '10:00',
    commission_pct      NUMERIC(5,2) DEFAULT 0,
    license_no          TEXT,
    -- Ev Kuralları
    pets_allowed        BOOLEAN DEFAULT FALSE,
    smoking_allowed     BOOLEAN DEFAULT FALSE,
    parties_allowed     BOOLEAN DEFAULT FALSE,
    loud_music_allowed  BOOLEAN DEFAULT FALSE,
    has_carbon_alarm    BOOLEAN DEFAULT FALSE,
    self_check_in       BOOLEAN DEFAULT FALSE,
    -- Puanlama (denormalize)
    avg_rating          NUMERIC(3,2) DEFAULT 0,
    review_count        INT DEFAULT 0,
    -- Villa Sahibi (Admin Only)
    owner_name          TEXT,
    owner_phone         TEXT,
    owner_iban          TEXT,
    owner_notes         TEXT,
    -- Durum
    is_published        BOOLEAN DEFAULT FALSE,
    is_exclusive        BOOLEAN DEFAULT FALSE,
    sort_order          INT DEFAULT 0,
    -- İndirim
    has_active_discount BOOLEAN DEFAULT FALSE,
    max_discount_pct    NUMERIC(5,2) DEFAULT 0,
    -- Politika
    cancellation_policy TEXT,
    -- Zaman
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_villas_destination ON villas(destination_id);
CREATE INDEX idx_villas_published ON villas(is_published);
CREATE INDEX idx_villas_min_price ON villas(min_price);
CREATE INDEX idx_villas_slug ON villas(slug);

-- 8. Villa Görselleri
CREATE TABLE villa_images (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    villa_id        UUID NOT NULL REFERENCES villas(id) ON DELETE CASCADE,
    url             TEXT NOT NULL,
    media_type      TEXT DEFAULT 'image',
    is_cover        BOOLEAN DEFAULT FALSE,
    sort_order      INT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_villa_images_villa ON villa_images(villa_id);

-- 9. Villa — Özellik İlişkisi (M2M)
CREATE TABLE villa_features (
    villa_id        UUID NOT NULL REFERENCES villas(id) ON DELETE CASCADE,
    feature_id      UUID NOT NULL REFERENCES features(id) ON DELETE CASCADE,
    PRIMARY KEY (villa_id, feature_id)
);

-- 10. Villa — Kategori İlişkisi (M2M)
CREATE TABLE villa_categories (
    villa_id        UUID NOT NULL REFERENCES villas(id) ON DELETE CASCADE,
    category_id     UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (villa_id, category_id)
);

-- 11. Fiyat Dönemleri
CREATE TABLE villa_price_periods (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    villa_id        UUID NOT NULL REFERENCES villas(id) ON DELETE CASCADE,
    label           TEXT,
    start_date      DATE NOT NULL,
    end_date        DATE NOT NULL,
    nightly_price   NUMERIC(12,2) NOT NULL,
    weekly_price    NUMERIC(12,2),
    original_price  NUMERIC(12,2),
    discount_pct    NUMERIC(5,2) DEFAULT 0,
    min_nights      INT DEFAULT 1,
    sort_order      INT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_villa_prices_villa ON villa_price_periods(villa_id);
CREATE INDEX idx_villa_prices_dates ON villa_price_periods(start_date, end_date);


-- ═══════════════════════════════════════════════════════════
-- GRUP 4: REZERVASYON & ÖDEME
-- ═══════════════════════════════════════════════════════════

-- 12. Rezervasyonlar
CREATE TABLE reservations (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ref_code            TEXT UNIQUE NOT NULL,
    user_id             UUID REFERENCES users(id) ON DELETE SET NULL,
    villa_id            UUID NOT NULL REFERENCES villas(id),
    source              TEXT DEFAULT 'website',
    status              TEXT DEFAULT 'pending',
    -- Kiracı
    renter_first_name   TEXT NOT NULL,
    renter_last_name    TEXT NOT NULL,
    renter_email        TEXT,
    renter_phone_code   TEXT,
    renter_phone_number TEXT,
    renter_tc_passport  TEXT,
    renter_address      TEXT,
    -- Tarihler
    check_in_date       DATE NOT NULL,
    check_out_date      DATE NOT NULL,
    nights              INT NOT NULL DEFAULT 1,
    total_guests        INT DEFAULT 1,
    -- Finansal
    currency            TEXT DEFAULT 'TRY',
    nightly_rate        NUMERIC(12,2),
    subtotal            NUMERIC(12,2),
    discount_pct        NUMERIC(5,2) DEFAULT 0,
    discount_amount     NUMERIC(12,2) DEFAULT 0,
    cleaning_fee        NUMERIC(12,2) DEFAULT 0,
    deposit_amount      NUMERIC(12,2) DEFAULT 0,
    total_amount        NUMERIC(12,2) NOT NULL,
    prepayment_amount   NUMERIC(12,2) DEFAULT 0,
    remaining_amount    NUMERIC(12,2) DEFAULT 0,
    prepayment_paid     BOOLEAN DEFAULT FALSE,
    remaining_paid      BOOLEAN DEFAULT FALSE,
    -- Admin
    admin_notes         TEXT,
    approved_by         UUID REFERENCES users(id),
    approved_at         TIMESTAMPTZ,
    rejected_at         TIMESTAMPTZ,
    rejection_reason    TEXT,
    -- Promosyon
    promotion_code      TEXT,
    promotion_discount  NUMERIC(12,2) DEFAULT 0,
    -- İptal
    cancelled_at        TIMESTAMPTZ,
    cancellation_reason TEXT,
    -- Zaman
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reservations_user ON reservations(user_id);
CREATE INDEX idx_reservations_villa ON reservations(villa_id);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_dates ON reservations(check_in_date, check_out_date);
CREATE INDEX idx_reservations_ref ON reservations(ref_code);

-- 13. Müsait Olmayan Tarihler
CREATE TABLE villa_disabled_dates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    villa_id        UUID NOT NULL REFERENCES villas(id) ON DELETE CASCADE,
    start_date      DATE NOT NULL,
    end_date        DATE NOT NULL,
    block_type      TEXT NOT NULL DEFAULT 'reserved',
    reservation_id  UUID REFERENCES reservations(id) ON DELETE SET NULL,
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_villa_disabled_villa ON villa_disabled_dates(villa_id);
CREATE INDEX idx_villa_disabled_dates ON villa_disabled_dates(start_date, end_date);

-- 14. Misafir Listesi
CREATE TABLE reservation_guests (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id  UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    full_name       TEXT NOT NULL,
    guest_order     INT DEFAULT 1,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Rezervasyon Mesajları
CREATE TABLE reservation_messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id  UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    sender_type     TEXT NOT NULL,
    sender_id       UUID REFERENCES users(id),
    message_text    TEXT NOT NULL,
    is_read         BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_res_messages_reservation ON reservation_messages(reservation_id);

-- 16. Ödemeler (iyzico + PayTR destekli)
CREATE TABLE payments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id  UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users(id),
    payment_type    TEXT NOT NULL,
    payment_method  TEXT NOT NULL,
    amount          NUMERIC(12,2) NOT NULL,
    currency        TEXT DEFAULT 'TRY',
    status          TEXT DEFAULT 'pending',
    -- Ödeme Sağlayıcı
    provider_payment_id     TEXT,
    provider_transaction_id TEXT,
    provider_response       JSONB,
    card_last_four          TEXT,
    -- Banka Havalesi
    bank_name       TEXT,
    iban            TEXT,
    transfer_ref    TEXT,
    -- Admin
    verified_by     UUID REFERENCES users(id),
    admin_notes     TEXT,
    -- Zaman
    paid_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_reservation ON payments(reservation_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_provider ON payments(provider_payment_id);


-- ═══════════════════════════════════════════════════════════
-- GRUP 5: İÇERİK & ADMIN (bağımlı olanlar)
-- ═══════════════════════════════════════════════════════════

-- 17. Villa Yorumları
CREATE TABLE reviews (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    villa_id        UUID NOT NULL REFERENCES villas(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    reservation_id  UUID REFERENCES reservations(id) ON DELETE SET NULL,
    author_name     TEXT NOT NULL,
    rating          NUMERIC(2,1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment         TEXT,
    nights_stayed   INT,
    stay_period     TEXT,
    is_published    BOOLEAN DEFAULT FALSE,
    admin_notes     TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_villa ON reviews(villa_id);

-- 18. Blog Yazıları
CREATE TABLE blogs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug            TEXT UNIQUE NOT NULL,
    title           TEXT NOT NULL,
    subtitle        TEXT,
    author          TEXT DEFAULT 'Villa Tatilinde',
    cover_image_url TEXT,
    tags            TEXT[],
    content_html    TEXT,
    read_time_min   INT,
    is_published    BOOLEAN DEFAULT FALSE,
    published_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 19. Sık Sorulan Sorular
CREATE TABLE faqs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug            TEXT UNIQUE NOT NULL,
    question_tr     TEXT NOT NULL,
    question_en     TEXT,
    answer_html_tr  TEXT,
    answer_html_en  TEXT,
    sort_order      INT DEFAULT 0,
    is_published    BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 20. Kullanıcı Soruları (villa bazlı)
CREATE TABLE user_questions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    villa_id        UUID REFERENCES villas(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    email           TEXT,
    question_text   TEXT NOT NULL,
    answer_html     TEXT,
    answered_by     TEXT,
    is_published    BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    answered_at     TIMESTAMPTZ
);

CREATE INDEX idx_user_questions_villa ON user_questions(villa_id);

-- 21. Favoriler
CREATE TABLE user_wishlists (
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    villa_id        UUID NOT NULL REFERENCES villas(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, villa_id)
);

-- 22. Son Görüntülenen Villalar
CREATE TABLE user_last_visited (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    villa_id        UUID NOT NULL REFERENCES villas(id) ON DELETE CASCADE,
    visited_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_last_visited_user ON user_last_visited(user_id, visited_at DESC);


-- ═══════════════════════════════════════════════════════════
-- BAŞLANGIÇ VERİLERİ (Seed Data)
-- ═══════════════════════════════════════════════════════════

-- Site Ayarları
INSERT INTO site_settings (key, value, description) VALUES
    ('contact_phone', '"02426060725"', 'Ana iletişim telefon numarası'),
    ('contact_email', '"info@villatatilinde.com"', 'Ana iletişim e-posta'),
    ('contact_address', '"KALKAN MAH. ŞEHİTLER CAD. NO: 53 KAŞ(ANTALYA)"', 'Ofis adresi'),
    ('company_name', '"PRAEDIUM GROUP TRAVEL AGENCY"', 'Şirket adı'),
    ('license_no', '"18069"', 'Turizm belgesi numarası'),
    ('supported_currencies', '["TRY","EUR","GBP","USD","RUB"]', 'Desteklenen para birimleri');

-- Politikalar
INSERT INTO policies (slug, title) VALUES
    ('cancellation', 'İptal Politikası'),
    ('privacy', 'Gizlilik Politikası'),
    ('terms', 'Kullanım Koşulları');
