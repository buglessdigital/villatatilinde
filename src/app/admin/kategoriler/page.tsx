"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ImageUploader from "@/components/ImageUploader";

interface CategoryRow {
    id: string;
    name: string;
    slug: string;
    description: string;
    image_url: string;
    sort_order: number;
    is_active: boolean;
    villa_count: number;
}

export default function AdminKategoriler() {
    const [categories, setCategories] = useState<CategoryRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({ name: "", slug: "", description: "", image_url: "", sort_order: 0, is_active: true });
    const [saving, setSaving] = useState(false);

    useEffect(() => { loadCategories(); }, []);

    async function loadCategories() {
        const { data } = await supabase.from("categories").select("*").order("sort_order");
        if (data) setCategories(data);
        setLoading(false);
    }

    async function deleteCategory(id: string) {
        if (!confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) return;
        await supabase.from("categories").delete().eq("id", id);
        setCategories((prev) => prev.filter((c) => c.id !== id));
    }

    function startEdit(cat: CategoryRow) {
        setEditingId(cat.id);
        setForm({ name: cat.name, slug: cat.slug, description: cat.description || "", image_url: cat.image_url || "", sort_order: cat.sort_order, is_active: cat.is_active });
    }

    function startNew() {
        setEditingId("new");
        setForm({ name: "", slug: "", description: "", image_url: "", sort_order: categories.length + 1, is_active: true });
    }

    function generateSlug(text: string) {
        return text.toLowerCase().replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }

    async function handleSave() {
        setSaving(true);
        const slug = form.slug || generateSlug(form.name);
        const payload = { ...form, slug };
        if (editingId === "new") {
            const { data } = await supabase.from("categories").insert(payload).select().single();
            if (data) setCategories((prev) => [...prev, data]);
        } else {
            await supabase.from("categories").update(payload).eq("id", editingId);
            setCategories((prev) => prev.map((c) => (c.id === editingId ? { ...c, ...payload } : c)));
        }
        setEditingId(null);
        setSaving(false);
    }

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e293b", fontFamily: "'Poppins', sans-serif" }}>Kategoriler</h1>
                    <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>Toplam {categories.length} kategori</p>
                </div>
                <button onClick={startNew} style={{ padding: "10px 20px", borderRadius: 10, background: "linear-gradient(135deg, #8b5cf6, #7c3aed)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}>
                    + Yeni Kategori
                </button>
            </div>

            {editingId && (
                <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: 24, marginBottom: 20 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{editingId === "new" ? "Yeni Kategori" : "Kategori Düzenle"}</h3>
                    <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Kategori Adı</label>
                            <input style={inputStyle} value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); if (editingId === "new") setForm((f) => ({ ...f, slug: generateSlug(e.target.value) })); }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Slug</label>
                            <input style={inputStyle} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                        </div>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                        <label style={labelStyle}>Açıklama</label>
                        <textarea style={{ ...inputStyle, height: 60, resize: "vertical" }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    </div>
                    <div style={{ marginBottom: 12 }}>
                        <ImageUploader
                            value={form.image_url}
                            onChange={(url) => setForm({ ...form, image_url: url })}
                            bucket="images"
                            folder="categories"
                            label="Görsel"
                            height={140}
                        />
                    </div>
                    <div style={{ display: "flex", gap: 16, marginBottom: 12, alignItems: "flex-end" }}>
                        <div style={{ width: 80 }}>
                            <label style={labelStyle}>Sıra</label>
                            <input type="number" style={inputStyle} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: +e.target.value })} />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 4 }}>
                            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                                <input
                                    type="checkbox"
                                    checked={form.is_active}
                                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                    style={{ width: 16, height: 16 }}
                                />
                                Aktif (Sitede Göster)
                            </label>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={handleSave} disabled={saving} style={{ padding: "8px 20px", borderRadius: 8, background: "#8b5cf6", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>
                            {saving ? "Kaydediliyor..." : "Kaydet"}
                        </button>
                        <button onClick={() => setEditingId(null)} style={{ padding: "8px 20px", borderRadius: 8, background: "#f1f5f9", color: "#64748b", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>İptal</button>
                    </div>
                </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {loading ? (
                    <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 40, color: "#94a3b8" }}>Yükleniyor...</div>
                ) : categories.map((cat) => (
                    <div key={cat.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                        {cat.image_url && <img src={cat.image_url} alt={cat.name} style={{ width: "100%", height: 120, objectFit: "cover" }} />}
                        <div style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                <div style={{ fontSize: 15, fontWeight: 600, color: "#1e293b" }}>{cat.name}</div>
                                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: cat.is_active ? "#dcfce7" : "#fee2e2", color: cat.is_active ? "#16a34a" : "#dc2626", fontWeight: 600 }}>{cat.is_active ? "Aktif" : "Pasif"}</span>
                                    <span style={{ fontSize: 11, color: "#94a3b8" }}>#{cat.sort_order}</span>
                                </div>
                            </div>
                            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>{cat.villa_count || 0} Villa</div>
                            {cat.description && <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 10 }}>{cat.description}</div>}
                            <div style={{ display: "flex", gap: 8 }}>
                                <button onClick={() => startEdit(cat)} style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #e2e8f0", background: "#fff", color: "#3b82f6", fontSize: 12, cursor: "pointer" }}>Düzenle</button>
                                <button onClick={() => deleteCategory(cat.id)} style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #fee2e2", background: "#fff", color: "#dc2626", fontSize: 12, cursor: "pointer" }}>Sil</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 };
const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" };
