"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PhoneCall, Check, X, Clock, Trash2 } from "lucide-react";

interface CallbackRequest {
    id: string;
    name: string;
    phone: string;
    preferred_date: string | null;
    message: string | null;
    villa_name: string | null;
    villa_slug: string | null;
    status: "new" | "contacted" | "completed" | "cancelled";
    created_at: string;
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
    new: { label: "Yeni", color: "#f59e0b", bg: "#fef3c7" },
    contacted: { label: "İletişime Geçildi", color: "#3b82f6", bg: "#dbeafe" },
    completed: { label: "Tamamlandı", color: "#10b981", bg: "#d1fae5" },
    cancelled: { label: "İptal", color: "#ef4444", bg: "#fee2e2" },
};

export default function AdminCallbackPage() {
    const [requests, setRequests] = useState<CallbackRequest[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("callback_requests")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error && data) {
            setRequests(data as CallbackRequest[]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchRequests();

        // Realtime subscription
        const channel = supabase.channel("admin-callback-page")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "callback_requests" },
                () => fetchRequests()
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const updateStatus = async (id: string, status: string) => {
        await supabase.from("callback_requests").update({ status }).eq("id", id);
        fetchRequests();
    };

    const deleteRequest = async (id: string) => {
        if (!confirm("Bu talebi silmek istediğinize emin misiniz?")) return;
        await supabase.from("callback_requests").delete().eq("id", id);
        fetchRequests();
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const newCount = requests.filter(r => r.status === "new").length;

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <h1 style={{
                    fontSize: 26,
                    fontWeight: 700,
                    color: "#1e293b",
                    fontFamily: "'Poppins', sans-serif",
                }}>
                    Arama Talepleri
                </h1>
                {newCount > 0 && (
                    <span style={{
                        background: "#ef4444",
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 700,
                        padding: "3px 10px",
                        borderRadius: 20,
                    }}>
                        {newCount} Yeni
                    </span>
                )}
            </div>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>
                Müşterilerden gelen &quot;Sizi Arayalım&quot; form talepleri
            </p>

            {loading ? (
                <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>Yükleniyor...</div>
            ) : requests.length === 0 ? (
                <div style={{
                    textAlign: "center",
                    padding: 60,
                    color: "#94a3b8",
                    background: "#fff",
                    borderRadius: 16,
                    border: "1px solid #e2e8f0",
                }}>
                    Henüz arama talebi yok.
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {requests.map((req) => {
                        const st = STATUS_MAP[req.status] || STATUS_MAP.new;
                        return (
                            <div key={req.id} style={{
                                background: "#fff",
                                borderRadius: 16,
                                border: "1px solid #e2e8f0",
                                padding: "20px 24px",
                                boxShadow: req.status === "new" ? "0 0 0 2px #f59e0b40" : "none",
                                transition: "box-shadow 0.2s",
                            }}>
                                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                                    {/* Left: Info */}
                                    <div style={{ flex: 1, minWidth: 200 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                                            <div style={{
                                                width: 40, height: 40, borderRadius: 12,
                                                background: st.bg,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                            }}>
                                                <PhoneCall size={18} color={st.color} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: 16, color: "#1e293b" }}>
                                                    {req.name}
                                                </div>
                                                <a href={`tel:${req.phone}`} style={{ color: "#50b0f0", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
                                                    {req.phone}
                                                </a>
                                            </div>
                                        </div>

                                        {req.villa_name && (
                                            <div style={{ marginBottom: 6, fontSize: 13, color: "#64748b" }}>
                                                🏠 Villa: <strong>{req.villa_name}</strong>
                                            </div>
                                        )}

                                        {req.preferred_date && (
                                            <div style={{ marginBottom: 6, fontSize: 13, color: "#64748b" }}>
                                                📅 Aranma Tarihi: <strong>{new Date(req.preferred_date).toLocaleDateString("tr-TR")}</strong>
                                            </div>
                                        )}

                                        {req.message && (
                                            <div style={{
                                                marginTop: 8,
                                                padding: "10px 14px",
                                                background: "#f8fafc",
                                                borderRadius: 10,
                                                fontSize: 14,
                                                color: "#475569",
                                                lineHeight: 1.5,
                                                border: "1px solid #f1f5f9",
                                            }}>
                                                {req.message}
                                            </div>
                                        )}

                                        <div style={{ marginTop: 10, fontSize: 12, color: "#94a3b8" }}>
                                            {formatDate(req.created_at)}
                                        </div>
                                    </div>

                                    {/* Right: Status & Actions */}
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                                        <span style={{
                                            padding: "4px 12px",
                                            borderRadius: 20,
                                            fontSize: 12,
                                            fontWeight: 600,
                                            color: st.color,
                                            background: st.bg,
                                        }}>
                                            {st.label}
                                        </span>

                                        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                                            {req.status !== "contacted" && (
                                                <button
                                                    onClick={() => updateStatus(req.id, "contacted")}
                                                    title="İletişime Geçildi"
                                                    style={{
                                                        padding: "6px 10px", borderRadius: 8,
                                                        border: "1px solid #dbeafe",
                                                        background: "#eff6ff", cursor: "pointer",
                                                        display: "flex", alignItems: "center", gap: 4,
                                                        fontSize: 12, color: "#3b82f6", fontWeight: 500,
                                                    }}
                                                >
                                                    <Clock size={14} /> İletişimde
                                                </button>
                                            )}
                                            {req.status !== "completed" && (
                                                <button
                                                    onClick={() => updateStatus(req.id, "completed")}
                                                    title="Tamamlandı"
                                                    style={{
                                                        padding: "6px 10px", borderRadius: 8,
                                                        border: "1px solid #d1fae5",
                                                        background: "#ecfdf5", cursor: "pointer",
                                                        display: "flex", alignItems: "center", gap: 4,
                                                        fontSize: 12, color: "#10b981", fontWeight: 500,
                                                    }}
                                                >
                                                    <Check size={14} /> Tamamla
                                                </button>
                                            )}
                                            {req.status !== "cancelled" && (
                                                <button
                                                    onClick={() => updateStatus(req.id, "cancelled")}
                                                    title="İptal"
                                                    style={{
                                                        padding: "6px 10px", borderRadius: 8,
                                                        border: "1px solid #fee2e2",
                                                        background: "#fef2f2", cursor: "pointer",
                                                        display: "flex", alignItems: "center", gap: 4,
                                                        fontSize: 12, color: "#ef4444", fontWeight: 500,
                                                    }}
                                                >
                                                    <X size={14} /> İptal
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteRequest(req.id)}
                                                title="Sil"
                                                style={{
                                                    padding: "6px 8px", borderRadius: 8,
                                                    border: "1px solid #e2e8f0",
                                                    background: "#fff", cursor: "pointer",
                                                    display: "flex", alignItems: "center",
                                                }}
                                            >
                                                <Trash2 size={14} color="#94a3b8" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
