"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Coupon {
    id: string;
    code: string;
    discount_amount: number;
    discount_type: "percentage" | "fixed";
    valid_until: string | null;
    is_active: boolean;
    usage_limit: number | null;
    used_count: number;
    created_at: string;
}

const emptyCoupon = {
    code: "",
    discount_amount: 0,
    discount_type: "percentage" as "percentage" | "fixed",
    valid_until: "",
    is_active: true,
    usage_limit: "",
};

export default function AdminKuponlar() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<any>(emptyCoupon);
    const [saving, setSaving] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    useEffect(() => {
        loadCoupons();
    }, []);

    async function loadCoupons() {
        const { data } = await supabase
            .from("coupons")
            .select("*")
            .order("created_at", { ascending: false });
        if (data) setCoupons(data);
        setLoading(false);
    }

    async function toggleActive(id: string, current: boolean) {
        await supabase.from("coupons").update({ is_active: !current }).eq("id", id);
        setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, is_active: !current } : c)));
    }

    async function deleteCoupon(id: string, code: string) {
        if (!confirm(`"${code}" kuponunu silmek istediğinize emin misiniz?`)) return;
        const { error } = await supabase.from("coupons").delete().eq("id", id);
        if (error) { alert("Hata: " + error.message); return; }
        setCoupons((prev) => prev.filter((c) => c.id !== id));
    }

    function openNewForm() {
        setForm(emptyCoupon);
        setEditId(null);
        setShowForm(true);
    }

    function openEditForm(c: Coupon) {
        setForm({
            code: c.code,
            discount_amount: c.discount_amount,
            discount_type: c.discount_type,
            valid_until: c.valid_until ? c.valid_until.substring(0, 16) : "", // For datetime-local
            is_active: c.is_active,
            usage_limit: c.usage_limit || "",
        });
        setEditId(c.id);
        setShowForm(true);
    }

    async function saveCoupon() {
        if (!form.code.trim()) { alert("Kupon kodu zorunludur."); return; }
        if (form.discount_amount <= 0) { alert("İndirim tutarı 0'dan büyük olmalıdır."); return; }
        
        setSaving(true);
        const codeUpper = form.code.trim().toUpperCase();
        
        const payload = {
            code: codeUpper,
            discount_amount: Number(form.discount_amount),
            discount_type: form.discount_type,
            valid_until: form.valid_until || null,
            is_active: form.is_active,
            usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
        };

        if (editId) {
            const { error } = await supabase.from("coupons").update(payload).eq("id", editId);
            if (error) { alert("Hata: " + error.message); setSaving(false); return; }
        } else {
            const { error } = await supabase.from("coupons").insert(payload);
            if (error) { alert("Hata: " + error.message); setSaving(false); return; }
        }

        setSaving(false);
        setShowForm(false);
        setEditId(null);
        setForm(emptyCoupon);
        loadCoupons();
    }

    const inputStyle = {
        width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", outline: "none", fontSize: 14
    };
    const labelStyle = { display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#475569" };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e293b", fontFamily: "'Poppins', sans-serif" }}>
                        İndirim Kuponları
                    </h1>
                    <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>
                        Toplam {coupons.length} kupon
                    </p>
                </div>
                <button
                    onClick={openNewForm}
                    style={{
                        background: "#10b981", color: "#fff", padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600
                    }}
                >
                    + Yeni Kupon Ekle
                </button>
            </div>

            {/* ── Add / Edit Form ── */}
            {showForm && (
                <div style={{ background: "#fff", padding: 24, borderRadius: 12, border: "1px solid #e2e8f0", marginBottom: 24 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>
                        {editId ? "Kupon Düzenle" : "Yeni Kupon Oluştur"}
                    </h2>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div>
                            <label style={labelStyle}>Kupon Kodu</label>
                            <input
                                type="text"
                                value={form.code}
                                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                                style={inputStyle}
                                placeholder="Örn: YAZFIRSATI20"
                            />
                        </div>
                        
                        <div>
                            <label style={labelStyle}>İndirim Tipi</label>
                            <select
                                value={form.discount_type}
                                onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
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
                                value={form.discount_amount}
                                onChange={(e) => setForm({ ...form, discount_amount: e.target.value })}
                                style={inputStyle}
                                placeholder={form.discount_type === "percentage" ? "Örn: 10" : "Örn: 2500"}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Geçerlilik Tarihi (Opsiyonel)</label>
                            <input
                                type="datetime-local"
                                value={form.valid_until}
                                onChange={(e) => setForm({ ...form, valid_until: e.target.value })}
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Kullanım Sınırı (Opsiyonel)</label>
                            <input
                                type="number"
                                value={form.usage_limit}
                                onChange={(e) => setForm({ ...form, usage_limit: e.target.value })}
                                style={inputStyle}
                                placeholder="Örn: 50 (Boş bırakırsanız sınırsız)"
                            />
                        </div>

                        <div style={{ display: "flex", alignItems: "center", paddingTop: 28 }}>
                            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14 }}>
                                <input
                                    type="checkbox"
                                    checked={form.is_active}
                                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                />
                                Kupon Aktif
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
                            onClick={saveCoupon}
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
                            <th style={{ padding: "14px 16px", color: "#64748b", fontWeight: 600 }}>Kupon Kodu</th>
                            <th style={{ padding: "14px 16px", color: "#64748b", fontWeight: 600 }}>İndirim</th>
                            <th style={{ padding: "14px 16px", color: "#64748b", fontWeight: 600 }}>Kullanım</th>
                            <th style={{ padding: "14px 16px", color: "#64748b", fontWeight: 600 }}>Son Kullanma</th>
                            <th style={{ padding: "14px 16px", color: "#64748b", fontWeight: 600 }}>Durum</th>
                            <th style={{ padding: "14px 16px", color: "#64748b", fontWeight: 600, textAlign: "right" }}>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={6} style={{ padding: 20, textAlign: "center", color: "#94a3b8" }}>Yükleniyor...</td>
                            </tr>
                        )}
                        {!loading && coupons.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ padding: 20, textAlign: "center", color: "#94a3b8" }}>Hiç kupon bulunamadı.</td>
                            </tr>
                        )}
                        {coupons.map((c) => (
                            <tr key={c.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                                <td style={{ padding: "14px 16px", fontWeight: 600, color: "#1e293b" }}>{c.code}</td>
                                <td style={{ padding: "14px 16px" }}>
                                    {c.discount_type === "percentage" ? `%${c.discount_amount}` : `${c.discount_amount} ₺`}
                                </td>
                                <td style={{ padding: "14px 16px", color: "#64748b" }}>
                                    {c.used_count} / {c.usage_limit || "Sınırsız"}
                                </td>
                                <td style={{ padding: "14px 16px", color: "#64748b" }}>
                                    {c.valid_until ? new Date(c.valid_until).toLocaleDateString("tr-TR") : "Süresiz"}
                                </td>
                                <td style={{ padding: "14px 16px" }}>
                                    <button
                                        onClick={() => toggleActive(c.id, c.is_active)}
                                        style={{
                                            padding: "4px 10px",
                                            borderRadius: 20,
                                            fontSize: 12,
                                            fontWeight: 600,
                                            border: "none",
                                            cursor: "pointer",
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
                                        onClick={() => deleteCoupon(c.id, c.code)}
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
