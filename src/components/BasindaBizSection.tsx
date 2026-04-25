"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

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

function parseVideoUrls(raw: string): string[] {
    if (!raw || raw.trim() === "") return [];
    const trimmed = raw.trim();
    // New format: ||| separator (e.g. "url1|||url2")
    if (trimmed.includes("|||")) {
        return trimmed.split("|||").map(v => v.trim()).filter(Boolean);
    }
    // Legacy format: JSON array (e.g. ["url1","url2"])
    if (trimmed.startsWith("[")) {
        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
                const filtered = parsed.map((v: unknown) => String(v).trim()).filter(Boolean);
                if (filtered.length > 0) return filtered;
            }
        } catch {}
    }
    // Single URL fallback
    return [trimmed];
}

function isYoutubeUrl(url: string): boolean {
    return url.includes("youtube.com") || url.includes("youtu.be");
}

function getYoutubeId(videoUrl: string): string | null {
    if (!videoUrl) return null;
    const trimmed = videoUrl.trim();
    try {
        const url = new URL(trimmed);
        if (url.hostname.includes("youtube.com")) {
            if (url.searchParams.get("v")) return url.searchParams.get("v");
            const pathMatch = url.pathname.match(/\/(?:embed|shorts|live|v)\/([^/?&\s]+)/);
            if (pathMatch) return pathMatch[1];
        }
        if (url.hostname === "youtu.be") {
            return url.pathname.slice(1).split("?")[0] || null;
        }
    } catch {
        const m = trimmed.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([^&?/\s]+)/);
        if (m) return m[1];
    }
    return null;
}

function getEmbedUrl(videoUrl: string): string {
    const trimmed = videoUrl.trim();
    const ytId = getYoutubeId(trimmed);
    if (ytId) return `https://www.youtube.com/embed/${ytId}?autoplay=1`;
    if (isYoutubeUrl(trimmed)) {
        try {
            const url = new URL(trimmed);
            return `https://www.youtube.com/embed/${url.pathname.split("/").pop()}?autoplay=1`;
        } catch {}
    }
    return trimmed;
}

function isDirectVideo(url: string): boolean {
    return /\.(mp4|webm|ogg)(\?|$)/i.test(url);
}

function isVideoUrl(url: string): boolean {
    if (!url) return false;
    return !!getYoutubeId(url) || url.includes("youtube.com") || url.includes("youtu.be") || isDirectVideo(url);
}

// Returns the list of video URLs for a mention.
// Filters out non-video entries (e.g. accidentally saved image/PDF URLs)
// and falls back to m.url when video_url has no usable video.
function getVideosForMention(m: { video_url: string; url: string }): string[] {
    const fromVideoUrl = parseVideoUrls(m.video_url).filter(isVideoUrl);
    if (fromVideoUrl.length > 0) return fromVideoUrl;
    if (m.url && isVideoUrl(m.url)) return [m.url];
    return [];
}

export default function BasindaBizSection() {
    const [mentions, setMentions] = useState<PressMention[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [modalContent, setModalContent] = useState<PressMention | null>(null);
    // videoModal: { mention, videoIndex } — tracks which card and which video index is open
    const [videoModal, setVideoModal] = useState<{ mention: PressMention; videoIndex: number } | null>(null);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const currentVideos = videoModal ? getVideosForMention(videoModal.mention) : [];

    const nextVideo = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!videoModal) return;
        const videos = getVideosForMention(videoModal.mention);
        setVideoModal({ mention: videoModal.mention, videoIndex: (videoModal.videoIndex + 1) % videos.length });
    };

    const prevVideo = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!videoModal) return;
        const videos = getVideosForMention(videoModal.mention);
        setVideoModal({ mention: videoModal.mention, videoIndex: (videoModal.videoIndex - 1 + videos.length) % videos.length });
    };

    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (distance > minSwipeDistance) nextVideo();
        if (distance < -minSwipeDistance) prevVideo();
    };

    useEffect(() => {
        async function loadMentions() {
            try {
                const { data: featuredData, error: featuredError } = await supabase
                    .from("press_mentions")
                    .select("*")
                    .eq("is_featured", true)
                    .order("published_date", { ascending: false });

                if (!featuredError && featuredData && featuredData.length > 0) {
                    setMentions(featuredData);
                } else {
                    const { data, error } = await supabase
                        .from("press_mentions")
                        .select("*")
                        .order("published_date", { ascending: false })
                        .limit(3);

                    if (!error && data) {
                        setMentions(data);
                    }
                }
            } catch (err) {
                console.error("Basında biz yükleme hatası:", err);
            } finally {
                setLoading(false);
            }
        }
        loadMentions();
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % mentions.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + mentions.length) % mentions.length);
    };

    if (loading || mentions.length === 0) return null;

    return (
        <div className="paddingMobile" style={{ marginTop: 32, marginBottom: 24 }}>
            <div style={{ maxWidth: 1050, margin: "0 auto" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <h3
                        className="titleCats"
                        style={{ textAlign: "left", fontSize: 30, fontWeight: 700, color: "#000", margin: 0 }}
                    >
                        Basında Biz
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        {mentions.length > 1 && (
                            <div style={{ display: "flex", gap: 8 }}>
                                <button
                                    onClick={prevSlide}
                                    style={{
                                        width: 36, height: 36, borderRadius: "50%", background: "#fff",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        border: "1px solid #e2e8f0", cursor: "pointer", color: "#475569",
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)", transition: "all 0.2s"
                                    }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                                </button>
                                <button
                                    onClick={nextSlide}
                                    style={{
                                        width: 36, height: 36, borderRadius: "50%", background: "#fff",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        border: "1px solid #e2e8f0", cursor: "pointer", color: "#475569",
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)", transition: "all 0.2s"
                                    }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </button>
                            </div>
                        )}
                        <Link
                            href="/bloglar/basinda-biz"
                            style={{ fontSize: 15, color: "#0cbc87", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}
                        >
                            Tümünü Gör
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </Link>
                    </div>
                </div>

                <div style={{ position: "relative", overflow: "hidden", padding: "4px 0" }}>
                    <div
                        style={{
                            display: "flex",
                            transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                            transform: `translateX(-${(currentIndex * 100) / mentions.length}%)`,
                            width: `${mentions.length * 100}%`
                        }}
                    >
                        {mentions.map((m) => (
                            <div key={m.id} style={{ width: `${100 / mentions.length}%`, padding: "0 2px", boxSizing: "border-box" }}>
                                <div
                                    style={{ display: "block", cursor: "pointer" }}
                                    onClick={() => {
                                        const videos = getVideosForMention(m);
                                        if (videos.length > 0) {
                                            setVideoModal({ mention: m, videoIndex: 0 });
                                        } else if (m.url) {
                                            window.open(m.url, "_blank", "noopener,noreferrer");
                                        }
                                    }}
                                >
                                    <div
                                        className="basinda-biz-card"
                                        style={{
                                            display: "flex",
                                            alignItems: "stretch",
                                            background: "#fff",
                                            borderRadius: 20,
                                            border: "1px solid #e2e8f0",
                                            overflow: "hidden",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                            width: "100%",
                                            cursor: "pointer"
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.08)";
                                            e.currentTarget.style.transform = "translateY(-4px)";
                                            e.currentTarget.style.borderColor = "#cbd5e1";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.03)";
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.borderColor = "#e2e8f0";
                                        }}
                                    >
                                        {/* Görsel/Video Alanı */}
                                        <div
                                            className="basinda-biz-image-container"
                                            style={{ position: "relative", background: "#f8fafc", overflow: "hidden" }}
                                            onClick={(e) => {
                                                const videos = getVideosForMention(m);
                                                if (videos.length > 0) {
                                                    e.stopPropagation();
                                                    setVideoModal({ mention: m, videoIndex: 0 });
                                                }
                                            }}
                                        >
                                            {(() => {
                                                const videos = getVideosForMention(m);
                                                const firstVideo = videos[0] || "";
                                                const hasVideos = videos.length > 0;
                                                const firstYtId = hasVideos ? getYoutubeId(firstVideo) : null;
                                                const firstIsDirect = hasVideos ? isDirectVideo(firstVideo) : false;

                                                if (hasVideos && firstYtId) {
                                                    return (
                                                        <>
                                                            <img
                                                                src={`https://img.youtube.com/vi/${firstYtId}/hqdefault.jpg`}
                                                                alt={m.title}
                                                                className="basinda-biz-media"
                                                                style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                                                            />
                                                            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5 }}>
                                                                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.95)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
                                                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="#0f172a" style={{ marginLeft: 4 }}><polygon points="5 3 19 12 5 21 5 3" /></svg>
                                                                </div>
                                                            </div>
                                                        </>
                                                    );
                                                } else if (hasVideos && firstIsDirect) {
                                                    return (
                                                        <>
                                                            {m.image_url ? (
                                                                <img src={m.image_url} alt={m.title} className="basinda-biz-media" style={{ objectFit: "cover", transition: "transform 0.5s ease" }} />
                                                            ) : (
                                                                <div className="basinda-biz-media" style={{ background: "#0f172a" }} />
                                                            )}
                                                            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5 }}>
                                                                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.95)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
                                                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="#0f172a" style={{ marginLeft: 4 }}><polygon points="5 3 19 12 5 21 5 3" /></svg>
                                                                </div>
                                                            </div>
                                                        </>
                                                    );
                                                } else if (m.image_url) {
                                                    return (
                                                        <img
                                                            src={m.image_url}
                                                            alt={m.title}
                                                            className="basinda-biz-media"
                                                            style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                                                        />
                                                    );
                                                } else {
                                                    return (
                                                        <div className="basinda-biz-media" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f1f5f9", color: "#94a3b8" }}>
                                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5, marginBottom: 8 }}>
                                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                                                <polyline points="21 15 16 10 5 21"></polyline>
                                                            </svg>
                                                            <span style={{ fontSize: 13, fontWeight: 500 }}>Görsel Yok</span>
                                                        </div>
                                                    );
                                                }
                                            })()}
                                            <div style={{ position: "absolute", top: 16, left: 16, background: "rgba(15, 23, 42, 0.85)", color: "white", padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, letterSpacing: "0.5px", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", gap: 6, zIndex: 11 }}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                                                </svg>
                                                {m.publisher}
                                            </div>
                                        </div>

                                        {/* İçerik Alanı */}
                                        <div className="basinda-biz-content" style={{ padding: "28px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", fontSize: "14px", marginBottom: "12px", fontWeight: 500 }}>
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                                </svg>
                                                {m.published_date ? new Date(m.published_date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }) : "Tarih Belirtilmedi"}
                                            </div>
                                            <h4
                                                style={{ fontSize: "24px", marginBottom: "14px", fontWeight: 700, lineHeight: 1.35, color: "#0f172a", letterSpacing: "-0.5px" }}
                                            >
                                                {m.title}
                                            </h4>
                                            <div
                                                style={{ color: "#475569", fontSize: "16px", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                                            >
                                                {m.content || "Bu haberin detaylarını okumak ve daha fazla bilgi almak için tıklayın."}
                                            </div>
                                            {(m.content && m.content.length > 150) && (
                                                <div
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setModalContent(m);
                                                    }}
                                                    style={{ color: "#0cbc87", fontSize: "14px", fontWeight: 600, marginTop: "8px", cursor: "pointer", display: "inline-block" }}
                                                >
                                                    Devamını Oku...
                                                </div>
                                            )}
                                            <div style={{ marginTop: "24px", display: "flex", alignItems: "center" }}>
                                                {(() => {
                                                    const videos = getVideosForMention(m);
                                                    if (videos.length > 0) {
                                                        return (
                                                            <div
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setVideoModal({ mention: m, videoIndex: 0 });
                                                                }}
                                                                className="basinda-biz-link"
                                                                style={{ color: "#0cbc87", fontWeight: 600, display: "flex", alignItems: "center", gap: 6, fontSize: "15px" }}
                                                            >
                                                                {videos.length > 1 ? `${videos.length} Video İzle` : "Videoyu İzle"}
                                                                <svg className="basinda-biz-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "transform 0.2s" }}>
                                                                    <polygon points="5 3 19 12 5 21 5 3" />
                                                                </svg>
                                                            </div>
                                                        );
                                                    } else if (m.url) {
                                                        return (
                                                            <div className="basinda-biz-link" style={{ color: "#0cbc87", fontWeight: 600, display: "flex", alignItems: "center", gap: 6, fontSize: "15px" }}>
                                                                Habere Git
                                                                <svg className="basinda-biz-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "transform 0.2s" }}>
                                                                    <polyline points="9 18 15 12 9 6"></polyline>
                                                                </svg>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .basinda-biz-card {
                    min-height: 300px;
                }

                .basinda-biz-image-container {
                    width: 38%;
                    min-width: 280px;
                }

                .basinda-biz-media {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }

                .basinda-biz-card:hover .basinda-biz-media {
                    transform: scale(1.05);
                }

                .basinda-biz-card:hover .basinda-biz-arrow {
                    transform: translateX(4px);
                }

                @media (max-width: 768px) {
                    .basinda-biz-card {
                         flex-direction: column !important;
                    }
                    .basinda-biz-image-container {
                         width: 100% !important;
                         min-width: unset !important;
                         height: 240px !important;
                    }
                    .basinda-biz-media {
                         position: absolute !important;
                    }
                    .basinda-biz-content {
                         padding: 24px !important;
                    }
                }
            `}</style>

            {/* Devamını Oku Modal */}
            {modalContent && (
                <div
                    style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
                    onClick={() => setModalContent(null)}
                >
                    <div
                        style={{ background: "#fff", padding: "30px", borderRadius: "16px", maxWidth: "600px", width: "100%", maxHeight: "80vh", overflowY: "auto", position: "relative", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setModalContent(null)}
                            style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                        <h4 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "16px", color: "#0f172a", paddingRight: "30px" }}>{modalContent.title}</h4>
                        <div style={{ color: "#475569", fontSize: "16px", lineHeight: 1.8, marginBottom: "24px", whiteSpace: "pre-wrap" }}>
                            {modalContent.content}
                        </div>
                        {modalContent.url && (
                            <Link href={modalContent.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0cbc87", color: "#fff", padding: "10px 20px", borderRadius: "8px", textDecoration: "none", fontWeight: 600 }}>
                                Haberin Orijinaline Git
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                            </Link>
                        )}
                    </div>
                </div>
            )}

            {/* Video Modal */}
            {videoModal && currentVideos.length > 0 && (
                <div
                    style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
                    onClick={() => setVideoModal(null)}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    key={videoModal.videoIndex}
                >
                    <div
                        style={{ position: "relative", width: "100%", maxWidth: 900 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setVideoModal(null)}
                            style={{ position: "absolute", top: -48, right: 0, background: "none", border: "none", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600 }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            Kapat
                        </button>
                        <div style={{ position: "relative", paddingTop: "56.25%", borderRadius: 12, overflow: "hidden", background: "#000" }}>
                            {currentVideos.length > 1 && (
                                <>
                                    <button
                                        onClick={prevVideo}
                                        className="video-nav-btn prev"
                                        style={{
                                            position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
                                            background: "rgba(0,0,0,0.5)", border: "none", color: "#fff",
                                            width: 40, height: 40, borderRadius: "50%", display: "flex",
                                            alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10,
                                            backdropFilter: "blur(4px)"
                                        }}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                                    </button>
                                    <button
                                        onClick={nextVideo}
                                        className="video-nav-btn next"
                                        style={{
                                            position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
                                            background: "rgba(0,0,0,0.5)", border: "none", color: "#fff",
                                            width: 40, height: 40, borderRadius: "50%", display: "flex",
                                            alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10,
                                            backdropFilter: "blur(4px)"
                                        }}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                    </button>
                                </>
                            )}
                            {(() => {
                                const currentUrl = (currentVideos[videoModal.videoIndex] || "").trim();
                                return isYoutubeUrl(currentUrl) ? (
                                    <iframe
                                        src={getEmbedUrl(currentUrl)}
                                        title={videoModal.mention.title}
                                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : (
                                    <video
                                        src={currentUrl}
                                        controls
                                        autoPlay
                                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "contain" }}
                                    />
                                );
                            })()}
                        </div>
                        {currentVideos.length > 1 && (
                            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
                                {currentVideos.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={(e) => { e.stopPropagation(); setVideoModal({ mention: videoModal.mention, videoIndex: i }); }}
                                        style={{
                                            width: 8, height: 8, borderRadius: "50%", border: "none", cursor: "pointer",
                                            background: i === videoModal.videoIndex ? "#fff" : "rgba(255,255,255,0.35)",
                                            padding: 0, transition: "background 0.2s"
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                        <div style={{ marginTop: 12, color: "#fff", fontSize: 18, fontWeight: 700 }}>{videoModal.mention.title}</div>
                        <div style={{ color: "#94a3b8", fontSize: 14, marginTop: 4 }}>
                            {videoModal.mention.publisher}
                            {currentVideos.length > 1 && (
                                <span style={{ marginLeft: 8, color: "#64748b" }}>{videoModal.videoIndex + 1} / {currentVideos.length}</span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
