"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface BannerDetail {
    id: string;
    title: string;
    slug: string;
    image_url: string;
    mobile_image_url: string;
    subtitle: string;
    description: string;
    button_text: string;
    button_url: string;
}

export default function BannerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const [banner, setBanner] = useState<BannerDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        params.then(async ({ slug }) => {
            const { data, error } = await supabase
                .from("banners")
                .select("id, title, slug, image_url, mobile_image_url, subtitle, description, button_text, button_url")
                .eq("slug", slug)
                .eq("is_active", true)
                .single();

            if (error || !data) {
                setNotFound(true);
            } else {
                setBanner(data);
            }
            setLoading(false);
        });
    }, [params]);

    if (loading) {
        return (
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                minHeight: "60vh", color: "#999", fontSize: 16
            }}>
                Yükleniyor...
            </div>
        );
    }

    if (notFound || !banner) {
        return (
            <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", minHeight: "60vh", padding: 32
            }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
                <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Sayfa Bulunamadı</h1>
                <p style={{ color: "#888", marginBottom: 24, textAlign: "center" }}>Aradığınız kampanya sayfası mevcut değil veya kaldırılmış olabilir.</p>
                <Link href="/" style={{
                    background: "#1e90ff", color: "#fff", padding: "10px 24px",
                    borderRadius: 8, textDecoration: "none", fontWeight: 600
                }}>
                    Ana Sayfaya Dön
                </Link>
            </div>
        );
    }

    return (
        <div style={{ background: "#f8fafc", minHeight: "80vh", paddingBottom: 60 }}>
            {/* Hero Image */}
            <div
                className="banner-detail-hero"
                style={{
                    width: "100%",
                    aspectRatio: "4 / 1",
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                {/* Desktop image */}
                <img
                    src={banner.image_url}
                    alt={banner.title}
                    className="banner-hero-desktop"
                    style={{
                        position: "absolute", top: 0, left: 0,
                        width: "100%", height: "100%",
                        objectFit: "cover", objectPosition: "center",
                        display: "block", maxWidth: "none",
                    }}
                />
                {/* Mobile image */}
                {banner.mobile_image_url && (
                    <img
                        src={banner.mobile_image_url}
                        alt={banner.title}
                        className="banner-hero-mobile"
                        style={{
                            position: "absolute", top: 0, left: 0,
                            width: "100%", height: "100%",
                            objectFit: "cover", objectPosition: "center",
                            display: "none", maxWidth: "none",
                        }}
                    />
                )}
            </div>

            {/* Title & Subtitle */}
            <div style={{
                background: "#fff",
                borderBottom: "1px solid #e2e8f0",
                padding: "32px 20px",
                textAlign: "center",
            }}>
                <div style={{ maxWidth: 800, margin: "0 auto" }}>
                    <h1 style={{
                        color: "#1e293b",
                        fontSize: "clamp(24px, 4vw, 36px)",
                        fontWeight: 800,
                        letterSpacing: "-0.5px",
                        margin: 0,
                        marginBottom: banner.subtitle ? 12 : 0,
                        fontFamily: "'Poppins', sans-serif",
                    }}>
                        {banner.title}
                    </h1>

                    {banner.subtitle && (
                        <p style={{
                            color: "#64748b",
                            fontSize: "clamp(15px, 2vw, 18px)",
                            fontWeight: 500,
                            margin: 0,
                            maxWidth: 600,
                            marginInline: "auto",
                            lineHeight: 1.6,
                        }}>
                            {banner.subtitle}
                        </p>
                    )}
                </div>
            </div>

            {/* Breadcrumb */}
            <div style={{
                background: "#f1f5f9",
                borderBottom: "1px solid #e2e8f0",
                padding: "12px 20px",
            }}>
                <div style={{
                    maxWidth: 800,
                    margin: "0 auto",
                    fontSize: 13,
                    color: "#64748b",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                }}>
                    <Link href="/" style={{ color: "#0ea5e9", textDecoration: "none", fontWeight: 500 }}>Ana Sayfa</Link>
                    <span>›</span>
                    <span style={{ color: "#334155" }}>{banner.title}</span>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="paddingMobile" style={{ marginTop: 40 }}>
                <div style={{
                    maxWidth: 800,
                    margin: "0 auto",
                    background: "#fff",
                    borderRadius: 24,
                    padding: "40px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)",
                }}>
                    {banner.description ? (
                        <div style={{
                            fontSize: "16px",
                            lineHeight: 1.8,
                            color: "#334155",
                            fontWeight: 400,
                        }}>
                            {banner.description.split("\n").map((paragraph, index) => (
                                paragraph.trim() ? (
                                    <p key={index} style={{ marginBottom: "1.2rem", textAlign: "justify" }}>
                                        {paragraph}
                                    </p>
                                ) : (
                                    <div key={index} style={{ height: "0.8rem" }}></div>
                                )
                            ))}
                        </div>
                    ) : (
                        <div style={{
                            textAlign: "center",
                            padding: "40px 0",
                            color: "#94a3b8",
                            fontSize: 16,
                            fontStyle: "italic"
                        }}>
                            Bu kampanya hakkında detaylı bilgi yakında eklenecektir.
                        </div>
                    )}

                    {/* Action Area */}
                    <div style={{
                        marginTop: 48,
                        paddingTop: 32,
                        borderTop: "1px solid #f1f5f9",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 24,
                    }}>
                        {(banner.button_text || banner.button_url) && (
                            <Link href={banner.button_url || "/"} style={{
                                background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                                color: "#fff",
                                padding: "14px 40px",
                                borderRadius: 50,
                                textDecoration: "none",
                                fontWeight: 600,
                                fontSize: 16,
                                boxShadow: "0 4px 14px rgba(14, 165, 233, 0.3)",
                                transition: "all 0.3s ease",
                                textAlign: "center",
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 6px 20px rgba(14, 165, 233, 0.4)";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 4px 14px rgba(14, 165, 233, 0.3)";
                            }}
                            >
                                {banner.button_text || "Hemen İncele"}
                            </Link>
                        )}
                        
                        <Link href="/iletisim" style={{
                            color: "#64748b",
                            textDecoration: "underline",
                            textUnderlineOffset: 4,
                            fontSize: 14,
                            fontWeight: 500,
                        }}>
                            Detaylı bilgi için bize ulaşın
                        </Link>
                    </div>
                </div>
            </div>
            
            <style>{`
                @media (max-width: 640px) {
                    .paddingMobile > div {
                        padding: 24px 16px !important;
                        border-radius: 16px !important;
                    }
                }
                @media (max-width: 768px) {
                    .banner-detail-hero {
                        aspect-ratio: 16 / 7 !important;
                    }
                    .banner-hero-desktop { display: none !important; }
                    .banner-hero-mobile { display: block !important; }
                }
            `}</style>
        </div>
    );
}
