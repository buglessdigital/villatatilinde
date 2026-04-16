"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/lib/queries";
import type { DbCategory } from "@/lib/types";
import MostSearchedSection from "@/components/MostSearchedSection";

interface CatView {
    slug: string;
    name: string;
    image: string;
    filterParam: string;
    badgeText: string;
    villaCount: number;
    description: string;
    tags: string[];
}

export default function KategorilerContent() {
    const [categories, setCategories] = useState<CatView[]>([]);

    useEffect(() => {
        async function load() {
            try {
                const data = await getCategories();
                const mapped: CatView[] = data.map((c: DbCategory) => ({
                    slug: c.slug,
                    name: c.name,
                    image: c.image_url || "/images/discount.png",
                    filterParam: c.filter_param || c.slug,
                    badgeText: c.badge_text || "",
                    villaCount: c.villa_count || 0,
                    description: c.description || "",
                    tags: c.tags || [],
                }));
                setCategories(mapped);
            } catch (err) {
                console.error("Kategoriler yüklenemedi:", err);
            }
        }
        load();
    }, []);

    return (
        <>
            <div className="ty-page">
                {/* ── Page Title ── */}
                <div className="ty-header">
                    <h1 className="ty-title">Villa Kategorileri</h1>
                </div>

                {/* ── Categories Grid ── */}
                <div className="ty-grid">
                    {categories.map((cat) => (
                        <Link
                            key={cat.slug}
                            href={`/sonuclar?features=${cat.filterParam}`}
                            className="ty-card"
                        >
                            {/* Image */}
                            <div className="ty-card-img-wrap">
                                <Image
                                    src={cat.image}
                                    alt={cat.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    style={{ objectFit: "cover" }}
                                    className="ty-card-img"
                                />
                            </div>

                            {/* Title */}
                            <h2 className="ty-card-title">{cat.name}</h2>

                            {/* Description Row */}
                            <div className="ty-card-desc-row">
                                <span className="ty-card-desc">{cat.description}</span>
                                <span className="ty-card-arrow">
                                    <svg width="28" height="10" viewBox="0 0 28 10" fill="none">
                                        <path d="M0 5H26M26 5L21.5 1M26 5L21.5 9" stroke="currentColor" strokeWidth="1" />
                                    </svg>
                                </span>
                            </div>


                        </Link>
                    ))}
                </div>
            </div>

            {/* ── En Çok Arananlar – shared component ── */}
            <MostSearchedSection />
        </>
    );
}
