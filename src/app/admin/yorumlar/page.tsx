"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface VillaReview {
    id: string;
    villa_id: string;
    user_name: string;
    user_email: string;
    rating: number;
    comment: string;
    is_approved: boolean;
    created_at: string;
    villas: {
        name: string;
    };
}

export default function AdminYorumlar() {
    const [reviews, setReviews] = useState<VillaReview[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReviews();
    }, []);

    async function loadReviews() {
        setLoading(true);
        const { data, error } = await supabase
            .from("villa_reviews")
            .select(`
                *,
                villas ( name )
            `)
            .order("created_at", { ascending: false });

        if (!error && data) {
            setReviews(data as any[]);
        }
        setLoading(false);
    }

    async function toggleApproval(id: string, currentStatus: boolean) {
        const { error } = await supabase
            .from("villa_reviews")
            .update({ is_approved: !currentStatus })
            .eq("id", id);
        
        if (!error) {
            setReviews((prev) =>
                prev.map((r) => (r.id === id ? { ...r, is_approved: !currentStatus } : r))
            );
        }
    }

    async function deleteReview(id: string) {
        if (!confirm("Bu yorumu silmek istediğinize emin misiniz?")) return;
        const { error } = await supabase.from("villa_reviews").delete().eq("id", id);
        if (!error) {
            setReviews((prev) => prev.filter((r) => r.id !== id));
        }
    }

    // Yıldız gösterme componenti
    const renderStars = (rating: number) => {
        return (
            <div style={{ display: "flex", gap: 2, color: "#fbbf24", fontSize: 16 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} style={{ opacity: star > rating ? 0.3 : 1 }}>★</span>
                ))}
            </div>
        );
    };

    if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Yorumlar yükleniyor...</div>;

    return (
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e293b", fontFamily: "'Poppins', sans-serif" }}>Müşteri Yorumları</h1>
                    <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>Villalara yapılan kullanıcı yorumlarını onaylayın veya silin.</p>
                </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                        <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569", fontSize: 13, textTransform: "uppercase" }}>
                            <th style={{ padding: "16px 20px" }}>Durum</th>
                            <th style={{ padding: "16px 20px" }}>Tarih</th>
                            <th style={{ padding: "16px 20px" }}>Villa</th>
                            <th style={{ padding: "16px 20px" }}>Müşteri / Puan</th>
                            <th style={{ padding: "16px 20px" }}>Yorum</th>
                            <th style={{ padding: "16px 20px", textAlign: "right" }}>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.length === 0 ? (
                            <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>Henüz yorum bulunmamaktadır.</td></tr>
                        ) : reviews.map((review) => (
                            <tr key={review.id} style={{ borderBottom: "1px solid #f1f5f9", background: review.is_approved ? "transparent" : "#fffbeb" }}>
                                <td style={{ padding: "16px 20px" }}>
                                    {review.is_approved ? (
                                        <span style={{ padding: "4px 8px", background: "#dcfce7", color: "#16a34a", borderRadius: 6, fontSize: 12, fontWeight: 600 }}>Onaylı</span>
                                    ) : (
                                        <span style={{ padding: "4px 8px", background: "#fef3c7", color: "#d97706", borderRadius: 6, fontSize: 12, fontWeight: 600 }}>Bekliyor</span>
                                    )}
                                </td>
                                <td style={{ padding: "16px 20px", color: "#64748b", fontSize: 13 }}>
                                    {new Date(review.created_at).toLocaleDateString("tr-TR")}
                                </td>
                                <td style={{ padding: "16px 20px", fontWeight: 500, color: "#0f172a", fontSize: 14 }}>
                                    {review.villas?.name || "Bilinmiyor"}
                                </td>
                                <td style={{ padding: "16px 20px" }}>
                                    <div style={{ fontWeight: 600, color: "#1e293b", fontSize: 14 }}>{review.user_name}</div>
                                    <div style={{ color: "#64748b", fontSize: 12, marginBottom: 4 }}>{review.user_email}</div>
                                    {renderStars(review.rating)}
                                </td>
                                <td style={{ padding: "16px 20px", color: "#334155", fontSize: 13, maxWidth: 350 }}>
                                    {review.comment}
                                </td>
                                <td style={{ padding: "16px 20px", textAlign: "right" }}>
                                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                        <button 
                                            onClick={() => toggleApproval(review.id, review.is_approved)}
                                            style={{ 
                                                padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none",
                                                background: review.is_approved ? "#fee2e2" : "#10b981", 
                                                color: review.is_approved ? "#dc2626" : "#fff" 
                                            }}
                                        >
                                            {review.is_approved ? "Gizle" : "Onayla"}
                                        </button>
                                        <button 
                                            onClick={() => deleteReview(review.id)}
                                            style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "1px solid #fee2e2", background: "#fff", color: "#dc2626" }}
                                        >
                                            Sil
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
