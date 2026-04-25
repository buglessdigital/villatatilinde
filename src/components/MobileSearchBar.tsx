"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import MobileFilterModal from "./MobileFilterModal";

/* ─── Helpers ─── */
const MONTH_NAMES_TR = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

function daysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}
function getMondayDay(year: number, month: number, day: number) {
    const d = new Date(year, month, day).getDay();
    return d === 0 ? 6 : d - 1;
}
function isSameDay(a: Date | null, b: Date | null) {
    if (!a || !b) return false;
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function isBeforeDay(a: Date, b: Date) {
    return new Date(a.getFullYear(), a.getMonth(), a.getDate()) < new Date(b.getFullYear(), b.getMonth(), b.getDate());
}
function isBetween(d: Date, s: Date | null, e: Date | null) {
    if (!s || !e) return false;
    const dt = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    return dt > new Date(s.getFullYear(), s.getMonth(), s.getDate()).getTime() &&
        dt < new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime();
}
function fmtDate(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function fmtShort(d: Date) {
    return `${d.getDate()} ${MONTH_NAMES_TR[d.getMonth()]}`;
}

/* ─── Location Options ─── */
const LOCATION_OPTIONS = [
    { label: "Tüm Konumlar", value: "", isBold: true },
    { label: "Kalkan - Hepsi", value: "kalkan-hepsi", isBold: true },
    { label: "Kalkan Merkez", value: "kalkan-merkez", isBold: false },
    { label: "Kalkan / Kalamar", value: "kalkan-kalamar", isBold: false },
    { label: "Kalkan / Kömürlük", value: "kalkan-komurluk", isBold: false },
    { label: "Kalkan / Kışla", value: "kalkan-kisla", isBold: false },
    { label: "Kalkan / Ortaalan", value: "kalkan-ortaalan", isBold: false },
    { label: "Kalkan / Kızıltaş", value: "kalkan-kiziltas", isBold: false },
    { label: "Kalkan / Kaputaş", value: "kalkan-kaputas", isBold: false },
    { label: "Kalkan / Patara", value: "kalkan-patara", isBold: false },
    { label: "Kalkan / Ordu", value: "kalkan-ordu", isBold: false },
    { label: "Kalkan / Ulugöl", value: "kalkan-ulugol", isBold: false },
    { label: "Kalkan / Kördere", value: "kalkan-kordere", isBold: false },
    { label: "Kalkan / İslamlar", value: "kalkan-islamlar", isBold: false },
    { label: "Kaş Merkez", value: "kas-merkez", isBold: false },
    { label: "Fethiye", value: "fethiye", isBold: false },
    { label: "Belek", value: "belek", isBold: false },
];

/* ─── Villa Type Options ─── */
const VILLA_TYPE_OPTIONS = [
    { label: "Tüm Tipler", value: "" },
    { label: "Muhafazakar Havuzlu", value: "isolatedPoolVillas" },
    { label: "Balayı Villaları", value: "honeyMoon" },
    { label: "Ultra Lüx Villalar", value: "ultraLux" },
    { label: "Ekonomik Villalar", value: "affordableVillas" },
    { label: "Deniz Manzaralı", value: "seaview" },
    { label: "Denize Yakın", value: "beachVillas" },
    { label: "Jakuzili Villalar", value: "jacuzziVillas" },
];

/* ─── Row Component ─── */
function FilterRow({
    icon, label, value, isOpen, onClick,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    isOpen: boolean;
    onClick: () => void;
}) {
    return (
        <div
            onClick={onClick}
            style={{
                display: "flex",
                alignItems: "center",
                border: `1.5px solid ${isOpen ? "#B5682C" : "#e8e8ec"}`,
                borderRadius: 14,
                padding: "15px 18px",
                background: "#fff",
                cursor: "pointer",
                transition: "border-color 0.2s",
                marginBottom: 10,
            }}
        >
            <span style={{ marginRight: 12, display: "flex", alignItems: "center", color: isOpen ? "#B5682C" : "#aaa", transition: "color 0.2s" }}>
                {icon}
            </span>
            <span style={{ color: "#999", fontSize: 14, fontWeight: 500, minWidth: 60 }}>{label}</span>
            <span style={{
                marginLeft: "auto",
                fontSize: 15,
                fontWeight: value ? 600 : 400,
                color: value ? "#B5682C" : "#ccc",
                marginRight: 10,
                textAlign: "right",
                maxWidth: 180,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
            }}>
                {value || label}
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isOpen ? "#B5682C" : "#bbb"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}>
                <polyline points="6 9 12 15 18 9" />
            </svg>
        </div>
    );
}

/* ─── Dropdown Panel ─── */
function DropdownPanel({ children }: { children: React.ReactNode }) {
    return (
        <div style={{
            background: "#fff",
            border: "1.5px solid #e8e8ec",
            borderRadius: 14,
            boxShadow: "0 8px 30px rgba(0,0,0,0.10)",
            marginBottom: 10,
            overflow: "hidden",
            maxHeight: 280,
            overflowY: "auto",
        }}>
            {children}
        </div>
    );
}

export default function MobileSearchBar() {
    const router = useRouter();

    /* State */
    const [villaName, setVillaName] = useState("");
    const [selectedBolge, setSelectedBolge] = useState("");
    const [selectedVillaType, setSelectedVillaType] = useState("");
    const [guests, setGuests] = useState(0);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    /* Open/close state — only one open at a time */
    type Panel = "bolge" | "villaType" | "date" | "guest" | null;
    const [openPanel, setOpenPanel] = useState<Panel>(null);
    const setAndScrollPanel = (panel: Panel) => {
        setOpenPanel(panel);
        if (panel) {
            setTimeout(() => {
                const el = document.getElementById(`panel-${panel}`);
                if (el) {
                    const y = el.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }, 150);
        }
    };

    const toggle = (panel: Panel) => {
        setAndScrollPanel(openPanel === panel ? null : panel);
    };

    /* Filter modal (full screen, for advanced filters) */
    const [filterModalOpen, setFilterModalOpen] = useState(false);

    /* Calendar */
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

    const handleDateClick = (d: Date) => {
        if (!startDate || (startDate && endDate)) {
            setStartDate(d);
            setEndDate(null);
        } else {
            if (isBeforeDay(d, startDate)) setStartDate(d);
            else setEndDate(d);
        }
    };

    const generateCalDays = () => {
        const yr = currentMonth.getFullYear();
        const mo = currentMonth.getMonth();
        const firstDow = getMondayDay(yr, mo, 1);
        const numDays = daysInMonth(yr, mo);
        const days: (Date | null)[] = [];
        for (let i = 0; i < firstDow; i++) days.push(null);
        for (let i = 1; i <= numDays; i++) days.push(new Date(yr, mo, i));
        return days;
    };

    /* Labels */
    const bolgeLabel = selectedBolge
        ? (LOCATION_OPTIONS.find(o => o.value === selectedBolge)?.label ?? "")
        : "";
    const villaTypeLabel = selectedVillaType
        ? (VILLA_TYPE_OPTIONS.find(o => o.value === selectedVillaType)?.label ?? "")
        : "";
    const dateLabel = startDate
        ? (endDate ? `${fmtShort(startDate)} — ${fmtShort(endDate)}` : `${fmtShort(startDate)} - ?`)
        : "";
    const guestLabel = guests > 0 ? `${guests} Kişi` : "";

    /* Search */
    const handleSearch = () => {
        const params = new URLSearchParams();
        if (selectedBolge) params.set("location", selectedBolge);
        if (selectedVillaType) params.set("features", selectedVillaType);
        if (guests > 0) params.set("people", guests.toString());
        if (villaName.trim()) params.set("search", villaName.trim());
        if (startDate) params.set("checkIn", fmtDate(startDate));
        if (endDate) params.set("checkOut", fmtDate(endDate));
        router.push(`/sonuclar${params.toString() ? `?${params.toString()}` : ""}`);
    };

    return (
        <div
            className="paddingMobile no1024"
            style={{
                backgroundColor: "#fff",
                paddingTop: 16,
                paddingBottom: 8,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                borderBottom: "1px solid #f1f1f3",
            }}
        >
            {/* ── Villa İsmi Arama (en üst satır) ── */}
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <div style={{ position: "relative", flex: 1 }}>
                    <img
                        src="/images/search3.png"
                        style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", height: 16, opacity: 0.45 }}
                        alt=""
                    />
                    <input
                        type="text"
                        placeholder="Villa ismi ile arayın..."
                        value={villaName}
                        onChange={(e) => setVillaName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        style={{
                            width: "100%",
                            padding: "14px 16px 14px 40px",
                            border: "1.5px solid #e8e8ec",
                            borderRadius: 14,
                            fontSize: 15,
                            fontWeight: 500,
                            outline: "none",
                            fontFamily: "inherit",
                            color: "#111",
                            background: "#fff",
                            boxSizing: "border-box",
                        }}
                        onFocus={(e) => { e.target.style.borderColor = "#B5682C"; }}
                        onBlur={(e) => { e.target.style.borderColor = "#e8e8ec"; }}
                    />
                </div>
                <button
                    onClick={handleSearch}
                    style={{
                        padding: "14px 22px",
                        background: "#B5682C",
                        color: "#fff",
                        border: "none",
                        borderRadius: 14,
                        fontSize: 15,
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        whiteSpace: "nowrap",
                    }}
                >
                    Ara
                </button>
            </div>

            {/* ── Bölge ── */}
            <div id="panel-bolge">
                <FilterRow
                    icon={
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                    }
                    label="Bölge"
                    value={bolgeLabel}
                    isOpen={openPanel === "bolge"}
                    onClick={() => toggle("bolge")}
                />
                {openPanel === "bolge" && (
                    <DropdownPanel>
                        {LOCATION_OPTIONS.map((loc) => (
                            <div
                                key={loc.value}
                                onClick={() => { setSelectedBolge(loc.value); setAndScrollPanel("villaType"); }}
                                style={{
                                    padding: "13px 20px",
                                    fontSize: 14,
                                    fontWeight: loc.isBold ? 700 : 500,
                                    color: loc.isBold ? "#111" : "#444",
                                    background: selectedBolge === loc.value ? "rgba(181,104,44,0.08)" : "transparent",
                                    borderBottom: "1px solid #f5f5f5",
                                    cursor: "pointer",
                                    paddingLeft: (!loc.isBold && loc.value !== "") ? 32 : 20,
                                }}
                            >
                                {loc.label}
                            </div>
                        ))}
                    </DropdownPanel>
                )}
            </div>

            {/* ── Villa Tipi ── */}
            <div id="panel-villaType">
                <FilterRow
                    icon={
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                    }
                    label="Villa Tipi"
                    value={villaTypeLabel}
                    isOpen={openPanel === "villaType"}
                    onClick={() => toggle("villaType")}
                />
                {openPanel === "villaType" && (
                    <DropdownPanel>
                        {VILLA_TYPE_OPTIONS.map((vt) => (
                            <div
                                key={vt.value}
                                onClick={() => { setSelectedVillaType(vt.value); setAndScrollPanel("date"); }}
                                style={{
                                    padding: "13px 20px",
                                    fontSize: 14,
                                    fontWeight: 500,
                                    color: "#444",
                                    background: selectedVillaType === vt.value ? "rgba(181,104,44,0.08)" : "transparent",
                                    borderBottom: "1px solid #f5f5f5",
                                    cursor: "pointer",
                                }}
                            >
                                {vt.label}
                            </div>
                        ))}
                    </DropdownPanel>
                )}
            </div>

            {/* ── Giriş - Çıkış Tarihi ── */}
            <div id="panel-date">
                <FilterRow
                    icon={
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                    }
                    label="Giriş - Çıkış"
                    value={dateLabel}
                    isOpen={openPanel === "date"}
                    onClick={() => toggle("date")}
                />
                {openPanel === "date" && (
                    <div style={{
                        background: "#fff",
                        border: "1.5px solid #e8e8ec",
                        borderRadius: 14,
                        padding: "16px",
                        marginBottom: 10,
                        boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                    }}>
                        {/* Month Nav */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                            <div
                                onClick={() => {
                                    const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
                                    const thisM = new Date(today.getFullYear(), today.getMonth(), 1);
                                    if (prev >= thisM) setCurrentMonth(prev);
                                }}
                                style={{ padding: "4px 8px", fontSize: 18, cursor: "pointer", color: "#555", fontWeight: 600 }}
                            >‹</div>
                            <span style={{ fontWeight: 700, fontSize: 14, color: "#333", letterSpacing: 0.5 }}>
                                {MONTH_NAMES_TR[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                            </span>
                            <div
                                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                                style={{ padding: "4px 8px", fontSize: 18, cursor: "pointer", color: "#555", fontWeight: 600 }}
                            >›</div>
                        </div>
                        {/* Weekdays */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", textAlign: "center", fontSize: 12, fontWeight: 700, color: "#aaa", marginBottom: 8 }}>
                            {["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"].map(d => <span key={d}>{d}</span>)}
                        </div>
                        {/* Days */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "4px 0", textAlign: "center" }}>
                            {generateCalDays().map((d, idx) => {
                                if (!d) return <span key={`e${idx}`} />;
                                const isPast = isBeforeDay(d, today);
                                const isStart = isSameDay(d, startDate);
                                const isEnd = isSameDay(d, endDate);
                                const inRange = isBetween(d, startDate, endDate);
                                return (
                                    <div key={d.toString()} style={{ position: "relative", display: "flex", justifyContent: "center" }}>
                                        {(inRange || (isStart && endDate) || isEnd) && (
                                            <div style={{
                                                position: "absolute", top: 0, bottom: 0,
                                                left: isStart ? "50%" : "-10%",
                                                right: isEnd ? "50%" : "-10%",
                                                background: "rgba(181,104,44,0.13)",
                                                zIndex: 0,
                                            }} />
                                        )}
                                        <div
                                            onClick={() => !isPast && handleDateClick(d)}
                                            style={{
                                                width: 34, height: 34,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontSize: 13, fontWeight: (isStart || isEnd) ? 700 : 500,
                                                color: isPast ? "#ddd" : (isStart || isEnd) ? "#fff" : "#333",
                                                background: (isStart || isEnd) ? "#B5682C" : "transparent",
                                                borderRadius: "50%",
                                                cursor: isPast ? "default" : "pointer",
                                                position: "relative", zIndex: 1,
                                            }}
                                        >
                                            {d.getDate()}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {startDate && (
                            <div style={{ marginTop: 12, fontSize: 13, color: "#888", textAlign: "center" }}>
                                {startDate && !endDate
                                    ? `Giriş: ${fmtShort(startDate)} — Çıkış tarihi seçin`
                                    : startDate && endDate
                                        ? `${fmtShort(startDate)} — ${fmtShort(endDate)}`
                                        : ""}
                            </div>
                        )}
                        {startDate && endDate && (
                            <div
                                onClick={() => setOpenPanel(null)}
                                style={{
                                    marginTop: 12,
                                    background: "#B5682C",
                                    color: "#fff",
                                    borderRadius: 10,
                                    padding: "10px",
                                    textAlign: "center",
                                    fontWeight: 700,
                                    fontSize: 14,
                                    cursor: "pointer",
                                }}
                            >
                                Tarihleri Onayla
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── Misafir Sayısı + Filtreler ── */}
            <div id="panel-guest">
                <div style={{ display: "flex", gap: 8, marginBottom: 0 }}>
                    {/* Misafir row */}
                    <div
                        onClick={() => toggle("guest")}
                        style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            border: `1.5px solid ${openPanel === "guest" ? "#B5682C" : "#e8e8ec"}`,
                            borderRadius: 14,
                            padding: "15px 18px",
                            background: "#fff",
                            cursor: "pointer",
                            transition: "border-color 0.2s",
                        }}
                    >
                        <span style={{ marginRight: 12, display: "flex", alignItems: "center", color: openPanel === "guest" ? "#B5682C" : "#aaa", transition: "color 0.2s" }}>
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </span>
                        <span style={{ color: "#999", fontSize: 14, fontWeight: 500 }}>Misafir Sayısı</span>
                        <span style={{
                            marginLeft: "auto",
                            fontSize: 15, fontWeight: guests > 0 ? 600 : 400,
                            color: guests > 0 ? "#B5682C" : "#ccc",
                            marginRight: 10,
                        }}>
                            {guests > 0 ? `${guests} Kişi` : "Misafir Sayısı"}
                        </span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={openPanel === "guest" ? "#B5682C" : "#bbb"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: openPanel === "guest" ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </div>
                    {/* Filtreler icon */}
                    <div
                        onClick={() => setFilterModalOpen(true)}
                        style={{
                            width: 54,
                            border: "1.5px solid #e8e8ec",
                            borderRadius: 14,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            background: "#fff",
                            flexShrink: 0,
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="4" y1="6" x2="20" y2="6" />
                            <line x1="8" y1="12" x2="20" y2="12" />
                            <line x1="12" y1="18" x2="20" y2="18" />
                            <circle cx="4" cy="6" r="1.5" fill="#555" stroke="none" />
                            <circle cx="8" cy="12" r="1.5" fill="#555" stroke="none" />
                            <circle cx="12" cy="18" r="1.5" fill="#555" stroke="none" />
                        </svg>
                    </div>
                </div>

                {/* Misafir Dropdown */}
                {openPanel === "guest" && (
                    <div style={{
                        background: "#fff",
                        border: "1.5px solid #e8e8ec",
                        borderRadius: 14,
                        padding: "20px",
                        marginTop: 10,
                        boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 15, fontWeight: 600, color: "#333" }}>Misafir Sayısı</span>
                            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                <div
                                    onClick={() => setGuests(g => Math.max(0, g - 1))}
                                    style={{ width: 34, height: 34, border: "1.5px solid #ccc", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 300, cursor: "pointer", color: "#333" }}
                                >&minus;</div>
                                <span style={{ fontSize: 16, fontWeight: 600, color: "#111", minWidth: 40, textAlign: "center" }}>
                                    {guests > 0 ? guests : "Tümü"}
                                </span>
                                <div
                                    onClick={() => setGuests(g => Math.min(30, g + 1))}
                                    style={{ width: 34, height: 34, border: "1.5px solid #ccc", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 300, cursor: "pointer", color: "#333" }}
                                >&#43;</div>
                            </div>
                        </div>
                        <div style={{ marginTop: 4, fontSize: 12, color: "#aaa" }}>0–3 yaş kişi sayısına dahil değildir.</div>
                        <div
                            onClick={() => setAndScrollPanel(null)}
                            style={{ marginTop: 14, background: "#B5682C", color: "#fff", borderRadius: 10, padding: "10px", textAlign: "center", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
                        >
                            Onayla
                        </div>
                    </div>
                )}
            </div>

            {/* ── Villa Ara Butonu ── */}
            <div style={{ marginTop: 14 }}>
                <button
                    onClick={handleSearch}
                    style={{
                        width: "100%",
                        padding: "16px",
                        background: "linear-gradient(45deg, rgb(158, 83, 32) 20%, rgb(30, 144, 255) 100%)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 14,
                        fontSize: 16,
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        letterSpacing: 0.3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    Villa Ara
                </button>
            </div>

            {/* Full-screen filter modal */}
            <MobileFilterModal isOpen={filterModalOpen} onClose={() => setFilterModalOpen(false)} />
        </div>
    );
}
