"use client";
import { useState, useCallback, useMemo, useEffect } from "react";
import type { MutableRefObject } from "react";
import { useCurrency } from "@/context/CurrencyContext";

/* ─── Types ─── */
export interface CalendarPriceRange {
    startDate: string; // "YYYY-MM-DD"
    endDate: string;   // "YYYY-MM-DD"
    price: number;
}

export interface CalendarReservation {
    startDate: string;
    endDate: string;
    status: "reserved" | "option"; // red or orange
}

export interface CalendarDisabledReason {
    startDate: string;
    endDate: string;
    reason: string;
}

interface Props {
    priceRanges: CalendarPriceRange[];
    reservations: CalendarReservation[];
    disabledReasons?: CalendarDisabledReason[];
    currency?: string;
    onDateSelect?: (checkIn: string | null, checkOut: string | null) => void;
    clearDatesRef?: MutableRefObject<(() => void) | null>;
    minNights?: number;
}

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

// Monday = 0, Sunday = 6  (ISO weekday)
function getStartDayOfMonth(year: number, month: number): number {
    const d = new Date(year, month, 1).getDay();
    return d === 0 ? 6 : d - 1; // convert Sunday=0 to 6
}

function isBetween(dateStr: string, start: string, end: string): boolean {
    return dateStr >= start && dateStr <= end;
}

/* ─── Component ─── */
export default function ReservationCalendar({
    priceRanges,
    reservations,
    disabledReasons = [],
    currency = "₺",
    onDateSelect,
    clearDatesRef,
    minNights = 1,
}: Props) {
    const [monthCount, setMonthCount] = useState(12);
    const [selectedCheckIn, setSelectedCheckIn] = useState<string | null>(null);
    const [selectedCheckOut, setSelectedCheckOut] = useState<string | null>(null);
    const [minNightsWarning, setMinNightsWarning] = useState<string | null>(null);
    const [blockedWarning, setBlockedWarning] = useState<string | null>(null);

    const [isMobile, setIsMobile] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Build list of months to display
    const months = useMemo(() => {
        const now = new Date();
        const result: { year: number; month: number }[] = [];
        const targetCount = isMobile ? Math.max(monthCount, currentSlide + 1) : monthCount;
        for (let i = 0; i < targetCount; i++) {
            const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
            result.push({ year: d.getFullYear(), month: d.getMonth() });
        }
        return result;
    }, [monthCount, isMobile, currentSlide]);

    // Price lookup
    const getPrice = useCallback(
        (dateStr: string): number | null => {
            for (const pr of priceRanges) {
                if (isBetween(dateStr, pr.startDate, pr.endDate)) {
                    return pr.price;
                }
            }
            return null;
        },
        [priceRanges]
    );

    // Disabled reason lookup
    const getDisabledReason = useCallback(
        (dateStr: string): string | null => {
            for (const dr of disabledReasons) {
                if (isBetween(dateStr, dr.startDate, dr.endDate)) {
                    return dr.reason;
                }
            }
            return null;
        },
        [disabledReasons]
    );

    // Reservation status lookup
    const getReservationStatus = useCallback(
        (dateStr: string): "reserved" | "option" | null => {
            for (const res of reservations) {
                if (isBetween(dateStr, res.startDate, res.endDate)) {
                    return res.status;
                }
            }
            return null;
        },
        [reservations]
    );

    // Reservation position: is this date the start, end, or middle of a reservation?
    const getReservationPosition = useCallback(
        (dateStr: string): "start" | "end" | "mid" | null => {
            for (const res of reservations) {
                if (isBetween(dateStr, res.startDate, res.endDate)) {
                    if (dateStr === res.startDate) return "start";
                    if (dateStr === res.endDate) return "end";
                    return "mid";
                }
            }
            return null;
        },
        [reservations]
    );

    // Is a date in the selected range?
    const isSelected = useCallback(
        (dateStr: string): boolean => {
            if (!selectedCheckIn) return false;
            if (!selectedCheckOut) return dateStr === selectedCheckIn;
            return isBetween(dateStr, selectedCheckIn, selectedCheckOut);
        },
        [selectedCheckIn, selectedCheckOut]
    );

    // Is it the check-in or check-out day?
    const isCheckIn = useCallback(
        (dateStr: string) => selectedCheckIn === dateStr,
        [selectedCheckIn]
    );
    const isCheckOut = useCallback(
        (dateStr: string) => selectedCheckOut === dateStr,
        [selectedCheckOut]
    );

    // Is date in the past?
    const isPast = useCallback((dateStr: string): boolean => {
        const today = toDateStr(new Date());
        return dateStr < today;
    }, []);

    // Handle day click
    const handleDayClick = useCallback(
        (dateStr: string) => {
            // Don't select past dates
            if (isPast(dateStr)) return;

            // If clicking a disabled/blocked date, show reason warning
            const disabledReason = getDisabledReason(dateStr);
            if (disabledReason) {
                setBlockedWarning(disabledReason);
                setMinNightsWarning(null);
                return;
            }

            // Don't select reserved or optioned dates
            const status = getReservationStatus(dateStr);
            if (status === "reserved" || status === "option") {
                setBlockedWarning("Bu tarih rezerve edilmiştir.");
                setMinNightsWarning(null);
                return;
            }

            // Don't select dates without a price
            const price = getPrice(dateStr);
            if (price === null) return;

            // Clear any previous warning
            setMinNightsWarning(null);
            setBlockedWarning(null);

            if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
                // Start new selection
                setSelectedCheckIn(dateStr);
                setSelectedCheckOut(null);
                onDateSelect?.(dateStr, null);
            } else {
                // Set check-out
                if (dateStr <= selectedCheckIn) {
                    // If clicked date is before check-in, reset
                    setSelectedCheckIn(dateStr);
                    setSelectedCheckOut(null);
                    onDateSelect?.(dateStr, null);
                } else {
                    // Check night count for minNights validation
                    const startD = parseDate(selectedCheckIn);
                    const endD = parseDate(dateStr);
                    const nightCount = Math.round((endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24));
                    if (nightCount < minNights) {
                        setMinNightsWarning(`Minimum rezervasyon süresi ${minNights} gecedir. Seçtiğiniz tarih aralığı ${nightCount} gece.`);
                        return;
                    }

                    // Check if range contains reserved dates or unpriced dates
                    let hasBlocked = false;
                    const cursor = new Date(startD);
                    while (cursor <= endD) {
                        const cs = toDateStr(cursor);
                        const s = getReservationStatus(cs);
                        if (s === "reserved" || s === "option") {
                            hasBlocked = true;
                            break;
                        }
                        const dayPrice = getPrice(cs);
                        if (dayPrice === null) {
                            hasBlocked = true;
                            break;
                        }
                        cursor.setDate(cursor.getDate() + 1);
                    }
                    if (hasBlocked) {
                        // Reset to clicked date
                        setSelectedCheckIn(dateStr);
                        setSelectedCheckOut(null);
                        onDateSelect?.(dateStr, null);
                    } else {
                        setSelectedCheckOut(dateStr);
                        onDateSelect?.(selectedCheckIn, dateStr);
                    }
                }
            }
        },
        [selectedCheckIn, selectedCheckOut, isPast, getReservationStatus, getPrice, onDateSelect, minNights]
    );

    const clearDates = useCallback(() => {
        setSelectedCheckIn(null);
        setSelectedCheckOut(null);
        setMinNightsWarning(null);
        setBlockedWarning(null);
        onDateSelect?.(null, null);
    }, [onDateSelect]);

    // Expose clearDates to parent via ref
    useEffect(() => {
        if (clearDatesRef) {
            clearDatesRef.current = clearDates;
        }
    }, [clearDatesRef, clearDates]);

    const showMoreMonths = useCallback(() => {
        setMonthCount((prev) => prev + 3);
    }, []);

    // Currency conversion
    const { convertPrice } = useCurrency();

    // Format price for display
    const formatPrice = useCallback((price: number): string => {
        const converted = convertPrice(price);
        return `${currency}${converted.toLocaleString("tr-TR")}`;
    }, [currency, convertPrice]);

    return (
        <section className="vd-calendar-section" id="parsedyCal">
            <h2 className="vd-section-title poppins vd-center-title">
                Rezervasyon Takvimi
            </h2>

            {/* Legend */}
            <div className="vd-cal-legend">
                <div className="vd-cal-legend-item">
                    <div className="vd-cal-bubble" style={{ background: "red" }}></div>
                    Rezerve Edilmiş
                </div>
                <div className="vd-cal-legend-item">
                    <div className="vd-cal-bubble" style={{ background: "orange" }}></div>
                    Opsiyon
                </div>
                <div className="vd-cal-legend-item">
                    <div className="vd-cal-bubble" style={{ background: "#3880ff" }}></div>
                    Seçilmiş
                </div>
            </div>

            {/* Clear Dates */}
            <div className="vd-cal-clear-row">
                <button className="vd-cal-clear-btn" onClick={clearDates}>
                    Tarihleri Temizle
                </button>
            </div>

            {/* Blocked Date Warning */}
            {blockedWarning && (
                <div style={{
                    background: "#fef2f2",
                    border: "1px solid #fca5a5",
                    borderRadius: 10,
                    padding: "12px 16px",
                    color: "#991b1b",
                    fontSize: 14,
                    fontWeight: 500,
                    textAlign: "center",
                    margin: "0 auto 16px",
                    maxWidth: 500,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                }}>
                    <span>🚫 {blockedWarning}</span>
                    <button onClick={() => setBlockedWarning(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#991b1b", padding: 0 }}>✕</button>
                </div>
            )}

            {/* Min Nights Warning */}

            {minNightsWarning && (
                <div style={{
                    background: "#fef3c7",
                    border: "1px solid #fde68a",
                    borderRadius: 10,
                    padding: "12px 16px",
                    color: "#92400e",
                    fontSize: 14,
                    fontWeight: 500,
                    textAlign: "center",
                    margin: "0 auto 16px",
                    maxWidth: 500,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                }}>
                    ⚠️ {minNightsWarning}
                </div>
            )}

            {/* Calendar Grid */}
            {isMobile && months[currentSlide] && (
                <div className="vd-cal-mobile-nav">
                    <div
                        className="vd-cal-mobile-nav-btn"
                        onClick={() => setCurrentSlide(s => Math.max(0, s - 1))}
                        style={{ opacity: currentSlide === 0 ? 0.3 : 1, cursor: currentSlide === 0 ? "default" : "pointer" }}
                    >
                        ◀ Geri
                    </div>
                    <div className="vd-cal-mobile-nav-title poppins">
                        {MONTH_NAMES_TR[months[currentSlide].month]} {months[currentSlide].year}
                    </div>
                    <div
                        className="vd-cal-mobile-nav-btn"
                        onClick={() => setCurrentSlide(s => s + 1)}
                    >
                        İleri ▶
                    </div>
                </div>
            )}
            <div className="vd-cal-grid">
                {(isMobile ? [months[currentSlide]] : months).filter(Boolean).map(({ year, month }) => (
                    <MonthGrid
                        key={`${year}-${month}`}
                        year={year}
                        month={month}
                        getPrice={getPrice}
                        getReservationStatus={getReservationStatus}
                        getReservationPosition={getReservationPosition}
                        getDisabledReason={getDisabledReason}
                        isSelected={isSelected}
                        isCheckIn={isCheckIn}
                        isCheckOut={isCheckOut}
                        isPast={isPast}
                        onDayClick={handleDayClick}
                        formatPrice={formatPrice}
                    />
                ))}
            </div>

            {/* Show More (only on desktop) */}
            {!isMobile && (
                <div className="vd-cal-more-row">
                    <button className="vd-cal-more-btn" onClick={showMoreMonths}>
                        <img src="/images/calO.svg" alt="" style={{ height: 24, marginRight: 8 }} />
                        Daha Fazla Ay Göster
                    </button>
                </div>
            )}
        </section>
    );
}

/* ─── MonthGrid Sub-component ─── */
interface MonthGridProps {
    year: number;
    month: number;
    getPrice: (dateStr: string) => number | null;
    getReservationStatus: (dateStr: string) => "reserved" | "option" | null;
    getReservationPosition: (dateStr: string) => "start" | "end" | "mid" | null;
    getDisabledReason: (dateStr: string) => string | null;
    isSelected: (dateStr: string) => boolean;
    isCheckIn: (dateStr: string) => boolean;
    isCheckOut: (dateStr: string) => boolean;
    isPast: (dateStr: string) => boolean;
    onDayClick: (dateStr: string) => void;
    formatPrice: (price: number) => string;
}

function MonthGrid({
    year,
    month,
    getPrice,
    getReservationStatus,
    getReservationPosition,
    getDisabledReason,
    isSelected,
    isCheckIn,
    isCheckOut,
    isPast,
    onDayClick,
    formatPrice,
}: MonthGridProps) {
    const daysInMonth = getDaysInMonth(year, month);
    const startDay = getStartDayOfMonth(year, month);

    // Build cells
    const cells: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    return (
        <div className="vd-cal-month">
            <div className="vd-cal-month-title poppins">
                {MONTH_NAMES_TR[month]} {year}
            </div>
            <div className="vd-cal-day-headers">
                {DAY_HEADERS.map((dh) => (
                    <div key={dh} className="vd-cal-day-header">{dh}</div>
                ))}
            </div>
            <div className="vd-cal-days">
                {cells.map((day, idx) => {
                    if (day === null) {
                        return <div key={`empty-${idx}`} className="vd-cal-cell vd-cal-cell-empty"></div>;
                    }

                    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const price = getPrice(dateStr);
                    const resStatus = getReservationStatus(dateStr);
                    const resPosition = getReservationPosition(dateStr);
                    const selected = isSelected(dateStr);
                    const past = isPast(dateStr);
                    const checkIn = isCheckIn(dateStr);
                    const checkOut = isCheckOut(dateStr);

                    let cellClass = "vd-cal-cell";
                    if (past) cellClass += " vd-cal-past";
                    if (resStatus === "reserved") {
                        if (resPosition === "start") cellClass += " vd-cal-res-start";
                        else if (resPosition === "end") cellClass += " vd-cal-res-end";
                        else cellClass += " vd-cal-res-mid";
                    } else if (resStatus === "option") {
                        if (resPosition === "start") cellClass += " vd-cal-opt-start";
                        else if (resPosition === "end") cellClass += " vd-cal-opt-end";
                        else cellClass += " vd-cal-opt-mid";
                    }
                    if (selected) cellClass += " vd-cal-selected";
                    if (checkIn) cellClass += " vd-cal-checkin";
                    if (checkOut) cellClass += " vd-cal-checkout";

                    const clickable = !past && resStatus !== "reserved" && price !== null;
                    const noPrice = price === null && !past && !resStatus;

                    return (
                        <div
                            key={dateStr}
                            className={`${cellClass}${noPrice ? " vd-cal-noprice" : ""}`}
                            onClick={clickable ? () => onDayClick(dateStr) : undefined}
                            style={{ cursor: clickable ? "pointer" : "default", opacity: noPrice ? 0.45 : undefined }}
                        >
                            <div className="vd-cal-day-num">{day}</div>
                            <div className="vd-cal-day-price">
                                {price !== null ? formatPrice(price) : "–"}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
