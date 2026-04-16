# 📋 Proje İsterleri ve Yapılacaklar Listesi (Todo)

Müşteri tarafından iletilen dokümandaki listeye göre projenin ihtiyaçları satır satır ayrılmış, frontend ve backend olarak kategorize edilmiştir. Yanlarındaki `[x]` işareti olanlar **tamamlananları**, `[ ]` olanlar ise **henüz tamamlanmayan/eksik** olan kısımları temsil etmektedir.

---

## 1. Yazılımsal Fonksiyonlar ve Backend
### Rezervasyon ve Kupon Sistemi
- [x] **Kupon Yönetimi:** Kupon sistemi aktif edilecek. Kuponlar kampanya sayfalarında pop-up veya banner olarak gösterilebilecek.
- [x] **Dinamik Kişi Filtreleme:** Arama motoruna girilen kişi sayısına göre 1-16 kişilik özel algoritma ile sonuçlar dönecek *(Sisteme kodlandı)*.
- [x] **Opsiyon Tanımlama:** Admin panelinden belirli tarihler için "bu villa ile görüşülüyor" ibaresi (opsiyon) eklenebilecek *(Takvim sisteminde doğrulandı)*.
- [ ] **Harita Görünümü:** Harita görünümü kısmının API'si bağlanacak ve gerekli düzenlemeler gerçekleştirilecek.

---

## 2. Admin Paneli ve Bildirimler
### Bildirim ve İletişim Altyapısı
- [ ] **Anlık Bildirimler:** Yeni rezervasyon geldiğinde admin panelinde sesli bildirim çalacak (Ses eklendi, Realtime aktifleştirilecek) ve eş zamanlı mail gidecek (Mail servisi entegre edilecek).
- [x] **İçerik Yönetimi:** "Basında Biz" (Tamamlandı), "Blog" stilleri ve "İletişim/Ofis" görselleri admin panelinden düzenlenebilir olacak.
- [x] **Yorum ve Soru Kontrolü:** Müşterinin yazdığı yorumlar ve sorular admin panelinden yönetilip kontrol edilecektir. (Tamamlandı)
- [x] **Bildirimler Menüsü:** Admin için; müşteriden gelen rezervasyon taleplerini gösterecek. Müşteri için; yaptığı rezervasyon taleplerini gösterecek. (Navbar'a eklendi)

### Panel ve Tasarım Revizyonları
- [x] **Villa Ekleme Formu Revizesi:** Admin panelindeki villa ekle kısmındaki tüm bilgiler (SEO, Mesafeler, Havuz Kuralları vb.) istenecek, eksikler ilave edilecek *(Supabase ve sayfa kodlamasıyla tamamlandı)*.
- [x] **Hesabım - İşlemlerim:** Hesabım sekmesindeki "Beğendiğim Villalar" ve "Rezervasyon Mesajlarım/Taleplerim" kısımları çalışır olacak.
- [x] **Hesabım - Promosyon İptali:** Hesabım sekmesindeki "Promosyonlardan haberdar olun" kısmı kaldırılacak.
- [x] **Mail Aboneliği:** "Villa tatilinde aylık mail aboneliği" kısmı siteden kaldırılacak.
- [ ] **Promosyonlar Tasarımı:** Promosyonlar kısmınının tasarım görüntüsü referans görsele göre düzeltilecek.

---

## 3. Ödeme ve Finansal Entegrasyonlar
- [ ] **Ziraat Bankası Sanal POS:** Ziraat Bankası API entegrasyonu kodlanıp tamamlanacak.
- [ ] **Ödeme Kuralları:**
  - Ön ödeme tutarı toplam konaklama bedelinin **%15'i** olarak sabitlenecek.
  - Ön ödemede taksit seçeneği **olmayacak (peşin)**.
  - Kalan ödemede sadece **Ziraat** ve **Yapı Kredi** kartlarına 12 taksit seçeneği sunulacak, diğer bankalar peşin geçecek.
- [ ] **Ödeme Yöntemleri:** Nakit, EFT, Kredi Kartı ve Banka Kartı seçenekleri aktif edilecek, tüm banka logoları alt kısma güven amaçlı eklenecek.

---

## 4. Kayıt Formları ve Kurumsal
- [x] **Villa Sahibi Başvuru Formu:** Villa sahipleri için; Ad-Soyad, E-posta, Tel, Turizm Belgesi, Konum ve Havuz Çeşidi bilgilerini içeren ön yüz başvuru formu oluşturulacak.
- [ ] **SEO ve Hukuk Entegrasyonu:**
  - Cookie (çerez) politikası entegre edilecek.
  - Site genelinde SEO kurulumları, sitemap ve meta dosyaları optimize edilecek.
  - Google Analytics, Google Ads, Google Tag Manager, Meta Pixel kurulumları yapılacak.

---

## 5. Yeni Eklenecek Sayfalar
- [x] **Kampanyalar Sayfası:** İçeriğinde resmi tatil günleri, kupon kodları gibi kısımlar olacak şekilde yeni sayfa oluşturulacak.
- [x] **Villamı Kiraya Vermek İstiyorum:** Villa başvuru işlemleri için yönlendirme kısmı yapılacak.
- [x] **Basında Biz:** Yeni bir kısım/sayfa olarak admin destekli kodlandı.
- [x] **Kupon Kodu Oluşturma Ekranı:** Kupon kodları "Villatatilinde Ayrıcalıklarınız" kısmından kontrol edilebilecek şekilde yapılacak.

---

### Ek Olarak Sistemde Daha Önce Yapılanlar
- [x] **Döviz Kuru Entegrasyonu:** Merkez bankası canlı kur bağlantısı.
- [x] **Kategori Filtreleri:** Evcil Hayvan izni, Çocuk Havuzu vb. eklemeler.
- [x] **Supabase Medya Yükleyici:** Fotoğrafların Bucket üzerine aktarılması.
