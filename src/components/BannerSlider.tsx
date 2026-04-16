"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Banner {
    id: string;
    title: string;
    slug: string;
    image_url: string;
    mobile_image_url: string;
    link_url: string;
    is_active: boolean;
    sort_order: number;
}

export default function BannerSlider() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);

    useEffect(() => {
        async function load() {
            const { data, error } = await supabase
                .from("banners")
                .select("*")
                .eq("is_active", true)
                .order("sort_order", { ascending: true });
            
            if (error) {
                console.error("Banner fetch error:", error.message);
            }
            
            console.log("Banners loaded:", data?.length || 0, data);
            
            if (data && data.length > 0) setBanners(data);
            setLoading(false);
        }
        load();
    }, []);

    const goTo = useCallback((index: number) => {
        setCurrent(index);
    }, []);

    const next = useCallback(() => {
        setCurrent((prev) => (prev + 1) % banners.length);
    }, [banners.length]);

    const prev = useCallback(() => {
        setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
    }, [banners.length]);

    // Auto-slide every 5 seconds
    useEffect(() => {
        if (banners.length <= 1) return;
        timerRef.current = setInterval(next, 5000);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [banners.length, next]);

    // Pause on hover
    const pauseAutoSlide = () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
    const resumeAutoSlide = () => {
        if (banners.length <= 1) return;
        timerRef.current = setInterval(next, 5000);
    };

    // Touch swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.changedTouches[0].screenX;
        touchStartY.current = e.changedTouches[0].screenY;
        pauseAutoSlide();
    };
    const handleTouchMove = (e: React.TouchEvent) => {
        // const dx = Math.abs(touchStartX.current - e.changedTouches[0].screenX);
        // const dy = Math.abs(touchStartY.current - e.changedTouches[0].screenY);
        // CSS touch-action: pan-y; yatay scroll'u engellediği için e.preventDefault() kullanmıyoruz.
    };
    const handleTouchEnd = (e: React.TouchEvent) => {
        const diff = touchStartX.current - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 30) {
            if (diff > 0) next();
            else prev();
        }
        resumeAutoSlide();
    };

    if (loading || banners.length === 0) return null;

    return (
        <div
            style={{ marginTop: 28, marginBottom: 8, paddingLeft: "2%", paddingRight: "2%" }}
        >
            <div
                className="banner-slider"
                onMouseEnter={pauseAutoSlide}
                onMouseLeave={resumeAutoSlide}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Slides */}
                <div
                    className="banner-slider-track"
                    style={{ transform: `translateX(-${current * 100}%)` }}
                >
                    {banners.map((banner) => {
                        const href = `/banner/${banner.slug}`;
                        return (
                            <div key={banner.id} className="banner-slide">
                                <Link href={href} className="banner-slide-link">
                                    {/* Desktop image */}
                                    <img
                                        src={banner.image_url}
                                        alt={banner.title}
                                        className="banner-slide-img banner-slide-img-desktop"
                                    />
                                    {/* Mobile image (only rendered if exists) */}
                                    {banner.mobile_image_url && (
                                        <img
                                            src={banner.mobile_image_url}
                                            alt={banner.title}
                                            className="banner-slide-img banner-slide-img-mobile"
                                        />
                                    )}
                                </Link>
                            </div>
                        );
                    })}
                </div>

                {/* Arrows (desktop) */}
                {banners.length > 1 && (
                    <>
                        <button className="banner-arrow banner-arrow-left" onClick={prev}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>
                        <button className="banner-arrow banner-arrow-right" onClick={next}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    </>
                )}

                {/* Dots */}
                {banners.length > 1 && (
                    <div className="banner-dots">
                        {banners.map((_, i) => (
                            <button
                                key={i}
                                className={`banner-dot ${i === current ? "banner-dot-active" : ""}`}
                                onClick={() => goTo(i)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                .banner-slider {
                    position: relative;
                    width: 100%;
                    max-width: 1100px;
                    margin: 0 auto;
                    border-radius: 16px;
                    overflow: hidden;
                    aspect-ratio: 4 / 1;
                    background: #f0f0f0;
                    touch-action: pan-y;
                    user-select: none;
                }
                .banner-slider-track {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    transition: transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1);
                }
                .banner-slide {
                    min-width: 100%;
                    flex-shrink: 0;
                    position: relative;
                }
                .banner-slide-link {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    display: block;
                }
                .banner-slide-img {
                    width: 100%;
                    height: 100%;
                    max-width: none;
                    object-fit: cover;
                    object-position: center;
                    display: block;
                    position: absolute;
                    top: 0;
                    left: 0;
                }
                /* Desktop: show desktop, hide mobile */
                .banner-slide-img-mobile {
                    display: none;
                }
                /* Mobile: show mobile image, hide desktop */
                @media (max-width: 768px) {
                    .banner-slide-img-desktop {
                        display: none;
                    }
                    .banner-slide-img-mobile {
                        display: block;
                    }
                }
                .banner-arrow {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 5;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: none;
                    background: rgba(0,0,0,0.35);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .banner-arrow:hover {
                    background: rgba(0,0,0,0.55);
                }
                .banner-arrow-left {
                    left: 14px;
                }
                .banner-arrow-right {
                    right: 14px;
                }
                .banner-dots {
                    position: absolute;
                    bottom: 12px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 8px;
                    z-index: 5;
                }
                .banner-dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    border: 2px solid rgba(255,255,255,0.8);
                    background: transparent;
                    cursor: pointer;
                    padding: 0;
                    transition: all 0.3s;
                }
                .banner-dot-active {
                    background: #fff;
                    transform: scale(1.2);
                }
                @media (max-width: 768px) {
                    .banner-slider {
                        aspect-ratio: 16 / 7;
                        border-radius: 12px;
                    }
                    .banner-arrow {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
}
