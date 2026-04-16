"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface ReservationRow {
    id: string;
    ref_code: string;
    renter_first_name: string;
    renter_last_name: string;
    renter_phone_code: string;
    renter_phone_number: string;
    renter_email: string;
    check_in_date: string;
    check_out_date: string;
    nights: number;
    total_guests: number;
    total_amount: number;
    prepayment_amount: number;
    status: string;
    admin_notes: string;
    created_at: string;
}

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
    pending: { label: "Beklemede", bg: "#fef3c7", color: "#92400e" },
    pre_approved: { label: "Ön Onay Verildi", bg: "#ede9fe", color: "#6772e5" },
    confirmed: { label: "Onaylandı", bg: "#dcfce7", color: "#166534" },
    rejected: { label: "Reddedildi", bg: "#fee2e2", color: "#991b1b" },
};

function formatTR(n: number): string {
    return n.toLocaleString("tr-TR");
}

export default function AdminReservasyonlar() {
    const [reservations, setReservations] = useState<ReservationRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        loadReservations();
    }, []);

    async function loadReservations() {
        const { data, error } = await supabase
            .from("reservations")
            .select("id, ref_code, renter_first_name, renter_last_name, renter_phone_code, renter_phone_number, renter_email, check_in_date, check_out_date, nights, total_guests, total_amount, prepayment_amount, status, admin_notes, created_at")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Supabase error:", error);
        }
        if (data) setReservations(data);
        setLoading(false);
    }

    async function updateStatus(id: string, newStatus: string) {
        const { error } = await supabase.from("reservations").update({ status: newStatus }).eq("id", id);
        if (error) {
            alert("Hata: " + error.message);
            return;
        }
        setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    }

    function sendWhatsApp(r: ReservationRow) {
        const phone = (r.renter_phone_code + r.renter_phone_number).replace(/[^0-9]/g, "");
        const paymentUrl = `${window.location.origin}/odeme/${r.id}`;
        const message = encodeURIComponent(
            `Merhaba ${r.renter_first_name} ${r.renter_last_name},\n\n` +
            `${r.ref_code} numaralı rezervasyon talebiniz ön onay almıştır.\n\n` +
            `📅 Giriş: ${r.check_in_date}\n📅 Çıkış: ${r.check_out_date}\n` +
            `💰 Toplam: ₺${formatTR(r.total_amount)}\n` +
            `💳 Ön Ödeme (%15): ₺${formatTR(r.prepayment_amount)}\n\n` +
            `Ödeme linkiniz aşağıdadır:\n${paymentUrl}\n\n` +
            `Villa Tatilinde`
        );
        window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
    }

    const filtered = filter === "all" ? reservations : reservations.filter((r) => r.status === filter);

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e293b", fontFamily: "'Poppins', sans-serif" }}>Rezervasyonlar</h1>
                    <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>Toplam {reservations.length} rezervasyon</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                {[
                    { key: "all", label: "Tümü" },
                    { key: "pending", label: "🟡 Beklemede" },
                    { key: "pre_approved", label: "🔵 Ön Onaylı" },
                    { key: "confirmed", label: "🟢 Onaylı" },
                    { key: "rejected", label: "🔴 Reddedildi" },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key)}
                        style={{
                            padding: "6px 16px",
                            borderRadius: 20,
                            border: filter === tab.key ? "2px solid #6772e5" : "1px solid #e2e8f0",
                            background: filter === tab.key ? "#eff6ff" : "#fff",
                            color: filter === tab.key ? "#6772e5" : "#64748b",
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: "pointer",
                        }}
                    >
                        {tab.label} {tab.key === "all" ? `(${reservations.length})` : `(${reservations.filter((r) => r.status === tab.key).length})`}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                        <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                            <th style={thStyle}>Ref</th>
                            <th style={{ ...thStyle, textAlign: "left" }}>Misafir</th>
                            <th style={thStyle}>Tarih</th>
                            <th style={thStyle}>Tutar</th>
                            <th style={thStyle}>Durum</th>
                            <th style={thStyle}>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>Yükleniyor...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>Rezervasyon bulunamadı</td></tr>
                        ) : filtered.map((r) => {
                            const st = STATUS_MAP[r.status] || { label: r.status, bg: "#f1f5f9", color: "#64748b" };
                            return (
                                <tr key={r.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                    <td style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, fontFamily: "monospace", fontSize: 12 }}>{r.ref_code}</td>
                                    <td style={{ padding: "12px 16px" }}>
                                        <div style={{ fontWeight: 600, color: "#1e293b" }}>{r.renter_first_name} {r.renter_last_name}</div>
                                        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{r.renter_phone_code} {r.renter_phone_number}</div>
                                    </td>
                                    <td style={{ padding: "12px 16px", textAlign: "center", fontSize: 12 }}>
                                        <div>{r.check_in_date}</div>
                                        <div style={{ color: "#94a3b8" }}>{r.check_out_date}</div>
                                        <div style={{ fontSize: 11, color: "#64748b" }}>{r.nights} gece</div>
                                    </td>
                                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                                        <div style={{ fontWeight: 600 }}>₺{formatTR(r.total_amount)}</div>
                                        <div style={{ fontSize: 11, color: "#64748b" }}>Ön: ₺{formatTR(r.prepayment_amount)}</div>
                                    </td>
                                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                                        <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: st.bg, color: st.color }}>{st.label}</span>
                                    </td>
                                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                                        <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
                                            <Link href={`/admin/rezervasyonlar/${r.id}`} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #e2e8f0", background: "#fff", color: "#6772e5", fontSize: 11, fontWeight: 500, textDecoration: "none" }}>Detay</Link>
                                            {r.status === "pending" && (
                                                <button onClick={() => updateStatus(r.id, "pre_approved")} style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: "#6772e5", color: "#fff", fontSize: 11, fontWeight: 500, cursor: "pointer" }}>Ön Onayla</button>
                                            )}
                                            {r.status === "pre_approved" && (
                                                <>
                                                    <button onClick={() => sendWhatsApp(r)} style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: "#25D366", color: "#fff", fontSize: 11, fontWeight: 500, cursor: "pointer" }}>WP Gönder</button>
                                                    <button onClick={() => updateStatus(r.id, "confirmed")} style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: "#10b981", color: "#fff", fontSize: 11, fontWeight: 500, cursor: "pointer" }}>Ödeme Alındı</button>
                                                </>
                                            )}
                                            {(r.status === "pending" || r.status === "pre_approved") && (
                                                <button onClick={() => { if (confirm("Bu rezervasyonu reddetmek istediğinize emin misiniz?")) updateStatus(r.id, "rejected"); }} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #fee2e2", background: "#fff", color: "#dc2626", fontSize: 11, fontWeight: 500, cursor: "pointer" }}>Reddet</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const thStyle: React.CSSProperties = { padding: "12px 16px", fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center" };
