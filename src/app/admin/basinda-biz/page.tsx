"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Edit, Trash2, Search, X, Check, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

function parseVideoUrls(raw: string): string[] {
    if (!raw || raw.trim() === "") return [""];
    const trimmed = raw.trim();
    // New format: ||| separator
    if (trimmed.includes("|||")) {
        const parts = trimmed.split("|||").map(v => v.trim()).filter(Boolean);
        return parts.length > 0 ? parts : [""];
    }
    // Legacy format: JSON array
    if (trimmed.startsWith("[")) {
        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
                const filtered = parsed.map((v: unknown) => String(v).trim()).filter(Boolean);
                if (filtered.length > 0) return filtered;
            }
        } catch {}
    }
    return [trimmed];
}

interface PressMention {
    id: string;
    title: string;
    publisher: string;
    url: string;
    image_url: string;
    video_url: string;
    content: string;
    published_date: string;
    is_featured: boolean;
    created_at: string;
}

export default function BasindaBizAdminPage() {
    const [mentions, setMentions] = useState<PressMention[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Form state
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        publisher: "",
        url: "",
        image_url: "",
        video_url: "",
        content: "",
        published_date: new Date().toISOString().split("T")[0],
        is_featured: false
    });
    
    // Multi-video list state (each item is a URL string)
    const [videoList, setVideoList] = useState<string[]>([""]);
    // Index of video being uploaded via file picker
    const [uploadingVideoIdx, setUploadingVideoIdx] = useState<number | null>(null);

    // File upload state
    const [uploadingImage, setUploadingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    const fetchMentions = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("press_mentions")
                .select("*")
                .order("published_date", { ascending: false });

            if (error) throw error;
            if (data) setMentions(data as PressMention[]);
        } catch (error) {
            console.error("Haberler yüklenirken hata:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMentions();
    }, []);

    const filteredMentions = mentions.filter(m => 
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.publisher.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenModal = (mention?: PressMention) => {
        if (mention) {
            setEditId(mention.id);
            setFormData({
                title: mention.title || "",
                publisher: mention.publisher || "",
                url: mention.url || "",
                image_url: mention.image_url || "",
                video_url: mention.video_url || "",
                content: mention.content || "",
                published_date: mention.published_date || new Date().toISOString().split("T")[0],
                is_featured: mention.is_featured || false
            });
            setVideoList(parseVideoUrls(mention.video_url));
        } else {
            setEditId(null);
            setFormData({
                title: "",
                publisher: "",
                url: "",
                image_url: "",
                video_url: "",
                content: "",
                published_date: new Date().toISOString().split("T")[0],
                is_featured: false
            });
            setVideoList([""]);
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        
        try {
            // Build video_url value from videoList
            const nonEmptyVideos = videoList.filter(v => v.trim() !== "");
            // Use ||| as separator for multiple videos (avoids JSON parsing issues)
            const videoUrlValue = nonEmptyVideos.length === 0
                ? ""
                : nonEmptyVideos.join("|||");

            const saveData = { ...formData, video_url: videoUrlValue };

            if (editId) {
                const { error } = await supabase
                    .from("press_mentions")
                    .update({ ...saveData, updated_at: new Date().toISOString() })
                    .eq("id", editId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("press_mentions")
                    .insert([saveData]);
                if (error) throw error;
            }
            
            await fetchMentions();
            handleCloseModal();
        } catch (error: any) {
            console.error("Kaydetme hatası:", error);
            alert("Hata: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Bu haberi silmek istediğinize emin misiniz?")) return;
        
        setDeletingId(id);
        try {
            const { error } = await supabase
                .from("press_mentions")
                .delete()
                .eq("id", id);
                
            if (error) throw error;
            await fetchMentions();
        } catch (error) {
            console.error("Silme hatası:", error);
            alert("Silinemedi!");
        } finally {
            setDeletingId(null);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `press_${Date.now()}.${fileExt}`;
            const filePath = `press-images/${fileName}`;

            // Upload directly to images bucket (assumes it exists from standard villa uploads)
            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file, { cacheControl: '3600', upsert: false });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image_url: urlData.publicUrl }));
        } catch (error) {
            console.error("Resim yükleme hatası:", error);
            alert("Resim yüklenirken hata oluştu.");
        } finally {
            setUploadingImage(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingVideoIdx(idx);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `press_video_${Date.now()}.${fileExt}`;
            const filePath = `press-videos/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file, { cacheControl: '3600', upsert: false });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            setVideoList(prev => {
                const updated = [...prev];
                updated[idx] = urlData.publicUrl;
                return updated;
            });
        } catch (error) {
            console.error("Video yükleme hatası:", error);
            alert("Video yüklenirken hata oluştu. Dosya boyutu limitlere takılmış olabilir.");
        } finally {
            setUploadingVideoIdx(null);
            if (videoInputRef.current) videoInputRef.current.value = '';
        }
    };

    const addVideoSlot = () => setVideoList(prev => [...prev, ""]);

    const removeVideoSlot = (idx: number) => {
        setVideoList(prev => {
            const updated = prev.filter((_, i) => i !== idx);
            return updated.length === 0 ? [""] : updated;
        });
    };

    const updateVideoUrl = (idx: number, value: string) => {
        setVideoList(prev => {
            const updated = [...prev];
            updated[idx] = value;
            return updated;
        });
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b" }}>Basında Biz</h1>
                
                <div style={{ display: "flex", gap: 16 }}>
                    <div style={{ position: "relative", width: 280 }}>
                        <Search size={18} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                        <input 
                            type="text" 
                            placeholder="Haber veya yayıncı ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: "100%", padding: "10px 12px 10px 38px",
                                border: "1px solid #cbd5e1", borderRadius: 8, outline: "none", fontSize: 14
                            }}
                        />
                    </div>
                    <button 
                        onClick={() => handleOpenModal()}
                        style={{
                            background: "#0cbc87", color: "white", border: "none", borderRadius: 8,
                            padding: "0 16px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
                            fontWeight: 500, transition: "background 0.2s"
                        }}
                    >
                        <Plus size={18} /> Yeni Haber Ekle
                    </button>
                </div>
            </div>

            {/* Table */}
            <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                                <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 600, color: "#64748b", width: 80 }}>Görsel</th>
                                <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 600, color: "#64748b" }}>Yayıncı & Başlık</th>
                                <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 600, color: "#64748b" }}>Yayın Tarihi</th>
                                <th style={{ padding: "16px 20px", fontSize: 13, fontWeight: 600, color: "#64748b", textAlign: "right" }}>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={4} style={{ padding: 30, textAlign: "center", color: "#64748b" }}>Yükleniyor...</td></tr>
                            ) : filteredMentions.length === 0 ? (
                                <tr><td colSpan={4} style={{ padding: 30, textAlign: "center", color: "#64748b" }}>Henüz haber bulunamadı.</td></tr>
                            ) : filteredMentions.map(mention => (
                                <tr key={mention.id} style={{ borderBottom: "1px solid #f1f5f9" }} className="hover:bg-slate-50">
                                    <td style={{ padding: "16px 20px" }}>
                                        <div style={{ width: 60, height: 40, background: "#f1f5f9", borderRadius: 6, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {mention.image_url ? (
                                                <img src={mention.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            ) : (
                                                <ImageIcon size={20} color="#94a3b8" />
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ padding: "16px 20px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                            <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>{mention.publisher}</div>
                                            {mention.is_featured && (
                                                <span style={{ background: "#fef3c7", color: "#d97706", padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 700 }}>ANA SAYFADA</span>
                                            )}
                                        </div>
                                        <div style={{ fontSize: 15, fontWeight: 500, color: "#0f172a" }}>{mention.title}</div>
                                    </td>
                                    <td style={{ padding: "16px 20px", fontSize: 14, color: "#475569" }}>
                                        {mention.published_date ? new Date(mention.published_date).toLocaleDateString("tr-TR") : "-"}
                                    </td>
                                    <td style={{ padding: "16px 20px", textAlign: "right" }}>
                                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                                            {mention.url && (
                                                <a 
                                                    href={mention.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    style={{ padding: "6px", color: "#50b0f0", background: "#e0f0ff", borderRadius: 6, display: "inline-flex" }}
                                                    title="Habere Git"
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                                </a>
                                            )}
                                            <button 
                                                onClick={() => handleOpenModal(mention)}
                                                style={{ padding: "6px", color: "#6772e5", background: "#ede9fe", border: "none", borderRadius: 6, cursor: "pointer", display: "inline-flex" }}
                                                title="Düzenle"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(mention.id)}
                                                disabled={deletingId === mention.id}
                                                style={{ padding: "6px", color: "#ef4444", background: "#fef2f2", border: "none", borderRadius: 6, cursor: deletingId === mention.id ? "not-allowed" : "pointer", display: "inline-flex" }}
                                                title="Sil"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Form Modal */}
            {modalOpen && (
                <div style={{ 
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
                    background: "rgba(15, 23, 42, 0.6)", zIndex: 9999,
                    display: "flex", alignItems: "center", justifyContent: "center", padding: 20
                }}>
                    <div style={{ 
                        background: "white", borderRadius: 16, width: "100%", maxWidth: 650,
                        maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                    }}>
                        <div style={{ padding: "20px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#0f172a" }}>{editId ? "Haberi Düzenle" : "Yeni Haber Ekle"}</h2>
                            <button onClick={handleCloseModal} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#64748b" }}>
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
                            <form id="mentionForm" onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                    <div style={{ gridColumn: "span 2" }}>
                                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Haber Başlığı *</label>
                                        <input 
                                            required
                                            type="text" 
                                            value={formData.title} 
                                            onChange={e => setFormData({...formData, title: e.target.value})} 
                                            placeholder="Örn: Villa Tatilinde Yenilenen Yüzüyle Yayında!"
                                            style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 8, outline: "none" }} 
                                        />
                                    </div>
                                    
                                    <div>
                                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Yayıncı Kurum *</label>
                                        <input 
                                            required
                                            type="text" 
                                            value={formData.publisher} 
                                            onChange={e => setFormData({...formData, publisher: e.target.value})} 
                                            placeholder="Örn: Hürriyet Seyahat"
                                            style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 8, outline: "none" }} 
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Yayın Tarihi *</label>
                                        <input 
                                            required
                                            type="date" 
                                            value={formData.published_date} 
                                            onChange={e => setFormData({...formData, published_date: e.target.value})} 
                                            onClick={(e) => {
                                                try { e.currentTarget.showPicker(); } catch (err) {}
                                            }}
                                            onFocus={(e) => {
                                                try { e.currentTarget.showPicker(); } catch (err) {}
                                            }}
                                            onKeyDown={(e) => e.preventDefault()}
                                            style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 8, outline: "none", cursor: "pointer" }} 
                                        />
                                    </div>

                                    <div style={{ gridColumn: "span 2" }}>
                                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Haber Linki (URL) <span style={{ fontWeight: 400, color: "#94a3b8", fontSize: 12 }}>(İsteğe Bağlı)</span></label>
                                        <input 
                                            type="url" 
                                            value={formData.url} 
                                            onChange={e => setFormData({...formData, url: e.target.value})} 
                                            placeholder="https://..."
                                            style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 8, outline: "none" }} 
                                        />
                                    </div>

                                    <div style={{ gridColumn: "span 2" }}>
                                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Haber Görseli</label>
                                        
                                        <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
                                            {formData.image_url ? (
                                                <div style={{ position: "relative", width: 120, height: 80, borderRadius: 8, overflow: "hidden", border: "1px solid #e2e8f0" }}>
                                                    <Image src={formData.image_url} alt="" fill style={{ objectFit: "cover" }} />
                                                    <button 
                                                        type="button"
                                                        onClick={() => setFormData({...formData, image_url: ""})}
                                                        style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.6)", color: "white", border: "none", borderRadius: "50%", padding: 4, cursor: "pointer", display: "flex" }}
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div style={{ width: 120, height: 80, borderRadius: 8, border: "1px dashed #cbd5e1", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", flexDirection: "column", gap: 4 }}>
                                                    <ImageIcon size={20} />
                                                    <span style={{ fontSize: 10 }}>Görsel Yok</span>
                                                </div>
                                            )}
                                            
                                            <div style={{ flex: 1 }}>
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    style={{ display: "none" }} 
                                                    onChange={handleImageUpload}
                                                    ref={fileInputRef}
                                                />
                                                <button 
                                                    type="button"
                                                    disabled={uploadingImage}
                                                    onClick={() => fileInputRef.current?.click()}
                                                    style={{ padding: "8px 16px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: 6, color: "#334155", cursor: uploadingImage ? "not-allowed" : "pointer", fontSize: 13 }}
                                                >
                                                    {uploadingImage ? "Yükleniyor..." : "Yeni Görsel Yükle"}
                                                </button>
                                                <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginTop: 8, padding: "8px 10px", background: "#eff6ff", borderRadius: 6, border: "1px solid #bfdbfe" }}>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                                    <div>
                                                        <div style={{ fontSize: 11, fontWeight: 600, color: "#1d4ed8", marginBottom: 2 }}>Önerilen Görsel Boyutları</div>
                                                        <div style={{ fontSize: 11, color: "#3b82f6", lineHeight: 1.5 }}>
                                                            • <strong>Masaüstü:</strong> En az <strong>800 × 450 px</strong> (16:9 oran önerilir)<br />
                                                            • <strong>Mobil:</strong> Görsel yüksekliği <strong>240px</strong> ile sınırlıdır<br />
                                                            • Dosya formatı: <strong>JPG, PNG veya WebP</strong>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 8 }}>Veya görsel URL'si girin:</div>
                                                <input 
                                                    type="text" 
                                                    value={formData.image_url} 
                                                    onChange={e => setFormData({...formData, image_url: e.target.value})} 
                                                    placeholder="Görsel linki..."
                                                    style={{ width: "100%", padding: "6px 10px", marginTop: 4, border: "1px solid #cbd5e1", borderRadius: 6, outline: "none", fontSize: 13 }} 
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ gridColumn: "span 2" }}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                                            <label style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>
                                                Videolar <span style={{ fontWeight: 400, color: "#94a3b8", fontSize: 12 }}>(isteğe bağlı — birden fazla ekleyebilirsiniz)</span>
                                            </label>
                                            <button
                                                type="button"
                                                onClick={addVideoSlot}
                                                style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", background: "#ecfdf5", border: "1px solid #6ee7b7", borderRadius: 6, color: "#059669", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                                            >
                                                <Plus size={13} /> Video Ekle
                                            </button>
                                        </div>

                                        <input
                                            type="file"
                                            accept="video/*"
                                            style={{ display: "none" }}
                                            onChange={(e) => uploadingVideoIdx !== null && handleVideoUpload(e, uploadingVideoIdx)}
                                            ref={videoInputRef}
                                        />

                                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                            {videoList.map((vUrl, idx) => (
                                                <div key={idx} style={{ display: "flex", flexDirection: "column", gap: 6, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: 12 }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                        <span style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", minWidth: 20 }}>#{idx + 1}</span>
                                                        <button
                                                            type="button"
                                                            disabled={uploadingVideoIdx === idx}
                                                            onClick={() => { setUploadingVideoIdx(idx); setTimeout(() => videoInputRef.current?.click(), 0); }}
                                                            style={{ padding: "6px 12px", background: "#fff", border: "1px dashed #cbd5e1", borderRadius: 6, color: "#475569", cursor: uploadingVideoIdx === idx ? "not-allowed" : "pointer", fontSize: 12, whiteSpace: "nowrap" }}
                                                        >
                                                            {uploadingVideoIdx === idx ? "Yükleniyor..." : "Dosyadan Yükle"}
                                                        </button>
                                                        <input
                                                            type="text"
                                                            value={vUrl}
                                                            onChange={e => updateVideoUrl(idx, e.target.value)}
                                                            placeholder="https://... veya YouTube linki"
                                                            style={{ flex: 1, padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: 6, outline: "none", fontSize: 13 }}
                                                        />
                                                        {videoList.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeVideoSlot(idx)}
                                                                style={{ padding: 6, background: "#fef2f2", border: "none", borderRadius: 6, color: "#ef4444", cursor: "pointer", display: "flex" }}
                                                                title="Bu videoyu kaldır"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                    {vUrl && vUrl.match(/\.(mp4|webm)/i) && (
                                                        <video src={vUrl} controls style={{ width: "100%", maxHeight: 160, borderRadius: 6, background: "#000" }} />
                                                    )}
                                                    {vUrl && (vUrl.includes("youtube.com") || vUrl.includes("youtu.be")) && (
                                                        <div style={{ fontSize: 11, color: "#0cbc87", display: "flex", alignItems: "center", gap: 4 }}>
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.1 3 12 3 12 3s-4.1 0-6.8.9c-.6.1-1.9.1-3 1.3C1.3 6 1 8 1 8S.7 10.1.7 12v1.9C.7 15.9 1 18 1 18s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.6 22 12 22 12 22s4.1 0 6.8-.9c.6-.1 1.9-.2 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.1.3-4.1V12c0-2-.3-5-.3-5z"/><polygon points="9.5 15.5 15.5 12 9.5 8.5 9.5 15.5" fill="white"/></svg>
                                                            YouTube linki algılandı — modalda oynatılacak
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ gridColumn: "span 2" }}>
                                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Kısa Açıklama / Özet</label>
                                        <textarea 
                                            value={formData.content} 
                                            onChange={e => setFormData({...formData, content: e.target.value})} 
                                            placeholder="Haber kartında görünecek 1-2 cümlelik kısa özet..."
                                            style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 8, outline: "none", resize: "vertical", minHeight: 80, fontFamily: "inherit" }} 
                                        />
                                    </div>

                                    <div style={{ gridColumn: "span 2", padding: "16px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8 }}>
                                        <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                                            <input 
                                                type="checkbox" 
                                                checked={formData.is_featured}
                                                onChange={e => setFormData({...formData, is_featured: e.target.checked})}
                                                style={{ width: 20, height: 20, accentColor: "#0cbc87" }}
                                            />
                                            <div>
                                                <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>Ana Sayfada Göster</div>
                                                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Bu seçenek işaretlendiğinde bu haber ana sayfadaki "Basında Biz" kaydırıcısına (slider) eklenir. Birden fazla haber seçilebilir.</div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div style={{ padding: "16px 24px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end", gap: 12, background: "#f8fafc", borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
                            <button 
                                type="button"
                                onClick={handleCloseModal}
                                disabled={saving}
                                style={{ padding: "8px 16px", background: "white", border: "1px solid #cbd5e1", borderRadius: 6, color: "#475569", fontWeight: 500, cursor: saving ? "not-allowed" : "pointer" }}
                            >
                                İptal
                            </button>
                            <button 
                                type="submit"
                                form="mentionForm"
                                disabled={saving}
                                style={{ padding: "8px 16px", background: "#50b0f0", border: "none", borderRadius: 6, color: "white", fontWeight: 500, cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8 }}
                            >
                                {saving ? "Kaydediliyor..." : <><Check size={16} /> Haberi Kaydet</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
