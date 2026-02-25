import { supabase } from './supabase';
import type {
    DbVilla, DbVillaImage, DbVillaPricePeriod, DbVillaDisabledDate,
    DbFeature, DbCategory, DbDestination, DbReview, DbBlog, DbFaq,
    VillaDetail, VillaCard
} from './types';

/* ═══════════════════════════════════════════════════════════
   VILLA QUERIES
   ═══════════════════════════════════════════════════════════ */

/**
 * Villa detay sayfası için tüm verileri getirir
 * (villa + görseller + özellikler + kategoriler + fiyatlar + tarihler + yorumlar)
 */
export async function getVillaDetailBySlug(slug: string): Promise<VillaDetail | null> {
    // 1. Villa temel bilgileri
    const { data: villa, error: villaError } = await supabase
        .from('villas')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

    if (villaError || !villa) return null;

    // 2. Paralel sorgular
    const [imagesRes, featuresRes, categoriesRes, pricesRes, datesRes, reviewsRes] = await Promise.all([
        // Görseller
        supabase
            .from('villa_images')
            .select('*')
            .eq('villa_id', villa.id)
            .order('sort_order'),

        // Özellikler (villa_features → features JOIN)
        supabase
            .from('villa_features')
            .select('feature_id, features(*)')
            .eq('villa_id', villa.id),

        // Kategoriler (villa_categories → categories JOIN)
        supabase
            .from('villa_categories')
            .select('category_id, categories(*)')
            .eq('villa_id', villa.id),

        // Fiyat dönemleri
        supabase
            .from('villa_price_periods')
            .select('*')
            .eq('villa_id', villa.id)
            .order('sort_order'),

        // Dolu tarihler
        supabase
            .from('villa_disabled_dates')
            .select('*')
            .eq('villa_id', villa.id)
            .order('start_date'),

        // Yorumlar
        supabase
            .from('reviews')
            .select('*')
            .eq('villa_id', villa.id)
            .eq('is_published', true)
            .order('created_at', { ascending: false }),
    ]);

    // Features'ı düzleştir
    const features: DbFeature[] = (featuresRes.data || [])
        .map((vf: Record<string, unknown>) => vf.features as DbFeature)
        .filter(Boolean);

    // Categories'ı düzleştir
    const categories: DbCategory[] = (categoriesRes.data || [])
        .map((vc: Record<string, unknown>) => vc.categories as DbCategory)
        .filter(Boolean);

    return {
        ...villa,
        images: (imagesRes.data || []) as DbVillaImage[],
        features,
        categories,
        price_periods: (pricesRes.data || []) as DbVillaPricePeriod[],
        disabled_dates: (datesRes.data || []) as DbVillaDisabledDate[],
        reviews: (reviewsRes.data || []) as DbReview[],
    };
}

/**
 * Ana sayfa için öne çıkan villaları getirir (kart formatında)
 */
export async function getFeaturedVillas(limit = 8): Promise<VillaCard[]> {
    const { data: villas, error } = await supabase
        .from('villas')
        .select('id, slug, name, cover_image_url, location_label, min_price, max_guests, bedrooms, beds, max_discount_pct, has_active_discount, is_exclusive')
        .eq('is_published', true)
        .order('sort_order')
        .limit(limit);

    if (error || !villas) return [];

    // Her villa için görselleri ve özellikleri getir
    const villaCards: VillaCard[] = await Promise.all(
        villas.map(async (v) => {
            const [imagesRes, featuresRes] = await Promise.all([
                supabase
                    .from('villa_images')
                    .select('url')
                    .eq('villa_id', v.id)
                    .order('sort_order')
                    .limit(3),
                supabase
                    .from('villa_features')
                    .select('features(label_tr)')
                    .eq('villa_id', v.id)
                    .limit(3),
            ]);

            const images = (imagesRes.data || []).map((img: { url: string }) => img.url);
            const features = (featuresRes.data || [])
                .map((vf: Record<string, unknown>) => {
                    const f = vf.features as { label_tr: string } | null;
                    return f?.label_tr || '';
                })
                .filter(Boolean);

            return {
                ...v,
                images: images.length > 0 ? images : [v.cover_image_url],
                features,
            };
        })
    );

    return villaCards;
}

/**
 * En son eklenen villaları getirir ("En Son Gezilenler" bölümü)
 */
export async function getRecentVillas(limit = 6): Promise<VillaCard[]> {
    const { data: villas, error } = await supabase
        .from('villas')
        .select('id, slug, name, cover_image_url, location_label, min_price, max_guests, bedrooms, beds, max_discount_pct, has_active_discount, is_exclusive, avg_rating')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error || !villas) return [];

    const villaCards: VillaCard[] = await Promise.all(
        villas.map(async (v) => {
            const featuresRes = await supabase
                .from('villa_features')
                .select('features(label_tr)')
                .eq('villa_id', v.id)
                .limit(4);

            const features = (featuresRes.data || [])
                .map((vf: Record<string, unknown>) => {
                    const f = vf.features as { label_tr: string } | null;
                    return f?.label_tr || '';
                })
                .filter(Boolean);

            return {
                ...v,
                images: [v.cover_image_url],
                features,
            };
        })
    );

    return villaCards;
}

/**
 * Sonuçlar sayfası için tüm villaları getirir (filtreleme client-side)
 * Villa interface'ine uygun formatta döner
 */
export async function getAllVillasForSearch(): Promise<VillaDetail[]> {
    const { data: villas, error } = await supabase
        .from('villas')
        .select('*')
        .eq('is_published', true)
        .order('sort_order');

    if (error || !villas) return [];

    const results: VillaDetail[] = await Promise.all(
        villas.map(async (villa) => {
            const [featuresRes, categoriesRes, pricesRes] = await Promise.all([
                supabase
                    .from('villa_features')
                    .select('feature_id, features(*)')
                    .eq('villa_id', villa.id),
                supabase
                    .from('villa_categories')
                    .select('category_id, categories(*)')
                    .eq('villa_id', villa.id),
                supabase
                    .from('villa_price_periods')
                    .select('*')
                    .eq('villa_id', villa.id)
                    .order('sort_order'),
            ]);

            const features: DbFeature[] = (featuresRes.data || [])
                .map((vf: Record<string, unknown>) => vf.features as DbFeature)
                .filter(Boolean);
            const categories: DbCategory[] = (categoriesRes.data || [])
                .map((vc: Record<string, unknown>) => vc.categories as DbCategory)
                .filter(Boolean);

            return {
                ...villa,
                images: [],
                features,
                categories,
                price_periods: (pricesRes.data || []) as DbVillaPricePeriod[],
                disabled_dates: [],
                reviews: [],
            } as VillaDetail;
        })
    );

    return results;
}

/* ═══════════════════════════════════════════════════════════
   CATEGORY QUERIES
   ═══════════════════════════════════════════════════════════ */

/**
 * Tüm aktif kategorileri getirir
 */
export async function getCategories(): Promise<DbCategory[]> {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

    if (error || !data) return [];
    return data;
}

/* ═══════════════════════════════════════════════════════════
   DESTINATION QUERIES
   ═══════════════════════════════════════════════════════════ */

/**
 * Tüm aktif tatil bölgelerini getirir
 */
export async function getDestinations(): Promise<DbDestination[]> {
    const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

    if (error || !data) return [];
    return data;
}

/* ═══════════════════════════════════════════════════════════
   REVIEW QUERIES
   ═══════════════════════════════════════════════════════════ */

/**
 * Bir villanın yayınlanmış yorumlarını getirir
 */
export async function getVillaReviews(villaId: string): Promise<DbReview[]> {
    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('villa_id', villaId)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data;
}

/* ═══════════════════════════════════════════════════════════
   BLOG QUERIES
   ═══════════════════════════════════════════════════════════ */

/**
 * Yayınlanmış blog yazılarını getirir
 */
export async function getBlogs(): Promise<DbBlog[]> {
    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

    if (error || !data) return [];
    return data;
}

/* ═══════════════════════════════════════════════════════════
   FAQ QUERIES
   ═══════════════════════════════════════════════════════════ */

/**
 * Yayınlanmış SSS sorularını getirir
 */
export async function getFaqs(): Promise<DbFaq[]> {
    const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true });

    if (error || !data) return [];
    return data;
}
