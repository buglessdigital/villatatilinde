# 🗄️ Villa Tatilinde — Database Şeması

Supabase (PostgreSQL) üzerinde çalışan **22 tablo**, 5 mantıksal grupta organize edilmiştir.

---

## 📂 KATALOG (3 tablo) — Temel Referans Verileri

| # | Tablo | Ne İşe Yarıyor |
|---|-------|----------------|
| 1 | **`destinations`** | **Tatil bölgeleri.** Kalkan Merkez, Kalkan Kalamar, Kaş, Fethiye, Belek gibi coğrafi bölgeler. Kullanıcılar "nereye gitmek istiyorum?" diye filtreleme yapar. |
| 2 | **`categories`** | **Villa kategorileri.** Ekonomik, Muhafazakar, Balayı, Ultralüks, Deniz Manzaralı gibi gruplar. Ana sayfadaki kategori kartları buradan gelir. |
| 3 | **`features`** | **Villa özellikleri listesi.** Özel Havuz, WiFi, Jakuzi, Sauna, Klima vb. Her özelliğin Türkçe/İngilizce adı ve ikonu var. Villalara atanır. |

---

## 🏡 VİLLA YÖNETİMİ (6 tablo) — Villaların Tüm Detayları

| # | Tablo | Ne İşe Yarıyor |
|---|-------|----------------|
| 4 | **`villas`** | **Ana villa tablosu.** İsim, konum, kapasite, havuz ölçüleri, fiyat aralığı, açıklama, kurallar, sahip bilgisi, puanlama, yayın durumu — bir villanın tüm temel bilgileri. |
| 5 | **`villa_images`** | **Villa görselleri.** Her villanın fotoğrafları ve videoları. Sıralama ve kapak görseli belirlenir. |
| 6 | **`villa_features`** | **Villa ↔ Özellik bağlantısı.** Hangi villanın hangi özelliklere sahip olduğunu tutar. Örn: "Villa Doğa → Özel Havuz, WiFi, Klima" |
| 7 | **`villa_categories`** | **Villa ↔ Kategori bağlantısı.** Bir villa birden fazla kategoride olabilir. Örn: "Villa Azure → Ultralüks, Deniz Manzaralı, Denize Yakın" |
| 8 | **`villa_price_periods`** | **Sezonluk fiyat dönemleri.** Her villanın Mayıs, Haziran-Ağustos, Eylül gibi dönemlere göre gecelik/haftalık fiyatı ve indirimi. |
| 9 | **`villa_disabled_dates`** | **Müsait olmayan tarihler.** Takvimde dolu, opsiyonlu veya bakımda olan günler. Rezervasyon takvimini besler. |

---

## 👤 KULLANICILAR (3 tablo) — Üye Sistemi

| # | Tablo | Ne İşe Yarıyor |
|---|-------|----------------|
| 10 | **`users`** | **Kullanıcı profili.** Ad, soyad, telefon, e-posta, TC/pasaport, dil tercihi, para birimi, rol (user/admin). Giriş yapan herkes burada. |
| 11 | **`user_wishlists`** | **Favori villalar.** Kullanıcının ❤️ işaretlediği villalar. "Favorilerim" sayfasını besler. |
| 12 | **`user_last_visited`** | **Son görüntülenen villalar.** Ana sayfadaki "Son Görüntülediğiniz" bölümünü besler. |

---

## 📋 REZERVASYON & ÖDEME (4 tablo) — İş Akışının Kalbi

| # | Tablo | Ne İşe Yarıyor |
|---|-------|----------------|
| 13 | **`reservations`** | **Rezervasyon talepleri.** Kim, hangi villayı, hangi tarihlerde, kaç geceye, ne kadara kiraladı? Durum takibi (bekliyor → onaylandı → ödendi → tamamlandı). Admin panelinin ana tablosu. |
| 14 | **`reservation_guests`** | **Misafir listesi.** Bir rezervasyondaki tüm misafirlerin adları. Sözleşme ve check-in için gerekli. |
| 15 | **`reservation_messages`** | **Mesajlaşma.** Kiracı ile admin arasındaki yazışmalar. Her rezervasyonun kendi mesaj geçmişi var. |
| 16 | **`payments`** | **Ödemeler.** iyzico veya PayTR ile yapılan kart ödemeleri, banka transferleri, nakit. Ön ödeme ve kalan ödeme ayrı ayrı takip edilir. Ödeme sağlayıcının referans bilgileri saklanır. |

---

## 📝 İÇERİK & ADMIN (6 tablo) — Site İçeriği

| # | Tablo | Ne İşe Yarıyor |
|---|-------|----------------|
| 17 | **`reviews`** | **Villa yorumları.** Misafir puanı (1-5), yorum metni, kaç gece kaldığı. Admin onayladıktan sonra yayınlanır. |
| 18 | **`blogs`** | **Blog yazıları.** Seyahat önerileri, villa tanıtımları vb. içerikler. Admin panelinden yazılır. |
| 19 | **`faqs`** | **Sık sorulan sorular.** Genel SSS sayfası için. Türkçe/İngilizce destekli. |
| 20 | **`user_questions`** | **Villa bazlı kullanıcı soruları.** Belirli bir villa hakkında sorulan sorular ve admin cevapları. |
| 21 | **`policies`** | **Politikalar.** İptal politikası, gizlilik politikası, kullanım koşulları metinleri. |
| 22 | **`site_settings`** | **Site ayarları.** Telefon numarası, e-posta, adres, ödeme API anahtarları gibi genel ayarlar. Key-value yapısında. |

---

## 🔗 Tablolar Arası İlişkiler

```
destinations ← villas              (her villa bir bölgeye ait)
categories  ↔ villas               (çoktan çoğa, villa_categories ile)
features    ↔ villas               (çoktan çoğa, villa_features ile)
users       → reservations          (kullanıcı rezervasyon yapar)
villas      → reservations          (villa kiralanır)
reservations → payments             (her rezervasyonun ödemeleri)
reservations → reservation_guests   (misafir listesi)
reservations → reservation_messages (mesajlar)
villas      → reviews              (villa yorumları)
villas      → user_questions       (villaya soru sorma)
users       → user_wishlists → villas (favoriler)
users       → user_last_visited → villas (son görüntülenen)
```

---

## 📁 Migration Dosyaları

| Dosya | Açıklama |
|-------|----------|
| `001_drop_old_tables.sql` | Eski Firebase tabloları siler |
| `002_create_new_tables.sql` | 22 yeni tabloyu oluşturur |
| `003_seed_catalog_data.sql` | Başlangıç verileri (bölgeler, kategoriler, özellikler) |

---

## 🛠️ Teknoloji

- **Database:** Supabase (PostgreSQL)
- **Ödeme:** iyzico + PayTR
- **Frontend:** Next.js 16 (React 19, TypeScript)
