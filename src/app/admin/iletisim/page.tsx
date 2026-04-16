"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ImageUploader from "@/components/ImageUploader";

interface ContactMedia {
    gallery_images: string[];
    video_url: string;
    video_poster_url: string;
}

const defaultMedia: ContactMedia = {
    gallery_images: [
        "/images/ofis21.jpeg",
        "/images/light2.jpeg",
        "/images/ofis23.jpeg",
        "/images/ofis28.jpg",
        "/images/ofis30.jpg",
        "/images/ofis29.jpg",
    ],
    video_url: "/images/ovid.mp4",
    video_poster_url: "/images/bgimage.jpeg",
};

const galleryLabels = [
    "Büyük Fotoğraf (Form Yanı)",
    "Galeri – Sol Büyük",
    "Galeri – Orta Üst",
    "Galeri – Orta Alt",
    "Galeri – Sağ Üst",
    "Galeri – Sağ Alt",
];

export default function AdminIletisim() {
    const [media, setMedia] = useState<ContactMedia>(defaultMedia);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadMedia();
    }, []);

    async function loadMedia() {
        const { data, error } = await supabase
            .from("site_settings")
            .select("value")
            .eq("key", "contact_media")
            .single();

        if (data?.value) {
            try {
                const parsed = typeof data.value === "string" ? JSON.parse(data.value) : data.value;
                setMedia({
                    gallery_images: parsed.gallery_images || defaultMedia.gallery_images,
                    video_url: parsed.video_url || defaultMedia.video_url,
                    video_poster_url: parsed.video_poster_url || defaultMedia.video_poster_url,
                });
            } catch {
                // use defaults
            }
        }
        setLoading(false);
    }

    async function handleSave() {
        setSaving(true);
        setError("");
        setSuccess("");

        const { error: upsertError } = await supabase
            .from("site_settings")
            .upsert(
                { key: "contact_media", value: JSON.stringify(media), description: "İletişim sayfası fotoğraf ve video URL'leri" },
                { onConflict: "key" }
            );

        if (upsertError) {
            setError("Kaydedilemedi: " + upsertError.message);
        } else {
            setSuccess("Başarıyla kaydedildi!");
            setTimeout(() => setSuccess(""), 3000);
        }
        setSaving(false);
    }

    function updateImage(index: number, value: string) {
        const updated = [...media.gallery_images];
        updated[index] = value;
        setMedia({ ...media, gallery_images: updated });
    }

    if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Yükleniyor...</div>;

    return (
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e293b", fontFamily: "'Poppins', sans-serif" }}>İletişim Sayfası Medya</h1>
                    <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>Fotoğraf ve video URL&apos;lerini yönetin</p>
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

            {/* Gallery Images */}
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: 24, marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: "#1e293b", marginBottom: 16 }}>📷 Galeri Fotoğrafları</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    {media.gallery_images.map((url, i) => (
                        <div key={i}>
                            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>
                                {galleryLabels[i] || `Fotoğraf ${i + 1}`}
                            </label>
                            <ImageUploader
                                value={url}
                                onChange={(newUrl) => updateImage(i, newUrl)}
                                bucket="images"
                                folder="contact"
                                label=""
                                height={140}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Video */}
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: 24 }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: "#1e293b", marginBottom: 16 }}>🎥 Video</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>
                            Video URL (MP4)
                        </label>
                        <ImageUploader
                            value={media.video_url}
                            onChange={(url) => setMedia({ ...media, video_url: url })}
                            bucket="images"
                            folder="contact"
                            label=""
                            height={170}
                            acceptType="video/mp4,video/webm"
                        />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>
                            Video Poster (Kapak Görseli)
                        </label>
                        <ImageUploader
                            value={media.video_poster_url}
                            onChange={(url) => setMedia({ ...media, video_poster_url: url })}
                            bucket="images"
                            folder="contact"
                            label=""
                            height={170}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
