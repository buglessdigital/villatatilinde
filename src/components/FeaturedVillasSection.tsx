"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";

/* ─── Mock Villa Data ─── */
interface Villa {
    slug: string;
    name: string;
    images: string[];
    features: string[];
    nightlyPrice: string;
    totalPrice: string;
    dateRange: string;
    beds: number;
    guests: number;
    maxDiscount: number;
    cheapestVilla: boolean;
}

const MOCK_VILLAS: Villa[] = [
    {
        slug: "villa-doga",
        name: "Villa Doğa",
        images: [
            "/images/natureview.jpg",
            "/images/luxury.jpg",
            "/images/central.jpg",
        ],
        features: ["Özel Havuz", "Çocuk Havuzu", "Doğa Manzaralı"],
        nightlyPrice: "₺12.000",
        totalPrice: "₺60.000",
        dateRange: "01 May - 06 May",
        beds: 8,
        guests: 8,
        maxDiscount: 8,
        cheapestVilla: true,
    },
    {
        slug: "villa-sea",
        name: "Villa Sea",
        images: [
            "/images/seaview.jpg",
            "/images/beach.jpg",
            "/images/affordable.jpg",
        ],
        features: ["Özel Havuz", "Mutfak", "Ebeveyn Banyosu"],
        nightlyPrice: "₺9.000",
        totalPrice: "₺45.000",
        dateRange: "14 Şub - 19 Şub",
        beds: 3,
        guests: 4,
        maxDiscount: 9,
        cheapestVilla: true,
    },
    {
        slug: "villa-akbulut-1",
        name: "Villa Akbulut 1",
        images: [
            "/images/honey.jpg",
            "/images/central.jpg",
            "/images/luxury.jpg",
        ],
        features: ["Sonsuzluk Havuzu", "Özel Havuz", "Sığ Havuz"],
        nightlyPrice: "₺7.000",
        totalPrice: "₺35.000",
        dateRange: "01 Mar - 06 Mar",
        beds: 1,
        guests: 2,
        maxDiscount: 30,
        cheapestVilla: true,
    },
    {
        slug: "villa-freya",
        name: "Villa Freya",
        images: [
            "/images/luxury.jpg",
            "/images/seaview.jpg",
            "/images/natureview.jpg",
        ],
        features: ["Özel Havuz", "Çocuk Havuzu", "Sonsuzluk Havuzu"],
        nightlyPrice: "₺12.715",
        totalPrice: "₺63.575",
        dateRange: "01 May - 06 May",
        beds: 5,
        guests: 10,
        maxDiscount: 10,
        cheapestVilla: true,
    },
    {
        slug: "villa-kalkan",
        name: "Villa Kalkan",
        images: [
            "/images/beach.jpg",
            "/images/honey.jpg",
            "/images/central.jpg",
        ],
        features: ["Deniz Manzaralı", "Özel Havuz", "Jakuzi"],
        nightlyPrice: "₺15.000",
        totalPrice: "₺75.000",
        dateRange: "10 Haz - 15 Haz",
        beds: 6,
        guests: 12,
        maxDiscount: 12,
        cheapestVilla: true,
    },
    {
        slug: "villa-sunset",
        name: "Villa Sunset",
        images: [
            "/images/central.jpg",
            "/images/affordable.jpg",
            "/images/seaview.jpg",
        ],
        features: ["Merkezi Konum", "Özel Havuz", "Bahçe"],
        nightlyPrice: "₺8.500",
        totalPrice: "₺42.500",
        dateRange: "20 Nis - 25 Nis",
        beds: 4,
        guests: 6,
        maxDiscount: 5,
        cheapestVilla: true,
    },
    {
        slug: "villa-paradise",
        name: "Villa Paradise",
        images: [
            "/images/kidpool.jpg",
            "/images/luxury.jpg",
            "/images/beach.jpg",
        ],
        features: ["Çocuk Havuzu", "Özel Havuz", "Bahçe"],
        nightlyPrice: "₺11.000",
        totalPrice: "₺55.000",
        dateRange: "15 Haz - 20 Haz",
        beds: 5,
        guests: 8,
        maxDiscount: 15,
        cheapestVilla: true,
    },
    {
        slug: "villa-azure",
        name: "Villa Azure",
        images: [
            "/images/affordable.jpg",
            "/images/natureview.jpg",
            "/images/honey.jpg",
        ],
        features: ["Denize Yakın", "Özel Havuz", "Teras"],
        nightlyPrice: "₺6.500",
        totalPrice: "₺32.500",
        dateRange: "01 Nis - 06 Nis",
        beds: 3,
        guests: 4,
        maxDiscount: 7,
        cheapestVilla: true,
    },
];

/* ─── Single Villa Card ─── */
function VillaCard({ villa }: { villa: Villa }) {
    const [imgIndex, setImgIndex] = useState(0);
    const [imgAnim, setImgAnim] = useState(false);

    const prevImage = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setImgAnim(true);
            setImgIndex((p) => (p === 0 ? villa.images.length - 1 : p - 1));
            setTimeout(() => setImgAnim(false), 200);
        },
        [villa.images.length]
    );

    const nextImage = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setImgAnim(true);
            setImgIndex((p) => (p === villa.images.length - 1 ? 0 : p + 1));
            setTimeout(() => setImgAnim(false), 200);
        },
        [villa.images.length]
    );

    return (
        <div className="fwidth resultVillasMain" style={{ position: "relative" }}>
            {/* Image carousel arrows */}
            <img
                onClick={prevImage}
                className="bhs villaArrow villaArrowLeft"
                src="/images/cfo.png"
                style={{
                    height: 80,
                    position: "absolute",
                    left: 0,
                    transform: "scaleX(-1)",
                    padding: 12,
                    zIndex: 111,
                }}
                alt="Previous"
            />
            <img
                onClick={nextImage}
                className="bhs villaArrow villaArrowRight"
                src="/images/cfo.png"
                style={{
                    height: 80,
                    position: "absolute",
                    right: 0,
                    padding: 12,
                    zIndex: 111,
                }}
                alt="Next"
            />

            <Link href={`/tatilvillasi/${villa.slug}`}>
                {/* Discount badge */}
                {villa.maxDiscount > 0 && (
                    <div
                        className="dm-sans"
                        style={{
                            zIndex: 10,
                            color: "#fff",
                            padding: "5px 9px",
                            borderRadius: 8,
                            position: "absolute",
                            left: 16,
                            top: 16,
                            background: "#50b0f0",
                            fontSize: 14,
                        }}
                    >
                        %{villa.maxDiscount} e varan indirim
                    </div>
                )}

                {/* Cheapest guarantee badge */}
                {villa.cheapestVilla && (
                    <div
                        style={{
                            zIndex: 10,
                            color: "#fff",
                            padding: "5px 9px",
                            borderRadius: 8,
                            position: "absolute",
                            left: 16,
                            top: villa.maxDiscount > 0 ? 50 : 16,
                            background: "#EDBA19",
                            fontSize: 14,
                        }}
                    >
                        En Uygun Fiyat Garantisi
                    </div>
                )}

                <div className="mainVillaBubble">
                    {/* Villa image */}
                    <div
                        style={{
                            position: "relative",
                            width: "100%",
                            overflow: "hidden",
                            borderRadius: "8px 8px 0 0",
                        }}
                    >
                        <img
                            className="resultVillasMainIm"
                            src={villa.images[imgIndex]}
                            alt={villa.name}
                            style={{
                                opacity: imgAnim ? 0.7 : 1,
                            }}
                        />
                    </div>

                    {/* Villa info */}
                    <div className="dm-sans" style={{ padding: "2px 16px 0" }}>
                        {/* Villa name */}
                        <div
                            className="poppins middleft mainVillaName skiptranslate"
                            style={{}}
                        >
                            <div className="oneLine">{villa.name}</div>
                        </div>

                        {/* Features */}
                        <div className="oneLine dm-sans mainVillaBubbleFeatures">
                            <div className="oneLine dm-sans">
                                {villa.features.map((f, i) => (
                                    <span key={i}>• {f} &nbsp; </span>
                                ))}
                            </div>
                        </div>

                        {/* Prices */}
                        <div className="mainPricesContainer">
                            <div>
                                {/* Nightly price */}
                                <div className="mainNightlyPrice">
                                    <span className="mainNightlyPriceBold poppins">
                                        {villa.nightlyPrice}
                                    </span>{" "}
                                    / Gece
                                </div>

                                {/* Date range & reserve badge */}
                                <div className="middleft">
                                    <div className="mainNightsCount">
                                        <span>
                                            <span style={{ fontSize: 14 }}>{villa.dateRange}</span>
                                        </span>
                                    </div>
                                    <span
                                        style={{
                                            marginTop: 6,
                                            fontSize: 13,
                                            padding: "1px 6px",
                                            background: "#0cbc871a",
                                            color: "#0cbc87",
                                        }}
                                    >
                                        <img
                                            src="/images/checkBub.png"
                                            style={{ height: 10 }}
                                            alt=""
                                        />{" "}
                                        Rezerve Edilebilir
                                    </span>
                                </div>

                                {/* Total price */}
                                <div className="mainVillasTotal">
                                    <div>
                                        <span>
                                            <span style={{ fontWeight: 600, fontSize: 16 }}>
                                                {villa.totalPrice}
                                            </span>
                                        </span>{" "}
                                        · Toplam
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Beds & Guests footer */}
                        <div
                            className="middle"
                            style={{
                                borderTop: "1px solid #eee",
                                paddingTop: 10,
                                marginTop: 12,
                                fontSize: 13,
                                fontWeight: 500,
                            }}
                        >
                            <img
                                src="/images/bed.svg"
                                style={{ display: "inline-block", height: 12, marginRight: 7 }}
                                alt="Beds"
                            />
                            {villa.beds}
                            <img
                                src="/images/people.svg"
                                style={{
                                    marginLeft: 20,
                                    display: "inline-block",
                                    height: 13,
                                    marginRight: 7,
                                }}
                                alt="Guests"
                            />
                            {villa.guests} Kişi
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

/* ─── Featured Villas Section ─── */
export default function FeaturedVillasSection() {
    return (
        <div className="mainVillasCont">
            <div className="middlebt paddingMobile">
                <h2 className="titleMain">Öne Çıkan Villalar</h2>
            </div>

            <div className="row paddingMobile villaContRow">
                {MOCK_VILLAS.map((villa) => (
                    <VillaCard key={villa.slug} villa={villa} />
                ))}
            </div>
        </div>
    );
}
