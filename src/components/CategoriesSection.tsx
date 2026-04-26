"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getCategories } from "@/lib/queries";
import { supabase } from "@/lib/supabase";
import type { DbCategory } from "@/lib/types";

interface CategoryView {
    label: string;
    image: string;
    badgeCount: string;
    href: string;
    isDiscount?: boolean;
}

export default function CategoriesSection() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollIndex, setScrollIndex] = useState(0);
    const [categories, setCategories] = useState<CategoryView[]>([]);

    useEffect(() => {
        async function load() {
            try {
                const [data, promoRes] = await Promise.all([
                    getCategories(),
                    supabase
                        .from("villas")
                        .select("id", { count: "exact", head: true })
                        .eq("is_published", true)
                        .eq("is_promotional", true),
                ]);
                const promoCount = promoRes.count ?? 0;
                const promoCategory: CategoryView = {
                    label: "Promosyonlu Villalar",
                    image: "/images/discount.png",
                    badgeCount: `${promoCount} Villa`,
                    href: "/promosyonlar/kategori/villa",
                    isDiscount: true,
                };
                const mapped: CategoryView[] = data.map((c: DbCategory) => ({
                    label: c.name,
                    image: c.image_url || "/images/discount.png",
                    badgeCount: `${c.villa_count || 0} Villa`,
                    href: c.filter_param
                        ? `/sonuclar?features=${c.filter_param}`
                        : `/villa-kategorileri`,
                    isDiscount: c.slug === "firsatlar" || c.slug === "indirimli-villalar",
                }));
                setCategories([promoCategory, ...mapped]);
            } catch (err) {
                console.error("Kategoriler yüklenemedi:", err);
            }
        }
        load();
    }, []);

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
                {categories.map((cat, i) => (
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
