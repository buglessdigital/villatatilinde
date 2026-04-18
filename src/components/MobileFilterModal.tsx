"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// Calendar Helpers
const MONTH_NAMES_TR = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

function daysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

function getMondayBasedDay(year: number, month: number, day: number): number {
    const d = new Date(year, month, day).getDay(); // 0=Sun
    return d === 0 ? 6 : d - 1;
}

function isSameDay(a: Date | null, b: Date | null): boolean {
    if (!a || !b) return false;
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

function isBeforeDay(a: Date, b: Date): boolean {
    const MathA = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
    const MathB = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
    return MathA < MathB;
}

function isBetween(d: Date, start: Date | null, end: Date | null): boolean {
    if (!start || !end) return false;
    const MathD = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const MathS = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
    const MathE = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
    return MathD > MathS && MathD < MathE;
}

function formatDateParam(d: Date | null): string {
    if (!d) return "";
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

interface MobileFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileFilterModal({ isOpen, onClose }: MobileFilterModalProps) {
    const router = useRouter();
    const [people, setPeople] = useState(0);

    const [selectedPools, setSelectedPools] = useState<string[]>([]);
    const [selectedCats, setSelectedCats] = useState<string[]>([]);

    React.useEffect(() => {
        if (isOpen) {
            document.body.classList.add("modal-open");
        } else {
            document.body.classList.remove("modal-open");
        }
        return () => {
            document.body.classList.remove("modal-open");
        };
    }, [isOpen]);
    const [searchTerm, setSearchTerm] = useState("");
    const [minScore, setMinScore] = useState<number | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<string>("");
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [dbLocations, setDbLocations] = useState<{value: string, label: string}[]>([]);

    React.useEffect(() => {
        supabase.from("destinations").select("name, filter_param").eq("is_active", true).order("sort_order")
            .then(({ data }) => {
                if (data) {
                    setDbLocations([{ value: "", label: "Tüm Konumlar" }, ...data.map(d => ({ value: d.filter_param, label: d.name }))]);
                }
            });
    }, []);

    // Price state
    const [minPrice, setMinPrice] = useState(1000);
    const [maxPrice, setMaxPrice] = useState(100000);

    // Calendar state
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    if (!isOpen) return null;

    const navToResults = () => {
        onClose();
        const params = new URLSearchParams();
        if (people > 0) params.set("people", people.toString());
        if (searchTerm.trim()) params.set("search", searchTerm.trim());
        if (minScore) params.set("score", minScore.toString());
        if (startDate) params.set("start", formatDateParam(startDate));
        if (endDate) params.set("end", formatDateParam(endDate));
        if (selectedLocation) params.set("location", selectedLocation);

        // Pass price if not default
        if (minPrice > 1000 || maxPrice < 100000) {
            params.set("minPrice", minPrice.toString());
            params.set("maxPrice", maxPrice.toString());
        }

        const allFeatures = [...selectedPools, ...selectedCats];
        if (allFeatures.length > 0) {
            params.set("features", allFeatures.join(","));
        }

        router.push(`/sonuclar?${params.toString()}`);
    };

    const handleDateClick = (clickedDate: Date) => {
        if (!startDate || (startDate && endDate)) {
            setStartDate(clickedDate);
            setEndDate(null);
        } else {
            if (isBeforeDay(clickedDate, startDate)) {
                setStartDate(clickedDate);
            } else {
                setEndDate(clickedDate);
            }
        }
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        const checkPrev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        if (checkPrev >= thisMonth) {
            setCurrentMonth(checkPrev);
        }
    };

    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDayOfWeek = getMondayBasedDay(year, month, 1);
        const numDays = daysInMonth(year, month);
        const days = [];

        // Empties out beginning
        for (let i = 0; i < firstDayOfWeek; i++) {
            days.push(null);
        }

        for (let i = 1; i <= numDays; i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const togglePool = (pool: string) => {
        setSelectedPools((prev) =>
            prev.includes(pool) ? prev.filter((p) => p !== pool) : [...prev, pool]
        );
    };

    const toggleCat = (cat: string) => {
        setSelectedCats((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
        );
    };

    const getLocLabel = (val: string) => {
        if (!val) return "Hepsi";
        const found = dbLocations.find(o => o.value === val);
        return found ? found.label : "Hepsi";
    };

    const poolTags = [
        { label: "Özel Havuz", key: "privatePool" },
        { label: "Paylaşımlı Havuz", key: "sharedPool" },
        { label: "Sonsuzluk Havuzu", key: "infinityPool" },
        { label: "Muhafazakar Havuzlu Villalar", key: "isolatedPoolVillas" },
        { label: "Kapalı Havuzu", key: "indoorPool" },
        { label: "Isıtmalı Havuzu", key: "heatedPool" },
        { label: "Sığ Havuz", key: "shallowPool" },
        { label: "Çocuk Havuzlu", key: "kidPoolVillas" }
    ];

    const catTags = [
        { label: "Ekonomik Villalar", key: "affordableVillas" },
        { label: "Muhafazakar Villalar", key: "isolatedVillas" },
        { label: "Balayı Villaları", key: "honeyMoon" },
        { label: "Ultra Lüx Villalar", key: "ultraLux" },
        { label: "Merkezi Konumda Bulunan Villalar", key: "centralVillas" },
        { label: "Denize Yakın Villalar", key: "beachVillas" },
        { label: "Deniz Manzaralı Villalar", key: "seaview" },
        { label: "Doğa Manzaralı Villalar", key: "natureview" },
        { label: "Havuzu Dışarıdan Görünmeyen Villalar", key: "isolatedPoolVillas" },
        { label: "Jakuzili Villalar", key: "jacuzziVillas" },
        { label: "Çocuk Havuzlu Villalar", key: "kidPoolVillas" },
        { label: "Yeni Villalar", key: "newVillas" }
    ];

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 99999, // Ensure it's on top
                background: "#fff",
                display: "flex",
                flexDirection: "column",
                fontFamily: '"DM Sans", serif'
            }}
        >
            {/* ─── Header ─── */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 20px",
                    borderBottom: "1px solid #f1f1f1"
                }}
            >
                <div style={{ width: 60 }} /> {/* spacer */}
                <div style={{ fontWeight: 700, fontSize: 17, color: "#111", letterSpacing: "-0.3px" }}>
                    Filtreler
                </div>
                <div
                    onClick={onClose}
                    style={{
                        width: 60,
                        color: "#dd3333",
                        fontSize: 14,
                        fontWeight: 600,
                        textAlign: "right",
                        cursor: "pointer"
                    }}
                >
                    Kapat
                </div>
            </div>

            {/* ─── Villa Arama ─── */}
            <div style={{ padding: "12px 20px", borderBottom: "1px solid #f1f1f1" }}>
                <div style={{ position: "relative" }}>
                    <img
                        src="/images/search3.png"
                        style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", height: 15, opacity: 0.5 }}
                        alt=""
                    />
                    <input
                        type="text"
                        placeholder="Villa ismi ile arayın..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "12px 16px 12px 40px",
                            border: "1px solid #e5e5e5",
                            borderRadius: 12,
                            fontSize: 15,
                            fontWeight: 500,
                            outline: "none",
                            fontFamily: "inherit",
                            boxSizing: "border-box",
                            background: "#fafafa",
                        }}
                    />
                </div>
            </div>

            {/* ─── Scrollable Content ─── */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", position: "relative" }}>

                {/* Konum */}
                <div style={{ marginBottom: 24, position: "relative" }}>
                    <div
                        onClick={() => setIsLocationOpen(!isLocationOpen)}
                        style={{
                            width: "100%",
                            border: "1px solid #eaeaea",
                            borderRadius: 14,
                            padding: "16px 20px",
                            fontSize: 15,
                            fontWeight: 700,
                            color: "#111",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                            backgroundColor: isLocationOpen ? "#f4f5f7" : "#fff",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            transition: "all 0.2s"
                        }}
                    >
                        <span style={{ color: "#777", fontWeight: 400 }}>Konum</span>
                        <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            {getLocLabel(selectedLocation)}
                        </span>
                    </div>

                    {isLocationOpen && (
                        <div style={{
                            position: "absolute",
                            top: "calc(100% + 8px)",
                            left: 0,
                            right: 0,
                            background: "#fff",
                            borderRadius: 12,
                            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                            border: "1px solid #eaeaea",
                            zIndex: 10,
                            maxHeight: 400,
                            overflowY: "auto",
                            padding: "16px 0",
                        }}>
                            {/* Upward Triangle Arrow */}
                            <div style={{
                                position: "absolute",
                                top: -6,
                                left: "50%",
                                transform: "translateX(-50%) rotate(45deg)",
                                width: 12,
                                height: 12,
                                background: "#fff",
                                borderLeft: "1px solid #eaeaea",
                                borderTop: "1px solid #eaeaea",
                                zIndex: 11
                            }} />

                            <div style={{ position: "relative", zIndex: 12 }}>
                                {dbLocations.map((loc, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => {
                                            setSelectedLocation(loc.value);
                                            setIsLocationOpen(false);
                                        }}
                                        style={{
                                            padding: "14px 24px",
                                            fontSize: 15,
                                            fontWeight: loc.value === "" ? 700 : 500,
                                            color: loc.value === "" ? "#111" : "#444",
                                            cursor: "pointer",
                                            background: selectedLocation === loc.value ? "#f8f9fa" : "transparent"
                                        }}
                                    >
                                        {loc.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Hide other content if location is open (optional, matching the overlay feel) */}
                <div style={{ display: isLocationOpen ? "none" : "block" }}>

                    {/* Simulated Calendar UI (Now Dynamic) */}
                    <div style={{ marginBottom: 32 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                            <div
                                onClick={prevMonth}
                                style={{
                                    color: currentMonth > new Date(today.getFullYear(), today.getMonth(), 1) ? "#111" : "#e0e0e0",
                                    fontSize: 16, cursor: "pointer", padding: "4px 8px", fontWeight: "bold"
                                }}
                            >
                                &lt;
                            </div>
                            <span style={{ fontWeight: 700, color: "#444", fontSize: 13, letterSpacing: 1, textTransform: "uppercase" }}>
                                {MONTH_NAMES_TR[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                            </span>
                            <div onClick={nextMonth} style={{ color: "#111", fontSize: 16, cursor: "pointer", padding: "4px 8px", fontWeight: "bold" }}>
                                &gt;
                            </div>
                        </div>
                        {/* Weekdays */}
                        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, color: "#a5a9b4", fontSize: 13, marginBottom: 12 }}>
                            <span>PT</span><span>SA</span><span>ÇA</span><span>PE</span><span>CU</span><span>CT</span><span>PZ</span>
                        </div>
                        {/* Days grid */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "10px 0", textAlign: "center", fontSize: 14, fontWeight: 600, color: "#111" }}>
                            {generateCalendarDays().map((d, index) => {
                                if (!d) return <span key={`empty-${index}`} style={{ color: "transparent" }}>.</span>;

                                const isPast = isBeforeDay(d, today);
                                const isStart = isSameDay(d, startDate);
                                const isEnd = isSameDay(d, endDate);
                                const _isBetween = isBetween(d, startDate, endDate);

                                let bg = "transparent";
                                let color = isPast ? "#ccc" : "#111";
                                let fontWeight = 500;
                                let inRange = false;

                                // The screenshot shows:
                                // Start day: rounded left, flat right, black border top/bottom/left
                                // Between days: flat, black border top/bottom
                                // End day: flat left, rounded right, black border top/bottom/right
                                // The fill color is light purple/gray "#e8eaf6"
                                // A separate circle "#f5f6f8" is shown inside Start when selecting before End

                                if (isStart && !endDate) {
                                    // Only start selected
                                    bg = "#f5f6f8";
                                    color = "#3a5b7c";
                                }

                                if ((isStart || isEnd || _isBetween) && endDate) {
                                    inRange = true;
                                    bg = "#e8eaf6"; // purple-ish background
                                    fontWeight = 700;
                                }

                                return (
                                    <div key={d.toString()} style={{ display: "flex", justifyContent: "center", position: "relative" }}>
                                        {/* The continuous background layer */}
                                        {inRange && (
                                            <div style={{
                                                position: "absolute",
                                                top: 0,
                                                bottom: 0,
                                                left: isStart ? "10%" : "-50%",
                                                right: isEnd ? "10%" : "-50%",
                                                background: bg,
                                                zIndex: 0,
                                                borderTop: "2px solid #111",
                                                borderBottom: "2px solid #111",
                                                borderLeft: isStart ? "2px solid #111" : "none",
                                                borderRight: isEnd ? "2px solid #111" : "none",
                                                borderTopLeftRadius: isStart ? 36 : 0,
                                                borderBottomLeftRadius: isStart ? 36 : 0,
                                                borderTopRightRadius: isEnd ? 36 : 0,
                                                borderBottomRightRadius: isEnd ? 36 : 0
                                            }} />
                                        )}

                                        {/* The actual clickable day number */}
                                        <div
                                            onClick={() => !isPast && handleDateClick(d)}
                                            style={{
                                                width: 36,
                                                height: 36,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: color,
                                                background: isStart && !endDate ? bg : "transparent",
                                                borderRadius: isStart && !endDate ? "50%" : 0,
                                                cursor: isPast ? "default" : "pointer",
                                                zIndex: 1,
                                                fontWeight: fontWeight,
                                            }}
                                        >
                                            {d.getDate()}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Kişi Kapasitesi */}
                    <div style={{
                        border: "1px solid #eaeaea",
                        borderRadius: 14,
                        padding: "20px",
                        marginBottom: 24,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: 17, color: "#111", display: "flex", alignItems: "center", gap: 6 }}>
                                    Kişi Kapasitesi
                                    <span style={{ background: "#e2e2e2", borderRadius: "50%", minWidth: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#666", fontWeight: 500 }}>?</span>
                                </div>
                                <div style={{ color: "#959fa8", fontSize: 13, marginTop: 4, fontWeight: 400 }}>Double, Twin or Single Bed</div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <div
                                    onClick={() => setPeople(Math.max(0, people - 1))}
                                    style={{ width: 32, height: 32, border: "1px solid #666", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 300, cursor: "pointer", color: "#111" }}
                                >
                                    &minus;
                                </div>
                                <span style={{ margin: "0 14px", fontSize: 14, fontWeight: 500, color: "#111", minWidth: 32, textAlign: "center" }}>
                                    {people > 0 ? people : "Tümü"}
                                </span>
                                <div
                                    onClick={() => setPeople(people + 1)}
                                    style={{ width: 32, height: 32, border: "1px solid #666", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 300, cursor: "pointer", color: "#111" }}
                                >
                                    &#43;
                                </div>
                            </div>
                        </div>
                    </div>

                    {startDate && endDate && (
                        <div style={{
                            border: "1px solid #eaeaea",
                            borderRadius: 14,
                            padding: "20px",
                            marginBottom: 24,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
                        }}>
                            <div style={{ fontWeight: 700, fontSize: 17, color: "#111", display: "flex", alignItems: "center", gap: 6 }}>
                                Toplam <span style={{ fontWeight: 400, color: "#666", fontSize: 13 }}>• {startDate.getDate()} {MONTH_NAMES_TR[startDate.getMonth()]} — {endDate.getDate()} {MONTH_NAMES_TR[endDate.getMonth()]}</span>
                            </div>
                        </div>
                    )}

                    {/* Fiyatlar - gecelik (simplified logic for demo) */}
                    <div style={{
                        border: "1px solid #eaeaea",
                        borderRadius: 14,
                        padding: "20px",
                        marginBottom: 32,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
                    }}>
                        <div style={{ fontWeight: 700, fontSize: 18, color: "#7a7a7a", marginBottom: 16 }}>
                            Fiyatlar <span style={{ fontWeight: 400, fontSize: 14, color: "#959fa8" }}>• gecelik</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 12, fontWeight: 600, color: "#111" }}>
                            <span>₺{minPrice}</span>
                            <span>₺{maxPrice}</span>
                        </div>

                        {/* Basic visual representation, setting manually to showcase logic limits */}
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <input
                                type="number"
                                value={minPrice}
                                onChange={(e) => setMinPrice(Math.max(1000, Number(e.target.value)))}
                                style={{ width: "100%", padding: "8px", borderRadius: 8, border: "1px solid #eaeaea", fontSize: 14 }}
                            />
                            <span style={{ color: "#888" }}>-</span>
                            <input
                                type="number"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(Math.min(100000, Number(e.target.value)))}
                                style={{ width: "100%", padding: "8px", borderRadius: 8, border: "1px solid #eaeaea", fontSize: 14 }}
                            />
                        </div>
                    </div>

                    {/* Havuz */}
                    <div style={{ marginBottom: 32 }}>
                        <div style={{ fontWeight: 700, fontSize: 19, color: "#8a8ea0", marginBottom: 14, letterSpacing: "-0.5px" }}>Havuz</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                            {poolTags.map(t => (
                                <div
                                    key={t.key}
                                    onClick={() => togglePool(t.key)}
                                    style={{
                                        border: selectedPools.includes(t.key) ? "1px solid #333" : "1px solid #f1f1f1",
                                        padding: "10px 14px",
                                        borderRadius: 10,
                                        fontSize: 13.5,
                                        fontWeight: selectedPools.includes(t.key) ? 600 : 500,
                                        color: selectedPools.includes(t.key) ? "#111" : "#111",
                                        background: selectedPools.includes(t.key) ? "#fff" : "#fafafa",
                                        transition: "all 0.2s"
                                    }}
                                >
                                    {t.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Kategoriler */}
                    <div style={{ marginBottom: 32 }}>
                        <div style={{ fontWeight: 700, fontSize: 19, color: "#8a8ea0", marginBottom: 14, letterSpacing: "-0.5px" }}>Kategoriler</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                            {catTags.map(t => (
                                <div
                                    key={t.key}
                                    onClick={() => toggleCat(t.key)}
                                    style={{
                                        border: selectedCats.includes(t.key) ? "1px solid #333" : "1px solid #f1f1f1",
                                        padding: "10px 14px",
                                        borderRadius: 10,
                                        fontSize: 13.5,
                                        fontWeight: selectedCats.includes(t.key) ? 600 : 500,
                                        color: selectedCats.includes(t.key) ? "#111" : "#111",
                                        background: selectedCats.includes(t.key) ? "#fff" : "#fafafa",
                                        transition: "all 0.2s"
                                    }}
                                >
                                    {t.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Yorum Puanı */}
                    <div style={{ marginBottom: 32 }}>
                        <div style={{ fontWeight: 700, fontSize: 19, color: "#8a8ea0", marginBottom: 16, letterSpacing: "-0.5px" }}>Yorum Puanı</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div
                                style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
                                onClick={() => setMinScore(minScore === 4.5 ? null : 4.5)}
                            >
                                <div style={{
                                    width: 22, height: 22, borderRadius: "50%",
                                    border: minScore === 4.5 ? "6px solid #111" : "2px solid #ccc"
                                }} />
                                <div style={{ fontSize: 15, color: "#777", fontWeight: 600 }}>4.5 ve üzeri</div>
                            </div>
                            <div
                                style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
                                onClick={() => setMinScore(minScore === 4 ? null : 4)}
                            >
                                <div style={{
                                    width: 22, height: 22, borderRadius: "50%",
                                    border: minScore === 4 ? "6px solid #111" : "2px solid #ccc"
                                }} />
                                <div style={{ fontSize: 15, color: "#777", fontWeight: 600 }}>4 ve üzeri</div>
                            </div>
                        </div>
                    </div>
                </div>{/* End of hideable wrapper */}
            </div>

            {/* ─── Footer ─── */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 24px 24px",
                    borderTop: "1px solid #eee",
                    background: "#fff",
                    boxShadow: "0 -4px 12px rgba(0,0,0,0.03)"
                }}
            >
                {/* Temizle with icon */}
                <div
                    onClick={() => {
                        setPeople(0);
                        setSelectedPools([]);
                        setSelectedCats([]);
                        setSearchTerm("");
                        setMinScore(null);
                        setStartDate(null);
                        setEndDate(null);
                        setSelectedLocation("");
                        setMinPrice(1000);
                        setMaxPrice(100000);
                    }}
                    style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 16, color: "#111", cursor: "pointer" }}
                >
                    <img src="/images/clear-icon.svg" style={{ width: 24, height: 24, opacity: 0.8 }} alt="" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    <span>Temizle</span>
                </div>
                <button
                    onClick={navToResults}
                    style={{
                        background: "#1e222b",
                        color: "#fff",
                        border: "none",
                        borderRadius: 14,
                        padding: "16px 36px",
                        fontSize: 15,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        cursor: "pointer"
                    }}
                >
                    <img src="/images/search3w.png" style={{ width: 16, height: 16, filter: "brightness(0) invert(1)" }} alt="" /> ARA
                </button>
            </div>
        </div >
    );
}
