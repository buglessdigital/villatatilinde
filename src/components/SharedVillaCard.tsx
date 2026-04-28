"use client";

import React, { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";

const FEATURE_LABELS: Record<string, string> = {
    privatePool: "Özel Havuz", infinityPool: "Sonsuzluk Havuzu",
    isolatedPoolVillas: "Muhafazakar Havuz", indoorPool: "Kapalı Havuz",
    heatedPool: "Isıtmalı Havuz", kidPoolVillas: "Çocuk Havuzu",
    jacuzziVillas: "Jakuzi", gymRoom: "Spor Odası", sauna: "Sauna",
    hamam: "Hamam", cinemaRoom: "Sinema Odası", winterGarden: "Kış Bahçesi",
    tennisTable: "Masa Tenisi", poolTable: "Bilardo Masası",
    kitchen: "Mutfak", enSuite: "Ebeveyn Banyosu", balcony: "Balkon",
    gardenLounge: "Bahçe Mobilyası", sunbedUmbrella: "Şezlong",
    airConditioning: "Klima", wifi: "WiFi", smartTv: "Akıllı TV",
    fridge: "Buzdolabı", washingMac: "Çamaşır Mak.", dryingMac: "Kurutma Mak.",
    dishWasher: "Bulaşık Mak.", oven: "Fırın", iron: "Ütü",
    floorHeating: "Yerden Isıtma", honeyMoon: "Balayı Villası",
    affordableVillas: "Ekonomik", ultraLux: "Ultra Lüks",
    centralVillas: "Merkezi Konum", seaview: "Deniz Manzarası",
    beachVillas: "Denize Yakın", natureview: "Doğa Manzarası",
    isolatedVillas: "Muhafazakar", childPool: "Çocuk Havuzu",
};

export interface VillaView {
    slug: string;
    name: string;
    images: string[];
    features: string[];
    nightlyPrice: number;
    totalPrice: number;
    currency?: string; // Villa'nın para birimi: "TRY", "GBP", "EUR" vs.
    dateRange?: string;
    beds: number;
    guests: number;
    bathrooms: number;
    maxDiscount: number;
    cheapestVilla: boolean;
    promotionDiscountText?: string;
    promotionDescription?: string;
}

export default function SharedVillaCard({ villa, className }: { villa: VillaView, className?: string }) {
    const [imgIndex, setImgIndex] = useState(0);
    const [imgAnim, setImgAnim] = useState(false);
    const { formatVillaCurrencyPrice } = useCurrency();
    const fmt = (amount: number) => formatVillaCurrencyPrice(amount, villa.currency);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const prevImage = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (villa.images.length <= 1) return;
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
            if (villa.images.length <= 1) return;
            setImgAnim(true);
            setImgIndex((p) => (p === villa.images.length - 1 ? 0 : p + 1));
            setTimeout(() => setImgAnim(false), 200);
        },
        [villa.images.length]
    );

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartX.current = e.changedTouches[0].screenX;
    }, []);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        touchEndX.current = e.changedTouches[0].screenX;
        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > 40) {
            if (diff > 0) {
                // swipe left → next
                if (villa.images.length <= 1) return;
                setImgAnim(true);
                setImgIndex((p) => (p === villa.images.length - 1 ? 0 : p + 1));
                setTimeout(() => setImgAnim(false), 200);
            } else {
                // swipe right → prev
                if (villa.images.length <= 1) return;
                setImgAnim(true);
                setImgIndex((p) => (p === 0 ? villa.images.length - 1 : p - 1));
                setTimeout(() => setImgAnim(false), 200);
            }
        }
    }, [villa.images.length]);

    return (
        <div className={`resultVillasMain ${className || "fwidth"}`} style={{ position: "relative" }}>
            {/* Image carousel arrows */}
            {villa.images.length > 1 && (
                <>
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
                </>
            )}

            <Link href={`/tatilvillasi/${villa.slug}`}>
                {/* Discount badge */}
                {villa.maxDiscount > 0 ? (
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
                        %{villa.maxDiscount}'e varan indirim
                    </div>
                ) : villa.promotionDiscountText ? (
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
                        {villa.promotionDiscountText}
                    </div>
                ) : null}

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
                            top: (villa.maxDiscount > 0 || villa.promotionDiscountText) ? 50 : 16,
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
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        {villa.images[imgIndex] ? (
                            <img
                                className="resultVillasMainIm"
                                src={villa.images[imgIndex]}
                                alt={villa.name}
                                style={{
                                    opacity: imgAnim ? 0.7 : 1,
                                }}
                            />
                        ) : (
                            <div className="resultVillasMainIm" style={{ background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 14 }}>
                                Görsel Yok
                            </div>
                        )}
                        {/* Image dots indicator */}
                        {villa.images.length > 1 && (
                            <div style={{
                                position: "absolute",
                                bottom: 8,
                                left: "50%",
                                transform: "translateX(-50%)",
                                display: "flex",
                                gap: 5,
                                zIndex: 10,
                            }}>
                                {villa.images.slice(0, 5).map((_, i) => (
                                    <div key={i} style={{
                                        width: i === imgIndex ? 8 : 6,
                                        height: i === imgIndex ? 8 : 6,
                                        borderRadius: "50%",
                                        background: i === imgIndex ? "#fff" : "rgba(255,255,255,0.55)",
                                        transition: "all 0.2s",
                                    }} />
                                ))}
                            </div>
                        )}
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

                        {/* Features or Promos */}
                        {villa.promotionDescription ? (
                            <div className="oneLine dm-sans mainVillaBubbleFeatures" style={{ color: "#0cbc87", fontWeight: 500 }}>
                                {villa.promotionDescription}
                            </div>
                        ) : (
                            <div className="oneLine dm-sans mainVillaBubbleFeatures">
                                <div className="oneLine dm-sans">
                                    {villa.features.map((f, i) => (
                                        <span key={i}>• {FEATURE_LABELS[f] ?? f} &nbsp; </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Prices */}
                        <div className="mainPricesContainer">
                            <div>
                                {/* Nightly price */}
                                <div className="mainNightlyPrice">
                                    {villa.nightlyPrice > 0 ? (
                                        <>
                                            <span className="mainNightlyPriceBold poppins">
                                                {fmt(villa.nightlyPrice)}
                                            </span>{" "}
                                            / Gece
                                        </>
                                    ) : (
                                        <span className="mainNightlyPriceBold poppins" style={{fontSize:16}}>Fiyat Sorunuz</span>
                                    )}
                                </div>

                                {/* Date range & reserve badge */}
                                <div className="middleft">
                                    {villa.dateRange && (
                                        <div className="mainNightsCount">
                                            <span>
                                                <span style={{ fontSize: 14 }}>{villa.dateRange}</span>
                                            </span>
                                        </div>
                                    )}
                                    <span
                                        style={{
                                            marginTop: 6,
                                            fontSize: 13,
                                            padding: "1px 6px",
                                            background: "#0cbc871a",
                                            color: "#0cbc87",
                                            marginLeft: villa.dateRange ? 0 : 0
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
                                {villa.totalPrice > 0 && (
                                    <div className="mainVillasTotal">
                                        <div>
                                            <span>
                                                <span style={{ fontWeight: 600, fontSize: 16 }}>
                                                    {fmt(villa.totalPrice)}
                                                </span>
                                            </span>{" "}
                                            · Toplam
                                        </div>
                                    </div>
                                )}
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
                                justifyContent: "center",
                            }}
                        >
                            <img
                                src="/images/bed.svg"
                                style={{ display: "inline-block", height: 12, marginRight: 7 }}
                                alt="Beds"
                            />
                            {villa.beds}
                            <img
                                src="/images/bathsolid.svg"
                                style={{
                                    marginLeft: 20,
                                    display: "inline-block",
                                    height: 12,
                                    marginRight: 7,
                                }}
                                alt="Baths"
                            />
                            {villa.bathrooms}
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
