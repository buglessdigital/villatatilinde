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
    const [mention, setMention] = useState<PressMention | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadLatestMention() {
            try {
                // Return the featured one, if none exists fallback to latest
                const { data: featuredData, error: featuredError } = await supabase
                    .from("press_mentions")
                    .select("*")
                    .eq("is_featured", true)
                    .single();

                if (!featuredError && featuredData) {
                    setMention(featuredData);
                } else {
                    const { data, error } = await supabase
                        .from("press_mentions")
                        .select("*")
                        .order("published_date", { ascending: false })
                        .limit(1)
                        .single();

                    if (!error && data) {
                        setMention(data);
                    }
                }
            } catch (err) {
                console.error("Basında biz yükleme hatası:", err);
            } finally {
                setLoading(false);
            }
        }
        loadLatestMention();
    }, []);

    if (loading || !mention) return null;

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
            
            <Link href={mention.url || "/bloglar/basinda-biz"} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
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
                    <div className="basinda-biz-image-container" style={{ position: "relative", background: "#f8fafc", overflow: "hidden" }}>
                         {mention.video_url && getEmbedUrl(mention.video_url) ? (
                             <iframe
                                 src={getEmbedUrl(mention.video_url)!}
                                 className="basinda-biz-media"
                                 style={{ width: "100%", height: "100%", border: "none" }}
                                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                 allowFullScreen
                             />
                         ) : mention.video_url && isDirectVideo(mention.video_url) ? (
                             <video
                                 src={mention.video_url}
                                 controls
                                 className="basinda-biz-media"
                                 style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                             />
                         ) : mention.image_url ? (
                             <img
                                 src={mention.image_url}
                                 alt={mention.title}
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
                         <div style={{ position: "absolute", top: 16, left: 16, background: "rgba(15, 23, 42, 0.85)", color: "white", padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, letterSpacing: "0.5px", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", gap: 6 }}>
                             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                 <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                 <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                             </svg>
                             {mention.publisher}
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
                            {mention.published_date ? new Date(mention.published_date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }) : "Tarih Belirtilmedi"}
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
                            {mention.title}
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
                            {mention.content || "Bu haberin detaylarını okumak ve daha fazla bilgi almak için tıklayın."}
                        </div>
                        <div
                            style={{ marginTop: "24px", display: "flex", alignItems: "center" }}
                        >
                            <div className="basinda-biz-link" style={{ color: "#0cbc87", fontWeight: 600, display: "flex", alignItems: "center", gap: 6, fontSize: "15px", transition: "all 0.2s" }}>
                                Habere Git
                                <svg className="basinda-biz-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "transform 0.2s" }}>
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
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
        </div>
    );
}
