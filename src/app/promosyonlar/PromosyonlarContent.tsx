"use client";

import Link from "next/link";
import Image from "next/image";

/* ─── Static category cards (exactly matching the screenshot) ─── */
const categories = [
    {
        slug: "restaurant",
        image: "/images/vati3.jpg",
        title: "Restaurant İndirimleri",
        description: "Hemen QR Kodu oluştur ve %15 indirimden faydalanı",
    },
    {
        slug: "tekne-turu",
        image: "/images/sailing1.jpeg",
        title: "Tekne Turu İndirimleri",
        description: "Hemen QR Kodu oluştur ve %15 indirimden faydalanı",
    },
    {
        slug: "villa",
        image: "/images/prmss.jpg",
        title: "Promosyonlu Villalar",
        description: "Tarihleri Önceden Belirlenmiş Birçok Eşsiz İndirim",
    },
];

export default function PromosyonlarContent() {
    return (
        <div className="prms-page">
            {/* ── Page Title ── */}
            <div className="prms-header">
                <h1 className="prms-title">Promosyonlar</h1>
            </div>

            {/* ── Category Cards Row ── */}
            <div className="prms-row">
                {categories.map((cat, index) => (
                    <div key={cat.slug} className={`prms-col prms-col-${index + 1}`}>
                        <Link href={`/promosyonlar/kategori/${cat.slug}`}>
                            <div className="prms-img-wrap">
                                <Image
                                    src={cat.image}
                                    alt={cat.title}
                                    fill
                                    sizes="(max-width: 529px) 100vw, (max-width: 820px) 50vw, 33vw"
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                        </Link>
                        <div className="prms-card-body">
                            <Link href={`/promosyonlar/kategori/${cat.slug}`}>
                                <h2 className="prms-card-title">{cat.title}</h2>
                            </Link>
                        </div>
                        <div className="prms-card-body">
                            <Link href={`/promosyonlar/kategori/${cat.slug}`} className="prms-desc-link">
                                <span className="prms-card-desc">{cat.description}</span>
                                <span className="prms-card-arrow">
                                    <svg width="28" height="10" viewBox="0 0 28 10" fill="none">
                                        <path d="M0 5H26M26 5L21.5 1M26 5L21.5 9" stroke="currentColor" strokeWidth="1" />
                                    </svg>
                                </span>
                            </Link>
                        </div>
                    </div>
                ))}
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

            {/* ── Mini Footer ── */}
            <div className="prms-mini-footer">
                <div className="prms-mini-footer-inner">
                    <div className="prms-mini-footer-left">
                        © 2025 Villa Tatilinde<br />
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
