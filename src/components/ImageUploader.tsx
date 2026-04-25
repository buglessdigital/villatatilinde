"use client";

import { useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { convertToWebP } from "@/lib/imageUtils";

interface ImageUploaderProps {
    value: string | null | undefined;
    onChange: (url: string) => void;
    bucket?: string;
    folder?: string;
    label?: string;
    hint?: React.ReactNode;
    height?: number;
    aspectRatio?: string;   // e.g. "8/5" or "3/4" — overrides height
    acceptType?: string;
    addWatermark?: boolean;
    objectPosition?: string;
    onObjectPositionChange?: (pos: string) => void;
}

function parsePos(pos: string) {
    const parts = (pos || "50% 50%").split(" ");
    return { x: parseFloat(parts[0]) || 50, y: parseFloat(parts[1]) || 50 };
}

export default function ImageUploader({
    value,
    onChange,
    bucket = "images",
    folder = "uploads",
    label = "Görsel",
    hint,
    height = 180,
    aspectRatio,
    acceptType = "image/*",
    addWatermark = false,
    objectPosition = "50% 50%",
    onObjectPositionChange,
}: ImageUploaderProps) {
    const [hintVisible, setHintVisible] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [positionMode, setPositionMode] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    // Tracks live position during drag without triggering React renders
    const livePos = useRef({ x: 50, y: 50 });

    const handleFile = useCallback(async (file: File) => {
        const isVideo = file.type.startsWith("video/");
        if (!file.type.startsWith("image/") && !isVideo) {
            setError("Lütfen bir görsel veya video dosyası seçin.");
            return;
        }
        if (file.size > 200_000_000) {
            setError("Dosya boyutu çok büyük.");
            return;
        }
        setError(null);
        setUploading(true);
        try {
            let processedFile = file;
            let ext = file.name.split(".").pop() || "jpg";
            if (!isVideo) {
                processedFile = await convertToWebP(file, addWatermark);
                ext = "webp";
            }
            const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(fileName, processedFile, { cacheControl: "3600", upsert: true });
            if (uploadError) { setError("Yükleme hatası: " + uploadError.message); setUploading(false); return; }
            const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
            onChange(urlData.publicUrl);
        } catch (err: unknown) {
            setError("Bir hata oluştu: " + (err instanceof Error ? err.message : String(err)));
        } finally {
            setUploading(false);
        }
    }, [bucket, folder, onChange, addWatermark]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        if (positionMode) return;
        e.preventDefault(); setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    }, [handleFile, positionMode]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        if (positionMode) return;
        e.preventDefault(); setDragOver(true);
    }, [positionMode]);

    const handleDragLeave = useCallback(() => setDragOver(false), []);

    const handleClick = () => {
        if (positionMode) return;
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
        setPositionMode(false);
    };

    // ── Drag-to-pan: window listeners, DOM-direct updates (no React re-renders during drag) ──
    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!positionMode || !onObjectPositionChange) return;
        e.preventDefault();
        e.stopPropagation();

        const container = containerRef.current;
        const img = imgRef.current;
        if (!container || !img) return;

        const startMx = e.clientX;
        const startMy = e.clientY;
        const { width: cw, height: ch } = container.getBoundingClientRect();
        const startPos = parsePos(objectPosition);
        livePos.current = { x: startPos.x, y: startPos.y };

        const onMove = (ev: MouseEvent) => {
            ev.preventDefault();
            const dx = ((startMx - ev.clientX) / cw) * 100;
            const dy = ((startMy - ev.clientY) / ch) * 100;
            const nx = Math.max(0, Math.min(100, startPos.x + dx));
            const ny = Math.max(0, Math.min(100, startPos.y + dy));
            livePos.current = { x: nx, y: ny };
            // Update DOM directly — no React re-render, buttery smooth
            img.style.objectPosition = `${nx}% ${ny}%`;
        };

        const onUp = () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
            // Commit final position to React state
            const { x, y } = livePos.current;
            onObjectPositionChange(`${Math.round(x)}% ${Math.round(y)}%`);
        };

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
    }, [positionMode, onObjectPositionChange, objectPosition]);

    const isImage = value && !value.match(/\.(mp4|webm|ogg)$/i);
    const cur = parsePos(objectPosition);
    const isDefaultPos = cur.x === 50 && cur.y === 50;

    return (
        <div>
            {/* Label row */}
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
                                justifyContent: "center", flexShrink: 0, lineHeight: 1, padding: 0,
                            }}
                        >?</button>
                        {hintVisible && (
                            <div style={{
                                position: "absolute", top: "calc(100% + 8px)", left: 0,
                                background: "#1e293b", color: "#f1f5f9",
                                borderRadius: 8, padding: "10px 14px",
                                fontSize: 12, lineHeight: 1.6, width: 260, zIndex: 99999,
                                boxShadow: "0 4px 20px rgba(0,0,0,0.3)", pointerEvents: "none",
                            }}>
                                <div style={{ fontWeight: 700, color: "#60a5fa", marginBottom: 6, fontSize: 12 }}>📐 Önerilen Görsel Boyutları</div>
                                {hint}
                            </div>
                        )}
                    </div>
                )}

                {/* Position mode toggle — only when image uploaded and callback provided */}
                {isImage && onObjectPositionChange && (
                    <button
                        type="button"
                        onClick={() => setPositionMode(v => !v)}
                        style={{
                            marginLeft: "auto", padding: "2px 10px", borderRadius: 6,
                            fontSize: 11, fontWeight: 600, border: "1px solid",
                            borderColor: positionMode ? "#f59e0b" : "#cbd5e1",
                            background: positionMode ? "#fef3c7" : "#f8fafc",
                            color: positionMode ? "#92400e" : "#64748b",
                            cursor: "pointer",
                        }}
                    >
                        {positionMode ? "✅ Bitti" : "✋ Konumlandır"}
                    </button>
                )}
            </div>

            {/* Hint bar */}
            {positionMode && (
                <div style={{
                    background: "#fef3c7", border: "1px solid #fde68a",
                    borderRadius: 8, padding: "6px 12px", marginBottom: 6,
                    fontSize: 12, color: "#92400e",
                }}>
                    Görseli <strong>sürükle</strong> → kartta görünecek kısmı ayarla. Önizleme = sitedeki kart.
                </div>
            )}

            {/* Preview box — same aspect ratio as the actual card */}
            <div
                ref={containerRef}
                onClick={handleClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onMouseDown={handleMouseDown}
                style={{
                    position: "relative",
                    width: "100%",
                    ...(aspectRatio ? { aspectRatio, height: "auto" } : { height }),
                    borderRadius: 12,
                    border: positionMode
                        ? "2px solid #f59e0b"
                        : dragOver ? "2px dashed #3b82f6"
                        : value ? "1px solid #e2e8f0"
                        : "2px dashed #cbd5e1",
                    background: dragOver ? "#eff6ff" : value ? "transparent" : "#f8fafc",
                    cursor: positionMode ? "grab" : uploading ? "wait" : "pointer",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "border-color 0.15s",
                    userSelect: "none",
                }}
            >
                <input ref={fileInputRef} type="file" accept={acceptType} onChange={handleInputChange} style={{ display: "none" }} />

                {uploading ? (
                    <div style={{ textAlign: "center", color: "#64748b" }}>
                        <div style={{
                            width: 32, height: 32, margin: "0 auto 8px",
                            border: "3px solid #e2e8f0", borderTop: "3px solid #3b82f6",
                            borderRadius: "50%", animation: "spin 0.8s linear infinite",
                        }} />
                        <div style={{ fontSize: 13 }}>Yükleniyor...</div>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : value ? (
                    <>
                        {value.match(/\.(mp4|webm|ogg)$/i) ? (
                            <video src={value} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                            <img
                                ref={imgRef}
                                src={value}
                                alt="Yüklenen görsel"
                                draggable={false}
                                style={{
                                    position: "absolute", inset: 0,
                                    width: "100%", height: "100%",
                                    objectFit: "cover",
                                    objectPosition,
                                    pointerEvents: "none",
                                    userSelect: "none",
                                }}
                            />
                        )}

                        {/* Hover overlay — hidden in position mode */}
                        {!positionMode && (
                            <div
                                style={{
                                    position: "absolute", inset: 0,
                                    background: "rgba(0,0,0,0.4)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    gap: 8, opacity: 0, transition: "opacity 0.2s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                            >
                                <span style={overlayBtnStyle} onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>📷 Değiştir</span>
                                <span style={{ ...overlayBtnStyle, background: "rgba(239,68,68,0.9)" }} onClick={handleRemove}>🗑 Kaldır</span>
                            </div>
                        )}

                        {/* Position mode hint inside box */}
                        {positionMode && (
                            <div style={{
                                position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
                                background: "rgba(0,0,0,0.6)", color: "#fff",
                                borderRadius: 6, padding: "3px 10px", fontSize: 11,
                                pointerEvents: "none", whiteSpace: "nowrap",
                            }}>
                                ← sürükle →
                            </div>
                        )}
                    </>
                ) : (
                    <div style={{ textAlign: "center", color: "#94a3b8" }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>📷 / 🎥</div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>Sürükle & bırak veya tıkla</div>
                        <div style={{ fontSize: 11, marginTop: 4 }}>PNG, JPG, WEBP, MP4</div>
                    </div>
                )}
            </div>

            {/* URL input */}
            <div style={{ marginTop: 6 }}>
                <input
                    type="text"
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="veya URL yapıştır..."
                    style={{
                        width: "100%", padding: "6px 10px",
                        borderRadius: 6, border: "1px solid #e2e8f0",
                        fontSize: 12, color: "#64748b", outline: "none", boxSizing: "border-box",
                    }}
                />
            </div>

            {/* Position badge */}
            {isImage && onObjectPositionChange && !isDefaultPos && (
                <div style={{ marginTop: 4, fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ background: "#fef3c7", color: "#92400e", borderRadius: 4, padding: "1px 6px", fontWeight: 600 }}>
                        ✋ {objectPosition}
                    </span>
                    <button
                        type="button"
                        onClick={() => onObjectPositionChange("50% 50%")}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#94a3b8", textDecoration: "underline", padding: 0 }}
                    >
                        sıfırla
                    </button>
                </div>
            )}

            {error && <div style={{ marginTop: 4, fontSize: 12, color: "#dc2626" }}>{error}</div>}
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
