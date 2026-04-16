"use client";

import React, { useState, useCallback, useMemo } from "react";

const MONTH_NAMES_TR = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];
const DAY_NAMES_TR = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

const PERIOD_COLORS = [
    { bg: "#fde68a", text: "#92400e", border: "#fbbf24" },
    { bg: "#bbf7d0", text: "#065f46", border: "#34d399" },
    { bg: "#fecaca", text: "#991b1b", border: "#f87171" },
    { bg: "#ddd6fe", text: "#4c1d95", border: "#a78bfa" },
    { bg: "#fed7aa", text: "#7c2d12", border: "#fb923c" },
    { bg: "#bfdbfe", text: "#1e3a8a", border: "#60a5fa" },
    { bg: "#f9a8d4", text: "#831843", border: "#f472b6" },
];

function daysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

function getMondayBasedDay(year: number, month: number, day: number): number {
    const d = new Date(year, month, day).getDay();
    return d === 0 ? 6 : d - 1;
}

function isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();
}

function isBeforeDay(a: Date, b: Date): boolean {
    return new Date(a.getFullYear(), a.getMonth(), a.getDate()) <
        new Date(b.getFullYear(), b.getMonth(), b.getDate());
}

function isBetween(d: Date, start: Date, end: Date): boolean {
    const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const s = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
    const e = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
    return dd >= s && dd <= e;
}

function toYMD(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function parseYMD(s: string): Date | null {
    if (!s) return null;
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d);
}

export interface ExistingPeriod {
    start_date: string;
    end_date: string;
    label: string;
}

/* ─── MonthGrid ─── */
interface MonthGridProps {
    year: number;
    month: number;
    today: Date;
    startDate: Date | null;
    endDate: Date | null;
    hoverDate: Date | null;
    existingPeriods: ExistingPeriod[];
    selColor: string;
    rangeColor: string;
    rangeText: string;
    onDayClick: (d: Date) => void;
    onDayHover: (d: Date) => void;
}

function MonthGrid({ year, month, today, startDate, endDate, hoverDate, existingPeriods, selColor, rangeColor, rangeText, onDayClick, onDayHover }: MonthGridProps) {
    const totalDays = daysInMonth(year, month);
    const firstOffset = getMondayBasedDay(year, month, 1);

    const rows: (number | null)[][] = [];
    let week: (number | null)[] = [];
    for (let i = 0; i < firstOffset; i++) week.push(null);
    for (let day = 1; day <= totalDays; day++) {
        week.push(day);
        if (week.length === 7) { rows.push(week); week = []; }
    }
    if (week.length > 0) {
        while (week.length < 7) week.push(null);
        rows.push(week);
    }

    const parsedPeriods = useMemo(() =>
        existingPeriods.map((p, i) => ({
            start: parseYMD(p.start_date)!,
            end: parseYMD(p.end_date)!,
            label: p.label,
            colorIdx: i % PERIOD_COLORS.length,
        })).filter(p => p.start && p.end),
        [existingPeriods]
    );

    const rangeEnd = endDate || hoverDate;

    return (
        <table style={{ borderCollapse: "collapse", tableLayout: "fixed", width: 230 }}>
            <thead>
                <tr>
                    {DAY_NAMES_TR.map(dn => (
                        <th key={dn} style={{ textAlign: "center", fontSize: 11, fontWeight: 500, color: "#94a3b8", padding: "2px 0 8px" }}>
                            {dn}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, ri) => (
                    <tr key={ri}>
                        {row.map((day, ci) => {
                            if (day === null) return <td key={ci} />;
                            const cellDate = new Date(year, month, day);
                            const isPast = isBeforeDay(cellDate, today);
                            const isToday = isSameDay(cellDate, today);
                            const isStart = startDate ? isSameDay(cellDate, startDate) : false;
                            const isEnd = endDate ? isSameDay(cellDate, endDate) : false;
                            const isHoverEnd = !endDate && startDate && hoverDate ? isSameDay(cellDate, hoverDate) : false;

                            let inRange = false;
                            if (startDate && rangeEnd && !isBeforeDay(rangeEnd, startDate)) {
                                inRange = isBetween(cellDate, startDate, rangeEnd);
                            }

                            const isSelected = isStart || isEnd || isHoverEnd;

                            const matchedPeriod = parsedPeriods.find(p => isBetween(cellDate, p.start, p.end));
                            const isExistingStart = matchedPeriod ? isSameDay(cellDate, matchedPeriod.start) : false;
                            const isExistingEnd = matchedPeriod ? isSameDay(cellDate, matchedPeriod.end) : false;
                            const periodColor = matchedPeriod ? PERIOD_COLORS[matchedPeriod.colorIdx] : null;

                            let bg = "transparent";
                            let color = isPast ? "#cbd5e1" : "#1e293b";
                            let fw = 500;
                            let radius = "6px";
                            let outerBg = "transparent";

                            if (isToday && !isSelected && !inRange && !matchedPeriod) {
                                bg = "#f0f9ff";
                                color = "#0284c7";
                                fw = 700;
                            }

                            if (matchedPeriod && !isSelected) {
                                outerBg = periodColor!.bg;
                                color = periodColor!.text;
                                fw = 500;
                                if (isExistingStart && isExistingEnd) { radius = "6px"; }
                                else if (isExistingStart) { radius = "6px 0 0 6px"; }
                                else if (isExistingEnd) { radius = "0 6px 6px 0"; }
                                else { radius = "0"; }
                            }

                            if (inRange && !isSelected) {
                                outerBg = "transparent";
                                bg = rangeColor;
                                color = rangeText;
                            }
                            if (isStart) {
                                outerBg = "transparent";
                                bg = selColor;
                                color = "#fff";
                                fw = 700;
                                radius = endDate || hoverDate ? "6px 0 0 6px" : "6px";
                            }
                            if (isEnd || isHoverEnd) {
                                outerBg = "transparent";
                                bg = selColor;
                                color = "#fff";
                                fw = 700;
                                radius = "0 6px 6px 0";
                            }
                            if (isStart && (isEnd || isHoverEnd)) {
                                radius = "6px";
                            }

                            const title = matchedPeriod && !isSelected ? matchedPeriod.label : undefined;

                            return (
                                <td key={ci} style={{ padding: 0 }}>
                                    <div
                                        onClick={() => !isPast && onDayClick(cellDate)}
                                        onMouseEnter={() => !isPast && onDayHover(cellDate)}
                                        title={title}
                                        style={{
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            height: 32, fontSize: 12, fontWeight: fw,
                                            color,
                                            background: matchedPeriod && !isSelected && !inRange ? outerBg : (inRange && !isSelected ? bg : "transparent"),
                                            borderRadius: matchedPeriod && !isSelected && !inRange ? radius : undefined,
                                            cursor: isPast ? "default" : "pointer",
                                        }}
                                    >
                                        <div style={{
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            width: 30, height: 30,
                                            borderRadius: isSelected ? radius : undefined,
                                            background: isSelected ? bg : "transparent",
                                        }}>
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

/* ─── AdminCalendarPicker ─── */
interface AdminCalendarPickerProps {
    startDate: string;
    endDate: string;
    onChange: (start: string, end: string) => void;
    existingPeriods?: ExistingPeriod[];
    /** "price" = mavi (varsayılan) | "blocked" = kırmızı */
    variant?: "price" | "blocked";
}

const THEMES = {
    price: {
        selColor: "#0ea5e9",
        rangeColor: "#e0f2fe",
        rangeText: "#0369a1",
        activeInputBorder: "#bae6fd",
        activeInputBg: "#f0f9ff",
        activeInputText: "#0369a1",
        legendLabel: "Mevcut Fiyat Dönemleri",
        containerBorder: "#e2e8f0",
    },
    blocked: {
        selColor: "#ef4444",
        rangeColor: "#fee2e2",
        rangeText: "#991b1b",
        activeInputBorder: "#fca5a5",
        activeInputBg: "#fef2f2",
        activeInputText: "#b91c1c",
        legendLabel: "Mevcut Kapalı Tarihler",
        containerBorder: "#fca5a5",
    },
};

export default function AdminCalendarPicker({
    startDate,
    endDate,
    onChange,
    existingPeriods = [],
    variant = "price",
}: AdminCalendarPickerProps) {
    const theme = THEMES[variant];

    const today = useMemo(() => {
        const d = new Date();
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }, []);

    const initStart = parseYMD(startDate);
    const initEnd = parseYMD(endDate);

    const [selStart, setSelStart] = useState<Date | null>(initStart);
    const [selEnd, setSelEnd] = useState<Date | null>(initEnd);
    const [hoverDate, setHoverDate] = useState<Date | null>(null);
    const [selectingEnd, setSelectingEnd] = useState(false);

    const initYear = initStart ? initStart.getFullYear() : today.getFullYear();
    const initMonth = initStart ? initStart.getMonth() : today.getMonth();
    const [viewYear, setViewYear] = useState(initYear);
    const [viewMonth, setViewMonth] = useState(initMonth);

    const rightYear = viewMonth === 11 ? viewYear + 1 : viewYear;
    const rightMonth = viewMonth === 11 ? 0 : viewMonth + 1;

    const goPrev = useCallback(() => {
        if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
        else setViewMonth(m => m - 1);
    }, [viewMonth]);

    const goNext = useCallback(() => {
        if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
        else setViewMonth(m => m + 1);
    }, [viewMonth]);

    const handleDayClick = useCallback((d: Date) => {
        if (!selectingEnd || !selStart) {
            setSelStart(d);
            setSelEnd(null);
            setSelectingEnd(true);
            setHoverDate(null);
            onChange(toYMD(d), "");
        } else {
            if (isBeforeDay(d, selStart)) {
                setSelStart(d);
                setSelEnd(null);
                setHoverDate(null);
                onChange(toYMD(d), "");
            } else if (isSameDay(d, selStart)) {
                return;
            } else {
                setSelEnd(d);
                setSelectingEnd(false);
                onChange(toYMD(selStart), toYMD(d));
            }
        }
    }, [selectingEnd, selStart, onChange]);

    const handleDayHover = useCallback((d: Date) => {
        if (selectingEnd && selStart) setHoverDate(d);
    }, [selectingEnd, selStart]);

    const clear = () => {
        setSelStart(null);
        setSelEnd(null);
        setHoverDate(null);
        setSelectingEnd(false);
        onChange("", "");
    };

    const legendPeriods = existingPeriods.slice(0, PERIOD_COLORS.length);

    const makeInputStyle = (active: boolean): React.CSSProperties => ({
        width: "100%",
        padding: "7px 10px",
        borderRadius: 8,
        border: `1px solid ${active ? theme.activeInputBorder : "#e2e8f0"}`,
        background: active ? theme.activeInputBg : "#f8fafc",
        color: active ? theme.activeInputText : "#94a3b8",
        fontWeight: active ? 600 : 400,
        fontSize: 13,
        outline: "none",
        cursor: "pointer",
        boxSizing: "border-box",
        fontFamily: "inherit",
    });

    return (
        <div style={{ background: "#fff", border: `1px solid ${theme.containerBorder}`, borderRadius: 12, padding: 16 }}>
            {/* Date inputs */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 14 }}>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>Başlangıç</div>
                    <input
                        type="date"
                        value={selStart ? toYMD(selStart) : ""}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (!val) { setSelStart(null); onChange("", selEnd ? toYMD(selEnd) : ""); return; }
                            const d = new Date(val + "T00:00:00");
                            if (!isNaN(d.getTime())) {
                                setSelStart(d);
                                setSelEnd(null);
                                setSelectingEnd(true);
                                onChange(toYMD(d), "");
                            }
                        }}
                        style={makeInputStyle(!!selStart)}
                    />
                </div>
                <span style={{ color: "#94a3b8", fontSize: 20, marginBottom: 8 }}>→</span>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>Bitiş</div>
                    <input
                        type="date"
                        value={selEnd ? toYMD(selEnd) : ""}
                        min={selStart ? toYMD(selStart) : ""}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (!val) { setSelEnd(null); onChange(selStart ? toYMD(selStart) : "", ""); return; }
                            const d = new Date(val + "T00:00:00");
                            if (!isNaN(d.getTime()) && selStart && !isBeforeDay(d, selStart)) {
                                setSelEnd(d);
                                setSelectingEnd(false);
                                onChange(toYMD(selStart), toYMD(d));
                            }
                        }}
                        style={makeInputStyle(!!selEnd)}
                    />
                </div>
                {(selStart || selEnd) && (
                    <button
                        onClick={clear}
                        style={{
                            padding: "7px 12px", borderRadius: 6, marginBottom: 0,
                            border: "1px solid #e2e8f0",
                            background: "#fff", color: "#64748b", fontSize: 12, cursor: "pointer",
                            whiteSpace: "nowrap",
                        }}
                    >
                        Temizle
                    </button>
                )}
            </div>

            {/* Hint when selecting end */}
            {selectingEnd && !selEnd && (
                <div style={{
                    fontSize: 12, color: theme.activeInputText, background: theme.activeInputBg,
                    border: `1px solid ${theme.activeInputBorder}`, borderRadius: 8,
                    padding: "6px 12px", marginBottom: 12, textAlign: "center",
                }}>
                    Bitiş tarihini seçin…
                </div>
            )}

            {/* Calendar grid */}
            <div style={{ display: "flex", gap: 20 }}>
                {/* Left month */}
                <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                        <button onClick={goPrev} style={{
                            background: "none", border: "1px solid #e2e8f0", borderRadius: 6,
                            width: 28, height: 28, cursor: "pointer", fontSize: 14, color: "#64748b",
                        }}>‹</button>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>
                            {MONTH_NAMES_TR[viewMonth]} {viewYear}
                        </span>
                        <div style={{ width: 28 }} />
                    </div>
                    <MonthGrid
                        year={viewYear} month={viewMonth} today={today}
                        startDate={selStart} endDate={selEnd} hoverDate={hoverDate}
                        existingPeriods={existingPeriods}
                        selColor={theme.selColor}
                        rangeColor={theme.rangeColor}
                        rangeText={theme.rangeText}
                        onDayClick={handleDayClick} onDayHover={handleDayHover}
                    />
                </div>

                {/* Divider */}
                <div style={{ width: 1, background: "#f1f5f9", margin: "0 4px" }} />

                {/* Right month */}
                <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                        <div style={{ width: 28 }} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>
                            {MONTH_NAMES_TR[rightMonth]} {rightYear}
                        </span>
                        <button onClick={goNext} style={{
                            background: "none", border: "1px solid #e2e8f0", borderRadius: 6,
                            width: 28, height: 28, cursor: "pointer", fontSize: 14, color: "#64748b",
                        }}>›</button>
                    </div>
                    <MonthGrid
                        year={rightYear} month={rightMonth} today={today}
                        startDate={selStart} endDate={selEnd} hoverDate={hoverDate}
                        existingPeriods={existingPeriods}
                        selColor={theme.selColor}
                        rangeColor={theme.rangeColor}
                        rangeText={theme.rangeText}
                        onDayClick={handleDayClick} onDayHover={handleDayHover}
                    />
                </div>
            </div>

            {/* Legend */}
            {legendPeriods.length > 0 && (
                <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid #f1f5f9" }}>
                    <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {theme.legendLabel}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {legendPeriods.map((p, i) => {
                            const c = PERIOD_COLORS[i % PERIOD_COLORS.length];
                            return (
                                <div key={i} style={{
                                    display: "flex", alignItems: "center", gap: 5,
                                    fontSize: 11, padding: "3px 8px", borderRadius: 20,
                                    background: c.bg, color: c.text,
                                    border: `1px solid ${c.border}`,
                                    fontWeight: 500,
                                }}>
                                    <span style={{ fontWeight: 700 }}>{p.start_date.slice(5).replace("-", "/")} – {p.end_date.slice(5).replace("-", "/")}</span>
                                    <span style={{ opacity: 0.75 }}>{p.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
