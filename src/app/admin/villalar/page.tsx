"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface VillaRow {
    id: string;
    slug: string;
    name: string;
    location_label: string;
    max_guests: number;
    bedrooms: number;
    min_price: number;
    is_published: boolean;
    is_exclusive: boolean;
    cover_image_url: string;
    sort_order: number;
}

export default function AdminVillalar() {
    const [villas, setVillas] = useState<VillaRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadVillas();
    }, []);

    async function loadVillas() {
        setLoading(true);
        const { data, error } = await supabase
            .from("villas")
            .select("id, slug, name, location_label, max_guests, bedrooms, min_price, is_published, is_exclusive, cover_image_url, sort_order")
            .order("sort_order");

        if (!error && data) {
            setVillas(data);
        }
        setLoading(false);
    }

    async function togglePublished(id: string, current: boolean) {
        await supabase.from("villas").update({ is_published: !current }).eq("id", id);
        setVillas((prev) =>
            prev.map((v) => (v.id === id ? { ...v, is_published: !current } : v))
        );
    }

    async function deleteVilla(id: string, name: string) {
        if (!confirm(`"${name}" villasını silmek istediğinizden emin misiniz?`)) return;

        // İlişkili kayıtları önce sil (foreign key kısıtlamaları)
        await Promise.all([
            supabase.from("villa_images").delete().eq("villa_id", id),
            supabase.from("villa_features").delete().eq("villa_id", id),
            supabase.from("villa_categories").delete().eq("villa_id", id),
            supabase.from("villa_price_periods").delete().eq("villa_id", id),
            supabase.from("villa_disabled_dates").delete().eq("villa_id", id),
            supabase.from("villa_reviews").delete().eq("villa_id", id),
            supabase.from("villa_questions").delete().eq("villa_id", id),
            supabase.from("user_wishlists").delete().eq("villa_id", id),
            supabase.from("reservations").delete().eq("villa_id", id),
        ]);

        const { error } = await supabase.from("villas").delete().eq("id", id);
        if (error) {
            alert("Villa silinemedi: " + error.message);
            return;
        }
        setVillas((prev) => prev.filter((v) => v.id !== id));
    }

    const filtered = villas.filter((v) =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.location_label?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e293b", fontFamily: "'Poppins', sans-serif" }}>
                        Villalar
                    </h1>
                    <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>
                        Toplam {villas.length} villa
                    </p>
                </div>
                <Link
                    href="/admin/villalar/yeni"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "10px 20px",
                        borderRadius: 10,
                        background: "linear-gradient(135deg, #50b0f0, #3b82f6)",
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 600,
                        textDecoration: "none",
                        border: "none",
                    }}
                >
                    + Yeni Villa Ekle
                </Link>
            </div>

            {/* Search */}
            <div style={{ marginBottom: 20 }}>
                <input
                    type="text"
                    placeholder="Villa adı veya konum ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: "100%",
                        maxWidth: 400,
                        padding: "10px 16px",
                        borderRadius: 10,
                        border: "1px solid #e2e8f0",
                        fontSize: 14,
                        outline: "none",
                        boxSizing: "border-box",
                    }}
                />
            </div>

            {/* Table */}
            <div style={{
                background: "#fff",
                borderRadius: 16,
                border: "1px solid #e2e8f0",
                overflow: "hidden",
            }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                    <thead>
                        <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                            <th style={thStyle}>Görsel</th>
                            <th style={{ ...thStyle, textAlign: "left" }}>Villa Adı</th>
                            <th style={thStyle}>Konum</th>
                            <th style={thStyle}>Kapasite</th>
                            <th style={thStyle}>Fiyat</th>
                            <th style={thStyle}>Durum</th>
                            <th style={thStyle}>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>
                                    Yükleniyor...
                                </td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>
                                    Villa bulunamadı
                                </td>
                            </tr>
                        ) : (
                            filtered.map((villa) => (
                                <tr key={villa.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                    {/* Image */}
                                    <td style={{ padding: "10px 16px", textAlign: "center" }}>
                                        <img
                                            src={villa.cover_image_url || "/images/natureview.jpg"}
                                            alt={villa.name}
                                            style={{
                                                width: 56,
                                                height: 40,
                                                objectFit: "cover",
                                                borderRadius: 6,
                                            }}
                                        />
                                    </td>

                                    {/* Name */}
                                    <td style={{ padding: "10px 16px" }}>
                                        <div style={{ fontWeight: 600, color: "#1e293b" }}>{villa.name}</div>
                                        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                                            /{villa.slug}
                                        </div>
                                    </td>

                                    {/* Location */}
                                    <td style={{ padding: "10px 16px", textAlign: "center", color: "#64748b" }}>
                                        {villa.location_label}
                                    </td>

                                    {/* Capacity */}
                                    <td style={{ padding: "10px 16px", textAlign: "center", color: "#64748b" }}>
                                        {villa.bedrooms} Oda · {villa.max_guests} Kişi
                                    </td>

                                    {/* Price */}
                                    <td style={{ padding: "10px 16px", textAlign: "center", fontWeight: 600, color: "#1e293b" }}>
                                        ₺{villa.min_price?.toLocaleString("tr-TR")}
                                    </td>

                                    {/* Status */}
                                    <td style={{ padding: "10px 16px", textAlign: "center" }}>
                                        <button
                                            onClick={() => togglePublished(villa.id, villa.is_published)}
                                            style={{
                                                padding: "4px 12px",
                                                borderRadius: 20,
                                                border: "none",
                                                fontSize: 12,
                                                fontWeight: 500,
                                                cursor: "pointer",
                                                background: villa.is_published ? "#dcfce7" : "#fee2e2",
                                                color: villa.is_published ? "#16a34a" : "#dc2626",
                                            }}
                                        >
                                            {villa.is_published ? "Yayında" : "Taslak"}
                                        </button>
                                    </td>

                                    {/* Actions */}
                                    <td style={{ padding: "10px 16px", textAlign: "center" }}>
                                        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                                            <Link
                                                href={`/admin/villalar/${villa.id}`}
                                                style={{
                                                    padding: "6px 14px",
                                                    borderRadius: 8,
                                                    border: "1px solid #e2e8f0",
                                                    background: "#fff",
                                                    color: "#3b82f6",
                                                    fontSize: 12,
                                                    fontWeight: 500,
                                                    textDecoration: "none",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Düzenle
                                            </Link>
                                            <button
                                                onClick={() => deleteVilla(villa.id, villa.name)}
                                                style={{
                                                    padding: "6px 14px",
                                                    borderRadius: 8,
                                                    border: "1px solid #fee2e2",
                                                    background: "#fff",
                                                    color: "#dc2626",
                                                    fontSize: 12,
                                                    fontWeight: 500,
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Sil
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ─── Shared Styles ─── */
const thStyle: React.CSSProperties = {
    padding: "12px 16px",
    fontSize: 12,
    fontWeight: 600,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    textAlign: "center",
};
