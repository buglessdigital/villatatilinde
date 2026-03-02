"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface PolicyForm {
    title: string;
    slug: string;
    content_html: string;
}

const emptyForm: PolicyForm = {
    title: "",
    slug: "",
    content_html: "",
};

export default function PolicyEditPage() {
    const router = useRouter();
    const params = useParams();
    const policyId = params.id as string;
    const isNew = policyId === "yeni";

    const [form, setForm] = useState<PolicyForm>(emptyForm);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(!isNew);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!isNew) loadPolicy();
    }, [policyId]);

    async function loadPolicy() {
        const { data, error } = await supabase.from("policies").select("*").eq("id", policyId).single();
        if (error || !data) { setError("Politika bulunamadı"); setLoading(false); return; }
        setForm({
            title: data.title || "",
            slug: data.slug || "",
            content_html: data.content_html || "",
        });
        setLoading(false);
    }

    function generateSlug(text: string) {
        return text.toLowerCase()
            .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
            .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
            .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }

    async function handleSave() {
        setSaving(true); setError(""); setSuccess("");

        if (!form.title.trim()) { setError("Başlık zorunludur"); setSaving(false); return; }
        if (!form.slug.trim()) { setError("Slug zorunludur"); setSaving(false); return; }
        const payload = { title: form.title, slug: form.slug, content_html: form.content_html };

        if (isNew) {
            const { error } = await supabase.from("policies").insert(payload);
            if (error) setError("Politika eklenemedi: " + error.message);
            else { setSuccess("Politika eklendi!"); setTimeout(() => router.push("/admin/politikalar"), 1000); }
        } else {
            const { error } = await supabase.from("policies").update(payload).eq("id", policyId);
            if (error) setError("Politika güncellenemedi: " + error.message);
            else setSuccess("Politika güncellendi!");
        }
        setSaving(false);
    }

    if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Yükleniyor...</div>;

    return (
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <button onClick={() => router.push("/admin/politikalar")} style={{ background: "none", border: "none", color: "#64748b", fontSize: 13, cursor: "pointer", marginBottom: 8 }}>← Politikalara dön</button>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e293b" }}>{isNew ? "Yeni Politika" : "Politika Düzenle"}</h1>
                </div>
                <button onClick={handleSave} disabled={saving} style={{ padding: "10px 28px", borderRadius: 10, background: saving ? "#94a3b8" : "linear-gradient(135deg, #10b981, #059669)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: saving ? "not-allowed" : "pointer" }}>
                    {saving ? "Kaydediliyor..." : "Kaydet"}
                </button>
            </div>

            {error && <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", color: "#dc2626", fontSize: 13, marginBottom: 16 }}>⚠️ {error}</div>}
            {success && <div style={{ background: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 16px", color: "#16a34a", fontSize: 13, marginBottom: 16 }}>✅ {success}</div>}

            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "24px", marginBottom: 20 }}>
                {/* Title & Slug */}
                <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                    <div style={{ flex: "1 1 60%" }}>
                        <label style={labelStyle}>Başlık *</label>
                        <input style={inputStyle} value={form.title} onChange={(e) => { setForm({ ...form, title: e.target.value }); if (isNew) setForm((f) => ({ ...f, slug: generateSlug(e.target.value) })); }} />
                    </div>
                    <div style={{ flex: "1 1 40%" }}>
                        <label style={labelStyle}>Slug *</label>
                        <input style={inputStyle} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="ornek: kullanim-kosullari" />
                    </div>
                </div>

                {/* Plain Text Content */}
                <label style={labelStyle}>İçerik</label>
                <textarea
                    value={form.content_html}
                    onChange={(e) => setForm({ ...form, content_html: e.target.value })}
                    placeholder="Politika içeriğini buraya yazın..."
                    style={{
                        width: "100%",
                        minHeight: 450,
                        padding: "20px",
                        borderRadius: 8,
                        border: "1px solid #e2e8f0",
                        fontSize: 15,
                        lineHeight: 1.8,
                        outline: "none",
                        color: "#1e293b",
                        background: "#fff",
                        resize: "vertical",
                        fontFamily: "'DM Sans', sans-serif",
                        boxSizing: "border-box",
                    }}
                />
            </div>
        </div>
    );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 };
const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" };
