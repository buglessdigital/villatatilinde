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

function getEmbedUrl(videoUrl: string): string | null {
    if (!videoUrl) return null;
    const ytMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    if (videoUrl.includes("youtube.com/embed/")) return videoUrl;
    return null;
}

function isDirectVideo(url: string): boolean {
    return /\.(mp4|webm|ogg)(\?|$)/i.test(url);
}

export default function BasindaBizSection() {
    const [mentions, setMentions] = useState<PressMention[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [modalContent, setModalContent] = useState<PressMention | null>(null);

    useEffect(() => {
        async function loadMentions() {
            try {
                // Return the featured ones
                const { data: featuredData, error: featuredError } = await supabase
                    .from("press_mentions")
                    .select("*")
                    .eq("is_featured", true)
                    .order("published_date", { ascending: false });

                if (!featuredError && featuredData && featuredData.length > 0) {
                    setMentions(featuredData);
                } else {
                    // Fallback to latest 3 if no featured
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

    const mention = mentions[currentIndex];

    return (
        <div className="paddingMobile" style={{ marginTop: 32, marginBottom: 24 }}>
            <div style={{ maxWidth: 1050, margin: "0 auto" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <h3
                        className="titleCats"
                        style={{
                            textAlign: "left",
                            fontSize: 30,
                            fontWeight: 700,
                            color: "#000",
                            margin: 0,
                        }}
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
                                    className="hover:bg-slate-50 hover:border-slate-300"
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
                                    className="hover:bg-slate-50 hover:border-slate-300"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </button>
                            </div>
                        )}
                        <Link
                            href="/bloglar/basinda-biz"
                            style={{
                                fontSize: 15,
                                color: "#0cbc87",
                                fontWeight: 600,
                                textDecoration: "none",
                                display: "flex",
                                alignItems: "center",
                                gap: 4
                            }}
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
                                <Link 
                                    href={m.url || "#"} 
                                    target={m.url ? "_blank" : "_self"} 
                                    rel={m.url ? "noopener noreferrer" : ""}
                                    onClick={(e) => { if (!m.url) e.preventDefault(); }}
                                    style={{ textDecoration: "none", color: "inherit", display: "block" }}
                                >
                                    <div
                                        className="basinda-biz-card group"
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
                                            cursor: m.url ? "pointer" : "default"
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
                                        <div className="basinda-biz-image-container" style={{ position: "relative", background: "#f8fafc", overflow: "hidden" }}>
                                            {m.video_url && getEmbedUrl(m.video_url) ? (
                                                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 10 }}></div> // prevent iframe interaction to keep link clickable
                                            ) : null}
                                            {m.video_url && getEmbedUrl(m.video_url) ? (
                                                <iframe
                                                    src={getEmbedUrl(m.video_url)!}
                                                    className="basinda-biz-media"
                                                    style={{ width: "100%", height: "100%", border: "none" }}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                            ) : m.video_url && isDirectVideo(m.video_url) ? (
                                                <video
                                                    src={m.video_url}
                                                    className="basinda-biz-media"
                                                    style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                                                    muted
                                                    loop
                                                    playsInline
                                                />
                                            ) : m.image_url ? (
                                                <img
                                                    src={m.image_url}
                                                    alt={m.title}
                                                    className="basinda-biz-media"
                                                    style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                                                />
                                            ) : (
                                                <div className="basinda-biz-media" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f1f5f9", color: "#94a3b8" }}>
                                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5, marginBottom: 8 }}>
                                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                                        <polyline points="21 15 16 10 5 21"></polyline>
                                                    </svg>
                                                    <span style={{ fontSize: 13, fontWeight: 500 }}>Görsel Yok</span>
                                                </div>
                                            )}
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
                                                style={{
                                                    fontSize: "24px",
                                                    marginBottom: "14px",
                                                    fontWeight: 700,
                                                    lineHeight: 1.35,
                                                    color: "#0f172a",
                                                    letterSpacing: "-0.5px"
                                                }}
                                            >
                                                {m.title}
                                            </h4>
                                            <div
                                                style={{
                                                    color: "#475569",
                                                    fontSize: "16px",
                                                    lineHeight: 1.6,
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden"
                                                }}
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
                                            <div
                                                style={{ marginTop: "24px", display: "flex", alignItems: "center" }}
                                            >
                                                {m.url && (
                                                    <div className="basinda-biz-link" style={{ color: "#0cbc87", fontWeight: 600, display: "flex", alignItems: "center", gap: 6, fontSize: "15px", transition: "all 0.2s" }}>
                                                        Habere Git
                                                        <svg className="basinda-biz-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "transform 0.2s" }}>
                                                            <polyline points="9 18 15 12 9 6"></polyline>
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
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

            {/* Read More Modal */}
            {modalContent && (
                <div 
                    style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
                    onClick={(e) => { e.stopPropagation(); setModalContent(null); }}
                >
                    <div 
                        style={{ background: "#fff", padding: "30px", borderRadius: "16px", maxWidth: "600px", width: "100%", maxHeight: "80vh", overflowY: "auto", position: "relative", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            onClick={(e) => { e.stopPropagation(); setModalContent(null); }}
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
        </div>
    );
}
