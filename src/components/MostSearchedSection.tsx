"use client";

import React, { useState } from "react";
import Link from "next/link";

/* ─── Tab types ─── */
type TabKey = "1" | "2" | "3";

/* ─── Data item ─── */
interface SearchItem {
    title: string;
    description: string;
    dotColor: string;
    href: string;
}

/* ─── Popüler Aramalar ─── */
const POPULAR_SEARCHES: SearchItem[] = [
    { title: "Uygun Fiyatlı Villalar", description: "Ekonomik deniz manzaralı villalar", dotColor: "#e2d27c", href: "/sonuclar?features=affordableVillas" },
    { title: "Muhafazakar Villalar", description: "Dışarıdan görünmeyen lüx villalar", dotColor: "#cfcfc4", href: "/sonuclar?features=isolatedVillas" },
    { title: "Balayı Villaları", description: "Çiftler iki kişilik villalar", dotColor: "#f6b8d0", href: "/sonuclar?features=honeyMoon" },
    { title: "Ultra Lüx Villalar", description: "Ultra lüx ve modern tatil villaları", dotColor: "#d5f6fb", href: "/sonuclar?features=ultraLux" },
    { title: "Merkezi Konumlu Villalar", description: "Şehir merkezinde tatil villaları", dotColor: "#f6f3a9", href: "/sonuclar?features=centralVillas" },
    { title: "Denize Yakın Villalar", description: "Denize yürüme mesafesinde villalar", dotColor: "#e5ecf8", href: "/sonuclar?features=beachVillas" },
    { title: "Deniz Manzaralı Villalar", description: "Deniz manzaralı tatil villaları", dotColor: "#f0ebd8", href: "/sonuclar?features=seaview" },
    { title: "Doğa Manzaralı Villalar", description: "Doğa içinde ve doğa manzaralı tatil villaları", dotColor: "#d1feb8", href: "/sonuclar?features=natureview" },
    { title: "Havuzu Korunaklı Villalar", description: "Havuzu dışarıdan görünmeyen villalar", dotColor: "#efdfd8", href: "/sonuclar?features=isolatedPoolVillas" },
    { title: "Çocuk Havuzlu Villalar", description: "Çocuk havuzlu tatil villaları", dotColor: "#ebccff", href: "/sonuclar?features=kidPoolVillas" },
    { title: "Yeni Villalar", description: "Yeni yapılmış modern ve geniş tatil villaları", dotColor: "#e7d7ca", href: "/sonuclar?features=newVillas" },
    { title: "Kalkan Tatil Villaları", description: "Kalkan'da bulunan tatil villaları", dotColor: "#beddf1", href: "/sonuclar?location=kalkanMerkez" },
    { title: "Kaş Tatil Villaları", description: "Kaş'ta bulunan tatil villaları", dotColor: "#dad4b6", href: "/sonuclar?location=kasMerkez" },
];

/* ─── Tüm Konumlar ─── */
const ALL_LOCATIONS: SearchItem[] = [
    { title: "Kalkan Merkez", description: "Kalkan merkezde bulunan villalar", dotColor: "#beddf1", href: "/sonuclar?location=kalkanMerkez" },
    { title: "Kalkan Kalamar", description: "Kalkan/Kalamarda bulunan villalar", dotColor: "#f1beb5", href: "/sonuclar?location=kalkanKalamar" },
    { title: "Kalkan Kömürlük", description: "Kalkan/Kömürlükte bulunan villalar", dotColor: "#f8c75c", href: "/sonuclar?location=kalkanKomurluk" },
    { title: "Kalkan Kışla", description: "Kalkan/Kışlada bulunan villalar", dotColor: "#d7cab7", href: "/sonuclar?location=kalkanKisla" },
    { title: "Kalkan Ortaalan", description: "Kalkan/Ortaalanda bulunan villalar", dotColor: "#a4d8d8", href: "/sonuclar?location=kalkanOrtaalan" },
    { title: "Kalkan Kızıltaş", description: "Kalkan/Kızıltaşta bulunan villalar", dotColor: "#d4c6aa", href: "/sonuclar?location=kalkanKiziltas" },
    { title: "Kalkan Kaputaş", description: "Kalkan/Kaputaşta bulunan villalar", dotColor: "#d3c7a2", href: "/sonuclar?location=kalkanKaputas" },
    { title: "Kalkan Patara", description: "Kalkan/Patara bulunan villalar", dotColor: "#97c1a9", href: "/sonuclar?location=kalkanPatara" },
    { title: "Kalkan Ordu", description: "Kalkan/Ordu bulunan villalar", dotColor: "#b7cfb7", href: "/sonuclar?location=kalkanOrdu" },
    { title: "Kalkan Ulugöl", description: "Kalkan/Ulugöl bulunan villalar", dotColor: "#cce2cb", href: "/sonuclar?location=kalkanUlugol" },
    { title: "Kalkan Kördere", description: "Kalkan/Körderede bulunan villalar", dotColor: "#eaeaea", href: "/sonuclar?location=kalkanKordere" },
    { title: "Kalkan İslamlar", description: "Kalkan/İslamlarda bulunan villalar", dotColor: "#c7dbda", href: "/sonuclar?location=kalkanIslamlar" },
    { title: "Kalkan Üzümlü", description: "Kalkan/Üzümlüde bulunan villalar", dotColor: "#ffe1e9", href: "/sonuclar?location=kalkanUzumlu" },
    { title: "Kalkan Bezirgan", description: "Kalkan/Bezirganda bulunan villalar", dotColor: "#fdd7c2", href: "/sonuclar?location=kalkanBezirgan" },
    { title: "Kalkan Sarıbelen", description: "Kalkan/Sarıbelende bulunan villalar", dotColor: "#f6eac2", href: "/sonuclar?location=kalkanSaribelen" },
    { title: "Kalkan Yeşilköy", description: "Kalkan/Yeşilköyde bulunan villalar", dotColor: "#ffb8b1", href: "/sonuclar?location=kalkanYesilkoy" },
    { title: "Kalkan Çavdır", description: "Kalkan/Çavdırda bulunan villalar", dotColor: "#ffdac1", href: "/sonuclar?location=kalkanCavdir" },
    { title: "Kaş Merkez", description: "Kaş merkezde bulunan villalar", dotColor: "#dad4b6", href: "/sonuclar?location=kasMerkez,kasCukurbag,kasBayindir,kasCamliova,kasGokseki" },
    { title: "Fethiye", description: "Fethiye'de bulunan Villalar", dotColor: "#dad4b6", href: "/sonuclar?location=fethiyeMerkez" },
];

/* ─── Kategoriler ─── */
const CATEGORIES: SearchItem[] = [
    { title: "Uygun Fiyatlı Villalar", description: "Ekonomik deniz manzaralı villalar", dotColor: "#e2d27c", href: "/sonuclar?features=affordableVillas" },
    { title: "Muhafazakar Villalar", description: "Dışarıdan görünmeyen lüx villalar", dotColor: "#cfcfc4", href: "/sonuclar?features=isolatedVillas" },
    { title: "Balayı Villaları", description: "Çiftler iki kişilik villalar", dotColor: "#f6b8d0", href: "/sonuclar?features=honeyMoon" },
    { title: "Ultra Lüx Villalar", description: "Ultra lüx ve modern tatil villaları", dotColor: "#d5f6fb", href: "/sonuclar?features=ultraLux" },
    { title: "Merkezi Konumlu Villalar", description: "Şehir merkezinde tatil villaları", dotColor: "#f6f3a9", href: "/sonuclar?features=centralVillas" },
    { title: "Denize Yakın Villalar", description: "Denize yürüme mesafesinde villalar", dotColor: "#e5ecf8", href: "/sonuclar?features=beachVillas" },
    { title: "Deniz Manzaralı Villalar", description: "Deniz manzaralı tatil villaları", dotColor: "#f0ebd8", href: "/sonuclar?features=seaview" },
    { title: "Doğa Manzaralı Villalar", description: "Doğa içinde ve doğa manzaralı tatil villaları", dotColor: "#d1feb8", href: "/sonuclar?features=natureview" },
    { title: "Havuzu Korunaklı Villalar", description: "Havuzu dışarıdan görünmeyen villalar", dotColor: "#efdfd8", href: "/sonuclar?features=isolatedPoolVillas" },
    { title: "Çocuk Havuzlu Villalar", description: "Çocuk havuzlu tatil villaları", dotColor: "#ebccff", href: "/sonuclar?features=kidPoolVillas" },
    { title: "Yeni Villalar", description: "Yeni yapılmış modern ve geniş tatil villaları", dotColor: "#e7d7ca", href: "/sonuclar?features=newVillas" },
];

/* ─── Tab config ─── */
const TABS: { key: TabKey; label: string }[] = [
    { key: "1", label: "Popüler Aramalar" },
    { key: "2", label: "Tüm Konumlar" },
    { key: "3", label: "Kategoriler" },
];

const TAB_DATA: Record<TabKey, SearchItem[]> = {
    "1": POPULAR_SEARCHES,
    "2": ALL_LOCATIONS,
    "3": CATEGORIES,
};

/* ─── Component ─── */
export default function MostSearchedSection() {
    const [activeTab, setActiveTab] = useState<TabKey>("1");

    const currentItems = TAB_DATA[activeTab];

    return (
        <section
            style={{
                background: "#fff",
                borderTop: "1px solid #dfdfe3aa",
                fontFamily: '"DM Sans", serif',
            }}
        >
            <div
                style={{
                    maxWidth: 1320,
                    margin: "0 auto",
                    padding: "32px 24px 48px",
                }}
            >
                {/* ── Title ── */}
                <h2
                    style={{
                        fontSize: 24,
                        fontWeight: 600,
                        color: "#333",
                        margin: 0,
                    }}
                >
                    En Çok Arananlar
                </h2>

                {/* ── Tabs ── */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0,
                        marginTop: 12,
                        fontSize: 16,
                        fontWeight: 500,
                    }}
                >
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            style={{
                                padding: "8px 16px",
                                borderRadius: 20,
                                border: "none",
                                cursor: "pointer",
                                fontSize: 14,
                                fontWeight: 500,
                                fontFamily: '"DM Sans", serif',
                                transition: "all .2s",
                                background: activeTab === tab.key ? "#3aa8b8" : "transparent",
                                color: activeTab === tab.key ? "#fff" : "#555",
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ── Content grid ── */}
                <div
                    style={{
                        paddingTop: 16,
                        marginTop: 16,
                        minHeight: 240,
                        borderTop: "1px solid #ebeef563",
                    }}
                >
                    <div
                        key={activeTab}
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(5, 1fr)",
                            gap: "0",
                            color: "#333",
                            fontSize: 15,
                            animation: "fadeInUp .3s ease",
                        }}
                    >
                        {currentItems.map((item, idx) => (
                            <Link
                                key={idx}
                                href={item.href}
                                style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                    padding: "10px 4px",
                                    borderRadius: 8,
                                    transition: "background .2s",
                                }}
                                className="most-searched-item"
                            >
                                <h6
                                    style={{
                                        margin: 0,
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: "#333",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 6,
                                    }}
                                >
                                    <span
                                        style={{
                                            color: item.dotColor,
                                            fontSize: 8,
                                            lineHeight: 1,
                                        }}
                                    >
                                        ⏺
                                    </span>
                                    {item.title}
                                </h6>
                                <div
                                    style={{
                                        marginTop: 2,
                                        fontSize: 12,
                                        fontWeight: 400,
                                        color: "#999",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {item.description}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Keyframe animation ── */}
            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(6px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .most-searched-item:hover {
                    background: #f8f9fa !important;
                }
            `}</style>
        </section>
    );
}
