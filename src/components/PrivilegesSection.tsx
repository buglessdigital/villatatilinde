"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

/* ─── Type ─── */
interface Promotion {
    id: string;
    title: string;
    slug: string;
    discount_text: string;
    description: string;
    image_url: string;
    external_url: string;
    category: string;
    is_active: boolean;
    sort_order: number;
}

export default function PrivilegesSection() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [cards, setCards] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);

    /* ── Fetch promotions from Supabase ── */
    useEffect(() => {
        async function loadPromotions() {
            const { data, error } = await supabase
                .from("promotions")
                .select("*")
                .eq("is_active", true)
                .order("sort_order", { ascending: true });

            if (data && data.length > 0) {
                const kuponCard: Promotion = {
                    id: 'kupon-olustur',
                    title: 'Ayrıcalık Kuponu Oluştur',
                    slug: 'kupon-olustur',
                    discount_text: '',
                    description: 'Tesislerde size özel indirim kuponu oluşturmak için hemen tıklayın.',
                    image_url: '/images/discount.png',
                    external_url: '/kupon-olustur',
                    category: '',
                    is_active: true,
                    sort_order: -1
                };
                setCards([kuponCard, ...data]);
            }
            setLoading(false);
        }
        loadPromotions();
    }, []);

    /* ── Build infinite loop cards ── */
    const infiniteCards = cards.length > 0
        ? Array.from({ length: 40 }).flatMap(() => cards)
        : [];

    const getItemWidth = () => {
        if (!scrollRef.current) return 396;
        const firstItem = scrollRef.current.querySelector('.privilege-item') as HTMLElement;
        return firstItem ? firstItem.offsetWidth + 16 : 396; // 16px is the gap
    };

    // Start scroll near the middle so user can scroll left or right "infinitely"
    useEffect(() => {
        if (scrollRef.current && cards.length > 0) {
            const middleSetIndex = 20;
            setTimeout(() => {
                if (scrollRef.current) {
                    const width = getItemWidth();
                    scrollRef.current.scrollLeft = middleSetIndex * cards.length * width;
                }
            }, 100);
        }
    }, [cards]);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -getItemWidth(), behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: getItemWidth(), behavior: "smooth" });
        }
    };

    // If user scrolls too close to edges, reset them to the middle silently
    const handleScroll = () => {
        if (!scrollRef.current || cards.length === 0) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const width = getItemWidth();

        if (scrollLeft < width * 5) {
            scrollRef.current.style.scrollBehavior = "auto";
            scrollRef.current.scrollLeft += 20 * cards.length * width;
            scrollRef.current.style.scrollBehavior = "smooth";
        } else if (scrollLeft + clientWidth > scrollWidth - width * 5) {
            scrollRef.current.style.scrollBehavior = "auto";
            scrollRef.current.scrollLeft -= 20 * cards.length * width;
            scrollRef.current.style.scrollBehavior = "smooth";
        }
    };

    /* ── Auto-scroll Effect ── */
    useEffect(() => {
        if (cards.length <= 1) return;
        const interval = setInterval(() => {
            if (!isHovered && scrollRef.current) {
                scrollRef.current.scrollBy({ left: getItemWidth(), behavior: "smooth" });
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [cards.length, isHovered]);

    // Don't render anything while loading or if no promotions
    if (loading || cards.length === 0) return null;

    return (
        <div
            className="paddingMobile"
            style={{ position: "relative", marginTop: 32, minHeight: 120 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h3
                    className="titleCats"
                    style={{
                        textAlign: "left",
                        fontSize: 30,
                        fontWeight: 700,
                        color: "#000",
                        margin: 0,
                    }}
                >
                    Villa Tatilinde Ayrıcalıklarınız
                </h3>

                <div className="carousel-controls" style={{ display: "flex", gap: "8px" }}>
                    <button
                        onClick={scrollLeft}
                        aria-label="Önceki"
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            border: "1px solid #eaeaea",
                            background: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                            transition: "all 0.2s ease"
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = "#f5f5f5";
                            e.currentTarget.style.transform = "scale(1.05)";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = "#fff";
                            e.currentTarget.style.transform = "scale(1)";
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    <button
                        onClick={scrollRight}
                        aria-label="Sonraki"
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            border: "1px solid #eaeaea",
                            background: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                            transition: "all 0.2s ease"
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = "#f5f5f5";
                            e.currentTarget.style.transform = "scale(1.05)";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = "#fff";
                            e.currentTarget.style.transform = "scale(1)";
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>
            </div>

            <style>{`
                .privileges-grid {
                    display: flex;
                    gap: 16px;
                    overflow-x: auto;
                    padding-bottom: 20px;
                    scrollbar-width: none; /* Firefox */
                    -ms-overflow-style: none; /* IE and Edge */
                    -webkit-overflow-scrolling: touch;
                    scroll-behavior: smooth;
                    scroll-snap-type: x mandatory;
                }
                .privileges-grid::-webkit-scrollbar {
                    display: none; /* Chrome, Safari and Opera */
                }
                .privilege-item {
                    width: 380px;
                    flex-shrink: 0;
                    scroll-snap-align: start;
                }
                .privilege-card-inner {
                    display: flex;
                    align-items: center;
                    padding: 10px;
                    border-radius: 18px;
                    border: 1px solid #eaeaea;
                    background: #fff;
                    height: 100%;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .privilege-card-inner:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                    transform: translateY(-2px);
                }
                @media (max-width: 768px) {
                    .carousel-controls {
                        display: none !important;
                    }
                    .privilege-item {
                        width: calc(100vw - 32px); /* Ekran genişliğine göre */
                        max-width: 380px;
                    }
                }
            `}</style>

            <div
                ref={scrollRef}
                className="privileges-grid"
                onScroll={handleScroll}
            >
                {infiniteCards.map((card, i) => {
                    const href = card.external_url
                        ? card.external_url
                        : card.category
                        ? `/promosyonlar/kategori/${encodeURIComponent(card.category)}`
                        : null;

                    const cardInner = (
                        <div className="privilege-card-inner bhs" style={{ cursor: href ? "pointer" : "default" }}>
                            <img
                                src={card.image_url}
                                style={{
                                    height: 88,
                                    width: 120,
                                    borderRadius: 14,
                                    flexShrink: 0,
                                    objectFit: "cover" as const,
                                    padding: "2px 2px 2px 3px",
                                }}
                                alt={card.title}
                            />
                            <div style={{ marginLeft: 12, flex: 1, overflow: "hidden" }}>
                                <div
                                    className="oneLine"
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 400,
                                        color: "#111",
                                        marginBottom: 6
                                    }}
                                >
                                    <strong>{card.title}</strong> {card.discount_text}
                                </div>
                                <div
                                    className="twoLine"
                                    style={{
                                        fontSize: 14,
                                        fontWeight: 400,
                                        color: "#555",
                                        lineHeight: 1.4
                                    }}
                                >
                                    {card.description}
                                </div>
                            </div>
                        </div>
                    );

                    return (
                        <div key={i} className="privilege-item">
                            {href ? (
                                <Link href={href} target={card.external_url ? "_blank" : "_self"} rel={card.external_url ? "noopener noreferrer" : ""} style={{ textDecoration: "none" }}>
                                    {cardInner}
                                </Link>
                            ) : (
                                cardInner
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
