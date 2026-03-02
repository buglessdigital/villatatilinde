"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getDestinations } from "@/lib/queries";
import type { DbDestination } from "@/lib/types";
import MostSearchedSection from "@/components/MostSearchedSection";

interface DestView {
    slug: string;
    name: string;
    image: string;
    location: string;
    filterParam: string;
    villaCount: number;
    description: string;
    tags: string[];
}

export default function TatilYerleriContent() {
    const [destinations, setDestinations] = useState<DestView[]>([]);

    useEffect(() => {
        async function load() {
            try {
                const data = await getDestinations();
                const mapped: DestView[] = data.map((d: DbDestination) => ({
                    slug: d.slug,
                    name: d.name,
                    image: d.image_url || "/images/natureview.jpg",
                    location: d.location_label || d.name,
                    filterParam: d.filter_param || d.slug,
                    villaCount: d.villa_count || 0,
                    description: d.description || "",
                    tags: d.tags || [],
                }));
                setDestinations(mapped);
            } catch (err) {
                console.error("Tatil yerleri yüklenemedi:", err);
            }
        }
        load();
    }, []);

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
