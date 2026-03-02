"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface BlogForm {
    title: string;
    slug: string;
    summary: string;
    content_html: string;
    cover_image_url: string;
    author: string;
    read_time_min: number;
    is_published: boolean;
    sort_order: number;
}

const emptyForm: BlogForm = {
    title: "", slug: "", summary: "", content_html: "", cover_image_url: "",
    author: "Villa Tatilinde", read_time_min: 5, is_published: false, sort_order: 0,
};

export default function BlogEditPage() {
    const router = useRouter();
    const params = useParams();
    const blogId = params.id as string;
    const isNew = blogId === "yeni";

    const [form, setForm] = useState<BlogForm>(emptyForm);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(!isNew);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!isNew) loadBlog();
    }, [blogId]);

    async function loadBlog() {
        const { data, error } = await supabase.from("blogs").select("*").eq("id", blogId).single();
        if (error || !data) { setError("Blog bulunamadı"); setLoading(false); return; }
        setForm({
            title: data.title || "", slug: data.slug || "", summary: data.summary || "",
            content_html: data.content_html || "", cover_image_url: data.cover_image_url || "",
            author: data.author || "Villa Tatilinde", read_time_min: data.read_time_min || 5,
            is_published: data.is_published || false, sort_order: data.sort_order || 0,
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
        const slug = form.slug || generateSlug(form.title);
        const payload = { ...form, slug };

        if (isNew) {
            const { error } = await supabase.from("blogs").insert(payload);
            if (error) setError("Blog eklenemedi: " + error.message);
            else { setSuccess("Blog eklendi!"); setTimeout(() => router.push("/admin/bloglar"), 1000); }
        } else {
            const { error } = await supabase.from("blogs").update(payload).eq("id", blogId);
            if (error) setError("Blog güncellenemedi: " + error.message);
            else setSuccess("Blog güncellendi!");
        }
        setSaving(false);
    }

    if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Yükleniyor...</div>;

    return (
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <button onClick={() => router.push("/admin/bloglar")} style={{ background: "none", border: "none", color: "#64748b", fontSize: 13, cursor: "pointer", marginBottom: 8 }}>← Bloglara dön</button>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e293b" }}>{isNew ? "Yeni Blog Yazısı" : "Blog Düzenle"}</h1>
                </div>
                <button onClick={handleSave} disabled={saving} style={{ padding: "10px 28px", borderRadius: 10, background: saving ? "#94a3b8" : "linear-gradient(135deg, #10b981, #059669)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: saving ? "not-allowed" : "pointer" }}>
                    {saving ? "Kaydediliyor..." : "Kaydet"}
                </button>
            </div>

            {error && <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", color: "#dc2626", fontSize: 13, marginBottom: 16 }}>⚠️ {error}</div>}
            {success && <div style={{ background: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 16px", color: "#16a34a", fontSize: 13, marginBottom: 16 }}>✅ {success}</div>}

            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "24px", marginBottom: 20 }}>
                <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
                    <div style={{ flex: "1 1 60%" }}>
                        <label style={labelStyle}>Başlık *</label>
                        <input style={inputStyle} value={form.title} onChange={(e) => { setForm({ ...form, title: e.target.value }); if (isNew) setForm((f) => ({ ...f, slug: generateSlug(e.target.value) })); }} />
                    </div>
                    <div style={{ flex: "1 1 40%" }}>
                        <label style={labelStyle}>Slug</label>
                        <input style={inputStyle} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                    </div>
                </div>
                <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
                    <div style={{ flex: "1 1 50%" }}>
                        <label style={labelStyle}>Yazar</label>
                        <input style={inputStyle} value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
                    </div>
                    <div style={{ flex: "1 1 25%" }}>
                        <label style={labelStyle}>Okuma Süresi (dk)</label>
                        <input type="number" style={inputStyle} value={form.read_time_min} onChange={(e) => setForm({ ...form, read_time_min: +e.target.value })} />
                    </div>
                    <div style={{ flex: "1 1 25%" }}>
                        <label style={labelStyle}>Sıralama</label>
                        <input type="number" style={inputStyle} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: +e.target.value })} />
                    </div>
                </div>
                <div style={{ marginBottom: 14 }}>
                    <label style={labelStyle}>Kapak Görseli URL</label>
                    <input style={inputStyle} value={form.cover_image_url} onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })} />
                </div>
                {form.cover_image_url && <img src={form.cover_image_url} alt="Kapak" style={{ width: 200, height: 120, objectFit: "cover", borderRadius: 8, marginBottom: 14 }} />}
                <div style={{ marginBottom: 14 }}>
                    <label style={labelStyle}>Özet</label>
                    <textarea style={{ ...inputStyle, height: 80, resize: "vertical" }} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
                </div>
                <div style={{ marginBottom: 14 }}>
                    <label style={labelStyle}>İçerik (HTML)</label>
                    <textarea style={{ ...inputStyle, height: 250, resize: "vertical", fontFamily: "monospace", fontSize: 13 }} value={form.content_html} onChange={(e) => setForm({ ...form, content_html: e.target.value })} />
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14 }}>
                    <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} style={{ width: 18, height: 18, accentColor: "#10b981" }} />
                    Yayınla
                </label>
            </div>
        </div>
    );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 };
const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" };
