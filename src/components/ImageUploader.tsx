"use client";

import { useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { convertToWebP } from "@/lib/imageUtils";

interface ImageUploaderProps {
    value: string | null | undefined;  // current image URL (null/undefined treated as empty)
    onChange: (url: string) => void;   // callback when image URL changes
    bucket?: string;                   // Supabase storage bucket name
    folder?: string;                   // folder path inside the bucket
    label?: string;
    hint?: React.ReactNode;            // optional tooltip content shown next to label
    height?: number;
    acceptType?: string;               // accepted file types (default: "image/*")
    addWatermark?: boolean;            // whether to apply watermark (default: true)
}

export default function ImageUploader({
    value,
    onChange,
    bucket = "images",
    folder = "uploads",
    label = "Görsel",
    hint,
    height = 180,
    acceptType = "image/*",
    addWatermark = false,
}: ImageUploaderProps) {
    const [hintVisible, setHintVisible] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback(async (file: File) => {
        const isVideo = file.type.startsWith("video/");
        if (!file.type.startsWith("image/") && !isVideo) {
            setError("Lütfen bir görsel veya video dosyası seçin.");
            return;
        }
        if (file.size > 200_000_000) { // 200MB limit for videos usually
            setError("Dosya boyutu çok büyük.");
            return;
        }

        setError(null);
        setUploading(true);

        try {
            let processedFile = file;
            let ext = file.name.split(".").pop() || "jpg";

            // If it's an image, auto-convert to WebP
            if (!isVideo) {
                processedFile = await convertToWebP(file, addWatermark);
                ext = "webp";
            }

            const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(fileName, processedFile, {
                    cacheControl: "3600",
                    upsert: true,
                });

            if (uploadError) {
                setError("Yükleme hatası: " + uploadError.message);
                setUploading(false);
                return;
            }

            const { data: urlData } = supabase.storage
                .from(bucket)
                .getPublicUrl(fileName);

            onChange(urlData.publicUrl);
        } catch (err: unknown) {
            setError("Bir hata oluştu: " + (err instanceof Error ? err.message : String(err)));
        } finally {
            setUploading(false);
        }
    }, [bucket, folder, onChange, addWatermark]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    }, [handleFile]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setDragOver(false);
    }, []);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("");
    };

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <label style={{ ...lblStyle, marginBottom: 0 }}>{label}</label>
                {hint && (
                    <div style={{ position: "relative", display: "inline-flex" }}>
                        <button
                            type="button"
                            onMouseEnter={() => setHintVisible(true)}
                            onMouseLeave={() => setHintVisible(false)}
                            onClick={() => setHintVisible(v => !v)}
                            style={{
                                width: 18, height: 18, borderRadius: "50%",
                                background: "#3b82f6", border: "none",
                                color: "white", fontSize: 11, fontWeight: 700,
                                cursor: "pointer", display: "flex", alignItems: "center",
                                justifyContent: "center", flexShrink: 0, lineHeight: 1,
                                padding: 0,
                            }}
                            title="Görsel boyut bilgisi"
                        >
                            ?
                        </button>
                        {hintVisible && (
                            <div style={{
                                position: "absolute", top: "calc(100% + 8px)", left: 0,
                                background: "#1e293b", color: "#f1f5f9",
                                borderRadius: 8, padding: "10px 14px",
                                fontSize: 12, lineHeight: 1.6,
                                width: 260, zIndex: 99999,
                                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                                pointerEvents: "none",
                            }}>
                                <div style={{ fontWeight: 700, color: "#60a5fa", marginBottom: 6, fontSize: 12 }}>📐 Önerilen Görsel Boyutları</div>
                                {hint}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div
                onClick={handleClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                style={{
                    position: "relative",
                    width: "100%",
                    height,
                    borderRadius: 12,
                    border: dragOver
                        ? "2px dashed #3b82f6"
                        : value
                            ? "1px solid #e2e8f0"
                            : "2px dashed #cbd5e1",
                    background: dragOver ? "#eff6ff" : value ? "transparent" : "#f8fafc",
                    cursor: uploading ? "wait" : "pointer",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                }}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={acceptType}
                    onChange={handleInputChange}
                    style={{ display: "none" }}
                />

                {uploading ? (
                    <div style={{ textAlign: "center", color: "#64748b" }}>
                        <div style={{
                            width: 32, height: 32, margin: "0 auto 8px",
                            border: "3px solid #e2e8f0",
                            borderTop: "3px solid #3b82f6",
                            borderRadius: "50%",
                            animation: "spin 0.8s linear infinite",
                        }} />
                        <div style={{ fontSize: 13 }}>Yükleniyor...</div>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : value ? (
                    <>
                        {value.match(/\.(mp4|webm|ogg)$/i) ? (
                            <video
                                src={value}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        ) : (
                            <img
                                src={value}
                                alt="Yüklenen medya"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        )}
                        {/* Overlay on hover */}
                        <div style={{
                            position: "absolute", inset: 0,
                            background: "rgba(0,0,0,0.4)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            gap: 8, opacity: 0,
                            transition: "opacity 0.2s",
                        }}
                            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                        >
                            <span style={overlayBtnStyle}>📷 Değiştir</span>
                            <span
                                style={{ ...overlayBtnStyle, background: "rgba(239,68,68,0.9)" }}
                                onClick={handleRemove}
                            >
                                🗑 Kaldır
                            </span>
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: "center", color: "#94a3b8" }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>📷 / 🎥</div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>
                            Sürükle & bırak veya tıkla
                        </div>
                        <div style={{ fontSize: 11, marginTop: 4 }}>
                            PNG, JPG, WEBP, MP4
                        </div>
                    </div>
                )}
            </div>

            {/* Manual URL input as fallback */}
            <div style={{ marginTop: 6, display: "flex", gap: 6 }}>
                <input
                    type="text"
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="veya URL yapıştır..."
                    style={{
                        flex: 1, padding: "6px 10px",
                        borderRadius: 6, border: "1px solid #e2e8f0",
                        fontSize: 12, color: "#64748b",
                        outline: "none",
                    }}
                />
            </div>

            {error && (
                <div style={{ marginTop: 4, fontSize: 12, color: "#dc2626" }}>
                    {error}
                </div>
            )}
        </div>
    );
}

const lblStyle: React.CSSProperties = {
    display: "block", fontSize: 12, fontWeight: 600,
    color: "#475569", marginBottom: 4,
};

const overlayBtnStyle: React.CSSProperties = {
    padding: "8px 14px", borderRadius: 8,
    background: "rgba(255,255,255,0.9)", color: "#1e293b",
    fontSize: 13, fontWeight: 500, cursor: "pointer",
};
