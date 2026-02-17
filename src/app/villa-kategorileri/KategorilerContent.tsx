"use client";

import Link from "next/link";
import Image from "next/image";
import { categories } from "@/data/mockCategories";
import MostSearchedSection from "@/components/MostSearchedSection";

export default function KategorilerContent() {
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
                                {/* Badge */}
                                <span className="ty-card-badge">
                                    {cat.badgeText} {cat.villaCount} Villa
                                </span>
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

                            {/* Tags */}
                            <div className="ty-card-tags">
                                {cat.tags.map((tag, i) => (
                                    <span key={i}>
                                        {tag}
                                        {i < cat.tags.length - 1 && <span className="ty-tag-dot"> • </span>}
                                    </span>
                                ))}
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
