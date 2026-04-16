"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ImageUploader from "@/components/ImageUploader";

interface Promotion {
    id: string;
    title: string;
    slug: string;
    description: string;
    image_url: string;
    gallery_images: string[];
    discount_text: string;
    category: string;
    address: string;
    map_embed_url: string;
    external_url: string;
    validity_start: string;
    validity_end: string;
    is_active: boolean;
    sort_order: number;
    created_at: string;
}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
        .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

const emptyPromo = {
    title: "",
    slug: "",
    description: "",
    image_url: "",
    gallery_images: [] as string[],
    discount_text: "",
    category: "",
    address: "",
    map_embed_url: "",
    external_url: "",
    validity_start: "",
    validity_end: "",
    is_active: true,
    sort_order: 0,
};

export default function AdminPromosyonlar() {
    const [promos, setPromos] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyPromo);
    const [saving, setSaving] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [newGalleryUrl, setNewGalleryUrl] = useState("");

    // Derive unique categories from existing promos
    const existingCategories = Array.from(new Set(promos.map((p) => p.category).filter(Boolean)));

    useEffect(() => {
        loadPromos();
    }, []);

    async function loadPromos() {
        const { data } = await supabase
            .from("promotions")
            .select("*")
            .order("sort_order", { ascending: true });
        if (data) setPromos(data);
        setLoading(false);
    }

    async function toggleActive(id: string, current: boolean) {
        await supabase.from("promotions").update({ is_active: !current }).eq("id", id);
        setPromos((prev) => prev.map((p) => (p.id === id ? { ...p, is_active: !current } : p)));
    }

    async function deletePromo(id: string, title: string) {
        if (!confirm(`"${title}" promosyonunu silmek istediğinize emin misiniz?`)) return;
        const { error } = await supabase.from("promotions").delete().eq("id", id);
        if (error) { alert("Hata: " + error.message); return; }
        setPromos((prev) => prev.filter((p) => p.id !== id));
    }

    function openNewForm() {
        setForm(emptyPromo);
        setEditId(null);
        setShowForm(true);
    }

    function openEditForm(p: Promotion) {
        setForm({
            title: p.title,
            slug: p.slug,
            description: p.description || "",
            image_url: p.image_url || "",
            gallery_images: p.gallery_images || [],
            discount_text: p.discount_text || "",
            category: p.category || "",
            address: p.address || "",
            map_embed_url: p.map_embed_url || "",
            external_url: p.external_url || "",
            validity_start: p.validity_start || "",
            validity_end: p.validity_end || "",
            is_active: p.is_active,
            sort_order: p.sort_order,
        });
        setEditId(p.id);
        setShowForm(true);
    }

    function addGalleryImage(url: string) {
        if (!url.trim()) return;
        setForm((f) => ({ ...f, gallery_images: [...f.gallery_images, url.trim()] }));
        setNewGalleryUrl("");
    }

    function removeGalleryImage(index: number) {
        setForm((f) => ({
            ...f,
            gallery_images: f.gallery_images.filter((_, i) => i !== index),
        }));
    }

    async function savePromo() {
        if (!form.title.trim()) { alert("Başlık zorunludur."); return; }
        setSaving(true);
        const slug = form.slug.trim() || slugify(form.title);
        const payload = {
            title: form.title.trim(),
            slug,
            description: form.description.trim() || null,
            image_url: form.image_url.trim() || null,
            gallery_images: form.gallery_images,
            discount_text: form.discount_text.trim() || null,
            category: form.category.trim() || null,
            address: form.address.trim() || null,
            map_embed_url: form.map_embed_url.trim() || null,
            external_url: form.external_url.trim() || null,
            validity_start: form.validity_start || null,
            validity_end: form.validity_end || null,
            is_active: form.is_active,
            sort_order: form.sort_order,
        };

        if (editId) {
            const { error } = await supabase.from("promotions").update(payload).eq("id", editId);
            if (error) { alert("Hata: " + error.message); setSaving(false); return; }
        } else {
            const { error } = await supabase.from("promotions").insert(payload);
            if (error) { alert("Hata: " + error.message); setSaving(false); return; }
        }

        setSaving(false);
        setShowForm(false);
        setEditId(null);
        setForm(emptyPromo);
        loadPromos();
    }

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e293b", fontFamily: "'Poppins', sans-serif" }}>
                        Promosyonlar
                    </h1>
                    <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>
                        Toplam {promos.length} promosyon
                    </p>
                </div>
                <button onClick={openNewForm} style={greenBtnStyle}>+ Yeni Promosyon</button>
            </div>

            {/* ── Add / Edit Form ── */}
            {showForm && (
                <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: 24, marginBottom: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <h2 style={{ fontSize: 18, fontWeight: 600, color: "#1e293b" }}>
                            {editId ? "Promosyon Düzenle" : "Yeni Promosyon Ekle"}
                        </h2>
                        <button onClick={() => { setShowForm(false); setEditId(null); }} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#94a3b8" }}>✕</button>
                    </div>

                    {/* Temel bilgiler */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>Başlık *</label>
                            <input style={inputStyle} value={form.title}
                                onChange={(e) => { const t = e.target.value; setForm((f) => ({ ...f, title: t, slug: slugify(t) })); }}
                                placeholder="ör: Vati Ocakbaşı İndirimi" />
                        </div>
                        <div>
                            <label style={labelStyle}>Slug (URL)</label>
                            <input style={inputStyle} value={form.slug}
                                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="otomatik oluşturulur" />
                        </div>
                        <div>
                            <label style={labelStyle}>Kategori</label>
                            <input style={inputStyle} value={form.category}
                                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                                placeholder="ör: Restaurant, Tekne Turu, Villa..."
                                list="category-suggestions" />
                            <datalist id="category-suggestions">
                                {existingCategories.map((c) => <option key={c} value={c} />)}
                            </datalist>
                            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                                Yeni bir kategori adı yazarak yeni kategori oluşturabilirsiniz
                            </div>
                        </div>
                        <div>
                            <label style={labelStyle}>İndirim Metni</label>
                            <input style={inputStyle} value={form.discount_text}
                                onChange={(e) => setForm((f) => ({ ...f, discount_text: e.target.value }))} placeholder="ör: %15 İndirim" />
                        </div>
                    </div>

                    {/* Görsel */}
                    <div style={{ marginBottom: 16 }}>
                        <ImageUploader value={form.image_url}
                            onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
                            bucket="images" folder="promotions" label="Ana Görsel" height={160} />
                    </div>

                    {/* Galeri */}
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Galeri Görselleri</label>
                        {form.gallery_images.length > 0 && (
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                                {form.gallery_images.map((img, i) => (
                                    <div key={i} style={{ position: "relative", width: 100, height: 70, borderRadius: 8, overflow: "hidden" }}>
                                        <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        <button onClick={() => removeGalleryImage(i)} style={{
                                            position: "absolute", top: 2, right: 2, width: 20, height: 20,
                                            borderRadius: "50%", background: "rgba(0,0,0,0.6)", color: "#fff",
                                            border: "none", fontSize: 11, cursor: "pointer", display: "flex",
                                            alignItems: "center", justifyContent: "center",
                                        }}>✕</button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div style={{ display: "flex", gap: 8 }}>
                            <ImageUploader
                                value=""
                                onChange={(url) => { if (url) addGalleryImage(url); }}
                                bucket="images" folder="promotions/gallery"
                                label="" height={80}
                            />
                        </div>
                        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                            <input style={{ ...inputStyle, flex: 1 }} value={newGalleryUrl}
                                onChange={(e) => setNewGalleryUrl(e.target.value)}
                                placeholder="veya galeri görsel URL'si yapıştırın..." />
                            <button onClick={() => addGalleryImage(newGalleryUrl)}
                                style={{ padding: "8px 16px", borderRadius: 8, background: "#3b82f6", color: "#fff", border: "none", cursor: "pointer", fontSize: 13 }}>
                                Ekle
                            </button>
                        </div>
                    </div>

                    {/* Açıklama */}
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Açıklama</label>
                        <textarea style={{ ...inputStyle, height: 80, resize: "vertical" }} value={form.description}
                            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Promosyon açıklaması..." />
                    </div>

                    {/* Adres ve harita */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>Adres</label>
                            <input style={inputStyle} value={form.address}
                                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                                placeholder="ör: Andifli, Uğur Mumcu Cd. No: 37, Kaş/Antalya" />
                        </div>
                        <div>
                            <label style={labelStyle}>Google Maps Embed URL</label>
                            <input style={inputStyle} value={form.map_embed_url}
                                onChange={(e) => setForm((f) => ({ ...f, map_embed_url: e.target.value }))}
                                placeholder="https://www.google.com/maps/embed?pb=..." />
                        </div>
                    </div>

                    {/* Link ve tarihler */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>Harici Link</label>
                            <input style={inputStyle} value={form.external_url}
                                onChange={(e) => setForm((f) => ({ ...f, external_url: e.target.value }))} placeholder="https://..." />
                        </div>
                        <div style={{ display: "flex", gap: 16 }}>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>Geçerlilik Başlangıç</label>
                                <input type="date" style={inputStyle} value={form.validity_start}
                                    onChange={(e) => setForm((f) => ({ ...f, validity_start: e.target.value }))} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>Geçerlilik Bitiş</label>
                                <input type="date" style={inputStyle} value={form.validity_end}
                                    onChange={(e) => setForm((f) => ({ ...f, validity_end: e.target.value }))} />
                            </div>
                        </div>
                    </div>

                    {/* Sıra ve aktif */}
                    <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16 }}>
                        <div style={{ width: 100 }}>
                            <label style={labelStyle}>Sıralama</label>
                            <input type="number" style={inputStyle} value={form.sort_order}
                                onChange={(e) => setForm((f) => ({ ...f, sort_order: +e.target.value }))} />
                        </div>
                        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, marginTop: 18 }}>
                            <input type="checkbox" checked={form.is_active}
                                onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                                style={{ width: 18, height: 18, accentColor: "#10b981" }} />
                            Aktif
                        </label>
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={savePromo} disabled={saving} style={{
                            padding: "10px 24px", borderRadius: 10,
                            background: saving ? "#94a3b8" : "linear-gradient(135deg, #3b82f6, #2563eb)",
                            color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: saving ? "not-allowed" : "pointer",
                        }}>
                            {saving ? "Kaydediliyor..." : editId ? "Güncelle" : "Ekle"}
                        </button>
                        <button onClick={() => { setShowForm(false); setEditId(null); }} style={{
                            padding: "10px 24px", borderRadius: 10, background: "#fff", color: "#64748b", fontSize: 14, fontWeight: 500,
                            border: "1px solid #e2e8f0", cursor: "pointer",
                        }}>İptal</button>
                    </div>
                </div>
            )}

            {/* ── Table ── */}
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                    <thead>
                        <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                            <th style={thStyle}>Görsel</th>
                            <th style={{ ...thStyle, textAlign: "left" }}>Başlık</th>
                            <th style={thStyle}>Kategori</th>
                            <th style={thStyle}>İndirim</th>
                            <th style={thStyle}>Durum</th>
                            <th style={thStyle}>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>Yükleniyor...</td></tr>
                        ) : promos.length === 0 ? (
                            <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>Henüz promosyon eklenmemiş</td></tr>
                        ) : promos.map((p) => (
                            <tr key={p.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                <td style={{ padding: "10px 16px", textAlign: "center" }}>
                                    {p.image_url ? (
                                        <img src={p.image_url} alt={p.title} style={{ width: 64, height: 44, objectFit: "cover", borderRadius: 6 }} />
                                    ) : (
                                        <div style={{ width: 64, height: 44, background: "#f1f5f9", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 18 }}>🎁</div>
                                    )}
                                </td>
                                <td style={{ padding: "10px 16px" }}>
                                    <div style={{ fontWeight: 600, color: "#1e293b" }}>{p.title}</div>
                                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2, maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {p.description || "—"}
                                    </div>
                                </td>
                                <td style={{ padding: "10px 16px", textAlign: "center" }}>
                                    {p.category ? (
                                        <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "#f1f5f9", color: "#475569" }}>
                                            {p.category}
                                        </span>
                                    ) : "—"}
                                </td>
                                <td style={{ padding: "10px 16px", textAlign: "center", fontWeight: 600, color: "#0f766e" }}>
                                    {p.discount_text || "—"}
                                </td>
                                <td style={{ padding: "10px 16px", textAlign: "center" }}>
                                    <button onClick={() => toggleActive(p.id, p.is_active)} style={{
                                        padding: "4px 12px", borderRadius: 20, border: "none", fontSize: 12, fontWeight: 500, cursor: "pointer",
                                        background: p.is_active ? "#dcfce7" : "#fee2e2",
                                        color: p.is_active ? "#16a34a" : "#dc2626",
                                    }}>
                                        {p.is_active ? "Aktif" : "Pasif"}
                                    </button>
                                </td>
                                <td style={{ padding: "10px 16px", textAlign: "center" }}>
                                    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                                        <button onClick={() => openEditForm(p)} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", color: "#3b82f6", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
                                            Düzenle
                                        </button>
                                        <button onClick={() => deletePromo(p.id, p.title)} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #fee2e2", background: "#fff", color: "#dc2626", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
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

const greenBtnStyle: React.CSSProperties = { padding: "10px 20px", borderRadius: 10, background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" };
const thStyle: React.CSSProperties = { padding: "12px 16px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center" };
const labelStyle: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 };
const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" as const };
