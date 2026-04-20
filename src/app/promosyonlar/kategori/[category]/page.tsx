import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SharedVillaCard from "@/components/SharedVillaCard";

/* ─── Category config ─── */
const categoryConfig: Record<string, { label: string; breadcrumbIcon: string; metaTitle: string; metaDesc: string; dbValues: string[]; isVilla?: boolean }> = {
    restaurant: {
        label: "Restaurant Promosyonları",
        breadcrumbIcon: "/images/utens.png",
        metaTitle: "Restaurant Promosyonları | Villa Tatilinde",
        metaDesc: "Villa Tatilinde misafirlerine özel restaurant indirimleri ve promosyonları. Kaş, Kalkan ve çevresindeki en iyi restoranlarda özel indirimlerden faydalanın.",
        dbValues: ["restaurant", "Restaurant", "restaurant indirimleri"],
    },
    "tekne-turu": {
        label: "Tekne Turu Promosyonları",
        breadcrumbIcon: "/images/sailing2.png",
        metaTitle: "Tekne Turu Promosyonları | Villa Tatilinde",
        metaDesc: "Villa Tatilinde tarafından sağlanan ve sunulan Tekne Turu ve Sailing Promosyonları.",
        dbValues: ["tekne-turu", "Tekne Turu", "tekne turu", "sailing"],
    },
    villa: {
        label: "Promosyonlu Villalar",
        breadcrumbIcon: "/images/villa2.png",
        metaTitle: "Promosyonlu Villalar | Villa Tatilinde",
        metaDesc: "Villa Tatilinde indirimli villa kiralama fırsatları. En uygun fiyat garantisiyle tatil villaları.",
        dbValues: ["villa", "Villa", "promosyonlu villalar"],
        isVilla: true,
    },
};

interface Props {
    params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { category } = await params;
    const config = categoryConfig[category];
    if (!config) return { title: "Promosyonlar | Villa Tatilinde" };
    return {
        title: config.metaTitle,
        description: config.metaDesc,
    };
}

interface Promotion {
    id: string;
    title: string;
    slug: string;
    description: string;
    image_url: string;
    discount_text: string;
    category: string;
    validity_start: string;
    validity_end: string;
    external_url: string;
}

interface PromotionalVilla {
    id: string;
    name: string;
    slug: string;
    cover_image_url: string;
    location_label: string;
    min_price: number;
    max_guests: number;
    bedrooms: number;
    bathrooms: number;
    promotion_discount_text: string;
    promotion_description: string;
    villa_images?: { url: string; sort_order: number }[];
}

export default async function KategoriPage({ params }: Props) {
    const { category } = await params;
    const config = categoryConfig[category];

    if (!config) return notFound();

    // For villa category, fetch from villas table
    if (config.isVilla) {
        const { data: villas } = await supabase
            .from("villas")
            .select("id, name, slug, cover_image_url, location_label, min_price, max_guests, bedrooms, bathrooms, promotion_discount_text, promotion_description, villa_images(url, sort_order)")
            .eq("is_published", true)
            .eq("is_promotional", true)
            .order("sort_order", { ascending: true });

        const promoVillas = (villas || []) as PromotionalVilla[];

        // Fetch premium features for these villas
        const villaIds = promoVillas.map(v => v.id);
        const { data: featureData } = await supabase
            .from('villa_features')
            .select('villa_id, features!inner(label_tr, group_type)')
            .in('villa_id', villaIds)
            .eq('features.group_type', 'premium');

        const premiumFeaturesMap: Record<string, string[]> = {};
        (featureData || []).forEach((vf: any) => {
            if (!premiumFeaturesMap[vf.villa_id]) premiumFeaturesMap[vf.villa_id] = [];
            premiumFeaturesMap[vf.villa_id].push(vf.features.label_tr);
        });

        return (
            <div className="prms-page" style={{ paddingBottom: 72 }}>
                {/* ── Breadcrumb ── */}
                <div className="prms-header">
                    <div className="middle dm-sans" style={{ color: "#85878a", fontSize: 13 }}>
                        <Link href="/promosyonlar">
                            <div className="middle">
                                <img src="/images/hom.png" style={{ marginRight: 3, height: 11 }} alt="" />{" "}
                                Promosyonlar
                            </div>
                        </Link>
                        <div style={{ margin: "0 12px", fontWeight: "bold" }}>&bull;</div>
                        <div>
                            <img src={config.breadcrumbIcon} style={{ marginRight: 3, height: 11 }} alt="" />{" "}
                            {config.label}
                        </div>
                    </div>
                    <h1 className="prms-title" style={{ marginTop: 16 }}>{config.label}</h1>
                </div>

                {/* ── Villa Cards ── */}
                <div className="prms-cat-grid">
                    {promoVillas.length === 0 ? (
                        <div style={{ textAlign: "center", padding: 60, color: "#94a3b8", width: "100%" }}>
                            Promosyonlu villa bulunamadı.
                        </div>
                    ) : (
                        promoVillas.map((villa) => {
                            // Match exactly the Homepage card structure
                            const rawPrice = Number(villa.min_price) || 0;
                            const cover = villa.cover_image_url || "/images/natureview.jpg";
                            const galleryImages = (villa.villa_images || [])
                                .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                                .map((img) => img.url)
                                .filter(Boolean);
                            const allImages = galleryImages.length > 0 ? [cover, ...galleryImages.filter((u) => u !== cover)] : [cover];
                            const viewData = {
                                slug: villa.slug,
                                name: villa.name,
                                images: allImages,
                                features: (premiumFeaturesMap[villa.id] || []).slice(0, 4),
                                nightlyPrice: rawPrice,
                                totalPrice: rawPrice * 5,
                                dateRange: "5 Gece",
                                beds: villa.bedrooms,
                                guests: villa.max_guests,
                                bathrooms: villa.bathrooms || 0,
                                maxDiscount: 0,
                                cheapestVilla: true,
                                promotionDiscountText: villa.promotion_discount_text,
                                promotionDescription: villa.promotion_description
                            };
                            return <SharedVillaCard key={villa.id} villa={viewData} className="prms-cat-card" />;
                        })
                    )}
                </div>
            </div>
        );
    }

    // For non-villa categories, fetch from promotions table
    const { data } = await supabase
        .from("promotions")
        .select("*")
        .eq("is_active", true)
        .in("category", config.dbValues)
        .order("sort_order", { ascending: true });

    const promos = (data || []) as Promotion[];

    // Format validity dates
    function formatValidity(start: string, end: string) {
        if (!start && !end) return "";
        const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
        const s = start ? new Date(start).toLocaleDateString("tr-TR", opts) : "";
        const e = end ? new Date(end).toLocaleDateString("tr-TR", opts) : "";
        if (s && e) return `${s} – ${e}`;
        if (s) return `${s}'den itibaren`;
        return `${e}'e kadar`;
    }

    return (
        <div className="prms-page" style={{ paddingBottom: 72 }}>
            {/* ── Breadcrumb ── */}
            <div className="prms-header">
                <div
                    className="middle dm-sans"
                    style={{ color: "#85878a", fontSize: 13 }}
                >
                    <Link href="/promosyonlar">
                        <div className="middle">
                            <img
                                src="/images/hom.png"
                                style={{ marginRight: 3, height: 11 }}
                                alt=""
                            />{" "}
                            Promosyonlar
                        </div>
                    </Link>
                    <div style={{ margin: "0 12px", fontWeight: "bold" }}>&bull;</div>
                    <div>
                        <img
                            src={config.breadcrumbIcon}
                            style={{ marginRight: 3, height: 11 }}
                            alt=""
                        />{" "}
                        {config.label}
                    </div>
                </div>

                {/* ── Page Title ── */}
                <h1 className="prms-title" style={{ marginTop: 16 }}>
                    {config.label}
                </h1>
            </div>

            {/* ── Promo Cards ── */}
            <div className="prms-cat-grid">
                {promos.length === 0 ? (
                    <div style={{ textAlign: "center", padding: 60, color: "#94a3b8", width: "100%" }}>
                        Bu kategoride aktif promosyon bulunamadı.
                    </div>
                ) : (
                    promos.map((promo) => (
                        <div key={promo.id} className="prms-cat-card">
                            <Link href={promo.external_url || `/promosyonlar/${promo.slug}`}>
                                <div className="prms-cat-img-wrap">
                                    {/* Location icon */}
                                    <div className="prms-cat-icon" style={{ top: 12 }}>
                                        <img
                                            src="/images/loc.png"
                                            style={{ width: 16, objectFit: "contain" }}
                                            alt=""
                                        />
                                    </div>
                                    {/* Images icon */}
                                    <div className="prms-cat-icon" style={{ top: 48 }}>
                                        <img
                                            src="/images/ims.png"
                                            style={{ width: 20, opacity: 0.8, objectFit: "contain" }}
                                            alt=""
                                        />
                                    </div>

                                    {promo.image_url ? (
                                        <Image
                                            src={promo.image_url}
                                            alt={promo.title}
                                            fill
                                            sizes="(max-width: 700px) 100vw, (max-width: 920px) 50vw, 400px"
                                            style={{ objectFit: "cover" }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: "100%", height: "100%",
                                            background: "linear-gradient(135deg, #667eea, #764ba2)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            color: "#fff", fontSize: 48,
                                        }}>
                                            🎁
                                        </div>
                                    )}
                                </div>

                                {/* Info section */}
                                <div className="prms-cat-info">
                                    {/* Discount badge */}
                                    {promo.discount_text && (
                                        <div className="prms-cat-badge">
                                            <img
                                                src="/images/discount.png"
                                                style={{ height: 16, marginRight: 4 }}
                                                alt=""
                                            />
                                            {promo.discount_text}
                                        </div>
                                    )}

                                    {/* Title */}
                                    <div className="prms-cat-name">{promo.title}</div>

                                    {/* Description */}
                                    {promo.description && (
                                        <div className="prms-cat-desc">{promo.description}</div>
                                    )}

                                    {/* Validity */}
                                    {(promo.validity_start || promo.validity_end) && (
                                        <div className="prms-cat-validity">
                                            <div className="afacad" style={{ fontSize: 14 }}>
                                                Promosyon Geçerlilik Tarihi
                                            </div>
                                            <div style={{ fontWeight: 600 }}>
                                                {formatValidity(promo.validity_start, promo.validity_end)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
