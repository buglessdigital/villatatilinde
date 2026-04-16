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
            <div className="section-container">
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
                <div className="tabs-container">
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            className={`tab-button ${activeTab === tab.key ? "active" : ""}`}
                            onClick={() => setActiveTab(tab.key)}
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
                        className="grid-container"
                        style={{
                            color: "#333",
                            animation: "fadeInUp .3s ease",
                        }}
                    >
                        {currentItems.map((item, idx) => (
                            <Link
                                key={idx}
                                href={item.href}
                                className="most-searched-item"
                            >
                                <h6 className="item-title">
                                    <span
                                        style={{
                                            color: item.dotColor,
                                            fontSize: 10,
                                            lineHeight: 1,
                                            flexShrink: 0,
                                        }}
                                    >
                                        ⏺
                                    </span>
                                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {item.title}
                                    </span>
                                </h6>
                                <div className="item-desc">
                                    {item.description}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Keyframe animation & Styles ── */}
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
                .section-container {
                    max-width: 1320px;
                    margin: 0 auto;
                    padding: 32px 24px 48px;
                }
                .most-searched-item {
                    text-decoration: none;
                    color: inherit;
                    padding: 10px 4px;
                    border-radius: 8px;
                    transition: background .2s;
                    min-width: 0; /* Prevents CSS Grid blow-out */
                    overflow: hidden;
                }
                .most-searched-item:hover {
                    background: #f8f9fa !important;
                }
                .tabs-container {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-top: 12px;
                    overflow-x: auto;
                    scrollbar-width: none; /* Firefox */
                    -ms-overflow-style: none;  /* IE and Edge */
                }
                .tabs-container::-webkit-scrollbar {
                    display: none;
                }
                .tab-button {
                    padding: 8px 16px;
                    border-radius: 20px;
                    border: none;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    font-family: inherit;
                    transition: all .2s;
                    background: transparent;
                    color: #555;
                    white-space: nowrap;
                }
                .tab-button.active {
                    background: #50b0f0;
                    color: #fff;
                }
                .grid-container {
                    display: grid;
                    grid-template-columns: repeat(5, minmax(0, 1fr));
                    gap: 12px;
                }
                .item-title {
                    margin: 0;
                    font-size: 15px;
                    font-weight: 600;
                    color: #333;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                .item-desc {
                    margin-top: 4px;
                    font-size: 13px;
                    font-weight: 400;
                    color: #999;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                @media (max-width: 1024px) {
                    .grid-container {
                        grid-template-columns: repeat(3, minmax(0, 1fr));
                    }
                }

                @media (max-width: 768px) {
                    .section-container {
                        padding: 24px 16px 32px;
                        overflow: hidden;
                        width: 100%;
                    }
                    .grid-container {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                        gap: 8px;
                    }
                    .tab-button {
                        padding: 6px 14px;
                        font-size: 14px;
                    }
                    .item-title {
                        font-size: 13px;
                        gap: 4px;
                    }
                    .item-desc {
                        font-size: 12px;
                    }
                }
            `}</style>
        </section>
    );
}
