// loadtest.js
const autocannon = require('autocannon');

async function startLoadTest() {
  console.log("🚀 Yük testi başlatılıyor: Aynı anda 1000 kullanıcı simüle ediliyor...");
  
  const targetUrl = 'http://localhost:3000';

  const instance = autocannon({
    url: targetUrl,
    connections: 1000, // 1000 eşzamanlı bağlantı
    duration: 10,      // 10 saniye sürecek
    pipelining: 1,     // Her bağlantı üzerinden peş peşe istek gönderimi
    timeout: 10,       // 10 saniye bekleme
  });

  autocannon.track(instance, { renderProgressBar: true });

  instance.on('done', (result) => {
    console.log("\n✅ Yük Testi Bitti!\n");
    console.log(`🎯 Test URL: ${result.url}`);
    console.log(`⏱️  Toplam Süre: ${result.duration} saniye`);
    console.log(`👥 Eşzamanlı Kullanıcı: ${result.connections}`);
    console.log(`-----------------------------------------------`);
    console.log(`📦 Toplam İstek (Request): ${result.requests.total}`);
    console.log(`❌ Hatalı İstek (Error/Timeout): ${result.errors} / ${result.timeouts}`);
    console.log(`⚡ Saniyede Ortalama İstek (Req/Sec): ${result.requests.average}`);
    console.log(`⏱️  Ortalama Yanıt Süresi (Latency): ${result.latency.average} ms`);
    console.log(`📈 Maksimum Yanıt Süresi: ${result.latency.max} ms`);
    
    // Eğer tüm istekler başarısız/timeout olduysa uyaralım.
    if(result.errors > 0 || result.timeouts > 0) {
      console.log("\n⚠️ Uyarı: Hata veya Zaman aşımı değerleri yüksek.");
      console.log("Bunun nedeni Development modunda (npm run dev) çalışmanız olabilir. Yük testleri gerçekçi sonuçlar vermesi için Production (npm run build && npm start) modunda çalıştırılmalıdır.");
    }
  });

  // Hata durumlarını yakalayalım
  instance.on('error', (err) => {
    console.error("❌ Test sırasında bir hata oluştu (Sunucu kapalı olabilir):", err.message);
  });
}

startLoadTest();
