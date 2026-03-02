"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getRecentVillas } from "@/lib/queries";
import type { VillaCard as VillaCardType } from "@/lib/types";

interface LastVisitedVilla {
    slug: string;
    name: string;
    imageSmall: string;
    location: string;
    features: string[];
    score: number;
    minPrice: string;
    bedrooms: number;
    guests: number;
    hasDiscount: boolean;
}

function mapToLastVisited(v: VillaCardType): LastVisitedVilla {
    return {
        slug: v.slug,
        name: v.name,
        imageSmall: v.cover_image_url || "/images/natureview.jpg",
        location: v.location_label || "",
        features: v.features.slice(0, 3),
        score: 0,
        minPrice: v.min_price
            ? `₺${Number(v.min_price).toLocaleString("tr-TR")}`
            : "₺0",
        bedrooms: v.bedrooms,
        guests: v.max_guests,
        hasDiscount: v.has_active_discount || false,
    };
}

/* ─── Last Visited Card ─── */
function LastVisitedCard({ villa }: { villa: LastVisitedVilla }) {
    return (
        <div
            className="lastVisitedSlide"
            style={{
                color: "#333",
                position: "relative",
                minWidth: 280,
                width: 280,
                borderRadius: 16,
                padding: "8px 8px",
                flexShrink: 0,
            }}
        >
            <Link
                href={`/tatilvillasi/${villa.slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
            >
                <div
                    style={{
                        borderRadius: 16,
                        background: "#ebeef51a",
                        border: "1px solid #eee",
                    }}
                >
                    {/* Discount badge */}
                    {villa.hasDiscount && (
                        <div
                            className="dm-sans"
                            style={{
                                zIndex: 12,
                                color: "#fff",
                                padding: "4px 7px",
                                borderRadius: 8,
                                position: "absolute",
                                left: 15,
                                top: 15,
                                background: "#d6293e",
                                fontSize: 12,
                            }}
                        >
                            İndirim Fırsatları
                        </div>
                    )}

                    {/* Villa image */}
                    <img
                        src={villa.imageSmall}
                        alt={villa.name}
                        style={{
                            width: "100%",
                            height: 220,
                            objectFit: "cover",
                            borderRadius: "14px 14px 0 0",
                        }}
                    />

                    {/* Villa info */}
                    <div style={{ padding: 12 }}>
                        {/* Name + Score */}
                        <div
                            className="dm-sans middleft skiptranslate"
                            style={{ fontSize: 18, fontWeight: 600 }}
                        >
                            {villa.name} &nbsp;
                            {villa.score > 0 && (
                                <div
                                    style={{
                                        marginLeft: "auto",
                                        padding: "0 8px 0 0",
                                        fontWeight: 600,
                                        fontSize: 15,
                                    }}
                                >
                                    <div className="middle">
                                        <img
                                            src="/images/star.svg"
                                            style={{ height: 14 }}
                                            alt="Star"
                                        />
                                        <div
                                            style={{
                                                fontWeight: 600,
                                                fontSize: 13,
                                                marginTop: 4,
                                            }}
                                        >
                                            <span style={{ marginLeft: 4 }}>{villa.score}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Location */}
                        <div
                            className="oneLine dm-sans"
                            style={{
                                fontSize: 14,
                                marginTop: 6,
                                fontWeight: 600,
                                color: "#333",
                            }}
                        >
                            {villa.location}
                        </div>

                        {/* Features */}
                        <div
                            className="oneLine dm-sans"
                            style={{ marginTop: 12, fontSize: 12, opacity: 0.8 }}
                        >
                            {villa.features.map((f, i) => (
                                <span key={i}>•{f} &nbsp; </span>
                            ))}
                        </div>

                        {/* Price */}
                        <div
                            className="oneLine"
                            style={{ marginTop: 10, color: "#6a6a6aaa" }}
                        >
                            <span
                                className="poppins"
                                style={{ fontSize: 16, color: "#333" }}
                            >
                                {villa.minPrice}
                            </span>{" "}
                            / Gece&apos;den başlayan fiya...
                        </div>

                        {/* Beds & Guests footer */}
                        <div
                            className="middle"
                            style={{
                                color: "#333",
                                borderTop: "1px solid #ebeef5aa",
                                lineHeight: 1,
                                marginTop: 10,
                                paddingTop: 10,
                                paddingBottom: 10,
                                fontSize: 13,
                                fontWeight: 600,
                            }}
                        >
                            <img
                                src="/images/bed.svg"
                                style={{
                                    opacity: 1,
                                    display: "inline-block",
                                    height: 13,
                                    marginRight: 6,
                                }}
                                alt="Beds"
                            />
                            &nbsp;{villa.bedrooms}
                            <img
                                src="/images/people.svg"
                                style={{
                                    opacity: 1,
                                    marginLeft: 25,
                                    display: "inline-block",
                                    height: 14,
                                    marginRight: 5,
                                }}
                                alt="Guests"
                            />
                            &nbsp;{villa.guests} Kişi
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

/* ─── Last Visited Section ─── */
export default function LastVisitedSection() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftPos, setScrollLeftPos] = useState(0);
    const [villas, setVillas] = useState<LastVisitedVilla[]>([]);

    useEffect(() => {
        async function load() {
            try {
                const data = await getRecentVillas();
                setVillas(data.map(mapToLastVisited));
            } catch (err) {
                console.error('Son gezilenler yüklenemedi:', err);
            }
        }
        load();
    }, []);

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if (!scrollRef.current) return;
            setIsDragging(true);
            setStartX(e.pageX - scrollRef.current.offsetLeft);
            setScrollLeftPos(scrollRef.current.scrollLeft);
        },
        []
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (!isDragging || !scrollRef.current) return;
            e.preventDefault();
            const x = e.pageX - scrollRef.current.offsetLeft;
            const walk = (x - startX) * 1.5;
            scrollRef.current.scrollLeft = scrollLeftPos - walk;
        },
        [isDragging, startX, scrollLeftPos]
    );

    if (villas.length === 0) return null;

    return (
        <div className="paddingMobile lastVisitedCont">
            <div className="lastVisitedContInner">
                <div className="dm-sans lastVisitedTitle">En Son Gezilenler</div>
                <div
                    ref={scrollRef}
                    className="hideScrollbar"
                    style={{
                        display: "flex",
                        overflowX: "auto",
                        cursor: isDragging ? "grabbing" : "grab",
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onMouseMove={handleMouseMove}
                >
                    {villas.map((villa) => (
                        <LastVisitedCard key={villa.slug} villa={villa} />
                    ))}
                </div>
            </div>
        </div>
    );
}
