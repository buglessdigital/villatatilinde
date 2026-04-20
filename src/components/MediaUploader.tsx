"use client";

import { useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { convertToWebP } from "@/lib/imageUtils";

interface MediaUploaderProps {
    value: string | null | undefined;  // current media URL
    onChange: (url: string) => void;   // callback when URL changes
    bucket?: string;                   // Supabase storage bucket name
    folder?: string;                   // folder path inside the bucket
    label?: string;
    hint?: React.ReactNode;            // optional tooltip
    height?: number;
    acceptType?: string;               // accepted file types (default: "image/*,video/*")
    addWatermark?: boolean;            // whether to apply watermark (default: false)
}

export default function MediaUploader({
    value,
    onChange,
    bucket = "images",
    folder = "uploads",
    label = "Medya",
    hint,
    height = 180,
    acceptType = "image/*,video/*",
    addWatermark = false,
}: MediaUploaderProps) {
    const [hintVisible, setHintVisible] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback(async (file: File) => {
        const isVideo = file.type.startsWith("video/");
        const isImage = file.type.startsWith("image/");

        if (!isImage && !isVideo) {
            setError("Lütfen bir görsel veya video dosyası seçin.");
            return;
        }

        // Limit checks
        if (isVideo && file.size > 200_000_000) { // 200MB limit for videos
            setError("Video dosyası çok büyük (Max 200MB).");
            return;
        }
        if (isImage && file.size > 20_000_000) { // 20MB limit for images
            setError("Görsel dosyası çok büyük (Max 20MB).");
            return;
        }

        setError(null);
        setUploading(true);

        try {
            let processedFile = file;
            let ext = file.name.split(".").pop() || (isVideo ? "mp4" : "jpg");

            // If it's an image, convert to WebP
            if (isImage) {
                try {
                    processedFile = await convertToWebP(file, addWatermark);
                    ext = "webp";
                } catch (e) {
                    console.error("WebP conversion failed, using original", e);
                }
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
        if (uploading) return;
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

    const isVideoUrl = (url: string) => {
        return url.match(/\.(mp4|webm|ogg|quicktime|mov)$/i) || url.includes("storage.googleapis.com") && url.includes("video");
    };

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <label style={lblStyle}>{label}</label>
                {hint && (
                    <div style={{ position: "relative", display: "inline-flex" }}>
                        <button
                            type="button"
                            onMouseEnter={() => setHintVisible(true)}
                            onMouseLeave={() => setHintVisible(false)}
                            onClick={() => setHintVisible(v => !v)}
                            style={hintBtnStyle}
                        >
                            ?
                        </button>
                        {hintVisible && <div style={hintBoxStyle}>{hint}</div>}
                    </div>
                )}
            </div>
            <div
                onClick={handleClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                style={{
                    ...dropZoneStyle,
                    height,
                    borderColor: dragOver ? "#3b82f6" : value ? "#e2e8f0" : "#cbd5e1",
                    background: dragOver ? "#eff6ff" : value ? "transparent" : "#f8fafc",
                    cursor: uploading ? "wait" : "pointer",
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
                        <div style={spinnerStyle} />
                        <div style={{ fontSize: 13 }}>Yükleniyor...</div>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : value ? (
                    <>
                        {isVideoUrl(value) ? (
                            <video
                                src={value}
                                style={previewStyle}
                                controls={false}
                                muted
                                onMouseEnter={(e) => e.currentTarget.play()}
                                onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                            />
                        ) : (
                            <img
                                src={value}
                                alt="Önizleme"
                                style={previewStyle}
                            />
                        )}
                        <div 
                            style={overlayStyle}
                            className="uploader-overlay"
                            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                        >
                            <span style={overlayBtnStyle}>🔄 Değiştir</span>
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
                            MP4, WEBP, JPG, PNG
                        </div>
                    </div>
                )}
            </div>

            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <input
                    type="text"
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="veya Manuel URL yapıştır (YT, Vimeo vb.)..."
                    style={inputFallbackStyle}
                />
            </div>

            {error && (
                <div style={{ marginTop: 6, fontSize: 12, color: "#dc2626", fontWeight: 500 }}>
                    ⚠️ {error}
                </div>
            )}
        </div>
    );
}

const lblStyle: React.CSSProperties = {
    display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 0,
};

const hintBtnStyle: React.CSSProperties = {
    width: 18, height: 18, borderRadius: "50%", background: "#3b82f6", border: "none",
    color: "white", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex",
    alignItems: "center", justifyContent: "center", flexShrink: 0, lineHeight: 1, padding: 0,
};

const hintBoxStyle: React.CSSProperties = {
    position: "absolute", top: "calc(100% + 8px)", left: 0, background: "#1e293b",
    color: "#f1f5f9", borderRadius: 8, padding: "10px 14px", fontSize: 12, lineHeight: 1.6,
    width: 260, zIndex: 999, boxShadow: "0 4px 20px rgba(0,0,0,0.3)", pointerEvents: "none",
};

const dropZoneStyle: React.CSSProperties = {
    position: "relative", width: "100%", borderRadius: 12, borderStyle: "dashed",
    borderWidth: 2, overflow: "hidden", display: "flex", alignItems: "center",
    justifyContent: "center", transition: "all 0.2s",
};

const previewStyle: React.CSSProperties = {
    width: "100%", height: "100%", objectFit: "cover",
};

const overlayStyle: React.CSSProperties = {
    position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex",
    alignItems: "center", justifyContent: "center", gap: 10, opacity: 0, transition: "opacity 0.2s",
};

const overlayBtnStyle: React.CSSProperties = {
    padding: "8px 14px", borderRadius: 8, background: "rgba(255,255,255,0.95)",
    color: "#1e293b", fontSize: 12, fontWeight: 600, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const spinnerStyle: React.CSSProperties = {
    width: 32, height: 32, margin: "0 auto 8px", border: "3px solid #e2e8f0",
    borderTop: "3px solid #3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite",
};

const inputFallbackStyle: React.CSSProperties = {
    flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0",
    fontSize: 12, color: "#64748b", outline: "none", background: "#fcfdfe",
};
