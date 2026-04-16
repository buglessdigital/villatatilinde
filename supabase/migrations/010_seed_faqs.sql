-- ============================================================
-- 010: SSS (FAQ) VERİLERİNİ EKLE
-- 10 soru-cevap
-- ============================================================

INSERT INTO faqs (slug, question_tr, question_en, answer_html_tr, sort_order, is_published) VALUES

('villa-nasil-kiralanir',
 'Villa nasıl kiralanır?',
 'How to rent a villa?',
 '<p>Villa kiralama süreci oldukça kolaydır. Sitemizde beğendiğiniz villayı seçtikten sonra, tarih ve kişi sayısı bilgilerini girerek müsaitlik kontrolü yapabilirsiniz. Uygun olan villayı bulduktan sonra <strong>rezervasyon isteği</strong> oluşturabilirsiniz.</p><p style="margin-top:8px;">Rezervasyon isteğiniz ekibimiz tarafından en kısa sürede değerlendirilir ve size geri dönüş yapılır.</p>',
 1, true),

('odeme-yontemleri-nelerdir',
 'Ödeme yöntemleri nelerdir?',
 'What are the payment methods?',
 '<p>Visa, Mastercard, American Express ve Troy kartlarınızla güvenli bir şekilde ödeme yapabilirsiniz. Ayrıca <strong>taksit imkanı</strong> da sunulmaktadır.</p><p style="margin-top:8px;">Tüm ödemeler iyzico güvencesi altında gerçekleştirilmektedir.</p>',
 2, true),

('iptal-iade-politikasi',
 'İptal ve iade politikası nasıldır?',
 'What is the cancellation and refund policy?',
 '<p>İptal ve iade politikamız villa sahibinin belirlediği koşullara göre değişiklik gösterebilir. Genel olarak, giriş tarihinden <strong>30 gün öncesine</strong> kadar yapılan iptallerde tam iade sağlanmaktadır.</p><p style="margin-top:8px;">Detaylı bilgi için <a href="/iptal-iade-politikalari" style="color:#50b0f0;text-decoration:underline;">İptal ve İade Politikası</a> sayfamızı ziyaret edebilirsiniz.</p>',
 3, true),

('villa-fiyatlari-neye-gore-belirlenir',
 'Villa fiyatları neye göre belirlenir?',
 'How are villa prices determined?',
 '<p>Villa fiyatları; villanın konumu, kapasitesi, özellikleri, sezon dönemi ve konaklama süresine göre belirlenmektedir. <strong>Erken rezervasyon</strong> ve uzun süreli konaklama avantajlarından yararlanabilirsiniz.</p>',
 4, true),

('temizlik-hijyen',
 'Villalarda temizlik ve hijyen nasıl sağlanıyor?',
 'How is cleaning and hygiene maintained?',
 '<p>Tüm villalarımız her misafir değişiminde profesyonel temizlik ekipleri tarafından <strong>titizlikle temizlenmektedir</strong>. Çarşaf, havlu ve temel temizlik malzemeleri villada hazır olarak sunulmaktadır.</p>',
 5, true),

('ozel-havuzlu-villa',
 'Özel havuzlu villa kiralayabilir miyim?',
 'Can I rent a villa with a private pool?',
 '<p>Evet, portföyümüzde <strong>özel havuzlu</strong> birçok villa bulunmaktadır. Ayrıca havuzu korunaklı (dışarıdan görünmeyen) villalar, çocuk havuzlu villalar gibi özel kategorilerde de villa seçeneklerimiz mevcuttur.</p>',
 6, true),

('rezervasyon-onayi-suresi',
 'Rezervasyon onayı ne kadar sürede gelir?',
 'How long does reservation confirmation take?',
 '<p>Rezervasyon isteğiniz ekibimiz tarafından genellikle <strong>2 saat içinde</strong> değerlendirilir ve size geri dönüş yapılır. Yoğun dönemlerde bu süre uzayabilir, ancak aynı gün içinde mutlaka dönüş sağlanmaktadır.</p>',
 7, true),

('villa-tatilinde-guvenilir-mi',
 'Villa Tatilinde güvenilir mi?',
 'Is Villa Tatilinde trustworthy?',
 '<p>Villa Tatilinde, <strong>TÜRSAB Belge No: 18069</strong> ile tescilli, yasal güvencelere sahip profesyonel bir villa kiralama acentesidir. Tüm ödemeler iyzico güvencesi altında yapılmakta olup, villalarımız ekibimiz tarafından kontrol edilmektedir.</p>',
 8, true),

('taksitli-odeme',
 'Taksitle ödeme yapabilir miyim?',
 'Can I pay in installments?',
 '<p>Evet, birçok banka kartı ile <strong>taksitli ödeme</strong> imkanı sunmaktayız. Detaylı bilgi için <a href="/odeme-yontemleri" style="color:#50b0f0;text-decoration:underline;">Ödeme Yöntemleri</a> sayfamızı inceleyebilirsiniz.</p>',
 9, true),

('checkin-checkout-saatleri',
 'Check-in ve check-out saatleri nedir?',
 'What are check-in and check-out times?',
 '<p>Genel olarak check-in saati <strong>16:00</strong>, check-out saati ise <strong>10:00</strong>''dır. Ancak bu saatler villaya göre değişiklik gösterebilir. Detaylı bilgi villa sayfasında belirtilmektedir.</p>',
 10, true);
