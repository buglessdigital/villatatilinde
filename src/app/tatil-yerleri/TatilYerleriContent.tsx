"use client";

import Link from "next/link";
import Image from "next/image";
import { destinations } from "@/data/mockDestinations";
import MostSearchedSection from "@/components/MostSearchedSection";

export default function TatilYerleriContent() {
    return (
        <>
            <div className="ty-page">
                {/* ── Page Title ── */}
                <div className="ty-header">
                    <h1 className="ty-title">Tatil Konumları</h1>
                </div>

                {/* ── Destination Grid ── */}
                <div className="ty-grid">
                    {destinations.map((dest) => (
                        <Link
                            key={dest.slug}
                            href={`/sonuclar?location=${dest.filterParam}`}
                            className="ty-card"
                        >
                            {/* Image */}
                            <div className="ty-card-img-wrap">
                                <Image
                                    src={dest.image}
                                    alt={dest.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    style={{ objectFit: "cover" }}
                                    className="ty-card-img"
                                />
                                {/* Badge */}
                                <span className="ty-card-badge">
                                    {dest.location} Konumunda Toplam {dest.villaCount} Villa
                                </span>
                            </div>

                            {/* Title + Description Row */}
                            <h2 className="ty-card-title">{dest.name}</h2>
                            <div className="ty-card-desc-row">
                                <span className="ty-card-desc">{dest.description}</span>
                                <span className="ty-card-arrow">
                                    <svg width="28" height="10" viewBox="0 0 28 10" fill="none">
                                        <path d="M0 5H26M26 5L21.5 1M26 5L21.5 9" stroke="currentColor" strokeWidth="1" />
                                    </svg>
                                </span>
                            </div>

                            {/* Tags */}
                            <div className="ty-card-tags">
                                {dest.tags.map((tag, i) => (
                                    <span key={i}>
                                        {tag}
                                        {i < dest.tags.length - 1 && <span className="ty-tag-dot"> • </span>}
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

