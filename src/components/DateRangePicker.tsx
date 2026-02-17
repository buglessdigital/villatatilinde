"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";

/* ─── Turkish Locale ─── */
const MONTH_NAMES_TR = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];
const DAY_NAMES_TR = ["PT", "SA", "ÇA", "PE", "CU", "CT", "PZ"];

/* ─── Helpers ─── */
function daysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

/** Monday=0, Sunday=6 */
function getMondayBasedDay(year: number, month: number, day: number): number {
    const d = new Date(year, month, day).getDay(); // 0=Sun
    return d === 0 ? 6 : d - 1;
}

function isSameDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

function isBeforeDay(a: Date, b: Date): boolean {
    const aa = new Date(a.getFullYear(), a.getMonth(), a.getDate());
    const bb = new Date(b.getFullYear(), b.getMonth(), b.getDate());
    return aa < bb;
}

function isBetween(d: Date, start: Date, end: Date): boolean {
    const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const s = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
    const e = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
    return dd > s && dd < e;
}

function formatDateTR(d: Date): string {
    const day = String(d.getDate()).padStart(2, "0");
    const month = MONTH_NAMES_TR[d.getMonth()];
    return `${day} ${month}`;
}

/* ─── Types ─── */
interface DateRangePickerProps {
    onDateChange?: (start: Date | null, end: Date | null, readable: string) => void;
}

interface MonthGridProps {
    year: number;
    month: number;
    today: Date;
    startDate: Date | null;
    endDate: Date | null;
    hoverDate: Date | null;
    onDayClick: (d: Date) => void;
    onDayHover: (d: Date) => void;
}

/* ─── MonthGrid ─── */
function MonthGrid({
    year,
    month,
    today,
    startDate,
    endDate,
    hoverDate,
    onDayClick,
    onDayHover,
}: MonthGridProps) {
    const totalDays = daysInMonth(year, month);
    const firstDayOffset = getMondayBasedDay(year, month, 1); // 0-6

    const rows: (number | null)[][] = [];
    let week: (number | null)[] = [];

    // leading blanks
    for (let i = 0; i < firstDayOffset; i++) {
        week.push(null);
    }

    for (let day = 1; day <= totalDays; day++) {
        week.push(day);
        if (week.length === 7) {
            rows.push(week);
            week = [];
        }
    }
    if (week.length > 0) {
        while (week.length < 7) week.push(null);
        rows.push(week);
    }

    const rangeEnd = endDate || hoverDate;

    return (
        <table
            style={{
                width: 260,
                borderCollapse: "collapse",
                tableLayout: "fixed",
            }}
        >
            <thead>
                <tr>
                    {DAY_NAMES_TR.map((dn) => (
                        <th
                            key={dn}
                            style={{
                                textAlign: "center",
                                fontSize: 12,
                                fontWeight: 400,
                                color: "#adb5bd",
                                padding: "4px 0 8px",
                                textTransform: "uppercase",
                                fontFamily: '"DM Sans", serif',
                            }}
                        >
                            {dn}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, ri) => (
                    <tr key={ri}>
                        {row.map((day, ci) => {
                            if (day === null) {
                                return <td key={ci} />;
                            }

                            const cellDate = new Date(year, month, day);
                            const isPast = isBeforeDay(cellDate, today);
                            const isToday = isSameDay(cellDate, today);

                            const isStart = startDate ? isSameDay(cellDate, startDate) : false;
                            const isEnd = endDate ? isSameDay(cellDate, endDate) : false;
                            const isHoverEnd =
                                !endDate && startDate && hoverDate
                                    ? isSameDay(cellDate, hoverDate)
                                    : false;

                            // Is in range?
                            let inRange = false;
                            if (startDate && rangeEnd && !isBeforeDay(rangeEnd, startDate)) {
                                inRange = isBetween(cellDate, startDate, rangeEnd);
                            }

                            // Is hovering in range (between start and hover)?
                            let isHovering = false;
                            if (startDate && hoverDate && !endDate && !isBeforeDay(hoverDate, startDate)) {
                                isHovering = isBetween(cellDate, startDate, hoverDate);
                            }

                            const isSelected = isStart || isEnd;
                            const isInRangeOrHover = inRange || isHovering;

                            // Styling
                            let cellBg = "transparent";
                            let cellColor = isPast ? "#ccc" : "#333";
                            let cellFontWeight: number = isPast ? 400 : 600;
                            let cellCursor = isPast ? "default" : "pointer";
                            let borderRadius = "0";
                            let border = "none";

                            if (isToday && !isSelected && !isInRangeOrHover) {
                                cellBg = "#6bb4d644";
                                cellColor = "#333";
                                borderRadius = "50%";
                            }

                            if (isInRangeOrHover) {
                                cellBg = "#e6e6fa";
                                cellColor = "#222";
                                cellFontWeight = 700;
                                borderRadius = "0";
                                border = "2px solid #333";
                                // Only top and bottom border for in-range
                                border = "none";
                            }

                            if (isStart && (endDate || hoverDate)) {
                                cellBg = "#e6e6fa";
                                cellColor = "#222";
                                cellFontWeight = 700;
                                borderRadius = "50% 0 0 50%";
                                border = "2px solid #333";
                                border = `2px solid #333`;
                            } else if (isStart && !endDate && !hoverDate) {
                                cellBg = "#e6e6fa";
                                cellColor = "#222";
                                cellFontWeight = 700;
                                borderRadius = "50%";
                                border = "2px solid #333";
                            }

                            if (isEnd || isHoverEnd) {
                                cellBg = "#e6e6fa";
                                cellColor = "#222";
                                cellFontWeight = 700;
                                borderRadius = "0 50% 50% 0";
                                border = "2px solid #333";
                            }

                            // Single-day selection
                            if (isStart && isEnd) {
                                borderRadius = "50%";
                            }

                            if (isStart && isSameDay(cellDate, rangeEnd || cellDate) && !endDate && !hoverDate) {
                                borderRadius = "50%";
                            }

                            return (
                                <td key={ci} style={{ padding: 0 }}>
                                    <div
                                        onClick={() => {
                                            if (!isPast) onDayClick(cellDate);
                                        }}
                                        onMouseEnter={() => {
                                            if (!isPast) onDayHover(cellDate);
                                        }}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: "100%",
                                            height: 36,
                                            fontSize: 13,
                                            fontWeight: cellFontWeight,
                                            color: cellColor,
                                            background: isInRangeOrHover ? "#e6e6fa" : "transparent",
                                            cursor: cellCursor,
                                            fontFamily: '"DM Sans", serif',
                                            boxSizing: "border-box",
                                            borderTop: isInRangeOrHover ? "2px solid #333" : "none",
                                            borderBottom: isInRangeOrHover ? "2px solid #333" : "none",
                                            borderLeft: "none",
                                            borderRight: "none",
                                            borderRadius: 0,
                                            position: "relative",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                width: 34,
                                                height: 34,
                                                borderRadius: borderRadius,
                                                border: (isStart || isEnd || isHoverEnd) ? border : "none",
                                                background: (isStart || isEnd || isHoverEnd) ? cellBg : isToday && !isInRangeOrHover ? cellBg : "transparent",
                                                boxSizing: "border-box",
                                            }}
                                        >
                                            {day}
                                        </div>
                                    </div>
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

/* ─── DateRangePicker Component ─── */
export default function DateRangePicker({ onDateChange }: DateRangePickerProps) {
    const today = useMemo(() => new Date(), []);

    const [isOpen, setIsOpen] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [hoverDate, setHoverDate] = useState<Date | null>(null);
    const [selectingEnd, setSelectingEnd] = useState(false);

    // Calendar view: left month
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());

    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    // Right month = left + 1
    const rightYear = viewMonth === 11 ? viewYear + 1 : viewYear;
    const rightMonth = viewMonth === 11 ? 0 : viewMonth + 1;

    const leftMonthLabel = `${MONTH_NAMES_TR[viewMonth].toUpperCase()} ${viewYear}`;
    const rightMonthLabel = `${MONTH_NAMES_TR[rightMonth].toUpperCase()} ${rightYear}`;

    /* ─── Navigation ─── */
    const goPrev = useCallback(() => {
        setViewMonth((m) => {
            if (m === 0) {
                setViewYear((y) => y - 1);
                return 11;
            }
            return m - 1;
        });
    }, []);

    const goNext = useCallback(() => {
        setViewMonth((m) => {
            if (m === 11) {
                setViewYear((y) => y + 1);
                return 0;
            }
            return m + 1;
        });
    }, []);

    /* ─── Day click handler ─── */
    const handleDayClick = useCallback(
        (d: Date) => {
            if (!selectingEnd || !startDate) {
                // First click = start date
                setStartDate(d);
                setEndDate(null);
                setSelectingEnd(true);
                setHoverDate(null);
            } else {
                // Second click = end date
                if (isBeforeDay(d, startDate)) {
                    // If clicked before start, reset start
                    setStartDate(d);
                    setEndDate(null);
                    setHoverDate(null);
                } else if (isSameDay(d, startDate)) {
                    // Same day = just start, wait for end
                    return;
                } else {
                    // Valid end date
                    setEndDate(d);
                    setSelectingEnd(false);

                    const readable = `${formatDateTR(startDate)} — ${formatDateTR(d)}`;
                    onDateChange?.(startDate, d, readable);
                }
            }
        },
        [selectingEnd, startDate, onDateChange]
    );

    const handleDayHover = useCallback(
        (d: Date) => {
            if (selectingEnd && startDate) {
                setHoverDate(d);
            }
        },
        [selectingEnd, startDate]
    );

    /* ─── Clear dates ─── */
    const clearDates = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            setStartDate(null);
            setEndDate(null);
            setHoverDate(null);
            setSelectingEnd(false);
            onDateChange?.(null, null, "");
        },
        [onDateChange]
    );

    /* ─── Click outside to close ─── */
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /* ─── Display text ─── */
    const displayText = useMemo(() => {
        if (startDate && endDate) {
            return `${formatDateTR(startDate)} — ${formatDateTR(endDate)}`;
        }
        if (startDate && !endDate) {
            return `${formatDateTR(startDate)} — ...`;
        }
        return "";
    }, [startDate, endDate]);

    const hasSelection = startDate !== null;

    return (
        <div style={{ width: "32%", position: "relative" }}>
            {/* ── Gradient wrapper ── */}
            <div
                style={{
                    background:
                        "linear-gradient(45deg, rgb(158, 83, 32) 20%, rgb(30, 144, 255) 100%)",
                    padding: 16,
                    borderRadius: 16,
                }}
            >
                {/* Label */}
                <div
                    className="middleft"
                    style={{ color: "#ffffff", fontWeight: 600 }}
                >
                    <img
                        src="/images/calO.svg"
                        style={{
                            filter: "invert(100%)",
                            marginLeft: 2,
                            opacity: 1,
                            marginRight: 8,
                            height: 18,
                        }}
                        alt=""
                    />
                    Giriş - Çıkış
                </div>

                {/* Trigger Button */}
                <div
                    ref={triggerRef}
                    onClick={() => setIsOpen((p) => !p)}
                    className="bhbhbg dm-sans"
                    style={{
                        marginTop: 8,
                        height: 48,
                        padding: 12,
                        width: "100%",
                        borderRadius: 8,
                        background: "#fff",
                        cursor: "pointer",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <span
                        style={{
                            color: "#747579cc",
                            fontSize: 19,
                            fontWeight: 500,
                        }}
                    >
                        {hasSelection ? displayText : "Tarih Seçimi"}
                    </span>
                    {/* Clear button */}
                    {hasSelection && (
                        <img
                            onClick={clearDates}
                            className="bhbhbg"
                            src="/images/close.svg"
                            style={{
                                position: "absolute",
                                right: 12,
                                top: "50%",
                                transform: "translateY(-50%)",
                                opacity: 0.8,
                                height: 24,
                                width: 24,
                                borderRadius: "50%",
                                padding: 3,
                                cursor: "pointer",
                            }}
                            alt="Temizle"
                            onError={(e) => {
                                // Fallback if close.svg doesn't exist
                                (e.target as HTMLImageElement).style.display = "none";
                            }}
                        />
                    )}
                </div>
            </div>

            {/* ── Calendar Dropdown ── */}
            <div
                ref={containerRef}
                style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: isOpen
                        ? "translateX(-50%) translateY(0)"
                        : "translateX(-50%) translateY(4px)",
                    marginTop: 10,
                    zIndex: isOpen ? 1111 : -1,
                    opacity: isOpen ? 1 : 0,
                    pointerEvents: isOpen ? "all" : "none",
                    transition: "opacity .3s ease-out, transform .3s ease-out",
                    background: "#fff",
                    borderRadius: 32,
                    boxShadow: "0 3px 12px 0 rgba(0,0,0,0.15)",
                    padding: "40px 40px 32px",
                    border: "1px solid #ecf0ef",
                    fontFamily: '"DM Sans", serif',
                }}
            >
                {/* Two-month layout */}
                <div style={{ display: "flex", gap: 24 }}>
                    {/* ── Left Month ── */}
                    <div>
                        {/* Header */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: 12,
                                position: "relative",
                            }}
                        >
                            <div
                                onClick={goPrev}
                                className="bhbhbg"
                                style={{
                                    position: "absolute",
                                    left: 0,
                                    cursor: "pointer",
                                    fontSize: 18,
                                    color: "#333",
                                    padding: "0 8px",
                                    userSelect: "none",
                                    fontWeight: 300,
                                }}
                            >
                                &#8249;
                            </div>
                            <div
                                style={{
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: "#333",
                                    textTransform: "uppercase",
                                    letterSpacing: 0.5,
                                }}
                            >
                                {leftMonthLabel}
                            </div>
                        </div>
                        <MonthGrid
                            year={viewYear}
                            month={viewMonth}
                            today={today}
                            startDate={startDate}
                            endDate={endDate}
                            hoverDate={hoverDate}
                            onDayClick={handleDayClick}
                            onDayHover={handleDayHover}
                        />
                    </div>

                    {/* ── Right Month ── */}
                    <div>
                        {/* Header */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: 12,
                                position: "relative",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: "#333",
                                    textTransform: "uppercase",
                                    letterSpacing: 0.5,
                                }}
                            >
                                {rightMonthLabel}
                            </div>
                            <div
                                onClick={goNext}
                                className="bhbhbg"
                                style={{
                                    position: "absolute",
                                    right: 0,
                                    cursor: "pointer",
                                    fontSize: 18,
                                    color: "#333",
                                    padding: "0 8px",
                                    userSelect: "none",
                                    fontWeight: 300,
                                }}
                            >
                                &#8250;
                            </div>
                        </div>
                        <MonthGrid
                            year={rightYear}
                            month={rightMonth}
                            today={today}
                            startDate={startDate}
                            endDate={endDate}
                            hoverDate={hoverDate}
                            onDayClick={handleDayClick}
                            onDayHover={handleDayHover}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
