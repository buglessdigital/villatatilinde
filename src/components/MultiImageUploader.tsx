"use client";

import { useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { convertToWebP } from "@/lib/imageUtils";

export interface GalleryImage {
    url: string;
}

interface MultiImageUploaderProps {
    images: GalleryImage[];
    onChange: (images: GalleryImage[]) => void;
    bucket?: string;
    folder?: string;
    label?: string;
    addWatermark?: boolean;
}

export default function MultiImageUploader({
    images,
    onChange,
    bucket = "images",
    folder = "villas",
    label = "Galeri Görselleri",
    addWatermark = false,
}: MultiImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = useCallback(async (files: FileList | File[]) => {
        const fileArray = Array.from(files).filter(f => f.type.startsWith("image/"));
        if (fileArray.length === 0) {
            setError("Lütfen geçerli görsel dosyaları seçin.");
            return;
        }

        setError(null);
        setUploading(true);
        const newImages: GalleryImage[] = [];

        try {
            for (const file of fileArray) {
                if (file.size > 10_000_000) {
                    console.warn(`Dosya boyutu çok büyük atlandı: ${file.name}`);
                    continue;
                }

                const processedFile = await convertToWebP(file, addWatermark);
                const ext = "webp";
                const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

                const { error: uploadError } = await supabase.storage
                    .from(bucket)
                    .upload(fileName, processedFile, {
                        cacheControl: "3600",
                        upsert: true,
                    });

                if (uploadError) {
                    throw new Error("Yükleme hatası: " + uploadError.message);
                }

                const { data: urlData } = supabase.storage
                    .from(bucket)
                    .getPublicUrl(fileName);

                newImages.push({ url: urlData.publicUrl });
            }

            if (newImages.length > 0) {
                onChange([...images, ...newImages]);
            }
        } catch (err: unknown) {
            setError("Bir hata oluştu: " + (err instanceof Error ? err.message : String(err)));
        } finally {
            setUploading(false);
        }
    }, [bucket, folder, images, onChange, addWatermark]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files?.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    }, [handleFiles]);

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
        if (e.target.files?.length) {
            handleFiles(e.target.files);
        }
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleRemove = (index: number) => {
        const copy = [...images];
        copy.splice(index, 1);
        onChange(copy);
    };

    // Very basic drag and drop sorting
    const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

    const onSortDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIdx(index);
        e.dataTransfer.effectAllowed = "move";
    };

    const onSortDrop = (e: React.DragEvent, dropIdx: number) => {
        e.preventDefault();
        if (draggedIdx === null || draggedIdx === dropIdx) return;
        const copy = [...images];
        const item = copy.splice(draggedIdx, 1)[0];
        copy.splice(dropIdx, 0, item);
        onChange(copy);
        setDraggedIdx(null);
    };

    return (
        <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 8 }}>
                {label} (Sıralamak için sürükleyip bırakın)
            </label>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                {images.map((img, i) => (
                    <div
                        key={i}
                        draggable
                        onDragStart={(e) => onSortDragStart(e, i)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => onSortDrop(e, i)}
                        style={{
                            width: 120, height: 90, position: "relative",
                            borderRadius: 8, overflow: "hidden", border: "1px solid #e2e8f0",
                            cursor: "move"
                        }}
                    >
                        <img src={img.url} alt={`Gallery ${i}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <div
                            style={{
                                position: "absolute", top: 4, right: 4,
                                width: 24, height: 24, background: "rgba(255,255,255,0.9)",
                                borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", color: "#ef4444", fontSize: 14, fontWeight: "bold"
                            }}
                            onClick={() => handleRemove(i)}
                            title="Kaldır"
                        >
                            ×
                        </div>
                        <div style={{
                            position: "absolute", bottom: 0, left: 0, right: 0,
                            background: "rgba(0,0,0,0.5)", color: "#fff", fontSize: 10,
                            textAlign: "center", padding: "2px 0"
                        }}>
                            Sıra: {i + 1}
                        </div>
                    </div>
                ))}

                {/* Upload Button Box */}
                <div
                    onClick={handleClick}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    style={{
                        width: 120, height: 90, borderRadius: 8,
                        border: dragOver ? "2px dashed #3b82f6" : "2px dashed #cbd5e1",
                        background: dragOver ? "#eff6ff" : "#f8fafc",
                        cursor: uploading ? "wait" : "pointer",
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        transition: "all 0.2s"
                    }}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleInputChange}
                        style={{ display: "none" }}
                    />
                    {uploading ? (
                        <div style={{
                            width: 24, height: 24,
                            border: "2px solid #e2e8f0", borderTop: "2px solid #3b82f6",
                            borderRadius: "50%", animation: "spin 0.8s linear infinite",
                        }} />
                    ) : (
                        <>
                            <div style={{ fontSize: 24, color: "#94a3b8" }}>➕</div>
                            <div style={{ fontSize: 10, color: "#64748b", marginTop: 4 }}>Görsel Ekle</div>
                        </>
                    )}
                </div>
            </div>

            {error && (
                <div style={{ marginTop: 4, fontSize: 12, color: "#dc2626" }}>
                    {error}
                </div>
            )}
        </div>
    );
}
