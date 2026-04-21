"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface ReservationPayment {
    id: string;
    ref_code: string;
    status: string;
    renter_first_name: string;
    renter_last_name: string;
    check_in_date: string;
    check_out_date: string;
    nights: number;
    total_guests: number;
    total_amount: number;
    prepayment_amount: number;
    remaining_amount: number;
    currency: string;
}

function formatTR(n: number): string {
    return Math.round(n).toLocaleString("tr-TR", { maximumFractionDigits: 0 });
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("tr-TR", {
        day: "numeric", month: "long", year: "numeric",
    });
}

/* ─── SVG Icons ─── */
const IconCalendar = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);
const IconUser = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);
const IconMoon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);
const IconCreditCard = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
);
const IconBank = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="22" x2="21" y2="22" /><line x1="6" y1="18" x2="6" y2="11" /><line x1="10" y1="18" x2="10" y2="11" /><line x1="14" y1="18" x2="14" y2="11" /><line x1="18" y1="18" x2="18" y2="11" /><polygon points="12 2 20 7 4 7" />
    </svg>
);
const IconShield = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);
const IconCheck = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);
const IconX = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);
const IconLoader = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);
const IconArrow = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
);
const IconAlert = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);
const IconPhone = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.47 2 2 0 0 1 3.62 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);
const IconCopy = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
);

/* ─── InfoRow ─── */
function InfoRow({ icon, label, value, bold, highlight, copyable }: {
    icon?: React.ReactNode; label: string; value: string;
    bold?: boolean; highlight?: boolean; copyable?: boolean;
}) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", fontSize: 13 }}>
                {icon && <span style={{ opacity: 0.6 }}>{icon}</span>}
                {label}
            </span>
            <span style={{
                fontWeight: bold || highlight ? 700 : 500,
                color: highlight ? "#6772e5" : "#1e293b",
                fontSize: highlight ? 15 : 13,
                display: "flex", alignItems: "center", gap: 6,
            }}>
                {value}
                {copyable && (
                    <button onClick={handleCopy} style={{ background: "none", border: "none", cursor: "pointer", color: copied ? "#16a34a" : "#94a3b8", padding: 0, display: "flex" }}>
                        {copied ? <IconCheck /> : <IconCopy />}
                    </button>
                )}
            </span>
        </div>
    );
}

export default function PaymentPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const rezId = params.id as string;
    const urlError = searchParams.get("error");

    const [rez, setRez] = useState<ReservationPayment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(urlError || "");
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => { loadReservation(); }, [rezId]);

    async function loadReservation() {
        const { data, error: fetchErr } = await supabase
            .from("reservations")
            .select("id, ref_code, status, renter_first_name, renter_last_name, check_in_date, check_out_date, nights, total_guests, total_amount, prepayment_amount, remaining_amount, currency")
            .eq("id", rezId)
            .single();

        if (fetchErr || !data) {
            setError("Rezervasyon bulunamadı veya link geçersiz.");
            setLoading(false);
            return;
        }
        if (data.status !== "pre_approved" && data.status !== "pending") {
            if (data.status === "confirmed") setError("Bu rezervasyonun ödemesi zaten alınmıştır.");
            else if (data.status === "rejected") setError("Bu rezervasyon reddedilmiştir.");
            setRez(data);
            setLoading(false);
            return;
        }
        setRez(data);
        setLoading(false);
    }

    const handleCreditCardPayment = async () => {
        setIsRedirecting(true);
        setError("");
        try {
            const res = await fetch("/api/payment/ziraat/initiate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reservationId: rezId })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Ödeme başlatılamadı.");
            const form = document.createElement("form");
            form.method = "POST";
            form.action = data.targetUrl;
            Object.keys(data.params).forEach(key => {
                const f = document.createElement("input");
                f.type = "hidden"; f.name = key; f.value = data.params[key];
                form.appendChild(f);
            });
            document.body.appendChild(form);
            form.submit();
        } catch (err: any) {
            setError(err.message || "Bir hata oluştu.");
            setIsRedirecting(false);
        }
    };

    /* ─── Loading ─── */
    if (loading) return (
        <div style={bg}>
            <style>{css}</style>
            <div style={shell}>
                <div style={{ textAlign: "center", padding: "80px 0", color: "#94a3b8" }}>
                    <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}><IconLoader /></div>
                    <span style={{ fontSize: 14 }}>Yükleniyor...</span>
                </div>
            </div>
        </div>
    );

    /* ─── Error (no reservation) ─── */
    if (error && !rez) return (
        <div style={bg}>
            <style>{css}</style>
            <div style={shell}>
                <div style={{ textAlign: "center", padding: "80px 24px" }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "#dc2626" }}>
                        <IconX />
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#dc2626", marginBottom: 6 }}>Hata</p>
                    <p style={{ fontSize: 13, color: "#64748b" }}>{error}</p>
                </div>
            </div>
        </div>
    );

    /* ─── Error (reservation exists but bad status) ─── */
    if (error && rez) return (
        <div style={bg}>
            <style>{css}</style>
            <div style={shell}>
                <div style={{ textAlign: "center", padding: "80px 24px" }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: "50%",
                        background: rez.status === "confirmed" ? "#f0fdf4" : "#fef2f2",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 20px",
                        color: rez.status === "confirmed" ? "#16a34a" : "#dc2626"
                    }}>
                        {rez.status === "confirmed" ? <IconCheck /> : <IconX />}
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: rez.status === "confirmed" ? "#16a34a" : "#dc2626", marginBottom: 6 }}>{error}</p>
                    <p style={{ fontSize: 12, color: "#94a3b8" }}>Ref: {rez.ref_code}</p>
                    {rez.status !== "confirmed" && (
                        <button onClick={() => window.location.href = `/odeme/${rezId}`}
                            style={{ marginTop: 20, padding: "10px 24px", background: "#6772e5", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
                            Tekrar Dene
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    if (!rez) return null;

    return (
        <div style={bg}>
            <style>{css}</style>

            {/* ── Header ── */}
            <header style={{ background: "#fff", borderBottom: "1px solid #f1f5f9", padding: "14px 24px" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <img src="/images/vtlo.png" style={{ height: 40, objectFit: "contain" }} alt="Villa Tatilinde" />
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b", fontWeight: 500 }}>
                        <span style={{ color: "#16a34a" }}><IconShield /></span>
                        Güvenli Ödeme
                    </div>
                </div>
            </header>

            {/* ── Content ── */}
            <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 16px 64px" }}>

                {/* Ref badge */}
                <div style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                    <div>
                        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>Ödeme</h1>
                        <p style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>Rezervasyon tamamlamak için ön ödemenizi gerçekleştirin.</p>
                    </div>
                    <span style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: "#ede9fe", color: "#6772e5", letterSpacing: "0.3px" }}>
                        # {rez.ref_code}
                    </span>
                </div>

                {/* Error banner */}
                {error && (
                    <div style={{ marginBottom: 20, padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, display: "flex", alignItems: "center", gap: 8, color: "#dc2626", fontSize: 13 }}>
                        <IconAlert /> {error}
                    </div>
                )}

                {/* Two-column grid */}
                <div className="pay-grid">

                    {/* ── LEFT: Reservation Info ── */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                        {/* Reservation Details */}
                        <div style={card}>
                            <SectionTitle icon={<IconUser />} title="Rezervasyon Detayları" />
                            <InfoRow icon={<IconUser />} label="Misafir" value={`${rez.renter_first_name} ${rez.renter_last_name}`} bold />
                            <InfoRow icon={<IconCalendar />} label="Giriş" value={formatDate(rez.check_in_date)} />
                            <InfoRow icon={<IconCalendar />} label="Çıkış" value={formatDate(rez.check_out_date)} />
                            <InfoRow icon={<IconMoon />} label="Konaklama" value={`${rez.nights} Gece · ${rez.total_guests} Misafir`} />
                        </div>

                        {/* Financial Summary */}
                        <div style={card}>
                            <SectionTitle icon={<IconCreditCard />} title="Ödeme Özeti" />
                            <InfoRow label="Toplam Konaklama Bedeli" value={`₺${formatTR(rez.total_amount)}`} bold />
                            <InfoRow label="Ön Ödeme (%15)" value={`₺${formatTR(rez.prepayment_amount)}`} highlight />
                            <InfoRow label="Girişte Ödenecek" value={`₺${formatTR(rez.remaining_amount)}`} />
                        </div>

                        {/* Bank Transfer */}
                        <div style={card}>
                            <SectionTitle icon={<IconBank />} title="Havale / EFT ile Ödeme" />
                            <InfoRow label="Banka" value="Ziraat Bankası" />
                            <InfoRow label="Hesap Sahibi" value="PRAEDIUM GROUP TRAVEL AGENCY" />
                            <InfoRow label="IBAN" value="TR00 0000 0000 0000 0000 0000 00" copyable />
                            <InfoRow label="Açıklama" value={rez.ref_code} bold copyable />
                            <div style={{ marginTop: 12, padding: "10px 12px", background: "#fffbeb", borderRadius: 8, border: "1px solid #fde68a", display: "flex", alignItems: "flex-start", gap: 8 }}>
                                <span style={{ color: "#d97706", flexShrink: 0, marginTop: 1 }}><IconAlert /></span>
                                <span style={{ fontSize: 12, color: "#92400e", lineHeight: 1.5 }}>
                                    Açıklama kısmına rezervasyon kodunuzu yazmayı unutmayın. Aksi hâlde ödemeniz eşleştirilemez.
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT: Payment Action ── */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                        {/* Amount box */}
                        <div style={{ ...card, background: "linear-gradient(135deg, #6772e5 0%, #50b0f0 100%)", border: "none", textAlign: "center" }}>
                            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>
                                Ödenecek Ön Ödeme
                            </p>
                            <div style={{ fontSize: 44, fontWeight: 800, color: "#fff", lineHeight: 1.1, marginBottom: 4 }}>
                                ₺{formatTR(rez.prepayment_amount)}
                            </div>
                            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 6 }}>
                                Toplam ₺{formatTR(rez.total_amount)} bedelinin %15'i
                            </p>
                        </div>

                        {/* Credit card payment */}
                        <div style={card}>
                            <SectionTitle icon={<IconCreditCard />} title="Kredi Kartı ile Öde" />
                            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20, lineHeight: 1.6 }}>
                                Ziraat Bankası güvencesiyle 3D Secure korumalı ödeme sayfasına yönlendirileceksiniz.
                            </p>

                            <button
                                onClick={handleCreditCardPayment}
                                disabled={isRedirecting}
                                className="pay-btn"
                                style={{
                                    width: "100%", padding: "15px 20px", borderRadius: 10,
                                    background: isRedirecting ? "#94a3b8" : "#6772e5",
                                    color: "#fff", fontSize: 15, fontWeight: 700, border: "none",
                                    cursor: isRedirecting ? "not-allowed" : "pointer",
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                                    transition: "background 0.2s",
                                }}
                            >
                                {isRedirecting ? (
                                    <><IconLoader /> Yönlendiriliyor...</>
                                ) : (
                                    <><IconCreditCard /> Güvenli Öde &nbsp;<IconArrow /></>
                                )}
                            </button>

                            {/* Card logos */}
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginTop: 16 }}>
                                {["Visa", "MasterCard", "Troy"].map(b => (
                                    <span key={b} style={{
                                        fontSize: 11, fontWeight: 700, color: "#475569",
                                        background: "#f8fafc", border: "1px solid #e2e8f0",
                                        padding: "4px 10px", borderRadius: 6, letterSpacing: "0.3px"
                                    }}>{b}</span>
                                ))}
                            </div>

                            {/* Security badges */}
                            <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
                                {[
                                    { icon: <IconShield />, text: "3D Secure" },
                                    { icon: <IconShield />, text: "SSL Şifreli" },
                                    { icon: <IconShield />, text: "Ziraat Bankası" },
                                ].map(b => (
                                    <span key={b.text} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#64748b" }}>
                                        <span style={{ color: "#16a34a" }}>{b.icon}</span> {b.text}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* WhatsApp contact */}
                        <div style={{ ...card, background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                            <p style={{ fontSize: 13, color: "#166534", fontWeight: 500, marginBottom: 12 }}>
                                Ödeme sonrası bizi bilgilendirmeniz yeterlidir.
                            </p>
                            <a
                                href="https://wa.me/905323990748"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                    padding: "11px 20px", borderRadius: 10,
                                    background: "#25D366", color: "#fff",
                                    fontSize: 14, fontWeight: 600, textDecoration: "none",
                                }}
                            >
                                <IconPhone /> WhatsApp ile İletişim
                            </a>
                        </div>

                        {/* Footer note */}
                        <div style={{ textAlign: "center", padding: "4px 0 8px" }}>
                            <p style={{ fontSize: 11, color: "#94a3b8" }}>
                                © {new Date().getFullYear()} Villa Tatilinde — PRAEDIUM GROUP TRAVEL AGENCY
                            </p>
                            <p style={{ fontSize: 11, color: "#cbd5e1", marginTop: 3 }}>Turizm Belgesi No: 18069</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ color: "#6772e5" }}>{icon}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{title}</span>
        </div>
    );
}

/* ─── Styles ─── */
const bg: React.CSSProperties = {
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "'DM Sans', sans-serif",
};

const card: React.CSSProperties = {
    background: "#fff",
    borderRadius: 14,
    padding: "20px 22px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
};

const shell: React.CSSProperties = {
    maxWidth: 560,
    margin: "40px auto",
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #e2e8f0",
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
};

const css = `
.pay-grid {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 20px;
    align-items: start;
}
.pay-btn:hover:not(:disabled) {
    background: #1d4ed8 !important;
}
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
@media (max-width: 820px) {
    .pay-grid {
        grid-template-columns: 1fr;
    }
}
`;
