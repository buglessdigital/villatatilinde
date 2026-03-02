"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getFeaturedVillas } from "@/lib/queries";
import type { VillaCard as VillaCardType } from "@/lib/types";

interface VillaView {
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

function mapVillaToView(v: VillaCardType): VillaView {
    const nightlyPrice = v.min_price
        ? `₺${Number(v.min_price).toLocaleString("tr-TR")}`
        : "₺0";
    const totalPrice = v.min_price
        ? `₺${(Number(v.min_price) * 5).toLocaleString("tr-TR")}`
        : "₺0";
    return {
        slug: v.slug,
        name: v.name,
        images: v.images.length > 0 ? v.images : [v.cover_image_url || "/images/natureview.jpg"],
        features: v.features.slice(0, 3),
        nightlyPrice,
        totalPrice,
        dateRange: "5 Gece",
        beds: v.bedrooms,
        guests: v.max_guests,
        maxDiscount: v.max_discount_pct || 0,
        cheapestVilla: true,
    };
}

/* ─── Single Villa Card ─── */
function VillaCard({ villa }: { villa: VillaView }) {
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
    const [villas, setVillas] = useState<VillaView[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getFeaturedVillas();
                setVillas(data.map(mapVillaToView));
            } catch (err) {
                console.error('Öne çıkan villalar yüklenemedi:', err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    return (
        <div className="mainVillasCont">
            <div className="middlebt paddingMobile">
                <h2 className="titleMain">Öne Çıkan Villalar</h2>
            </div>

            {loading && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                    Villalar yükleniyor...
                </div>
            )}

            <div className="row paddingMobile villaContRow">
                {!loading && villas.map((villa) => (
                    <VillaCard key={villa.slug} villa={villa} />
                ))}
            </div>
        </div>
    );
}
