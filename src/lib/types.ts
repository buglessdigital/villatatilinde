/* ─── Database Types ─── */
/* Supabase tablolarına karşılık gelen TypeScript tipleri */

// ─── Villa ───
export interface DbVilla {
    id: string;
    slug: string;
    name: string;
    ref_code: string;
    destination_id: string | null;
    address: string;
    location_label: string;
    position_lat: number | null;
    position_lng: number | null;
    map_iframe_url: string;
    max_guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
    rooms: number;
    pool_width: number | null;
    pool_length: number | null;
    pool_depth: number | null;
    pool_shared: boolean;
    pool_fence: boolean;
    currency: string;
    min_price: number;
    max_price: number;
    cover_image_url: string;
    description_tr: string;
    description_en: string;
    description_html: string;
    summary_tr: string;
    summary_en: string;
    seo_title: string;
    seo_description: string;
    deposit_amount: number;
    cleaning_fee: number;
    min_nights: number;
    cleaning_fee_min_nights: number;
    min_nights_winter: number;
    check_in_time: string;
    check_out_time: string;
    commission_pct: number;
    license_no: string;
    pets_allowed: boolean;
    smoking_allowed: boolean;
    parties_allowed: boolean;
    loud_music_allowed: boolean;
    has_carbon_alarm: boolean;
    self_check_in: boolean;
    avg_rating: number;
    review_count: number;
    owner_name: string;
    owner_phone: string;
    owner_iban: string;
    owner_notes: string;
    is_published: boolean;
    is_exclusive: boolean;
    sort_order: number;
    has_active_discount: boolean;
    max_discount_pct: number;
    included_services: string[];
    // Mesafeler (metre)
    to_beach: number;
    to_restaurant: number;
    to_shop: number;
    to_centre: number;
    to_hospital: number;
    to_health_center: number;
    to_airport: number;
    // Video
    video_urls: string[];
    cancellation_policy: string;
    created_at: string;
    updated_at: string;
}

// ─── Villa Image ───
export interface DbVillaImage {
    id: string;
    villa_id: string;
    url: string;
    media_type: 'image' | 'video';
    is_cover: boolean;
    sort_order: number;
}

// ─── Villa Price Period ───
export interface DbVillaPricePeriod {
    id: string;
    villa_id: string;
    label: string;
    start_date: string;
    end_date: string;
    nightly_price: number;
    weekly_price: number | null;
    original_price: number | null;
    discount_pct: number;
    min_nights: number;
    sort_order: number;
}

// ─── Villa Disabled Date ───
export interface DbVillaDisabledDate {
    id: string;
    villa_id: string;
    start_date: string;
    end_date: string;
    block_type?: 'reserved' | 'option' | 'maintenance' | null;
    reason?: string | null;
    notes?: string | null;
}

// ─── Feature ───
export interface DbFeature {
    id: string;
    key: string;
    label_tr: string;
    label_en: string | null;
    icon_url: string | null;
    group_type: 'premium' | 'general' | 'category';
    sort_order: number;
}

// ─── Category ───
export interface DbCategory {
    id: string;
    slug: string;
    name: string;
    description: string;
    image_url: string;
    badge_text: string;
    filter_param: string;
    sort_order: number;
    is_active: boolean;
    tags: string[];
    villa_count: number;
}

// ─── Destination ───
export interface DbDestination {
    id: string;
    slug: string;
    name: string;
    location_label: string;
    description: string;
    image_url: string;
    filter_param: string;
    sort_order: number;
    is_active: boolean;
    villa_count: number;
    tags: string[];
}

// ─── Review ───
export interface DbReview {
    id: string;
    villa_id: string;
    author_name: string;
    rating: number;
    comment: string;
    nights_stayed: number;
    stay_period: string;
    is_published: boolean;
    created_at: string;
}

// ─── Villa with all relations (for detail page) ───
export interface VillaDetail extends DbVilla {
    images: DbVillaImage[];
    features: DbFeature[];
    categories: DbCategory[];
    price_periods: DbVillaPricePeriod[];
    disabled_dates: DbVillaDisabledDate[];
    reviews: DbReview[];
}

// ─── Villa card (for listing pages) ───
export interface VillaCard {
    id: string;
    slug: string;
    name: string;
    cover_image_url: string;
    location_label: string;
    min_price: number;
    max_guests: number;
    bedrooms: number;
    beds: number;
    max_discount_pct: number;
    has_active_discount: boolean;
    is_exclusive: boolean;
    features: string[];  // feature label_tr array
    images: string[];    // image URLs
}

// ─── Blog ───
export interface DbBlog {
    id: string;
    slug: string;
    title: string;
    subtitle: string | null;
    author: string;
    cover_image_url: string | null;
    mobile_image_url: string | null;
    tags: string[];
    content_html: string | null;
    read_time_min: number | null;
    blog_type?: "standard" | "modern";
    is_published: boolean;
    published_at: string | null;
    created_at: string;
}

// ─── FAQ ───
export interface DbFaq {
    id: string;
    slug: string;
    question_tr: string;
    question_en: string | null;
    answer_html_tr: string | null;
    answer_html_en: string | null;
    sort_order: number;
    is_published: boolean;
}
