"use client";

import React, { useRef, useState, useCallback } from "react";
import Link from "next/link";

/* ─── Categories Data ─── */
interface Category {
    label: string;
    image: string;
    badgeCount: string;
    href: string;
    isDiscount?: boolean;
}

const CATEGORIES: Category[] = [
    {
        label: "Fırsat İndirimler",
        image: "/images/discount.png",
        badgeCount: "24 Villa",
        href: "/indirimli-villalar",
        isDiscount: true,
    },
    {
        label: "Uygun Fiyatlı",
        image: "/images/affordable.jpg",
        badgeCount: "227 Villa",
        href: "/sonuclar?features=affordableVillas",
    },
    {
        label: "Muhafazakar",
        image: "/images/muhafazakar.jpg",
        badgeCount: "143 Villa",
        href: "/sonuclar?features=isolatedVillas",
    },
    {
        label: "Balayı",
        image: "/images/honey.jpg",
        badgeCount: "155 Villa",
        href: "/sonuclar?features=honeyMoon",
    },
    {
        label: "Ultra Lüx",
        image: "/images/luxury.jpg",
        badgeCount: "49 Villa",
        href: "/sonuclar?features=ultraLux",
    },
    {
        label: "Merkezi Konumda",
        image: "/images/central.jpg",
        badgeCount: "174 Villa",
        href: "/sonuclar?features=centralVillas",
    },
    {
        label: "Doğa İçinde",
        image: "/images/natureview.jpg",
        badgeCount: "292 Villa",
        href: "/sonuclar?features=natureview",
    },
    {
        label: "Deniz Manzaralı",
        image: "/images/seaview.jpg",
        badgeCount: "233 Villa",
        href: "/sonuclar?features=seaview",
    },
    {
        label: "Denize Yakın",
        image: "/images/beach.jpg",
        badgeCount: "152 Villa",
        href: "/sonuclar?features=beachVillas",
    },
    {
        label: "Çocuk Havuzlu Villalar",
        image: "/images/kidpool.jpg",
        badgeCount: "75 Villa",
        href: "/sonuclar?features=kidPoolVillas",
    },
];

export default function CategoriesSection() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollIndex, setScrollIndex] = useState(0);

    const scrollLeft = useCallback(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -450, behavior: "smooth" });
            setScrollIndex((p) => Math.max(0, p - 1));
        }
    }, []);

    const scrollRight = useCallback(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 450, behavior: "smooth" });
            setScrollIndex((p) => Math.min(2, p + 1));
        }
    }, []);

    return (
        <div
            className="paddingMobile catsCont"
            style={{
                zIndex: 8,
                background: "#fff",
                paddingTop: 24,
                position: "relative",
            }}
        >
            {/* Navigation arrows (desktop only) */}
            {scrollIndex > 0 && (
                <img
                    className="no1023"
                    src="/images/cfow.svg"
                    onClick={scrollLeft}
                    style={{
                        zIndex: 1111111111,
                        background: "#0b0a12",
                        padding: 4,
                        transform: "scaleX(-1)",
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        position: "absolute",
                        left: "calc(2% - 32px)",
                        top: "calc(50% - 10px)",
                        cursor: "pointer",
                    }}
                    alt="Prev"
                />
            )}
            {scrollIndex < 2 && (
                <img
                    className="no1023"
                    src="/images/cfow.svg"
                    onClick={scrollRight}
                    style={{
                        zIndex: 1111111111,
                        background: "#0b0a12",
                        padding: 4,
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        position: "absolute",
                        right: "calc(2% - 32px)",
                        top: "calc(50% - 10px)",
                        cursor: "pointer",
                    }}
                    alt="Next"
                />
            )}

            <h3 className="titleCats">Kategoriler</h3>

            <div
                ref={scrollRef}
                className="hideScrollbar"
                style={{
                    display: "flex",
                    overflowX: "auto",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    WebkitOverflowScrolling: "touch",
                }}
                onScroll={() => {
                    if (scrollRef.current) {
                        const el = scrollRef.current;
                        const maxScroll = el.scrollWidth - el.clientWidth;
                        const pos = el.scrollLeft / maxScroll;
                        if (pos < 0.33) setScrollIndex(0);
                        else if (pos < 0.66) setScrollIndex(1);
                        else setScrollIndex(2);
                    }
                }}
            >
                {CATEGORIES.map((cat, i) => (
                    <div
                        key={i}
                        className="catSlide"
                        style={{
                            position: "relative",
                            width: i === 0 ? 138 : 142,
                            flexShrink: 0,
                            padding: i === 0 ? "8px 4px 8px 0" : "8px 4px",
                        }}
                    >
                        <Link href={cat.href}>
                            <div style={{ width: "100%" }}>
                                {/* Badge */}
                                <div
                                    style={{
                                        position: "absolute",
                                        right: 14,
                                        top: 14,
                                        padding: "0 4px",
                                        fontSize: 10,
                                        fontWeight: 500,
                                        color: "#747579",
                                        borderRadius: 12,
                                        background: "#fff",
                                        zIndex: 2,
                                    }}
                                >
                                    {cat.badgeCount}
                                </div>

                                {/* Image */}
                                <img
                                    src={cat.image}
                                    alt={cat.label}
                                    className={cat.isDiscount ? "catSlideIm0" : "catSlideIm"}
                                />

                                {/* Title */}
                                <div className="oneLine catSlideTitle">{cat.label}</div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
