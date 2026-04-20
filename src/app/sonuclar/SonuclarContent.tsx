"use client";

import React, { useState, useEffect, useMemo, useCallback, Suspense, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAllVillasForSearch, getUnavailableVillaIds } from "@/lib/queries";
import type { VillaDetail, DbFeature, DbVillaPricePeriod } from "@/lib/types";
import { filterAndSortByCapacity } from "@/lib/capacityFilter";
import SearchFilterBar from "@/components/SearchFilterBar";
import styles from "./sonuclar.module.css";
import { useCurrency } from "@/context/CurrencyContext";

/* ─── Local Villa interface (matches template expectations) ─── */
interface PriceBlock {
    period: string;
    nightlyPrice: number;
    weeklyPrice: number;
    discount: number;
    minNights: number;
    originalPrice?: number;
}
interface Villa {
    id: string;
    slug: string;
    name: string;
    location: string;
    coverImage: string;
    images: string[];
    guests: number;
    bedrooms: number;
    bathrooms: number;
    minEver: number;
    priceBlocks: PriceBlock[];
    features: string[];
    score: number;
}

function mapVillaDetail(v: VillaDetail): Villa {
    return {
        id: v.id,
        slug: v.slug,
        name: v.name,
        location: v.location_label || '',
        coverImage: v.cover_image_url || '/images/natureview.jpg',
        images: v.images?.length > 0
            ? v.images.map((img: { url: string }) => img.url || v.cover_image_url)
            : [v.cover_image_url || '/images/natureview.jpg'],
        guests: v.max_guests,
        bedrooms: v.bedrooms,
        bathrooms: v.bathrooms || 0,
        minEver: v.min_price || 0,
        priceBlocks: (v.price_periods || []).map((pp: DbVillaPricePeriod) => ({
            period: pp.label,
            nightlyPrice: pp.nightly_price,
            weeklyPrice: pp.weekly_price || pp.nightly_price * 7,
            discount: pp.discount_pct || 0,
            minNights: pp.min_nights,
            originalPrice: pp.original_price || undefined,
        })),
        features: (v.features || [])
            .filter((f: DbFeature) => f.group_type === 'premium')
            .map((f: DbFeature) => f.key || f.label_tr),
        score: v.avg_rating || 0,
    };
}

/* ──────────────── Mapping Objects ──────────────── */
const featuresList: Record<string, string> = {
    affordableVillas: "Ekonomik",
    isolatedVillas: "Muhafazakar",
    honeyMoon: "Balayı",
    ultraLux: "Ultra Lüx",
    centralVillas: "Merkezi",
    beachVillas: "Denize Yakın",
    seaview: "Deniz Manzaralı",
    natureview: "Doğa Manzaralı",
    isolatedPoolVillas: "Havuzu Korunaklı",
    jacuzziVillas: "Jakuzili",
    kidPoolVillas: "Çocuk Havuzlu",
    newVillas: "Yeni Villalar",
    privatePool: "Özel Havuz",
    sharedPool: "Paylaşımlı Havuz",
    infinityPool: "Sonsuzluk Havuzu",
    indoorPool: "Kapalı Havuz",
    heatedPool: "Sıcak Havuz",
    shallowPool: "Sığ Havuz",
    gymRoom: "Spor Odası",
    sauna: "Sauna",
    hamam: "Hamam",
    cinemaRoom: "Sinema Odası",
    winterGarden: "Kış Bahçesi",
    tennisTable: "Tenis Masası",
    poolTable: "Bilardo Masası",
    floorHeating: "Yerden Isıtma",
};

const locationsList: Record<string, string> = {
    "kalkan-merkez": "Kalkan Merkez",
    "kalkan-kalamar": "Kalkan Kalamar",
    "kalkan-komurluk": "Kalkan Kömürlük",
    "kalkan-kisla": "Kalkan Kışla",
    "kalkan-ortaalan": "Kalkan Ortaalan",
    "kalkan-kiziltas": "Kalkan Kızıltaş",
    "kalkan-kaputas": "Kalkan Kaputaş",
    "kalkan-patara": "Kalkan Patara",
    "kalkan-ordu": "Kalkan Ordu",
    "kalkan-ulugol": "Kalkan Ulugöl",
    "kalkan-bezirgan": "Kalkan Bezirgan",
    "kalkan-islamlar": "Kalkan İslamlar",
    "kalkan-kordere": "Kalkan Kördere",
    "kalkan-uzumlu": "Kalkan Üzümlü",
    "kalkan-saribelen": "Kalkan Sarıbelen",
    "kalkan-yesilkoy": "Kalkan Yeşilköy",
    "kalkan-cavdir": "Kalkan Çavdır",
    "kas-merkez": "Kaş Merkez",
    fethiye: "Fethiye",
    belek: "Belek",
};

const locationToFilter: Record<string, string> = {
    "Kalkan Merkez": "kalkan-merkez",
    "Kalkan Kalamar": "kalkan-kalamar",
    "Kalkan / Kalamar": "kalkan-kalamar",
    "Kalkan Kömürlük": "kalkan-komurluk",
    "Kalkan / Kömürlük": "kalkan-komurluk",
    "Kalkan Kışla": "kalkan-kisla",
    "Kalkan / Kışla": "kalkan-kisla",
    "Kalkan Ortaalan": "kalkan-ortaalan",
    "Kalkan / Ortaalan": "kalkan-ortaalan",
    "Kalkan Kızıltaş": "kalkan-kiziltas",
    "Kalkan / Kızıltaş": "kalkan-kiziltas",
    "Kalkan Kaputaş": "kalkan-kaputas",
    "Kalkan / Kaputaş": "kalkan-kaputas",
    "Kalkan Patara": "kalkan-patara",
    "Kalkan / Patara": "kalkan-patara",
    "Kalkan Ordu": "kalkan-ordu",
    "Kalkan / Ordu": "kalkan-ordu",
    "Kalkan Ulugöl": "kalkan-ulugol",
    "Kalkan / Ulugöl": "kalkan-ulugol",
    "Kalkan Bezirgan": "kalkan-bezirgan",
    "Kalkan / Bezirgan": "kalkan-bezirgan",
    "Kalkan İslamlar": "kalkan-islamlar",
    "Kalkan / İslamlar": "kalkan-islamlar",
    "Kalkan Kördere": "kalkan-kordere",
    "Kalkan / Kördere": "kalkan-kordere",
    "Kalkan Üzümlü": "kalkan-uzumlu",
    "Kalkan / Üzümlü": "kalkan-uzumlu",
    "Kalkan Sarıbelen": "kalkan-saribelen",
    "Kalkan / Sarıbelen": "kalkan-saribelen",
    "Kalkan Yeşilköy": "kalkan-yesilkoy",
    "Kalkan / Yeşilköy": "kalkan-yesilkoy",
    "Kalkan Çavdır": "kalkan-cavdir",
    "Kalkan / Çavdır": "kalkan-cavdir",
    "Kaş Merkez": "kas-merkez",
    Fethiye: "fethiye",
    Belek: "belek",
};

const priceRanges: { key: string; label: string; min: number; max: number }[] = [
    { key: "3", label: "₺1.000 - ₺3.000", min: 1000, max: 3000 },
    { key: "10", label: "₺3.000 - ₺10.000", min: 3000, max: 10000 },
    { key: "30", label: "₺10.000 - ₺30.000", min: 10000, max: 30000 },
    { key: "50", label: "₺30.000 - ₺50.000", min: 30000, max: 50000 },
    { key: "51", label: "₺50.000+", min: 50000, max: Infinity },
];

/* ── Location slug normalizer ── */
function toLocSlug(str: string): string {
    return str
        .toLowerCase()
        .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
        .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

const categoryToFeature: Record<string, string> = {
    ekonomik: "affordableVillas",
    muhafazakar: "isolatedVillas",
    balayi: "honeyMoon",
    "ultra-luks": "ultraLux",
    merkezi: "centralVillas",
    "denize-yakin": "beachVillas",
    jakuzili: "jacuzziVillas",
    "cocuk-havuzlu": "kidPoolVillas",
};

/* Feature key → Hero title (with "Villalar" suffix) */
const featuresList2: Record<string, string> = {
    affordableVillas: "Ekonomik Villalar",
    isolatedVillas: "Muhafazakar Villalar",
    honeyMoon: "Balayı Villaları",
    ultraLux: "Ultra Lüx Villalar",
    centralVillas: "Merkezi Villalar",
    beachVillas: "Denize Yakın Villalar",
    seaview: "Deniz Manzaralı Villalar",
    natureview: "Doğa Manzaralı Villalar",
    isolatedPoolVillas: "Havuzu Korunaklı Villalar",
    jacuzziVillas: "Jakuzili Villalar",
    kidPoolVillas: "Çocuk Havuzlu Villalar",
    newVillas: "Yeni Villalar",
    privatePool: "Özel Havuzlu Villalar",
    sharedPool: "Paylaşımlı Havuzlu Villalar",
    infinityPool: "Sonsuzluk Havuzlu Villalar",
    indoorPool: "Kapalı Havuzlu Villalar",
    heatedPool: "Sıcak Havuzlu Villalar",
    shallowPool: "Sığ Havuzlu Villalar",
};

const sortOptions: { key: string; label: string }[] = [
    { key: "order", label: "Standart" },
    { key: "total", label: "Fiyat Artan" },
    { key: "totalrev", label: "Fiyat Azalan" },
    { key: "guest", label: "Kapasite Artan" },
    { key: "guestrev", label: "Kapasite Azalan" },
    { key: "score", label: "Misafir Puanı" },
];

/* ──────── Filter Groups ──────── */
const villaTypeInitial = ["affordableVillas", "isolatedVillas", "honeyMoon", "ultraLux", "centralVillas", "beachVillas"];
const villaTypeExtra = ["seaview", "natureview", "isolatedPoolVillas", "jacuzziVillas", "kidPoolVillas", "newVillas"];
const poolFeatures = ["privatePool", "sharedPool", "infinityPool", "isolatedPoolVillas", "indoorPool", "heatedPool", "shallowPool", "kidPoolVillas"];
const featuredFeatures = ["jacuzziVillas", "gymRoom", "sauna", "hamam", "cinemaRoom", "winterGarden", "tennisTable", "poolTable", "floorHeating"];
const kalkanLocationsInitial = ["kalkan-merkez", "kalkan-kalamar", "kalkan-komurluk", "kalkan-kisla", "kalkan-ortaalan", "kalkan-kiziltas", "kalkan-kaputas"];
const kalkanLocationsExtra = ["kalkan-patara", "kalkan-ordu", "kalkan-ulugol", "kalkan-bezirgan", "kalkan-islamlar", "kalkan-kordere", "kalkan-uzumlu", "kalkan-saribelen", "kalkan-yesilkoy", "kalkan-cavdir"];
const otherLocations = ["kas-merkez", "fethiye", "belek"];

/* ──────── Dynamic Capacity Mapping (shared) ──────── */
// capacityMapping is imported from @/lib/capacityFilter

/* ──────────────── Checkbox Component ──────────────── */
function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
    return (
        <label className={styles.checkboxLabel}>
            <input type="checkbox" checked={checked} onChange={onChange} style={{ display: "none" }} />
            <div className={`${styles.checkboxBox} ${checked ? styles.checkboxBoxChecked : ""}`}>
                {checked && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </div>
            <span className="dm-sans" style={{ fontSize: "14px", color: "#747579" }}>{label}</span>
        </label>
    );
}

/* ──────────────── Villa Card Component ──────────────── */
function VillaCard({
    villa,
    slideIndex,
    onSlidePrev,
    onSlideNext,
    checkIn,
    checkOut,
}: {
    villa: Villa;
    slideIndex: number;
    onSlidePrev: () => void;
    onSlideNext: () => void;
    checkIn?: string;
    checkOut?: string;
}) {
    const [imgAnim, setImgAnim] = useState(false);
    const maxPrice = villa.priceBlocks.length ? Math.max(...villa.priceBlocks.map((p) => p.nightlyPrice)) : villa.minEver;
    const hasDiscount = villa.priceBlocks.some((p) => p.discount && p.discount > 0);
    const maxDiscount = hasDiscount ? Math.max(...villa.priceBlocks.filter((p) => p.discount).map((p) => p.discount!)) : 0;
    const { formatPrice } = useCurrency();
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartX.current = e.changedTouches[0].screenX;
    }, []);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        touchEndX.current = e.changedTouches[0].screenX;
        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > 40) {
            setImgAnim(true);
            if (diff > 0) onSlideNext();
            else onSlidePrev();
            setTimeout(() => setImgAnim(false), 200);
        }
    }, [onSlideNext, onSlidePrev]);

    const handlePrevClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setImgAnim(true);
        onSlidePrev();
        setTimeout(() => setImgAnim(false), 200);
    };

    const handleNextClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setImgAnim(true);
        onSlideNext();
        setTimeout(() => setImgAnim(false), 200);
    };

    return (
        <div className={styles.villaCard}>
            <Link href={`/tatilvillasi/${villa.slug}${checkIn && checkOut ? `?checkIn=${checkIn}&checkOut=${checkOut}` : ""}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div className={styles.cardRow}>
                    {/* Image */}
                    <div
                        className={styles.imageContainer}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        {/* Slider Arrows */}
                        {villa.images.length > 1 && (
                            <>
                                <img
                                    onClick={handlePrevClick}
                                    className={`bhs ${styles.imageArrow} ${styles.imageArrowLeft}`}
                                    src="/images/cfo.png"
                                    alt="Previous"
                                />
                                <img
                                    onClick={handleNextClick}
                                    className={`bhs ${styles.imageArrow} ${styles.imageArrowRight}`}
                                    src="/images/cfo.png"
                                    alt="Next"
                                />
                            </>
                        )}
                        {hasDiscount && (
                            <div className={`${styles.discountBadge} dm-sans`}>%{maxDiscount} e varan indirim</div>
                        )}
                        <Image
                            src={villa.images[slideIndex] || villa.coverImage}
                            alt={villa.name}
                            width={600}
                            height={400}
                            style={{ 
                                width: "100%", 
                                height: "100%", 
                                objectFit: "cover", 
                                transition: "opacity 0.2s",
                                opacity: imgAnim ? 0.7 : 1 
                            }}
                        />
                        {/* Image Dots */}
                        {villa.images.length > 1 && (
                            <div className={styles.imageDots}>
                                {villa.images.slice(0, 5).map((_, i) => (
                                    <div key={i} className={`${styles.dot} ${i === slideIndex ? styles.dotActive : ""}`} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Text */}
                    <div className={styles.textContainer}>
                        <div className="dm-sans" style={{ padding: "16px 12px 16px 24px" }}>
                            {/* Score */}
                            {villa.score > 0 && (
                                <div style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} style={{ color: i < Math.floor(villa.score) ? "#f9a825" : "#ddd", fontSize: "14px", marginRight: "1px" }}>★</span>
                                        ))}
                                    </div>
                                    <div style={{ marginLeft: "6px", fontSize: "13px", fontWeight: 600, color: "#747579" }}>
                                        ( {villa.score} )
                                    </div>
                                </div>
                            )}

                            {/* Name & Location */}
                            <div className="poppins" style={{ fontSize: "20px", fontWeight: 600, marginBottom: "2px" }}>
                                {villa.name},{" "}
                                <span className="dm-sans" style={{ fontSize: "16px", fontWeight: 600 }}>{villa.location}</span>
                            </div>

                            {/* Features preview */}
                            <div className="dm-sans" style={{ fontSize: "13px", color: "#747579", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: "4px" }}>
                                {villa.features.slice(0, 4).map((f) => featuresList[f] || f).join(" • ")}
                            </div>

                                {/* Cancellation removed */}

                            {/* Price */}
                            <div style={{ marginTop: "12px" }}>
                                <div style={{ display: "flex", alignItems: "center", fontSize: "15px" }}>
                                    <span className="poppins" style={{ fontWeight: 700, fontSize: "18px" }}>
                                        {formatPrice(villa.minEver)}-{formatPrice(maxPrice)}
                                    </span>
                                    &nbsp;/ Gece
                                </div>
                                <div style={{ color: "#433544", fontSize: "14px", fontWeight: 500, marginTop: "16px" }}>
                                    {villa.name}&apos;yı en iyi fiyat garantisiyle kiralayın →
                                </div>
                            </div>

                            {/* Beds & Guests */}
                            <div style={{ borderTop: "1px solid #eee", paddingTop: "10px", marginTop: "12px", fontSize: "13px", fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <img
                                    src="/images/bed.svg"
                                    style={{ display: "inline-block", height: 12, marginRight: 7 }}
                                    alt="Beds"
                                />
                                {villa.bedrooms}
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
                </div>
            </Link>
        </div>
    );
}

/* ──────────────── Inner Component (uses useSearchParams) ──────────────── */
function SonuclarInner() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    /* Initialize from URL params */
    const initialFeatures: string[] = [];
    const initialLocations: string[] = [];

    const locParam = searchParams.get("location");
    if (locParam) locParam.split(",").forEach(l => initialLocations.push(l));

    const catParam = searchParams.get("category");
    if (catParam && categoryToFeature[catParam]) initialFeatures.push(categoryToFeature[catParam]);

    const featParam = searchParams.get("features");
    if (featParam) {
        featParam.split(",").forEach((f) => {
            if (featuresList[f]) initialFeatures.push(f);
        });
    }

    const peopleParam = searchParams.get("people");
    const initialPeople = peopleParam ? parseInt(peopleParam, 10) || 0 : 0;

    const initialSearch = searchParams.get("search") || "";

    const checkInParam = searchParams.get("checkIn") || "";
    const checkOutParam = searchParams.get("checkOut") || "";

    const scoreParam = searchParams.get("score");
    const initialScore = scoreParam ? parseFloat(scoreParam) || 0 : 0;

    const priceParam = searchParams.get("price");
    const initialPriceRanges = priceParam ? priceParam.split(",") : [];

    const sortParam = searchParams.get("sort");
    const initialSort = sortParam || "order";

    /* Compute hero title based on params (like the Vue reference) */
    const isResulted = initialFeatures.length > 0 || initialLocations.length > 0;
    let heroTitle = "Tüm Villalar";
    if (isResulted && initialFeatures.length === 1) {
        heroTitle = featuresList2[initialFeatures[0]] || "Sonuçlar";
    } else if (isResulted) {
        heroTitle = "Sonuçlar";
    } else if (initialPeople > 0) {
        heroTitle = `${initialPeople} - ${initialPeople + 1} Kişilik Villalar`;
    }

    /* State */
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>(initialFeatures);
    const [selectedLocations, setSelectedLocations] = useState<string[]>(initialLocations);
    const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>(initialPriceRanges);
    const [people, setPeople] = useState(initialPeople);
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [minScore, setMinScore] = useState(initialScore);
    const [sortBy, setSortBy] = useState(initialSort);
    const [sortOpen, setSortOpen] = useState(false);
    const [showMoreCat, setShowMoreCat] = useState(false);
    const [showMoreLoc, setShowMoreLoc] = useState(false);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [slideIndices, setSlideIndices] = useState<Record<string, number>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 18;

    const isSyncingFromUrl = useRef(false);

    /* Sync external URL changes to internal state */
    useEffect(() => {
        isSyncingFromUrl.current = true;
        const locParam = searchParams.get("location");
        const currentLocs = locParam ? locParam.split(",") : [];
        if (currentLocs.join(",") !== selectedLocations.join(",")) {
            setSelectedLocations(currentLocs);
        }

        const featParam = searchParams.get("features");
        const urlFeatures: string[] = [];
        if (featParam) {
            featParam.split(",").forEach((f) => {
                if (featuresList[f]) urlFeatures.push(f);
            });
        }
        if (urlFeatures.join(",") !== selectedFeatures.join(",")) {
            setSelectedFeatures(urlFeatures);
        }

        const peopleParam = searchParams.get("people");
        const urlPeople = peopleParam ? parseInt(peopleParam, 10) : 0;
        if (urlPeople !== people) {
            setPeople(urlPeople);
        }

        const searchP = searchParams.get("search") || "";
        if (searchP !== searchTerm) {
            setSearchTerm(searchP);
        }

        const priceParam = searchParams.get("price");
        const urlPrices = priceParam ? priceParam.split(",") : [];
        if (urlPrices.join(",") !== selectedPriceRanges.join(",")) {
            setSelectedPriceRanges(urlPrices);
        }

        const sortParam = searchParams.get("sort") || "order";
        if (sortParam !== sortBy) {
            setSortBy(sortParam);
        }
        
        // Safely declare syncing complete right after the frame finishes
        setTimeout(() => {
            isSyncingFromUrl.current = false;
        }, 50);
    }, [searchParams]);

    /* Sync internal filter state back to URL */
    useEffect(() => {
        if (isSyncingFromUrl.current) return;
        
        const params = new URLSearchParams(searchParams.toString());
        let changed = false;

        const updateParam = (key: string, value: string) => {
            if ((params.get(key) || "") !== value) {
                if (value) params.set(key, value);
                else params.delete(key);
                changed = true;
            }
        };

        updateParam("location", selectedLocations.join(","));
        updateParam("features", selectedFeatures.join(","));
        updateParam("people", people > 0 ? String(people) : "");
        updateParam("search", searchTerm);
        updateParam("score", minScore > 0 ? String(minScore) : "");
        updateParam("price", selectedPriceRanges.join(","));
        updateParam("sort", sortBy !== "order" ? sortBy : "");

        if (changed) {
            const qs = params.toString();
            router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
        }
    }, [selectedFeatures, selectedLocations, selectedPriceRanges, people, searchTerm, minScore, sortBy, pathname, router, searchParams]);

    /* Reset page to 1 when filters change */
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedFeatures, selectedLocations, selectedPriceRanges, people, searchTerm, minScore, sortBy]);

    /* Toggles */
    const toggleFeature = useCallback((f: string) => {
        setSelectedFeatures((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);
    }, []);

    const toggleLocation = useCallback((l: string) => {
        setSelectedLocations((prev) => prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]);
    }, []);

    const togglePriceRange = useCallback((p: string) => {
        setSelectedPriceRanges((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);
    }, []);

    /* Load villas from Supabase */
    const [allVillas, setAllVillas] = useState<Villa[]>([]);
    const [loadingVillas, setLoadingVillas] = useState(true);
    const [unavailableIds, setUnavailableIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        async function load() {
            try {
                const data = await getAllVillasForSearch();
                setAllVillas(data.map(mapVillaDetail));
            } catch (err) {
                console.error('Villalar yüklenemedi:', err);
            } finally {
                setLoadingVillas(false);
            }
        }
        load();
    }, []);

    useEffect(() => {
        if (!checkInParam || !checkOutParam) {
            setUnavailableIds(new Set());
            return;
        }
        getUnavailableVillaIds(checkInParam, checkOutParam).then(setUnavailableIds).catch(() => setUnavailableIds(new Set()));
    }, [checkInParam, checkOutParam]);

    const [dbLocations, setDbLocations] = useState<{key: string, label: string}[]>([]);
    useEffect(() => {
        import("@/lib/supabase").then(({ supabase }) => {
            supabase.from("destinations").select("name, filter_param").eq("is_active", true).order("sort_order")
                .then(({ data }) => {
                    if (data) {
                        setDbLocations(data.map(d => ({ key: d.filter_param, label: d.name })));
                    }
                });
        });
    }, []);

    /* Filtering */
    const filteredVillas = useMemo(() => {
        let result = [...allVillas];

        // Tarih filtresi: müsait olmayan villalar gizlenir
        if (checkInParam && checkOutParam && unavailableIds.size > 0) {
            result = result.filter((v) => !unavailableIds.has(v.id));
        }

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            result = result.filter((v) => v.name.toLowerCase().includes(term));
        }

        if (selectedFeatures.length > 0) {
            result = result.filter((v) => selectedFeatures.every((f) => v.features.includes(f)));
        }

        if (selectedLocations.length > 0) {
            result = result.filter((v) => {
                // 1) Exact match via locationToFilter map
                const exactKey = locationToFilter[v.location];
                if (exactKey && selectedLocations.includes(exactKey)) return true;
                // 2) Normalize slug comparison (handles "/ ", Turkish chars, etc.)
                const villaSlug = toLocSlug(v.location);
                return selectedLocations.some((sel) => {
                    const selDisplaySlug = toLocSlug(locationsList[sel] || sel);
                    if (villaSlug === sel || villaSlug === selDisplaySlug) return true;
                    // Fallback to substring match for robustness using the normalized slug
                    return villaSlug.includes(selDisplaySlug) || selDisplaySlug.includes(villaSlug);
                });
            });
        }

        if (selectedPriceRanges.length > 0) {
            result = result.filter((v) => {
                return selectedPriceRanges.some((prKey) => {
                    const pr = priceRanges.find((p) => p.key === prKey);
                    if (!pr) return false;
                    return v.minEver >= pr.min && v.minEver < pr.max;
                });
            });
        }

        if (people > 0) {
            result = filterAndSortByCapacity(result, people, (v) => v.guests);
        }

        if (minScore > 0) {
            result = result.filter((v) => v.score >= minScore);
        }
        if (sortBy === "total") result.sort((a, b) => a.minEver - b.minEver);
        else if (sortBy === "totalrev") result.sort((a, b) => b.minEver - a.minEver);
        else if (sortBy === "guest") result.sort((a, b) => a.guests - b.guests);
        else if (sortBy === "guestrev") result.sort((a, b) => b.guests - a.guests);
        if (sortBy === "score") {
            result.sort((a, b) => b.score - a.score);
        }

        return result;
    }, [allVillas, selectedFeatures, selectedLocations, selectedPriceRanges, people, searchTerm, minScore, sortBy, checkInParam, checkOutParam, unavailableIds]);

    const paginatedVillas = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredVillas.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredVillas, currentPage]);

    const totalPages = Math.ceil(filteredVillas.length / ITEMS_PER_PAGE);

    const hasFilters = selectedFeatures.length > 0 || selectedLocations.length > 0 || selectedPriceRanges.length > 0 || people > 0 || searchTerm !== "" || minScore > 0;

    const clearAllFilters = () => {
        setSelectedFeatures([]);
        setSelectedLocations([]);
        setSelectedPriceRanges([]);
        setPeople(0);
        setMinScore(0);
        setSearchTerm("");
        setSortBy("order");
    };

    /* Image slider */
    const getSlideIndex = (slug: string) => slideIndices[slug] || 0;
    const slidePrev = (slug: string, totalImages: number) => {
        setSlideIndices((prev) => ({ ...prev, [slug]: (prev[slug] || 0) === 0 ? totalImages - 1 : (prev[slug] || 0) - 1 }));
    };
    const slideNext = (slug: string, totalImages: number) => {
        setSlideIndices((prev) => ({ ...prev, [slug]: ((prev[slug] || 0) + 1) % totalImages }));
    };

    const sortLabel = sortOptions.find((s) => s.key === sortBy)?.label || "Sırala";

    /* ──────────── Filter Sidebar JSX ──────────── */
    const filterSidebar = (
        <div style={{ background: "#fff", borderRadius: "8px", boxShadow: "0px 0px 40px rgba(29, 58, 83, 0.1)", width: "100%" }}>
            <div style={{ padding: "26px" }}>
                {/* Villa Türü */}
                <div className="poppins" style={{ fontWeight: 700, fontSize: "16px" }}>Villa Türü</div>
                <div style={{ marginTop: "10px" }}>
                    {villaTypeInitial.map((f) => (
                        <div key={f} style={{ marginTop: "6px" }}>
                            <Checkbox checked={selectedFeatures.includes(f)} onChange={() => toggleFeature(f)} label={featuresList[f]} />
                        </div>
                    ))}
                    {showMoreCat && villaTypeExtra.map((f) => (
                        <div key={f} style={{ marginTop: "6px" }}>
                            <Checkbox checked={selectedFeatures.includes(f)} onChange={() => toggleFeature(f)} label={featuresList[f]} />
                        </div>
                    ))}
                    <div onClick={() => setShowMoreCat(!showMoreCat)} className={`${styles.moreToggle} dm-sans`}>
                        Daha {showMoreCat ? "Az ▲" : "Fazla ▼"}
                    </div>
                </div>

                {/* Fiyat Aralığı */}
                <div className={`${styles.sectionTitle} poppins`}>
                    Fiyat Aralığı <span className="dm-sans" style={{ fontSize: "12px", color: "#6a6a6a", fontWeight: 400 }}>/ Gece</span>
                </div>
                <div style={{ marginTop: "10px" }}>
                    {priceRanges.map((pr) => (
                        <div key={pr.key} style={{ marginTop: "6px" }}>
                            <Checkbox checked={selectedPriceRanges.includes(pr.key)} onChange={() => togglePriceRange(pr.key)} label={pr.label} />
                        </div>
                    ))}
                </div>

                {/* Konum */}
                <div className={`${styles.sectionTitle} poppins`}>Konum</div>
                <div style={{ marginTop: "16px", maxHeight: "250px", overflowY: "auto" }}>
                    {dbLocations.map((loc) => (
                        <div key={loc.key} style={{ marginTop: "6px" }}>
                            <Checkbox checked={selectedLocations.includes(loc.key)} onChange={() => toggleLocation(loc.key)} label={loc.label} />
                        </div>
                    ))}
                </div>

                {/* Havuz */}
                <div className={`${styles.sectionTitle} poppins`}>Havuz</div>
                <div style={{ marginTop: "10px" }}>
                    {poolFeatures.map((f) => (
                        <div key={f} style={{ marginTop: "6px" }}>
                            <Checkbox checked={selectedFeatures.includes(f)} onChange={() => toggleFeature(f)} label={featuresList[f]} />
                        </div>
                    ))}
                </div>

                {/* Öne Çıkan Özellikler */}
                <div className={`${styles.sectionTitle} poppins`}>Öne Çıkan Özellikler</div>
                <div style={{ marginTop: "10px" }}>
                    {featuredFeatures.map((f) => (
                        <div key={f} style={{ marginTop: 0 }}>
                            <Checkbox checked={selectedFeatures.includes(f)} onChange={() => toggleFeature(f)} label={featuresList[f]} />
                        </div>
                    ))}
                </div>

                {/* Villa Ara */}
                <div className={`${styles.sectionTitle} poppins`}>Villa Ara</div>
                <div style={{ marginTop: "10px" }}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Villa adı girin..."
                        className={`${styles.searchInput} dm-sans`}
                    />
                </div>
            </div>
        </div>
    );

    // Recommendation logic when no results
    const recommendedVillas = useMemo(() => {
        if (filteredVillas.length > 0 || allVillas.length === 0) return [];
        
        let candidates = allVillas.map(villa => {
            let score = 0;
            
            // 1. Location match (+10 points)
            if (selectedLocations.length > 0) {
                const exactKey = locationToFilter[villa.location];
                const isLocMatch = (exactKey && selectedLocations.includes(exactKey)) || selectedLocations.some((sel) => {
                    const villaSlug = toLocSlug(villa.location);
                    const selDisplaySlug = toLocSlug(locationsList[sel] || sel);
                    if (villaSlug === sel || villaSlug === selDisplaySlug) return true;
                    return villaSlug.includes(selDisplaySlug) || selDisplaySlug.includes(villaSlug);
                });
                if (isLocMatch) score += 10;
            }
            
            // 2. People capacity match (+5 points for exact/greater, +3 for close)
            if (people > 0) {
                if (villa.guests >= people) {
                    score += 5;
                } else if (Math.abs(villa.guests - people) <= 2) {
                    score += 3;
                }
            }
            
            // 3. Price range match (+4 points)
            if (selectedPriceRanges.length > 0) {
                const priceMatches = selectedPriceRanges.some(rangeStr => {
                    const [min, max] = rangeStr.split('-').map(Number);
                    const p = villa.minEver || 0;
                    if (max) return p >= min && p <= max;
                    return p >= min;
                });
                if (priceMatches) score += 4;
            }
            
            // 4. Features match (+2 points per matched feature)
            if (selectedFeatures.length > 0 && Array.isArray(villa.features)) {
                let matchCount = 0;
                for (const sf of selectedFeatures) {
                    if (villa.features.some(f => f === sf)) matchCount++;
                }
                score += (matchCount * 2);
            }

            // 5. Tie breaker & Priority (high score villas get a small bonus)
            if (villa.score >= 4.8) score += 1;

            return { villa, score };
        });
        
        // Sort by highest score. Randomize ties to create dynamic views if scores match.
        candidates.sort((a, b) => {
            if (a.score !== b.score) return b.score - a.score;
            return Math.random() - 0.5;
        });

        return candidates.slice(0, 6).map(c => c.villa);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredVillas.length, allVillas, selectedLocations, people, selectedFeatures, selectedPriceRanges]);

    /* ──────────── RENDER ──────────── */
    return (
        <div className={styles.pageWrapper}>
            {/* ═══════ HERO SECTION ═══════ */}
            <div className="paddingMobile no1023" style={{ paddingTop: 32 }}>
                <div className="dm-sans">
                    {/* Hero Banner */}
                    <div
                        className="middletp"
                        style={{
                            borderRadius: 16,
                            background: "url('/images/032.jpg')",
                            backgroundPosition: "left",
                            backgroundSize: "cover",
                            height: 400,
                            padding: "40px 48px 88px",
                        }}
                    >
                        <div style={{ width: "100%" }}>
                            <div style={{ paddingTop: 12 }}>
                                <h1
                                    className="poppins"
                                    style={{
                                        textAlign: "center",
                                        fontWeight: 700,
                                        fontSize: 56,
                                        color: "#fff",
                                    }}
                                >
                                    {heroTitle}
                                </h1>
                            </div>

                            {/* Filter Bar */}
                            <div className="middle" style={{ paddingBottom: 32 }}>
                                <SearchFilterBar
                                    initialLocation={initialLocations[0] || ""}
                                    initialPeople={initialPeople}
                                    initialCheckIn={checkInParam || undefined}
                                    initialCheckOut={checkOutParam || undefined}
                                    initialSearch={initialSearch || undefined}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════ RESULTS AREA ═══════ */}
            <div className="paddingMobile" style={{ marginTop: 12 }}>

                {/* ── Mobile Villa Search ── */}
                <div className={styles.mobileSearch}>
                    <div style={{ position: "relative" }}>
                        <input
                            type="text"
                            placeholder="Villa ismi ile arayın..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.mobileSearchInput}
                        />
                        <img
                            src="/images/search3.png"
                            style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", height: 14, opacity: 0.7 }}
                            alt=""
                        />
                    </div>
                </div>

                {/* ── Header Row ── */}
                <div style={{ width: "100%", display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between" }}>
                    <div>
                        {selectedFeatures.length === 1 && !isResulted ? (
                            <div style={{ fontSize: "24px", fontWeight: 600 }}>
                                {featuresList2[selectedFeatures[0]] || "Sonuçlar"}
                                <span style={{ marginLeft: "6px", color: "#6a6a6a", fontWeight: 500, fontSize: "12px" }}>( {filteredVillas.length} )</span>
                            </div>
                        ) : hasFilters ? (
                            <div style={{ fontSize: "24px", fontWeight: 600, lineHeight: 1.2 }}>
                                Arama Sonuçları
                                <span style={{ marginLeft: "6px", color: "#6a6a6a", fontWeight: 500, fontSize: "12px" }}>( {filteredVillas.length} )</span>
                            </div>
                        ) : (
                            <div style={{ fontSize: "24px", fontWeight: 600 }}>
                                {heroTitle}
                                <span style={{ marginLeft: "6px", color: "#6a6a6a", fontWeight: 500, fontSize: "12px" }}>( {filteredVillas.length} )</span>
                            </div>
                        )}
                        {people > 0 && (
                            <div style={{ fontSize: "16px", fontWeight: 300, color: "#747579", marginBottom: "8px" }}>
                                {people} - {people + 1} Kişilik Villalar Gösteriliyor
                            </div>
                        )}
                    </div>

                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        {/* Sort */}
                        <div style={{ position: "relative" }}>
                            <div onClick={() => setSortOpen(!sortOpen)} style={{ padding: "3px 8px", borderRadius: "12px", cursor: "pointer" }}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <div style={{ marginRight: "4px", fontSize: "18px", fontWeight: 700 }}>{sortLabel}</div>
                                    <span style={{ fontSize: "12px", opacity: 0.6 }}>▼</span>
                                </div>
                            </div>
                            {sortOpen && (
                                <div className={styles.sortDropdown}>
                                    {sortOptions.map((opt) => (
                                        <div key={opt.key} className={`${styles.sortItem} ${sortBy === opt.key ? styles.sortItemActive : ""}`}
                                            onClick={() => { setSortBy(opt.key); setSortOpen(false); }}>
                                            {opt.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Mobile filter toggle */}
                        <div className={styles.mobileFilterBtn} onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}>
                            ☰ Filtrele
                        </div>
                    </div>
                </div>

                {/* ── Active Filter Tags ── */}
                <div style={{ marginTop: "4px", display: "flex", flexWrap: "wrap" }}>
                    {hasFilters && (
                        <div className={`${styles.filterTag} ${styles.filterTagClear}`} onClick={clearAllFilters}>
                            ✕ Tüm Filtreleri Kaldır
                        </div>
                    )}
                    {selectedLocations.map((loc) => (
                        <div key={loc} className={styles.filterTag} onClick={() => toggleLocation(loc)}>
                            • {locationsList[loc]}
                        </div>
                    ))}
                    {selectedFeatures.map((feat) => (
                        <div key={feat} className={styles.filterTag} onClick={() => toggleFeature(feat)}>
                            • {featuresList[feat]}
                        </div>
                    ))}
                    {selectedPriceRanges.map((pr) => {
                        const range = priceRanges.find((p) => p.key === pr);
                        return (
                            <div key={pr} className={styles.filterTag} onClick={() => togglePriceRange(pr)}>
                                • {range?.label}
                            </div>
                        );
                    })}
                    {people > 0 && (
                        <div className={styles.filterTag} onClick={() => setPeople(0)}>
                            • Kişi Sayısı {people} - {people + 1}
                        </div>
                    )}
                </div>

                {/* ── Main Layout ── */}
                <div className={styles.mainLayout}>
                    {/* Filter Sidebar - Desktop */}
                    <div className={`${styles.filterSidebar} ${mobileFiltersOpen ? styles.filterSidebarOpen : ""}`}>
                        {filterSidebar}
                        <div className={styles.filterActions}>
                            <div className={styles.clearBtn} onClick={clearAllFilters}>Temizle</div>
                            <div className={styles.applyBtn} onClick={() => setMobileFiltersOpen(false)}>Filtreleri Uygula</div>
                        </div>
                    </div>

                    {/* Villa Cards */}
                    <div className={styles.villasContainer}>
                        {loadingVillas ? (
                            <div style={{ 
                                width: "100%", 
                                display: "flex", 
                                flexDirection: "column", 
                                alignItems: "center", 
                                justifyContent: "center", 
                                padding: "80px 20px",
                                color: "#1e90ff"
                            }}>
                                <div className={styles.spinner} style={{ 
                                    width: "40px", 
                                    height: "40px", 
                                    border: "4px solid #f3f3f3", 
                                    borderTop: "4px solid #1e90ff", 
                                    borderRadius: "50%", 
                                    animation: "spin 1s linear infinite",
                                    marginBottom: "16px"
                                }}></div>
                                <div className="poppins" style={{ fontSize: "18px", fontWeight: 600 }}>Arama yapılıyor...</div>
                                <style jsx>{`
                                    @keyframes spin {
                                        0% { transform: rotate(0deg); }
                                        100% { transform: rotate(360deg); }
                                    }
                                `}</style>
                            </div>
                        ) : filteredVillas.length > 0 ? (
                            <>
                                {paginatedVillas.map((villa) => (
                                    <VillaCard
                                        key={villa.slug}
                                        villa={villa}
                                        slideIndex={getSlideIndex(villa.slug)}
                                        onSlidePrev={() => slidePrev(villa.slug, villa.images.length)}
                                        onSlideNext={() => slideNext(villa.slug, villa.images.length)}
                                        checkIn={checkInParam || undefined}
                                        checkOut={checkOutParam || undefined}
                                    />
                                ))}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: "16px",
                                        marginTop: "32px",
                                        marginBottom: "16px"
                                    }}>
                                        <button
                                            onClick={() => {
                                                setCurrentPage(p => Math.max(1, p - 1));
                                                window.scrollTo({ top: 300, behavior: 'smooth' });
                                            }}
                                            disabled={currentPage === 1}
                                            style={{
                                                padding: "10px 20px",
                                                borderRadius: "8px",
                                                border: "1px solid #ddd",
                                                background: currentPage === 1 ? "#f5f5f5" : "#fff",
                                                color: currentPage === 1 ? "#999" : "#333",
                                                fontWeight: 600,
                                                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                                                transition: "all 0.2s"
                                            }}
                                        >
                                            Önceki Sayfa
                                        </button>
                                        
                                        <div style={{ fontWeight: 500, color: "#555" }}>
                                            Sayfa {currentPage} / {totalPages}
                                        </div>
                                        
                                        <button
                                            onClick={() => {
                                                setCurrentPage(p => Math.min(totalPages, p + 1));
                                                window.scrollTo({ top: 300, behavior: 'smooth' });
                                            }}
                                            disabled={currentPage === totalPages}
                                            style={{
                                                padding: "10px 20px",
                                                borderRadius: "8px",
                                                border: "none",
                                                background: currentPage === totalPages ? "#ccc" : "#1e90ff",
                                                color: "#fff",
                                                fontWeight: 600,
                                                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                                                transition: "all 0.2s"
                                            }}
                                        >
                                            Sonraki Sayfa
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <div className={styles.noResults} style={{ width: "100%", marginBottom: "40px" }}>
                                    <div className={styles.noResultsInner}>
                                        <div style={{ color: "#e83e8c", fontSize: "16px", fontWeight: 500 }}>
                                            Arama kriterlerinize uygun villa bulunamadı
                                        </div>
                                        <div style={{ marginTop: "22px", paddingTop: "20px", borderTop: "1px solid #ddd" }}>
                                            <div style={{ fontSize: "17px", fontWeight: 500, color: "#333" }}>
                                                <Link href="/sonuclar" onClick={clearAllFilters}>Filtreleri kaldırmak için tıklayın</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Recommended Villas */}
                                {recommendedVillas.length > 0 && (
                                    <>
                                        <div style={{ width: "100%", fontSize: "22px", fontWeight: 600, color: "#1e293b", marginBottom: "24px", paddingTop: "10px", borderTop: "1px solid #f1f5f9" }}>
                                            Bunlara da bakabilirsiniz
                                        </div>
                                        {recommendedVillas.map((villa) => (
                                            <VillaCard
                                                key={villa.slug}
                                                villa={villa}
                                                slideIndex={getSlideIndex(villa.slug)}
                                                onSlidePrev={() => slidePrev(villa.slug, villa.images.length)}
                                                onSlideNext={() => slideNext(villa.slug, villa.images.length)}
                                            />
                                        ))}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* ── Bottom Promo Section ── */}
                <div style={{ display: "flex", justifyContent: "center", marginTop: "48px" }}>
                    <div style={{ width: "100%", maxWidth: "500px" }}>
                        {/* Promo 1 */}
                        <div className={styles.promoRow}>
                            <Image src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200" alt="Promosyonlu Villalar" width={68} height={68} className={styles.promoImage} />
                            <div className={styles.promoContent}>
                                <h2 style={{ fontSize: "22px", marginBottom: "4px", marginTop: "8px" }}>Promosyonlu Villalar</h2>
                                <div style={{ maxWidth: "90%", fontSize: "15px", color: "#747579", fontWeight: 400 }}>
                                    Önceden belirlenmiş indirimli tarihler arasından seçim yapın
                                </div>
                            </div>
                            <Link href="/promosyonlar"><div className={styles.promoInspect}>İncele ›</div></Link>
                        </div>

                        {/* Promo 2 */}
                        <div className={styles.promoRow} style={{ marginTop: "32px" }}>
                            <Image src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200" alt="İndirimli Villalar" width={68} height={68} className={styles.promoImage} />
                            <div className={styles.promoContent}>
                                <h2 style={{ fontSize: "19px", marginBottom: "4px", marginTop: "8px" }}>İndirimli Villalar</h2>
                                <div style={{ maxWidth: "90%", fontSize: "15px", color: "#747579", fontWeight: 400 }}>
                                    Sadece Villa Tatilinde&apos;ye özel indirimler içeren villalar
                                </div>
                            </div>
                            <Link href="/indirimli-villalar"><div className={styles.promoInspect}>İncele ›</div></Link>
                        </div>
                    </div>
                </div>

                {/* ── CTA Section ── */}
                <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "74px", marginBottom: "32px" }}>
                    <div className={styles.ctaCard}>
                        <Link href="/villa-kategorileri">
                            <div style={{ fontSize: "16px", fontWeight: 400, color: "#222" }}>
                                Daha fazla villa görüntülemek için <strong>tıklayın</strong>
                            </div>
                        </Link>
                        <div style={{ marginTop: "22px", paddingTop: "20px", borderTop: "1px solid #ddd" }}>
                            <div style={{ fontSize: "17px", fontWeight: 500, color: "#333" }}>
                                Aradığınız Villa için En Uygun Teklifi Alın<br />Bize Ulaşın
                            </div>
                            <div style={{ marginTop: "16px", paddingBottom: "40px", display: "flex", justifyContent: "center" }}>
                                <Link href="/iletisim"><div className={styles.contactBtn}>İletişim</div></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ──────────────── Main Export ──────────────── */
export default function SonuclarContent() {
    return (
        <Suspense fallback={
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px", fontSize: "18px", color: "#747579" }}>
                Yükleniyor...
            </div>
        }>
            <SonuclarInner />
        </Suspense>
    );
}
