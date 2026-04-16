"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getDestinations } from "@/lib/queries";
import { DbDestination } from "@/lib/types";
import ImageUploader from "@/components/ImageUploader";
import MultiImageUploader, { GalleryImage } from "@/components/MultiImageUploader";
import MapPicker from "@/components/MapPicker";
import AdminCalendarPicker from "@/components/AdminCalendarPicker";

interface VillaForm {
    name: string;
    slug: string;
    location_label: string;
    address: string;
    max_guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
    rooms: number;
    pool_width: number;
    pool_length: number;
    pool_depth: number;
    min_price: number;
    cover_image_url: string;
    description_tr: string;
    summary_tr: string;
    deposit_amount: number;
    cleaning_fee: number;
    min_nights: number;
    check_in_time: string;
    check_out_time: string;
    license_no: string;
    pets_allowed: boolean;
    smoking_allowed: boolean;
    parties_allowed: boolean;
    is_published: boolean;
    is_exclusive: boolean;
    is_promotional: boolean;
    promotion_discount_text: string;
    promotion_description: string;
    sort_order: number;
    owner_name: string;
    owner_phone: string;
    cancellation_policy: string;
    seo_title: string;
    seo_description: string;
    owner_iban: string;
    owner_notes: string;
    reference_code: string;
    self_checkin: boolean;
    pool_security_fence: boolean;
    cleaning_fee_min_nights: number;
    distance_center: number;
    distance_sea: number;
    distance_airport: number;
    distance_clinic: number;
    distance_hospital: number;
    distance_market: number;
    distance_restaurant: number;
    distance_public_transport: number;
    map_lat: string;
    map_lng: string;
    map_iframe_url: string;
    video_url: string;
    currency: string;
}

interface PricePeriod {
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

interface DisabledDate {
    id: string;
    villa_id: string;
    start_date: string;
    end_date: string;
    notes?: string | null;
    reason?: string | null;
}

const emptyForm: VillaForm = {
    name: "",
    slug: "",
    location_label: "",
    address: "",
    max_guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    rooms: 3,
    pool_width: 0,
    pool_length: 0,
    pool_depth: 0,
    min_price: 0,
    cover_image_url: "",
    description_tr: "",
    summary_tr: "",
    deposit_amount: 0,
    cleaning_fee: 0,
    min_nights: 1,
    check_in_time: "16:00",
    check_out_time: "10:00",
    license_no: "",
    pets_allowed: false,
    smoking_allowed: false,
    parties_allowed: false,
    is_published: false,
    is_exclusive: false,
    is_promotional: false,
    promotion_discount_text: "",
    promotion_description: "",
    sort_order: 0,
    owner_name: "",
    owner_phone: "",
    cancellation_policy: "",
    seo_title: "",
    seo_description: "",
    owner_iban: "",
    owner_notes: "",
    reference_code: "",
    self_checkin: false,
    pool_security_fence: false,
    cleaning_fee_min_nights: 1,
    distance_center: 0,
    distance_sea: 0,
    distance_airport: 0,
    distance_clinic: 0,
    distance_hospital: 0,
    distance_market: 0,
    distance_restaurant: 0,
    distance_public_transport: 0,
    map_lat: "",
    map_lng: "",
    map_iframe_url: "",
    video_url: "",
    currency: "TRY",
};

const emptyPeriod = {
    label: "",
    start_date: "",
    end_date: "",
    nightly_price: 0,
    original_price: 0,
    min_nights: 1,
    sort_order: 0,
};

export default function VillaEditPage() {
    const router = useRouter();
    const params = useParams();
    const villaId = params.id as string;
    const isNew = villaId === "yeni";

    const [form, setForm] = useState<VillaForm>(emptyForm);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(!isNew);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Fiyat Dönemleri
    const [pricePeriods, setPricePeriods] = useState<PricePeriod[]>([]);
    const [newPeriod, setNewPeriod] = useState(emptyPeriod);
    const [addingPeriod, setAddingPeriod] = useState(false);

    // Kapalı Tarihler
    const [disabledDates, setDisabledDates] = useState<DisabledDate[]>([]);
    const [newDisabled, setNewDisabled] = useState({ start_date: "", end_date: "", notes: "" });
    const [addingDisabled, setAddingDisabled] = useState(false);

    // Kategoriler ve Hizmetler
    const [allCategories, setAllCategories] = useState<{ id: string; name: string }[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    // Destinasyonlar
    const [allDestinations, setAllDestinations] = useState<DbDestination[]>([]);

    // Özellikler (Features)
    const [allFeatures, setAllFeatures] = useState<{ id: string; name: string; key: string; group_type: string }[]>([]);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

    const STANDARD_SERVICES = [
        "Su Kullanımı",
        "Elektrik Kullanımı",
        "Wi-Fi",
        "Tüpgaz Kullanımı",
        "Havuz Bakımı"
    ];
    const [includedServices, setIncludedServices] = useState<string[]>([]);
    const [customService, setCustomService] = useState("");

    // Galeri Görselleri
    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

    useEffect(() => {
        async function fetchInitialData() {
            const { data } = await supabase.from("categories").select("id, name").eq("is_active", true).order("sort_order");
            if (data) setAllCategories(data);

            const { data: featData } = await supabase.from("features").select("id, label_tr, key, group_type").order("sort_order");
            if (featData) setAllFeatures(featData.map(f => ({ id: f.id, name: f.label_tr, key: f.key, group_type: f.group_type })));

            const destData = await getDestinations();
            if (destData) setAllDestinations(destData);

            if (!isNew) {
                await loadVilla();
            }
        }
        fetchInitialData();
    }, [villaId]);

    async function loadVilla() {
        const { data, error } = await supabase
            .from("villas")
            .select("*")
            .eq("id", villaId)
            .single();

        if (error || !data) {
            setError("Villa bulunamadı");
            setLoading(false);
            return;
        }

        setForm({
            name: data.name || "",
            slug: data.slug || "",
            location_label: data.location_label || "",
            address: data.address || "",
            max_guests: data.max_guests || 4,
            bedrooms: data.bedrooms || 2,
            beds: data.beds || 2,
            bathrooms: data.bathrooms || 1,
            rooms: data.rooms || 3,
            pool_width: data.pool_width || 0,
            pool_length: data.pool_length || 0,
            pool_depth: data.pool_depth || 0,
            min_price: data.min_price || 0,
            cover_image_url: data.cover_image_url || "",
            description_tr: data.description_tr || "",
            summary_tr: data.summary_tr || "",
            deposit_amount: data.deposit_amount || 0,
            cleaning_fee: data.cleaning_fee || 0,
            min_nights: data.min_nights || 1,
            check_in_time: data.check_in_time || "16:00",
            check_out_time: data.check_out_time || "10:00",
            license_no: data.license_no || "",
            pets_allowed: data.pets_allowed || false,
            smoking_allowed: data.smoking_allowed || false,
            parties_allowed: data.parties_allowed || false,
            is_published: data.is_published || false,
            is_exclusive: data.is_exclusive || false,
            is_promotional: data.is_promotional || false,
            promotion_discount_text: data.promotion_discount_text || "",
            promotion_description: data.promotion_description || "",
            sort_order: data.sort_order || 0,
            owner_name: data.owner_name || "",
            owner_phone: data.owner_phone || "",
            cancellation_policy: data.cancellation_policy || "",
            seo_title: data.seo_title || "",
            seo_description: data.seo_description || "",
            owner_iban: data.owner_iban || "",
            owner_notes: data.owner_notes || "",
            reference_code: data.reference_code || "",
            self_checkin: data.self_checkin || false,
            pool_security_fence: data.pool_security_fence || false,
            cleaning_fee_min_nights: data.cleaning_fee_min_nights || 1,
            distance_center: data.to_centre || 0,
            distance_sea: data.to_beach || 0,
            distance_airport: data.to_airport || 0,
            distance_clinic: data.to_health_center || 0,
            distance_hospital: data.to_hospital || 0,
            distance_market: data.to_shop || 0,
            distance_restaurant: data.to_restaurant || 0,
            distance_public_transport: 0,
            map_lat: data.map_lat || "",
            map_lng: data.map_lng || "",
            map_iframe_url: data.map_iframe_url || "",
            video_url: data.video_urls && data.video_urls.length > 0 ? data.video_urls[0] : "",
            currency: data.currency || "TRY",
        });

        setIncludedServices(data.included_services || []);

        const { data: catData } = await supabase.from("villa_categories").select("category_id").eq("villa_id", villaId);
        if (catData) {
            setSelectedCategories(catData.map((c: any) => c.category_id));
        }

        const { data: vfData } = await supabase.from("villa_features").select("feature_id").eq("villa_id", villaId);
        if (vfData) {
            setSelectedFeatures(vfData.map((f: any) => f.feature_id));
        }

        await loadPricePeriods();
        await loadDisabledDates();
        await loadGalleryImages();
        setLoading(false);
    }

    async function loadGalleryImages() {
        const { data } = await supabase
            .from("villa_images")
            .select("url")
            .eq("villa_id", villaId)
            .eq("is_cover", false)
            .order("sort_order", { ascending: true });
        if (data) setGalleryImages(data);
    }

    async function loadPricePeriods() {
        const { data } = await supabase
            .from("villa_price_periods")
            .select("*")
            .eq("villa_id", villaId)
            .order("start_date");
        if (data) setPricePeriods(data);
    }

    async function loadDisabledDates() {
        const { data } = await supabase
            .from("villa_disabled_dates")
            .select("*")
            .eq("villa_id", villaId)
            .order("start_date");
        if (data) setDisabledDates(data);
    }

    async function addDisabledDate() {
        if (!newDisabled.start_date || !newDisabled.end_date) {
            setError("Başlangıç ve bitiş tarihi zorunludur.");
            return;
        }
        if (newDisabled.end_date < newDisabled.start_date) {
            setError("Bitiş tarihi başlangıç tarihinden önce olamaz.");
            return;
        }
        setAddingDisabled(true);
        setError("");
        
        const payload: Record<string, any> = {
            villa_id: villaId,
            start_date: newDisabled.start_date,
            end_date: newDisabled.end_date,
        };
        if (newDisabled.notes) payload.notes = newDisabled.notes;
        
        const { error: insertErr } = await supabase
            .from("villa_disabled_dates")
            .insert(payload);
            
        if (insertErr) {
            console.error("Tarih kapatma hatası:", insertErr);
            setError("Tarih kapatma eklenemedi: " + insertErr.message);
        } else {
            setNewDisabled({ start_date: "", end_date: "", notes: "" });
            await loadDisabledDates();
            setSuccess("Tarih aralığı başarıyla kapatıldı!");
        }
        setAddingDisabled(false);
    }

    async function deleteDisabledDate(id: string) {
        if (!confirm("Bu tarih kapatılmasını silmek istediğinizden emin misiniz?")) return;
        await supabase.from("villa_disabled_dates").delete().eq("id", id);
        setDisabledDates(prev => prev.filter(d => d.id !== id));
    }

    async function addPricePeriod() {
        if (!newPeriod.label || !newPeriod.start_date || !newPeriod.end_date || !newPeriod.nightly_price) {
            setError("Dönem adı, tarihler ve gecelik fiyat zorunludur.");
            return;
        }
        setAddingPeriod(true);
        setError("");

        const hasOriginal = newPeriod.original_price > 0 && newPeriod.original_price > newPeriod.nightly_price;
        const discountPct = hasOriginal
            ? Math.round((1 - newPeriod.nightly_price / newPeriod.original_price) * 100)
            : 0;
        const originalPrice = hasOriginal ? newPeriod.original_price : null;

        if (isNew) {
            // For new villas, store locally in state
            const localPeriod: PricePeriod = {
                id: `local-${Date.now()}`,
                villa_id: "",
                label: newPeriod.label,
                start_date: newPeriod.start_date,
                end_date: newPeriod.end_date,
                nightly_price: newPeriod.nightly_price,
                weekly_price: null,
                original_price: originalPrice,
                discount_pct: discountPct,
                min_nights: newPeriod.min_nights,
                sort_order: pricePeriods.length,
            };
            setPricePeriods(prev => [...prev, localPeriod]);
            setNewPeriod(emptyPeriod);
            setSuccess("Fiyat dönemi listeye eklendi. Villa kaydedildiğinde veritabanına yazılacak.");
        } else {
            const { error: insertErr } = await supabase.from("villa_price_periods").insert({
                villa_id: villaId,
                label: newPeriod.label,
                start_date: newPeriod.start_date,
                end_date: newPeriod.end_date,
                nightly_price: newPeriod.nightly_price,
                original_price: originalPrice,
                discount_pct: discountPct,
                min_nights: newPeriod.min_nights,
                sort_order: pricePeriods.length,
            });

            if (insertErr) {
                setError("Dönem eklenemedi: " + insertErr.message);
            } else {
                setNewPeriod(emptyPeriod);
                await loadPricePeriods();
                await recalcMinMaxPrice();
                setSuccess("Fiyat dönemi başarıyla eklendi!");
            }
        }
        setAddingPeriod(false);
    }

    async function deletePricePeriod(id: string, label: string) {
        if (!confirm(`"${label}" dönemini silmek istediğinizden emin misiniz?`)) return;
        if (isNew || id.startsWith("local-")) {
            // For new villas, just remove from state
            setPricePeriods(prev => prev.filter(p => p.id !== id));
        } else {
            await supabase.from("villa_price_periods").delete().eq("id", id);
            setPricePeriods((prev) => prev.filter((p) => p.id !== id));
            await recalcMinMaxPrice();
        }
    }

    async function updatePricePeriodInline(id: string, field: keyof PricePeriod, value: any) {
        // Update local state immediately for optimistic UI
        setPricePeriods((prev) => 
            prev.map((p) => p.id === id ? { ...p, [field]: value } : p)
        );

        if (!isNew && !id.startsWith("local-")) {
            // Update db async without blocking
            const { error } = await supabase.from("villa_price_periods").update({ [field]: value }).eq("id", id);
            if (error) {
                alert("Dönem güncellenemedi: " + error.message);
                return;
            }
            if (field === "nightly_price") {
                await recalcMinMaxPrice();
            }
        }
    }

    async function recalcMinMaxPrice() {
        const { data } = await supabase
            .from("villa_price_periods")
            .select("nightly_price")
            .eq("villa_id", villaId);

        if (data && data.length > 0) {
            const prices = data.map((p: { nightly_price: number }) => Number(p.nightly_price));
            const minP = Math.min(...prices);
            await supabase.from("villas").update({ min_price: minP }).eq("id", villaId);
            setForm((prev) => ({ ...prev, min_price: minP }));
        } else {
            await supabase.from("villas").update({ min_price: 0 }).eq("id", villaId);
            setForm((prev) => ({ ...prev, min_price: 0 }));
        }
    }

    function updateField(field: keyof VillaForm, value: string | number | boolean) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    // Slug otomatik oluştur
    function generateSlug(name: string) {
        return name
            .toLowerCase()
            .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
            .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    }

    async function handleSave() {
        setSaving(true);
        setError("");
        setSuccess("");

        if (!form.name.trim()) {
            setError("Villa adı zorunludur");
            setSaving(false);
            return;
        }

        const slug = form.slug || generateSlug(form.name);

        // Sayısal değerleri güvenli hale getir (NUMERIC(5,2) max 999.99)
        const safeNumeric52 = (v: number) => Math.min(Math.max(Number(v) || 0, 0), 999.99);
        const safeNumeric122 = (v: number) => Math.min(Math.max(Number(v) || 0, 0), 9999999999.99);
        const safeInt = (v: number) => Math.max(Math.floor(Number(v) || 0), 0);

        // Sadece veritabanında var olan alanları gönder
        // (is_promotional, promotion_discount_text, promotion_description DB'de YOK)
        const payload: Record<string, unknown> = {
            slug,
            name: form.name,
            location_label: form.location_label,
            address: form.address,
            max_guests: safeInt(form.max_guests),
            bedrooms: safeInt(form.bedrooms),
            beds: safeInt(form.beds),
            bathrooms: safeInt(form.bathrooms),
            rooms: safeInt(form.rooms),
            pool_width: safeNumeric52(form.pool_width),
            pool_length: safeNumeric52(form.pool_length),
            pool_depth: safeNumeric52(form.pool_depth),
            min_price: safeNumeric122(form.min_price),
            cover_image_url: form.cover_image_url,
            description_tr: form.description_tr,
            description_html: form.description_tr ? form.description_tr.replace(/\n/g, '<br />') : "",
            summary_tr: form.summary_tr,
            deposit_amount: safeNumeric122(form.deposit_amount),
            cleaning_fee: safeNumeric122(form.cleaning_fee),
            min_nights: safeInt(form.min_nights),
            check_in_time: form.check_in_time,
            check_out_time: form.check_out_time,
            license_no: form.license_no,
            pets_allowed: form.pets_allowed,
            smoking_allowed: form.smoking_allowed,
            parties_allowed: form.parties_allowed,
            is_published: form.is_published,
            is_exclusive: form.is_exclusive,
            sort_order: safeInt(form.sort_order),
            owner_name: form.owner_name,
            owner_phone: form.owner_phone,
            cancellation_policy: form.cancellation_policy,
            seo_title: form.seo_title,
            seo_description: form.seo_description,
            owner_iban: form.owner_iban,
            owner_notes: form.owner_notes,
            reference_code: form.reference_code,
            self_checkin: form.self_checkin,
            pool_security_fence: form.pool_security_fence,
            cleaning_fee_min_nights: safeInt(form.cleaning_fee_min_nights),
            to_centre: safeInt(form.distance_center),
            to_beach: safeInt(form.distance_sea),
            to_airport: safeInt(form.distance_airport),
            to_health_center: safeInt(form.distance_clinic),
            to_hospital: safeInt(form.distance_hospital),
            to_shop: safeInt(form.distance_market),
            to_restaurant: safeInt(form.distance_restaurant),
            map_lat: form.map_lat,
            map_lng: form.map_lng,
            map_iframe_url: form.map_iframe_url,
            included_services: includedServices,
            video_urls: form.video_url ? [form.video_url] : [],
            currency: form.currency,
        };

        if (isNew) {
            const { data: newVilla, error } = await supabase.from("villas").insert(payload).select("id").single();
            if (error || !newVilla) {
                setError("Villa eklenemedi: " + error?.message);
            } else {
                await saveGalleryImages(newVilla.id);
                await saveCategories(newVilla.id);
                await saveFeatures(newVilla.id);
                // Save price periods that were added locally
                if (pricePeriods.length > 0) {
                    const periodInserts = pricePeriods.map((p, i) => ({
                        villa_id: newVilla.id,
                        label: p.label,
                        start_date: p.start_date,
                        end_date: p.end_date,
                        nightly_price: p.nightly_price,
                        min_nights: p.min_nights,
                        sort_order: i,
                    }));
                    await supabase.from("villa_price_periods").insert(periodInserts);
                    // Recalculate min_price
                    const prices = pricePeriods.map(p => Number(p.nightly_price));
                    const minP = Math.min(...prices);
                    await supabase.from("villas").update({ min_price: minP }).eq("id", newVilla.id);
                }
                setSuccess("Villa başarıyla eklendi!");
                setTimeout(() => router.push("/admin/villalar"), 1000);
            }
        } else {
            const { error } = await supabase.from("villas").update(payload).eq("id", villaId);
            if (error) {
                setError("Villa güncellenemedi: " + error.message);
            } else {
                await saveGalleryImages(villaId);
                await saveCategories(villaId);
                await saveFeatures(villaId);
                setSuccess("Villa başarıyla güncellendi!");
            }
        }

        setSaving(false);
    }

    async function saveGalleryImages(vId: string) {
        // Delete all old gallery images
        await supabase
            .from("villa_images")
            .delete()
            .eq("villa_id", vId)
            .eq("is_cover", false);

        // Insert new gallery images
        if (galleryImages.length > 0) {
            const inserts = galleryImages.map((img, i) => ({
                villa_id: vId,
                url: img.url,
                media_type: "image",
                is_cover: false,
                sort_order: i
            }));
            await supabase.from("villa_images").insert(inserts);
        }
    }

    async function saveCategories(vId: string) {
        await supabase.from("villa_categories").delete().eq("villa_id", vId);
        if (selectedCategories.length > 0) {
            const catInserts = selectedCategories.map(cId => ({
                villa_id: vId,
                category_id: cId
            }));
            await supabase.from("villa_categories").insert(catInserts);
        }
    }

    async function saveFeatures(vId: string) {
        await supabase.from("villa_features").delete().eq("villa_id", vId);
        if (selectedFeatures.length > 0) {
            const inserts = selectedFeatures.map(fId => ({
                villa_id: vId,
                feature_id: fId
            }));
            await supabase.from("villa_features").insert(inserts);
        }
    }

    if (loading) {
        return <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Yükleniyor...</div>;
    }

    return (
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <button
                        onClick={() => router.push("/admin/villalar")}
                        style={{ background: "none", border: "none", color: "#64748b", fontSize: 13, cursor: "pointer", marginBottom: 8 }}
                    >
                        ← Villalar listesine dön
                    </button>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e293b", fontFamily: "'Poppins', sans-serif" }}>
                        {isNew ? "Yeni Villa Ekle" : `${form.name} Düzenle`}
                    </h1>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                        padding: "10px 28px",
                        borderRadius: 10,
                        background: saving ? "#94a3b8" : "linear-gradient(135deg, #50b0f0, #3b82f6)",
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 600,
                        border: "none",
                        cursor: saving ? "not-allowed" : "pointer",
                    }}
                >
                    {saving ? "Kaydediliyor..." : "Kaydet"}
                </button>
            </div>

            {/* Messages */}
            {error && (
                <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", color: "#dc2626", fontSize: 13, marginBottom: 16 }}>
                    ⚠️ {error}
                </div>
            )}
            {success && (
                <div style={{ background: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 16px", color: "#16a34a", fontSize: 13, marginBottom: 16 }}>
                    ✅ {success}
                </div>
            )}

            {/* ── SEO Bilgileri ── */}
            <Section title="SEO Bilgileri">
                <FormRow>
                    <FormField label="Sayfa Başlık (SEO Title)" width="100%">
                        <input style={inputStyle} value={form.seo_title} onChange={(e) => updateField("seo_title", e.target.value)} placeholder="Google'da görünecek sayfa başlığı" />
                    </FormField>
                </FormRow>
                <FormRow>
                    <FormField label="Sayfa Açıklaması (SEO Description)" width="100%">
                        <textarea style={{...inputStyle, height: 60, resize: "vertical"}} value={form.seo_description} onChange={(e) => updateField("seo_description", e.target.value)} placeholder="Google'da görünecek sayfa açıklaması" />
                    </FormField>
                </FormRow>
            </Section>

            {/* ── Temel Bilgiler ── */}
            <Section title="Temel Bilgiler">
                <FormRow>
                    <FormField label="Belge No" width="50%">
                        <input style={inputStyle} value={form.license_no} onChange={(e) => updateField("license_no", e.target.value)} placeholder="Örn: 18069" />
                    </FormField>
                    <FormField label="Referans Kodu" width="50%">
                        <input style={inputStyle} value={form.reference_code} onChange={(e) => updateField("reference_code", e.target.value)} placeholder="Villa Referansı (Örn: V-102)" />
                    </FormField>
                </FormRow>
                <FormRow>
                    <FormField label="Villa Adı *" width="60%">
                        <input
                            style={inputStyle}
                            value={form.name}
                            onChange={(e) => {
                                updateField("name", e.target.value);
                                if (isNew) updateField("slug", generateSlug(e.target.value));
                            }}
                            placeholder="Villa Doğa"
                        />
                    </FormField>
                    <FormField label="Slug (URL)" width="40%">
                        <input
                            style={inputStyle}
                            value={form.slug}
                            onChange={(e) => updateField("slug", e.target.value)}
                            placeholder="villa-doga"
                        />
                    </FormField>
                </FormRow>
                <FormRow>
                    <FormField label="Destinasyon (Tatil Yeri)" width="50%">
                        <select
                            style={inputStyle}
                            value={form.location_label}
                            onChange={(e) => updateField("location_label", e.target.value)}
                        >
                            <option value="">-- Destinasyon Seçin --</option>
                            {allDestinations.map(dest => (
                                <option key={dest.id} value={dest.name}>
                                    {dest.name}
                                </option>
                            ))}
                        </select>
                    </FormField>
                    <FormField label="Adres" width="50%">
                        <input
                            style={inputStyle}
                            value={form.address}
                            onChange={(e) => updateField("address", e.target.value)}
                            placeholder="Tam adres"
                        />
                    </FormField>
                </FormRow>
                <FormRow>
                    <FormField label="" width="100%">
                        <ImageUploader
                            value={form.cover_image_url}
                            onChange={(url) => updateField("cover_image_url", url)}
                            bucket="images"
                            folder="villas"
                            label="Kapak Görseli"
                            addWatermark={true}
                        />
                    </FormField>
                </FormRow>
                <FormRow>
                    <FormField label="Tanıtım Videosu URL (YouTube, Vimeo vb.)" width="100%">
                        <input
                            style={inputStyle}
                            value={form.video_url}
                            onChange={(e) => updateField("video_url", e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                        />
                    </FormField>
                </FormRow>
                <FormRow>
                    <FormField label="" width="100%">
                        <div style={{ marginTop: 24, padding: "16px", background: "#f8fafc", borderRadius: 12, border: "1px dashed #cbd5e1" }}>
                            <MultiImageUploader
                                images={galleryImages}
                                onChange={setGalleryImages}
                                bucket="images"
                                folder="villas"
                                label="Diğer Görseller (Galeri)"
                                addWatermark={true}
                            />
                        </div>
                    </FormField>
                </FormRow>
            </Section>

            {/* ── Kapasite ── */}
            <Section title="Kapasite">
                <FormRow>
                    <FormField label="Maks. Misafir" width="25%">
                        <input type="number" style={inputStyle} value={form.max_guests} onChange={(e) => updateField("max_guests", +e.target.value)} />
                    </FormField>
                    <FormField label="Yatak Odası" width="25%">
                        <input type="number" style={inputStyle} value={form.bedrooms} onChange={(e) => updateField("bedrooms", +e.target.value)} />
                    </FormField>
                    <FormField label="Yatak" width="25%">
                        <input type="number" style={inputStyle} value={form.beds} onChange={(e) => updateField("beds", +e.target.value)} />
                    </FormField>
                    <FormField label="Banyo" width="25%">
                        <input type="number" style={inputStyle} value={form.bathrooms} onChange={(e) => updateField("bathrooms", +e.target.value)} />
                    </FormField>
                </FormRow>
            </Section>

            {/* ── Havuz ── */}
            <Section title="Havuz Bilgileri">
                <FormRow>
                    <FormField label="Genişlik (m)" width="33%">
                        <input type="number" style={inputStyle} value={form.pool_width} onChange={(e) => updateField("pool_width", +e.target.value)} />
                    </FormField>
                    <FormField label="Uzunluk (m)" width="33%">
                        <input type="number" style={inputStyle} value={form.pool_length} onChange={(e) => updateField("pool_length", +e.target.value)} />
                    </FormField>
                    <FormField label="Derinlik (m)" width="33%">
                        <input type="number" style={inputStyle} value={form.pool_depth} onChange={(e) => updateField("pool_depth", +e.target.value)} />
                    </FormField>
                </FormRow>
                <div style={{ marginTop: 16 }}>
                    <Checkbox label="Havuz etrafında güvenlik çiti var" checked={form.pool_security_fence} onChange={(v) => updateField("pool_security_fence", v)} />
                </div>
            </Section>

            {/* ── Fiyatlandırma ── */}
            <Section title="Fiyatlandırma">
                <FormRow>
                    <FormField label="Para Birimi" width="20%">
                        <select style={inputStyle} value={form.currency} onChange={(e) => updateField("currency", e.target.value)}>
                            <option value="TRY">TRY (₺)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                        </select>
                    </FormField>
                    <FormField label={`Min. Fiyat (${form.currency}/Gece)`} width="40%">
                        <input type="number" style={inputStyle} value={form.min_price} onChange={(e) => updateField("min_price", +e.target.value)} />
                    </FormField>
                    <FormField label={`Depozito (${form.currency})`} width="40%">
                        <input type="number" style={inputStyle} value={form.deposit_amount} onChange={(e) => updateField("deposit_amount", +e.target.value)} />
                    </FormField>
                </FormRow>
                <FormRow>
                    <FormField label={`Temizlik Ücreti (${form.currency})`} width="33%">
                        <input type="number" style={inputStyle} value={form.cleaning_fee} onChange={(e) => updateField("cleaning_fee", +e.target.value)} />
                    </FormField>
                    <FormField label="Min. Gece" width="33%">
                        <input type="number" style={inputStyle} value={form.min_nights} onChange={(e) => updateField("min_nights", +e.target.value)} />
                    </FormField>
                    <FormField label="Temizlik İçin Min. Gece Sınırı" width="33%">
                        <input type="number" style={inputStyle} value={form.cleaning_fee_min_nights} onChange={(e) => updateField("cleaning_fee_min_nights", +e.target.value)} title="Şu kadar geceden az tutulursa temizlik ücreti alınır" />
                    </FormField>
                </FormRow>
            </Section>

            {/* ── Giriş/Çıkış ── */}
            <Section title="Giriş / Çıkış">
                <FormRow>
                    <FormField label="Giriş Saati" width="50%">
                        <input style={inputStyle} value={form.check_in_time} onChange={(e) => updateField("check_in_time", e.target.value)} placeholder="16:00" />
                    </FormField>
                    <FormField label="Çıkış Saati" width="50%">
                        <input style={inputStyle} value={form.check_out_time} onChange={(e) => updateField("check_out_time", e.target.value)} placeholder="10:00" />
                    </FormField>
                </FormRow>
                <div style={{ marginTop: 16 }}>
                    <Checkbox label="Kendi Başına Giriş (Anahtar kutusu vb.)" checked={form.self_checkin} onChange={(v) => updateField("self_checkin", v)} />
                </div>
            </Section>

            {/* ── Açıklama ── */}
            <Section title="Açıklama">
                <FormField label="Kısa Özet" width="100%">
                    <textarea
                        style={{ ...inputStyle, height: 80, resize: "vertical" }}
                        value={form.summary_tr}
                        onChange={(e) => updateField("summary_tr", e.target.value)}
                        placeholder="Villa hakkında kısa açıklama..."
                    />
                </FormField>
                <FormField label="Detaylı Açıklama (TR)" width="100%">
                    <textarea
                        style={{ ...inputStyle, height: 180, resize: "vertical" }}
                        value={form.description_tr}
                        onChange={(e) => updateField("description_tr", e.target.value)}
                        placeholder="Villa hakkında detaylı açıklama..."
                    />
                </FormField>
            </Section>

            {/* ── Kategoriler ve Hizmetler ── */}
            <Section title="Kategoriler ve Dahil Hizmetler">
                <FormRow>
                    <FormField label="Kategoriler (Birden fazla seçilebilir)" width="50%">
                        <div style={{ display: "flex", flexDirection: "column", gap: 10, background: "#f8fafc", padding: 16, borderRadius: 10, border: "1px solid #e2e8f0" }}>
                            {allCategories.map(cat => (
                                <Checkbox
                                    key={cat.id}
                                    label={cat.name}
                                    checked={selectedCategories.includes(cat.id)}
                                    onChange={(checked) => {
                                        if (checked) {
                                            setSelectedCategories(prev => [...prev, cat.id]);
                                        } else {
                                            setSelectedCategories(prev => prev.filter(c => c !== cat.id));
                                        }
                                    }}
                                />
                            ))}
                            {allCategories.length === 0 && <span style={{ fontSize: 13, color: "#94a3b8" }}>Henüz hiç kategori eklenmemiş.</span>}
                        </div>
                    </FormField>
                    <FormField label="Fiyata Dahil Olan Hizmetler" width="50%">
                        <div style={{ display: "flex", flexDirection: "column", gap: 10, background: "#f8fafc", padding: 16, borderRadius: 10, border: "1px solid #e2e8f0", minHeight: 150 }}>
                            {STANDARD_SERVICES.map(srv => (
                                <Checkbox
                                    key={srv}
                                    label={srv}
                                    checked={includedServices.includes(srv)}
                                    onChange={(checked) => {
                                        if (checked) {
                                            setIncludedServices(prev => [...prev, srv]);
                                        } else {
                                            setIncludedServices(prev => prev.filter(s => s !== srv));
                                        }
                                    }}
                                />
                            ))}
                            <div style={{ marginTop: 8, paddingTop: 12, borderTop: "1px dashed #cbd5e1" }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>Ekstra Hizmet Seçili (Admin)</div>
                                {includedServices.filter(s => !STANDARD_SERVICES.includes(s)).map(customSrv => (
                                    <div key={customSrv} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", padding: "6px 12px", borderRadius: 6, border: "1px solid #e2e8f0", marginBottom: 6 }}>
                                        <span style={{ fontSize: 13, color: "#1e293b" }}>{customSrv}</span>
                                        <button onClick={() => setIncludedServices(prev => prev.filter(s => s !== customSrv))} style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer" }}>✕</button>
                                    </div>
                                ))}
                                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                                    <input
                                        type="text"
                                        style={{ ...inputStyle, padding: "8px 12px" }}
                                        placeholder="Kendi hizmetinizi yazın..."
                                        value={customService}
                                        onChange={e => setCustomService(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === "Enter" && customService.trim()) {
                                                e.preventDefault();
                                                const val = customService.trim();
                                                if (!includedServices.includes(val)) {
                                                    setIncludedServices(prev => [...prev, val]);
                                                }
                                                setCustomService("");
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        style={{ padding: "8px 14px", background: "#0f766e", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}
                                        onClick={() => {
                                            const val = customService.trim();
                                            if (val && !includedServices.includes(val)) {
                                                setIncludedServices(prev => [...prev, val]);
                                                setCustomService("");
                                            }
                                        }}
                                    >Ekle</button>
                                </div>
                            </div>
                        </div>
                    </FormField>
                </FormRow>
            </Section>

            {/* ── Villa Özellikleri ── */}
            <Section title="Villa Özellikleri (Features)">
                {['general', 'premium', 'category'].map(group => {
                    const groupFeatures = allFeatures.filter(f => f.group_type === group);
                    if (groupFeatures.length === 0) return null;
                    return (
                        <div key={group} style={{ marginBottom: 20 }}>
                            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 10, textTransform: "uppercase" }}>
                                {group === 'general' ? 'Genel Özellikler' : group === 'premium' ? 'Öne Çıkan Özellikler' : 'Kategori Özellikleri'}
                            </h3>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, background: "#f8fafc", padding: 16, borderRadius: 10, border: "1px solid #e2e8f0" }}>
                                {groupFeatures.map(feat => (
                                    <div key={feat.id} style={{ width: "calc(33% - 10px)", minWidth: 150 }}>
                                        <Checkbox
                                            label={feat.name}
                                            checked={selectedFeatures.includes(feat.id)}
                                            onChange={(checked) => {
                                                if (checked) {
                                                    setSelectedFeatures(prev => [...prev, feat.id]);
                                                } else {
                                                    setSelectedFeatures(prev => prev.filter(id => id !== feat.id));
                                                }
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </Section>

            {/* ── Fiyat Dönemleri ── */}
            <Section title="📅 Fiyat Dönemleri (Yıllık Takvim)">
                    <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>
                        Önümüzdeki 1 yılın fiyat dönemlerini buradan yönetebilirsiniz. Her dönem için tarih aralığı ve gecelik fiyat belirleyin.
                    </p>

                    {/* Mevcut dönemler tablosu */}
                    {pricePeriods.length > 0 ? (
                        <div style={{ overflowX: "auto", marginBottom: 20 }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                                <thead>
                                    <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                                        <th style={periodThStyle}>Dönem Adı</th>
                                        <th style={periodThStyle}>Başlangıç</th>
                                        <th style={periodThStyle}>Bitiş</th>
                                        <th style={periodThStyle}>Gecelik ₺</th>
                                        <th style={periodThStyle}>Min. Gece</th>
                                        <th style={periodThStyle}>İşlem</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pricePeriods.map((p) => {
                                        const start = new Date(p.start_date);
                                        const end = new Date(p.end_date);
                                        const now = new Date();
                                        const isActive = now >= start && now <= end;
                                        const isPast = now > end;

                                        return (
                                            <tr
                                                key={p.id}
                                                style={{
                                                    borderBottom: "1px solid #f1f5f9",
                                                    background: isActive ? "#f0fdf4" : isPast ? "#fafafa" : "#fff",
                                                    opacity: isPast ? 0.6 : 1,
                                                }}
                                            >
                                                <td style={periodTdStyle}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                        {isActive && (
                                                            <span style={{
                                                                width: 8, height: 8, borderRadius: "50%",
                                                                background: "#22c55e", display: "inline-block",
                                                            }} />
                                                        )}
                                                        <span style={{ fontWeight: 600, color: "#1e293b" }}>
                                                            <EditableCell value={p.label} onSave={(val) => updatePricePeriodInline(p.id, "label", val)} />
                                                        </span>
                                                    </div>
                                                </td>
                                                <td style={periodTdStyle}>
                                                    <EditableCell value={p.start_date} type="date" isDate onSave={(val) => updatePricePeriodInline(p.id, "start_date", val)} />
                                                </td>
                                                <td style={periodTdStyle}>
                                                    <EditableCell value={p.end_date} type="date" isDate onSave={(val) => updatePricePeriodInline(p.id, "end_date", val)} />
                                                </td>
                                                <td style={{ ...periodTdStyle, fontWeight: 700, color: "#0f766e" }}>
                                                    <EditableCell prefix={form.currency === 'USD' ? '$' : form.currency === 'EUR' ? '€' : form.currency === 'GBP' ? '£' : '₺'} value={p.nightly_price} type="number" onSave={(val) => updatePricePeriodInline(p.id, "nightly_price", val)} />
                                                </td>
                                                <td style={periodTdStyle}>
                                                    <EditableCell value={p.min_nights} type="number" onSave={(val) => updatePricePeriodInline(p.id, "min_nights", val)} />
                                                </td>
                                                <td style={periodTdStyle}>
                                                    <button
                                                        onClick={() => deletePricePeriod(p.id, p.label)}
                                                        style={{
                                                            padding: "4px 10px", borderRadius: 6,
                                                            border: "1px solid #fee2e2", background: "#fff",
                                                            color: "#dc2626", fontSize: 12, fontWeight: 500,
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        🗑 Sil
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{
                            textAlign: "center", padding: "24px 16px", color: "#94a3b8",
                            fontSize: 14, background: "#f8fafc", borderRadius: 10, marginBottom: 20,
                        }}>
                            Henüz fiyat dönemi eklenmemiş. Aşağıdaki formu kullanarak yeni dönem ekleyebilirsiniz.
                        </div>
                    )}

                    {/* Yeni dönem ekleme formu */}
                    <div style={{
                        background: "#f8fafc", borderRadius: 12, padding: "16px 20px",
                        border: "1px dashed #cbd5e1",
                    }}>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#334155", marginBottom: 16 }}>
                            + Yeni Fiyat Dönemi Ekle
                        </h3>

                        {/* Takvim ile tarih seçimi */}
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 8 }}>
                                Tarih Aralığı Seçin *
                            </div>
                            <AdminCalendarPicker
                                startDate={newPeriod.start_date}
                                endDate={newPeriod.end_date}
                                onChange={(start, end) => {
                                    // Auto-generate a Turkish period label from the date range
                                    const generateLabel = (s: string, e: string): string => {
                                        if (!s || !e) return "";
                                        const TR_MONTHS = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
                                        const startD = new Date(s);
                                        const endD = new Date(e);
                                        const sDay = startD.getUTCDate();
                                        const sMon = TR_MONTHS[startD.getUTCMonth()];
                                        const sYear = startD.getUTCFullYear();
                                        const eDay = endD.getUTCDate();
                                        const eMon = TR_MONTHS[endD.getUTCMonth()];
                                        const eYear = endD.getUTCFullYear();
                                        if (startD.getUTCMonth() === endD.getUTCMonth() && sYear === eYear) {
                                            // Same month: "1-31 Mayıs 2026"
                                            return `${sDay}-${eDay} ${sMon} ${sYear}`;
                                        } else if (sYear === eYear) {
                                            // Different month, same year: "1 Haziran - 15 Temmuz 2026"
                                            return `${sDay} ${sMon} - ${eDay} ${eMon} ${sYear}`;
                                        } else {
                                            // Different years
                                            return `${sDay} ${sMon} ${sYear} - ${eDay} ${eMon} ${eYear}`;
                                        }
                                    };
                                    const autoLabel = generateLabel(start, end);
                                    setNewPeriod(p => ({
                                        ...p,
                                        start_date: start,
                                        end_date: end,
                                        label: autoLabel || p.label,
                                    }));
                                }}
                                existingPeriods={pricePeriods.map(p => ({
                                    start_date: p.start_date,
                                    end_date: p.end_date,
                                    label: p.label,
                                }))}
                            />
                        </div>

                        {/* Diğer alanlar */}
                        <FormRow>
                            <FormField label="Dönem Adı *" width="25%">
                                <input
                                    style={inputStyle}
                                    value={newPeriod.label}
                                    onChange={(e) => setNewPeriod((p) => ({ ...p, label: e.target.value }))}
                                    placeholder="ör: Yaz Sezonu 2026"
                                />
                            </FormField>
                            <FormField label="Para Birimi" width="15%">
                                <select
                                    style={inputStyle}
                                    value={form.currency}
                                    onChange={(e) => updateField("currency", e.target.value)}
                                >
                                    <option value="TRY">TRY (₺)</option>
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                </select>
                            </FormField>
                            <FormField label={`Gecelik Fiyat (${form.currency}) *`} width="20%">
                                <input
                                    type="number"
                                    style={inputStyle}
                                    value={newPeriod.nightly_price || ""}
                                    onChange={(e) => setNewPeriod((p) => ({ ...p, nightly_price: +e.target.value }))}
                                    placeholder="5000"
                                />
                            </FormField>
                            <FormField label={`İndirimden Önceki Fiyat (${form.currency})`} width="20%">
                                <input
                                    type="number"
                                    style={inputStyle}
                                    value={newPeriod.original_price || ""}
                                    onChange={(e) => setNewPeriod((p) => ({ ...p, original_price: +e.target.value }))}
                                    placeholder="İndirim yoksa boş bırakın"
                                />
                            </FormField>
                            <FormField label="Min. Gece" width="15%">
                                <input
                                    type="number"
                                    style={inputStyle}
                                    value={newPeriod.min_nights}
                                    onChange={(e) => setNewPeriod((p) => ({ ...p, min_nights: +e.target.value }))}
                                />
                            </FormField>
                        </FormRow>

                        {/* İndirim önizlemesi */}
                        {newPeriod.original_price > 0 && newPeriod.nightly_price > 0 && newPeriod.original_price > newPeriod.nightly_price && (
                            <div style={{
                                display: "inline-flex", alignItems: "center", gap: 6,
                                marginTop: 4, marginBottom: 8, padding: "4px 12px",
                                borderRadius: 20, background: "#dcfce7", border: "1px solid #86efac",
                                fontSize: 12, color: "#15803d", fontWeight: 600,
                            }}>
                                ✅ %{Math.round((1 - newPeriod.nightly_price / newPeriod.original_price) * 100)} indirim uygulanacak
                            </div>
                        )}

                        <div style={{ marginTop: 12 }}>
                            <button
                                onClick={addPricePeriod}
                                disabled={addingPeriod}
                                style={{
                                    padding: "10px 24px", borderRadius: 10,
                                    background: addingPeriod ? "#94a3b8" : "linear-gradient(135deg, #10b981, #059669)",
                                    color: "#fff", fontSize: 14, fontWeight: 600,
                                    border: "none", cursor: addingPeriod ? "not-allowed" : "pointer",
                                    transition: "all 0.2s",
                                }}
                            >
                                {addingPeriod ? "Ekleniyor..." : "✅ Dönem Ekle"}
                            </button>
                        </div>
                    </div>
                </Section>

            {/* ── Kapalı Tarihler ── */}
            {!isNew && (
            <Section title="🚫 Tarih Kapatma (Uygun Olmayan Günler)">
                <p style={{ color: "#64748b", fontSize: 13, marginBottom: 16 }}>
                    Rezervasyona kapatılmasını istediğiniz tarih aralıklarını buradan belirleyin. Bu tarihler sitede seçilemez olarak görünecektir.
                </p>

                {/* Mevcut kapalı tarihler */}
                {disabledDates.length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                            <thead>
                                <tr style={{ background: "#f8fafc" }}>
                                    <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#475569", borderBottom: "1px solid #e2e8f0" }}>Başlangıç</th>
                                    <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#475569", borderBottom: "1px solid #e2e8f0" }}>Bitiş</th>
                                    <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#475569", borderBottom: "1px solid #e2e8f0" }}>Sebep</th>
                                    <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#475569", borderBottom: "1px solid #e2e8f0" }}>Gün</th>
                                    <th style={{ padding: "10px 12px", borderBottom: "1px solid #e2e8f0" }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {disabledDates.map((d, i) => {
                                    const days = Math.ceil((new Date(d.end_date).getTime() - new Date(d.start_date).getTime()) / 86400000) + 1;
                                    return (
                                        <tr key={d.id} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                                            <td style={{ padding: "10px 12px", color: "#dc2626", fontWeight: 600 }}>{d.start_date}</td>
                                            <td style={{ padding: "10px 12px", color: "#dc2626", fontWeight: 600 }}>{d.end_date}</td>
                                            <td style={{ padding: "10px 12px", color: "#64748b" }}>{d.notes || d.reason || <span style={{ color: "#cbd5e1" }}>—</span>}</td>
                                            <td style={{ padding: "10px 12px", color: "#64748b" }}>{days} gün</td>
                                            <td style={{ padding: "10px 12px", textAlign: "right" }}>
                                                <button
                                                    onClick={() => deleteDisabledDate(d.id)}
                                                    style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #fee2e2", background: "#fff", color: "#dc2626", fontSize: 12, cursor: "pointer" }}
                                                >
                                                    Sil
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
                {disabledDates.length === 0 && (
                    <div style={{ padding: "16px", textAlign: "center", color: "#94a3b8", background: "#f8fafc", borderRadius: 8, marginBottom: 20, fontSize: 13 }}>
                        Henüz kapatılan tarih yok
                    </div>
                )}

                {/* Yeni tarih ekleme formu */}
                <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 12, padding: 20 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#c2410c", marginBottom: 16 }}>
                        🔒 Yeni Tarih Kapat
                    </h3>

                    {/* Takvim ile tarih seçimi */}
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 8 }}>
                            Kapatılacak Tarih Aralığı *
                        </div>
                        <AdminCalendarPicker
                            startDate={newDisabled.start_date}
                            endDate={newDisabled.end_date}
                            variant="blocked"
                            onChange={(start, end) => setNewDisabled(p => ({ ...p, start_date: start, end_date: end }))}
                            existingPeriods={[
                                ...pricePeriods.map(p => ({ start_date: p.start_date, end_date: p.end_date, label: p.label })),
                                ...disabledDates.map(d => ({ start_date: d.start_date, end_date: d.end_date, label: d.notes || d.reason || "Kapalı" })),
                            ]}
                        />
                    </div>

                    {/* Sebep ve Kaydet */}
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: 200 }}>
                            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>Sebep (isteğe bağlı)</label>
                            <input
                                type="text"
                                style={{ ...inputStyle, borderColor: "#fed7aa" }}
                                value={newDisabled.notes}
                                onChange={(e) => setNewDisabled(prev => ({ ...prev, notes: e.target.value }))}
                                placeholder="Örn: Bakım, Özel etkinlik, Yıllık tatil..."
                            />
                        </div>

                        {/* Seçilen tarih özeti */}
                        {newDisabled.start_date && newDisabled.end_date && (
                            <div style={{
                                padding: "8px 14px", borderRadius: 8,
                                background: "#fef2f2", border: "1px solid #fca5a5",
                                color: "#991b1b", fontSize: 13, fontWeight: 600,
                            }}>
                                🗓 {newDisabled.start_date} → {newDisabled.end_date}
                            </div>
                        )}

                        <button
                            onClick={addDisabledDate}
                            disabled={addingDisabled || !newDisabled.start_date || !newDisabled.end_date}
                            style={{
                                padding: "11px 20px", borderRadius: 8,
                                background: (addingDisabled || !newDisabled.start_date || !newDisabled.end_date) ? "#94a3b8" : "linear-gradient(135deg, #ef4444, #dc2626)",
                                color: "#fff", fontSize: 13, fontWeight: 600,
                                border: "none", cursor: (addingDisabled || !newDisabled.start_date || !newDisabled.end_date) ? "not-allowed" : "pointer",
                                whiteSpace: "nowrap", height: 44,
                            }}
                        >
                            {addingDisabled ? "Kaydediliyor..." : "🚫 Günleri Kapat"}
                        </button>
                    </div>
                </div>

            </Section>
            )}

            {/* ── Kurallar ── */}
            <Section title="Villa Kuralları">
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                    <Checkbox label="Evcil hayvan izni" checked={form.pets_allowed} onChange={(v) => updateField("pets_allowed", v)} />
                    <Checkbox label="Sigara izni" checked={form.smoking_allowed} onChange={(v) => updateField("smoking_allowed", v)} />
                    <Checkbox label="Parti izni" checked={form.parties_allowed} onChange={(v) => updateField("parties_allowed", v)} />
                </div>
            </Section>

            {/* ── Mesafeler & Konum ── */}
            <Section title="Mesafeler & Harita Konumu">
                <FormRow>
                    <FormField label="Merkeze Mesafe (m)" width="25%">
                        <input type="number" style={inputStyle} value={form.distance_center} onChange={(e) => updateField("distance_center", +e.target.value)} />
                    </FormField>
                    <FormField label="Denize Mesafe (m)" width="25%">
                        <input type="number" style={inputStyle} value={form.distance_sea} onChange={(e) => updateField("distance_sea", +e.target.value)} />
                    </FormField>
                    <FormField label="Havaalanına Mesafe (m)" width="25%">
                        <input type="number" style={inputStyle} value={form.distance_airport} onChange={(e) => updateField("distance_airport", +e.target.value)} />
                    </FormField>
                    <FormField label="Sağlık Ocağı (m)" width="25%">
                        <input type="number" style={inputStyle} value={form.distance_clinic} onChange={(e) => updateField("distance_clinic", +e.target.value)} />
                    </FormField>
                </FormRow>
                <FormRow>
                    <FormField label="Hastane Mesafe (m)" width="25%">
                        <input type="number" style={inputStyle} value={form.distance_hospital} onChange={(e) => updateField("distance_hospital", +e.target.value)} />
                    </FormField>
                    <FormField label="Markete Mesafe (m)" width="25%">
                        <input type="number" style={inputStyle} value={form.distance_market} onChange={(e) => updateField("distance_market", +e.target.value)} />
                    </FormField>
                    <FormField label="Restoran Mesafe (m)" width="25%">
                        <input type="number" style={inputStyle} value={form.distance_restaurant} onChange={(e) => updateField("distance_restaurant", +e.target.value)} />
                    </FormField>
                    <FormField label="Toplu Taşıma (m)" width="25%">
                        <input type="number" style={inputStyle} value={form.distance_public_transport} onChange={(e) => updateField("distance_public_transport", +e.target.value)} />
                    </FormField>
                </FormRow>
                <div style={{ marginTop: 24, borderTop: "1px dashed #cbd5e1", paddingTop: 16 }}>
                    <FormRow>
                        <FormField label="Harita Üzerinden Konum Seçin" width="100%">
                            <MapPicker 
                                lat={form.map_lat} 
                                lng={form.map_lng} 
                                onChange={(lat, lng) => {
                                    updateField("map_lat", lat);
                                    updateField("map_lng", lng);
                                }} 
                            />
                        </FormField>
                    </FormRow>
                    <FormRow>
                        <FormField label="Latitude (Enlem) [Haritadan Seçilince Otomatik Dolar]" width="50%">
                            <input style={inputStyle} value={form.map_lat} onChange={(e) => updateField("map_lat", e.target.value)} placeholder="Örn: 36.265..."/>
                        </FormField>
                        <FormField label="Longitude (Boylam) [Haritadan Seçilince Otomatik Dolar]" width="50%">
                            <input style={inputStyle} value={form.map_lng} onChange={(e) => updateField("map_lng", e.target.value)} placeholder="Örn: 29.412..." />
                        </FormField>
                    </FormRow>
                    <FormRow>
                        <FormField label="Harita Embed Kodu (Iframe)" width="100%">
                            <textarea
                                style={{ ...inputStyle, height: 80, resize: "vertical" }}
                                value={form.map_iframe_url}
                                onChange={(e) => updateField("map_iframe_url", e.target.value)}
                                placeholder='<iframe src="https://www.google.com/maps/embed?..." width="600" height="450" ...></iframe>'
                            />
                        </FormField>
                    </FormRow>
                </div>
            </Section>

            {/* ── Sahip Bilgileri ── */}
            <Section title="Sahip Bilgileri">
                <FormRow>
                    <FormField label="Sahip Adı" width="50%">
                        <input style={inputStyle} value={form.owner_name} onChange={(e) => updateField("owner_name", e.target.value)} />
                    </FormField>
                    <FormField label="Sahip Telefon" width="50%">
                        <input style={inputStyle} value={form.owner_phone} onChange={(e) => updateField("owner_phone", e.target.value)} />
                    </FormField>
                </FormRow>
                <FormRow>
                    <FormField label="Belge No" width="33%">
                        <input style={inputStyle} value={form.license_no} onChange={(e) => updateField("license_no", e.target.value)} />
                    </FormField>
                    <FormField label="Sahip IBAN" width="67%">
                        <input style={inputStyle} value={form.owner_iban} onChange={(e) => updateField("owner_iban", e.target.value)} placeholder="TR..." />
                    </FormField>
                </FormRow>
                <FormRow>
                    <FormField label="Belge Diğer Not" width="100%">
                        <textarea style={{...inputStyle, height: 60, resize: "vertical"}} value={form.owner_notes} onChange={(e) => updateField("owner_notes", e.target.value)} placeholder="Özel notlar..." />
                    </FormField>
                </FormRow>
            </Section>

            {/* ── Promosyon ── */}
            <Section title="🏷️ Promosyon Ayarları">
                <div style={{ marginBottom: 16 }}>
                    <Checkbox
                        label="Promosyonlu Villa (Bu villa promosyonlar sayfasında görünsün)"
                        checked={form.is_promotional}
                        onChange={(v) => updateField("is_promotional", v)}
                    />
                </div>
                {form.is_promotional && (
                    <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: 16, marginTop: 8 }}>
                        <p style={{ fontSize: 12, color: "#92400e", marginBottom: 12 }}>
                            Bu villa &quot;Promosyonlu Villalar&quot; kategorisinde listelenecektir.
                        </p>
                        <FormRow>
                            <FormField label="İndirim Metni (ör: %20 İndirim)" width="50%">
                                <input
                                    style={inputStyle}
                                    value={form.promotion_discount_text}
                                    onChange={(e) => updateField("promotion_discount_text", e.target.value)}
                                    placeholder="ör: %20 İndirim, Erken Rezervasyon"
                                />
                            </FormField>
                            <FormField label="Promosyon Açıklaması" width="50%">
                                <input
                                    style={inputStyle}
                                    value={form.promotion_description}
                                    onChange={(e) => updateField("promotion_description", e.target.value)}
                                    placeholder="ör: Yaz sezonu erken rezervasyon fırsatı"
                                />
                            </FormField>
                        </FormRow>
                    </div>
                )}
            </Section>

            {/* ── Yayın Durumu ── */}
            <Section title="Yayın Durumu">
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                    <Checkbox label="Yayında" checked={form.is_published} onChange={(v) => updateField("is_published", v)} />
                    <Checkbox label="Özel (Exclusive)" checked={form.is_exclusive} onChange={(v) => updateField("is_exclusive", v)} />
                </div>
                <FormRow>
                    <FormField label="Sıralama" width="30%">
                        <input type="number" style={inputStyle} value={form.sort_order} onChange={(e) => updateField("sort_order", +e.target.value)} />
                    </FormField>
                </FormRow>
            </Section>

            {/* Bottom save button */}
            <div style={{ textAlign: "right", paddingTop: 20, paddingBottom: 40 }}>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                        padding: "12px 32px",
                        borderRadius: 10,
                        background: saving ? "#94a3b8" : "linear-gradient(135deg, #50b0f0, #3b82f6)",
                        color: "#fff",
                        fontSize: 15,
                        fontWeight: 600,
                        border: "none",
                        cursor: saving ? "not-allowed" : "pointer",
                    }}
                >
                    {saving ? "Kaydediliyor..." : "💾 Kaydet"}
                </button>
            </div>
        </div>
    );
}

/* ─── Reusable UI Components ─── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            padding: "20px 24px",
            marginBottom: 20,
        }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 16, borderBottom: "1px solid #f1f5f9", paddingBottom: 10 }}>
                {title}
            </h2>
            {children}
        </div>
    );
}

function FormRow({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ display: "flex", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
            {children}
        </div>
    );
}

function FormField({ label, width, children }: { label: string; width: string; children: React.ReactNode }) {
    return (
        <div style={{ flex: `0 0 calc(${width} - 8px)`, minWidth: 150 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>
                {label}
            </label>
            {children}
        </div>
    );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, color: "#1e293b" }}>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: "#50b0f0", cursor: "pointer" }}
            />
            {label}
        </label>
    );
}

function EditableCell({ 
    value, 
    type = "text", 
    onSave, 
    prefix = "", 
    suffix = "", 
    isDate = false, 
    style={} 
}: { 
    value: any; 
    type?: string; 
    onSave: (val: any) => void; 
    prefix?: string; 
    suffix?: string; 
    isDate?: boolean;
    style?: React.CSSProperties;
}) {
    const [editing, setEditing] = useState(false);
    const [tempVal, setTempVal] = useState(value);

    // Update temp value if value prop changes
    useEffect(() => { setTempVal(value); }, [value]);

    const handleSave = () => {
        setEditing(false);
        if (tempVal !== value) {
            onSave(type === "number" ? Number(tempVal) : tempVal);
        }
    };

    if (editing) {
        return (
            <input 
                type={type} 
                value={tempVal} 
                onChange={e => setTempVal(e.target.value)}
                onBlur={handleSave}
                onKeyDown={e => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") { setEditing(false); setTempVal(value); } }}
                autoFocus
                style={{ width: "100%", padding: "4px 8px", borderRadius: 4, border: "1px solid #3b82f6", outline: "none", fontSize: 13, background: "#fff", color: "#0f172a" }}
            />
        );
    }

    const displayVal = isDate 
        ? (value ? new Date(value).toLocaleDateString("tr-TR") : "-") 
        : (type === "number" ? Number(value).toLocaleString("tr-TR") : value);

    return (
        <div 
            onClick={() => setEditing(true)} 
            style={{ cursor: "pointer", padding: "4px 8px", borderRadius: 4, transition: "background 0.2s", display: "inline-block", ...style }}
            onMouseOver={e => e.currentTarget.style.background = "#f1f5f9"}
            onMouseOut={e => e.currentTarget.style.background = "transparent"}
            title="Tıkla düzenle"
        >
            {prefix}{displayVal}{suffix}
        </div>
    );
}

/* ─── Styles ─── */
const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
};

const periodThStyle: React.CSSProperties = {
    padding: "10px 12px",
    fontSize: 11,
    fontWeight: 700,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    textAlign: "center",
    whiteSpace: "nowrap",
};

const periodTdStyle: React.CSSProperties = {
    padding: "10px 12px",
    textAlign: "center",
    color: "#475569",
    whiteSpace: "nowrap",
};
