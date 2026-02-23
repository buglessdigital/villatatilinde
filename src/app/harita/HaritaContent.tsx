"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { mockVillas, Villa } from "@/data/mockVillas";
import styles from "./harita.module.css";

/* ─── location map ─── */
const LOCATIONS: Record<string, string> = {
    kalkanMerkez: "Kalkan",
    kasMerkez: "Kaş",
    fethiyeMerkez: "Fethiye",
};

const LOCATION_CENTERS: Record<string, { lat: number; lng: number }> = {
    kalkanMerkez: { lat: 36.26690641097655, lng: 29.413696335212933 },
    kasMerkez: { lat: 36.19852204920669, lng: 29.646489301259447 },
    fethiyeMerkez: { lat: 36.644686556648175, lng: 29.1178709709374 },
};

const DEFAULT_CENTER = { lat: 36.26714783797067, lng: 29.413087884731077 };

/* ─── feature labels ─── */
const FEATURE_LABELS: Record<string, string> = {
    affordableVillas: "Ekonomik",
    isolatedVillas: "Muhafazakar",
    isolatedPoolVillas: "Havuzu Korunaklı",
    honeyMoon: "Balayı",
    ultraLux: "Ultra Lüx",
    centralVillas: "Merkezi",
    natureview: "Doğa İçinde",
    seaview: "Deniz Manzaralı",
    beachVillas: "Denize Yakın",
};

export default function HaritaContent() {
    return (
        <React.Suspense fallback={<div className={styles.loadingSpinner}>Yükleniyor...</div>}>
            <HaritaInner />
        </React.Suspense>
    );
}

function HaritaInner() {
    const searchParams = useSearchParams();

    /* ─── URL-derived initial state ─── */
    const initPeople = parseInt(searchParams.get("people") || "0", 10) || 0;
    const initFeatures = useMemo(() => {
        const f = searchParams.get("features");
        return f ? f.split(",").filter(Boolean) : [];
    }, [searchParams]);

    /* ─── State ─── */
    const [people, setPeople] = useState(initPeople);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>(initFeatures);
    const [locationDropOpen, setLocationDropOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);
    const [selectedVilla, setSelectedVilla] = useState<Villa | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    /* ─── Refs ─── */
    const mapRef = useRef<HTMLDivElement>(null);
    const googleMapRef = useRef<google.maps.Map | null>(null);
    const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
    const locationDropRef = useRef<HTMLDivElement>(null);
    const moreFiltersRef = useRef<HTMLDivElement>(null);

    /* ─── Close dropdowns when clicking outside ─── */
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (locationDropRef.current && !locationDropRef.current.contains(e.target as Node)) {
                setLocationDropOpen(false);
            }
            if (moreFiltersRef.current && !moreFiltersRef.current.contains(e.target as Node)) {
                setMoreFiltersOpen(false);
            }
        }
        window.addEventListener("click", handleClickOutside, true);
        return () => window.removeEventListener("click", handleClickOutside, true);
    }, []);

    /* ─── Filter villas ─── */
    const filteredVillas = useMemo(() => {
        return mockVillas.filter((v) => {
            // People filter
            if (people > 0 && (v.guests < people || v.guests > people + 1)) return false;
            // Feature filter
            if (selectedFeatures.length > 0 && !selectedFeatures.every((f) => v.features.includes(f))) return false;
            return true;
        });
    }, [people, selectedFeatures]);

    /* ─── Build marker content ─── */
    const buildMarkerContent = useCallback((villa: Villa) => {
        const content = document.createElement("div");
        content.classList.add("map-property-marker");
        content.textContent = `₺${villa.minEver.toLocaleString("tr-TR")}`;
        return content;
    }, []);

    /* ─── Clear all markers ─── */
    const clearMarkers = useCallback(() => {
        markersRef.current.forEach((m) => (m.map = null));
        markersRef.current = [];
    }, []);

    /* ─── Set markers ─── */
    const setMarkers = useCallback(
        (map: google.maps.Map, villas: Villa[]) => {
            clearMarkers();
            const bounds = new google.maps.LatLngBounds();
            let lastHighlighted: google.maps.marker.AdvancedMarkerElement | null = null;

            for (const villa of villas) {
                if (!villa.position?.lat || !villa.position?.lng) continue;

                const marker = new google.maps.marker.AdvancedMarkerElement({
                    map,
                    content: buildMarkerContent(villa),
                    position: villa.position,
                    title: villa.name,
                });

                marker.addListener("gmp-click", () => {
                    // Remove highlight from previous
                    if (lastHighlighted) {
                        (lastHighlighted.content as HTMLElement)?.classList.remove("highlight");
                    }
                    // Add highlight
                    (marker.content as HTMLElement)?.classList.add("highlight");
                    lastHighlighted = marker;
                    marker.zIndex = 999;
                    setSelectedVilla(villa);
                });

                // Clear selection on map click/drag
                map.addListener("click", () => {
                    if (lastHighlighted) {
                        (lastHighlighted.content as HTMLElement)?.classList.remove("highlight");
                        lastHighlighted = null;
                    }
                    setSelectedVilla(null);
                });
                map.addListener("drag", () => {
                    if (lastHighlighted) {
                        (lastHighlighted.content as HTMLElement)?.classList.remove("highlight");
                        lastHighlighted = null;
                    }
                    setSelectedVilla(null);
                });

                markersRef.current.push(marker);
                bounds.extend(villa.position);
            }

            // Fit bounds if multiple villas
            if (villas.length > 1) {
                map.fitBounds(bounds);
            } else if (villas.length === 1 && villas[0].position) {
                map.setCenter(villas[0].position);
                map.setZoom(15);
            }
        },
        [buildMarkerContent, clearMarkers]
    );

    /* ─── Initialize Google Maps ─── */
    const initMap = useCallback(async () => {
        if (!mapRef.current || googleMapRef.current) return;

        const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
        await google.maps.importLibrary("marker");

        const map = new Map(mapRef.current, {
            zoom: 15,
            maxZoom: 19,
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            clickableIcons: false,
            rotateControl: false,
            fullscreenControl: false,
            center: DEFAULT_CENTER,
            mapId: "43cd647a717b558c",
        });

        googleMapRef.current = map;
        setMapLoaded(true);
        setMarkers(map, filteredVillas);
    }, [filteredVillas, setMarkers]);

    /* ─── Load Google Maps script ─── */
    useEffect(() => {
        if (typeof google !== "undefined" && typeof google.maps !== "undefined") {
            initMap();
        } else {
            const script = document.createElement("script");
            script.src =
                "https://maps.googleapis.com/maps/api/js?key=AIzaSyCIcgGlXhmYhpRdzSPW5cCcoZpLVa_Majc&libraries=&v=weekly";
            script.async = true;
            script.defer = true;
            script.onload = () => initMap();
            document.head.appendChild(script);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ─── Update markers when filters change ─── */
    useEffect(() => {
        if (googleMapRef.current && mapLoaded) {
            setMarkers(googleMapRef.current, filteredVillas);
        }
    }, [filteredVillas, mapLoaded, setMarkers]);

    /* ─── Pan to location ─── */
    const panToLocation = (key: string) => {
        setSelectedLocation(key);
        setLocationDropOpen(false);
        const center = LOCATION_CENTERS[key];
        if (center && googleMapRef.current) {
            googleMapRef.current.panTo(center);
            googleMapRef.current.setZoom(14);
        }
    };

    /* ─── People controls ─── */
    const decrementPeople = () => setPeople((p) => Math.max(0, p - 1));
    const incrementPeople = () => setPeople((p) => Math.min(20, p + 1));

    /* ─── Toggle feature ─── */
    const toggleFeature = (feat: string) => {
        setSelectedFeatures((prev) =>
            prev.includes(feat) ? prev.filter((f) => f !== feat) : [...prev, feat]
        );
    };

    /* ─── Clear all filters ─── */
    const clearAllFilters = () => {
        setPeople(0);
        setSelectedFeatures([]);
        setSelectedLocation("");
        setSelectedVilla(null);
        if (googleMapRef.current) {
            googleMapRef.current.panTo(DEFAULT_CENTER);
            googleMapRef.current.setZoom(12);
        }
    };

    /* ─── Search (reload markers from filters) ─── */
    const handleSearch = () => {
        setSelectedVilla(null);
        if (googleMapRef.current && mapLoaded) {
            setMarkers(googleMapRef.current, filteredVillas);
        }
    };

    /* ─── Active filter count for badge ─── */
    const activeFilterCount = selectedFeatures.length;

    return (
        <div className={styles.pageWrapper}>
            {/* ═══════ TOP FILTER BAR ═══════ */}
            <div className={styles.filterBar}>
                <div className={styles.filterBarInner}>
                    <div className={styles.filterRow}>
                        {/* Input group: 3 filters + more icon */}
                        <div className={styles.inputGroup}>
                            {/* 1. Location Dropdown */}
                            <div className={styles.filterCol} ref={locationDropRef}>
                                <div
                                    className={`${styles.filterInput} dm-sans`}
                                    onClick={() => setLocationDropOpen(!locationDropOpen)}
                                >
                                    {selectedLocation ? (
                                        <span style={{ color: "#000", fontWeight: 600 }}>
                                            {LOCATIONS[selectedLocation]}
                                        </span>
                                    ) : (
                                        <span style={{ color: "#747579" }}>Otomatik Zoom</span>
                                    )}
                                </div>
                                {selectedLocation && (
                                    <img
                                        src="/images/close.svg"
                                        alt="Temizle"
                                        className={styles.clearIcon}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedLocation("");
                                            if (googleMapRef.current) {
                                                const bounds = new google.maps.LatLngBounds();
                                                filteredVillas.forEach((v) => {
                                                    if (v.position?.lat && v.position?.lng) bounds.extend(v.position);
                                                });
                                                if (!bounds.isEmpty()) {
                                                    googleMapRef.current.fitBounds(bounds);
                                                }
                                            }
                                        }}
                                    />
                                )}
                                {locationDropOpen && (
                                    <div className={styles.dropdown}>
                                        {Object.entries(LOCATIONS).map(([key, label]) => (
                                            <div
                                                key={key}
                                                className={styles.dropdownItem}
                                                onClick={() => panToLocation(key)}
                                            >
                                                {label}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 2. Date Select (placeholder) */}
                            <div className={styles.filterCol}>
                                <div className={`${styles.filterInput} dm-sans`}>
                                    <span style={{ color: "#747579" }}>Tarih Seçimi</span>
                                </div>
                            </div>

                            {/* 3. People Count */}
                            <div className={styles.filterCol}>
                                <div className={`${styles.filterInputPeople} dm-sans`}>
                                    <span>Kişi Sayısı</span>
                                    <div className={styles.peopleControls}>
                                        <div className={styles.peopleBtn} onClick={decrementPeople}>
                                            &minus;
                                        </div>
                                        <div className={styles.peopleValue}>
                                            {people > 0 ? people : "Tümü"}
                                        </div>
                                        <div className={styles.peopleBtn} onClick={incrementPeople}>
                                            &#43;
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 4. More Filters Icon */}
                            <div className={styles.moreFiltersWrap} ref={moreFiltersRef}>
                                <div style={{ position: "relative" }}>
                                    <img
                                        src="/images/sliders.png"
                                        alt="Filtreler"
                                        className={styles.moreFiltersIcon}
                                        onClick={() => setMoreFiltersOpen(!moreFiltersOpen)}
                                    />
                                    {activeFilterCount > 0 && (
                                        <div className={styles.filterBadge}>{activeFilterCount}</div>
                                    )}
                                </div>

                                {/* More Filters Popover */}
                                {moreFiltersOpen && (
                                    <div className={styles.moreFiltersPopover}>
                                        <div style={{ padding: 20 }}>
                                            <div style={{ padding: 16 }}>
                                                <div className="poppins" style={{ fontWeight: 700, fontSize: 16 }}>
                                                    Villa Türü
                                                </div>
                                                <div style={{ marginTop: 10 }}>
                                                    {Object.entries(FEATURE_LABELS).map(([key, label]) => (
                                                        <div key={key} style={{ marginTop: 3 }}>
                                                            <label className={`${styles.checkboxLabel} dm-sans`}>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedFeatures.includes(key)}
                                                                    onChange={() => toggleFeature(key)}
                                                                />
                                                                <span style={{ color: "#747579", marginLeft: 8 }}>
                                                                    {label}
                                                                </span>
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 5. Action Buttons */}
                        <div className={styles.actionButtons}>
                            <div className={styles.clearBtn} onClick={clearAllFilters}>
                                Sıfırla
                            </div>
                            <div className={styles.searchBtn} onClick={handleSearch}>
                                ARA{" "}
                                <img
                                    src="/images/search3w.png"
                                    alt="Ara"
                                    style={{ marginLeft: 5, height: 17 }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* People info bar */}
                    {people > 0 && (
                        <div className={styles.peopleInfoBar}>
                            <div className={styles.peopleInfoPill}>
                                {people} - {people + 1} Kişilik Villalar Gösteriliyor
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ═══════ MAP ═══════ */}
            {!mapLoaded && (
                <div className={styles.loadingSpinner}>
                    <div className={styles.spinner}></div>
                </div>
            )}
            <div ref={mapRef} className={styles.mapContainer}></div>

            {/* ═══════ SELECTED VILLA CARD ═══════ */}
            {selectedVilla && (
                <div className={styles.villaPreview}>
                    <Link href={`/tatilvillasi/${selectedVilla.slug}`} className={styles.villaPreviewLink}>
                        <div className={styles.villaPreviewInner}>
                            <img
                                src={selectedVilla.coverImage}
                                alt={selectedVilla.name}
                                className={styles.villaPreviewImage}
                            />
                            <div className={styles.villaPreviewInfo}>
                                <div className={`dm-sans ${styles.villaPreviewName}`}>
                                    {selectedVilla.name}
                                </div>
                                <div className={styles.villaPreviewMeta}>
                                    <img src="/images/bed.svg" alt="" style={{ height: 14, marginRight: 7 }} />
                                    {selectedVilla.bedrooms}
                                    <img
                                        src="/images/bathsolid.svg"
                                        alt=""
                                        style={{ marginLeft: 16, height: 12, marginRight: 7 }}
                                    />
                                    {selectedVilla.baths}
                                    <img
                                        src="/images/people.svg"
                                        alt=""
                                        style={{ marginLeft: 16, height: 16, marginRight: 7 }}
                                    />
                                    {selectedVilla.guests} Kişilik
                                </div>
                                {selectedVilla.score > 0 && (
                                    <div className={styles.villaPreviewScore}>
                                        <img src="/images/star.svg" alt="" style={{ height: 11 }} />
                                        <span style={{ marginLeft: 6 }}>{selectedVilla.score}</span>
                                    </div>
                                )}
                                <div className={styles.villaPreviewPrice}>
                                    <div>Fiyat Aralığı</div>
                                    <div style={{ marginTop: 2, fontWeight: 500 }}>
                                        ₺{selectedVilla.minEver.toLocaleString("tr-TR")}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            )}
        </div>
    );
}
