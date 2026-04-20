"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
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
}

function getEmbedUrl(videoUrl: string): string | null {
    if (!videoUrl) return null;
    // YouTube full URL
    const ytMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    // YouTube short or embed already
    if (videoUrl.includes("youtube.com/embed/")) return videoUrl;
    // Direct video file — handled separately
    return null;
}

function isDirectVideo(url: string): boolean {
    return /\.(mp4|webm|ogg)(\?|$)/i.test(url);
}

const ITEMS_PER_PAGE = 6;

export default function BasindaBizPage() {
    const [mentions, setMentions] = useState<PressMention[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [changingPage, setChangingPage] = useState(false);

    useEffect(() => {
        async function loadMentions() {
            try {
                const { data, error } = await supabase
                    .from("press_mentions")
                    .select("*")
                    .order("published_date", { ascending: false });

                if (error) throw error;
                if (data) setMentions(data as PressMention[]);
            } catch (err) {
                console.error("Basında biz yükleme hatası:", err);
            } finally {
                setLoading(false);
            }
        }
        loadMentions();
    }, []);

    const totalPages = Math.ceil(mentions.length / ITEMS_PER_PAGE);
    const pageItems = mentions.slice(
        ITEMS_PER_PAGE * (page - 1),
        ITEMS_PER_PAGE * page
    );

    const pager = (n: number) => {
        setChangingPage(true);
        setPage(n);
        setTimeout(() => {
            setChangingPage(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 400);
    };

    return (
        <div className="blogMain" style={{ animation: "fadeInUp 0.5s ease forwards" }}>
            <div
                className="paddingMobile"
                style={{
                    color: "#0b0a12",
                    paddingBottom: "80px",
                    marginTop: "calc(3vh + 2vw)",
                    minHeight: "60vh"
                }}
            >
                <div>
                    <div
                        className="inter"
                        style={{
                            fontSize: "calc(16px + 1.5vw)",
                            fontWeight: "bold",
                        }}
                    >
                        <span>Basında</span> Biz
                    </div>
                    <p style={{ marginTop: 12, fontSize: "1.1rem", color: "#64748b", maxWidth: 800 }}>
                        Medya kuruluşlarında Villa Tatilinde hakkında çıkan haberleri, analizleri ve incelemeleri bu sayfadan takip edebilirsiniz.
                    </p>

                    {/* ── Main Loading Skeletons ── */}
                    {loading ? (
                        <div className="row" style={{ marginTop: "32px" }}>
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="breg"
                                    style={{
                                        height: "434px",
                                        borderRadius: "16px",
                                        background: "#f0f0f0",
                                        animation: "pulse 1.5s ease-in-out infinite",
                                        width: "100%", margin: "0 10px 20px"
                                    }}
                                />
                            ))}
                        </div>
                    ) : mentions.length === 0 ? (
                        <div style={{ marginTop: 60, textAlign: "center", color: "#64748b", fontSize: "1.1rem" }}>
                            Henüz bir haber kaydı bulunmamaktadır.
                        </div>
                    ) : (
                        <>
                            {/* ── Grid ── */}
                            {!changingPage && (
                                <div className="row" style={{ marginTop: "40px" }}>
                                    {pageItems.map((mention) => (
                                        <div key={mention.id} className="blogSmall" style={{ marginBottom: "2rem" }}>
                                            <a href={mention.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}>
                                                <div style={{ width: "100%", display: "flex", flexDirection: "column", height: "100%" }} className="hvIm">
                                                    <div style={{ width: "100%", height: "240px", position: "relative", overflow: "hidden", borderRadius: "12px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                                                        {mention.video_url && getEmbedUrl(mention.video_url) ? (
                                                            <iframe
                                                                src={getEmbedUrl(mention.video_url)!}
                                                                style={{ width: "100%", height: "100%", border: "none" }}
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                allowFullScreen
                                                            />
                                                        ) : mention.video_url && isDirectVideo(mention.video_url) ? (
                                                            <video
                                                                src={mention.video_url}
                                                                controls
                                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                            />
                                                        ) : mention.image_url ? (
                                                            <Image
                                                                className="hvi"
                                                                src={mention.image_url}
                                                                alt={mention.title}
                                                                fill
                                                                style={{ objectFit: "cover", transition: "transform 0.3s ease" }}
                                                            />
                                                        ) : (
                                                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9", color: "#94a3b8" }}>
                                                                Görsel Yok
                                                            </div>
                                                        )}
                                                        <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(15, 23, 42, 0.8)", color: "white", padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600, letterSpacing: "0.5px" }}>
                                                            {mention.publisher}
                                                        </div>
                                                    </div>
                                                    
                                                    <div style={{ flex: 1, display: "flex", flexDirection: "column", marginTop: "1rem" }}>
                                                        <h2
                                                            className="inter"
                                                            style={{
                                                                fontSize: "24px",
                                                                marginBottom: "12px",
                                                                fontWeight: 600,
                                                                lineHeight: 1.3,
                                                                color: "#0f172a"
                                                            }}
                                                        >
                                                            {mention.title}
                                                        </h2>
                                                        <div
                                                            className="inter fourLine"
                                                            style={{
                                                                color: "#475569",
                                                                fontSize: "15px",
                                                                lineHeight: 1.6,
                                                                flex: 1
                                                            }}
                                                        >
                                                            {mention.content || "Haberin detaylarını okumak için tıklayın."}
                                                        </div>
                                                        <div
                                                            className="middleft inter"
                                                            style={{ fontSize: "14px", marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #f1f5f9" }}
                                                        >
                                                            <div style={{ color: "#64748b", display: "flex", alignItems: "center", gap: 6 }}>
                                                                🗓️ {mention.published_date ? new Date(mention.published_date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }) : "Tarih Belirtilmedi"}
                                                            </div>
                                                            <div
                                                                className="middlert bhs"
                                                                style={{ marginLeft: "auto", color: "#0cbc87", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}
                                                            >
                                                                Habere Git
                                                                <Image
                                                                    src="/images/longright.png"
                                                                    alt=""
                                                                    width={30}
                                                                    height={8}
                                                                    style={{ height: "10px", width: "auto" }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* ── Loading Skeletons for changing page ── */}
                            {changingPage && (
                                <div className="row" style={{ marginTop: "40px" }}>
                                    {[1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className="blogSmall"
                                            style={{
                                                height: "434px",
                                                borderRadius: "16px",
                                                background: "#f8fafc",
                                                animation: "pulse 1.5s ease-in-out infinite",
                                                marginBottom: "2rem"
                                            }}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* ── Pagination ── */}
                            {totalPages > 1 && (
                                <div className="row inter">
                                    <div style={{ width: "100%" }}>
                                        <div
                                            className="middle inter"
                                            style={{ fontWeight: 400, marginTop: "32px" }}
                                        >
                                            {/* Previous Button */}
                                            {page > 1 ? (
                                                <div
                                                    onClick={() => pager(page - 1)}
                                                    className="bhs middle"
                                                    style={{ marginRight: "4px", width: "52px", height: "46px", background: "#f0f3f2", borderRadius: "8px", cursor: "pointer" }}
                                                >
                                                    <Image src="/images/cfo.svg" alt="Previous" width={24} height={24} style={{ opacity: 0.7, height: "24px", transform: "scaleX(-1)" }} />
                                                </div>
                                            ) : (
                                                <div style={{ marginRight: "4px", width: "52px", height: "46px", background: "#fff", borderRadius: "8px" }} />
                                            )}

                                            {/* Page numbers */}
                                            {page > 2 && (
                                                <div onClick={() => pager(page - 2)} className="bhs middle" style={{ marginRight: "4px", width: "42px", height: "46px", background: "#f0f3f2", fontWeight: 600, borderRadius: "8px", cursor: "pointer" }}>
                                                    {page - 2}
                                                </div>
                                            )}

                                            {page > 1 && (
                                                <div onClick={() => pager(page - 1)} className="bhs middle" style={{ marginRight: "4px", width: "42px", height: "46px", background: "#f0f3f2", fontWeight: 600, borderRadius: "8px", cursor: "pointer" }}>
                                                    {page - 1}
                                                </div>
                                            )}

                                            {/* Current page */}
                                            <div className="bhs middle" style={{ marginRight: "4px", width: "42px", height: "46px", background: "#0aad0a", color: "#fff", fontWeight: 600, borderRadius: "8px" }}>
                                                {page}
                                            </div>

                                            {totalPages > page && (
                                                <div onClick={() => pager(page + 1)} className="bhs middle" style={{ marginRight: "4px", width: "42px", height: "46px", background: "#f0f3f2", borderRadius: "8px", cursor: "pointer" }}>
                                                    {page + 1}
                                                </div>
                                            )}

                                            {page === 1 && totalPages > page + 1 && (
                                                <div onClick={() => pager(page + 2)} className="middle" style={{ marginRight: "4px", width: "42px", height: "46px", background: "#f0f3f2", borderRadius: "8px", cursor: "pointer" }}>
                                                    {page + 2}
                                                </div>
                                            )}

                                            {/* Next Button */}
                                            {totalPages > page ? (
                                                <div onClick={() => pager(page + 1)} className="bhs middle" style={{ width: "52px", height: "46px", background: "#f0f3f2", borderRadius: "8px", cursor: "pointer" }}>
                                                    <Image src="/images/cfo.svg" alt="Next" width={24} height={24} style={{ opacity: 0.7, height: "24px" }} />
                                                </div>
                                            ) : (
                                                <div style={{ width: "52px", height: "46px", background: "#fff", borderRadius: "8px" }} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Some CSS to handle small fixes */}
            <style jsx global>{`
                .fourLine {
                    display: -webkit-box;
                    -webkit-line-clamp: 4;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
}
