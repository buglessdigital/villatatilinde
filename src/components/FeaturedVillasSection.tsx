"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getFeaturedVillas } from "@/lib/queries";
import type { VillaCard as VillaCardType } from "@/lib/types";
import { useCurrency } from "@/context/CurrencyContext";

import SharedVillaCard, { type VillaView } from "@/components/SharedVillaCard";

function mapVillaToView(v: VillaCardType): VillaView {
    const raw = Number(v.min_price) || 0;
    return {
        slug: v.slug,
        name: v.name,
        images: v.images.filter(img => img && img.trim() !== "").length > 0 ? v.images.filter(img => img && img.trim() !== "") : [v.cover_image_url || "/images/natureview.jpg"],
        features: v.features.slice(0, 3),
        nightlyPrice: raw,
        totalPrice: raw * 5,
        currency: v.currency,
        dateRange: "5 Gece",
        beds: v.bedrooms,
        guests: v.max_guests,
        bathrooms: v.bathrooms || 0,
        maxDiscount: v.max_discount_pct || 0,
        promotionDiscountText: v.promotion_discount_text,
        cheapestVilla: true,
    };
}

const FEATURED_CACHE_KEY = "vt-featured-cache";
const FEATURED_CACHE_TTL = 5 * 60 * 1000;

/* ─── Featured Villas Section ─── */
export default function FeaturedVillasSection() {
    const [villas, setVillas] = useState<VillaView[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const cached = sessionStorage.getItem(FEATURED_CACHE_KEY);
                if (cached) {
                    const { data, ts } = JSON.parse(cached);
                    if (Date.now() - ts < FEATURED_CACHE_TTL) {
                        setVillas(data);
                        setLoading(false);
                        return;
                    }
                }
            } catch {}
            try {
                const data = await getFeaturedVillas();
                const mapped = data.map(mapVillaToView);
                setVillas(mapped);
                try { sessionStorage.setItem(FEATURED_CACHE_KEY, JSON.stringify({ data: mapped, ts: Date.now() })); } catch {}
            } catch (err) {
                console.error('Öne çıkan villalar yüklenemedi:', err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    // Scroll pozisyonunu kaydet (ana sayfa)
    useEffect(() => {
        const handleScroll = () => {
            sessionStorage.setItem("vt-home-scroll", window.scrollY.toString());
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Veri yüklenince scroll pozisyonunu geri yükle
    useEffect(() => {
        if (!loading) {
            const saved = sessionStorage.getItem("vt-home-scroll");
            if (saved) {
                requestAnimationFrame(() => window.scrollTo(0, parseInt(saved)));
            }
        }
    }, [loading]);

    return (
        <div className="mainVillasCont">
            <div className="middlebt paddingMobile">
                <h2 className="titleMain">Öne Çıkan Villalar</h2>
            </div>

            {loading && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                    Villalar yükleniyor...
                </div>
            )}

            <div className="row paddingMobile villaContRow">
                {!loading && villas.map((villa) => (
                    <SharedVillaCard key={villa.slug} villa={villa} />
                ))}
            </div>
        </div>
    );
}
