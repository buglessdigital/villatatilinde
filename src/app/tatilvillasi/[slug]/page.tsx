"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { formatDistance } from "@/data/mockVillas";
import type { Villa, PriceBlock, Review } from "@/data/mockVillas";
import { getVillaDetailBySlug } from "@/lib/queries";
import ReservationCalendar from "@/components/ReservationCalendar";
import SidebarDatePicker from "@/components/SidebarDatePicker";
import ReservationBottomSheet from "@/components/ReservationBottomSheet";
import { useCurrency } from "@/context/CurrencyContext";
import { supabase } from "@/lib/supabase";
import CallbackModal from "@/components/CallbackModal";
import YandexMapView from "@/components/YandexMapView";

/* ─────────────── Feature Maps ─────────────── */
const FEATURE_LABELS: Record<string, string> = {
    kitchen: "Mutfak", enSuite: "Ebeveyn Banyosu", balcony: "Balkon",
    gardenLounge: "Bahçe Mobilyası", sunbedUmbrella: "Şezlong ve Şemsiye",
    airConditioning: "Klima", wifi: "WiFi", smartTv: "Akıllı TV",
    fridge: "Buzdolabı", washingMac: "Çamaşır Mak.", dryingMac: "Kurutma Mak.",
    dishWasher: "Bulaşık Mak.", oven: "Fırın", iron: "Ütü",
};

const PREMIUM_FEATURES: Record<string, { img: string; label: string }> = {
    privatePool: { img: "/images/ppool.png", label: "Özel\nHavuz" },
    infinityPool: { img: "/images/ipool.png", label: "Sonsuzluk\nHavuzu" },
    isolatedPoolVillas: { img: "/images/poolfence.png", label: "Muhafazakar\nHavuz" },
    indoorPool: { img: "/images/inpool.png", label: "Kapalı\nHavuz" },
    heatedPool: { img: "/images/hpool.png", label: "Isıtmalı\nHavuz" },
    kidPoolVillas: { img: "/images/kidpool.png", label: "Çocuk\nHavuzu" },
    jacuzziVillas: { img: "/images/jak.png", label: "Jakuzi" },
    gymRoom: { img: "/images/gym.png", label: "Spor\nOdası" },
    sauna: { img: "/images/sauna.png", label: "Sauna" },
    hamam: { img: "/images/hamam.png", label: "Hamam" },
    cinemaRoom: { img: "/images/cinema.png", label: "Sinema\nOdası" },
    winterGarden: { img: "/images/cold.png", label: "Kış\nBahçesi" },
    tennisTable: { img: "/images/masa.png", label: "Masa\nTenisi" },
    poolTable: { img: "/images/ppol.png", label: "Bilardo\nMasası" },
    dryingMac: { img: "/images/drying.png", label: "Çamaşır Kurutma\nMakinesi" },
};

const CATEGORY_FEATURES: Record<string, { img: string; label: string }> = {
    affordableVillas: { img: "/images/affordable.png", label: "Ekonomik Fiyatlı\nVilla" },
    isolatedVillas: { img: "/images/tent.png", label: "Muhafazakar\nVilla" },
    honeyMoon: { img: "/images/honeymoon.png", label: "Balayı\nVillası" },
    ultraLux: { img: "/images/diamond.png", label: "Ultra\nLüks" },
    centralVillas: { img: "/images/central.png", label: "Merkezi\nKonumda" },
    natureview: { img: "/images/landscape.png", label: "Doğa Manzaralı\nVilla" },
    seaview: { img: "/images/sea.png", label: "Deniz Manzaralı\nVilla" },
    beachVillas: { img: "/images/vacations.png", label: "Denize Yakın\nVilla" },
    isolatedPoolVillas: { img: "/images/poolfence.png", label: "Havuzu Muhafazakar\nVilla" },
    kidPoolVillas: { img: "/images/kidpool.png", label: "Çocuk Havuzlu\nVilla" },
};

const INCLUDED_SERVICES_ICONS: Record<string, string> = {
    "Su Kullanımı": "/images/water.png",
    "Elektrik Kullanımı": "/images/outlet.png",
    "Wi-Fi": "/images/wifi2.png",
    "Tüpgaz Kullanımı": "/images/stove.png",
    "Havuz Bakımı": "/images/poolcleaning.png",
};

/* ─────────────── Helpers ─────────────── */
function parseDate(s: string): Date {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d);
}

function toDateStr(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function isBetween(dateStr: string, start: string, end: string): boolean {
    return dateStr >= start && dateStr <= end;
}

/* ─────────────── Main Component ─────────────── */
export default function VillaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const [villa, setVilla] = useState<Villa | null>(null);
    const [loading, setLoading] = useState(true);
    const [dbReservations, setDbReservations] = useState<{ startDate: string; endDate: string; status: "reserved" | "option" }[]>([]);
    const [disabledDateReasons, setDisabledDateReasons] = useState<{ startDate: string; endDate: string; reason: string }[]>([]);
    const [resolvedSlug, setResolvedSlug] = useState("");

    // Image gallery
    const [currentImage, setCurrentImage] = useState(0);
    const [galleryOpen, setGalleryOpen] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    // Pricing
    const [weeklyShow, setWeeklyShow] = useState(false);

    // Reservation
    const [checkInDate, setCheckInDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");
    const router = useRouter();
    const [showBottomSheet, setShowBottomSheet] = useState(false);

    // Ref to clear calendar dates from parent
    const clearCalendarRef = useRef<(() => void) | null>(null);

    // Wishlist
    const [wished, setWished] = useState(false);
    const [villaId, setVillaId] = useState<string | null>(null);

    const handleToggleWishlist = async () => {
        if (!villaId) return;
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push(`/giris?redirect=/tatilvillasi/${resolvedSlug}`);
            return;
        }

        if (wished) {
            // Remove from wishlist
            const { error } = await supabase.from("user_wishlists").delete().eq("user_id", user.id).eq("villa_id", villaId);
            if (error) alert("Favorilerden silerken hata oluştu: " + error.message);
            else setWished(false);
        } else {
            // Add to wishlist
            const { error } = await supabase.from("user_wishlists").insert([{ user_id: user.id, villa_id: villaId }]);
            if (error) alert("Favorilere eklerken hata oluştu: " + error.message);
            else setWished(true);
        }
    };

    // Discounts modal
    const [showDiscountsModal, setShowDiscountsModal] = useState(false);
    const [showCallbackModal, setShowCallbackModal] = useState(false);

    // Tooltips
    const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent | TouchEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.vd-res-tooltip-wrapper')) {
                setActiveTooltip(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);

    const toggleTooltip = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        setActiveTooltip(prev => (prev === id ? null : id));
    };

    const reservationRef = useRef<HTMLDivElement>(null);

    // Currency context
    const { formatPrice, currency: activeCurrency, convertPrice, rates } = useCurrency();

    // Villa's own currency-aware price formatter
    // Fiyatlar DB'de villa.currency cinsinden saklanıyor (GBP, TRY, EUR vb.)
    // Bu fonksiyon doğru birimi gösterir ve kullanıcının seçtiği dövize çevirir
    const formatVillaPrice = (amount: number): string => {
        if (!villa) return formatPrice(amount);
        const villaCurrency = (villa.currency || "TRY").toUpperCase();
        const SYMBOLS: Record<string, string> = { TRY: "₺", GBP: "£", EUR: "€", USD: "$", RUB: "₽" };

        // Kullanıcı hangi dövizi seçmiş?
        const targetCode = activeCurrency.code;

        if (villaCurrency === targetCode) {
            // Aynı birim → sembol + sayı, dönüşüm yok
            const sym = SYMBOLS[villaCurrency] || villaCurrency + " ";
            return `${sym}${Math.round(amount).toLocaleString("tr-TR", { maximumFractionDigits: 0 })}`;
        }

        // Farklı birim → önce TRY'ye çevir, sonra hedef dövize
        const toTRY = villaCurrency === "TRY" ? amount : amount / (rates[villaCurrency] || 1);
        const converted = targetCode === "TRY" ? toTRY : Math.round(toTRY * (rates[targetCode] || 1));
        return `${activeCurrency.symbol}${converted.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}`;
    };

    // Resolve params and fetch data
    useEffect(() => {
        params.then(async ({ slug }) => {
            setResolvedSlug(slug);

            try {
                const detail = await getVillaDetailBySlug(slug);
                if (!detail) {
                    notFound();
                    return;
                }

                setVillaId(detail.id);

                // Fetch user wish status
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data: wishData } = await supabase
                        .from("user_wishlists")
                        .select("*")
                        .eq("user_id", user.id)
                        .eq("villa_id", detail.id)
                        .single();
                    if (wishData) setWished(true);
                }

                const mapped: Villa = {
                    name: detail.name,
                    slug: detail.slug,
                    location: detail.location_label,
                    refCode: detail.ref_code || "",
                    priceBlocks: detail.price_periods.map(p => ({
                        period: p.label,
                        nightlyPrice: p.nightly_price,
                        weeklyPrice: p.weekly_price || p.nightly_price * 7,
                        originalPrice: p.original_price || undefined,
                        discount: p.discount_pct,
                        minNights: p.min_nights
                    })),
                    minEver: detail.min_price,
                    guests: detail.max_guests,
                    bedrooms: detail.bedrooms,
                    baths: detail.bathrooms,
                    pLength: detail.pool_length || 0,
                    pWidth: detail.pool_width || 0,
                    pDepth: detail.pool_depth || 0,
                    coverImage: detail.cover_image_url,
                    images: (() => {
                        const urls = detail.images.map(i => i.url).filter((u): u is string => !!u);
                        if (urls.length > 0) return urls;
                        return detail.cover_image_url ? [detail.cover_image_url] : ["/images/natureview.jpg"];
                    })(),
                    toBeach: detail.to_beach || 0,
                    toRestaurant: detail.to_restaurant || 0,
                    toShop: detail.to_shop || 0,
                    toCentre: detail.to_centre || 0,
                    toHospital: detail.to_hospital || 0,
                    saglikOcagi: detail.to_health_center || 0,
                    toAirport: detail.to_airport || 0,
                    toPublicTransport: 0,
                    deposit: detail.deposit_amount,
                    cleaning: detail.cleaning_fee,
                    minRes: detail.min_nights,
                    minResCleaning: detail.cleaning_fee_min_nights || 0,
                    checkIn: detail.check_in_time,
                    checkOut: detail.check_out_time,
                    features: detail.features.map(f => f.key),
                    descriptionHtml: detail.description_html || (detail.description_tr ? detail.description_tr.replace(/\n/g, '<br />') : ""),
                    belgeNo: detail.license_no || "",
                    mapIframe: detail.map_iframe_url || "",
                    position: { lat: detail.position_lat || 0, lng: detail.position_lng || 0 },
                    score: detail.reviews.length > 0
                        ? Math.round((detail.reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / detail.reviews.length) * 10) / 10
                        : (detail.avg_rating || 0),
                    scoreCount: detail.reviews.length || detail.review_count || 0,
                    score5percent: detail.reviews.length > 0 ? Math.round(detail.reviews.filter((r: any) => r.rating === 5).length / detail.reviews.length * 100) : 0,
                    score4percent: detail.reviews.length > 0 ? Math.round(detail.reviews.filter((r: any) => r.rating === 4).length / detail.reviews.length * 100) : 0,
                    score3percent: detail.reviews.length > 0 ? Math.round(detail.reviews.filter((r: any) => r.rating === 3).length / detail.reviews.length * 100) : 0,
                    score2percent: detail.reviews.length > 0 ? Math.round(detail.reviews.filter((r: any) => r.rating === 2).length / detail.reviews.length * 100) : 0,
                    score1percent: detail.reviews.length > 0 ? Math.round(detail.reviews.filter((r: any) => r.rating === 1).length / detail.reviews.length * 100) : 0,
                    pet: detail.pets_allowed,
                    smoke: detail.smoking_allowed,
                    party: detail.parties_allowed,
                    sound: detail.loud_music_allowed,
                    selfCheckin: detail.self_check_in || false,
                    poolFence: detail.pool_fence || false,
                    currency: detail.currency || "TRY",
                    includedServices: detail.included_services || [],
                    video: detail.video_urls || [],
                    reviews: detail.reviews.map((r: any) => ({
                        authorName: r.user_name || r.author_name || "Misafir",
                        initial2: "",
                        nights: r.nights_stayed || 0,
                        dateReadableTr: r.stay_period || (r.created_at ? new Date(r.created_at).toLocaleDateString("tr-TR", { month: "long", year: "numeric" }) : ""),
                        rate: r.rating,
                        body: r.comment,
                        images: []
                    })),
                    calendarPrices: detail.price_periods.map(p => ({
                        startDate: p.start_date,
                        endDate: p.end_date,
                        price: p.nightly_price
                    })),
                    calendarReservations: detail.disabled_dates.map(d => ({
                        startDate: d.start_date,
                        endDate: d.end_date,
                        status: "reserved" as const,
                    })),
                    commissionRate: detail.commission_pct || 20
                };

                if (detail.cover_image_url && !mapped.images.includes(detail.cover_image_url)) {
                    mapped.images.unshift(detail.cover_image_url);
                }

                setVilla(mapped);

                // Fetch pending/confirmed reservations from reservations table
                const { data } = await supabase
                    .from("reservations")
                    .select("check_in_date, check_out_date, status")
                    .eq("villa_slug", slug)
                    .in("status", ["confirmed", "pending", "pre_approved"]);

                if (data && data.length > 0) {
                    setDbReservations(data.map((r: any) => ({
                        startDate: r.check_in_date,
                        endDate: r.check_out_date,
                        status: r.status === "confirmed" ? "reserved" : "option",
                    })));
                }

                // Store disabled date reasons for tooltip warning
                setDisabledDateReasons(detail.disabled_dates.map(d => ({
                    startDate: d.start_date,
                    endDate: d.end_date,
                    reason: (d.notes || d.reason) || "Bu tarihler rezervasyona kapalıdır.",
                })));

            } catch (err) {
                console.error("Villa detail fetch error:", err);
                notFound();
            } finally {
                setLoading(false);
            }
        });
    }, [params]);

    // Pre-fill dates from URL params (e.g. coming from search results)
    useEffect(() => {
        if (typeof window === "undefined") return;
        const params = new URLSearchParams(window.location.search);
        const ci = params.get("checkIn");
        const co = params.get("checkOut");
        if (ci) setCheckInDate(ci);
        if (co) setCheckOutDate(co);
    }, []);

    const scrollToReservation = useCallback(() => {
        reservationRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    const handleCalendarDateSelect = useCallback((checkIn: string | null, checkOut: string | null) => {
        setCheckInDate(checkIn || "");
        setCheckOutDate(checkOut || "");
        // Show bottom sheet when both dates are selected
        if (checkIn && checkOut) {
            setShowBottomSheet(true);
        } else {
            setShowBottomSheet(false);
        }
    }, []);

    // Calculate dynamic pricing if both dates selected
    const { nightCount, accommodationPrice, cleaningFeeTotal, totalPrice, advancePayment, remainingPayment, hasUnpricedDays } = useMemo(() => {
        if (!villa || !checkInDate || !checkOutDate) return { nightCount: 0, accommodationPrice: 0, cleaningFeeTotal: 0, totalPrice: 0, advancePayment: 0, remainingPayment: 0, hasUnpricedDays: false };
        const start = parseDate(checkInDate);
        const end = parseDate(checkOutDate);
        const nights = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        if (nights <= 0) return { nightCount: 0, accommodationPrice: 0, cleaningFeeTotal: 0, totalPrice: 0, advancePayment: 0, remainingPayment: 0, hasUnpricedDays: false };

        let accommodation = 0;
        let unpriced = false;
        const cursor = new Date(start);
        for (let i = 0; i < nights; i++) {
            const ds = toDateStr(cursor);
            let found = false;
            for (const pr of villa.calendarPrices || []) {
                if (isBetween(ds, pr.startDate, pr.endDate)) {
                    accommodation += pr.price;
                    found = true;
                    break;
                }
            }
            if (!found) unpriced = true;
            cursor.setDate(cursor.getDate() + 1);
        }

        const cleaning = nights <= (villa.minResCleaning || 0) ? (villa.cleaning || 0) : 0;
        const total = accommodation + cleaning;
        const commissionPct = villa.commissionRate || 20;
        const advance = Math.round(total * (commissionPct / 100)); // Dynamic advance payment based on commission rate
        return { nightCount: nights, accommodationPrice: accommodation, cleaningFeeTotal: cleaning, totalPrice: total, advancePayment: advance, remainingPayment: total - advance, hasUnpricedDays: unpriced };
    }, [villa, checkInDate, checkOutDate]);

    const handleBottomSheetClose = useCallback(() => {
        setShowBottomSheet(false);
    }, []);

    const nextImage = useCallback(() => {
        if (!villa) return;
        setCurrentImage((prev) => (prev + 1) % villa.images.length);
    }, [villa]);

    const prevImage = useCallback(() => {
        if (!villa) return;
        setCurrentImage((prev) => (prev - 1 + villa.images.length) % villa.images.length);
    }, [villa]);

    const openGallery = useCallback((startIndex = 0) => {
        setCurrentImage(startIndex);
        setGalleryOpen(true);
        document.body.style.overflow = 'hidden';
    }, []);

    const closeGallery = useCallback(() => {
        setGalleryOpen(false);
        document.body.style.overflow = '';
    }, []);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartX.current = e.changedTouches[0].screenX;
    }, []);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        touchEndX.current = e.changedTouches[0].screenX;
        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextImage();
            else prevImage();
        }
    }, [nextImage, prevImage]);

    if (loading || !villa) {
        return (
            <div className="villa-detail-loading">
                <div className="villa-detail-spinner"></div>
            </div>
        );
    }

    const generalFeatures = villa.features.filter((f) => FEATURE_LABELS[f]);
    const premiumFeatures = villa.features.filter((f) => PREMIUM_FEATURES[f]);
    const categoryFeatures = villa.features.filter((f) => CATEGORY_FEATURES[f]);

    return (
        <div className="villa-detail-wrapper">
            {/* ─── STRIPE 1: Title + Reservation Button ─── */}
            <div className="vd-container">
                <div className="vd-stripe1">
                    <div className="vd-stripe1-left">
                        <h1 className="vd-villa-name">{villa.name}</h1>
                        <div className="vd-villa-location">{villa.location}</div>
                        <div className="vd-villa-ref">Villa Ref. No: {villa.refCode}</div>
                    </div>
                    <div className="vd-stripe1-right" onClick={scrollToReservation}>
                        <img src="/images/calW.png" alt="Takvim" style={{ height: 22, marginRight: 12 }} />
                        REZERVASYON YAP
                    </div>
                </div>

                {/* ─── STRIPE 2: Gallery + Price Sidebar ─── */}
                <div className="vd-stripe2">
                    <div className="vd-stripe2-left">
                        {/* Wishlist Button */}
                        <div
                            className="vd-wish-btn"
                            onClick={handleToggleWishlist}
                        >
                            <img
                                src={wished ? "/images/heartsolid.svg" : "/images/heart.png"}
                                alt="Favori"
                                style={{ height: 16 }}
                            />
                        </div>

                        {/* Desktop: Mosaic Grid (1 big + 2 small) */}
                        <div className="vd-gallery-mosaic">
                            <div className="vd-mosaic-big" onClick={() => openGallery(0)}>
                                <Image
                                    src={villa.images[0] || villa.coverImage || "/images/natureview.jpg"}
                                    alt={`${villa.name} 1`}
                                    className="vd-mosaic-img"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 66vw"
                                    priority
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                            <div className="vd-mosaic-side">
                                <div className="vd-mosaic-small" onClick={() => openGallery(1)}>
                                    <Image
                                        src={villa.images[1] || villa.images[0] || "/images/natureview.jpg"}
                                        alt={`${villa.name} 2`}
                                        className="vd-mosaic-img"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        priority
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>
                                <div className="vd-mosaic-small" onClick={() => openGallery(2)}>
                                    <Image
                                        src={villa.images[2] || villa.images[0] || "/images/natureview.jpg"}
                                        alt={`${villa.name} 3`}
                                        className="vd-mosaic-img"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        priority
                                        style={{ objectFit: "cover" }}
                                    />
                                    {/* Photo count overlay */}
                                    <div className="vd-mosaic-overlay" onClick={(e) => { e.stopPropagation(); openGallery(0); }}>
                                        <img src="/images/ims.png" alt="" style={{ height: 18, marginRight: 8, opacity: 0.9 }} />
                                        Fotoğrafları Gör ({villa.images.length})
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile: Single Image Gallery */}
                        <div className="vd-gallery-mobile">
                            <div className="vd-mobile-gallery-wrap" onClick={() => openGallery(0)}>
                                <Image
                                    src={villa.images[0] || villa.coverImage || "/images/natureview.jpg"}
                                    alt={villa.name}
                                    className="vd-mobile-gallery-img"
                                    fill
                                    sizes="100vw"
                                    priority
                                    style={{ objectFit: "cover" }}
                                />
                                <div className="vd-mobile-photo-btn">
                                    <img src="/images/ims.png" alt="" style={{ height: 16, marginRight: 6, opacity: 0.9 }} />
                                    Fotoğrafları Gör ({villa.images.length})
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="vd-stripe2-right">
                        {/* Price Header */}
                        <div className="vd-price-header">
                            <div className="vd-price-big">
                                {formatVillaPrice(villa.minEver)}
                            </div>
                            <div className="vd-price-sub">&apos;den başlayan fiyatlar</div>
                        </div>

                        {/* Quick Icons */}
                        <div className="vd-quick-icons">
                            <div className="vd-quick-icon">
                                <img src="/images/people.svg" alt="Kişi" />
                                <div>{villa.guests} Kişi</div>
                            </div>
                            <div className="vd-quick-icon">
                                <img src="/images/bed.svg" alt="Yatak" />
                                <div>{villa.bedrooms} Yatak Odası</div>
                            </div>
                            <div className="vd-quick-icon">
                                <img src="/images/bathsolid.svg" alt="Banyo" />
                                <div>{villa.baths} Banyo</div>
                            </div>
                            <div className="vd-quick-icon">
                                <img src="/images/pool.svg" alt="Havuz" />
                                <div>{villa.pWidth}m x {villa.pLength}m - Derinlik {villa.pDepth}m</div>
                            </div>
                        </div>

                        {/* Pricing Table */}
                        <div className="vd-pricing-table">
                            <div className="vd-pricing-title poppins">Fiyatlandırma Tablosu</div>
                            <div className="vd-pricing-tabs">
                                <div
                                    className={`vd-pricing-tab ${!weeklyShow ? "vd-pricing-tab-active" : ""}`}
                                    onClick={() => setWeeklyShow(false)}
                                >
                                    GECELİK
                                </div>
                                <div
                                    className={`vd-pricing-tab ${weeklyShow ? "vd-pricing-tab-active" : ""}`}
                                    onClick={() => setWeeklyShow(true)}
                                >
                                    HAFTALIK
                                </div>
                            </div>
                            <div className="vd-price-blocks">
                                {villa.priceBlocks.map((pb, i) => (
                                    <PriceBlockCard key={i} block={pb} weekly={weeklyShow} formatPriceFn={formatVillaPrice} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── MAIN CONTENT: 2-col layout ─── */}
                <div className="vd-main-content">
                    <div className="vd-main-left">
                        {/* Mesafe Cetveli */}
                        <section className="vd-section">
                            <h2 className="vd-section-title poppins">Mesafe Cetveli</h2>
                            <div className="vd-distance-subtitle">
                                <div className="vd-distance-bar"></div>
                                Villamızın Merkezi Noktalara uzaklıkları
                            </div>
                            <div className="vd-distances">
                                <DistanceItem icon="/images/umb.png" label="Sahil" value={formatDistance(villa.toBeach)} />
                                <DistanceItem icon="/images/utthin.png" label="Restaurant" value={formatDistance(villa.toRestaurant)} />
                                <DistanceItem icon="/images/shthin.png" label="Market" value={formatDistance(villa.toShop)} />
                                <DistanceItem icon="/images/cethin.png" label="Merkez" value={formatDistance(villa.toCentre)} />
                                <DistanceItem icon="/images/hothin.png" label="Hastane" value={formatDistance(villa.toHospital)} />
                                <DistanceItem icon="/images/hothin.png" label="Sağlık Ocağı" value={formatDistance(villa.saglikOcagi)} />
                                <DistanceItem icon="/images/aithin.png" label="Hava Alanı" value={formatDistance(villa.toAirport)} />
                                {villa.toPublicTransport !== undefined && villa.toPublicTransport > 0 && (
                                    <DistanceItem icon="/images/central.png" label="Toplu Taşıma" value={formatDistance(villa.toPublicTransport)} />
                                )}
                            </div>
                        </section>

                        {/* Önemli Bilgiler + Genel Özellikler */}
                        <div className="vd-info-features-row">
                            <div className="vd-info-col">
                                <h2 className="vd-section-title poppins">Önemli Bilgiler</h2>
                                <div className="vd-info-items">
                                    <div className="vd-info-item">
                                        <div className="vd-info-label">Depozito</div>
                                        <div className="vd-info-value">
                                            : {formatVillaPrice(villa.deposit)}
                                        </div>
                                    </div>
                                    <div className="vd-info-item">
                                        <div className="vd-info-label">Temizlik <span className="vd-info-small">( {villa.minResCleaning} gün ve altı için )</span></div>
                                        <div className="vd-info-value">
                                            : {formatVillaPrice(villa.cleaning)}
                                        </div>
                                    </div>
                                    <div className="vd-info-item">
                                        <div className="vd-info-label">Min Rezervasyon</div>
                                        <div className="vd-info-value">: {villa.minRes} Gün</div>
                                    </div>
                                    <div className="vd-info-item">
                                        <div className="vd-info-label">Mesafeli Satış (Kiralama) Sözleşmesi</div>
                                        <Link href="/politika/mesafeli-satis-kiralama-sozlesmesi" className="vd-info-value" style={{ textDecoration: 'none', color: 'inherit' }}>
                                            : Detaylar <img src="/images/iconlink.svg" alt="link" style={{ marginLeft: 6, height: 20 }} />
                                        </Link>
                                    </div>

                                    <div className="vd-info-item">
                                        <div className="vd-info-label">Giriş Saati</div>
                                        <div className="vd-info-value">: {villa.checkIn}</div>
                                    </div>
                                    <div className="vd-info-item">
                                        <div className="vd-info-label">Çıkış Saati</div>
                                        <div className="vd-info-value">: {villa.checkOut}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="vd-features-col">
                                <h2 className="vd-section-title poppins">Genel Özellikler</h2>
                                <div className="vd-general-features">
                                    {generalFeatures.map((f) => (
                                        <div key={f} className="vd-gen-feature">
                                            <img src="/images/vtStar.png" alt="" style={{ height: 14 }} />
                                            {FEATURE_LABELS[f]}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ─── Right Sidebar ─── */}
                    <div className="vd-main-right">
                        {/* Reservation Box */}
                        <div className="vd-reservation-box" ref={reservationRef}>
                            <div className="vd-res-title">Rezervasyon</div>
                            <div className="vd-res-clear">
                                {(checkInDate || checkOutDate) && (
                                    <button className="vd-res-clear-btn" onClick={() => { setCheckInDate(""); setCheckOutDate(""); clearCalendarRef.current?.(); }}>
                                        temizle
                                    </button>
                                )}
                            </div>
                            <SidebarDatePicker
                                checkInDate={checkInDate}
                                checkOutDate={checkOutDate}
                                onDateSelect={(ci, co) => {
                                    setCheckInDate(ci);
                                    setCheckOutDate(co);
                                    if (ci && co) setShowBottomSheet(true);
                                    else setShowBottomSheet(false);
                                }}
                                priceRanges={villa.calendarPrices}
                                reservations={[...villa.calendarReservations, ...dbReservations]}
                                disabledReasons={disabledDateReasons}
                                formatPriceFn={formatVillaPrice}
                                minNights={villa.minRes}
                            />

                            {(!checkInDate || !checkOutDate || nightCount <= 0) ? (
                                <>
                                    <div className="vd-res-info-text">
                                        Her villamızın farklı giriş günleri olmasından ve boşluk bırakılmadan kiralamaya verildiğinden, ön talep öncesi teyit alınız.
                                    </div>
                                    <div className="vd-res-info-text" style={{ marginTop: 12 }}>
                                        Villamıza ait avantajlı fiyatlar ve farklı gün seçenekleri için{" "}
                                        <a href="tel:+902426060725" style={{ fontWeight: 600 }}>+90 242 606 0725</a>{" "}
                                        numarasını arayabilir, dilerseniz Whatsapp üzerinden de iletişime geçebilirsiniz.
                                    </div>
                                </>
                            ) : hasUnpricedDays ? (
                                <div style={{ marginTop: 24 }}>
                                    <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "16px", color: "#991b1b", fontSize: 14, marginBottom: 12, textAlign: "center", fontWeight: 500 }}>
                                        ⚠️ Villa bu tarihler arasında uygun değildir.<br/>Lütfen başka bir tarih aralığı seçiniz.
                                    </div>
                                </div>
                            ) : (
                                <div style={{ marginTop: 24 }}>
                                    {cleaningFeeTotal > 0 && (
                                        <>
                                            <div className="vd-res-pricing-row" style={{ fontWeight: 500 }}>
                                                <span>Konaklama Ücreti</span>
                                                <span>{formatVillaPrice(accommodationPrice)}</span>
                                            </div>
                                            <div className="vd-res-pricing-row" style={{ fontWeight: 500 }}>
                                                <span style={{ display: "flex", alignItems: "center" }}>
                                                    Temizlik
                                                </span>
                                                <span>{formatVillaPrice(cleaningFeeTotal)}</span>
                                            </div>
                                        </>
                                    )}

                                    <div className="vd-res-pricing-row" style={{ fontSize: 16, borderBottom: "1px solid #e2e8f0", paddingBottom: 12, marginBottom: 16 }}>
                                        <span>{nightCount} Gece Toplam Tutar</span>
                                        <span>{formatVillaPrice(totalPrice)}</span>
                                    </div>

                                    <div className="vd-res-pricing-row" style={{ fontWeight: 500 }}>
                                        <span>%{(villa?.commissionRate || 20)} Ön Ödeme</span>
                                        <span>{formatVillaPrice(advancePayment)}</span>
                                    </div>

                                    <div className="vd-res-pricing-row" style={{ fontWeight: 500 }}>
                                        <span>%{100 - (villa?.commissionRate || 20)} Kalan Ödeme</span>
                                        <span>{formatVillaPrice(remainingPayment)}</span>
                                    </div>

                                    <div className="vd-res-pricing-row" style={{ fontWeight: 500 }}>
                                        <span style={{ display: "flex", alignItems: "center" }}>
                                            Depozito
                                            <span style={{ fontSize: 12, color: "#64748b", fontWeight: 400, marginLeft: 4 }}>(toplam tutara dahil değildir)</span>
                                        </span>
                                        <span>{formatVillaPrice(villa.deposit)}</span>
                                    </div>
                                </div>
                            )}

                            <button
                                className="vd-res-submit-btn"
                                style={hasUnpricedDays ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
                                onClick={() => {
                                    if (!checkInDate || !checkOutDate) {
                                        reservationRef.current?.scrollIntoView({ behavior: "smooth" });
                                        return;
                                    }
                                    if (hasUnpricedDays) return;
                                    router.push(`/tatilvillasi/${resolvedSlug}/rezervasyon?checkIn=${checkInDate}&checkOut=${checkOutDate}`);
                                }}
                            >
                                Rezervasyon Talebi Oluştur
                            </button>
                        </div>

                        {/* Belge No */}
                        <div className="vd-belge-box">
                            <img src="/images/ktb.png" alt="KTB" style={{ height: 48, marginRight: 16 }} />
                            <div className="vd-belge-text">
                                T.C Kültür ve Turizm <br />
                                Bakanlığı Belge Belge No : {villa.belgeNo}
                            </div>
                        </div>

                        {/* Discount / Short-term */}
                        <div className="vd-promo-btn" style={{ background: "#e83e8c1a", color: "#e83e8c", cursor: "pointer" }} onClick={() => setShowDiscountsModal(true)}>
                            <img src="/images/discount.png" alt="" style={{ height: 20, marginRight: 6 }} />
                            Villa İndirim ve Promosyonları için <strong>&nbsp;tıklayın</strong>
                        </div>

                        {/* Map */}
                        <div className="vd-map-section">
                            {(() => {
                                let iframeInput = villa.mapIframe || "";
                                let mapUrl = "";
                                
                                const srcMatch = iframeInput.match(/src=["']([^"']+)["']/);
                                if (srcMatch) {
                                    mapUrl = srcMatch[1];
                                } else if (iframeInput.startsWith('http')) {
                                    mapUrl = iframeInput;
                                } else if (iframeInput.includes('google.com/maps')) {
                                    const httpMatch = iframeInput.match(/(https?:\/\/[^\s"']+)/);
                                    if (httpMatch) mapUrl = httpMatch[1];
                                }

                                let directionLink = `https://www.google.com/maps/dir/?api=1&destination=${villa.position.lat},${villa.position.lng}`;
                                
                                if ((!villa.position.lat && !villa.position.lng) || (villa.position.lat === 0 && villa.position.lng === 0)) {
                                    directionLink = mapUrl || "#";
                                }

                                const hasCoordinates = (villa.position.lat !== 0 && villa.position.lng !== 0);

                                return (
                                    <>
                                        {hasCoordinates ? (
                                            <div style={{ width: "100%", height: 350, borderRadius: 12, overflow: "hidden", border: "1px solid #e2e8f0" }}>
                                                <YandexMapView lat={villa.position.lat} lng={villa.position.lng} title={villa.name} />
                                            </div>
                                        ) : mapUrl ? (
                                            <iframe
                                                src={mapUrl}
                                                width="100%"
                                                height="315"
                                                style={{ border: 0, overflow: "hidden", borderRadius: 12 }}
                                                loading="lazy"
                                                referrerPolicy="no-referrer-when-downgrade"
                                            />
                                        ) : (
                                            <div style={{ height: 315, display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9", borderRadius: 12, border: "1px solid #e2e8f0" }}>
                                                {iframeInput ? "Geçersiz Harita Kodu" : "Harita Koordinatı veya Linki Eklenmedi"}
                                            </div>
                                        )}
                                        {(hasCoordinates || mapUrl) && (
                                            <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px", marginTop: "16px" }}>
                                                <a
                                                    href={directionLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ textDecoration: "none" }}
                                                >
                                                    <div className="vd-directions-btn" style={{ width: "100%", textAlign: "center" }}>Yol Tarifi</div>
                                                </a>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </div>

                {/* ─── Full-Width Sections ─── */}
                <div className="vd-full-sections">
                    {/* Öne Çıkan Özellikler */}
                    {premiumFeatures.length > 0 && (
                        <section className="vd-section vd-center-section">
                            <h2 className="vd-section-title poppins vd-center-title">Öne Çıkan Özellikler</h2>
                            <div className="vd-premium-grid">
                                {premiumFeatures.map((f) => (
                                    <div key={`premium-${f}`} className="vd-premium-card">
                                        <div className="vd-premium-icon">
                                            <img src={PREMIUM_FEATURES[f].img} alt={PREMIUM_FEATURES[f].label} />
                                        </div>
                                        <div className="vd-premium-label">
                                            {PREMIUM_FEATURES[f].label.split("\n").map((line, i) => (
                                                <span key={i}>{line}<br /></span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Hakkında */}
                    <section className="vd-section vd-center-section">
                        <h2 className="vd-section-title poppins vd-center-title">{villa.name} Hakkında</h2>
                        <div className="vd-about-content" dangerouslySetInnerHTML={{ __html: villa.descriptionHtml }} />
                    </section>

                    {/* Villa Kategorisi */}
                    {categoryFeatures.length > 0 && (
                        <section className="vd-section vd-center-section">
                            <h2 className="vd-section-title poppins vd-center-title">Villa Kategorisi</h2>
                            <div className="vd-premium-grid">
                                {[...new Set(categoryFeatures)].map((f) => (
                                    <div key={`category-${f}`} className="vd-premium-card">
                                        <div className="vd-premium-icon">
                                            <img src={CATEGORY_FEATURES[f].img} alt={CATEGORY_FEATURES[f].label} />
                                        </div>
                                        <div className="vd-premium-label">
                                            {CATEGORY_FEATURES[f].label.split("\n").map((line, i) => (
                                                <span key={i}>{line}<br /></span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Villa Kuralları */}
                    <section className="vd-section vd-center-section">
                        <h2 className="vd-section-title poppins vd-center-title">Villa Kuralları</h2>
                        <div className="vd-rules-grid">
                            <RuleCard img="/images/checkin2.png" label={`Villa Giriş Saati\n${villa.checkIn}`} />
                            <RuleCard img="/images/checkout2.png" label={`Villa Çıkış Saati\n${villa.checkOut}`} />
                            {villa.selfCheckin && <RuleCard img="/images/checkin2.png" label="Özerk Giriş\n(Anahtar Kutusu)" />}
                            {villa.poolFence && <RuleCard img="/images/poolfence.png" label="Havuz Etrafında\nGüvenlik Çiti" />}
                            {villa.pet && <RuleCard img="/images/petnot.png" label="Evcil Hayvanlara\nİzin Verilmiyor" />}
                            {villa.smoke && <RuleCard img="/images/nosmoking.png" label="İç Mekanda Sigara\nİçilmez" />}
                            {villa.party && <RuleCard img="/images/noparty.png" label="Parti\nYapılmaz" />}
                            {villa.sound && <RuleCard img="/images/noloud.png" label="Yüksek Ses\nYapılmaz" />}
                        </div>
                    </section>

                    {/* ─── Rezervasyon Takvimi ─── */}
                    <ReservationCalendar
                        priceRanges={villa.calendarPrices}
                        reservations={[...villa.calendarReservations, ...dbReservations]}
                        currency={activeCurrency.symbol}
                        onDateSelect={handleCalendarDateSelect}
                        clearDatesRef={clearCalendarRef}
                        minNights={villa.minRes}
                        disabledReasons={disabledDateReasons}
                    />

                    {/* Fiyata Dahil Hizmetler */}
                    <section className="vd-section vd-center-section">
                        <h2 className="vd-section-title poppins vd-center-title">Fiyata Dahil Hizmetler</h2>
                        <div className="vd-premium-grid">
                            {villa.includedServices && villa.includedServices.map((srv, i) => (
                                <div key={i} className="vd-premium-card">
                                    <div className="vd-premium-icon">
                                        <img src={INCLUDED_SERVICES_ICONS[srv] || "/images/checkin2.png"} alt={srv} />
                                    </div>
                                    <div className="vd-premium-label">
                                        {srv.split(" ").map((word, wi) => (
                                            <span key={wi}>{word}<br /></span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <div className="vd-premium-card">
                                <div className="vd-premium-icon">
                                    <img src="/images/cleaning.png" alt="Temizlik" />
                                </div>
                                <div className="vd-premium-label">
                                    {villa.minResCleaning} Gece ve Üzeri Konaklamada<br />Giriş Temizliği Ücretsiz
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Tanıtım Videosu & Villa Konumu */}
                    <div className="vd-video-map-row">
                        <div className="vd-video-side">
                            <h2 className="vd-section-title poppins">Tanıtım Videosu</h2>
                            {(() => {
                                const videoUrlArray = villa.video || [];
                                let videoUrl = videoUrlArray.length > 0 ? videoUrlArray[0] : "";
                                
                                if (videoUrl) {
                                    // Parse for standard iframe embedding
                                    if (videoUrl.includes('youtube.com/watch')) {
                                        try {
                                            const urlObj = new URL(videoUrl);
                                            const v = urlObj.searchParams.get('v');
                                            if (v) videoUrl = `https://www.youtube.com/embed/${v}`;
                                        } catch (e) {}
                                    } else if (videoUrl.includes('youtu.be/')) {
                                        const v = videoUrl.split('youtu.be/')[1]?.split('?')[0];
                                        if (v) videoUrl = `https://www.youtube.com/embed/${v}`;
                                    } else if (videoUrl.includes('vimeo.com/') && !videoUrl.includes('player.vimeo.com')) {
                                        const v = videoUrl.split('vimeo.com/')[1]?.split('?')[0];
                                        if (v) videoUrl = `https://player.vimeo.com/video/${v}`;
                                    }

                                    return (
                                        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: 12, background: "#000" }}>
                                            <iframe
                                                src={videoUrl}
                                                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    );
                                }

                                return (
                                    <div className="vd-video-placeholder">
                                        <img src={villa.coverImage || "/images/natureview.jpg"} alt={villa.name} className="vd-video-cover" />
                                        <div className="vd-video-text">Villa Videosu Hazırlanıyor</div>
                                    </div>
                                );
                            })()}
                        </div>
                        <div className="vd-map-side">
                            <h2 className="vd-section-title poppins">Villa Konumu</h2>
                            {(() => {
                                let iframeInput = villa.mapIframe || "";
                                let mapUrl = "";
                                
                                // Clean up the input and extract URL
                                const srcMatch = iframeInput.match(/src=["']([^"']+)["']/);
                                if (srcMatch) {
                                    mapUrl = srcMatch[1];
                                } else if (iframeInput.startsWith('http')) {
                                    mapUrl = iframeInput;
                                } else if (iframeInput.includes('google.com/maps')) {
                                    // Sometimes users paste text that happens to have the URL
                                    const httpMatch = iframeInput.match(/(https?:\/\/[^\s"']+)/);
                                    if (httpMatch) mapUrl = httpMatch[1];
                                }

                                let directionLink = `https://www.google.com/maps/dir/?api=1&destination=${villa.position.lat},${villa.position.lng}`;
                                
                                // Handle case where coordinates are not provided (lat 0, lng 0)
                                if ((!villa.position.lat && !villa.position.lng) || (villa.position.lat === 0 && villa.position.lng === 0)) {
                                    // Gerekli koordinatlar yoksa, Google Maps arama sayfasına villa adıyla yönlendir.
                                    const searchQuery = encodeURIComponent(`${villa.name}`);
                                    directionLink = `https://www.google.com/maps/dir/?api=1&destination=${searchQuery}`;
                                }

                                return (
                                    <>
                                        <div className="vd-map-embed">
                                            {mapUrl ? (
                                                <iframe
                                                    src={mapUrl}
                                                    width="100%"
                                                    height="350"
                                                    style={{ border: 0, overflow: "hidden", borderRadius: 12 }}
                                                    loading="lazy"
                                                    referrerPolicy="no-referrer-when-downgrade"
                                                ></iframe>
                                            ) : (
                                                <div style={{ height: 350, display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9", borderRadius: 12 }}>
                                                    {iframeInput ? "Geçersiz Harita Kodu" : "Harita Linki Eklenmedi"}
                                                </div>
                                            )}
                                        </div>
                                        {(mapUrl || villa.position.lat !== 0) && (
                                            <a
                                                href={directionLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <div className="vd-directions-btn">Yol Tarifi</div>
                                            </a>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    </div>

                    {/* Yorumlar */}
                    <section className="vd-section">
                        <h2 className="vd-section-title poppins">Yorumlar</h2>
                        <div className="vd-score-container">
                            <div className="vd-score-left">
                                <div className="vd-score-point poppins">{villa.score}</div>
                                <div className="vd-score-count dm-sans">toplam {villa.scoreCount} yorum</div>
                                <div className="vd-score-stars">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <img key={s} src="/images/stary.svg" alt="star" className="vd-star" />
                                    ))}
                                </div>
                            </div>
                            <div className="vd-score-right">
                                <ScoreBar percent={villa.score5percent} />
                                <ScoreBar percent={villa.score4percent} />
                                <ScoreBar percent={villa.score3percent} />
                                <ScoreBar percent={villa.score2percent} />
                                <ScoreBar percent={villa.score1percent} />
                            </div>
                        </div>

                        {/* Review Items */}
                        {villa.reviews.map((review, i) => (
                            <ReviewCard key={i} review={review} />
                        ))}
                    </section>

                    {/* Yorum Yap */}
                    <section className="vd-section">
                        <h2 className="vd-section-title poppins">Yorum Yap</h2>
                        <div style={{ fontSize: 18, marginTop: 8 }}>
                            Villa hakkında yorum yapmak için lütfen <strong style={{ cursor: "pointer" }}>tıklayın</strong>
                        </div>
                        <div className="vd-review-btn-wrap" style={{ marginTop: 22, display: "flex", justifyContent: "flex-start" }}>
                            <Link href={`/yorum-yap?villaId=${villaId}`}>
                                <div className="vd-review-btn">Yorum Yap</div>
                            </Link>
                        </div>
                    </section>

                    {/* Merak Ettikleriniz */}
                    <section className="vd-section">
                        <div className="vd-faq-row">
                            <div className="vd-faq-card">
                                <div className="vd-faq-header-row">
                                    <svg width="72" height="72" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                                        <circle cx="42" cy="40" r="30" fill="#e8f4f1" stroke="#28b99a" strokeWidth="2.5"/>
                                        <path d="M35 32c0-3.866 3.134-7 7-7s7 3.134 7 7c0 4-4 6-6 9v2" stroke="#1c3661" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                        <circle cx="42" cy="54" r="2.5" fill="#1c3661"/>
                                        <path d="M30 68 L22 80 L44 71" fill="#e8f4f1" stroke="#28b99a" strokeWidth="2" strokeLinejoin="round"/>
                                    </svg>
                                    <h2 className="vd-section-title poppins" style={{ margin: 0 }}>Merak Ettikleriniz</h2>
                                </div>
                                <div className="vd-faq-card-title poppins">
                                    Villa ile İlgili Soru Sor &amp;<br />Cevaplanmış Soruları Görüntüle
                                </div>
                                <div className="vd-faq-card-desc dm-sans">
                                    İncelediğiniz villa ile ilgili sormak istediğiniz tüm detaylar için buradan soru oluşturabilir veya önceden sorulmuş birçok soru ve cevabına gözatabilirsiniz
                                </div>
                                <Link href={`/sorular?villaId=${villaId}`}>
                                    <div className="vd-review-btn" style={{ marginTop: 32 }}>Soru Sor</div>
                                </Link>
                            </div>
                            <div className="vd-faq-card">
                                <img src="/images/me.svg" alt="" />
                                <div className="vd-faq-card-title poppins">
                                    Villa Tatilinde Garantili Villa Kiralama
                                </div>
                                <div className="vd-faq-card-desc dm-sans">
                                    Websitemizde görüntülediğiniz tüm villalar, apartlar, bağ evi ve tatil evleri yerinde kontrol edilmiş ve onaylanmıştır.
                                    Tüm sorularınız için haftanın her günü ofisimize uğrayabilir, bizi arayabilir, WhatsApp üzerinden ulaşabilir veya canlı destek hattımıza bağlanabilirsiniz.
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Gallery Modal */}
            {galleryOpen && (
                <div className="vd-gallery-modal-overlay">
                    {/* Close button */}
                    <button className="vd-gallery-modal-close" onClick={closeGallery}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>

                    {/* Counter */}
                    <div className="vd-gallery-modal-counter">
                        {currentImage + 1} / {villa.images.length}
                    </div>

                    {/* Prev button */}
                    <button className="vd-gallery-modal-arrow vd-gallery-modal-arrow-left" onClick={prevImage}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>

                    {/* Main image with swipe */}
                    <div
                        className="vd-gallery-modal-image-wrap"
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        <Image
                            src={villa.images[currentImage] || "/images/natureview.jpg"}
                            alt={`${villa.name} ${currentImage + 1}`}
                            className="vd-gallery-modal-img"
                            fill
                            sizes="100vw"
                            style={{ objectFit: "contain" }}
                            priority
                        />
                    </div>

                    {/* Next button */}
                    <button className="vd-gallery-modal-arrow vd-gallery-modal-arrow-right" onClick={nextImage}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>

                    {/* Thumbnail strip */}
                    <div className="vd-gallery-modal-thumbs">
                        {villa.images.filter(img => !!img).map((img, i) => (
                            <div
                                key={i}
                                className={`vd-gallery-modal-thumb ${i === currentImage ? 'vd-gallery-modal-thumb-active' : ''}`}
                                onClick={() => setCurrentImage(i)}
                            >
                                <Image
                                    src={img}
                                    alt={`Thumb ${i + 1}`}
                                    fill
                                    sizes="80px"
                                    style={{ objectFit: "cover" }}
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Reservation Bottom Sheet */}
            {showBottomSheet && checkInDate && checkOutDate && (
                <ReservationBottomSheet
                    checkIn={checkInDate}
                    checkOut={checkOutDate}
                    priceRanges={villa.calendarPrices}
                    deposit={villa.deposit}
                    checkInTime={villa.checkIn}
                    checkOutTime={villa.checkOut}
                    currency={activeCurrency.symbol}
                    villaSlug={villa.slug}
                    onClose={handleBottomSheetClose}
                />
            )}
            {/* Discounts Modal */}
            {showDiscountsModal && (
                <>
                    <div className="vd-modal-overlay" onClick={() => setShowDiscountsModal(false)} />
                    <div className="vd-modal-discounts">
                        <div className="vd-modal-header">
                            <div style={{ fontWeight: 600 }}>İndirimleri</div>
                            <div className="vd-modal-close" onClick={() => setShowDiscountsModal(false)}>Kapat</div>
                        </div>
                        <div className="vd-modal-table-wrap">
                            <div className="vd-modal-table">
                                <div className="vd-modal-table-head">
                                    <div style={{ width: '30%', padding: '16px 8px', fontWeight: 600, borderRight: '1px solid #a6b5cc' }}>İndirim Detayı</div>
                                    <div style={{ width: '20%', padding: '16px 8px', fontWeight: 600, borderRight: '1px solid #a6b5cc' }}>İndirim Oranı</div>
                                    <div style={{ width: '50%', padding: '16px 8px', fontWeight: 600 }}>Geçerli olduğu süre</div>
                                </div>
                                {villa.priceBlocks
                                    .filter(pb => pb.discount > 0)
                                    .map((pb, i) => (
                                        <div key={i} className="vd-modal-table-row">
                                            <div style={{ width: '30%', padding: '16px 8px', fontWeight: 600, borderRight: '1px solid #dfdfe3' }}>Özel İndirim</div>
                                            <div style={{ width: '20%', padding: '16px 8px', fontWeight: 500, borderRight: '1px solid #dfdfe3' }}>{pb.discount}%</div>
                                            <div style={{ width: '50%', padding: '16px 8px', fontWeight: 500 }}>{pb.period}</div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </>
            )}


            {/* Mobile Sticky Bottom Bar */}
            <div className="vd-mobile-sticky-bar">
                <div className="vd-mobile-sticky-inner">
                    <a
                        href="https://wa.me/905323990748"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="vd-mobile-wp-btn"
                    >
                        <svg viewBox="0 0 24 24" fill="#fff" width="20" height="20">
                            <path d="M12 2C6.48 2 2 6.48 2 12c0 2.17.69 4.18 1.86 5.86L3 22l4.28-.84C8.83 23.01 10.37 23 12 23c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.83 14.33c-.26.74-1.27 1.46-1.92 1.55-.54.08-1.23.23-3.83-.84-3.14-1.3-5.18-4.51-5.33-4.71-.16-.21-1.28-1.7-1.28-3.24 0-1.54.8-2.31 1.08-2.61.28-.31.62-.39.83-.39.21 0 .42 0 .61.01.19.01.44-.07.67.48.24.56.81 1.99.88 2.14.08.15.13.33.02.54-.11.21-.16.33-.32.53-.15.18-.33.39-.47.53-.16.16-.33.34-.14.67.18.32.81 1.34 1.74 2.16 1.2.11 2.21.46 2.44.6.24.13.37.11.51-.05.15-.17.65-.75.82-1.01.17-.26.34-.22.65-.11.31.11 1.94.91 2.28 1.08.33.17.56.26.64.4.08.14.08.82-.18 1.56z" />
                        </svg>
                        <span>WhatsApp</span>
                    </a>
                    <button
                        className="vd-mobile-call-btn"
                        onClick={() => setShowCallbackModal(true)}
                    >
                        <svg viewBox="0 0 24 24" fill="#fff" width="20" height="20">
                            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                        </svg>
                        <span>Sizi Arayalım</span>
                    </button>
                </div>
            </div>
            {/* Callback Modal */}
            <CallbackModal
                isOpen={showCallbackModal}
                onClose={() => setShowCallbackModal(false)}
                villaName={villa.name}
                villaSlug={villa.slug}
            />
        </div>
    );
}

/* ─────────────── Sub-Components ─────────────── */

function PriceBlockCard({ block, weekly, formatPriceFn }: { block: PriceBlock; weekly: boolean; formatPriceFn: (tryAmount: number) => string }) {
    const price = weekly ? block.weeklyPrice : block.nightlyPrice;
    const originalPrice = block.originalPrice
        ? weekly ? block.originalPrice * 7 : block.originalPrice
        : null;

    return (
        <div className="vd-price-block">
            <div className="vd-pb-period">{block.period}.</div>
            <div className="vd-pb-original">
                {block.discount > 0 && originalPrice ? (
                    <span className="vd-pb-strikethrough">{formatPriceFn(Math.round(originalPrice))}</span>
                ) : null}
            </div>
            <div className="vd-pb-price">{formatPriceFn(price)}</div>
            <div className="vd-pb-min">Min {block.minNights} Gece Rezervasyon</div>
        </div>
    );
}

function DistanceItem({ icon, label, value }: { icon: string; label: string; value: string }) {
    return (
        <div className="vd-distance-item">
            <img src={icon} alt={label} className="vd-distance-icon" />
            <div>
                <div className="vd-distance-label">{label}</div>
                <div className="vd-distance-value">{value}</div>
            </div>
        </div>
    );
}

function RuleCard({ img, label }: { img: string; label: string }) {
    return (
        <div className="vd-rule-card">
            <div className="vd-rule-icon">
                <img src={img} alt="" />
            </div>
            <div className="vd-rule-label">
                {label.split(/\\n|\n/).map((line, i) => (
                    <span key={i}>{line}<br /></span>
                ))}
            </div>
        </div>
    );
}

function ScoreBar({ percent }: { percent: number }) {
    return (
        <div className="vd-score-bar-row">
            <div className="vd-score-track">
                <div className="vd-score-fill" style={{ width: `${percent}%` }}></div>
            </div>
            <div className="vd-score-percent poppins">{percent}%</div>
        </div>
    );
}

function ReviewCard({ review }: { review: Review }) {
    return (
        <div className="vd-review-item">
            <div className="vd-review-avatar poppins">{review.authorName[0]}</div>
            <div className="vd-review-main">
                <div className="vd-review-header">
                    <div>
                        <div className="vd-review-author poppins">{review.authorName} {review.initial2}.</div>
                        <div className="vd-review-meta">
                            {review.nights < 5 ? "Birkaç gece konakladı" : "Bir hafta veya daha fazla konakladı"}
                            &nbsp;•&nbsp;{review.dateReadableTr}
                        </div>
                    </div>
                    <div className="vd-review-rate dm-sans">{review.rate}</div>
                </div>
                <div className="vd-review-body dm-sans">{review.body}</div>
            </div>
        </div>
    );
}
