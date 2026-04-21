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
            .order('start_date'),

        // Dolu tarihler
        supabase
            .from('villa_disabled_dates')
            .select('*')
            .eq('villa_id', villa.id)
            .order('start_date'),

        // Yorumlar
        supabase
            .from('villa_reviews')
            .select('*')
            .eq('villa_id', villa.id)
            .eq('is_approved', true)
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
        .select('id, slug, name, cover_image_url, location_label, min_price, currency, max_guests, bedrooms, beds, bathrooms, max_discount_pct, has_active_discount, is_exclusive')
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
                    .select('features!inner(label_tr, group_type)')
                    .eq('villa_id', v.id)
                    .eq('features.group_type', 'premium')
                    .limit(5),
            ]);

            const images = (imagesRes.data || []).map((img: { url: string }) => img.url);
            const features = (featuresRes.data || [])
                .map((vf: any) => {
                    const f = vf.features;
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
        .select('id, slug, name, cover_image_url, location_label, min_price, currency, max_guests, bedrooms, beds, bathrooms, max_discount_pct, has_active_discount, is_exclusive, avg_rating')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error || !villas) return [];

    const villaCards: VillaCard[] = await Promise.all(
        villas.map(async (v) => {
            const featuresRes = await supabase
                .from('villa_features')
                .select('features!inner(label_tr, group_type)')
                .eq('villa_id', v.id)
                .eq('features.group_type', 'premium')
                .limit(5);

            const features = (featuresRes.data || [])
                .map((vf: any) => {
                    const f = vf.features;
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
            const [featuresRes, categoriesRes, pricesRes, imagesRes] = await Promise.all([
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
                    .order('start_date'),
                supabase
                    .from('villa_images')
                    .select('*')
                    .eq('villa_id', villa.id)
                    .order('sort_order')
                    .limit(5),
            ]);

            const features: DbFeature[] = (featuresRes.data || [])
                .map((vf: Record<string, unknown>) => vf.features as DbFeature)
                .filter(Boolean);
            const categories: DbCategory[] = (categoriesRes.data || [])
                .map((vc: Record<string, unknown>) => vc.categories as DbCategory)
                .filter(Boolean);

            return {
                ...villa,
                images: (imagesRes.data || []) as DbVillaImage[],
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

/**
 * Belirtilen tarih aralığında müsait olmayan villa ID'lerini döner.
 * Overlap koşulu: start_date <= checkOut AND end_date >= checkIn
 */
export async function getUnavailableVillaIds(checkIn: string, checkOut: string): Promise<Set<string>> {
    const unavailableIds = new Set<string>();

    const [disabledRes, reservedRes] = await Promise.all([
        supabase
            .from('villa_disabled_dates')
            .select('villa_id')
            .lte('start_date', checkOut)
            .gte('end_date', checkIn),
        supabase
            .from('reservations')
            .select('villa_id')
            .lte('check_in_date', checkOut)
            .gte('check_out_date', checkIn)
            .not('status', 'in', '("cancelled","rejected")'),
    ]);

    (disabledRes.data || []).forEach((d: { villa_id: string }) => unavailableIds.add(d.villa_id));
    (reservedRes.data || []).forEach((r: { villa_id: string }) => unavailableIds.add(r.villa_id));

    return unavailableIds;
}

/* ═══════════════════════════════════════════════════════════
   CATEGORY QUERIES
   ═══════════════════════════════════════════════════════════ */

/**
 * Tüm aktif kategorileri getirir
 */
export async function getCategories(): Promise<DbCategory[]> {
    const { data: categories, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

    if (error || !categories) return [];

    try {
        const { data: activeVillas } = await supabase
            .from('villas')
            .select('id')
            .eq('is_published', true);

        if (activeVillas && activeVillas.length > 0) {
            const publishedVillaIds = activeVillas.map(v => v.id);
            const { data: mappings } = await supabase
                .from('villa_categories')
                .select('category_id')
                .in('villa_id', publishedVillaIds);

            if (mappings) {
                const counts: Record<string, number> = {};
                mappings.forEach(m => {
                    counts[m.category_id] = (counts[m.category_id] || 0) + 1;
                });

                return categories.map(c => ({
                    ...c,
                    villa_count: counts[c.id] || 0
                }));
            }
        } else {
            return categories.map(c => ({ ...c, villa_count: 0 }));
        }
    } catch (err) {
        console.error("Kategori sayıları hesaplanırken hata:", err);
    }

    return categories;
}

/* ═══════════════════════════════════════════════════════════
   DESTINATION QUERIES
   ═══════════════════════════════════════════════════════════ */

/**
 * Tüm aktif tatil bölgelerini getirir
 */
export async function getDestinations(): Promise<DbDestination[]> {
    const { data: destinations, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

    if (error || !destinations) return [];

    try {
        // Her destination için yayınlanmış villa sayısını UUID ile eşleştir
        const destinationIds = destinations.map(d => d.id);

        const { data: villaCounts } = await supabase
            .from('villas')
            .select('destination_id')
            .eq('is_published', true)
            .in('destination_id', destinationIds);

        if (villaCounts) {
            const counts: Record<string, number> = {};
            villaCounts.forEach(v => {
                if (v.destination_id) {
                    counts[v.destination_id] = (counts[v.destination_id] || 0) + 1;
                }
            });
            return destinations.map(d => ({
                ...d,
                villa_count: counts[d.id] || 0
            }));
        }
    } catch (err) {
        console.error("Destinasyon sayıları hesaplanırken hata:", err);
    }

    return destinations.map(d => ({ ...d, villa_count: 0 }));
}

/* ═══════════════════════════════════════════════════════════
   REVIEW QUERIES
   ═══════════════════════════════════════════════════════════ */

/**
 * Bir villanın yayınlanmış yorumlarını getirir
 */
export async function getVillaReviews(villaId: string): Promise<DbReview[]> {
    const { data, error } = await supabase
        .from('villa_reviews')
        .select('*')
        .eq('villa_id', villaId)
        .eq('is_approved', true)
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

/**
 * Slug'a göre tekil blog yazısını getirir
 */
export async function getBlogBySlug(slug: string): Promise<DbBlog | null> {
    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

    if (error || !data) return null;
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
