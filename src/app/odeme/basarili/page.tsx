"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
    const searchParams = useSearchParams();
    const ref = searchParams.get("ref");
    const refCode = ref ? ref.split("_")[0] : null;

    return (
        <>
            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes scaleIn {
                    from { transform: scale(0.7); opacity: 0; }
                    to   { transform: scale(1); opacity: 1; }
                }
                .success-card { animation: fadeUp 0.4s ease both; }
                .success-icon { animation: scaleIn 0.4s 0.1s ease both; }
            `}</style>

            <div style={{
                minHeight: "100vh", background: "#f8fafc",
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", padding: "32px 16px",
                fontFamily: "'DM Sans', sans-serif",
            }}>
                {/* Header */}
                <div style={{ marginBottom: 32 }}>
                    <img src="/images/vtlo.png" style={{ height: 40, objectFit: "contain" }} alt="Villa Tatilinde" />
                </div>

                <div className="success-card" style={{
                    width: "100%", maxWidth: 480,
                    background: "#fff", borderRadius: 20,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                    padding: "48px 36px",
                    textAlign: "center",
                }}>
                    {/* Icon */}
                    <div className="success-icon" style={{
                        width: 80, height: 80, borderRadius: "50%",
                        background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 28px",
                        boxShadow: "0 0 0 12px #f0fdf4",
                    }}>
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>

                    <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 10 }}>
                        Ödeme Başarılı
                    </h1>
                    <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, marginBottom: 28 }}>
                        Rezervasyonunuzun ön ödemesi başarıyla alınmış ve onaylanmıştır.<br />
                        Tatiliniz için sabırsızlanıyoruz!
                    </p>

                    {refCode && (
                        <div style={{
                            display: "inline-flex", alignItems: "center", gap: 8,
                            background: "#f8fafc", border: "1px solid #e2e8f0",
                            padding: "10px 20px", borderRadius: 10, marginBottom: 32,
                        }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                            <span style={{ fontSize: 12, color: "#64748b" }}>Referans No:</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", fontFamily: "monospace" }}>{refCode}</span>
                        </div>
                    )}

                    <Link href="/" style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        padding: "13px 32px", borderRadius: 10,
                        background: "#6772e5", color: "#fff",
                        fontSize: 14, fontWeight: 700, textDecoration: "none",
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        Ana Sayfaya Dön
                    </Link>
                </div>

                <p style={{ fontSize: 11, color: "#cbd5e1", marginTop: 24 }}>
                    © {new Date().getFullYear()} Villa Tatilinde — PRAEDIUM GROUP TRAVEL AGENCY
                </p>
            </div>
        </>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
