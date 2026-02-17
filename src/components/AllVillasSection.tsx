"use client";

import React from "react";
import Link from "next/link";

/* ─── SEO Content ─── */
const SEO_CONTENT = `
<h1 style="font-size:22px;font-weight:700;margin:0 0 12px 0;">Neden Villa Tatilinde?</h1>
<p>Villa Tatilinde olarak sizlere, klasik tatil anlayışının ötesine geçen özgür ve konforlu bir tatil deneyimi sunuyoruz. Son yıllarda hızla yükselen villa kiralama trendi, artık otel tatillerinin önüne geçiyor. Çünkü villa tatili size hem fiyat hem de konfor açısından eşsiz avantajlar sağlıyor. Biz de Villa Tatilinde ailesi olarak, bu avantajlardan en güzel şekilde faydalanmanız için her zaman yanınızdayız.</p>

<h2 style="font-size:20px;font-weight:700;margin:24px 0 10px 0;">Villa Tatilinin Avantajları</h2>
<p>Villa tatili, kendinizi özel hissettiğiniz ve kişisel tercihlerinize göre şekillendirebiileceğiniz bir tatil biçimidir. Kalacağınız villayı, tatil tarzınıza ve ihtiyaçlarınıza göre seçebilirsiniz. İster ailenizle, ister dostlarınızla, dilersen balayı çifti olarak konaklayın — Villa Tatilinde her zevke ve bütçeye uygun seçenekler sunar. Villalarımızın büyüklüğünü, oda sayısını ve konumunu tamamen siz belirlersiniz. Doğa içinde sessiz ve korunaklı villalar, denize sıfır lüks villalar veya şehir merkezine yakın konforlu seçenekler arasından dilediğinizi seçebilirsiniz. Ev rahatlığında, özgürce ve zamana bağlı kalmadan tatilinizi yaşarsınız.</p>

<h2 style="font-size:20px;font-weight:700;margin:24px 0 10px 0;">Villa Tatilinde Güven ve Fiyat Garantisi</h2>
<p>Villa Tatilinde, sadece geniş villa portföyüyle değil, aynı zamanda güvenilir rezervasyon sistemi ve en uygun fiyat garantisi ile de fark yaratır. Müşterilerimizin hayalindeki tatili en iyi koşullarda yaşayabilmeleri için tatilin her aşamasında yanınızdayız. Villa tatilinde boyunca yapmak istediğiniz aktivitelerde, Villa Tatilinde müşterilerine özel avantajlı anlaşmalar da sunuyoruz. Tekne turları, doğa gezileri, özel restoran fırsatları ve daha fazlası ile tatilinizi unutulmaz anlarla zenginleştiriyoruz.</p>

<h2 style="font-size:20px;font-weight:700;margin:24px 0 10px 0;">Villa Tatilinde Lokasyon ve Seçenek Çeşitliliği</h2>
<p>Tatilinizi planlarken Kaş, Kalkan, Fethiye ve Belek gibi Türkiye'nin en gözde bölgelerinde yer alan villalarımız arasından seçim yapabilirsiniz. Doğa ile iç içe huzurlu bir tatil mi istiyorsunuz? Yoksa denize sıfır bir manzarada günesi batırmak mı? Villa Tatilinde her isteğe uygun bir seçenek bulabilirsiniz.</p>
<p>Web sitemiz üzerinden güvenli ve kolay rezervasyon yapabilir, sosyal medya hesaplarımızdan kampanyalarımızı ve fırsatları takip edebilirsiniz. Ayrıca, şeffaf yaklaşımımız sayesinde tüm villalarımızı fotoğrafları ve detaylı açıklamalarıyla inceleyebilirsiniz.</p>

<h2 style="font-size:20px;font-weight:700;margin:24px 0 10px 0;">Kalkan'da Villa Tatili Yapmak</h2>
<p>Antalya'nın Kaş ilçesine bağlı olan Kalkan, Türkiye'nin en gözde villa tatil destinasyonlarından biridir. Kalkan'da villa tatili yapmak, sadece konforlu bir konaklama değil; aynı zamanda tarih, kültür ve doğayı bir arada deneyimleme fırsatı sunar.</p>
<p>Manzaranızı siz seçin: İsterseniz masmavi göllerin arasında sessiz bir doğa vilası, isterseniz Kalkan merkezinde deniz manzaralı bir villa tercih edebilirsiniz. Kalkan'da yapacağınız villa tatili, size hem görsel hem de ruhsal bir şölen sunacaktır.</p>

<h3 style="font-size:18px;font-weight:700;margin:20px 0 8px 0;">Kaş ve Kalkan Arasındaki Farklar</h3>
<p>Kaş ve Kalkan, birbirine yakın iki tatil beldesi olmasına rağmen, farklı tatil deneyimleri sunar. Kaş daha hareketli ve sosyal bir atmosfere sahipken, Kalkan sakin ve huzurlu yapısıyla ön plana çıkar. Her iki bölgede de Villa Tatilinde'nin özenle seçilmiş villa portföyünden faydalanabilirsiniz.</p>

<h3 style="font-size:18px;font-weight:700;margin:20px 0 8px 0;">Kalkan'da Yapılabilecek Aktiviteler</h3>
<p>Kalkan, zengin aktivite seçenekleriyle tatilcilerin gözdesidir. Tekne turları, dalış, kanyoning, yamaç paraşütü ve bisiklet turları gibi macera dolu aktivitelerin yanı sıra; antik kentler, Likya yolu yürüyüşleri ve yerel pazarlar da kültürel deneyimler sunar.</p>

<h2 style="font-size:20px;font-weight:700;margin:24px 0 10px 0;">Hayalinizdeki Villa Tatili İçin Villa Tatilinde!</h2>
<p>Villa Tatilinde olarak, sizin için en uygun villayı bulmak ve unutulmaz bir tatil deneyimi yaşatmak en büyük önceliğimizdir. Geniş villa portföyümüz, güvenilir hizmetimiz ve uygun fiyat garantimizle bu yaz #VillaTatilinde!</p>
`;

export default function AllVillasSection() {
    return (
        <>
            {/* ─── Tüm Villalar Button ─── */}
            <div
                style={{
                    marginTop: "calc(4vw + 32px)",
                }}
            >
                <div
                    className="middle paddingMobile"
                    style={{
                        width: "100%",
                        marginTop: 20,
                        marginBottom: 12,
                    }}
                >
                    <Link href="/sonuclar" style={{ textDecoration: "none" }}>
                        <div
                            className="allVillasBtn"
                            style={{
                                overflow: "hidden",
                                textAlign: "center",
                                minWidth: 265,
                                background: "#ebeef51a",
                                zIndex: 2,
                                position: "relative",
                                padding: "14px 32px",
                                borderRadius: 14,
                            }}
                        >
                            <div
                                className="bhs middle"
                                style={{
                                    width: "100%",
                                    fontSize: 24,
                                    fontWeight: 500,
                                    color: "#222",
                                }}
                            >
                                Tüm Villalar
                                <img
                                    src="/images/iconlink.svg"
                                    style={{ marginLeft: 6, height: 32 }}
                                    alt="Tüm Villalar"
                                />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* ─── SEO Content ─── */}
            <div
                className="paddingMobile mainInfo"
                style={{
                    marginTop: "calc(32px + 2vw)",
                    fontSize: 18,
                    marginBottom: 40,
                }}
            >
                <div dangerouslySetInnerHTML={{ __html: SEO_CONTENT }} />
            </div>
        </>
    );
}
