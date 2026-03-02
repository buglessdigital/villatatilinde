"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface DestinationRow {
    id: string;
    name: string;
    slug: string;
    location_label: string;
    description: string;
    image_url: string;
    filter_param: string;
    sort_order: number;
    is_active: boolean;
    villa_count: number;
}

export default function AdminDestinasyonlar() {
    const [destinations, setDestinations] = useState<DestinationRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({ name: "", slug: "", location_label: "", description: "", image_url: "", filter_param: "", sort_order: 0, is_active: true });
    const [saving, setSaving] = useState(false);

    useEffect(() => { loadDestinations(); }, []);

    async function loadDestinations() {
        const { data } = await supabase.from("destinations").select("*").order("sort_order");
        if (data) setDestinations(data);
        setLoading(false);
    }

    async function deleteDestination(id: string) {
        if (!confirm("Bu destinasyonu silmek istediğinizden emin misiniz?")) return;
        await supabase.from("destinations").delete().eq("id", id);
        setDestinations((prev) => prev.filter((d) => d.id !== id));
    }

    function startEdit(dest: DestinationRow) {
        setEditingId(dest.id);
        setForm({ name: dest.name, slug: dest.slug, location_label: dest.location_label || "", description: dest.description || "", image_url: dest.image_url || "", filter_param: dest.filter_param || "", sort_order: dest.sort_order, is_active: dest.is_active });
    }

    function startNew() {
        setEditingId("new");
        setForm({ name: "", slug: "", location_label: "", description: "", image_url: "", filter_param: "", sort_order: destinations.length + 1, is_active: true });
    }

    function generateSlug(text: string) {
        return text.toLowerCase().replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }

    async function handleSave() {
        setSaving(true);
        const slug = form.slug || generateSlug(form.name);
        const payload = { ...form, slug };
        if (editingId === "new") {
            const { data } = await supabase.from("destinations").insert(payload).select().single();
            if (data) setDestinations((prev) => [...prev, data]);
        } else {
            await supabase.from("destinations").update(payload).eq("id", editingId);
            setDestinations((prev) => prev.map((d) => (d.id === editingId ? { ...d, ...payload } : d)));
        }
        setEditingId(null);
        setSaving(false);
    }

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e293b", fontFamily: "'Poppins', sans-serif" }}>Destinasyonlar</h1>
                    <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>Toplam {destinations.length} destinasyon</p>
                </div>
                <button onClick={startNew} style={{ padding: "10px 20px", borderRadius: 10, background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}>
                    + Yeni Destinasyon
                </button>
            </div>

            {editingId && (
                <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: 24, marginBottom: 20 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{editingId === "new" ? "Yeni Destinasyon" : "Destinasyon Düzenle"}</h3>
                    <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Destinasyon Adı</label>
                            <input style={inputStyle} value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); if (editingId === "new") setForm((f) => ({ ...f, slug: generateSlug(e.target.value) })); }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Slug</label>
                            <input style={inputStyle} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Konum Etiketi</label>
                            <input style={inputStyle} value={form.location_label} onChange={(e) => setForm({ ...form, location_label: e.target.value })} placeholder="Muğla, Antalya..." />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Filtre Parametresi</label>
                            <input style={inputStyle} value={form.filter_param} onChange={(e) => setForm({ ...form, filter_param: e.target.value })} placeholder="kalkan, kas..." />
                        </div>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                        <label style={labelStyle}>Açıklama</label>
                        <textarea style={{ ...inputStyle, height: 60, resize: "vertical" }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    </div>
                    <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Görsel URL</label>
                            <input style={inputStyle} value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
                        </div>
                        <div style={{ width: 80 }}>
                            <label style={labelStyle}>Sıra</label>
                            <input type="number" style={inputStyle} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: +e.target.value })} />
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={handleSave} disabled={saving} style={{ padding: "8px 20px", borderRadius: 8, background: "#ef4444", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>
                            {saving ? "Kaydediliyor..." : "Kaydet"}
                        </button>
                        <button onClick={() => setEditingId(null)} style={{ padding: "8px 20px", borderRadius: 8, background: "#f1f5f9", color: "#64748b", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>İptal</button>
                    </div>
                </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {loading ? (
                    <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 40, color: "#94a3b8" }}>Yükleniyor...</div>
                ) : destinations.map((dest) => (
                    <div key={dest.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                        {dest.image_url && <img src={dest.image_url} alt={dest.name} style={{ width: "100%", height: 120, objectFit: "cover" }} />}
                        <div style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                <div style={{ fontSize: 15, fontWeight: 600, color: "#1e293b" }}>{dest.name}</div>
                                <span style={{ fontSize: 11, color: "#94a3b8" }}>#{dest.sort_order}</span>
                            </div>
                            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>{dest.location_label} · {dest.villa_count || 0} Villa</div>
                            {dest.description && <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{dest.description}</div>}
                            <div style={{ display: "flex", gap: 8 }}>
                                <button onClick={() => startEdit(dest)} style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #e2e8f0", background: "#fff", color: "#3b82f6", fontSize: 12, cursor: "pointer" }}>Düzenle</button>
                                <button onClick={() => deleteDestination(dest.id)} style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #fee2e2", background: "#fff", color: "#dc2626", fontSize: 12, cursor: "pointer" }}>Sil</button>
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
