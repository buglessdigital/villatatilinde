"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ImageUploader from "@/components/ImageUploader";

export default function AdminGenelAyarlar() {
    const [heroImage, setHeroImage] = useState("/images/filler1.webp");
    const [heroTitle, setHeroTitle] = useState("TÜRSAB Resmi Villa Kiralama Acentesi");
    const [heroSubtitle, setHeroSubtitle] = useState("Size en uygun villayı, en iyi fiyat garantisi ile ve ücretsiz iptal ve iade fırsatlarından yararlanarak kiralayın. Onaylanmış Villa Portföyü, tecrübeli ve güleryüzlü destek ekibiyle hizmetinizde...");
    const [heroColor, setHeroColor] = useState("#ffffff");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadSettings();
    }, []);

    async function loadSettings() {
        const { data, error } = await supabase
            .from("site_settings")
            .select("key, value")
            .in("key", ["homepage_hero", "homepage_hero_title", "homepage_hero_subtitle", "homepage_hero_color"]);

        if (data) {
            data.forEach((setting) => {
                if (setting.key === "homepage_hero" && setting.value) setHeroImage(setting.value);
                if (setting.key === "homepage_hero_title" && setting.value) setHeroTitle(setting.value);
                if (setting.key === "homepage_hero_subtitle" && setting.value) setHeroSubtitle(setting.value);
                if (setting.key === "homepage_hero_color" && setting.value) setHeroColor(setting.value);
            });
        }
        setLoading(false);
    }

    async function handleSave() {
        setSaving(true);
        setError("");
        setSuccess("");

        const settingsToSave = [
            { key: "homepage_hero", value: heroImage, description: "Anasayfa Ana Görseli (Hero)" },
            { key: "homepage_hero_title", value: heroTitle, description: "Anasayfa Ana Başlığı" },
            { key: "homepage_hero_subtitle", value: heroSubtitle, description: "Anasayfa Alt Başlığı" },
            { key: "homepage_hero_color", value: heroColor, description: "Anasayfa Yazı Rengi" }
        ];

        const { error: upsertError } = await supabase
            .from("site_settings")
            .upsert(settingsToSave, { onConflict: "key" });

        if (upsertError) {
            setError("Kaydedilemedi: " + upsertError.message);
        } else {
            setSuccess("Başarıyla kaydedildi!");
            setTimeout(() => setSuccess(""), 3000);
        }
        setSaving(false);
    }

    if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Yükleniyor...</div>;

    return (
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e293b", fontFamily: "'Poppins', sans-serif" }}>Genel Ayarlar</h1>
                    <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>Site geneli ve anasayfa ayarlarını yönetin</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                        padding: "10px 28px",
                        borderRadius: 10,
                        background: saving ? "#94a3b8" : "linear-gradient(135deg, #10b981, #059669)",
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

            {error && <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", color: "#dc2626", fontSize: 13, marginBottom: 16 }}>⚠️ {error}</div>}
            {success && <div style={{ background: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 16px", color: "#16a34a", fontSize: 13, marginBottom: 16 }}>✅ {success}</div>}

            {/* Hero Image */}
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: 24, marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: "#1e293b", marginBottom: 16 }}>🌟 Anasayfa Ana Görsel (Hero Image)</h2>
                <div>
                    <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>
                        Görsel Seçin veya Değiştirin
                    </label>
                    <p style={{ display: "block", fontSize: 12, fontWeight: 400, color: "#94a3b8", marginBottom: 12 }}>
                        * Eklenecek resmin ölçüleri ideal olarak <b>1920x800</b> piksel büyüklüğünde ve yatay olmalıdır.
                    </p>
                    <div style={{ maxWidth: 800 }}>
                        <ImageUploader
                            value={heroImage}
                            onChange={(newUrl) => setHeroImage(newUrl)}
                            bucket="images"
                            folder="settings"
                            label=""
                            height={300}
                            addWatermark={false}
                        />
                    </div>
                    <div style={{ marginTop: 24, padding: "20px 0", borderTop: "1px solid #f1f5f9" }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b", marginBottom: 16 }}>Metin ve Renk Ayarları</h3>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#64748b", marginBottom: 8 }}>Ana Başlık</label>
                            <input
                                type="text"
                                style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, outline: "none" }}
                                value={heroTitle}
                                onChange={(e) => setHeroTitle(e.target.value)}
                            />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#64748b", marginBottom: 8 }}>Açıklama (Alt Başlık)</label>
                            <textarea
                                rows={4}
                                style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, outline: "none", resize: "vertical" }}
                                value={heroSubtitle}
                                onChange={(e) => setHeroSubtitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#64748b", marginBottom: 8 }}>Yazı Rengi</label>
                            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                <input
                                    type="color"
                                    style={{ width: 48, height: 48, border: "none", borderRadius: 8, cursor: "pointer", background: "none" }}
                                    value={heroColor}
                                    onChange={(e) => setHeroColor(e.target.value)}
                                />
                                <span style={{ fontSize: 13, color: "#94a3b8" }}>Seçilen renk: {heroColor}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
