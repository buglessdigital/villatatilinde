"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getVillaBySlug, formatDistance } from "@/data/mockVillas";
import type { Villa, PriceBlock, Review } from "@/data/mockVillas";
import ReservationCalendar from "@/components/ReservationCalendar";
import ReservationBottomSheet from "@/components/ReservationBottomSheet";
import { useCurrency } from "@/context/CurrencyContext";

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

const INCLUDED_SERVICES = [
    { img: "/images/water.png", label: "Su\nKullanımı" },
    { img: "/images/outlet.png", label: "Elektrik\nKullanımı" },
    { img: "/images/wifi2.png", label: "WiFi\nKullanımı" },
    { img: "/images/stove.png", label: "Tüpgaz\nKullanımı" },
    { img: "/images/poolcleaning.png", label: "Havuz\nTemizliği" },
];

/* ─────────────── Main Component ─────────────── */
export default function VillaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const [villa, setVilla] = useState<Villa | null>(null);
    const [loading, setLoading] = useState(true);

    // Image gallery
    const [currentImage, setCurrentImage] = useState(0);
    const [fullscreen, setFullscreen] = useState(false);

    // Pricing
    const [weeklyShow, setWeeklyShow] = useState(false);

    // Reservation
    const [checkInDate, setCheckInDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");
    const [showBottomSheet, setShowBottomSheet] = useState(false);

    // Ref to clear calendar dates from parent
    const clearCalendarRef = useRef<(() => void) | null>(null);

    // Wishlist
    const [wished, setWished] = useState(false);

    // Discounts modal
    const [showDiscountsModal, setShowDiscountsModal] = useState(false);

    const reservationRef = useRef<HTMLDivElement>(null);

    // Currency context
    const { formatPrice, currency: activeCurrency, convertPrice } = useCurrency();

    // Resolve params
    useEffect(() => {
        params.then(({ slug }) => {
            const found = getVillaBySlug(slug);
            if (!found) {
                notFound();
            }
            setVilla(found);
            setLoading(false);
        });
    }, [params]);

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
                            onClick={() => setWished(!wished)}
                        >
                            <img
                                src={wished ? "/images/heartsolid.svg" : "/images/heart.png"}
                                alt="Favori"
                                style={{ height: 16 }}
                            />
                        </div>

                        {/* Main Image */}
                        <div className="vd-gallery-main">
                            <img
                                src={villa.images[currentImage]}
                                alt={`${villa.name} ${currentImage + 1}`}
                                className="vd-gallery-img"
                            />
                            <button className="vd-gallery-arrow vd-gallery-arrow-left" onClick={prevImage}>
                                ‹
                            </button>
                            <button className="vd-gallery-arrow vd-gallery-arrow-right" onClick={nextImage}>
                                ›
                            </button>
                        </div>

                        {/* Thumbnails */}
                        <div className="vd-gallery-thumbs">
                            {villa.images.map((img, i) => (
                                <div
                                    key={i}
                                    className={`vd-thumb ${i === currentImage ? "vd-thumb-active" : ""}`}
                                    onClick={() => setCurrentImage(i)}
                                >
                                    <img src={img} alt={`Thumbnail ${i + 1}`} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="vd-stripe2-right">
                        {/* Price Header */}
                        <div className="vd-price-header">
                            <div className="vd-price-big">
                                {formatPrice(villa.minEver)}
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
                                    <PriceBlockCard key={i} block={pb} weekly={weeklyShow} formatPriceFn={formatPrice} />
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
                            </div>
                        </section>

                        {/* Önemli Bilgiler + Genel Özellikler */}
                        <div className="vd-info-features-row">
                            <div className="vd-info-col">
                                <h2 className="vd-section-title poppins">Önemli Bilgiler</h2>
                                <div className="vd-info-items">
                                    <div className="vd-info-item">
                                        <div className="vd-info-label">Depozito</div>
                                        <div className="vd-info-value">: {formatPrice(villa.deposit)} <img src="/images/question.svg" alt="?" className="vd-info-q" /></div>
                                    </div>
                                    <div className="vd-info-item">
                                        <div className="vd-info-label">Temizlik <span className="vd-info-small">( {villa.minResCleaning} gün ve altı için )</span></div>
                                        <div className="vd-info-value">: {formatPrice(villa.cleaning)} <img src="/images/question.svg" alt="?" className="vd-info-q" /></div>
                                    </div>
                                    <div className="vd-info-item">
                                        <div className="vd-info-label">Min Rezervasyon</div>
                                        <div className="vd-info-value">: {villa.minRes} Gün</div>
                                    </div>
                                    <div className="vd-info-item">
                                        <div className="vd-info-label">İptal Politikası</div>
                                        <div className="vd-info-value">: Detaylar <img src="/images/iconlink.svg" alt="link" style={{ marginLeft: 6, height: 20 }} /></div>
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
                            <div className="vd-res-dates">
                                <div className="vd-res-date-input">
                                    <input
                                        type="date"
                                        value={checkInDate}
                                        onChange={(e) => setCheckInDate(e.target.value)}
                                        placeholder="Giriş Tarihi"
                                    />
                                </div>
                                <div className="vd-res-date-input">
                                    <input
                                        type="date"
                                        value={checkOutDate}
                                        onChange={(e) => setCheckOutDate(e.target.value)}
                                        placeholder="Çıkış Tarihi"
                                    />
                                </div>
                            </div>

                            <div className="vd-res-info-text">
                                Her villamızın farklı giriş günleri olmasından ve boşluk bırakılmadan kiralamaya verildiğinden, ön talep öncesi teyit alınız.
                            </div>
                            <div className="vd-res-info-text" style={{ marginTop: 12 }}>
                                Villamıza ait avantajlı fiyatlar ve farklı gün seçenekleri için{" "}
                                <a href="tel:+902426060725" style={{ fontWeight: 600 }}>+90 242 606 0725</a>{" "}
                                numarasını arayabilir, dilerseniz Whatsapp üzerinden de iletişime geçebilirsiniz.
                            </div>

                            <button className="vd-res-submit-btn">
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
                        <div className="vd-promo-btn" style={{ background: "#eeeeeeaa", color: "#999" }}>
                            <img src="/images/mn.png" alt="" style={{ height: 20, marginRight: 6 }} />
                            Kısa süreli konaklama fırsatları için tıklayın <strong>&nbsp;tıklayın</strong>
                        </div>

                        {/* Map */}
                        <div className="vd-map-section">
                            <iframe
                                src={villa.mapIframe}
                                width="100%"
                                height="315"
                                style={{ border: 0, overflow: "hidden" }}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${villa.position.lat},${villa.position.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <div className="vd-directions-btn">Yol Tarifi</div>
                            </a>
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
                            {villa.pet && <RuleCard img="/images/petnot.png" label="Evcil Hayvana\nİzin Verilmiyor" />}
                            {villa.smoke && <RuleCard img="/images/nosmoking.png" label="İç Mekanda Sigara\nİçilmez" />}
                            {villa.party && <RuleCard img="/images/noparty.png" label="Parti ve Toplantı\nYapılmaz" />}
                            {villa.sound && <RuleCard img="/images/noloud.png" label="Yüksek Ses\nYapılmaz" />}
                        </div>
                    </section>

                    {/* ─── Rezervasyon Takvimi ─── */}
                    <ReservationCalendar
                        priceRanges={villa.calendarPrices}
                        reservations={villa.calendarReservations}
                        currency={activeCurrency.symbol}
                        onDateSelect={handleCalendarDateSelect}
                        clearDatesRef={clearCalendarRef}
                    />

                    {/* Fiyata Dahil Hizmetler */}
                    <section className="vd-section vd-center-section">
                        <h2 className="vd-section-title poppins vd-center-title">Fiyata Dahil Hizmetler</h2>
                        <div className="vd-premium-grid">
                            {INCLUDED_SERVICES.map((s, i) => (
                                <div key={i} className="vd-premium-card">
                                    <div className="vd-premium-icon">
                                        <img src={s.img} alt={s.label} />
                                    </div>
                                    <div className="vd-premium-label">
                                        {s.label.split("\n").map((line, li) => (
                                            <span key={li}>{line}<br /></span>
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
                            <div className="vd-video-placeholder">
                                <img src={villa.coverImage} alt={villa.name} className="vd-video-cover" />
                                <div className="vd-video-text">Villa Videosu Hazırlanıyor</div>
                            </div>
                        </div>
                        <div className="vd-map-side">
                            <h2 className="vd-section-title poppins">Villa Konumu</h2>
                            <div className="vd-map-embed">
                                <iframe
                                    src={villa.mapIframe}
                                    width="100%"
                                    height="350"
                                    style={{ border: 0, overflow: "hidden" }}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${villa.position.lat},${villa.position.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <div className="vd-directions-btn">Yol Tarifi</div>
                            </a>
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
                        <div style={{ marginTop: 22, display: "flex", justifyContent: "flex-start" }}>
                            <Link href="/yorum-yap">
                                <div className="vd-review-btn">Yorum Yap</div>
                            </Link>
                        </div>
                    </section>

                    {/* Merak Ettikleriniz */}
                    <section className="vd-section">
                        <h2 className="vd-section-title poppins">Merak Ettikleriniz</h2>
                        <div className="vd-faq-row">
                            <div className="vd-faq-card">
                                <img src="/images/me.svg" alt="" />
                                <div className="vd-faq-card-title poppins">
                                    Villa ile İlgili Soru Sor &amp;<br />Cevaplanmış Soruları Görüntüle
                                </div>
                                <div className="vd-faq-card-desc dm-sans">
                                    İncelediğiniz villa ile ilgili sormak istediğiniz tüm detaylar için buradan soru oluşturabilir veya önceden sorulmuş birçok soru ve cevabına gözatabilirsiniz
                                </div>
                                <Link href="/sorular">
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

            {/* Fullscreen Gallery Modal */}
            {fullscreen && (
                <div className="vd-fullscreen-overlay" onClick={() => setFullscreen(false)}>
                    <div className="vd-fullscreen-close" onClick={() => setFullscreen(false)}>✕</div>
                    <img
                        src={villa.images[currentImage]}
                        alt={villa.name}
                        className="vd-fullscreen-img"
                        onClick={(e) => e.stopPropagation()}
                    />
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
                    <button
                        className="vd-mobile-loc-btn"
                        onClick={() => {
                            const mapEl = document.getElementById('villaMap');
                            if (mapEl) mapEl.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        <img src="/images/locationdotsolid.svg" alt="" style={{ height: 11 }} />
                        Villa <br /> Konumu
                    </button>
                    <button
                        className="vd-mobile-date-btn"
                        onClick={() => {
                            const calEl = document.getElementById('parsedyCal');
                            if (calEl) calEl.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        <div style={{ fontWeight: 600, fontSize: 18 }}>Tarih Seçin</div>
                        <div style={{ fontSize: 16, marginTop: 2, color: '#ffffffa6', fontWeight: 300 }}>fiyatlar tarihlerin üzerindedir</div>
                    </button>
                </div>
            </div>
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
            {block.discount > 0 && originalPrice && (
                <div className="vd-pb-original">
                    <span className="vd-pb-strikethrough">{formatPriceFn(Math.round(originalPrice))}</span>
                </div>
            )}
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
                {label.split("\n").map((line, i) => (
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
