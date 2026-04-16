"use client";
import { useMemo } from "react";
import { useCurrency } from "@/context/CurrencyContext";

/* ─── Types ─── */
interface CalendarPriceRange {
    startDate: string;
    endDate: string;
    price: number;
}

interface Props {
    checkIn: string;        // "YYYY-MM-DD"
    checkOut: string;       // "YYYY-MM-DD"
    priceRanges: CalendarPriceRange[];
    deposit: number;
    checkInTime: string;    // e.g. "16:00"
    checkOutTime: string;   // e.g. "10:00"
    currency?: string;
    villaSlug: string;
    onClose: () => void;
}

/* ─── Turkish Month Names (short) ─── */
const MONTH_SHORT_TR = [
    "Oca", "Şub", "Mar", "Nis", "May", "Haz",
    "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"
];

const MONTH_FULL_TR = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

/* ─── Helpers ─── */
function parseDate(s: string): Date {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d);
}

function isBetween(dateStr: string, start: string, end: string): boolean {
    return dateStr >= start && dateStr <= end;
}

function toDateStr(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function formatTR(n: number): string {
    return n.toLocaleString("tr-TR");
}

/* ─── Component ─── */
export default function ReservationBottomSheet({
    checkIn,
    checkOut,
    priceRanges,
    deposit,
    checkInTime,
    checkOutTime,
    currency = "₺",
    villaSlug,
    onClose,
}: Props) {
    const { convertPrice } = useCurrency();
    // Build array of dates from checkIn to checkOut (exclusive of checkout for pricing)
    const dateList = useMemo(() => {
        const result: { dateStr: string; day: number; monthShort: string }[] = [];
        const start = parseDate(checkIn);
        const end = parseDate(checkOut);
        const cursor = new Date(start);
        while (cursor <= end) {
            result.push({
                dateStr: toDateStr(cursor),
                day: cursor.getDate(),
                monthShort: MONTH_SHORT_TR[cursor.getMonth()],
            });
            cursor.setDate(cursor.getDate() + 1);
        }
        return result;
    }, [checkIn, checkOut]);

    // Get price for a date
    const getPrice = (dateStr: string): number | null => {
        for (const pr of priceRanges) {
            if (isBetween(dateStr, pr.startDate, pr.endDate)) {
                return pr.price;
            }
        }
        return null;
    };

    // Calculate totals
    const { nightCount, totalPrice, hasUnpricedDays } = useMemo(() => {
        const start = parseDate(checkIn);
        const end = parseDate(checkOut);
        const diffMs = end.getTime() - start.getTime();
        const nights = Math.round(diffMs / (1000 * 60 * 60 * 24));

        let total = 0;
        let unpriced = false;
        const cursor = new Date(start);
        // Price per night (check-in to day before checkout)
        for (let i = 0; i < nights; i++) {
            const ds = toDateStr(cursor);
            const p = getPrice(ds);
            if (p !== null) {
                total += p;
            } else {
                unpriced = true;
            }
            cursor.setDate(cursor.getDate() + 1);
        }

        return { nightCount: nights, totalPrice: total, hasUnpricedDays: unpriced };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkIn, checkOut, priceRanges]);

    const advancePayment = Math.round(totalPrice * 0.2);
    const remainingPayment = totalPrice - advancePayment;

    // Convert all amounts
    const convertedTotal = convertPrice(totalPrice);
    const convertedAdvance = convertPrice(advancePayment);
    const convertedRemaining = convertPrice(remainingPayment);
    const convertedDeposit = convertPrice(deposit);

    // Parse dates for display
    const checkInDate = parseDate(checkIn);
    const checkOutDate = parseDate(checkOut);

    const checkInDisplay = `${String(checkInDate.getDate()).padStart(2, "0")} ${MONTH_FULL_TR[checkInDate.getMonth()]}`;
    const checkOutDisplay = `${String(checkOutDate.getDate()).padStart(2, "0")} ${MONTH_FULL_TR[checkOutDate.getMonth()]}`;

    return (
        <div className="rbs-overlay" onClick={onClose}>
            <div className="rbs-sheet" onClick={(e) => e.stopPropagation()}>
                {/* Drag handle */}
                <div className="rbs-handle-row">
                    <div className="rbs-handle" />
                </div>

                {/* Close button (mobile swipe alternative) */}
                <button className="rbs-close-btn" onClick={onClose} aria-label="Kapat">
                    ✕
                </button>

                {/* Check-in / Check-out header */}
                <div className="rbs-dates-header">
                    <div className="rbs-date-col">
                        <span className="rbs-date-label">Giriş Saati</span>
                        <span className="rbs-date-value">{checkInDisplay}</span>
                        <span className="rbs-date-time">{checkInTime} Sonrasında</span>
                    </div>
                    <div className="rbs-date-divider">→</div>
                    <div className="rbs-date-col rbs-date-col-right">
                        <span className="rbs-date-label">Çıkış Saati</span>
                        <span className="rbs-date-value">{checkOutDisplay}</span>
                        <span className="rbs-date-time">Sabah {checkOutTime} Öncesinde</span>
                    </div>
                </div>

                {/* Horizontal date strip */}
                <div className="rbs-date-strip-wrapper">
                    <div className="rbs-date-strip">
                        {dateList.map((d, i) => {
                            const price = getPrice(d.dateStr);
                            const isFirst = i === 0;
                            const isLast = i === dateList.length - 1;
                            return (
                                <div
                                    key={d.dateStr}
                                    className={`rbs-strip-day ${isFirst ? "rbs-strip-first" : ""} ${isLast ? "rbs-strip-last" : ""}`}
                                >
                                    <span className="rbs-strip-month">{d.monthShort}</span>
                                    <span className="rbs-strip-num">{d.day}</span>
                                    <span className="rbs-strip-price">
                                        {!isLast ? (price !== null ? `${currency}${formatTR(convertPrice(price))}` : "–") : `${currency}0`}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Summary */}
                <div className="rbs-summary">
                    <div className="rbs-summary-row">
                        <span className="rbs-summary-label">Konaklama süreniz</span>
                        <span className="rbs-summary-value">{nightCount} Gece</span>
                    </div>
                    <div className="rbs-summary-row rbs-summary-total">
                        <span className="rbs-summary-label"><strong>Toplam Tutar</strong></span>
                        <span className="rbs-summary-value"><strong>{currency}{formatTR(convertedTotal)}</strong></span>
                    </div>
                </div>

                {/* Advance Payment */}
                <div className="rbs-payment-section">
                    <span className="rbs-payment-section-title">Gereken Ön Ödeme</span>
                    <div className="rbs-summary-row">
                        <span className="rbs-summary-label">%20 Ön Ödeme</span>
                        <span className="rbs-summary-value">{currency}{formatTR(convertedAdvance)}</span>
                    </div>
                </div>

                {/* Remaining Payment */}
                <div className="rbs-payment-section">
                    <span className="rbs-payment-section-title">Girişte Ödenmesi Gereken</span>
                    <div className="rbs-summary-row">
                        <span className="rbs-summary-label">%80 Kalan Ödeme</span>
                        <span className="rbs-summary-value">{currency}{formatTR(convertedRemaining)}</span>
                    </div>
                    <div className="rbs-summary-row">
                        <span className="rbs-summary-label">
                            Depozito <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: 7, background: "#e0e6ed", color: "#8e9db5", fontSize: 10, textAlign: "center", lineHeight: "14px", margin: "0 4px" }}>?</span> <span className="rbs-deposit-note">(toplam tutara dahil değildir)</span>
                        </span>
                        <span className="rbs-summary-value">{currency}{formatTR(convertedDeposit)}</span>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="rbs-cta-row">
                    {hasUnpricedDays ? (
                        <div style={{ textAlign: "center", padding: "12px 16px", background: "#fef3c7", borderRadius: 10, color: "#92400e", fontSize: 13 }}>
                            Seçtiğiniz tarihlerde fiyatlandırılmamış günler var. Rezervasyon yapılamaz.
                        </div>
                    ) : (
                        <a
                            href={`/tatilvillasi/${villaSlug}/rezervasyon?checkIn=${checkIn}&checkOut=${checkOut}`}
                            className="rbs-cta-btn"
                        >
                            Ön İzleme ve Onay &gt;
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
