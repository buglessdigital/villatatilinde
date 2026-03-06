"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="site-footer">
            {/* ═══════════════ DESKTOP FOOTER ═══════════════ */}
            <div className="footer-desktop footer-container">
                <div style={{ textAlign: "right", marginBottom: -24, position: "relative", zIndex: 10 }}>
                    <button
                        onClick={scrollToTop}
                        style={{
                            background: "transparent",
                            border: "1px solid #ffffff44",
                            cursor: "pointer",
                            width: 32,
                            height: 32,
                            borderRadius: 4,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                    </button>
                </div>

                <div className="footer-row">
                    {/* ─── Column 1: Logos & Trust ─── */}
                    <div className="f1c">
                        <div style={{ color: "#282f39", fontWeight: 300 }}>
                            <img
                                src="/images/vtlo.png"
                                alt="Villa Tatilinde"
                                style={{ height: 62, width: "auto" }}
                            />
                            <div style={{ marginTop: 4 }}>
                                <img
                                    src="/images/prl2.jpeg"
                                    alt="Praedium Group"
                                    style={{
                                        height: 62,
                                        width: "auto",
                                        border: "1px solid #dfdfe3aa",
                                    }}
                                />
                            </div>
                        </div>
                        <div style={{ marginTop: 24 }}>
                            <a
                                href="https://www.tursab.org.tr/tr/ddsv"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: "block", marginBottom: 12 }}
                            >
                                <img
                                    src="/images/tursab-dds-18069.png"
                                    alt="TURSAB DDS 18069"
                                    style={{ width: 200, height: "auto", borderRadius: 8 }}
                                />
                            </a>
                            <a
                                href="https://etbis.eticaret.gov.tr/sitedogrulama/5073561215243103"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: "block", marginBottom: 20 }}
                            >
                                <img
                                    src="/images/etbis.jpeg"
                                    alt="ETBİS'e Kayıtlıdır"
                                    style={{ width: 80, height: "auto" }}
                                />
                            </a>
                        </div>
                        <div style={{ maxWidth: "85%" }}>
                            <div style={{ color: "#c5c5c7", fontWeight: 400, fontSize: 13, marginBottom: 4 }}>
                                Villa Tatilinde ile güvenle kirala
                            </div>
                            <div style={{ color: "#c5c5c7", fontWeight: 400, fontSize: 13, lineHeight: 1.4 }}>
                                Sitemizde listelenen tüm villalar kontrol edilmiştir
                            </div>
                        </div>
                    </div>

                    {/* ─── Column 2: Sayfalar ─── */}
                    <div className="f2c">
                        <div className="fhead poppins">Sayfalar</div>
                        <Link href="/hakkimizda"><div className="linkType1 footer-link">Hakkımızda</div></Link>
                        <Link href="/harita"><div className="linkType2 footer-link">Villalar Harita Görünümü</div></Link>
                        <div className="linkType2 footer-link" style={{ cursor: "pointer" }}>Referans Kodu İle Villa Arama</div>
                        <Link href="/tatil-yerleri"><div className="linkType2 footer-link">Tatil Yerleri</div></Link>
                        <Link href="/villa-kategorileri"><div className="linkType2 footer-link">Villa Kategorileri</div></Link>
                        <Link href="/bloglar"><div className="linkType2 footer-link" style={{ marginTop: 20 }}>Bloglar</div></Link>
                    </div>

                    {/* ─── Column 3: Fırsatlar ─── */}
                    <div className="f3c">
                        <div className="fhead poppins">Fırsatlar</div>
                        <Link href="/indirimli-villalar"><div className="linkType1 footer-link">İndirimli Villalar</div></Link>
                        <Link href="/promosyonlar"><div className="linkType2 footer-link">Güncel Promosyonlar</div></Link>
                        <Link href="/kisa-sureli-kiralik-villalar"><div className="linkType2 footer-link">Kısa Süreli Kiralık Villalar</div></Link>
                        <Link href="/qr-indirim-kodu"><div className="linkType2 footer-link">QR Kodu İndirim Avantajları</div></Link>
                    </div>

                    {/* ─── Column 4: Destek & Yardım ─── */}
                    <div className="f4c">
                        <div className="fhead poppins">Destek &amp; Yardım</div>
                        <Link href="/bildirim?chat=true">
                            <div className="linkType1 footer-link" style={{ position: "relative", display: "inline-block" }}>
                                Canlı Destek
                                <span style={{ position: "absolute", top: 2, right: -12, width: 6, height: 6, borderRadius: "50%", background: "#e83e8c" }} />
                            </div>
                        </Link>
                        <Link href="/iletisim"><div className="linkType2 footer-link">İletişim - Bize Ulaşın</div></Link>
                        <Link href="/sikca-sorulan-sorular"><div className="linkType2 footer-link">Sıkça Sorulan Sorular  s.s.s</div></Link>
                        <a href="https://wa.me/905323990748" target="_blank" rel="noopener noreferrer">
                            <div className="linkType2 footer-link">WhatsApp</div>
                        </a>
                        <a href="tel:+90 242 606 0725" target="_blank" rel="noopener noreferrer">
                            <div className="linkType2 footer-link" style={{ display: "flex", alignItems: "center" }}>
                                <img src="/images/phonew.png" alt="" style={{ height: 13, width: "auto", marginRight: 8, opacity: 0.8 }} />
                                +90 242 606 0725
                            </div>
                        </a>
                        <a href="mailto:info@villatatilinde.com" target="_blank" rel="noopener noreferrer">
                            <div className="linkType2 footer-link" style={{ display: "flex", alignItems: "center" }}>
                                <img src="/images/mailw.png" alt="" style={{ height: 11, width: "auto", marginRight: 8, opacity: 0.8 }} />
                                info@villatatilinde.com
                            </div>
                        </a>
                    </div>
                </div>

                {/* ═══════════════ PAYMENT & SOCIAL ═══════════════ */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 40, borderBottom: "1px solid #333", paddingBottom: 24 }}>
                    <div>
                        <div className="poppins fheadBot" style={{ marginBottom: 12 }}>Ödeme &amp; Güvenlik</div>
                        <Link href="/odeme-yontemleri" style={{ display: "block", textDecoration: "none" }}>
                            <div className="paysecsub footer-row" style={{ gap: 8, marginBottom: 12 }}>
                                <img src="/images/hc1.svg" className="paysecim" alt="Bonus Card" />
                                <img src="/images/hc2.svg" className="paysecim" alt="Maximum" />
                                <img src="/images/hc3.svg" className="paysecim" alt="World" />
                                <img src="/images/hc4.svg" className="paysecim" alt="BankKart" />
                                <img src="/images/hc5.svg" className="paysecim" alt="CardFinans" />
                                <img src="/images/hc6.svg" className="paysecim" alt="Axess" />
                                <img src="/images/hc9.svg" className="paysecim" alt="Advantage" />
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
                                <img src="/images/iyzi_white.svg" alt="iyzico" style={{ height: 18 }} onError={(e) => e.currentTarget.src = "/images/iyzl.png"} />
                                <img src="/images/visa.svg" alt="Visa" style={{ height: 16 }} onError={(e) => e.currentTarget.src = "/images/iyzl.png"} />
                                <img src="/images/mastercard.svg" alt="Mastercard" style={{ height: 16 }} onError={(e) => e.currentTarget.src = "/images/iyzl.png"} />
                                <img src="/images/amex.svg" alt="Amex" style={{ height: 16 }} onError={(e) => e.currentTarget.src = "/images/iyzl.png"} />
                                <img src="/images/troy.svg" alt="Troy" style={{ height: 16 }} onError={(e) => e.currentTarget.src = "/images/iyzl.png"} />
                            </div>
                            <div style={{ display: "flex", alignItems: "center", color: "#ffffffaa", fontWeight: 400, fontSize: 13 }}>
                                <img src="/images/sslg.png" alt="SSL" style={{ height: 12, marginRight: 6 }} />
                                İyzico Güvencesi ile Güvenli Ödeme
                            </div>
                        </Link>
                    </div>

                    <div>
                        <div className="poppins fheadBot" style={{ marginBottom: 12, textAlign: "right" }}>Bizi Takip Edin</div>
                        <div style={{ display: "flex", gap: 20 }}>
                            <a href="https://instagram.com/villatatilinde" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ display: "flex", alignItems: "center", color: "#c5c5c7", fontSize: 15, textDecoration: "none" }}>
                                <img src="/images/instagramw.svg" alt="Instagram" style={{ height: 16, width: "auto", marginRight: 6, opacity: 0.8 }} />
                                villatatilinde
                            </a>
                            <a href="https://www.facebook.com/share/17PKGdZK2x/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ display: "flex", alignItems: "center", color: "#c5c5c7", fontSize: 15, textDecoration: "none" }}>
                                <img src="/images/facebookw.svg" alt="Facebook" style={{ height: 16, width: "auto", marginRight: 6, opacity: 0.8 }} />
                                villatatilinde
                            </a>
                        </div>
                    </div>
                </div>

                {/* ═══════════════ BOTTOM BAR ═══════════════ */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#888", fontSize: 13, paddingTop: 16, paddingBottom: 32 }}>
                    <div>©Villatatilinde — Praedium Group</div>
                    <div style={{ display: "flex", gap: 24 }}>
                        <Link href="/gizlilik-politikasi" className="footer-link">Gizlilik Politikası</Link>
                        <Link href="/sartlar-kosullar" className="footer-link">Şartlar ve Koşullar</Link>
                        <Link href="/iptal-iade-politikalari" className="footer-link">İptal ve İade Politikası</Link>
                    </div>
                </div>
            </div>

            {/* ═══════════════ MOBILE FOOTER ═══════════════ */}
            <div className="footer-mobile" style={{ display: "none", padding: "40px 20px 100px 20px", fontFamily: "'Poppins', sans-serif" }}>
                <div style={{ textAlign: "right", marginBottom: 16 }}>
                    <button
                        onClick={scrollToTop}
                        style={{
                            background: "transparent",
                            border: "1px solid #ffffff44",
                            cursor: "pointer",
                            width: 32,
                            height: 32,
                            borderRadius: 4,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                    </button>
                </div>

                <div style={{ textAlign: "center" }}>
                    <Link href="/">
                        <img src="/images/vtlo.png" alt="Villa Tatilinde" style={{ height: 62, width: "auto", margin: "0 auto" }} />
                    </Link>
                    <img src="/images/prl2.jpeg" alt="Praedium Group" style={{ height: 50, width: "auto", margin: "8px auto 0", display: "block" }} />

                    <div style={{ marginTop: 24, marginBottom: 24 }}>
                        <Link href="/hakkimizda" style={{ color: "#fff", fontSize: 13, fontWeight: 400, textDecoration: "none" }}>
                            Hakkımızda &gt;
                        </Link>
                    </div>

                    <div style={{ marginTop: 24, display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ color: "#fff", fontSize: 15, fontWeight: 500, marginBottom: 12 }}>İyzico ile güvenli ödeme</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                            <img src="/images/visa.svg" alt="Visa" style={{ height: 16 }} onError={(e) => e.currentTarget.src = "/images/iyzl.png"} />
                            <img src="/images/mastercard.svg" alt="Mastercard" style={{ height: 16 }} onError={(e) => e.currentTarget.src = "/images/iyzl.png"} />
                            <img src="/images/amex.svg" alt="Amex" style={{ height: 16 }} onError={(e) => e.currentTarget.src = "/images/iyzl.png"} />
                            <img src="/images/troy.svg" alt="Troy" style={{ height: 16 }} onError={(e) => e.currentTarget.src = "/images/iyzl.png"} />
                        </div>
                    </div>

                    <div style={{ marginTop: 32, fontSize: 14, color: "#fff", lineHeight: 1.6 }}>
                        <div style={{ fontWeight: 600 }}>Türsab ve Etbis ile Güvenle Kirala</div>
                        <div style={{ fontWeight: 600, marginTop: 4 }}>Belge No: 18069</div>
                        <div style={{ fontWeight: 600 }}>PRAEDIUM GROUP TRAVEL AGENCY</div>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <a href="https://www.tursab.org.tr/tr/ddsv" target="_blank" rel="noopener noreferrer">
                            <img src="/images/tursab-dds-18069.png" alt="TURSAB" style={{ maxHeight: 75, width: 280, maxWidth: "100%", margin: "0 auto", borderRadius: 8 }} />
                        </a>
                    </div>

                    <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-start", marginLeft: "10%" }}>
                        <a href="https://etbis.eticaret.gov.tr/sitedogrulama/5073561215243103" target="_blank" rel="noopener noreferrer">
                            <img src="/images/etbis.jpeg" alt="ETBIS" style={{ width: 105, height: "auto" }} />
                        </a>
                    </div>
                </div>

                <div style={{ marginTop: 40, borderTop: "1px solid #ffffff22", paddingTop: 32 }}>
                    <div style={{ marginBottom: 24 }}>
                        <div style={{ fontSize: 11, color: "#aaa", paddingBottom: 4 }}>WhatsApp</div>
                        <a href="https://wa.me/905323990748" style={{ fontSize: 15, color: "#fff", fontWeight: 600, textDecoration: "none", display: "block" }}>+90 532 399 07 48</a>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <div style={{ fontSize: 11, color: "#aaa", paddingBottom: 4 }}>2 iş saati içinde cevap verilir</div>
                        <a href="mailto:info@villatatilinde.com" style={{ fontSize: 15, color: "#fff", fontWeight: 600, textDecoration: "none", display: "block" }}>info@villatatilinde.com</a>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <div style={{ fontSize: 11, color: "#aaa", paddingBottom: 4 }}>09:00 — 22:30 Hafta içi ve Hafta sonu</div>
                        <a href="tel:+902426060725" style={{ fontSize: 15, color: "#fff", fontWeight: 600, textDecoration: "none", display: "block" }}>+90 242 606 0725</a>
                    </div>

                    <div style={{ marginBottom: 40 }}>
                        <div style={{ fontSize: 11, color: "#aaa", paddingBottom: 4 }}>09:00 — 20:00 Hafta içi ve Hafta sonu</div>
                        <div style={{ fontSize: 15, color: "#fff", fontWeight: 600 }}>KALKAN MAH. ŞEHİTLER CAD. NO: 53 KAŞ(ANTALYA)</div>
                    </div>

                    <div style={{ textAlign: "center", marginBottom: 32 }}>
                        <div style={{ fontSize: 16, color: "#fff", fontWeight: 600, marginBottom: 12 }}>Bizi Takip Edin</div>
                        <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
                            <a href="https://instagram.com/villatatilinde" target="_blank" rel="noopener noreferrer">
                                <img src="/images/instagramw.svg" alt="Instagram" style={{ height: 20, width: "auto" }} />
                            </a>
                            <a href="https://www.facebook.com/share/17PKGdZK2x/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
                                <img src="/images/facebookw.svg" alt="Facebook" style={{ height: 20, width: "auto" }} />
                            </a>
                        </div>
                    </div>

                    <div style={{ textAlign: "center", color: "#ccc", fontSize: 13, lineHeight: 1.8, marginBottom: 24 }}>
                        <div style={{ marginBottom: 12, fontSize: 15 }}>Garantili Villa Kiralama</div>
                        <div>Sitemizde listelenen tüm villalar villatatilinde ekibi tarafından kontrol edilmiştir ve videoları villa sayfalarında mevcuttur</div>
                        <div style={{ marginTop: 12 }}>@villatatilinde garantili ve güvenle kirala</div>
                    </div>

                    <div style={{ borderTop: "1px solid #ffffff22", borderBottom: "1px solid #ffffff22", padding: "24px 0", marginBottom: 24 }}>
                        <div style={{ fontSize: 18, color: "#fff", fontWeight: 600, marginBottom: 16 }}>Destek</div>
                        <Link href="/iletisim" style={{ display: "block", color: "#ccc", fontSize: 13, marginBottom: 16, textDecoration: "none" }}>İletişim</Link>
                        <Link href="/nasil-kiralanir" style={{ display: "block", color: "#ccc", fontSize: 13, marginBottom: 16, textDecoration: "none" }}>Nasıl Kiralanır</Link>
                        <Link href="/odeme-yontemleri" style={{ display: "block", color: "#ccc", fontSize: 13, marginBottom: 16, textDecoration: "none" }}>Taksit Seçenekleri ve Ödeme Yöntemleri</Link>
                        <Link href="/sikca-sorulan-sorular" style={{ display: "block", color: "#ccc", fontSize: 13, marginBottom: 16, textDecoration: "none" }}>Sıkça Sorulan Sorular</Link>
                        <Link href="/iptal-iade-politikalari" style={{ display: "block", color: "#ccc", fontSize: 13, textDecoration: "none" }}>İptal ve İade Politikası</Link>
                    </div>

                    <div style={{ marginBottom: 32 }}>
                        <div style={{ fontSize: 18, color: "#fff", fontWeight: 600, marginBottom: 20 }}>Faydalı Linkler</div>
                        <Link href="/villa-kategorileri" style={{ display: "block", color: "#ccc", fontSize: 13, marginBottom: 16, textDecoration: "none" }}>Uygun Fiyatlı, Ekonomik Villalar</Link>
                        <Link href="/villa-kategorileri" style={{ display: "block", color: "#ccc", fontSize: 13, marginBottom: 16, textDecoration: "none" }}>Muhafazakar Villalar</Link>
                        <Link href="/villa-kategorileri" style={{ display: "block", color: "#ccc", fontSize: 13, marginBottom: 16, textDecoration: "none" }}>Denize Yakın Villalar</Link>
                        <Link href="/villa-kategorileri" style={{ display: "block", color: "#ccc", fontSize: 13, marginBottom: 16, textDecoration: "none" }}>Lüx Balayı Villaları</Link>
                        <Link href="/tatil-yerleri" style={{ display: "block", color: "#ccc", fontSize: 13, marginBottom: 16, textDecoration: "none" }}>Kalkan Merkez En İyi Villaları</Link>
                        <Link href="/tatil-yerleri" style={{ display: "block", color: "#ccc", fontSize: 13, marginBottom: 16, textDecoration: "none" }}>Kalkan Tüm Villalar</Link>
                        <Link href="/tatil-yerleri" style={{ display: "block", color: "#ccc", fontSize: 13, marginBottom: 16, textDecoration: "none" }}>Fethiye Villalar</Link>
                        <Link href="/tatil-yerleri" style={{ display: "block", color: "#ccc", fontSize: 13, marginBottom: 16, textDecoration: "none" }}>Kaş Merkez En İyi Villaları</Link>
                        <Link href="/kisa-sureli-kiralik-villalar" style={{ display: "block", color: "#ccc", fontSize: 13, marginBottom: 16, textDecoration: "none" }}>Kısa Süreli Kiralık Villalar</Link>
                        <Link href="/indirimli-villalar" style={{ display: "block", color: "#ccc", fontSize: 13, marginBottom: 16, textDecoration: "none" }}>İndirimli Villalar</Link>
                        <Link href="/promosyonlar" style={{ display: "block", color: "#ccc", fontSize: 13, textDecoration: "none" }}>Güncel Promosyonlar</Link>
                    </div>

                    <div style={{ borderTop: "1px solid #ffffff22", padding: "24px 0", marginBottom: 24 }}>
                        <div style={{ fontSize: 18, color: "#fff", fontWeight: 600, marginBottom: 20 }}>Partnerlerimiz ( %15 indirim fırsatı )</div>
                        <div style={{ display: "block", color: "#ccc", fontSize: 13, marginBottom: 16 }}>Vati Ocakbaşı   <span style={{ color: "#fff" }}>Kaş Marina</span></div>
                        <div style={{ display: "block", color: "#ccc", fontSize: 13, marginBottom: 16 }}>Mussakka Restaurant   <span style={{ color: "#fff" }}>Kalkan Merkez</span></div>
                        <div style={{ display: "block", color: "#ccc", fontSize: 13 }}>Ergün Kaptan Tekne Turu ve Sailing   <span style={{ color: "#fff" }}>Kaş Limanı</span></div>
                    </div>

                    <div style={{ borderTop: "1px solid #ffffff22", borderBottom: "1px solid #ffffff22", padding: "24px 0", marginBottom: 24, textAlign: "left" }}>
                        <div style={{ fontSize: 18, color: "#fff", fontWeight: 600, marginBottom: 16 }}>İyi Bir Tatil - Blog Yazılarımız</div>
                        <Link href="/bloglar" style={{ display: "block", color: "#ccc", fontSize: 13, textDecoration: "none" }}>Tümü - <span style={{ fontSize: 11 }}>Bloglar</span></Link>
                    </div>

                    <div style={{ display: "flex", gap: 24, marginBottom: 16 }}>
                        <Link href="/gizlilik-politikasi" style={{ color: "#fff", fontSize: 13, textDecoration: "none" }}>Gizlilik</Link>
                        <Link href="/sartlar-kosullar" style={{ color: "#fff", fontSize: 13, textDecoration: "none" }}>Koşullar</Link>
                    </div>

                    <div style={{ color: "#aaa", fontSize: 12, textAlign: "left" }}>
                        ©villatatilinde Tüm Hakları Saklıdır
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .site-footer {
                    background: #0b0a12;
                    color: #fafafa;
                    font-family: "DM Sans", serif;
                }
                .footer-container {
                    max-width: 1320px;
                    margin: 0 auto;
                    padding: 48px 24px 0 24px;
                }
                .footer-row {
                    display: flex;
                    flex-wrap: wrap;
                }
                .footer-link {
                    transition: opacity 0.2s;
                    cursor: pointer;
                }
                .footer-link:hover {
                    opacity: 0.8;
                }
                .poppins {
                    font-family: "Poppins", sans-serif;
                }

                .f1c { width: 25%; padding-right: 20px; }
                .f2c { width: 25%; }
                .f3c { width: 25%; }
                .f4c { width: 25%; }

                .fhead {
                    color: #fff;
                    font-size: 21px;
                    font-weight: 700;
                }
                .fheadBot {
                    font-weight: 700;
                    font-size: 20px;
                }
                .linkType1 {
                    margin-top: 24px;
                    color: #c5c5c7;
                    font-size: 14px;
                    font-weight: 400;
                }
                .linkType2 {
                    margin-top: 15px;
                    color: #c5c5c7;
                    font-size: 14px;
                    font-weight: 400;
                }
                .paysecim {
                    height: 18px;
                    width: auto;
                }

                @media (max-width: 900px) {
                    .footer-desktop { display: none; }
                    .footer-mobile { display: block !important; }
                }
            `}</style>
        </footer>
    );
}
