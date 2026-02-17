"use client";

import Link from "next/link";
import Image from "next/image";

export default function PromosyonlarContent() {
    return (
        <div className="prms-page">
            {/* ── Page Title ── */}
            <div className="prms-header">
                <h1 className="prms-title">Promosyonlar</h1>
            </div>

            {/* ── Promotions Row ── */}
            <div className="prms-row">
                {/* Card 1 – Restaurant İndirimleri */}
                <div className="prms-col prms-col-1">
                    <Link href="/restaurant-promosyonlari">
                        <div className="prms-img-wrap">
                            <Image
                                src="/images/vati3.jpg"
                                alt="Restaurant İndirimleri"
                                fill
                                sizes="(max-width: 529px) 100vw, (max-width: 820px) 50vw, 33vw"
                                style={{ objectFit: "cover" }}
                            />
                        </div>
                    </Link>
                    <div className="prms-card-body">
                        <Link href="/restaurant-promosyonlari">
                            <h2 className="prms-card-title">Restaurant İndirimleri</h2>
                        </Link>
                    </div>
                    <div className="prms-card-body">
                        <Link href="/restaurant-promosyonlari" className="prms-desc-link">
                            <span className="prms-card-desc">
                                Hemen QR Kodu oluştur ve %15 indirimden faydalan
                            </span>
                            <span className="prms-card-arrow">
                                <svg width="28" height="10" viewBox="0 0 28 10" fill="none">
                                    <path d="M0 5H26M26 5L21.5 1M26 5L21.5 9" stroke="currentColor" strokeWidth="1" />
                                </svg>
                            </span>
                        </Link>
                    </div>
                </div>

                {/* Card 2 – Tekne Turu İndirimleri */}
                <div className="prms-col prms-col-2">
                    <Link href="/tekne-turu-sailing-promosyonlari">
                        <div className="prms-img-wrap">
                            <Image
                                src="/images/t6.jpeg"
                                alt="Tekne Turu İndirimleri"
                                fill
                                sizes="(max-width: 529px) 100vw, (max-width: 820px) 50vw, 33vw"
                                style={{ objectFit: "cover" }}
                            />
                        </div>
                    </Link>
                    <div className="prms-card-body">
                        <Link href="/tekne-turu-sailing-promosyonlari">
                            <h2 className="prms-card-title">Tekne Turu İndirimleri</h2>
                        </Link>
                    </div>
                    <div className="prms-card-body">
                        <Link href="/tekne-turu-sailing-promosyonlari" className="prms-desc-link">
                            <span className="prms-card-desc">
                                Hemen QR Kodu oluştur ve %15 indirimden faydalan
                            </span>
                            <span className="prms-card-arrow">
                                <svg width="28" height="10" viewBox="0 0 28 10" fill="none">
                                    <path d="M0 5H26M26 5L21.5 1M26 5L21.5 9" stroke="currentColor" strokeWidth="1" />
                                </svg>
                            </span>
                        </Link>
                    </div>
                </div>

                {/* Card 3 – Promosyonlu Villalar (with discount badge) */}
                <div className="prms-col prms-col-3">
                    {/* Green Ribbon Badge */}
                    <span className="prms-ribbon">
                        En uygun fiyat garantisiyle
                    </span>
                    {/* Percent Circle Badge */}
                    <div className="prms-percent">
                        <Image
                            src="/images/06.svg"
                            alt="İndirim"
                            width={70}
                            height={70}
                            style={{ objectFit: "contain" }}
                        />
                        <div className="prms-percent-text">5-30%</div>
                    </div>
                    <Link href="/indirimli-villalar">
                        <div className="prms-img-wrap">
                            <Image
                                src="/images/prmss.jpg"
                                alt="Promosyonlu Villalar"
                                fill
                                sizes="(max-width: 529px) 100vw, (max-width: 820px) 50vw, 33vw"
                                style={{ objectFit: "cover" }}
                            />
                        </div>
                    </Link>
                    <div className="prms-card-body">
                        <Link href="/indirimli-villalar">
                            <h2 className="prms-card-title">Promosyonlu Villalar</h2>
                        </Link>
                    </div>
                    <div className="prms-card-body">
                        <Link href="/indirimli-villalar" className="prms-desc-link">
                            <span className="prms-card-desc">
                                Tarihleri Önceden Belirlenmiş Birçok Eşsiz İndirim
                            </span>
                            <span className="prms-card-arrow">
                                <svg width="28" height="10" viewBox="0 0 28 10" fill="none">
                                    <path d="M0 5H26M26 5L21.5 1M26 5L21.5 9" stroke="currentColor" strokeWidth="1" />
                                </svg>
                            </span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Contact Info Section ── */}
            <div className="prms-contact-section">
                <div className="prms-contact-row">
                    <a href="tel:+902426060725" target="_blank" rel="noopener noreferrer" className="prms-contact-item">
                        <Image src="/images/phone.png" alt="Telefon" width={24} height={24} />
                        <div className="prms-contact-text">
                            <div>Villa Tatilinde Kalkan Ofis</div>
                            <div>+90 242 606 0725</div>
                        </div>
                    </a>
                    <a href="mailto:info@villatatilinde.com" target="_blank" rel="noopener noreferrer" className="prms-contact-item">
                        <Image src="/images/mail.png" alt="E-Posta" width={24} height={24} style={{ padding: "2px" }} />
                        <div className="prms-contact-text">
                            <div>Villa Tatilinde E-Posta</div>
                            <div>info@villatatilinde.com</div>
                        </div>
                    </a>
                    <Link href="/iletisim" className="prms-contact-item">
                        <Image src="/images/loc.png" alt="Konum" width={24} height={24} />
                        <div className="prms-contact-text">
                            <div>Villa Tatilinde Kalkan Ofis</div>
                            <div>KALKAN MAH. ŞEHİTLER CAD. NO: 53 KAŞ(ANTALYA)</div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* ── Newsletter Subscription ── */}
            <div className="prms-newsletter">
                <div className="prms-newsletter-inner">
                    <div className="prms-newsletter-title">
                        Villa Tatilinde Aylık Mail Aboneliği
                    </div>
                    <div className="prms-newsletter-subtitle">
                        En yeni villalar güncel promosyonlar indirimli villalar ve çok daha fazlası
                    </div>
                    <div className="prms-newsletter-form">
                        <input
                            type="email"
                            className="prms-newsletter-input"
                            placeholder="E-postanızı yazın"
                        />
                        <button className="prms-newsletter-btn">ABONE OL</button>
                    </div>
                    <div className="prms-newsletter-terms">
                        Abone olarak, <Link href="/sartlar-kosullar" style={{ textDecoration: "underline" }}>şartlar ve koşulları</Link> kabul etmiş ve <Link href="/gizlilik-politikasi" style={{ textDecoration: "underline" }}>gizlilik politikamızı</Link> onaylamış olursunuz.
                    </div>
                </div>
            </div>

            {/* ── Mini Footer ── */}
            <div className="prms-mini-footer">
                <div className="prms-mini-footer-inner">
                    <div className="prms-mini-footer-left">
                        © 2026 Villa Tatilinde<br />
                        Belge No: 18069 - PRAEDIUM GROUP TRAVEL AGENCY
                    </div>
                    <div className="prms-mini-footer-right">
                        <Link href="/sartlar-kosullar">Koşullar ve Şartlar</Link>
                    </div>
                    <div className="prms-mini-footer-right">
                        <Link href="/gizlilik-politikasi">Gizlilik</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
