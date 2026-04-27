"use client";
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";

/* ─── Turkish Month / Day Names ─── */
const MONTH_NAMES_TR = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

const DAY_HEADERS = ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"];

/* ─── Helpers ─── */
function toDateStr(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function parseDate(s: string): Date {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d);
}

function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

// Monday = 0, Sunday = 6
function getStartDayOfMonth(year: number, month: number): number {
    const d = new Date(year, month, 1).getDay();
    return d === 0 ? 6 : d - 1;
}

function isBetween(dateStr: string, start: string, end: string): boolean {
    return dateStr >= start && dateStr <= end;
}

interface PriceRange {
    startDate: string;
    endDate: string;
    price: number;
    currency?: string;
}

interface Reservation {
    startDate: string;
    endDate: string;
    status: "reserved" | "option";
}

interface DisabledReason {
    startDate: string;
    endDate: string;
    reason: string;
}

interface SidebarDatePickerProps {
    checkInDate: string;
    checkOutDate: string;
    onDateChange: (checkIn: string | null, checkOut: string | null) => void;
    priceRanges: PriceRange[];
    reservations: Reservation[];
    disabledReasons?: DisabledReason[];
    minNights?: number;
    formatPrice: (price: number, currency?: string) => string;
}

export default function SidebarDatePicker({
    checkInDate,
    checkOutDate,
    onDateChange,
    priceRanges,
    reservations,
    disabledReasons = [],
    minNights = 1,
    formatPrice
}: SidebarDatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const [viewYear, setViewYear] = useState(new Date().getFullYear());
    const [viewMonth, setViewMonth] = useState(new Date().getMonth());

    const [minNightsWarning, setMinNightsWarning] = useState<string | null>(null);
    const [blockedWarning, setBlockedWarning] = useState<string | null>(null);

    // Initial sync
    useEffect(() => {
        if (checkInDate && !isOpen) {
            const d = parseDate(checkInDate);
            setViewYear(d.getFullYear());
            setViewMonth(d.getMonth());
        }
    }, [checkInDate, isOpen]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const goPrev = () => {
        setViewMonth((m) => {
            if (m === 0) { setViewYear((y) => y - 1); return 11; }
            return m - 1;
        });
    };

    const goNext = () => {
        setViewMonth((m) => {
            if (m === 11) { setViewYear((y) => y + 1); return 0; }
            return m + 1;
        });
    };

    const getPriceInfo = useCallback((dateStr: string): { price: number; currency?: string } | null => {
        for (const pr of priceRanges) {
            if (isBetween(dateStr, pr.startDate, pr.endDate)) return { price: pr.price, currency: pr.currency };
        }
        return null;
    }, [priceRanges]);

    const getPrice = useCallback((dateStr: string): number | null => {
        return getPriceInfo(dateStr)?.price ?? null;
    }, [getPriceInfo]);

    const getDisabledReason = useCallback((dateStr: string): string | null => {
        for (const dr of disabledReasons) {
            if (isBetween(dateStr, dr.startDate, dr.endDate)) return dr.reason;
        }
        return null;
    }, [disabledReasons]);

    const getReservationStatus = useCallback((dateStr: string): "reserved" | "option" | null => {
        for (const res of reservations) {
            if (isBetween(dateStr, res.startDate, res.endDate)) return res.status;
        }
        return null;
    }, [reservations]);

    const getReservationPosition = useCallback((dateStr: string): "start" | "end" | "mid" | "both" | null => {
        const endRes = reservations.find(r => r.endDate === dateStr);
        const startRes = reservations.find(r => r.startDate === dateStr);
        if (endRes && startRes) return "both";
        for (const res of reservations) {
            if (isBetween(dateStr, res.startDate, res.endDate)) {
                if (dateStr === res.startDate) return "start";
                if (dateStr === res.endDate) return "end";
                return "mid";
            }
        }
        return null;
    }, [reservations]);

    const getReservationDualInfo = useCallback((dateStr: string): { endColor: string; startColor: string } | null => {
        const endRes = reservations.find(r => r.endDate === dateStr);
        const startRes = reservations.find(r => r.startDate === dateStr);
        if (!endRes || !startRes) return null;
        const colorOf = (s: "reserved" | "option") => s === "reserved" ? "red" : "orange";
        return { endColor: colorOf(endRes.status), startColor: colorOf(startRes.status) };
    }, [reservations]);

    const isSelected = useCallback((dateStr: string): boolean => {
        if (!checkInDate) return false;
        if (!checkOutDate) return dateStr === checkInDate;
        return isBetween(dateStr, checkInDate, checkOutDate);
    }, [checkInDate, checkOutDate]);

    const isPast = useCallback((dateStr: string): boolean => {
        return dateStr < toDateStr(new Date());
    }, []);

    const isBlockedEndDate = useCallback((dateStr: string): boolean => {
        if (reservations.some(r => r.endDate === dateStr)) return true;
        if (disabledReasons.some(dr => dr.endDate === dateStr)) return true;
        return false;
    }, [reservations, disabledReasons]);

    const isBlockedStartDate = useCallback((dateStr: string): boolean => {
        if (reservations.some(r => r.startDate === dateStr)) return true;
        if (disabledReasons.some(dr => dr.startDate === dateStr)) return true;
        return false;
    }, [reservations, disabledReasons]);

    const handleDayClick = useCallback((dateStr: string) => {
        if (isPast(dateStr)) return;

        const settingCheckIn = !checkInDate || (checkInDate && checkOutDate != null);
        const endDate = isBlockedEndDate(dateStr);
        const startDate = isBlockedStartDate(dateStr);

        const disabledReason = getDisabledReason(dateStr);
        if (disabledReason) {
            if (settingCheckIn && endDate) {
                // check-in olarak izin ver
            } else if (!settingCheckIn && startDate) {
                // check-out olarak izin ver
            } else {
                setBlockedWarning(disabledReason);
                setMinNightsWarning(null);
                return;
            }
        }

        const status = getReservationStatus(dateStr);
        if (status === "reserved" || status === "option") {
            if (settingCheckIn && endDate) {
                // check-in olarak izin ver
            } else if (!settingCheckIn && startDate) {
                // check-out olarak izin ver
            } else {
                setBlockedWarning("Bu tarih rezerve edilmiştir.");
                setMinNightsWarning(null);
                return;
            }
        }

        const price = getPrice(dateStr);
        if (price === null && !endDate) return;

        setMinNightsWarning(null);
        setBlockedWarning(null);

        if (settingCheckIn) {
            onDateChange(dateStr, null);
        } else {
            if (dateStr <= checkInDate!) {
                onDateChange(dateStr, null);
            } else {
                const startD = parseDate(checkInDate!);
                const endD = parseDate(dateStr);
                const nightCount = Math.round((endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24));
                if (nightCount < minNights) {
                    setMinNightsWarning(`Minimum rezervasyon süresi ${minNights} gecedir. Seçtiğiniz tarih aralığı ${nightCount} gece.`);
                    return;
                }

                let hasBlocked = false;
                const cursor = new Date(startD);
                cursor.setDate(cursor.getDate() + 1); // check-in gününü atla
                while (cursor < endD) { // check-out gününü atla
                    const cs = toDateStr(cursor);
                    const s = getReservationStatus(cs);
                    if (s === "reserved" || s === "option" || getPrice(cs) === null) {
                        hasBlocked = true;
                        break;
                    }
                    cursor.setDate(cursor.getDate() + 1);
                }
                if (hasBlocked) {
                    onDateChange(dateStr, null);
                } else {
                    onDateChange(checkInDate!, dateStr);
                    setIsOpen(false);
                }
            }
        }
    }, [checkInDate, checkOutDate, isPast, getReservationStatus, getPrice, getDisabledReason, isBlockedEndDate, isBlockedStartDate, minNights, onDateChange]);

    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const startDay = getStartDayOfMonth(viewYear, viewMonth);

    const cells: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    const formatDisplayDate = (d: string) => {
        if (!d) return "";
        return new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
    };

    return (
        <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
            {/* Input boxes */}
            <div style={{ display: "flex", gap: "12px", width: "100%" }}>
                <div 
                    onClick={() => setIsOpen(true)}
                    style={{ 
                        flex: 1, height: "46px", display: "flex", alignItems: "center", justifyContent: "center",
                        border: "1px solid #cbd5e1", borderRadius: "8px", background: "#fff", cursor: "pointer",
                        color: checkInDate ? "#1e293b" : "#94a3b8", fontSize: "14px", fontWeight: 500
                    }}
                >
                    {checkInDate ? formatDisplayDate(checkInDate) : "Giriş Tarihi"}
                </div>
                <div 
                    onClick={() => setIsOpen(true)}
                    style={{ 
                        flex: 1, height: "46px", display: "flex", alignItems: "center", justifyContent: "center",
                        border: "1px solid #cbd5e1", borderRadius: "8px", background: "#fff", cursor: "pointer",
                        color: checkOutDate ? "#1e293b" : "#94a3b8", fontSize: "14px", fontWeight: 500
                    }}
                >
                    {checkOutDate ? formatDisplayDate(checkOutDate) : "Çıkış Tarihi"}
                </div>
            </div>

            {/* Popup */}
            {isOpen && (
                <div style={{
                    position: "absolute", top: "100%", left: 0, right: 0, marginTop: "8px",
                    background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
                    zIndex: 50, padding: "20px"
                }}>
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                        <button onClick={goPrev} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "#64748b", padding: "4px 8px" }}>‹</button>
                        <div style={{ fontSize: "15px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>
                            {MONTH_NAMES_TR[viewMonth]} {viewYear}
                        </div>
                        <button onClick={goNext} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "#64748b", padding: "4px 8px" }}>›</button>
                    </div>

                    {/* Day Headers */}
                    <div style={{ display: "flex", marginBottom: "8px" }}>
                        {DAY_HEADERS.map(dh => (
                            <div key={dh} style={{ width: "calc(100% / 7)", flexShrink: 0, textAlign: "center", fontSize: "12px", fontWeight: 700, color: "#cbd5e1" }}>
                                {dh.toUpperCase()}
                            </div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div style={{ display: "flex", flexWrap: "wrap", rowGap: "4px" }}>
                        {cells.map((day, idx) => {
                            if (day === null) return <div key={`empty-${idx}`} style={{ width: "calc(100% / 7)", flexShrink: 0 }} />;
                            
                            const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                            const priceInfo = getPriceInfo(dateStr);
                            const price = priceInfo?.price ?? null;
                            const resStatus = getReservationStatus(dateStr);
                            const resPos = getReservationPosition(dateStr);
                            const dualInfo = resPos === "both" ? getReservationDualInfo(dateStr) : null;
                            const selected = isSelected(dateStr);
                            const past = isPast(dateStr);
                            const checkIn = checkInDate === dateStr;
                            const checkOut = checkOutDate === dateStr;

                            const clickable = !past && resPos !== "both" && price !== null &&
                                (resStatus === null || resPos === "end" || resPos === "start");
                            const noPrice = price === null && !past && !resStatus;

                            let bg = "transparent";
                            let color = "#1e293b";
                            let priceColor = "#94a3b8";

                            if (past || noPrice) {
                                color = "#cbd5e1";
                                priceColor = "#cbd5e1";
                            } else if (dualInfo) {
                                // İki dönem buluşuyor: sol üst = biten, sağ alt = başlayan, beyaz köşegen çizgisi
                                bg = `linear-gradient(-45deg, ${dualInfo.startColor} calc(50% - 1.5px), #fff calc(50% - 1.5px), #fff calc(50% + 1.5px), ${dualInfo.endColor} calc(50% + 1.5px))`;
                                color = "#1e293b";
                            } else if (resStatus === "reserved") {
                                const resColor = "red";
                                if (resPos === "start") bg = `linear-gradient(-45deg, ${resColor} 50%, transparent 50%)`;
                                else if (resPos === "end") bg = `linear-gradient(135deg, ${resColor} 50%, transparent 50%)`;
                                else bg = resColor;
                                color = resPos === "mid" ? "#fff" : "#ef4444";
                                priceColor = resPos === "mid" ? "rgba(255,255,255,0.8)" : "#fca5a5";
                            } else if (resStatus === "option") {
                                const optColor = "orange";
                                if (resPos === "start") bg = `linear-gradient(-45deg, ${optColor} 50%, transparent 50%)`;
                                else if (resPos === "end") bg = `linear-gradient(135deg, ${optColor} 50%, transparent 50%)`;
                                else bg = optColor;
                                color = resPos === "mid" ? "#fff" : "#f97316";
                                priceColor = resPos === "mid" ? "rgba(255,255,255,0.8)" : "#fdba74";
                            } else if (selected) {
                                const selColor = "#3b82f6";
                                if (checkIn) bg = `linear-gradient(-45deg, ${selColor} 50%, transparent 50%)`;
                                else if (checkOut) bg = `linear-gradient(135deg, ${selColor} 50%, transparent 50%)`;
                                else { bg = selColor; color = "#fff"; priceColor = "rgba(255,255,255,0.8)"; }
                            }

                            return (
                                <div
                                    key={dateStr}
                                    onClick={clickable ? () => handleDayClick(dateStr) : undefined}
                                    style={{
                                        width: "calc(100% / 7)", flexShrink: 0,
                                        background: bg, borderRadius: "0", padding: "8px 0", textAlign: "center",
                                        cursor: clickable ? "pointer" : "default", transition: "all 0.15s ease"
                                    }}
                                >
                                    <div style={{ fontSize: "14px", fontWeight: 700, color }}>{day}</div>
                                    <div style={{ fontSize: "10px", fontWeight: 500, color: priceColor, marginTop: "2px" }}>
                                        {priceInfo !== null ? formatPrice(priceInfo.price, priceInfo.currency) : "–"}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Warnings */}
                    {blockedWarning && (
                        <div style={{ marginTop: "12px", padding: "8px", background: "#fef2f2", color: "#ef4444", fontSize: "12px", borderRadius: "6px", textAlign: "center" }}>
                            {blockedWarning}
                        </div>
                    )}
                    {minNightsWarning && (
                        <div style={{ marginTop: "12px", padding: "8px", background: "#fffbeb", color: "#d97706", fontSize: "12px", borderRadius: "6px", textAlign: "center" }}>
                            {minNightsWarning}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
