"use client";

import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { filterAndSortByCapacity } from "@/lib/capacityFilter";
import { useCurrency } from "@/context/CurrencyContext";

/* ─── Location filter map ─── */
const locationsList: Record<string, string> = {
    kalkanMerkez: "Kalkan Merkez",
    kalkanKoyler: "Kalkan Köyler",
    kasMerkez: "Kaş Merkez",
    kasKoyler: "Kaş Köyler",
};

/* ─── Villa type ─── */
interface DiscountVilla {
    id: string;
    slug: string;
    name: string;
    cover_image_url: string;
    images: string[];
    max_guests: number;
    bedrooms: number;
    bathrooms: number;
    location_label: string;
    max_discount_pct: number;
    min_price: number;
    features: string[];
    destination_slug?: string;
    price_periods?: {
        label: string;
        discount_pct: number;
        nightly_price: number;
        original_price: number;
        start_date: string;
        end_date: string;
    }[];
}

/* ─── Image component with touch swipe ─── */
function DiscountVillaImage({ images, slideIndex, name }: { images: string[]; slideIndex: number; name: string }) {
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const [localIndex, setLocalIndex] = useState(slideIndex);

    // Sync with parent slideIndex
    useEffect(() => { setLocalIndex(slideIndex); }, [slideIndex]);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartX.current = e.changedTouches[0].screenX;
    }, []);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        touchEndX.current = e.changedTouches[0].screenX;
        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > 40) {
            if (diff > 0) setLocalIndex((p) => (p === images.length - 1 ? 0 : p + 1));
            else setLocalIndex((p) => (p === 0 ? images.length - 1 : p - 1));
        }
    }, [images.length]);

    const idx = localIndex < images.length ? localIndex : 0;

    return (
        <div
            style={{ position: "relative" }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <img
                src={images[idx]}
                alt={name}
                className="fdheight"
                style={{
                    width: "100%",
                    objectFit: "cover",
                    borderRadius: 8,
                    transition: "opacity 0.25s",
                }}
            />
            {images.length > 1 && (
                <div style={{
                    position: "absolute",
                    bottom: 10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: 5,
                    zIndex: 10,
                }}>
                    {images.slice(0, 5).map((_, i) => (
                        <div key={i} style={{
                            width: i === idx ? 8 : 6,
                            height: i === idx ? 8 : 6,
                            borderRadius: "50%",
                            background: i === idx ? "#fff" : "rgba(255,255,255,0.55)",
                            transition: "all 0.2s",
                        }} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function IndirimliVillalarPage() {
    const [villas, setVillas] = useState<DiscountVilla[]>([]);
    const [loading, setLoading] = useState(true);
    const [locationFilter, setLocationFilter] = useState("");
    const [peopleFilter, setPeopleFilter] = useState(0);
    const [dropOpen, setDropOpen] = useState(false);
    const [slideIndices, setSlideIndices] = useState<Record<string, number>>({});
    const { formatPrice } = useCurrency();

    /* ─── Fetch discounted villas from Supabase ─── */
    useEffect(() => {
        async function fetchDiscountVillas() {
            setLoading(true);
            const { data, error } = await supabase
                .from("villas")
                .select(`
                    id, slug, name, cover_image_url, max_guests,
                    bedrooms, bathrooms, location_label,
                    max_discount_pct, min_price,
                    destination:destinations(slug),
                    villa_features(feature:features(label_tr)),
                    villa_price_periods(label, discount_pct, nightly_price, original_price, start_date, end_date),
                    villa_images(url, sort_order)
                `)
                .eq("is_published", true)
                .order("sort_order", { ascending: true });

            if (!error && data) {
                const mapped: DiscountVilla[] = data.map((v: any) => {
                    const cover = v.cover_image_url || "/images/placeholder.jpg";
                    const galleryImages = (v.villa_images || [])
                        .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
                        .map((img: any) => img.url)
                        .filter(Boolean);
                    const allImages = galleryImages.length > 0 ? [cover, ...galleryImages.filter((u: string) => u !== cover)] : [cover];
                    return {
                        id: v.id,
                        slug: v.slug,
                        name: v.name,
                        cover_image_url: cover,
                        images: allImages,
                        max_guests: v.max_guests || 0,
                        bedrooms: v.bedrooms || 0,
                        bathrooms: v.bathrooms || 0,
                        location_label: v.location_label || "",
                        max_discount_pct: v.max_discount_pct || 0,
                        min_price: v.min_price || 0,
                        features: (v.villa_features || []).map((vf: any) => vf.feature?.label_tr).filter(Boolean),
                        destination_slug: v.destination?.slug || "",
                        price_periods: (v.villa_price_periods || [])
                            .filter((pp: any) => (pp.discount_pct > 0 || (pp.original_price && pp.original_price > pp.nightly_price)) && new Date(pp.end_date) > new Date())
                            .map((pp: any) => {
                                const effectiveDiscount = pp.discount_pct > 0
                                    ? pp.discount_pct
                                    : pp.original_price
                                        ? Math.round((1 - pp.nightly_price / pp.original_price) * 100)
                                        : 0;
                                return {
                                    label: pp.label,
                                    discount_pct: effectiveDiscount,
                                    nightly_price: pp.nightly_price,
                                    original_price: pp.original_price || pp.nightly_price,
                                    start_date: pp.start_date,
                                    end_date: pp.end_date,
                                };
                            }),
                    };
                });
                setVillas(mapped.filter(v => v.price_periods && v.price_periods.length > 0));
            }
            setLoading(false);
        }
        fetchDiscountVillas();
    }, []);

    /* ─── Filter logic ─── */
    const filteredVillas = useMemo(() => {
        let result = villas;

        // Location filter
        if (locationFilter && locationFilter !== "Hepsi") {
            const label = locationsList[locationFilter];
            if (label) {
                result = result.filter(
                    (v) => v.location_label?.toLowerCase().includes(label.toLowerCase())
                );
            }
        }

        // People filter + sort by capacity priority
        if (peopleFilter > 0) {
            result = filterAndSortByCapacity(result, peopleFilter, (v) => v.max_guests);
        }

        return result;
    }, [villas, locationFilter, peopleFilter]);

    /* ─── Clear all ─── */
    const clearAllFilters = () => {
        setLocationFilter("");
        setPeopleFilter(0);
        setDropOpen(false);
    };

    /* ─── Image slider helpers ─── */
    const getSlideIndex = (id: string) => slideIndices[id] || 0;
    const slidePrev = (id: string, total: number) => {
        setSlideIndices((prev) => ({ ...prev, [id]: (prev[id] || 0) === 0 ? total - 1 : (prev[id] || 0) - 1 }));
    };
    const slideNext = (id: string, total: number) => {
        setSlideIndices((prev) => ({ ...prev, [id]: ((prev[id] || 0) + 1) % total }));
    };

    /* ─── People +/- ─── */
    const peopleMinus = () => setPeopleFilter((p) => (p > 1 ? p - 1 : 0));
    const peoplePlus = () => setPeopleFilter((p) => (p < 20 ? p + 1 : p));

    return (
        <div style={{ minHeight: 1000 }}>
            <div style={{ background: "#fff" }}>
                {/* ─── Filter bar ─── */}
                <div className="prmoBasicFilterC paddingMobile">
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            width: "100%",
                            overflowX: "auto",
                            paddingBottom: 4,
                            msOverflowStyle: "none",
                            scrollbarWidth: "none",
                        }}
                    >
                        {/* Location dropdown (Hidden on mobile via no1023) */}
                        <div className="no1023" style={{ position: "relative", minWidth: 160 }}>
                            <div
                                onClick={() => setDropOpen(!dropOpen)}
                                style={{
                                    textAlign: "center",
                                    border: "1px solid #dfdfe3",
                                    height: 48,
                                    padding: "12px",
                                    borderRadius: 8,
                                    background: "#fff",
                                    cursor: "pointer",
                                }}
                                className="oneLine bhsbg dm-sans"
                            >
                                {locationFilter && locationFilter !== "Hepsi" ? (
                                    <span style={{ color: "#747579", fontSize: 16, fontWeight: 500 }}>
                                        {locationsList[locationFilter]}
                                    </span>
                                ) : (
                                    <span style={{ color: "#000", fontSize: 16, fontWeight: 600 }}>
                                        Konum Seçimi
                                    </span>
                                )}
                            </div>
                            {locationFilter && locationFilter !== "Hepsi" && (
                                <img
                                    onClick={() => { setLocationFilter(""); setDropOpen(false); }}
                                    className="bhsbg"
                                    src="/images/close.svg"
                                    style={{
                                        position: "absolute", right: 8, top: 10,
                                        opacity: 0.8, height: 28, width: 28,
                                        borderRadius: "50%", padding: 8, cursor: "pointer",
                                    }}
                                    alt=""
                                />
                            )}
                            {/* Dropdown */}
                            {dropOpen && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 54,
                                        left: 0,
                                        width: "100%",
                                        minWidth: 200,
                                        background: "#fff",
                                        border: "1px solid #dfdfe3",
                                        borderRadius: 12,
                                        boxShadow: "0 4px 16px rgba(0,0,0,.1)",
                                        zIndex: 100,
                                        padding: 8,
                                    }}
                                >
                                    {[{ key: "Hepsi", label: "Tümü" }, ...Object.entries(locationsList).map(([k, v]) => ({ key: k, label: v }))].map((loc) => (
                                        <div
                                            key={loc.key}
                                            onClick={() => {
                                                setLocationFilter(loc.key);
                                                setDropOpen(false);
                                            }}
                                            style={{
                                                padding: 12,
                                                borderRadius: 8,
                                                fontSize: 16,
                                                fontWeight: 500,
                                                cursor: "pointer",
                                            }}
                                            className="bhsbg middleft"
                                        >
                                            {loc.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Date select placeholder */}
                        <div style={{ position: "relative", flex: "1 1 auto" }}>
                            <div
                                className="middle bhsbg dm-sans"
                                style={{
                                    background: "#fff",
                                    cursor: "pointer",
                                    border: "1px solid #dfdfe3",
                                    height: 48,
                                    borderRadius: 10,
                                    padding: "0 6px",
                                }}
                            >
                                <div style={{ color: "#000", fontWeight: 600, fontSize: 12, textAlign: "left", lineHeight: 1.1 }}>
                                    Tarih<br />Seçimi
                                </div>
                            </div>
                        </div>

                        {/* People select */}
                        <div style={{ position: "relative", flex: "1 1 auto" }}>
                            <div
                                className="middle dm-sans"
                                style={{
                                    border: "1px solid #dfdfe3",
                                    height: 48,
                                    borderRadius: 10,
                                    padding: "0 6px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    background: "#fff"
                                }}
                            >
                                <div className="dm-sans" style={{ color: "#000", fontWeight: 600, fontSize: 12, textAlign: "left", lineHeight: 1.1 }}>
                                    Kişi<br />Sayısı
                                </div>
                                <div className="middle" style={{ marginLeft: 6, display: "flex", alignItems: "center" }}>
                                    <div
                                        onClick={peopleMinus}
                                        style={{
                                            fontSize: 20,
                                            border: "1px solid #dfdfe3aa",
                                            borderRadius: "50%",
                                            width: 24,
                                            height: 24,
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            background: "#fdfdfd"
                                        }}
                                        className="bhs"
                                    >
                                        −
                                    </div>
                                    <div
                                        style={{
                                            margin: "0 4px",
                                            fontSize: peopleFilter === 0 ? 11 : 14,
                                            fontWeight: 500,
                                            color: "#333",
                                            minWidth: 32,
                                            textAlign: "center"
                                        }}
                                        className="middle"
                                    >
                                        {peopleFilter === 0 ? "Tümü" : peopleFilter}
                                    </div>
                                    <div
                                        onClick={peoplePlus}
                                        style={{
                                            fontSize: 20,
                                            border: "1px solid #dfdfe3aa",
                                            borderRadius: "50%",
                                            width: 24,
                                            height: 24,
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            background: "#fdfdfd"
                                        }}
                                        className="bhs"
                                    >
                                        +
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="middle" style={{ flex: "0 0 auto", gap: 6 }}>
                            <div
                                onClick={clearAllFilters}
                                className="middle bhs"
                                style={{
                                    cursor: "pointer",
                                    border: "1px solid #dfdfe3",
                                    background: "#fff",
                                    height: 48,
                                    padding: "0 10px",
                                    borderRadius: 10,
                                    fontWeight: 600,
                                    fontSize: 13,
                                    color: "#000"
                                }}
                            >
                                Sıfırla
                            </div>
                            <div
                                className="middle bhs"
                                style={{
                                    cursor: "pointer",
                                    background: "#333",
                                    color: "#fff",
                                    height: 48,
                                    padding: "0 10px",
                                    borderRadius: 10,
                                    fontWeight: 600,
                                    fontSize: 13
                                }}
                            >
                                ARA{" "}
                                <img
                                    src="/images/search3w.png"
                                    style={{ marginLeft: 4, width: 14 }}
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── Title section ─── */}
                <div className="indirimliTopMargin">
                    <div className="middleft paddingMobile">
                        <h2 style={{ fontWeight: 600, marginTop: 0, marginBottom: 4 }}>
                            İndirimli Villalar
                        </h2>
                        <span
                            style={{
                                marginLeft: 6,
                                marginBottom: 5,
                                fontWeight: 300,
                                fontSize: 13,
                                color: "#745579",
                            }}
                        >
                            ( {filteredVillas.length} )
                        </span>
                    </div>
                    {peopleFilter > 0 && (
                        <div className="middleft paddingMobile">
                            <div
                                className="bhs"
                                style={{
                                    border: "1px solid #dfdfe3aa",
                                    background: "#ebeef5aa",
                                    padding: "4px 10px",
                                    borderRadius: 8,
                                    color: "#747579",
                                    fontSize: 14,
                                    fontWeight: 500,
                                }}
                            >
                                {peopleFilter} - {peopleFilter + 1} Kişilik Villalar
                                Gösteriliyor
                            </div>
                        </div>
                    )}
                </div>

                {/* ─── Villa Grid ─── */}
                <div className="paddingMobile">
                    {/* Loading skeleton */}
                    {loading && (
                        <div className="row indirimliCont">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="fdwidth">
                                    <div style={{ padding: 8 }}>
                                        <div
                                            className="fdheight"
                                            style={{
                                                width: "100%",
                                                marginTop: 0,
                                                borderRadius: 12,
                                                background: "#e0e0e0",
                                                animation: "pulse 1.5s ease-in-out infinite",
                                            }}
                                        />
                                    </div>
                                    <div style={{ padding: "0 16px 8px" }}>
                                        <div
                                            style={{
                                                width: 45,
                                                height: 26,
                                                borderRadius: 6,
                                                background: "#e0e0e0",
                                                marginTop: 0,
                                            }}
                                        />
                                        <div
                                            style={{
                                                width: 160,
                                                height: 27,
                                                borderRadius: 6,
                                                background: "#e0e0e0",
                                                marginTop: 15,
                                            }}
                                        />
                                        <div
                                            style={{
                                                width: 120,
                                                height: 19,
                                                borderRadius: 6,
                                                background: "#e0e0e0",
                                                marginTop: 10,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Villa cards */}
                    {!loading && (
                        <div className="row indirimliCont">
                            {filteredVillas.map((villa) => (
                                <div key={villa.id} className="fdwidth">
                                    <Link href={`/tatilvillasi/${villa.slug}`}>
                                        <div style={{ padding: 8, position: "relative" }}>
                                            {/* Arrows */}
                                            {villa.images.length > 1 && (
                                                <>
                                                    <img
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); slidePrev(villa.id, villa.images.length); }}
                                                        className="bhs villaArrow villaArrowLeft"
                                                        src="/images/cfo.png"
                                                        style={{
                                                            height: 60,
                                                            position: "absolute",
                                                            left: 8,
                                                            top: "50%",
                                                            transform: "translateY(-50%) scaleX(-1)",
                                                            padding: 10,
                                                            zIndex: 11,
                                                        }}
                                                        alt="Prev"
                                                    />
                                                    <img
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); slideNext(villa.id, villa.images.length); }}
                                                        className="bhs villaArrow villaArrowRight"
                                                        src="/images/cfo.png"
                                                        style={{
                                                            height: 60,
                                                            position: "absolute",
                                                            right: 8,
                                                            top: "50%",
                                                            transform: "translateY(-50%)",
                                                            padding: 10,
                                                            zIndex: 11,
                                                        }}
                                                        alt="Next"
                                                    />
                                                </>
                                            )}
                                            <DiscountVillaImage
                                                images={villa.images}
                                                slideIndex={getSlideIndex(villa.id)}
                                                name={villa.name}
                                            />
                                        </div>
                                        <div style={{ padding: "0 16px 6px", width: "100%" }}>
                                            <div className="middleft">
                                                <img
                                                    src="/images/heart.png"
                                                    style={{
                                                        marginLeft: "auto",
                                                        height: 26,
                                                        width: 26,
                                                        objectFit: "contain",
                                                        padding: 4,
                                                        borderRadius: 4,
                                                    }}
                                                    className="bhbhbg"
                                                    alt=""
                                                />
                                            </div>
                                            <div
                                                style={{ fontSize: 21 }}
                                                className="poppins"
                                            >
                                                {villa.name}
                                            </div>
                                            <div
                                                className="oneLine"
                                                style={{
                                                    width: "100%",
                                                    fontSize: 16,
                                                    marginTop: 8,
                                                }}
                                            >
                                                {villa.features.slice(0, 4).map((feat, i) => (
                                                    <span
                                                        key={i}
                                                        style={{
                                                            marginRight: 8,
                                                            color: "#747579",
                                                            fontWeight: 300,
                                                        }}
                                                    >
                                                        &bull; {feat}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Price blocks with discounts */}
                                        <div style={{ padding: 8, fontWeight: 400, fontSize: 14 }}>
                                            <div
                                                style={{
                                                    borderRadius: "0 0 12px 12px",
                                                    maxHeight: 105,
                                                    overflow: "hidden",
                                                    position: "relative",
                                                }}
                                            >
                                                {villa.price_periods?.map((pp, i) => (
                                                    <div
                                                        key={i}
                                                        className="middle"
                                                        style={{
                                                            padding: 4,
                                                            borderTop: "1px solid #dfdfe3aa",
                                                        }}
                                                    >
                                                        <div
                                                            style={{ width: "50%" }}
                                                            className="middleft"
                                                        >
                                                            <div
                                                                className="oneLine"
                                                                style={{
                                                                    color: "#433754aa",
                                                                    borderRadius: 8,
                                                                    padding: "4px 2px 4px 12px",
                                                                }}
                                                            >
                                                                {pp.label}
                                                            </div>
                                                        </div>
                                                        <div
                                                            style={{ width: "24%" }}
                                                            className="middlert"
                                                        >
                                                            <div
                                                                style={{
                                                                    background: "#e83e8c1a",
                                                                    color: "#e83e8c",
                                                                    borderRadius: 8,
                                                                    padding: "4px 12px",
                                                                }}
                                                            >
                                                                {pp.discount_pct}%
                                                            </div>
                                                        </div>
                                                        <div
                                                            style={{
                                                                width: "26%",
                                                                marginLeft: 4,
                                                            }}
                                                            className="middleft"
                                                        >
                                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                                                {pp.original_price && pp.original_price > pp.nightly_price && (
                                                                    <span style={{ textDecoration: "line-through", color: "#bbb", fontSize: 12, lineHeight: 1.2 }}>
                                                                        {formatPrice(pp.original_price)}
                                                                    </span>
                                                                )}
                                                                <div
                                                                    style={{
                                                                        background: "#eeeeeeaa",
                                                                        color: "#555",
                                                                        borderRadius: 8,
                                                                        padding: "4px 12px",
                                                                        fontWeight: 600,
                                                                    }}
                                                                >
                                                                    {formatPrice(pp.nightly_price || 0)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* No results */}
                    {!loading && filteredVillas.length === 0 && (
                        <div className="middle" style={{ padding: "60px 0", color: "#999" }}>
                            İndirimli villa bulunamadı.
                        </div>
                    )}
                </div>

                {/* ─── Bottom CTA ─── */}
                <div
                    className="middle paddingMobile"
                    style={{ width: "100%", marginTop: 88, marginBottom: 32 }}
                >
                    <div
                        style={{
                            overflow: "hidden",
                            textAlign: "center",
                            border: "2px solid #ebeef58a",
                            background: "#ebeef51a",
                            zIndex: 2,
                            position: "relative",
                            padding: "48px 48px 0px",
                            borderRadius: 40,
                        }}
                    >
                        <Link href="/villa-kategorileri">
                            <div
                                style={{
                                    width: "100%",
                                    fontSize: 16,
                                    fontWeight: 400,
                                    color: "#222",
                                }}
                            >
                                Daha fazla villa görüntülemek için{" "}
                                <strong>tıklayın</strong>
                            </div>
                        </Link>
                        <div className="middle">
                            <div
                                style={{
                                    marginTop: 22,
                                    paddingTop: 20,
                                    borderTop: "1px solid #ddd",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: 17,
                                        fontWeight: 500,
                                        color: "#333",
                                    }}
                                >
                                    Aradığınız Villa için En Uygun Teklifi Alın
                                    <br />
                                    Bize Ulaşın
                                </div>
                                <div
                                    className="middle"
                                    style={{ marginTop: 16, paddingBottom: 40 }}
                                >
                                    <Link href="/iletisim">
                                        <div
                                            style={{
                                                background: "#50b0f0",
                                                padding: "12px 25px",
                                                borderRadius: 32,
                                                color: "#fff",
                                                fontWeight: 600,
                                            }}
                                        >
                                            İletişim
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <img
                                src="/images/17.svg"
                                style={{
                                    position: "absolute",
                                    marginLeft: "10%",
                                    right: 0,
                                    bottom: -10,
                                    width: 96,
                                    height: 96,
                                }}
                                alt=""
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
