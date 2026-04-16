"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { use } from "react";
import { getVillaDetailBySlug } from "@/lib/queries";
import type { VillaDetail } from "@/lib/types";
import { supabase } from "@/lib/supabase";

/* ─── Helpers ─── */
function parseDate(s: string): Date {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d);
}

function toDateStr(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function isBetween(dateStr: string, start: string, end: string): boolean {
    return dateStr >= start && dateStr <= end;
}

function formatTR(n: number): string {
    return n.toLocaleString("tr-TR");
}

function generateRefCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "VT-";
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
}

const MONTH_FULL_TR = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

const DAY_SHORT_TR = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

const COUNTRY_PHONE_CODES = [
    { label: "Türkiye (+90)", value: "+90" },
    { label: "ABD (+1)", value: "+1" },
    { label: "Afganistan (+93)", value: "+93" },
    { label: "Almanya (+49)", value: "+49" },
    { label: "Angola (+244)", value: "+244" },
    { label: "Arjantin (+54)", value: "+54" },
    { label: "Arnavutluk (+355)", value: "+355" },
    { label: "Avustralya (+61)", value: "+61" },
    { label: "Avusturya (+43)", value: "+43" },
    { label: "Azerbaycan (+994)", value: "+994" },
    { label: "Bahreyn (+973)", value: "+973" },
    { label: "Bangladeş (+880)", value: "+880" },
    { label: "Belarus (+375)", value: "+375" },
    { label: "Belçika (+32)", value: "+32" },
    { label: "Bolivya (+591)", value: "+591" },
    { label: "Bosna Hersek (+387)", value: "+387" },
    { label: "Brezilya (+55)", value: "+55" },
    { label: "Bulgaristan (+359)", value: "+359" },
    { label: "Cezayir (+213)", value: "+213" },
    { label: "Çek Cumhuriyeti (+420)", value: "+420" },
    { label: "Çin (+86)", value: "+86" },
    { label: "Danimarka (+45)", value: "+45" },
    { label: "Endonezya (+62)", value: "+62" },
    { label: "Ermenistan (+374)", value: "+374" },
    { label: "Etiyopya (+251)", value: "+251" },
    { label: "Fas (+212)", value: "+212" },
    { label: "Filipinler (+63)", value: "+63" },
    { label: "Finlandiya (+358)", value: "+358" },
    { label: "Fransa (+33)", value: "+33" },
    { label: "Gana (+233)", value: "+233" },
    { label: "Güney Afrika (+27)", value: "+27" },
    { label: "Güney Kore (+82)", value: "+82" },
    { label: "Gürcistan (+995)", value: "+995" },
    { label: "Hindistan (+91)", value: "+91" },
    { label: "Hollanda (+31)", value: "+31" },
    { label: "Hırvatistan (+385)", value: "+385" },
    { label: "Irak (+964)", value: "+964" },
    { label: "İngiltere (+44)", value: "+44" },
    { label: "İran (+98)", value: "+98" },
    { label: "İrlanda (+353)", value: "+353" },
    { label: "İspanya (+34)", value: "+34" },
    { label: "İsrail (+972)", value: "+972" },
    { label: "İsveç (+46)", value: "+46" },
    { label: "İsviçre (+41)", value: "+41" },
    { label: "İtalya (+39)", value: "+39" },
    { label: "İzlanda (+354)", value: "+354" },
    { label: "Japonya (+81)", value: "+81" },
    { label: "Kamboçya (+855)", value: "+855" },
    { label: "Kanada (+1)", value: "+1" },
    { label: "Kazakistan (+7)", value: "+7" },
    { label: "Kenya (+254)", value: "+254" },
    { label: "Kolombiya (+57)", value: "+57" },
    { label: "Kosova (+383)", value: "+383" },
    { label: "Küba (+53)", value: "+53" },
    { label: "Kuveyt (+965)", value: "+965" },
    { label: "Kıbrıs (+357)", value: "+357" },
    { label: "Kırgızistan (+996)", value: "+996" },
    { label: "Letonya (+371)", value: "+371" },
    { label: "Libya (+218)", value: "+218" },
    { label: "Litvanya (+370)", value: "+370" },
    { label: "Lübnan (+961)", value: "+961" },
    { label: "Lüksemburg (+352)", value: "+352" },
    { label: "Macaristan (+36)", value: "+36" },
    { label: "Makedonya (+389)", value: "+389" },
    { label: "Meksika (+52)", value: "+52" },
    { label: "Mısır (+20)", value: "+20" },
    { label: "Moldova (+373)", value: "+373" },
    { label: "Moğolistan (+976)", value: "+976" },
    { label: "Nijerya (+234)", value: "+234" },
    { label: "Norveç (+47)", value: "+47" },
    { label: "Özbekistan (+998)", value: "+998" },
    { label: "Pakistan (+92)", value: "+92" },
    { label: "Peru (+51)", value: "+51" },
    { label: "Polonya (+48)", value: "+48" },
    { label: "Portekiz (+351)", value: "+351" },
    { label: "Romanya (+40)", value: "+40" },
    { label: "Rusya (+7)", value: "+7" },
    { label: "Suudi Arabistan (+966)", value: "+966" },
    { label: "Sırbistan (+381)", value: "+381" },
    { label: "Singapur (+65)", value: "+65" },
    { label: "Slovakya (+421)", value: "+421" },
    { label: "Slovenya (+386)", value: "+386" },
    { label: "Sri Lanka (+94)", value: "+94" },
    { label: "Sudan (+249)", value: "+249" },
    { label: "Suriye (+963)", value: "+963" },
    { label: "Tacikistan (+992)", value: "+992" },
    { label: "Tayland (+66)", value: "+66" },
    { label: "Tayvan (+886)", value: "+886" },
    { label: "Tunus (+216)", value: "+216" },
    { label: "Türkmenistan (+993)", value: "+993" },
    { label: "Uganda (+256)", value: "+256" },
    { label: "Ukrayna (+380)", value: "+380" },
    { label: "Umman (+968)", value: "+968" },
    { label: "Uruguay (+598)", value: "+598" },
    { label: "Venezuela (+58)", value: "+58" },
    { label: "Vietnam (+84)", value: "+84" },
    { label: "Yeni Zelanda (+64)", value: "+64" },
    { label: "Yunanistan (+30)", value: "+30" },
    { label: "BAE (+971)", value: "+971" },
    { label: "Bermuda (+1)", value: "+1" },
    { label: "Cibuti (+253)", value: "+253" },
    { label: "Eritre (+291)", value: "+291" },
    { label: "Eswatini (+268)", value: "+268" },
    { label: "Gabon (+241)", value: "+241" },
    { label: "Gambiya (+220)", value: "+220" },
    { label: "Gine (+224)", value: "+224" },
    { label: "Guatemala (+502)", value: "+502" },
    { label: "Guyana (+592)", value: "+592" },
    { label: "Haiti (+509)", value: "+509" },
    { label: "Honduras (+504)", value: "+504" },
    { label: "Kamerun (+237)", value: "+237" },
    { label: "Katar (+974)", value: "+974" },
    { label: "Kongo (+242)", value: "+242" },
    { label: "Liberya (+231)", value: "+231" },
    { label: "Madagaskar (+261)", value: "+261" },
    { label: "Malawi (+265)", value: "+265" },
    { label: "Maldivler (+960)", value: "+960" },
    { label: "Mali (+223)", value: "+223" },
    { label: "Malta (+356)", value: "+356" },
    { label: "Mauritius (+230)", value: "+230" },
    { label: "Mozambik (+258)", value: "+258" },
    { label: "Namibya (+264)", value: "+264" },
    { label: "Nikaragua (+505)", value: "+505" },
    { label: "Panama (+507)", value: "+507" },
    { label: "Papua Yeni Gine (+675)", value: "+675" },
    { label: "Paraguay (+595)", value: "+595" },
    { label: "Ruanda (+250)", value: "+250" },
    { label: "Senegal (+221)", value: "+221" },
    { label: "Sierra Leone (+232)", value: "+232" },
    { label: "Somali (+252)", value: "+252" },
    { label: "Tanzanya (+255)", value: "+255" },
    { label: "Togo (+228)", value: "+228" },
    { label: "Trinidad ve Tobago (+1)", value: "+1" },
    { label: "Zambia (+260)", value: "+260" },
    { label: "Zimbabve (+263)", value: "+263" },
];

/* ─── Component ─── */
export default function ReservationPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const slug = resolvedParams.slug;
    const router = useRouter();
    const searchParams = useSearchParams();

    const checkIn = searchParams.get("checkIn") || "";
    const checkOut = searchParams.get("checkOut") || "";

    const [villa, setVilla] = useState<VillaDetail | null>(null);
    const [loadingVilla, setLoadingVilla] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        getVillaDetailBySlug(slug).then(res => {
            setVilla(res);
            setLoadingVilla(false);
        }).catch(err => {
            console.error(err);
            setLoadingVilla(false);
        });

        supabase.auth.getSession().then(({ data }) => {
            setUser(data.session?.user || null);
        });
    }, [slug]);

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneCode: "+90",
        phone: "",
        tcPassport: "",
        country: "",
        city: "",
        address: "",
        totalGuests: 1,
        paymentMethod: "" as "" | "credit" | "eft" | "later",
        contractSales: false,
        contractKvkk: false,
    });

    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    // Phone picker state
    const [phonePickerOpen, setPhonePickerOpen] = useState(false);
    const [phoneSearch, setPhoneSearch] = useState("");
    const phoneSearchRef = useRef<HTMLInputElement>(null);

    const filteredPhoneCodes = useMemo(() => {
        const q = phoneSearch.toLowerCase();
        if (!q) return COUNTRY_PHONE_CODES;
        return COUNTRY_PHONE_CODES.filter(c => c.label.toLowerCase().includes(q));
    }, [phoneSearch]);

    // Coupon state
    const [couponInput, setCouponInput] = useState("");
    const [couponApplying, setCouponApplying] = useState(false);
    const [couponError, setCouponError] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<{
        id: string;
        code: string;
        discount_amount: number;
        discount_type: "percentage" | "fixed";
    } | null>(null);

    // Calculate pricing
    const { nightCount, accommodationPrice, cleaningFee, couponDiscount, totalPrice, advancePayment, remainingPayment, hasUnpricedDays } = useMemo(() => {
        if (!villa || !checkIn || !checkOut) return { nightCount: 0, accommodationPrice: 0, cleaningFee: 0, couponDiscount: 0, totalPrice: 0, advancePayment: 0, remainingPayment: 0, hasUnpricedDays: false };
        const start = parseDate(checkIn);
        const end = parseDate(checkOut);
        const nights = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

        let accommodation = 0;
        let unpriced = false;
        const cursor = new Date(start);
        for (let i = 0; i < nights; i++) {
            const ds = toDateStr(cursor);
            let found = false;
            for (const pr of villa.price_periods) {
                if (isBetween(ds, pr.start_date, pr.end_date)) {
                    accommodation += pr.nightly_price;
                    found = true;
                    break;
                }
            }
            if (!found) unpriced = true;
            cursor.setDate(cursor.getDate() + 1);
        }

        // Cleaning fee
        const fee = villa.cleaning_fee || 0;
        const minNightsForCleaning = villa.cleaning_fee_min_nights || 0;
        const applyCleaning = fee > 0 && (minNightsForCleaning === 0 || nights <= minNightsForCleaning);
        const cleaning = applyCleaning ? fee : 0;

        // Coupon discount (applied on accommodation price only)
        let discount = 0;
        if (appliedCoupon) {
            if (appliedCoupon.discount_type === "percentage") {
                discount = Math.round(accommodation * appliedCoupon.discount_amount / 100);
            } else {
                discount = Math.min(appliedCoupon.discount_amount, accommodation);
            }
        }

        const total = accommodation - discount + cleaning;
        const advance = Math.round(total * 0.15);
        return { nightCount: nights, accommodationPrice: accommodation, cleaningFee: cleaning, couponDiscount: discount, totalPrice: total, advancePayment: advance, remainingPayment: total - advance, hasUnpricedDays: unpriced };
    }, [villa, checkIn, checkOut, appliedCoupon]);

    // Generate date strip
    const dateStrip = useMemo(() => {
        if (!checkIn || !checkOut) return [];
        const start = parseDate(checkIn);
        const end = parseDate(checkOut);
        const dates: { day: number; dayName: string; price: number | null }[] = [];
        const cursor = new Date(start);
        while (cursor <= end) {
            const ds = toDateStr(cursor);
            let price: number | null = null;
            if (villa) {
                for (const pr of villa.price_periods) {
                    if (isBetween(ds, pr.start_date, pr.end_date)) {
                        price = pr.nightly_price;
                        break;
                    }
                }
            }
            dates.push({
                day: cursor.getDate(),
                dayName: DAY_SHORT_TR[cursor.getDay()],
                price,
            });
            cursor.setDate(cursor.getDate() + 1);
        }
        return dates;
    }, [villa, checkIn, checkOut]);

    async function handleApplyCoupon() {
        const code = couponInput.trim().toUpperCase();
        if (!code) return;
        setCouponError("");
        setCouponApplying(true);

        const { data, error: fetchErr } = await supabase
            .from("coupons")
            .select("id, code, discount_amount, discount_type, valid_until, is_active, usage_limit, used_count")
            .eq("code", code)
            .single();

        setCouponApplying(false);

        if (fetchErr || !data) {
            setCouponError("Kupon kodu geçersiz.");
            return;
        }
        if (!data.is_active) {
            setCouponError("Bu kupon artık aktif değil.");
            return;
        }
        if (data.valid_until && new Date(data.valid_until) < new Date()) {
            setCouponError("Bu kuponun geçerlilik süresi dolmuş.");
            return;
        }
        if (data.usage_limit !== null && data.used_count >= data.usage_limit) {
            setCouponError("Bu kuponun kullanım limiti dolmuş.");
            return;
        }

        setAppliedCoupon({
            id: data.id,
            code: data.code,
            discount_amount: data.discount_amount,
            discount_type: data.discount_type,
        });
        setCouponInput("");
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (!form.firstName.trim() || !form.lastName.trim()) {
            setError("Ad ve soyad zorunludur.");
            return;
        }
        if (!form.phone.trim()) {
            setError("Telefon numarası zorunludur.");
            return;
        }
        if (!form.contractSales || !form.contractKvkk) {
            setError("Sözleşmeleri kabul etmeniz gerekmektedir.");
            return;
        }
        if (!villa) return;

        setSending(true);
        const refCode = generateRefCode();

        const { error: dbError } = await supabase.from("reservations").insert({
            user_id: user ? user.id : null,
            ref_code: refCode,
            villa_id: villa.id,
            villa_slug: slug,
            source: "website",
            status: "pending",
            renter_first_name: form.firstName,
            renter_last_name: form.lastName,
            renter_email: form.email,
            renter_phone_code: form.phoneCode,
            renter_phone_number: form.phone,
            renter_tc_passport: form.tcPassport,
            check_in_date: checkIn,
            check_out_date: checkOut,
            nights: nightCount,
            total_guests: form.totalGuests,
            currency: "TRY",
            total_amount: totalPrice,
            prepayment_amount: advancePayment,
            remaining_amount: remainingPayment,
            discount_amount: couponDiscount > 0 ? couponDiscount : undefined,
            promotion_code: appliedCoupon ? appliedCoupon.code : undefined,
            promotion_discount: couponDiscount > 0 ? couponDiscount : undefined,
            admin_notes: `Villa: ${villa.name || slug}\nÖdeme: ${form.paymentMethod || "Belirtilmedi"}\nÜlke: ${form.country}\nŞehir: ${form.city}\nAdres: ${form.address}${appliedCoupon ? `\nKupon: ${appliedCoupon.code} (-₺${formatTR(couponDiscount)})` : ""}`,
        });

        if (dbError) {
            setError("Bir hata oluştu: " + dbError.message);
            setSending(false);
            return;
        }

        // Kupon kullanım sayısını artır
        if (appliedCoupon) {
            const { data: couponData } = await supabase
                .from("coupons")
                .select("used_count")
                .eq("id", appliedCoupon.id)
                .single();
            if (couponData) {
                await supabase
                    .from("coupons")
                    .update({ used_count: (couponData.used_count || 0) + 1 })
                    .eq("id", appliedCoupon.id);
            }
        }

        setSent(true);
        setSending(false);
    }

    /* ─── Loading / Error / Success States ─── */
    if (loadingVilla) {
        return (
            <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
                <div style={{ textAlign: "center" }}>
                    <h2>Yükleniyor...</h2>
                </div>
            </div>
        );
    }

    if (!villa) {
        return (
            <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
                <div style={{ textAlign: "center" }}>
                    <h2>Villa bulunamadı</h2>
                    <button onClick={() => router.back()} style={{ marginTop: 16, padding: "10px 24px", borderRadius: 8, border: "1px solid #e2e8f0", cursor: "pointer" }}>Geri Dön</button>
                </div>
            </div>
        );
    }

    if (!checkIn || !checkOut) {
        return (
            <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
                <div style={{ textAlign: "center" }}>
                    <h2>Lütfen önce tarih seçin</h2>
                    <button onClick={() => router.push(`/tatilvillasi/${slug}`)} style={{ marginTop: 16, padding: "10px 24px", borderRadius: 8, border: "1px solid #e2e8f0", cursor: "pointer" }}>Villa Sayfasına Dön</button>
                </div>
            </div>
        );
    }

    if (sent) {
        return (
            <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
                <div style={{ textAlign: "center", maxWidth: 500, padding: "40px 24px" }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>Rezervasyon Talebiniz Alındı!</h2>
                    <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.6 }}>
                        Talebiniz ekibimiz tarafından incelenmektedir. En kısa sürede sizinle telefon veya WhatsApp üzerinden iletişime geçeceğiz.
                    </p>
                    <button
                        onClick={() => router.push(`/tatilvillasi/${slug}`)}
                        style={{ marginTop: 24, padding: "12px 28px", borderRadius: 10, background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}
                    >
                        Villa Sayfasına Dön
                    </button>
                </div>
            </div>
        );
    }

    const ciDate = parseDate(checkIn);
    const coDate = parseDate(checkOut);
    const depositAmount = villa.deposit_amount || 5000;

    return (
        <div className="rez-page-wrapper">
            <h1 className="rez-page-title poppins">Rezervasyon İsteği</h1>

            <div className="rez-page-grid">
                {/* ═══════ LEFT: Form ═══════ */}
                <div className="rez-form-side">
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", color: "#dc2626", fontSize: 13, marginBottom: 20 }}>
                                ⚠️ {error}
                            </div>
                        )}

                        {/* ── Kiralayan Misafir Bilgileri ── */}
                        <h2 className="rez-section-title poppins">Kiralayan Misafir Bilgileri</h2>

                        <div className="rez-row-2">
                            <input
                                className="rez-input"
                                placeholder="Ad"
                                value={form.firstName}
                                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                required
                            />
                            <input
                                className="rez-input"
                                placeholder="Soyad"
                                value={form.lastName}
                                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                required
                            />
                        </div>

                        <input
                            className="rez-input rez-full"
                            placeholder="T.C veya Pasaport No"
                            value={form.tcPassport}
                            onChange={(e) => setForm({ ...form, tcPassport: e.target.value })}
                        />

                        <input
                            className="rez-input rez-full"
                            type="email"
                            placeholder="E-posta"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />

                        <div className="rez-phone-row">
                            <button
                                type="button"
                                className="rez-input rez-phone-picker-btn"
                                onClick={() => { setPhonePickerOpen(true); setPhoneSearch(""); setTimeout(() => phoneSearchRef.current?.focus(), 50); }}
                            >
                                <span className="rez-phone-picker-code">{form.phoneCode}</span>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, opacity: 0.5 }}>
                                    <path d="M2 4l4 4 4-4" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <input
                                className="rez-input rez-phone-number"
                                type="tel"
                                placeholder="Telefon Numarası"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                required
                            />
                        </div>

                        {/* Phone Code Picker Modal */}
                        {phonePickerOpen && (
                            <div className="rez-picker-overlay" onClick={() => setPhonePickerOpen(false)}>
                                <div className="rez-picker-modal" onClick={(e) => e.stopPropagation()}>
                                    <div className="rez-picker-header">
                                        <span className="rez-picker-title">Ülke Kodu Seçin</span>
                                        <button type="button" className="rez-picker-close" onClick={() => setPhonePickerOpen(false)}>✕</button>
                                    </div>
                                    <div className="rez-picker-search-wrap">
                                        <input
                                            ref={phoneSearchRef}
                                            className="rez-picker-search"
                                            placeholder="Ülke ara..."
                                            value={phoneSearch}
                                            onChange={(e) => setPhoneSearch(e.target.value)}
                                        />
                                    </div>
                                    <div className="rez-picker-list">
                                        {filteredPhoneCodes.length === 0 && (
                                            <div className="rez-picker-empty">Sonuç bulunamadı</div>
                                        )}
                                        {filteredPhoneCodes.map((c, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                className={`rez-picker-item ${form.phoneCode === c.value ? "rez-picker-item-active" : ""}`}
                                                onClick={() => { setForm({ ...form, phoneCode: c.value }); setPhonePickerOpen(false); }}
                                            >
                                                <span className="rez-picker-item-label">{c.label}</span>
                                                {form.phoneCode === c.value && <span className="rez-picker-item-check">✓</span>}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="rez-row-2">
                            <input
                                className="rez-input"
                                placeholder="Ülke"
                                value={form.country}
                                onChange={(e) => setForm({ ...form, country: e.target.value })}
                            />
                            <input
                                className="rez-input"
                                placeholder="Şehir"
                                value={form.city}
                                onChange={(e) => setForm({ ...form, city: e.target.value })}
                            />
                        </div>

                        <textarea
                            className="rez-input rez-full rez-textarea"
                            placeholder="Adress"
                            value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                            rows={2}
                        />

                        {/* ── Toplam Misafir Sayısı ── */}
                        <h2 className="rez-section-title poppins" style={{ marginTop: 32 }}>
                            Toplam Misafir Sayısı <span className="rez-section-sub">( Kiralayan misafir dahil )</span>
                        </h2>

                        <div className="rez-guest-selector">
                            <button
                                type="button"
                                className="rez-guest-btn"
                                onClick={() => setForm({ ...form, totalGuests: Math.max(1, form.totalGuests - 1) })}
                            >
                                −
                            </button>
                            <span className="rez-guest-count">{form.totalGuests} Misafir</span>
                            <button
                                type="button"
                                className="rez-guest-btn"
                                onClick={() => setForm({ ...form, totalGuests: Math.min(villa.max_guests, form.totalGuests + 1) })}
                            >
                                +
                            </button>
                        </div>

                        {/* ── Sözleşmeler ── */}
                        <h2 className="rez-section-title poppins" style={{ marginTop: 32 }}>Sözleşmeler</h2>

                        <label className="rez-checkbox-row">
                            <input
                                type="checkbox"
                                checked={form.contractSales}
                                onChange={(e) => setForm({ ...form, contractSales: e.target.checked })}
                                className="rez-checkbox"
                            />
                            <span>
                                <a href="/politika/mesafeli-satis-sozlesmesi" target="_blank" rel="noopener noreferrer" className="rez-link">Mesafeli Satış Sözleşmesini</a> okudum ve kabul ediyorum
                            </span>
                        </label>

                        <label className="rez-checkbox-row">
                            <input
                                type="checkbox"
                                checked={form.contractKvkk}
                                onChange={(e) => setForm({ ...form, contractKvkk: e.target.checked })}
                                className="rez-checkbox"
                            />
                            <span>
                                <a href="/politika/kvkk-aydinlatma-metni" target="_blank" rel="noopener noreferrer" className="rez-link">KVKK Aydınlatma Metnini</a> okudum ve kabul ediyorum
                            </span>
                        </label>

                        {/* ── Kupon Kodu ── */}
                        <h2 className="rez-section-title poppins" style={{ marginTop: 32 }}>İndirim Kuponu</h2>

                        {appliedCoupon ? (
                            <div className="rez-coupon-applied">
                                <div className="rez-coupon-applied-info">
                                    <span className="rez-coupon-tag">{appliedCoupon.code}</span>
                                    <span className="rez-coupon-applied-desc">
                                        {appliedCoupon.discount_type === "percentage"
                                            ? `%${appliedCoupon.discount_amount} indirim uygulandı`
                                            : `₺${formatTR(appliedCoupon.discount_amount)} indirim uygulandı`}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className="rez-coupon-remove"
                                    onClick={() => { setAppliedCoupon(null); setCouponError(""); }}
                                >
                                    Kaldır
                                </button>
                            </div>
                        ) : (
                            <div>
                                <div className="rez-coupon-row">
                                    <input
                                        className="rez-input rez-coupon-input"
                                        placeholder="Kupon kodunuzu girin"
                                        value={couponInput}
                                        onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleApplyCoupon(); } }}
                                    />
                                    <button
                                        type="button"
                                        className="rez-coupon-btn"
                                        onClick={handleApplyCoupon}
                                        disabled={couponApplying || !couponInput.trim()}
                                    >
                                        {couponApplying ? "..." : "Uygula"}
                                    </button>
                                </div>
                                {couponError && (
                                    <p className="rez-coupon-error">{couponError}</p>
                                )}
                            </div>
                        )}

                        {/* ── Ödeme Seçenekleri ── */}
                        <h2 className="rez-section-title poppins" style={{ marginTop: 32 }}>Ödeme Seçenekleri</h2>

                        <p className="rez-payment-info">
                            <a href="#" className="rez-link">%15 Ön Ödemeyi rezervasyon uygunluğu kesinleştirildikten sonra Kredi Kartıyla veya EFT ile yapabilirsiniz</a> 🛈
                        </p>

                        <label className="rez-radio-row">
                            <span className="rez-radio-label">+ Kredi Kartı</span>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="credit"
                                checked={form.paymentMethod === "credit"}
                                onChange={() => setForm({ ...form, paymentMethod: "credit" })}
                                className="rez-radio"
                            />
                        </label>

                        <label className="rez-radio-row">
                            <span className="rez-radio-label">+ EFT</span>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="eft"
                                checked={form.paymentMethod === "eft"}
                                onChange={() => setForm({ ...form, paymentMethod: "eft" })}
                                className="rez-radio"
                            />
                        </label>
                    </form>
                </div>

                {/* ═══════ RIGHT: Summary Card ═══════ */}
                <div className="rez-summary-side">
                    <div className="rez-summary-card">
                        {/* Villa Info */}
                        <div className="rez-villa-info">
                            <img
                                src={villa.cover_image_url}
                                alt={villa.name}
                                className="rez-villa-thumb"
                            />
                            <div className="rez-villa-meta">
                                <div className="rez-villa-name poppins">{villa.name}</div>
                                <div className="rez-villa-sub">Tüm villayı kiralıyorsunuz</div>
                                <div className="rez-villa-rating">
                                    ★ {villa.avg_rating || 0} Toplam ({villa.review_count || 0}) Yorum
                                </div>
                            </div>
                        </div>

                        {/* Tarihler */}
                        <div className="rez-dates-section">
                            <div className="rez-dates-title poppins">Tarihler</div>
                            <div className="rez-dates-range">
                                {ciDate.getDate()} {MONTH_FULL_TR[ciDate.getMonth()]} — {coDate.getDate()} {MONTH_FULL_TR[coDate.getMonth()]} ({coDate.getFullYear()})
                            </div>

                            {/* Calendar Strip */}
                            <div className="rez-date-strip">
                                {dateStrip.map((d, i) => (
                                    <div
                                        key={i}
                                        className={`rez-date-cell ${i === 0 ? "rez-date-cell-first" : ""} ${i === dateStrip.length - 1 ? "rez-date-cell-last" : ""}`}
                                    >
                                        <div className="rez-date-day-name">{d.dayName}</div>
                                        <div className="rez-date-day-num">{d.day}</div>
                                        <div className="rez-date-price">{d.price !== null ? `₺${formatTR(d.price)}` : "–"}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Ücretler Dökümü */}
                        <div className="rez-pricing-section">
                            <div className="rez-pricing-title poppins">Ücretler Dökümü</div>

                            <div className="rez-pricing-row">
                                <span>Konaklama süreniz</span>
                                <span className="rez-pricing-val">{nightCount} Gece</span>
                            </div>
                            <div className="rez-pricing-row">
                                <span>Konaklama Ücreti</span>
                                <span className="rez-pricing-val">₺{formatTR(accommodationPrice)}</span>
                            </div>
                            {cleaningFee > 0 && (
                                <div className="rez-pricing-row">
                                    <span>Temizlik Ücreti</span>
                                    <span className="rez-pricing-val">₺{formatTR(cleaningFee)}</span>
                                </div>
                            )}
                            {couponDiscount > 0 && (
                                <div className="rez-pricing-row rez-pricing-discount">
                                    <span>
                                        Kupon İndirimi
                                        <span className="rez-coupon-badge">{appliedCoupon?.code}</span>
                                    </span>
                                    <span className="rez-pricing-val rez-pricing-discount-val">-₺{formatTR(couponDiscount)}</span>
                                </div>
                            )}
                            <div className="rez-pricing-row rez-pricing-total">
                                <span>Toplam Tutar</span>
                                <span className="rez-pricing-val-bold">₺{formatTR(totalPrice)}</span>
                            </div>
                        </div>

                        {/* Ön Ödeme */}
                        <div className="rez-advance-section">
                            <div className="rez-advance-label">Gereken Ön Ödeme</div>
                            <div className="rez-pricing-row">
                                <span className="rez-advance-pct">%15 Ön Ödeme</span>
                                <span className="rez-pricing-val">₺{formatTR(advancePayment)}</span>
                            </div>
                        </div>

                        {/* Kalan Ödeme */}
                        <div className="rez-remaining-section">
                            <div className="rez-remaining-label">Girişte Ödenmesi Gereken</div>
                            <div className="rez-pricing-row">
                                <span className="rez-advance-pct">%85 Kalan Ödeme</span>
                                <span className="rez-pricing-val">₺{formatTR(remainingPayment)}</span>
                            </div>
                            <div className="rez-pricing-row">
                                <span className="rez-deposit-label">
                                    Depozito 🛈 <span className="rez-deposit-sub">(toplam tutara dahil değildir)</span>
                                </span>
                                <span className="rez-pricing-val">₺{formatTR(depositAmount)}</span>
                            </div>
                        </div>

                        {/* Submit Button */}
                        {hasUnpricedDays && (
                            <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 10, padding: "12px 16px", color: "#92400e", fontSize: 13, marginBottom: 12 }}>
                                ⚠️ Seçtiğiniz tarih aralığında fiyatlandırılmamış günler bulunmaktadır. Bu tarihler için rezervasyon yapılamaz. Lütfen farklı tarihler seçin.
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={sending || hasUnpricedDays}
                            className="rez-submit-btn"
                            style={hasUnpricedDays ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
                        >
                            {sending ? "Gönderiliyor..." : "Rezervasyon İsteği Gönder  ›"}
                        </button>

                        {/* WhatsApp */}
                        <div className="rez-divider" />
                        <a
                            href={`https://wa.me/905323990748?text=${encodeURIComponent(`Merhaba, ${villa.name} için ${ciDate.getDate()} ${MONTH_FULL_TR[ciDate.getMonth()]} - ${coDate.getDate()} ${MONTH_FULL_TR[coDate.getMonth()]} tarihleri arası rezervasyon yapmak istiyorum.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rez-whatsapp-link"
                        >
                            <svg viewBox="0 0 24 24" fill="#25D366" width="18" height="18">
                                <path d="M12 2C6.48 2 2 6.48 2 12c0 2.17.69 4.18 1.86 5.86L3 22l4.28-.84C8.83 23.01 10.37 23 12 23c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.83 14.33c-.26.74-1.27 1.46-1.92 1.55-.54.08-1.23.23-3.83-.84-3.14-1.3-5.18-4.51-5.33-4.71-.16-.21-1.28-1.7-1.28-3.24 0-1.54.8-2.31 1.08-2.61.28-.31.62-.39.83-.39.21 0 .42 0 .61.01.19.01.44-.07.67.48.24.56.81 1.99.88 2.14.08.15.13.33.02.54-.11.21-.16.33-.32.53-.15.18-.33.39-.47.53-.16.16-.33.34-.14.67.18.32.81 1.34 1.74 2.16 1.2.11 2.21.46 2.44.6.24.13.37.11.51-.05.15-.17.65-.75.82-1.01.17-.26.34-.22.65-.11.31.11 1.94.91 2.28 1.08.33.17.56.26.64.4.08.14.08.82-.18 1.56z" />
                            </svg>
                            WhatsApp ile rezerve edin
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
