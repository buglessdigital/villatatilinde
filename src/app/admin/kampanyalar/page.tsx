"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ImageUploader from "@/components/ImageUploader";

interface Campaign {
    id: string;
    title: string;
    date_text: string;
    description: string;
    is_active: boolean;
    sort_order: number;
    coupon_code?: string | null;
    discount_amount?: number | null;
    discount_type?: "percentage" | "fixed" | null;
    image_url?: string | null;
    created_at: string;
}

const emptyCampaign = {
    title: "",
    date_text: "",
    description: "",
    is_active: true,
    sort_order: 0,
    coupon_code: "",
    discount_amount: 0,
    discount_type: "percentage" as "percentage" | "fixed",
    image_url: "",
};

export default function AdminKampanyalar() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyCampaign);
    const [saving, setSaving] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    useEffect(() => {
        loadCampaigns();
    }, []);

    async function loadCampaigns() {
        const { data } = await supabase
            .from("campaigns")
            .select("*")
            .order("sort_order", { ascending: true });
        if (data) setCampaigns(data);
        setLoading(false);
    }

    async function toggleActive(id: string, current: boolean) {
        await supabase.from("campaigns").update({ is_active: !current }).eq("id", id);
        setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, is_active: !current } : c)));
    }

    async function deleteCampaign(id: string, title: string) {
        if (!confirm(`"${title}" içeriğini silmek istediğinize emin misiniz?`)) return;
        const { error } = await supabase.from("campaigns").delete().eq("id", id);
        if (error) { alert("Hata: " + error.message); return; }
        setCampaigns((prev) => prev.filter((c) => c.id !== id));
    }

    function openNewForm() {
        setForm(emptyCampaign);
        setEditId(null);
        setShowForm(true);
    }

    function openEditForm(c: Campaign) {
        setForm({
            title: c.title,
            date_text: c.date_text,
            description: c.description || "",
            is_active: c.is_active,
            sort_order: c.sort_order || 0,
            coupon_code: c.coupon_code || "",
            discount_amount: c.discount_amount || 0,
            discount_type: c.discount_type || "percentage",
            image_url: c.image_url || "",
        });
        setEditId(c.id);
        setShowForm(true);
    }

    async function saveCampaign() {
        if (!form.title.trim() || !form.date_text.trim()) {
            alert("Başlık ve Tarih (Metin) alanları zorunludur.");
            return;
        }
        
        setSaving(true);
        const payload = {
            title: form.title.trim(),
            date_text: form.date_text.trim(),
            description: form.description.trim() || null,
            is_active: form.is_active,
            sort_order: Number(form.sort_order),
            coupon_code: form.coupon_code.trim() ? form.coupon_code.trim().toUpperCase() : null,
            discount_amount: form.discount_amount ? Number(form.discount_amount) : null,
            discount_type: form.discount_type || null,
            image_url: form.image_url || null,
        };

        if (editId) {
            const { error } = await supabase.from("campaigns").update(payload).eq("id", editId);
            if (error) { alert("Hata: " + error.message); setSaving(false); return; }
        } else {
            const { error } = await supabase.from("campaigns").insert(payload);
            if (error) { alert("Hata: " + error.message); setSaving(false); return; }
        }

        setSaving(false);
        setShowForm(false);
        setEditId(null);
        setForm(emptyCampaign);
        loadCampaigns();
    }

    const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", outline: "none", fontSize: 14 };
    const labelStyle = { display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#475569" };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e293b", fontFamily: "'Poppins', sans-serif" }}>
                        Kampanyalar ve Tatil Tarihleri
                    </h1>
                    <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>
                        Tatil dönemleri ve fırsat açıklamalarını buradan yönetebilirsiniz.
                    </p>
                </div>
                <button
                    onClick={openNewForm}
                    style={{ background: "#50b0f0", color: "#fff", padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600 }}
                >
                    + Yeni İçerik Ekle
                </button>
            </div>

            {/* ── Add / Edit Form ── */}
            {showForm && (
                <div style={{ background: "#fff", padding: 24, borderRadius: 12, border: "1px solid #e2e8f0", marginBottom: 24 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>
                        {editId ? "İçeriği Düzenle" : "Yeni İçerik Ekle"}
                    </h2>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div>
                            <label style={labelStyle}>Kampanya / Tatil Adı *</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                style={inputStyle}
                                placeholder="Örn: Kurban Bayramı Özel"
                            />
                        </div>
                        
                        <div>
                            <label style={labelStyle}>Tarih Açıklaması *</label>
                            <input
                                type="text"
                                value={form.date_text}
                                onChange={(e) => setForm({ ...form, date_text: e.target.value })}
                                style={inputStyle}
                                placeholder="Örn: 27 Mayıs - 1 Haziran"
                            />
                        </div>
                        
                        <div style={{ gridColumn: "1 / -1", marginTop: 8 }}>
                            <ImageUploader
                                value={form.image_url || ""}
                                onChange={(url) => setForm({ ...form, image_url: url })}
                                label="Kampanya Seçili Görseli"
                                bucket="images"
                                folder="campaigns"
                                height={200}
                            />
                        </div>
                        
                        <div style={{ gridColumn: "1 / -1" }}>
                            <label style={labelStyle}>Açıklama (Opsiyonel)</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
                                placeholder="Tatilde ne sunuyorsunuz? Açıklama yazın..."
                            />
                        </div>
                        
                        <div style={{ gridColumn: "1 / -1", height: 1, background: "#f1f5f9", margin: "10px 0" }} />
                        
                        <div style={{ gridColumn: "1 / -1", fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>
                            Kampanyaya Özel Kupon (Opsiyonel)
                        </div>

                        <div>
                            <label style={labelStyle}>Kupon Kodu</label>
                            <input
                                type="text"
                                value={form.coupon_code}
                                onChange={(e) => setForm({ ...form, coupon_code: e.target.value.toUpperCase() })}
                                style={inputStyle}
                                placeholder="Örn: BAYRAM10"
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>İndirim Tipi</label>
                            <select
                                value={form.discount_type || "percentage"}
                                onChange={(e) => setForm({ ...form, discount_type: e.target.value as "percentage" | "fixed" })}
                                style={inputStyle}
                            >
                                <option value="percentage">Yüzde (%)</option>
                                <option value="fixed">Sabit Tutar (TL)</option>
                            </select>
                        </div>
                        
                        <div>
                            <label style={labelStyle}>
                                İndirim Miktarı {form.discount_type === "percentage" ? "(%)" : "(TL)"}
                            </label>
                            <input
                                type="number"
                                value={form.discount_amount || ""}
                                onChange={(e) => setForm({ ...form, discount_amount: Number(e.target.value) })}
                                style={inputStyle}
                                placeholder={form.discount_type === "percentage" ? "Örn: 10" : "Örn: 2500"}
                            />
                        </div>

                        <div style={{ display: "flex", alignItems: "center", paddingTop: 28 }}>
                            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14 }}>
                                <input
                                    type="checkbox"
                                    checked={form.is_active}
                                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                />
                                Sitede Gözüksün (Aktif)
                            </label>
                        </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
                        <button
                            onClick={() => setShowForm(false)}
                            style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#f8fafc", cursor: "pointer", fontWeight: 500 }}
                        >
                            İptal
                        </button>
                        <button
                            onClick={saveCampaign}
                            disabled={saving}
                            style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: "#50b0f0", color: "#fff", cursor: "pointer", fontWeight: 600 }}
                        >
                            {saving ? "Kaydediliyor..." : "Kaydet"}
                        </button>
                    </div>
                </div>
            )}

            {/* ── Table ── */}
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, textAlign: "left" }}>
                    <thead>
                        <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                            <th style={{ padding: "14px 16px", color: "#64748b", fontWeight: 600, width: 60 }}>Sıra</th>
                            <th style={{ padding: "14px 16px", color: "#64748b", fontWeight: 600 }}>Tarih</th>
                            <th style={{ padding: "14px 16px", color: "#64748b", fontWeight: 600 }}>Başlık</th>
                            <th style={{ padding: "14px 16px", color: "#64748b", fontWeight: 600 }}>Kupon</th>
                            <th style={{ padding: "14px 16px", color: "#64748b", fontWeight: 600 }}>Durum</th>
                            <th style={{ padding: "14px 16px", color: "#64748b", fontWeight: 600, textAlign: "right" }}>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={5} style={{ padding: 20, textAlign: "center", color: "#94a3b8" }}>Yükleniyor...</td>
                            </tr>
                        )}
                        {!loading && campaigns.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ padding: 20, textAlign: "center", color: "#94a3b8" }}>Henüz kampanya / tatil metni eklenmemiş.</td>
                            </tr>
                        )}
                        {campaigns.map((c) => (
                            <tr key={c.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                                <td style={{ padding: "14px 16px", color: "#64748b", fontWeight: 600 }}>{c.sort_order}</td>
                                <td style={{ padding: "14px 16px", color: "#50b0f0", fontWeight: 600 }}>{c.date_text}</td>
                                <td style={{ padding: "14px 16px", fontWeight: 600, color: "#1e293b" }}>{c.title}</td>
                                <td style={{ padding: "14px 16px", color: "#64748b" }}>
                                    {c.coupon_code ? (
                                        <span style={{ background: "#ecfdf5", color: "#059669", padding: "2px 8px", borderRadius: 4, fontSize: 12, fontWeight: 700 }}>
                                            {c.coupon_code} ({c.discount_type === "percentage" ? `%${c.discount_amount}` : `${c.discount_amount}₺`})
                                        </span>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                                <td style={{ padding: "14px 16px" }}>
                                    <button
                                        onClick={() => toggleActive(c.id, c.is_active)}
                                        style={{
                                            padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer",
                                            background: c.is_active ? "#dcfce7" : "#f1f5f9",
                                            color: c.is_active ? "#16a34a" : "#64748b"
                                        }}
                                    >
                                        {c.is_active ? "Aktif" : "Pasif"}
                                    </button>
                                </td>
                                <td style={{ padding: "14px 16px", textAlign: "right", display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                    <button
                                        onClick={() => openEditForm(c)}
                                        style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer", fontSize: 13 }}
                                    >
                                        Düzenle
                                    </button>
                                    <button
                                        onClick={() => deleteCampaign(c.id, c.title)}
                                        style={{ padding: "6px 10px", borderRadius: 6, border: "none", background: "#fee2e2", color: "#ef4444", cursor: "pointer", fontSize: 13 }}
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
