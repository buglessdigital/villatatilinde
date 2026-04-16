"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import ImageUploader from "@/components/ImageUploader";

interface Banner {
    id: string;
    title: string;
    slug: string;
    image_url: string;
    mobile_image_url: string;
    subtitle: string;
    description: string;
    button_text: string;
    button_url: string;
    is_active: boolean;
    sort_order: number;
}

const emptyBanner = {
    title: "",
    slug: "",
    image_url: "",
    mobile_image_url: "",
    subtitle: "",
    description: "",
    button_text: "",
    button_url: "",
    is_active: true,
    sort_order: 0,
};

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
        .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export default function BannerlarPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Banner | null>(null);
    const [form, setForm] = useState(emptyBanner);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);

    async function loadBanners() {
        setLoading(true);
        const { data } = await supabase
            .from("banners")
            .select("*")
            .order("sort_order", { ascending: true });
        setBanners(data || []);
        setLoading(false);
    }

    useEffect(() => {
        loadBanners();
    }, []);

    const startEdit = (banner: Banner) => {
        setEditing(banner);
        setForm({
            title: banner.title,
            slug: banner.slug || "",
            image_url: banner.image_url,
            mobile_image_url: banner.mobile_image_url || "",
            subtitle: banner.subtitle || "",
            description: banner.description || "",
            button_text: banner.button_text || "",
            button_url: banner.button_url || "",
            is_active: banner.is_active,
            sort_order: banner.sort_order,
        });
        setShowForm(true);
    };

    const startNew = () => {
        setEditing(null);
        setForm({ ...emptyBanner, sort_order: banners.length });
        setShowForm(true);
    };

    const handleTitleChange = (title: string) => {
        setForm((prev) => ({
            ...prev,
            title,
            slug: editing ? prev.slug : generateSlug(title),
        }));
    };

    const handleSave = async () => {
        if (!form.title || !form.image_url) {
            alert("Başlık ve resim zorunludur.");
            return;
        }
        if (!form.slug) {
            alert("Slug alanı zorunludur.");
            return;
        }
        setSaving(true);

        if (editing) {
            await supabase.from("banners").update(form).eq("id", editing.id);
        } else {
            await supabase.from("banners").insert([form]);
        }

        setSaving(false);
        setEditing(null);
        setForm(emptyBanner);
        setShowForm(false);
        loadBanners();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu banner'ı silmek istediğinize emin misiniz?")) return;
        await supabase.from("banners").delete().eq("id", id);
        loadBanners();
    };

    const toggleActive = async (banner: Banner) => {
        await supabase.from("banners").update({ is_active: !banner.is_active }).eq("id", banner.id);
        loadBanners();
    };

    const S: React.CSSProperties = {
        width: "100%", padding: "10px 14px", borderRadius: 8,
        border: "1px solid #ddd", fontSize: 14, marginTop: 6,
    };
    const L: React.CSSProperties = {
        fontWeight: 600, fontSize: 13, color: "#444", display: "block", marginTop: 16,
    };

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700 }}>🖼️ Banner Yönetimi</h1>
                <button onClick={startNew} style={{ background: "#1e90ff", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>
                    + Yeni Banner
                </button>
            </div>

            {showForm && (
                <div style={{ background: "#f8f9fa", border: "1px solid #eee", borderRadius: 12, padding: 24, marginBottom: 24 }}>
                    <h3 style={{ margin: 0, marginBottom: 8 }}>{editing ? "Banner Düzenle" : "Yeni Banner Ekle"}</h3>

                    <label style={L}>Başlık *</label>
                    <input style={S} value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Banner başlığı" />

                    <label style={L}>Slug (URL)</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                        <span style={{ color: "#888", fontSize: 13 }}>/banner/</span>
                        <input style={{ ...S, marginTop: 0, flex: 1 }} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                    </div>

                    {/* Desktop Image */}
                    <div style={{ marginTop: 12 }}>
                        <div style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            marginBottom: 6
                        }}>
                            <span style={{ fontWeight: 600, fontSize: 13, color: "#444" }}>🖥️ Masaüstü Banner Resmi *</span>
                            <span style={{
                                fontSize: 11, fontWeight: 600, color: "#fff",
                                background: "#3b82f6", borderRadius: 20,
                                padding: "2px 10px", letterSpacing: "0.3px"
                            }}>📐 1100 × 275 px &nbsp;(4:1 oran)</span>
                        </div>
                        <ImageUploader
                            value={form.image_url}
                            onChange={(url) => setForm({ ...form, image_url: url })}
                            bucket="images"
                            folder="banners"
                            label=""
                            height={200}
                        />
                    </div>

                    {/* Mobile Image */}
                    <div style={{ marginTop: 16 }}>
                        <div style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            marginBottom: 6
                        }}>
                            <span style={{ fontWeight: 600, fontSize: 13, color: "#444" }}>📱 Mobil Banner Resmi</span>
                            <span style={{
                                fontSize: 11, fontWeight: 600, color: "#fff",
                                background: "#f59e0b", borderRadius: 20,
                                padding: "2px 10px", letterSpacing: "0.3px"
                            }}>📐 768 × 336 px &nbsp;(16:7 oran)</span>
                        </div>
                        <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>
                            Mobil cihazlarda gösterilir. Boş bırakılırsa masaüstü görseli kullanılır.
                        </div>
                        <ImageUploader
                            value={form.mobile_image_url}
                            onChange={(url) => setForm({ ...form, mobile_image_url: url })}
                            bucket="images"
                            folder="banners/mobile"
                            label=""
                            height={160}
                        />
                    </div>

                    <div style={{ marginTop: 24, padding: 16, background: "#fff", border: "1px solid #e0e0e0", borderRadius: 10 }}>
                        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, color: "#333" }}>📄 Detay Sayfası İçeriği</div>

                        <label style={L}>Alt Başlık</label>
                        <input style={S} value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="Kampanyanın kısa açıklaması" />

                        <label style={L}>Açıklama</label>
                        <textarea
                            style={{ ...S, minHeight: 140, lineHeight: 1.6, resize: "vertical" }}
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder={"Kampanya detayları burada yazılır.\nHer satır ayrı paragraf olarak gösterilir.\n\nBoş satır bırakarak paragraf arası boşluk oluşturabilirsiniz."}
                        />
                        <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>Her satır ayrı bir paragraf olarak görüntülenir.</div>

                        <label style={L}>Buton Yazısı (opsiyonel)</label>
                        <input style={S} value={form.button_text} onChange={(e) => setForm({ ...form, button_text: e.target.value })} placeholder="Örn: Villaları İncele" />

                        <label style={L}>Buton Linki (opsiyonel)</label>
                        <input style={S} value={form.button_url} onChange={(e) => setForm({ ...form, button_url: e.target.value })} placeholder="/indirimli-villalar" />
                    </div>

                    <label style={L}>Sıra</label>
                    <input style={{ ...S, width: 100 }} type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: +e.target.value })} />

                    <div style={{ display: "flex", alignItems: "center", marginTop: 16, gap: 10 }}>
                        <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} id="banner-active" />
                        <label htmlFor="banner-active" style={{ fontWeight: 500, fontSize: 14 }}>Aktif</label>
                    </div>

                    <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                        <button onClick={handleSave} disabled={saving} style={{ background: "#28a745", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8, fontWeight: 600, cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
                            {saving ? "Kaydediliyor..." : "Kaydet"}
                        </button>
                        <button onClick={() => { setEditing(null); setForm(emptyBanner); setShowForm(false); }} style={{ background: "#eee", color: "#333", border: "none", padding: "10px 24px", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>
                            İptal
                        </button>
                    </div>
                </div>
            )}

            {/* Banner List */}
            {loading ? (
                <div style={{ textAlign: "center", padding: 40, color: "#999" }}>Yükleniyor...</div>
            ) : banners.length === 0 ? (
                <div style={{ textAlign: "center", padding: 40, color: "#999" }}>Henüz banner eklenmemiş.</div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {banners.map((banner) => (
                        <div key={banner.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: 16, background: "#fff", borderRadius: 12, border: "1px solid #eee" }}>
                            <img src={banner.image_url} alt={banner.title} style={{ width: 160, height: 60, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 600, fontSize: 15 }}>{banner.title}</div>
                                <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                                    /banner/{banner.slug} • Sıra: {banner.sort_order}
                                    {banner.description ? " • ✅ İçerik var" : " • ⚠️ İçerik yok"}
                                </div>
                            </div>
                            <div onClick={() => toggleActive(banner)} style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", background: banner.is_active ? "#d4edda" : "#f8d7da", color: banner.is_active ? "#155724" : "#721c24" }}>
                                {banner.is_active ? "Aktif" : "Pasif"}
                            </div>
                            <button onClick={() => startEdit(banner)} style={{ background: "#f0f0f0", border: "none", padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Düzenle</button>
                            <button onClick={() => handleDelete(banner.id)} style={{ background: "#fee", border: "none", padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#c33" }}>Sil</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
