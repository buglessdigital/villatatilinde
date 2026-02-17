"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="site-footer">
            {/* ═══════════════ TOP GRID ═══════════════ */}
            <div className="footer-container">
                <div className="footer-row">
                    {/* ─── Column 1: Logos & Trust (Desktop >1200px) ─── */}
                    <div className="f1c">
                        <div style={{ color: "#282f39", fontWeight: 300 }}>
                            <Image
                                src="/images/vtlo.png"
                                alt="Villa Tatilinde"
                                width={200}
                                height={62}
                                style={{ height: 62, width: "auto" }}
                                className="dsg2"
                            />
                            <div style={{ color: "#ffffffaa", marginTop: 4, lineHeight: 1, fontSize: "calc(12px + .4vw)", fontWeight: 300 }}>
                                <Image
                                    src="/images/prl2.jpeg"
                                    alt="Praedium Group"
                                    width={200}
                                    height={62}
                                    style={{
                                        height: 62,
                                        width: "auto",
                                        border: "1px solid #dfdfe3aa",
                                    }}
                                    className="dsg2"
                                />
                            </div>
                        </div>
                        <div>
                            <div style={{ marginTop: 12, fontWeight: 300, fontSize: 18 }}>
                                <div style={{ marginTop: 2, fontWeight: 500 }}>
                                    <div>
                                        <a
                                            href="https://www.tursab.org.tr/tr/ddsv"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Image
                                                src="/images/tursab-dds-18069.png"
                                                alt="TURSAB DDS 18069"
                                                width={280}
                                                height={90}
                                                style={{ width: "auto", maxHeight: 90 }}
                                            />
                                        </a>
                                    </div>
                                    <div className="middleft">
                                        <div id="ETBIS">
                                            <a
                                                href="https://etbis.eticaret.gov.tr/sitedogrulama/5073561215243103"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Image
                                                    src="/images/etbis.jpeg"
                                                    alt="ETBİS'e Kayıtlıdır"
                                                    width={105}
                                                    height={126}
                                                    style={{ width: 105, height: "auto" }}
                                                />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ maxWidth: "85%", marginTop: 12 }}>
                                    <div style={{ color: "#c5c5c7", fontWeight: 400 }}>
                                        Villa Tatilinde ile güvenle kirala
                                    </div>
                                    <div style={{ color: "#c5c5c7", fontWeight: 400 }}>
                                        Sitemizde listelenen tüm villalar kontrol edilmiştir
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ─── Column 1 Alternative: (Mobile/Tablet ≤1200px) ─── */}
                    <div className="f1c2">
                        <div style={{ color: "#282f39", fontWeight: 300 }}>
                            <Image
                                src="/images/vtlo.png"
                                alt="Villa Tatilinde"
                                width={200}
                                height={62}
                                style={{ height: 62, width: "auto" }}
                                className="dsg2"
                            />
                            <div style={{ color: "#ffffffaa", marginTop: -9, lineHeight: 1, fontSize: "calc(12px + .4vw)", fontWeight: 300 }}>
                                <Image
                                    src="/images/prl2.jpeg"
                                    alt="Praedium Group"
                                    width={200}
                                    height={62}
                                    style={{
                                        height: 62,
                                        width: "auto",
                                    }}
                                    className="dsg2"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="f1c2Text footer-row">
                                <div style={{ marginTop: 2, fontWeight: 600 }}>
                                    <a
                                        href="https://www.tursab.org.tr/pl/qr/AHTKE25120134462dc964be3dd2438b"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <div style={{ marginBottom: 8 }}>
                                            Belge No: 18069 <br /> PRAEDIUM GROUP TRAVEL AGENCY
                                        </div>
                                    </a>
                                    <div id="ETBIS">
                                        <a
                                            href="https://etbis.eticaret.gov.tr/sitedogrulama/5073561215243103"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Image
                                                src="/images/etbis.jpeg"
                                                alt="ETBİS'e Kayıtlıdır"
                                                width={55}
                                                height={66}
                                                style={{ width: 55, height: 66 }}
                                            />
                                        </a>
                                    </div>
                                </div>
                                <div style={{ marginLeft: 32, maxWidth: "75%", marginTop: 20 }}>
                                    <div style={{ color: "#c5c5c7", fontWeight: 400 }}>
                                        Villa Tatilinde ile güvenle kirala
                                    </div>
                                    <div style={{ color: "#c5c5c7", fontWeight: 400 }}>
                                        Sitemizde listelenen tüm villalar kontrol edilmiştir
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ─── Column 2: Sayfalar ─── */}
                    <div className="f2c">
                        <div className="fhead poppins">Sayfalar</div>
                        <div className="middleft">
                            <Link href="/hakkimizda">
                                <div className="linkType1 footer-link">Hakkımızda</div>
                            </Link>
                        </div>
                        <div className="middleft">
                            <Link href="/harita">
                                <div className="linkType2 footer-link">Villalar Harita Görünümü</div>
                            </Link>
                        </div>
                        <div className="middleft">
                            <div className="linkType2 footer-link" style={{ cursor: "pointer" }}>
                                Referans Kodu İle Villa Arama
                            </div>
                        </div>
                        <div className="middleft">
                            <Link href="/tatil-yerleri">
                                <div className="linkType2 footer-link">Tatil Yerleri</div>
                            </Link>
                        </div>
                        <div className="middleft">
                            <Link href="/villa-kategorileri">
                                <div className="linkType2 footer-link">Villa Kategorileri</div>
                            </Link>
                        </div>
                        <div className="middleft">
                            <Link href="/bloglar">
                                <div className="footer-link" style={{ marginTop: 15, color: "#c5c5c7", fontSize: 16, fontWeight: 400 }}>
                                    Bloglar
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* ─── Column 3: Fırsatlar ─── */}
                    <div className="f3c">
                        <div className="fhead poppins">Fırsatlar</div>
                        <div className="middleft">
                            <Link href="/indirimli-villalar">
                                <div className="linkType1 footer-link">İndirimli Villalar</div>
                            </Link>
                        </div>
                        <div className="middleft">
                            <Link href="/promosyonlar">
                                <div className="linkType2 footer-link">Güncel Promosyonlar</div>
                            </Link>
                        </div>
                        <div className="middleft">
                            <Link href="/kisa-sureli-kiralik-villalar">
                                <div className="linkType2 footer-link">Kısa Süreli Kiralık Villalar</div>
                            </Link>
                        </div>
                        <div className="middleft">
                            <Link href="/qr-indirim-kodu">
                                <div className="linkType2 footer-link">QR Kodu İndirim Avantajları</div>
                            </Link>
                        </div>
                    </div>

                    {/* ─── Column 4: Destek & Yardım ─── */}
                    <div className="f4c">
                        <div className="fhead poppins">Destek &amp; Yardım</div>
                        <div className="middleft">
                            <Link href="/bildirim?chat=true">
                                <div className="linkType1 footer-link" style={{ position: "relative" }}>
                                    Canlı Destek
                                    <span
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 94,
                                            width: 6,
                                            height: 6,
                                            borderRadius: "50%",
                                            background: "#e83e8c",
                                        }}
                                    />
                                </div>
                            </Link>
                        </div>
                        <div className="middleft">
                            <Link href="/iletisim">
                                <div className="linkType2 footer-link">İletişim - Bize Ulaşın</div>
                            </Link>
                        </div>
                        <div className="middleft">
                            <Link href="/sikca-sorulan-sorular">
                                <div className="linkType2 footer-link">Sıkça Sorulan Sorular  s.s.s</div>
                            </Link>
                        </div>
                        <div className="middleft">
                            <a href="https://wa.me/905323990748" target="_blank" rel="noopener noreferrer">
                                <div className="linkType2 footer-link">
                                    WhatsApp <Image src="/images/cfo.svg" alt="" width={10} height={10} style={{ height: 10, width: "auto" }} />
                                </div>
                            </a>
                        </div>
                        <div className="middleft">
                            <a href="tel:+90 242 606 0725" target="_blank" rel="noopener noreferrer">
                                <div className="linkType2 footer-link">
                                    <Image
                                        src="/images/phonew.png"
                                        alt=""
                                        width={13}
                                        height={13}
                                        style={{ marginTop: 1, height: 13, width: "auto", marginRight: 7 }}
                                    />
                                    +90 242 606 0725
                                </div>
                            </a>
                        </div>
                        <div className="middleft">
                            <a href="mailto:info@villatatilinde.com" target="_blank" rel="noopener noreferrer">
                                <div className="linkType2 footer-link">
                                    <Image
                                        src="/images/mailw.png"
                                        alt=""
                                        width={11}
                                        height={11}
                                        style={{ marginTop: 1, height: 11, width: "auto", marginRight: 7 }}
                                    />
                                    <span>info@villatatilinde.com</span>{" "}
                                    <Image
                                        src="/images/cfo.svg"
                                        alt=""
                                        width={10}
                                        height={10}
                                        style={{ marginLeft: 6, height: 10, width: "auto" }}
                                    />
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                {/* ═══════════════ PAYMENT & SOCIAL ═══════════════ */}
                <div className="middleft" style={{ marginTop: "3rem" }}>
                    <div className="poppins fheadBot" style={{ flexGrow: 1 }}>
                        Ödeme &amp; Güvenlik
                        <Link href="/odeme-yontemleri">
                            <div className="paysecsub footer-row" style={{ flexGrow: 1, maxWidth: "80%", marginTop: 12 }}>
                                <Image src="/images/hc1.svg" className="paysecim" alt="Bonus Card" width={60} height={18} />
                                <Image src="/images/hc2.svg" className="paysecim" alt="Maximum" width={60} height={18} />
                                <Image src="/images/hc3.svg" className="paysecim" alt="World" width={60} height={18} />
                                <Image src="/images/hc4.svg" className="paysecim" alt="BankKart" width={60} height={18} />
                                <Image src="/images/hc5.svg" className="paysecim" alt="CardFinans" width={60} height={18} />
                                <Image src="/images/hc6.svg" className="paysecim" alt="Axess" width={60} height={18} />
                                <Image src="/images/hc9.svg" className="paysecim" alt="Advantage" width={60} height={18} />
                            </div>
                        </Link>
                        <Link href="/odeme-yontemleri">
                            <div style={{ width: "100%", color: "#ffffffaa", fontWeight: 300, fontSize: 13 }} className="dm-sans middle">
                                <Image src="/images/iyzl.png" className="paysecim" style={{ height: 20, width: "auto" }} alt="iyzico Mastercard Visa Amex Troy" width={200} height={20} />
                            </div>
                            <div style={{ width: "100%", color: "#ffffffaa", fontWeight: 500, fontSize: 14 }} className="dm-sans middleft">
                                <Image
                                    src="/images/sslg.png"
                                    alt="SSL"
                                    width={12}
                                    height={12}
                                    style={{ height: 12, width: "auto", marginRight: 6, marginBottom: 2 }}
                                />
                                İyzico Güvencesi ile Güvenli Ödeme
                            </div>
                        </Link>
                    </div>
                    <div className="poppins fheadBot" style={{ marginLeft: "auto" }}>
                        Bizi Takip Edin
                        <div className="middleft" style={{ color: "#c5c5c7", marginTop: "0.6rem", fontSize: 15, fontWeight: 400 }}>
                            <a
                                href="https://instagram.com/villatatilinde"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-link middle"
                                style={{ display: "flex", alignItems: "center", color: "#c5c5c7", textDecoration: "none" }}
                            >
                                <Image
                                    src="/images/instagramw.svg"
                                    alt="Instagram"
                                    width={16}
                                    height={16}
                                    style={{ opacity: 0.6, marginRight: 4, height: 16, width: "auto" }}
                                />
                                villatatilinde
                            </a>
                            <a
                                href="https://www.facebook.com/share/17PKGdZK2x/?mibextid=wwXIfr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-link middle"
                                style={{ display: "flex", alignItems: "center", color: "#c5c5c7", textDecoration: "none", marginLeft: 20 }}
                            >
                                <Image
                                    src="/images/facebookw.svg"
                                    alt="Facebook"
                                    width={16}
                                    height={16}
                                    style={{ opacity: 0.6, marginRight: 4, height: 16, width: "auto" }}
                                />
                                villatatilinde
                            </a>
                        </div>
                    </div>
                </div>

                {/* ═══════════════ BOTTOM BAR ═══════════════ */}
                <div className="fbot middle" style={{ color: "#c5c5c7" }}>
                    <div>©Villatatilinde — Praedium Group</div>
                    <div className="middle" style={{ marginLeft: "auto" }}>
                        <div style={{ marginLeft: "1.5rem" }} className="footer-link">
                            <Link href="/gizlilik-politikasi">Gizlilik Politikası</Link>
                        </div>
                        <div style={{ marginLeft: "1.5rem" }} className="footer-link">
                            <Link href="/sartlar-kosullar">Şartlar ve Koşullar</Link>
                        </div>
                        <div style={{ marginLeft: "1.5rem" }} className="footer-link">
                            <Link href="/iptal-iade-politikalari">İptal ve İade Politikası</Link>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .site-footer {
                    background: #0b0a12;
                    padding-top: 48px;
                    color: #fafafa;
                    font-family: "DM Sans", serif;
                }
                .footer-container {
                    max-width: 1320px;
                    margin: 0 auto;
                    padding: 0 24px;
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
                .site-footer a {
                    text-decoration: none;
                    color: inherit;
                }
                .poppins {
                    font-family: "Poppins", sans-serif;
                }
                .dm-sans {
                    font-family: "DM Sans", serif;
                }
                .middleft {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                }
                .middle {
                    display: flex;
                    align-items: center;
                }

                /* ── Column widths ── */
                .f1c {
                    width: 25%;
                }
                .f1c2 {
                    width: 100%;
                    margin-bottom: 40px;
                    display: none;
                }
                .f2c { width: 24%; }
                .f3c { width: 24%; }
                .f4c { width: 24%; }

                @media (max-width: 1200px) {
                    .f1c { display: none; }
                    .f1c2 { display: block; }
                    .f2c { width: 33%; }
                    .f3c { width: 33%; }
                    .f4c { width: 33%; }
                }

                @media (max-width: 767px) {
                    .f2c, .f3c, .f4c { width: 100%; margin-bottom: 32px; }
                    .footer-container { padding: 0 16px; }
                    .fbot {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 12px;
                    }
                    .fbot .middle {
                        margin-left: 0 !important;
                        flex-wrap: wrap;
                    }
                    .fbot .middle div:first-child {
                        margin-left: 0 !important;
                    }
                }

                /* ── Headings ── */
                .fhead {
                    color: #fff;
                    font-size: 21px;
                    font-weight: 700;
                }
                .fheadBot {
                    font-weight: 700;
                    font-size: 20px;
                }
                @media (max-width: 899px) {
                    .fhead { font-size: 17px; font-weight: 600; }
                    .fheadBot { font-size: 17px; font-weight: 600; }
                }

                /* ── Link styles ── */
                .linkType1 {
                    margin-top: 28px;
                    color: #c5c5c7;
                    font-size: 16px;
                    font-weight: 400;
                }
                .linkType2 {
                    margin-top: 15px;
                    color: #c5c5c7;
                    font-size: 16px;
                    font-weight: 400;
                }
                @media (max-width: 899px) {
                    .linkType1 { font-size: 14px; margin-top: 20px; }
                    .linkType2 { font-size: 14px; margin-top: 12px; }
                }

                /* ── Bottom bar ── */
                .fbot {
                    width: 100%;
                    border-top: 2px solid #bbbbbb44 !important;
                    font-size: 14px;
                    padding-bottom: 30px;
                    padding-top: 16px;
                    margin-top: 24px;
                }

                /* ── Payment icons ── */
                .paysecim {
                    height: 18px;
                    width: auto;
                    margin-right: 12px;
                    margin-bottom: 8px;
                }
                .paysecsub {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                }

                /* ── f1c2 Text ── */
                .f1c2Text {
                    margin-top: 12px;
                    font-weight: 300;
                    font-size: 20px;
                }
                @media (max-width: 768px) {
                    .f1c2Text { font-size: 17px; }
                }

                /* ── Mobile footer payment/social ── */
                @media (max-width: 899px) {
                    .site-footer .middleft[style*="margin-top: 3rem"] {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .site-footer .middleft[style*="margin-top: 3rem"] > .poppins:last-child {
                        margin-left: 0 !important;
                        margin-top: 24px;
                    }
                }
            `}</style>
        </footer>
    );
}
