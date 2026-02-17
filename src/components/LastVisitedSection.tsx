"use client";

import React, { useRef, useState, useCallback } from "react";
import Link from "next/link";

/* ─── Mock Last Visited Data ─── */
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

const MOCK_LAST_VISITED: LastVisitedVilla[] = [
    {
        slug: "villa-doga",
        name: "Villa Doğa",
        imageSmall: "/images/natureview.jpg",
        location: "Kalkan Bezirgan",
        features: ["Özel Havuz", "Çocuk Havuzu", "Doğa Manzaralı"],
        score: 0,
        minPrice: "₺12.000",
        bedrooms: 3,
        guests: 6,
        hasDiscount: true,
    },
    {
        slug: "villa-freya",
        name: "Villa Freya",
        imageSmall: "/images/luxury.jpg",
        location: "Kalkan / Kalamar",
        features: ["Özel Havuz", "Çocuk Havuzu", "Sonsuzluk Havuzu"],
        score: 5,
        minPrice: "₺7.071",
        bedrooms: 5,
        guests: 10,
        hasDiscount: false,
    },
    {
        slug: "villa-oykununevi-2",
        name: "Villa Öykü'nün Evi 2",
        imageSmall: "/images/honey.jpg",
        location: "Kalkan Kızıltaş",
        features: ["Özel Havuz", "Isıtmalı Havuz", "Balayı Villası"],
        score: 5,
        minPrice: "₺8.202",
        bedrooms: 1,
        guests: 2,
        hasDiscount: false,
    },
    {
        slug: "mulberry-collection-1",
        name: "Mulberry Collection 1",
        imageSmall: "/images/seaview.jpg",
        location: "Kalkan Köy",
        features: ["Özel Havuz", "Sığ Havuz", "Deniz Manzaralı"],
        score: 0,
        minPrice: "₺10.715",
        bedrooms: 3,
        guests: 6,
        hasDiscount: false,
    },
    {
        slug: "berk-suit-apart",
        name: "Berk Suit Apart",
        imageSmall: "/images/central.jpg",
        location: "Kalkan Kördere",
        features: ["Mutfak", "Ebeveyn Banyosu", "Balkon", "Jakuzi"],
        score: 0,
        minPrice: "₺2.135",
        bedrooms: 1,
        guests: 2,
        hasDiscount: false,
    },
    {
        slug: "villa-redro",
        name: "Villa Redro",
        imageSmall: "/images/kidpool.jpg",
        location: "Kalkan İslamlar",
        features: ["Özel Havuz", "Muhafazakar Havuz", "Sığ Havuz"],
        score: 0,
        minPrice: "₺7.000",
        bedrooms: 2,
        guests: 4,
        hasDiscount: false,
    },
];

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
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if (!scrollRef.current) return;
            setIsDragging(true);
            setStartX(e.pageX - scrollRef.current.offsetLeft);
            setScrollLeft(scrollRef.current.scrollLeft);
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
            scrollRef.current.scrollLeft = scrollLeft - walk;
        },
        [isDragging, startX, scrollLeft]
    );

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
                    {MOCK_LAST_VISITED.map((villa) => (
                        <LastVisitedCard key={villa.slug} villa={villa} />
                    ))}
                </div>
            </div>
        </div>
    );
}
