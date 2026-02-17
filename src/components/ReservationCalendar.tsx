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

interface Props {
    priceRanges: CalendarPriceRange[];
    reservations: CalendarReservation[];
    currency?: string;
    onDateSelect?: (checkIn: string | null, checkOut: string | null) => void;
    clearDatesRef?: MutableRefObject<(() => void) | null>;
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
    currency = "₺",
    onDateSelect,
    clearDatesRef,
}: Props) {
    const [monthCount, setMonthCount] = useState(12);
    const [selectedCheckIn, setSelectedCheckIn] = useState<string | null>(null);
    const [selectedCheckOut, setSelectedCheckOut] = useState<string | null>(null);

    // Build list of months to display
    const months = useMemo(() => {
        const now = new Date();
        const result: { year: number; month: number }[] = [];
        for (let i = 0; i < monthCount; i++) {
            const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
            result.push({ year: d.getFullYear(), month: d.getMonth() });
        }
        return result;
    }, [monthCount]);

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

            // Don't select reserved dates
            const status = getReservationStatus(dateStr);
            if (status === "reserved") return;

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
                    // Check if range contains reserved dates
                    let hasReserved = false;
                    const start = parseDate(selectedCheckIn);
                    const end = parseDate(dateStr);
                    const cursor = new Date(start);
                    while (cursor <= end) {
                        const cs = toDateStr(cursor);
                        if (getReservationStatus(cs) === "reserved") {
                            hasReserved = true;
                            break;
                        }
                        cursor.setDate(cursor.getDate() + 1);
                    }
                    if (hasReserved) {
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
        [selectedCheckIn, selectedCheckOut, isPast, getReservationStatus, onDateSelect]
    );

    const clearDates = useCallback(() => {
        setSelectedCheckIn(null);
        setSelectedCheckOut(null);
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

            {/* Calendar Grid */}
            <div className="vd-cal-grid">
                {months.map(({ year, month }) => (
                    <MonthGrid
                        key={`${year}-${month}`}
                        year={year}
                        month={month}
                        getPrice={getPrice}
                        getReservationStatus={getReservationStatus}
                        isSelected={isSelected}
                        isCheckIn={isCheckIn}
                        isCheckOut={isCheckOut}
                        isPast={isPast}
                        onDayClick={handleDayClick}
                        formatPrice={formatPrice}
                    />
                ))}
            </div>

            {/* Show More */}
            <div className="vd-cal-more-row">
                <button className="vd-cal-more-btn" onClick={showMoreMonths}>
                    <img src="/images/calO.svg" alt="" style={{ height: 24, marginRight: 8 }} />
                    Daha Fazla Ay Göster
                </button>
            </div>
        </section>
    );
}

/* ─── MonthGrid Sub-component ─── */
interface MonthGridProps {
    year: number;
    month: number;
    getPrice: (dateStr: string) => number | null;
    getReservationStatus: (dateStr: string) => "reserved" | "option" | null;
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
                    const selected = isSelected(dateStr);
                    const past = isPast(dateStr);
                    const checkIn = isCheckIn(dateStr);
                    const checkOut = isCheckOut(dateStr);

                    let cellClass = "vd-cal-cell";
                    if (past) cellClass += " vd-cal-past";
                    if (resStatus === "reserved") cellClass += " vd-cal-reserved";
                    if (resStatus === "option") cellClass += " vd-cal-option";
                    if (selected) cellClass += " vd-cal-selected";
                    if (checkIn) cellClass += " vd-cal-checkin";
                    if (checkOut) cellClass += " vd-cal-checkout";

                    const clickable = !past && resStatus !== "reserved";

                    return (
                        <div
                            key={dateStr}
                            className={cellClass}
                            onClick={clickable ? () => onDayClick(dateStr) : undefined}
                            style={{ cursor: clickable ? "pointer" : "default" }}
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
