# Projedeki Diller ve Teknolojiler (Junior Geliştirici Rehberi)

Bu dokümanda projemizde hangi dillerin ve teknolojilerin kullanıldığını, ve **neden** bunları tercih ettiğimizi basit bir dille açıklıyoruz. Yeni katılan bir geliştirici olarak projeyi anlaman için bilmen gereken temel yapı taşları bunlardır.

---

### 1. TypeScript (`.ts`, `.tsx`) - Ana Programlama Dili 👑
Projendeki kodların büyük bir çoğunluğu **TypeScript** ile yazılmıştır. `src` klasörünün içine baktığında her yerin `.tsx` ve `.ts` dosyalarıyla dolu olduğunu görebilirsin.

**Peki neden JavaScript yerine TypeScript kullanıyoruz?**
- **Hataları Kodlarken Yakalamak:** JavaScript'te bir hata yaparsan (örneğin bir objeye olmayan bir özellik eklersen), bunu ancak kodu çalıştırıp o sayfaya gidince anlarsın. TypeScript, **statik tip kontrolü** sunar. Yani sen daha kodu yazarken editörün (VS Code gibi) altını kırmızı çizer, *"Burada bir hata var, bu değişkene sadece 'sayı' verebilirsin, ama sen 'metin' vermişsin"* der. Bu da zaman kazandırır ve sürpriz hataları önler.
- **Daha İyi Otomatik Tamamlama (IntelliSense):** Projede çok fazla component ve veri modeli var (örn. Villalar, Kategoriler). TypeScript sayesinde `villa.` yazdığın anda içinde `id`, `name`, `price` gibi hangi verilerin olduğunu editör anında sana gösterir. Her seferinde dönüp veritabanı veya API dokümanına bakmana gerek kalmaz.
- **Büyük Projelerde Yönetilebilirlik:** Bu gibi Next.js tabanlı, kapsamlı bir projede işleri "tahmin ederek" ilerletemeyiz. Proje katı kurallarla (`tsconfig.json` dosyasında `"strict": true` olarak) yapılandırılmıştır. Yani TypeScript bize "düzenli kod yazma zorunluluğu" getirir, bu da ekipçe çalışırken veya aylar sonra koda bakarken hayat kurtarır.

> *Not: Uzantısı `.tsx` olan dosyalar içinde React (HTML benzeri yapılar - JSX) barındıran component'lerdir. Uzantısı sadece `.ts` olanlar ise fonksiyon, API isteği veya tip tanımları gibi salt mantık dosyalarıdır.*

---

### 2. SQL (`.sql`) - Veritabanı Dili 🗄️
Projenin içinde `/supabase` adında bir klasör var ve bunun içinde çeşitli `.sql` dosyaları bulunuyor.

**Neden SQL?**
- **Supabase Altyapısı:** Proje veritabanı ve arka uç hizmeti olarak **Supabase** kullanıyor. Supabase, arka planda bir **PostgreSQL** veritabanı çalıştırır.
- **Veritabanını Versiyonlama (Migration):** Normalde Supabase web paneline girip elle tablo oluşturabilirsin. Ancak projede tablo yapıları ve güvenlik kuralları (RLS policy) SQL dosyaları halinde tutuluyor.
- **Nasıl Çalışır:** Temel amaç, ekibe yeni katılan herkesin projeyi Github'tan çektiğinde sıfırdan aynı veritabanı yapısını hatasız bir şekilde kendi bilgisayarında veya yeni bir projede ayağa kaldırabilmesini sağlamaktır. Buna "Migration" denir ve bu işlemleri taşınabilir kılmak için SQL en ideal standarttır.

---

### 3. CSS / Tailwind CSS (`.css`) - Stil ve Görünüm Dili 🎨
Projede yapılandırma için bir `globals.css` dosyası var ancak asıl stil mekanizması olarak **Tailwind CSS (v4)** (*utility-first CSS framework*) kullanılmıştır.

**Neden Geleneksel CSS yerine Tailwind CSS?**
- **Hız ve Pratiklik:** Normalde bir butona stil vermek için ayrı bir CSS dosyasına gidip class (sınıf) yazarsın, sonra HTML'deki elemente o class'ı tanımlarsın. Tailwind ile doğrudan `.tsx` dosyası içinde (örneğin: `className="bg-blue-500 text-white rounded-lg px-4"`) gibi önceden hazırlanmış sınıfları kullanarak **farklı bir dosyaya geçmeden** çok hızlıca elementleri şekillendirebilirsin.
- **Kodu Küçültür (Performans):** Projeyi canlıya aldığında (build işlemi sırasında), Tailwind senin hangi sınıfları kullandığını tarar ve **sadece o kullandığın sınıfları** alıp küçücük, optimize bir CSS dosyası üretir. Siten gereksiz CSS yüklerinden kurtulur, çok daha hızlı açılır.
- **Component Mimarisiyle Uyumu:** Next.js ve React gibi Component tabanlı yapılarda, tasarım stillerinin componente yapışık(inline benzeri ama class'lar ile) yazılması artık modern bir standarttır. Projedeki `globals.css` sadece bazı font yüklemeleri (@font-face) ve çok temel tarayıcı sıfırlama (reset) işlemleri için vardır.

---

### Özet: Başlamak İçin Ne Bilmelisin?
Bu projede rahatça görev alabilmek için şu 4 temele odaklanmalısın:
1. **TypeScript (`.ts/.tsx`):** Arayüzleri (`Interface`) ve Tipleri (`Type`) iyi okuyabilmeli ve yazabilmelisin.
2. **React / Next.js:** Ekrandaki yapıların (Componentlerin) nasıl oluşturulduğunu, birbirine bağlanıp parametre (prop) aldığını bilmelisin.
3. **TailwindCSS:** Arayüz tasarlarken Tailwind class isimlerine (örneğin `flex`, `pt-4`, `w-full`, `justify-between` vb.) aşina olmalısın.
4. **Temel SQL Yapısı:** Verilerin tablolar halinde nasıl saklandığını ve birbirine nasıl bağlandığını (ilişkilerini) anlamak, Supabase tarafındaki süreçleri kavramanı kolaylaştırır.
