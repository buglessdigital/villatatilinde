-- ============================================================
-- 001: ESKİ TABLOLARI SİL
-- Firebase'den migration ile oluşturulmuş tüm tabloları temizler
-- ⚠️  DİKKAT: Bu işlem geri alınamaz!
-- ============================================================

-- Sıralama önemli: önce bağımlı tablolar silinir
DROP TABLE IF EXISTS successful_payments_manual CASCADE;
DROP TABLE IF EXISTS successful_payments CASCADE;
DROP TABLE IF EXISTS user_questions CASCADE;
DROP TABLE IF EXISTS user_details CASCADE;
DROP TABLE IF EXISTS manual_references CASCADE;
DROP TABLE IF EXISTS admin_requests CASCADE;
DROP TABLE IF EXISTS user_requests CASCADE;
DROP TABLE IF EXISTS numbers CASCADE;
DROP TABLE IF EXISTS policies CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS faqs CASCADE;
DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS villas CASCADE;

-- Kontrol: hiçbir eski tablo kalmamalı
-- Supabase Dashboard > Table Editor'dan doğrulayın
