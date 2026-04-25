"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

const MONTH_NAMES_TR = [
    "OCAK", "ŞUBAT", "MART", "NİSAN", "MAYIS", "HAZİRAN",
    "TEMMUZ", "AĞUSTOS", "EYLÜL", "EKİM", "KASIM", "ARALIK"
];
const DAY_HEADERS = ["PT", "SA", "ÇA", "PE", "CU", "CT", "PZ"];

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

function getStartDayOfMonth(year: number, month: number): number {
    const d = new Date(year, month, 1).getDay();
    return d === 0 ? 6 : d - 1;
}

function isBetween(dateStr: string, start: string, end: string): boolean {
    return dateStr >= start && dateStr <= end;
}

export default function SidebarDatePicker({
    checkInDate,
    checkOutDate,
    onDateSelect,
    priceRanges,
    reservations,
    disabledReasons,
    formatPriceFn,
    minNights = 1
}: {
    checkInDate: string;
    checkOutDate: string;
    onDateSelect: (ci: string, co: string) => void;
    priceRanges: any[];
    reservations: any[];
    disabledReasons: any[];
    formatPriceFn: (p: number) => string;
    minNights?: number;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const [viewYear, setViewYear] = useState(() => {
        if (checkInDate) return parseDate(checkInDate).getFullYear();
        return new Date().getFullYear();
    });
    const [viewMonth, setViewMonth] = useState(() => {
        if (checkInDate) return parseDate(checkInDate).getMonth();
        return new Date().getMonth();
    });

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const goPrev = () => {
        setViewMonth((m) => {
            if (m === 0) {
                setViewYear((y) => y - 1);
                return 11;
            }
            return m - 1;
        });
    };

    const goNext = () => {
        setViewMonth((m) => {
            if (m === 11) {
                setViewYear((y) => y + 1);
                return 0;
            }
            return m + 1;
        });
    };

    // Derived states and lookups
    const getPrice = useCallback((dateStr: string): number | null => {
        for (const pr of priceRanges) {
            if (isBetween(dateStr, pr.startDate, pr.endDate)) return pr.price;
        }
        return null;
    }, [priceRanges]);

    const getReservationStatus = useCallback((dateStr: string): "reserved" | "option" | null => {
        for (const res of reservations) {
            if (isBetween(dateStr, res.startDate, res.endDate)) return res.status;
        }
        return null;
    }, [reservations]);

    const getDisabledReason = useCallback((dateStr: string): string | null => {
        for (const dr of disabledReasons) {
            if (isBetween(dateStr, dr.startDate, dr.endDate)) return dr.reason;
        }
        return null;
    }, [disabledReasons]);

    const isPast = useCallback((dateStr: string): boolean => {
        const today = toDateStr(new Date());
        return dateStr < today;
    }, []);

    const handleDayClick = (dateStr: string) => {
        if (isPast(dateStr)) return;
        if (getDisabledReason(dateStr) || getReservationStatus(dateStr)) {
            alert("Bu tarih rezerve edilmiştir veya kapalıdır.");
            return;
        }
        if (getPrice(dateStr) === null) return;

        if (!checkInDate || (checkInDate && checkOutDate)) {
            // Start new selection
            onDateSelect(dateStr, "");
        } else {
            // Set check-out
            if (dateStr <= checkInDate) {
                onDateSelect(dateStr, "");
            } else {
                const startD = parseDate(checkInDate);
                const endD = parseDate(dateStr);
                const nightCount = Math.round((endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24));
                if (nightCount < minNights) {
                    alert(`Minimum rezervasyon süresi ${minNights} gecedir.`);
                    return;
                }

                // Check for blocked dates in range
                let hasBlocked = false;
                const cursor = new Date(startD);
                while (cursor <= endD) {
                    const cs = toDateStr(cursor);
                    const s = getReservationStatus(cs);
                    if (s || getPrice(cs) === null || getDisabledReason(cs)) {
                        hasBlocked = true;
                        break;
                    }
                    cursor.setDate(cursor.getDate() + 1);
                }

                if (hasBlocked) {
                    onDateSelect(dateStr, "");
                } else {
                    onDateSelect(checkInDate, dateStr);
                    setIsOpen(false); // Close on complete selection
                }
            }
        }
    };

    // Render calendar grid
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const startDay = getStartDayOfMonth(viewYear, viewMonth);
    const cells: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    const isSelected = (dateStr: string) => {
        if (!checkInDate) return false;
        if (!checkOutDate) return dateStr === checkInDate;
        return isBetween(dateStr, checkInDate, checkOutDate);
    };

    const formatDateInput = (dateStr: string) => {
        if (!dateStr) return "";
        const d = parseDate(dateStr);
        return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth()+1).padStart(2, '0')}.${d.getFullYear()}`;
    };

    return (
        <div className="sidebar-date-picker-wrapper" ref={containerRef} style={{ position: 'relative' }}>
            <div 
                className="sidebar-date-inputs" 
                style={{ display: 'flex', gap: '16px', cursor: 'pointer' }}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: '4px', padding: '12px 16px', background: '#fff', fontSize: '14px', color: checkInDate ? '#333' : '#94a3b8' }}>
                    {checkInDate ? formatDateInput(checkInDate) : "Giriş Tarihi"}
                </div>
                <div style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: '4px', padding: '12px 16px', background: '#fff', fontSize: '14px', color: checkOutDate ? '#333' : '#94a3b8' }}>
                    {checkOutDate ? formatDateInput(checkOutDate) : "Çıkış Tarihi"}
                </div>
            </div>

            {isOpen && (
                <div style={{ 
                    position: 'absolute', 
                    top: '100%', 
                    left: 0, 
                    right: 0, 
                    marginTop: '8px', 
                    background: '#fff', 
                    borderRadius: '8px', 
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
                    border: '1px solid #e2e8f0', 
                    zIndex: 100,
                    padding: '20px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div onClick={(e) => { e.stopPropagation(); goPrev(); }} style={{ cursor: 'pointer', color: '#64748b', padding: '0 8px', fontWeight: 'bold' }}>{'<'}</div>
                        <div style={{ fontWeight: 600, color: '#94a3b8', fontSize: '14px', letterSpacing: '0.5px' }}>{MONTH_NAMES_TR[viewMonth]} {viewYear}</div>
                        <div onClick={(e) => { e.stopPropagation(); goNext(); }} style={{ cursor: 'pointer', color: '#64748b', padding: '0 8px', fontWeight: 'bold' }}>{'>'}</div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
                        {DAY_HEADERS.map(dh => (
                            <div key={dh} style={{ textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#94a3b8' }}>{dh}</div>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                        {cells.map((day, idx) => {
                            if (day === null) return <div key={`empty-${idx}`} />;
                            const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                            
                            const price = getPrice(dateStr);
                            const resStatus = getReservationStatus(dateStr);
                            const past = isPast(dateStr);
                            const disabled = getDisabledReason(dateStr);
                            const noPrice = price === null && !past && !resStatus;

                            const isSel = isSelected(dateStr);
                            const isCi = dateStr === checkInDate;
                            const isCo = dateStr === checkOutDate;

                            let bgColor = 'transparent';
                            let textColor = '#333';
                            if (isSel) bgColor = '#f1f5f9';
                            if (isCi || isCo) bgColor = '#f8fafc'; // light gray for start/end in the mock?
                            // Actually, let's use the primary blue color for selection
                            if (isSel) bgColor = '#e0f2fe';
                            if (isCi || isCo) { bgColor = '#0ea5e9'; textColor = '#fff'; }
                            if (past || resStatus || disabled) textColor = '#cbd5e1';

                            return (
                                <div 
                                    key={dateStr}
                                    onClick={() => handleDayClick(dateStr)}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '48px',
                                        borderRadius: (isCi || isCo) ? '50%' : '8px',
                                        background: bgColor,
                                        color: textColor,
                                        cursor: (past || resStatus || disabled || noPrice) ? 'not-allowed' : 'pointer',
                                        opacity: noPrice ? 0.5 : 1
                                    }}
                                >
                                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{day}</div>
                                    <div style={{ fontSize: '10px', color: (isCi || isCo) ? '#e0f2fe' : (past || resStatus || disabled ? '#cbd5e1' : '#94a3b8') }}>
                                        {price !== null ? formatPriceFn(price) : '–'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
