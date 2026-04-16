"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface CouponRequest {
    id: string;
    customer_name: string;
    pnr_number: string;
    promotion_name: string;
    coupon_code: string;
    created_at: string;
}

export default function AdminPromosyonKuponlariPage() {
    const [requests, setRequests] = useState<CouponRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRequests();
    }, []);

    async function loadRequests() {
        const { data, error } = await supabase
            .from("coupon_requests")
            .select("*")
            .order("created_at", { ascending: false });
        if (data) setRequests(data);
        if (error) console.error(error);
        setLoading(false);
    }

    async function deleteRequest(id: string) {
        if (!confirm("Bu kupon kaydını silmek istediğinize emin misiniz?")) return;
        const { error } = await supabase.from("coupon_requests").delete().eq("id", id);
        if (error) alert("Hata: " + error.message);
        else setRequests(prev => prev.filter(r => r.id !== id));
    }

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e293b", fontFamily: "'Poppins', sans-serif" }}>
                    Promosyon Kupon Talepleri
                </h1>
                <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>
                    Müşterilerin oluşturduğu tüm indirim kuponları
                </p>
            </div>

            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, textAlign: "left" }}>
                    <thead>
                        <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                            <th style={{ padding: "14px 16px", color: "#64748b", fontWeight: 600 }}>Tarih</th>
                            <th style={{ padding: "14px 16px", color: "#64748b", fontWeight: 600 }}>Müşteri</th>
                            <th style={{ padding: "14px 16px", color: "#64748b", fontWeight: 600 }}>PNR</th>
                            <th style={{ padding: "14px 16px", color: "#64748b", fontWeight: 600 }}>Promosyon (Ayrıcalık)</th>
                            <th style={{ padding: "14px 16px", color: "#64748b", fontWeight: 600 }}>Kupon Kodu</th>
                            <th style={{ padding: "14px 16px", color: "#64748b", fontWeight: 600, textAlign: "right" }}>İşlem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={6} style={{ padding: 20, textAlign: "center", color: "#94a3b8" }}>Yükleniyor...</td>
                            </tr>
                        )}
                        {!loading && requests.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ padding: 20, textAlign: "center", color: "#94a3b8" }}>Hiç kupon talebi bulunamadı.</td>
                            </tr>
                        )}
                        {requests.map(r => (
                            <tr key={r.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                                <td style={{ padding: "14px 16px", color: "#475569" }}>
                                    {new Date(r.created_at).toLocaleString("tr-TR")}
                                </td>
                                <td style={{ padding: "14px 16px", fontWeight: 500, color: "#1e293b" }}>{r.customer_name}</td>
                                <td style={{ padding: "14px 16px", color: "#475569" }}>{r.pnr_number}</td>
                                <td style={{ padding: "14px 16px", color: "#475569" }}>{r.promotion_name}</td>
                                <td style={{ padding: "14px 16px", fontWeight: 700, color: "#10b981", letterSpacing: 1 }}>{r.coupon_code}</td>
                                <td style={{ padding: "14px 16px", textAlign: "right" }}>
                                    <button
                                        onClick={() => deleteRequest(r.id)}
                                        style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: "#fee2e2", color: "#ef4444", cursor: "pointer", fontSize: 13 }}
                                    >
                                        Sil
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
