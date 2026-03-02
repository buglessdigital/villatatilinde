"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface VillaForm {
    name: string;
    slug: string;
    location_label: string;
    address: string;
    max_guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
    rooms: number;
    pool_width: number;
    pool_length: number;
    pool_depth: number;
    min_price: number;
    max_price: number;
    cover_image_url: string;
    description_tr: string;
    summary_tr: string;
    deposit_amount: number;
    cleaning_fee: number;
    min_nights: number;
    check_in_time: string;
    check_out_time: string;
    commission_pct: number;
    license_no: string;
    pets_allowed: boolean;
    smoking_allowed: boolean;
    parties_allowed: boolean;
    is_published: boolean;
    is_exclusive: boolean;
    sort_order: number;
    owner_name: string;
    owner_phone: string;
    cancellation_policy: string;
}

const emptyForm: VillaForm = {
    name: "",
    slug: "",
    location_label: "",
    address: "",
    max_guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    rooms: 3,
    pool_width: 0,
    pool_length: 0,
    pool_depth: 0,
    min_price: 0,
    max_price: 0,
    cover_image_url: "",
    description_tr: "",
    summary_tr: "",
    deposit_amount: 0,
    cleaning_fee: 0,
    min_nights: 1,
    check_in_time: "16:00",
    check_out_time: "10:00",
    commission_pct: 0,
    license_no: "",
    pets_allowed: false,
    smoking_allowed: false,
    parties_allowed: false,
    is_published: false,
    is_exclusive: false,
    sort_order: 0,
    owner_name: "",
    owner_phone: "",
    cancellation_policy: "",
};

export default function VillaEditPage() {
    const router = useRouter();
    const params = useParams();
    const villaId = params.id as string;
    const isNew = villaId === "yeni";

    const [form, setForm] = useState<VillaForm>(emptyForm);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(!isNew);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!isNew) {
            loadVilla();
        }
    }, [villaId]);

    async function loadVilla() {
        const { data, error } = await supabase
            .from("villas")
            .select("*")
            .eq("id", villaId)
            .single();

        if (error || !data) {
            setError("Villa bulunamadı");
            setLoading(false);
            return;
        }

        setForm({
            name: data.name || "",
            slug: data.slug || "",
            location_label: data.location_label || "",
            address: data.address || "",
            max_guests: data.max_guests || 4,
            bedrooms: data.bedrooms || 2,
            beds: data.beds || 2,
            bathrooms: data.bathrooms || 1,
            rooms: data.rooms || 3,
            pool_width: data.pool_width || 0,
            pool_length: data.pool_length || 0,
            pool_depth: data.pool_depth || 0,
            min_price: data.min_price || 0,
            max_price: data.max_price || 0,
            cover_image_url: data.cover_image_url || "",
            description_tr: data.description_tr || "",
            summary_tr: data.summary_tr || "",
            deposit_amount: data.deposit_amount || 0,
            cleaning_fee: data.cleaning_fee || 0,
            min_nights: data.min_nights || 1,
            check_in_time: data.check_in_time || "16:00",
            check_out_time: data.check_out_time || "10:00",
            commission_pct: data.commission_pct || 0,
            license_no: data.license_no || "",
            pets_allowed: data.pets_allowed || false,
            smoking_allowed: data.smoking_allowed || false,
            parties_allowed: data.parties_allowed || false,
            is_published: data.is_published || false,
            is_exclusive: data.is_exclusive || false,
            sort_order: data.sort_order || 0,
            owner_name: data.owner_name || "",
            owner_phone: data.owner_phone || "",
            cancellation_policy: data.cancellation_policy || "",
        });
        setLoading(false);
    }

    function updateField(field: keyof VillaForm, value: string | number | boolean) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    // Slug otomatik oluştur
    function generateSlug(name: string) {
        return name
            .toLowerCase()
            .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
            .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    }

    async function handleSave() {
        setSaving(true);
        setError("");
        setSuccess("");

        if (!form.name.trim()) {
            setError("Villa adı zorunludur");
            setSaving(false);
            return;
        }

        const slug = form.slug || generateSlug(form.name);

        const payload = { ...form, slug };

        if (isNew) {
            const { error } = await supabase.from("villas").insert(payload);
            if (error) {
                setError("Villa eklenemedi: " + error.message);
            } else {
                setSuccess("Villa başarıyla eklendi!");
                setTimeout(() => router.push("/admin/villalar"), 1000);
            }
        } else {
            const { error } = await supabase.from("villas").update(payload).eq("id", villaId);
            if (error) {
                setError("Villa güncellenemedi: " + error.message);
            } else {
                setSuccess("Villa başarıyla güncellendi!");
            }
        }

        setSaving(false);
    }

    if (loading) {
        return <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Yükleniyor...</div>;
    }

    return (
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <button
                        onClick={() => router.push("/admin/villalar")}
                        style={{ background: "none", border: "none", color: "#64748b", fontSize: 13, cursor: "pointer", marginBottom: 8 }}
                    >
                        ← Villalar listesine dön
                    </button>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e293b", fontFamily: "'Poppins', sans-serif" }}>
                        {isNew ? "Yeni Villa Ekle" : `${form.name} Düzenle`}
                    </h1>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                        padding: "10px 28px",
                        borderRadius: 10,
                        background: saving ? "#94a3b8" : "linear-gradient(135deg, #50b0f0, #3b82f6)",
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 600,
                        border: "none",
                        cursor: saving ? "not-allowed" : "pointer",
                    }}
                >
                    {saving ? "Kaydediliyor..." : "Kaydet"}
                </button>
            </div>

            {/* Messages */}
            {error && (
                <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", color: "#dc2626", fontSize: 13, marginBottom: 16 }}>
                    ⚠️ {error}
                </div>
            )}
            {success && (
                <div style={{ background: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 16px", color: "#16a34a", fontSize: 13, marginBottom: 16 }}>
                    ✅ {success}
                </div>
            )}

            {/* ── Temel Bilgiler ── */}
            <Section title="Temel Bilgiler">
                <FormRow>
                    <FormField label="Villa Adı *" width="60%">
                        <input
                            style={inputStyle}
                            value={form.name}
                            onChange={(e) => {
                                updateField("name", e.target.value);
                                if (isNew) updateField("slug", generateSlug(e.target.value));
                            }}
                            placeholder="Villa Doğa"
                        />
                    </FormField>
                    <FormField label="Slug (URL)" width="40%">
                        <input
                            style={inputStyle}
                            value={form.slug}
                            onChange={(e) => updateField("slug", e.target.value)}
                            placeholder="villa-doga"
                        />
                    </FormField>
                </FormRow>
                <FormRow>
                    <FormField label="Konum" width="50%">
                        <input
                            style={inputStyle}
                            value={form.location_label}
                            onChange={(e) => updateField("location_label", e.target.value)}
                            placeholder="Kalkan Bezirgan"
                        />
                    </FormField>
                    <FormField label="Adres" width="50%">
                        <input
                            style={inputStyle}
                            value={form.address}
                            onChange={(e) => updateField("address", e.target.value)}
                            placeholder="Tam adres"
                        />
                    </FormField>
                </FormRow>
                <FormRow>
                    <FormField label="Kapak Görseli URL" width="100%">
                        <input
                            style={inputStyle}
                            value={form.cover_image_url}
                            onChange={(e) => updateField("cover_image_url", e.target.value)}
                            placeholder="https://... veya /images/..."
                        />
                    </FormField>
                </FormRow>
                {form.cover_image_url && (
                    <div style={{ marginTop: 8, marginBottom: 16 }}>
                        <img src={form.cover_image_url} alt="Kapak" style={{ width: 200, height: 130, objectFit: "cover", borderRadius: 8 }} />
                    </div>
                )}
            </Section>

            {/* ── Kapasite ── */}
            <Section title="Kapasite">
                <FormRow>
                    <FormField label="Maks. Misafir" width="25%">
                        <input type="number" style={inputStyle} value={form.max_guests} onChange={(e) => updateField("max_guests", +e.target.value)} />
                    </FormField>
                    <FormField label="Yatak Odası" width="25%">
                        <input type="number" style={inputStyle} value={form.bedrooms} onChange={(e) => updateField("bedrooms", +e.target.value)} />
                    </FormField>
                    <FormField label="Yatak" width="25%">
                        <input type="number" style={inputStyle} value={form.beds} onChange={(e) => updateField("beds", +e.target.value)} />
                    </FormField>
                    <FormField label="Banyo" width="25%">
                        <input type="number" style={inputStyle} value={form.bathrooms} onChange={(e) => updateField("bathrooms", +e.target.value)} />
                    </FormField>
                </FormRow>
            </Section>

            {/* ── Havuz ── */}
            <Section title="Havuz Bilgileri">
                <FormRow>
                    <FormField label="Genişlik (m)" width="33%">
                        <input type="number" style={inputStyle} value={form.pool_width} onChange={(e) => updateField("pool_width", +e.target.value)} />
                    </FormField>
                    <FormField label="Uzunluk (m)" width="33%">
                        <input type="number" style={inputStyle} value={form.pool_length} onChange={(e) => updateField("pool_length", +e.target.value)} />
                    </FormField>
                    <FormField label="Derinlik (m)" width="33%">
                        <input type="number" style={inputStyle} value={form.pool_depth} onChange={(e) => updateField("pool_depth", +e.target.value)} />
                    </FormField>
                </FormRow>
            </Section>

            {/* ── Fiyatlandırma ── */}
            <Section title="Fiyatlandırma">
                <FormRow>
                    <FormField label="Min. Fiyat (₺/Gece)" width="33%">
                        <input type="number" style={inputStyle} value={form.min_price} onChange={(e) => updateField("min_price", +e.target.value)} />
                    </FormField>
                    <FormField label="Max. Fiyat (₺/Gece)" width="33%">
                        <input type="number" style={inputStyle} value={form.max_price} onChange={(e) => updateField("max_price", +e.target.value)} />
                    </FormField>
                    <FormField label="Depozito (₺)" width="33%">
                        <input type="number" style={inputStyle} value={form.deposit_amount} onChange={(e) => updateField("deposit_amount", +e.target.value)} />
                    </FormField>
                </FormRow>
                <FormRow>
                    <FormField label="Temizlik Ücreti (₺)" width="33%">
                        <input type="number" style={inputStyle} value={form.cleaning_fee} onChange={(e) => updateField("cleaning_fee", +e.target.value)} />
                    </FormField>
                    <FormField label="Min. Gece" width="33%">
                        <input type="number" style={inputStyle} value={form.min_nights} onChange={(e) => updateField("min_nights", +e.target.value)} />
                    </FormField>
                    <FormField label="Komisyon (%)" width="33%">
                        <input type="number" style={inputStyle} value={form.commission_pct} onChange={(e) => updateField("commission_pct", +e.target.value)} />
                    </FormField>
                </FormRow>
            </Section>

            {/* ── Giriş/Çıkış ── */}
            <Section title="Giriş / Çıkış">
                <FormRow>
                    <FormField label="Giriş Saati" width="50%">
                        <input style={inputStyle} value={form.check_in_time} onChange={(e) => updateField("check_in_time", e.target.value)} placeholder="16:00" />
                    </FormField>
                    <FormField label="Çıkış Saati" width="50%">
                        <input style={inputStyle} value={form.check_out_time} onChange={(e) => updateField("check_out_time", e.target.value)} placeholder="10:00" />
                    </FormField>
                </FormRow>
            </Section>

            {/* ── Açıklama ── */}
            <Section title="Açıklama">
                <FormField label="Kısa Özet" width="100%">
                    <textarea
                        style={{ ...inputStyle, height: 80, resize: "vertical" }}
                        value={form.summary_tr}
                        onChange={(e) => updateField("summary_tr", e.target.value)}
                        placeholder="Villa hakkında kısa açıklama..."
                    />
                </FormField>
                <FormField label="Detaylı Açıklama (TR)" width="100%">
                    <textarea
                        style={{ ...inputStyle, height: 180, resize: "vertical" }}
                        value={form.description_tr}
                        onChange={(e) => updateField("description_tr", e.target.value)}
                        placeholder="Villa hakkında detaylı açıklama..."
                    />
                </FormField>
            </Section>

            {/* ── Kurallar ── */}
            <Section title="Villa Kuralları">
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                    <Checkbox label="Evcil hayvan izni" checked={form.pets_allowed} onChange={(v) => updateField("pets_allowed", v)} />
                    <Checkbox label="Sigara izni" checked={form.smoking_allowed} onChange={(v) => updateField("smoking_allowed", v)} />
                    <Checkbox label="Parti izni" checked={form.parties_allowed} onChange={(v) => updateField("parties_allowed", v)} />
                </div>
            </Section>

            {/* ── Sahip Bilgileri ── */}
            <Section title="Sahip Bilgileri">
                <FormRow>
                    <FormField label="Sahip Adı" width="50%">
                        <input style={inputStyle} value={form.owner_name} onChange={(e) => updateField("owner_name", e.target.value)} />
                    </FormField>
                    <FormField label="Sahip Telefon" width="50%">
                        <input style={inputStyle} value={form.owner_phone} onChange={(e) => updateField("owner_phone", e.target.value)} />
                    </FormField>
                </FormRow>
                <FormField label="Belge No" width="50%">
                    <input style={inputStyle} value={form.license_no} onChange={(e) => updateField("license_no", e.target.value)} />
                </FormField>
            </Section>

            {/* ── Yayın Durumu ── */}
            <Section title="Yayın Durumu">
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                    <Checkbox label="Yayında" checked={form.is_published} onChange={(v) => updateField("is_published", v)} />
                    <Checkbox label="Özel (Exclusive)" checked={form.is_exclusive} onChange={(v) => updateField("is_exclusive", v)} />
                </div>
                <FormRow>
                    <FormField label="Sıralama" width="30%">
                        <input type="number" style={inputStyle} value={form.sort_order} onChange={(e) => updateField("sort_order", +e.target.value)} />
                    </FormField>
                </FormRow>
            </Section>

            {/* Bottom save button */}
            <div style={{ textAlign: "right", paddingTop: 20, paddingBottom: 40 }}>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                        padding: "12px 32px",
                        borderRadius: 10,
                        background: saving ? "#94a3b8" : "linear-gradient(135deg, #50b0f0, #3b82f6)",
                        color: "#fff",
                        fontSize: 15,
                        fontWeight: 600,
                        border: "none",
                        cursor: saving ? "not-allowed" : "pointer",
                    }}
                >
                    {saving ? "Kaydediliyor..." : "💾 Kaydet"}
                </button>
            </div>
        </div>
    );
}

/* ─── Reusable UI Components ─── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            padding: "20px 24px",
            marginBottom: 20,
        }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 16, borderBottom: "1px solid #f1f5f9", paddingBottom: 10 }}>
                {title}
            </h2>
            {children}
        </div>
    );
}

function FormRow({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ display: "flex", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
            {children}
        </div>
    );
}

function FormField({ label, width, children }: { label: string; width: string; children: React.ReactNode }) {
    return (
        <div style={{ flex: `0 0 calc(${width} - 8px)`, minWidth: 150 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>
                {label}
            </label>
            {children}
        </div>
    );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, color: "#1e293b" }}>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: "#50b0f0", cursor: "pointer" }}
            />
            {label}
        </label>
    );
}

/* ─── Styles ─── */
const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
};
