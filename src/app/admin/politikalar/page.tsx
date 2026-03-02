"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface PolicyRow {
    id: string;
    slug: string;
    title: string;
    content_html: string | null;
}

export default function AdminPolitikalar() {
    const [policies, setPolicies] = useState<PolicyRow[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPolicies();
    }, []);

    async function loadPolicies() {
        const { data } = await supabase
            .from("policies")
            .select("id, slug, title, content_html")
            .order("title", { ascending: true });
        if (data) setPolicies(data);
        setLoading(false);
    }

    async function deletePolicy(id: string, title: string) {
        if (!confirm(`"${title}" politikasını silmek istediğinizden emin misiniz?`)) return;
        await supabase.from("policies").delete().eq("id", id);
        setPolicies((prev) => prev.filter((p) => p.id !== id));
    }

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e293b", fontFamily: "'Poppins', sans-serif" }}>Politikalar & Sözleşmeler</h1>
                    <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>Toplam {policies.length} politika</p>
                </div>
                <Link href="/admin/politikalar/yeni" style={{ padding: "10px 20px", borderRadius: 10, background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
                    + Yeni Politika
                </Link>
            </div>

            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                    <thead>
                        <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                            <th style={{ ...thStyle, textAlign: "left" }}>Başlık</th>
                            <th style={thStyle}>Slug</th>
                            <th style={thStyle}>İçerik Durumu</th>
                            <th style={thStyle}>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>Yükleniyor...</td></tr>
                        ) : policies.length === 0 ? (
                            <tr><td colSpan={4} style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>Politika bulunamadı</td></tr>
                        ) : policies.map((policy) => (
                            <tr key={policy.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                <td style={{ padding: "14px 16px" }}>
                                    <div style={{ fontWeight: 600, color: "#1e293b" }}>{policy.title}</div>
                                </td>
                                <td style={{ padding: "14px 16px", textAlign: "center", color: "#64748b", fontSize: 13 }}>
                                    <code style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: 6, fontSize: 12 }}>{policy.slug}</code>
                                </td>
                                <td style={{ padding: "14px 16px", textAlign: "center" }}>
                                    <span style={{
                                        padding: "4px 12px",
                                        borderRadius: 20,
                                        fontSize: 12,
                                        fontWeight: 500,
                                        background: policy.content_html ? "#dcfce7" : "#fee2e2",
                                        color: policy.content_html ? "#16a34a" : "#dc2626",
                                    }}>
                                        {policy.content_html ? "İçerik Var" : "İçerik Yok"}
                                    </span>
                                </td>
                                <td style={{ padding: "14px 16px", textAlign: "center" }}>
                                    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                                        <Link href={`/admin/politikalar/${policy.id}`} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", color: "#3b82f6", fontSize: 12, fontWeight: 500, textDecoration: "none" }}>Düzenle</Link>
                                        <button onClick={() => deletePolicy(policy.id, policy.title)} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #fee2e2", background: "#fff", color: "#dc2626", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>Sil</button>
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

const thStyle: React.CSSProperties = { padding: "12px 16px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center" };
