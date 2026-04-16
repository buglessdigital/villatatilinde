-- ============================================================
-- 009: BLOG YAZILARINI EKLE (Seed Data)
-- 6 adet blog yazısı — tatil rehberleri ve ipuçları
-- ============================================================

INSERT INTO blogs (slug, title, subtitle, author, cover_image_url, tags, content_html, read_time_min, is_published, published_at) VALUES

-- Blog 1
('kasta-villa-tatili-rehberi',
 'Kaş''ta Villa Tatili Rehberi',
 'Kaş''ın en güzel villaları ve yapılacak aktiviteler',
 'Villa Tatilinde',
 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
 ARRAY['Kaş', 'Villa Tatili', 'Rehber'],
 '<h2>Kaş''ta Unutulmaz Bir Villa Tatili</h2>
<p>Kaş, Türkiye''nin en güzel tatil destinasyonlarından biri olarak bilinir. Muhteşem deniz manzaraları, tarihi kalıntıları ve eşsiz doğasıyla her yıl binlerce turisti ağırlamaktadır.</p>
<h3>Neden Kaş''ta Villa Kiralamalısınız?</h3>
<p>Otel konaklamasına kıyasla villa kiralama, aileniz veya arkadaş grubunuzla çok daha özel ve konforlu bir tatil deneyimi sunar. Özel havuz, geniş bahçe ve bağımsız yaşam alanları ile tatilinizi dilediğiniz gibi geçirebilirsiniz.</p>
<h3>En İyi Villalar</h3>
<p>Kalkan merkez, Kalamar koyu ve Kızıltaş bölgelerinde birbirinden güzel villalar bulabilirsiniz. Deniz manzaralı villalar özellikle yaz aylarında yoğun talep görmektedir.</p>
<h3>Yapılacak Aktiviteler</h3>
<ul>
<li>Kekova batık şehir tekne turu</li>
<li>Dalış ve şnorkelling</li>
<li>Likya Yolu yürüyüşü</li>
<li>Patara plajı ziyareti</li>
</ul>',
 5, true, '2026-02-15T10:00:00Z'),

-- Blog 2
('kalkanda-yapilacak-en-iyi-aktiviteler',
 'Kalkan''da Yapılacak En İyi Aktiviteler',
 'Tekne turlarından yürüyüş rotalarına kadar en iyi aktiviteler',
 'Villa Tatilinde',
 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
 ARRAY['Kalkan', 'Aktiviteler', 'Rehber'],
 '<h2>Kalkan''da Tatil Aktiviteleri</h2>
<p>Kalkan, sakin atmosferi ve turkuaz renkli denizi ile Antalya''nın en popüler tatil beldelerinden biridir. İşte Kalkan''da yapabileceğiniz en iyi aktiviteler:</p>
<h3>1. Tekne Turları</h3>
<p>Kalkan''dan kalkan günlük tekne turları ile gizli koyları keşfedebilirsiniz. Özellikle Mavi Mağara ve Kelebek Vadisi turları çok popülerdir.</p>
<h3>2. Dalış</h3>
<p>Kalkan sularında zengin deniz yaşamı ve antik kalıntılar dalış tutkunlarını beklemektedir.</p>
<h3>3. Yürüyüş Parkurları</h3>
<p>Likya Yolu''nun bir bölümü Kalkan''dan geçer. Doğa severler için muhteşem manzaralar sunar.</p>
<h3>4. Yerel Lezzetler</h3>
<p>Kalkan''ın dar sokaklarındaki restoranlar, taze deniz ürünleri ve Akdeniz mutfağının en iyi örneklerini sunar.</p>',
 7, true, '2026-02-10T10:00:00Z'),

-- Blog 3
('villa-kiralama-ipuclari',
 'Villa Kiralama İpuçları ve Dikkat Edilmesi Gerekenler',
 'İlk kez villa kiralayacaklar için kapsamlı rehber',
 'Villa Tatilinde',
 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
 ARRAY['Villa Kiralama', 'İpuçları', 'Güvenlik'],
 '<h2>Villa Kiralama Rehberi</h2>
<p>Villa kiralama sürecinde dikkat etmeniz gereken önemli noktalar, doğru villa seçimi, fiyat karşılaştırması ve güvenli ödeme yöntemleri hakkında detaylı rehberimiz.</p>
<h3>Doğru Villayı Seçmek</h3>
<p>Villa seçerken konumu, kapasite, havuz büyüklüğü ve sunulan olanakları dikkatlice değerlendirin. Fotoğrafları inceleyin ve mümkünse yorumları okuyun.</p>
<h3>Güvenli Ödeme</h3>
<p>Her zaman güvenilir platformlar üzerinden ödeme yapın. Kaparo miktarını ve iptal koşullarını önceden kontrol edin.</p>
<h3>Check-in ve Check-out</h3>
<p>Giriş ve çıkış saatlerini öğrenin. Genellikle giriş 16:00, çıkış 10:00''dır. Erken giriş veya geç çıkış talep edebilirsiniz.</p>',
 6, true, '2026-02-05T10:00:00Z'),

-- Blog 4
('antalyanin-gizli-cennetleri',
 'Antalya''nın Gizli Cennetleri',
 'Kalabalıktan uzak, huzurlu tatil rotaları',
 'Villa Tatilinde',
 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800',
 ARRAY['Antalya', 'Gezi', 'Doğa'],
 '<h2>Antalya''nın Keşfedilmemiş Güzellikleri</h2>
<p>Antalya denince akla genellikle Konyaaltı ve Lara plajları gelir. Ancak Antalya''nın keşfedilmemiş koyları ve doğal güzellikleri çok daha fazlasını sunar.</p>
<h3>Suluada</h3>
<p>Antalya''nın Maldivleri olarak bilinen Suluada, turkuaz suları ve bembeyaz kumlarıyla büyüleyici bir ada.</p>
<h3>Adrasan</h3>
<p>Kalabalıktan uzak, sakin bir koy. Doğa severler için mükemmel bir kaçış noktası.</p>
<h3>Olimpos</h3>
<p>Antik kent kalıntıları ve doğal plajıyla tarih ve doğayı bir arada yaşayabileceğiniz eşsiz bir yer.</p>',
 8, true, '2026-02-01T10:00:00Z'),

-- Blog 5
('fethiyede-ailecek-tatil-planlamasi',
 'Fethiye''de Ailecek Tatil Planlaması',
 'Aileler için en iyi villa ve aktiviteler',
 'Villa Tatilinde',
 'https://images.unsplash.com/photo-1602391833977-358a52198938?w=800',
 ARRAY['Fethiye', 'Aile', 'Tatil Planı'],
 '<h2>Fethiye''de Aile Tatili</h2>
<p>Fethiye, aile dostu villaları, güvenli plajları ve çocuklara uygun aktiviteleriyle harika bir tatil destinasyonudur.</p>
<h3>Aile Dostu Villalar</h3>
<p>Çocuk havuzlu, geniş bahçeli ve güvenli çevresi olan villalar Fethiye''de bolca bulunur. Özellikle Hisarönü ve Ölüdeniz bölgeleri aileler için idealdir.</p>
<h3>Çocuklarla Aktiviteler</h3>
<ul>
<li>Ölüdeniz Lagünü''nde yüzme</li>
<li>Kelebekler Vadisi gezisi</li>
<li>Saklıkent Kanyonu macerası</li>
<li>Kayaköy tarihi yürüyüşü</li>
</ul>',
 4, true, '2026-01-25T10:00:00Z'),

-- Blog 6
('bodrum-villa-tatili',
 'Bodrum Villa Tatili: Nereye, Nasıl?',
 'Bodrum yarımadasının en güzel villaları',
 'Villa Tatilinde',
 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800',
 ARRAY['Bodrum', 'Villa', 'Gece Hayatı'],
 '<h2>Bodrum''da Villa Tatili</h2>
<p>Bodrum yarımadasının en güzel villaları, ulaşım seçenekleri, yeme-içme önerileri ve gece hayatı hakkında detaylı bilgiler.</p>
<h3>En İyi Bölgeler</h3>
<p>Yalıkavak, Göltürkbükü ve Türkbükü lüks villa seçenekleriyle öne çıkar. Bitez ve Gümüşlük ise sakin ve huzurlu bir tatil isteyenler için idealdir.</p>
<h3>Ulaşım</h3>
<p>Milas-Bodrum Havalimanı''ndan yarımadanın her noktasına kolayca ulaşabilirsiniz. Transfer hizmetleri veya araç kiralama seçenekleri mevcuttur.</p>
<h3>Gece Hayatı</h3>
<p>Bodrum, canlı gece hayatıyla ünlüdür. Yalıkavak Marina ve Bodrum Barlar Sokağı en popüler eğlence merkezleridir.</p>',
 6, true, '2026-01-20T10:00:00Z');
