"use client";

import Image from "next/image";
import Link from "next/link";

export default function IptalIadeContent() {
    return (
        <div className="iptal-page">
            <div
                className="paddingMobile"
                style={{ marginTop: "calc(2vh + 2vw)" }}
            >
                {/* ── Policy Content ── */}
                <div className="iptal-animate">
                    {/* ── Breadcrumb ── */}
                    <div
                        className="middle dm-sans"
                        style={{ color: "#85878a", fontSize: 13 }}
                    >
                        <Link href="/">
                            <div className="middle">
                                <Image
                                    src="/images/hom.png"
                                    width={11}
                                    height={11}
                                    alt="Anasayfa"
                                    style={{ marginRight: 3, height: 11, width: "auto" }}
                                />{" "}
                                Anasayfa
                            </div>
                        </Link>
                        <div style={{ margin: "0 12px", fontWeight: "bold" }}>
                            &bull;
                        </div>
                        <div>
                            <Image
                                src="/images/hom.png"
                                width={11}
                                height={11}
                                alt="İptal ve İade"
                                style={{ marginRight: 3, height: 11, width: "auto" }}
                            />{" "}
                            İptal ve İade Politikası
                        </div>
                    </div>

                    {/* ── Title ── */}
                    <h1 className="iptal-main-title">İptal ve İade Politikası</h1>
                    <div className="iptalFirstInfo">
                        Villa Tatilinde rezervasyon iptal ve iade koşulları
                    </div>

                    {/* ── Policy Items ── */}
                    <div className="middle">
                        <div
                            style={{
                                marginTop: 32,
                                width: "100%",
                                maxWidth: 800,
                            }}
                        >
                            {/* Item 1 */}
                            <div className="pitemsCancel">
                                <div className="pi1Cancel">
                                    1. Rezervasyon İptali ve İade Koşulları
                                </div>
                                <div className="pi2Cancel">
                                    Rezervasyonunuzu giriş tarihinden en az 30 gün önce
                                    iptal etmeniz halinde, ödediğiniz tutarın tamamı iade
                                    edilir. Giriş tarihine 30 günden az bir süre kala
                                    yapılan iptallerde, villa sahibinin belirlediği iptal
                                    politikası geçerlidir. Bu koşullar villa detay
                                    sayfasında belirtilmektedir.
                                </div>
                            </div>

                            {/* Item 2 */}
                            <div className="pitemsCancel">
                                <div className="pi1Cancel">
                                    2. Erken Çıkış Durumunda İade
                                </div>
                                <div className="pi2Cancel">
                                    Konaklamanız sırasında erken ayrılmanız durumunda,
                                    kullanılmayan gecelere ilişkin iade yapılmaz.
                                    Rezervasyonunuzu planlarken konaklama sürenizi doğru
                                    belirlemenizi öneririz. İstisnai durumlarda Villa
                                    Tatilinde ekibi ile iletişime geçebilirsiniz.
                                </div>
                            </div>

                            {/* Item 3 */}
                            <div className="pitemsCancel">
                                <div className="pi1Cancel">
                                    3. Mücbir Sebepler
                                </div>
                                <div className="pi2Cancel">
                                    Doğal afet, savaş, salgın hastalık gibi mücbir
                                    sebeplerin varlığı halinde, rezervasyonunuz tüm
                                    koşullardan bağımsız olarak tam iade ile iptal
                                    edilebilir veya uygun bir tarihe ertelenebilir.
                                    Mücbir sebeplerin belirlenmesinde T.C. resmi
                                    makamlarının açıklamaları esas alınır.
                                </div>
                            </div>

                            {/* Item 4 */}
                            <div className="pitemsCancel">
                                <div className="pi1Cancel">
                                    4. Depozito İade Politikası
                                </div>
                                <div className="pi2Cancel">
                                    Giriş sırasında nakit olarak alınan depozito, çıkış
                                    sırasında villa sahibi veya yetkili kişi tarafından
                                    yapılan kontrol sonrasında, herhangi bir hasar tespit
                                    edilmemesi durumunda eksiksiz olarak iade edilir.
                                    Hasar tespiti halinde, onarım maliyetleri depozitodan
                                    düşülebilir.
                                </div>
                            </div>

                            {/* Item 5 */}
                            <div className="pitemsCancel">
                                <div className="pi1Cancel">
                                    5. İade Süresi
                                </div>
                                <div className="pi2Cancel">
                                    Kredi kartı ile yapılan ödemelerin iadesi, iptal
                                    talebinizin onaylanmasından itibaren 7-14 iş günü
                                    içerisinde gerçekleştirilir. EFT ile yapılan
                                    ödemelerin iadesi ise 3-5 iş günü içerisinde
                                    belirttiğiniz banka hesabına aktarılır.
                                </div>
                            </div>

                            {/* Item 6 */}
                            <div className="pitemsCancell">
                                <div className="pi1Cancel">
                                    6. İletişim
                                </div>
                                <div className="pi2Cancel">
                                    İptal ve iade süreçleri hakkında detaylı bilgi almak
                                    için +90 242 606 0725 numarası veya
                                    info@villatatilinde.com adresi üzerinden bizimle
                                    iletişime geçebilirsiniz. Haftanın her günü 09:30 -
                                    22:30 arasında hizmet vermekteyiz.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Sub Contact Cards ── */}
                <div className="paddingMobile">
                    <div className="subContactC row">
                        <a
                            href="tel:+90 242 606 0725"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div className="subContactInfo middle bhs">
                                <Image
                                    src="/images/phone.png"
                                    width={24}
                                    height={24}
                                    alt="Telefon"
                                    style={{ height: 24, width: "auto" }}
                                />
                                <div style={{ marginLeft: 12 }}>
                                    <div>
                                        <span className="skiptranslate">
                                            Villa Tatilinde
                                        </span>{" "}
                                        Kalkan Ofis
                                    </div>
                                    <div>+90 242 606 0725</div>
                                </div>
                            </div>
                        </a>
                        <a
                            href="mailto:info@villatatilinde.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div className="subContactInfo middle bhs">
                                <Image
                                    src="/images/mail.png"
                                    width={24}
                                    height={24}
                                    alt="E-Posta"
                                    style={{ height: 24, width: "auto", padding: 2 }}
                                />
                                <div style={{ marginLeft: 12 }}>
                                    <div>
                                        <span className="skiptranslate">
                                            Villa Tatilinde
                                        </span>{" "}
                                        E-Posta
                                    </div>
                                    <div className="skiptranslate">
                                        info@villatatilinde.com
                                    </div>
                                </div>
                            </div>
                        </a>
                        <Link href="/iletisim">
                            <div className="subContactInfo middle bhs">
                                <Image
                                    src="/images/loc.png"
                                    width={24}
                                    height={24}
                                    alt="Konum"
                                    style={{ height: 24, width: "auto" }}
                                />
                                <div style={{ marginLeft: 12 }}>
                                    <div>
                                        <span className="skiptranslate">
                                            Villa Tatilinde
                                        </span>{" "}
                                        Kalkan Ofis
                                    </div>
                                    <div>
                                        KALKAN MAH. ŞEHİTLER CAD. NO: 53 KAŞ(ANTALYA)
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* ── Newsletter Subscription ── */}
                <div className="middle subsC">
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontWeight: 300, fontSize: 32 }}>
                            <span className="skiptranslate">Villa Tatilinde</span>{" "}
                            Aylık Mail Aboneliği
                        </div>
                        <div
                            style={{ fontSize: 16, marginTop: 16, opacity: 0.8 }}
                        >
                            En yeni villalar güncel promosyonlar indirimli villalar
                            ve çok daha fazlası
                        </div>
                        <div className="middleft" style={{ marginTop: 32 }}>
                            <input
                                className="subsInput"
                                placeholder="E-postanızı yazın"
                                type="email"
                            />
                            <div className="subsBtn bhs middle">ABONE OL</div>
                        </div>
                        <div
                            style={{ fontSize: 14, marginTop: 4, opacity: 0.7 }}
                        >
                            Abone olarak,{" "}
                            <Link href="/sartlar-kosullar">
                                <span style={{ textDecoration: "underline" }}>
                                    şartlar ve koşulları
                                </span>
                            </Link>{" "}
                            kabul etmiş ve{" "}
                            <Link href="/gizlilik-politikasi">
                                <span style={{ textDecoration: "underline" }}>
                                    gizlilik politikamızı
                                </span>
                            </Link>{" "}
                            onaylamış olursunuz.
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Mini Footer ── */}
            <div
                style={{
                    padding: "4px 1%",
                    marginTop: 48,
                    borderTop: "1px solid #dfdfe3",
                }}
            >
                <div className="middleft smallFooterC">
                    <div className="smallFooterLeft1">
                        &copy; 2026{" "}
                        <span className="skiptranslate">Villa Tatilinde</span>
                        <br />
                        Belge No: 18069 - PRAEDIUM GROUP TRAVEL AGENCY
                    </div>
                    <div className="smallFooterRight1">
                        <Link href="/sartlar-kosullar">Koşullar ve Şartlar</Link>
                    </div>
                    <div className="smallFooterRight2">
                        <Link href="/gizlilik-politikasi">Gizlilik</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
