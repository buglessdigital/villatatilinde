"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    changeLanguage as googleChangeLanguage,
    getInitialLanguageFromCookie,
    initializeTranslation,
} from "@/lib/useGoogleTranslate";
import { useCurrency, CURRENCIES } from "@/context/CurrencyContext";
import type { CurrencyCode } from "@/context/CurrencyContext";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

/* ─── Language & Currency Data ─── */
const languages = [
    { code: "tr", label: "Türkçe", flag: "/images/tr.png" },
    { code: "en", label: "English", flag: "/images/en.png" },
    { code: "de", label: "Deutsch", flag: "/images/de.png" },
    { code: "ru", label: "Русский", flag: "/images/ru.png" },
    { code: "ar", label: "عربي", flag: "/images/ar.png" },
];

const currencies = [
    { code: "try", symbol: "₺", label: "TRY" },
    { code: "eur", symbol: "€", label: "EUR" },
    { code: "gbp", symbol: "£", label: "GBP" },
    { code: "usd", symbol: "$", label: "USD" },
    { code: "rub", symbol: "₽", label: "RUB" },
];

export default function Navbar() {
    /* ─── State ─── */
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [langDropdown, setLangDropdown] = useState(false);
    const [currDropdown, setCurrDropdown] = useState(false);
    const [selectedLang, setSelectedLang] = useState("tr");
    const { currency: selectedCurrency, setCurrency: setGlobalCurrency } = useCurrency();
    const [langLoading, setLangLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [profileDropdown, setProfileDropdown] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    // Notifications badge count
    const [unreadCount, setUnreadCount] = useState(0);

    /* ─── Auth state listener ─── */
    useEffect(() => {
        // Get current session
        supabase.auth.getSession().then(({ data: { session }, error }) => {
            if (error) {
                supabase.auth.signOut();
                setUser(null);
            } else {
                setUser(session?.user ?? null);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "TOKEN_REFRESHED" || event === "SIGNED_IN") {
                setUser(session?.user ?? null);
            } else if (event === "SIGNED_OUT") {
                setUser(null);
            } else {
                setUser(session?.user ?? null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    /* ─── Notification badge count ─── */
    useEffect(() => {
        let isMounted = true;
        async function fetchCount() {
            if (!user) { if (isMounted) setUnreadCount(0); return; }

            const readResIds: string[] = JSON.parse(localStorage.getItem("vt_read_notif_ids") || "[]");
            const readQIds: string[] = JSON.parse(localStorage.getItem("vt_read_question_ids") || "[]");

            const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single();
            const isAdmin = userData?.role === "admin";

            if (isAdmin) {
                const { count } = await supabase.from("reservations")
                    .select("id", { count: "exact", head: true })
                    .in("status", ["pending", "pre_approved"]);
                if (isMounted) setUnreadCount(count || 0);
            } else {
                const [resResult, qResult] = await Promise.all([
                    supabase.from("reservations").select("id").eq("user_id", user.id),
                    supabase.from("villa_questions").select("id").eq("user_email", user.email!).eq("is_answered", true),
                ]);
                const unreadRes = (resResult.data || []).filter(r => !readResIds.includes(r.id)).length;
                const unreadQ = (qResult.data || []).filter(q => !readQIds.includes(q.id)).length;
                if (isMounted) setUnreadCount(unreadRes + unreadQ);
            }
        }
        fetchCount();

        // Update badge when user reads notifications on the notifications page
        const handler = () => fetchCount();
        window.addEventListener("vt_notifications_read", handler);
        return () => { isMounted = false; window.removeEventListener("vt_notifications_read", handler); };
    }, [user]);

    /* ─── Logout handler ─── */
    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfileDropdown(false);
        setMobileMenuOpen(false);
        router.push("/");
    };

    /* ─── User display helpers ─── */
    const userDisplayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Kullanıcı";
    const userEmail = user?.email || "";
    const userInitial = (userDisplayName.charAt(0) || "K").toUpperCase();

    /* ─── Initialise language from cookie on mount ─── */
    useEffect(() => {
        const initial = getInitialLanguageFromCookie();
        setSelectedLang(initial);
        // If a non-Turkish language was previously selected, auto-translate
        if (initial !== "tr") {
            initializeTranslation();
        }
    }, []);

    /* ─── Language change handler ─── */
    const handleLanguageChange = useCallback(
        async (langCode: string) => {
            if (langCode === selectedLang) return;
            setSelectedLang(langCode);
            setLangDropdown(false);
            setLangLoading(true);
            try {
                await googleChangeLanguage(langCode);
            } catch (err) {
                console.error("Language change failed:", err);
            } finally {
                // Give Google Translate a moment to apply
                setTimeout(() => setLangLoading(false), 600);
            }
        },
        [selectedLang]
    );

    /* Refs for closing on outside click */
    const langRef = useRef<HTMLDivElement>(null);
    const currRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (langRef.current && !langRef.current.contains(e.target as Node)) {
                setLangDropdown(false);
            }
            if (currRef.current && !currRef.current.contains(e.target as Node)) {
                setCurrDropdown(false);
            }
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setProfileDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const currentLang = languages.find((l) => l.code === selectedLang) || languages[0];

    return (
        <>
            {/* Hidden Google Translate widget — required for page translation */}
            <div id="google_translate_element" style={{ display: "none" }} />

            {/* Language loading indicator */}
            {langLoading && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: 3,
                        background: "linear-gradient(90deg, #50b0f0 0%, #6772e5 50%, #50b0f0 100%)",
                        backgroundSize: "200% 100%",
                        animation: "langLoadBar 1s linear infinite",
                        zIndex: 99999,
                    }}
                />
            )}
            {/* ============================================ */}
            {/* MOBILE NAV — visible < 1024px               */}
            {/* ============================================ */}
            <div
                className="no1024 paddingMobile"
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10000,
                    background: "#fff",
                    borderBottom: "1px solid #f1f1f1",
                }}
            >
                <div className="middleft" style={{ padding: "8px 0", flexWrap: "nowrap", alignItems: "center", gap: 0 }}>
                    {/* Hamburger */}
                    <div style={{ paddingRight: 16, flexShrink: 0 }}>
                        <img
                            onClick={() => setMobileMenuOpen(true)}
                            src="/images/reorder-three-outline.svg"
                            style={{ opacity: 0.6, width: 28, height: 28, objectFit: "contain", cursor: "pointer", display: "block" }}
                            alt="Menu"
                        />
                    </div>

                    {/* Logo */}
                    <Link href="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ flexShrink: 1, minWidth: 0 }}>
                        <img
                            src="/images/vtlo.png"
                            style={{ height: 48, width: "auto", maxWidth: "42vw", objectFit: "contain", display: "block" }}
                            alt="Villa Tatilinde"
                        />
                    </Link>

                    {/* Spacer */}
                    <div style={{ flex: 1 }} />

                    {/* Language selector (mobile) */}
                    <div style={{ position: "static", flexShrink: 0 }} ref={langRef}>
                        <div
                            onClick={() => { setLangDropdown(!langDropdown); setCurrDropdown(false); }}
                            className="middle bhs"
                            style={{ padding: "6px 8px", color: "#333", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
                        >
                            <img src={currentLang.flag} style={{ height: 14, width: 20, objectFit: "cover", borderRadius: 2 }} alt="" />
                        </div>

                        {/* Language dropdown */}
                        {langDropdown && (
                            <div
                                style={{
                                    position: "fixed",
                                    top: 65,
                                    right: 12,
                                    background: "#fff",
                                    border: "1px solid #ecf0ef",
                                    borderRadius: 16,
                                    boxShadow: "0 4px 32px rgba(0,0,0,0.15)",
                                    padding: 12,
                                    zIndex: 10001,
                                    minWidth: 150,
                                }}
                            >
                                {languages.map((lang) => (
                                    <div
                                        key={lang.code}
                                        onClick={() => handleLanguageChange(lang.code)}
                                        className="bhbhbg middleft"
                                        style={{ padding: "11px 16px 11px 10px", borderRadius: 8 }}
                                    >
                                        <img src={lang.flag} style={{ height: 13, width: 19, objectFit: "cover", borderRadius: 2, marginRight: 8 }} alt="" />
                                        <span style={{ color: "#333", fontWeight: 600, fontSize: 15 }}>{lang.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Currency selector (mobile) */}
                    <div style={{ position: "static", flexShrink: 0 }} ref={currRef}>
                        <div
                            onClick={() => { setCurrDropdown(!currDropdown); setLangDropdown(false); }}
                            className="bhs middleft"
                            style={{
                                color: "#000",
                                textTransform: "uppercase",
                                fontWeight: 600,
                                fontSize: 13,
                                padding: "6px 8px",
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                            }}
                        >
                            <span>{selectedCurrency.symbol}</span>
                        </div>

                        {/* Currency dropdown */}
                        {currDropdown && (
                            <div
                                style={{
                                    position: "fixed",
                                    top: 65,
                                    right: 12,
                                    background: "#fff",
                                    border: "1px solid #ecf0ef",
                                    borderRadius: 16,
                                    boxShadow: "0 4px 32px rgba(0,0,0,0.15)",
                                    padding: 12,
                                    zIndex: 10001,
                                    minWidth: 130,
                                }}
                            >
                                {CURRENCIES.map((curr, i) => (
                                    <div
                                        key={curr.code}
                                        onClick={() => { setGlobalCurrency(curr.code as CurrencyCode); setCurrDropdown(false); }}
                                        style={{ padding: "10px 12px", borderTop: i > 0 ? "1px solid #f0f0f0" : "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                                    >
                                        <span style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{curr.symbol}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ─── Mobile Menu Panel ─── */}
            <div className={`mobileMenuOverlay ${mobileMenuOpen ? "open" : ""}`} onClick={() => setMobileMenuOpen(false)} />
            <div className={`mobileMenuPanel ${mobileMenuOpen ? "open" : ""}`}>
                <div className="dm-sans">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 30px 4px" }}>
                        <div onClick={() => setMobileMenuOpen(false)} style={{ cursor: "pointer" }}>
                            <div className="middleft">
                                <img src="/images/vtStar.png" style={{ height: 17, marginRight: 8 }} alt="" />
                                <Link href="/" style={{ fontSize: 20, fontWeight: 500 }} className="grText middleft">
                                    Anasayfa
                                </Link>
                            </div>
                        </div>
                        <div 
                            onClick={() => setMobileMenuOpen(false)} 
                            style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "6px", background: "#f1f5f9", borderRadius: "50%", width: "32px", height: "32px" }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </div>
                    </div>
                    <div style={{ padding: "0 30px 24px" }}>
                        {([
                            { href: "/tatil-yerleri", label: "Tatil Yerleri" },
                            { href: "/villa-kategorileri", label: "Villa Kategorileri" },
                            { href: "/indirimli-villalar", label: "İndirimli Villalar" },
                            { href: "/promosyonlar", label: "Promosyonlar" },
                            { href: "/kampanyalar", label: "Kampanyalar" },
                        ] as { href: string; label: string; badge?: string }[]).map((item) => (
                            <div key={item.href} className="middleft" style={{ marginTop: 24 }}>
                                <Link href={item.href} onClick={() => setMobileMenuOpen(false)}>
                                    <div className="middleft">
                                        <img src="/images/vtStar.png" style={{ height: 17, marginRight: 8 }} alt="" />
                                        <div style={{ fontSize: 20, fontWeight: 500 }} className="grText middleft">
                                            {item.label}
                                            {item.badge && (
                                                <div
                                                    style={{
                                                        color: "#fff",
                                                        borderRadius: 12,
                                                        marginLeft: 10,
                                                        padding: "0 5px",
                                                        fontSize: 10,
                                                        fontWeight: 600,
                                                        background: "#6772e5",
                                                    }}
                                                >
                                                    {item.badge}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Bottom links */}
                    <div style={{ color: "#000", fontWeight: 500, fontSize: 17, padding: "24px 30px", borderTop: "2px solid #f6f9fc" }}>
                        <div className="row">
                            <div style={{ width: "50%" }}>
                                {[
                                    { href: "/iletisim", label: "İletişim" },
                                    { href: "/bloglar", label: "Blog Yazılarımız" },
                                    { href: "/bloglar/basinda-biz", label: "Basında Biz" },
                                    { href: "/sikca-sorulan-sorular", label: "Sıkça Sorulan Sorular" },
                                ].map((item) => (
                                    <div key={item.href} className="middleft">
                                        <Link href={item.href} onClick={() => setMobileMenuOpen(false)} style={{ padding: "9px 0" }}>
                                            <span style={{ color: "blue" }}>&bull;</span> {item.label}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                            <div style={{ minWidth: 150, width: "50%" }}>
                                {[
                                    { href: "/sorular", label: "Sorular & Destek" },
                                    { href: "/garantili-villa-kiralama", label: "Garantili Kiralama" },
                                    { href: "/mesafeli-satis-sozlesmesi", label: "Mesafeli Satış Sözleşmesi" },
                                    { href: "/odeme-yontemleri", label: "Ödeme Yöntemleri" },
                                ].map((item) => (
                                    <div key={item.href} className="middleft">
                                        <Link href={item.href} onClick={() => setMobileMenuOpen(false)} style={{ padding: "9px 0" }}>
                                            <span style={{ color: "blue" }}>&bull;</span> {item.label}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Login / Profile button */}
                    <div style={{ background: "#f6f9fc", color: "#000", fontSize: 17, padding: "11px 20px", fontWeight: 600 }}>
                        {user ? (
                            <>
                                <div className="middleft" style={{ padding: "10px 10px 6px" }}>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: "50%",
                                        background: "linear-gradient(135deg, #6772e5, #50b0f0)",
                                        color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                                        fontWeight: 700, fontSize: 16, marginRight: 10, flexShrink: 0,
                                    }}>
                                        {userInitial}
                                    </div>
                                    <div style={{ overflow: "hidden" }}>
                                        <div style={{ fontSize: 16, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{userDisplayName}</div>
                                        <div style={{ fontSize: 12, fontWeight: 400, color: "#888", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{userEmail}</div>
                                    </div>
                                </div>
                                <Link href="/hesabim" onClick={() => setMobileMenuOpen(false)} style={{ padding: "10px 10px", display: "block" }} className="middleft">
                                    Hesabım
                                </Link>
                                <div
                                    onClick={handleLogout}
                                    style={{ padding: "10px 10px", cursor: "pointer", color: "#dc2626" }}
                                    className="middleft"
                                >
                                    Çıkış Yap
                                </div>
                            </>
                        ) : (
                            <Link href="/giris" onClick={() => setMobileMenuOpen(false)} style={{ padding: 10 }} className="middleft">
                                Giriş Yap
                                <img src="/images/cfo.svg" style={{ height: 17, marginLeft: 5 }} alt="" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* ============================================ */}
            {/* DESKTOP NAV — visible >= 1024px             */}
            {/* ============================================ */}
            <div className="no1023 navDes" style={{ position: "sticky", top: 0, borderBottom: "1px solid #eee", background: "#fff", zIndex: 144 }}>
                <div style={{ paddingBottom: 0 }}>
                    <div className="dm-sans" style={{ color: "#0b0a12", fontWeight: 500 }}>
                        {/* ─── TOP BAR: Search, Phone, Currency, Language ─── */}
                        <div className="paddingMobile">
                            <div style={{ paddingRight: 6 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: "0 0 12px 12px", paddingTop: 6, paddingRight: 6, paddingBottom: 7 }}>
                                    
                                    {/* ─── Top Left: Rent Villa & WhatsApp ─── */}
                                    <div className="middle">
                                        <div style={{ marginLeft: 6 }}>
                                            <Link href="/villami-kirala">
                                                <div
                                                    className="middle bhs"
                                                    style={{
                                                        padding: "7px 14px",
                                                        background: "linear-gradient(135deg, #6772e5, #50b0f0)",
                                                        borderRadius: 32,
                                                        border: "none",
                                                        fontSize: 13,
                                                        fontWeight: 600,
                                                        color: "#fff",
                                                    }}
                                                >
                                                    Villamı Kiraya Vermek İstiyorum
                                                </div>
                                            </Link>
                                        </div>
                                        <div style={{ marginLeft: 12 }}>
                                            <a href="https://wa.me/905323990748" target="_blank" rel="noopener noreferrer">
                                                <div
                                                    className="middle bhs"
                                                    style={{
                                                        padding: "7px 14px",
                                                        background: "#25D366",
                                                        borderRadius: 32,
                                                        fontSize: 13,
                                                        fontWeight: 600,
                                                        color: "#fff",
                                                    }}
                                                >
                                                    <img src="/images/wp.svg" style={{ height: 16, marginRight: 6, filter: "brightness(0) invert(1)" }} alt="" />
                                                    WhatsApp Destek
                                                </div>
                                            </a>
                                        </div>
                                    </div>

                                    {/* ─── Top Right: Phone, Currency, Language ─── */}
                                    <div className="middle" style={{}}>
                                        {/* Phone */}
                                        <div style={{ marginLeft: 16 }}>
                                            <a href="tel:+90 242 606 0725">
                                                <div
                                                    className="middle bhs"
                                                    style={{
                                                        padding: "7px 12px 7px 10px",
                                                        background: "#fff",
                                                        borderRadius: 32,
                                                        border: "1px solid #dfdfe3aa",
                                                        fontSize: 14,
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    <img src="/images/sup.png" style={{ height: 16, marginRight: 6 }} alt="" />
                                                    +90 242 606 0725
                                                </div>
                                            </a>
                                        </div>

                                        {/* Currency dropdown (desktop) */}
                                        <div
                                            className="dropOneActivate"
                                            style={{
                                                color: "#000",
                                                textTransform: "uppercase",
                                                fontWeight: 600,
                                                fontSize: 15,
                                                width: 52,
                                                marginLeft: 24,
                                                position: "relative",
                                            }}
                                        >
                                            <div className="bhs" style={{ padding: "6px 0 10px" }}>
                                                <span>{selectedCurrency.symbol}</span>
                                                <span style={{ marginLeft: 3, color: "#000" }}> {selectedCurrency.code.toLowerCase()}</span>
                                            </div>
                                            <div className="dropFour dd0">
                                                {CURRENCIES.map((curr) => (
                                                    <div
                                                        key={curr.code}
                                                        onClick={() => setGlobalCurrency(curr.code as CurrencyCode)}
                                                        className="bhbhbg middleft"
                                                        style={{ padding: "12px 48px 12px 12px", borderRadius: 8 }}
                                                    >
                                                        <div style={{ fontSize: 16, fontWeight: 400 }}>
                                                            {curr.symbol} <span style={{ fontSize: 15, marginLeft: 6 }}>{curr.label}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Language dropdown (desktop) */}
                                        <div
                                            className="dropOneActivate"
                                            style={{
                                                color: "#000",
                                                fontWeight: 600,
                                                fontSize: 15,
                                                width: 80,
                                                marginLeft: 24,
                                                position: "relative",
                                            }}
                                        >
                                            <div className="middle bhs" style={{ padding: "6px 0 10px", marginLeft: 12, color: "#333", fontWeight: 600, fontSize: 15, width: 45, marginRight: 3 }}>
                                                <img src={currentLang.flag} style={{ height: 14, objectFit: "contain", marginRight: 6 }} alt="" />
                                                <span>{currentLang.label}</span>
                                            </div>
                                            <div className="dropThree dd33">
                                                {languages.map((lang) => (
                                                    <div
                                                        key={lang.code}
                                                        onClick={() => handleLanguageChange(lang.code)}
                                                        className="bhbhbg middleft"
                                                        style={{ padding: "12px 48px 12px 8px", borderRadius: 8 }}
                                                    >
                                                        <div className="middleft bhs" style={{ marginLeft: 6, color: "#333", fontWeight: 600, fontSize: 15, width: 35, marginRight: 3 }}>
                                                            <img src={lang.flag} style={{ height: 12, objectFit: "contain", marginRight: 5 }} alt="" />
                                                            <span>{lang.label}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ─── MAIN NAV BAR: Logo + Links + User ─── */}
                        <div className="paddingMobile">
                            <div className="middleft" style={{ marginTop: 2, paddingTop: 3, paddingBottom: 3 }}>
                                {/* Logo */}
                                <Link href="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                                    <img
                                        src="/images/vtlo.png"
                                        className="bhIntense"
                                        style={{ width: "calc(160px + 14vw)", objectFit: "contain" }}
                                        alt="Villa Tatilinde"
                                    />
                                </Link>

                                {/* Nav links */}
                                <div className="middleft afacad desktopNavMid">
                                    <Link href="/tatil-yerleri" style={{ margin: "0 10px" }}>
                                        <div className="middle bhs" style={{ padding: 8, whiteSpace: "nowrap" }}>
                                            Tatil Yerleri
                                        </div>
                                    </Link>
                                    <Link href="/villa-kategorileri" style={{ margin: "0 10px" }}>
                                        <div className="middle bhs" style={{ padding: 8, whiteSpace: "nowrap" }}>
                                            Kategoriler
                                        </div>
                                    </Link>
                                    <Link href="/promosyonlar" style={{ margin: "0 10px" }}>
                                        <div className="middle bhs" style={{ padding: 8, whiteSpace: "nowrap" }}>
                                            Promosyonlar
                                        </div>
                                    </Link>
                                    <Link href="/kampanyalar" style={{ margin: "0 10px" }}>
                                        <div className="middle bhs" style={{ padding: 8, whiteSpace: "nowrap" }}>
                                            Kampanyalar
                                        </div>
                                    </Link>

                                    {/* Destek dropdown */}
                                    <div className="dropOneActivate middle" style={{ position: "relative", margin: "0 10px" }}>
                                        <div className="bhs middle" style={{ padding: "12px 8px", whiteSpace: "nowrap" }}>
                                            Destek
                                            <img src="/images/cfo.svg" style={{ marginLeft: 4, height: 16, transform: "rotate(90deg)" }} alt="" />
                                        </div>
                                        <div className="dropone dd1">
                                            <Link href="/iletisim">
                                                <div className="bhbhbg middleft" style={{ padding: 12, borderRadius: 8 }}>
                                                    <div style={{ fontSize: 16, fontWeight: 500 }}>İletişim</div>
                                                </div>
                                            </Link>
                                            <Link href="/bloglar">
                                                <div className="bhbhbg middleft" style={{ padding: 12, borderRadius: 8 }}>
                                                    <div style={{ fontSize: 16, fontWeight: 500 }}>Blog Yazılarımız</div>
                                                </div>
                                            </Link>
                                            <Link href="/bloglar/basinda-biz">
                                                <div className="bhbhbg middleft" style={{ padding: 12, borderRadius: 8 }}>
                                                    <div style={{ fontSize: 16, fontWeight: 500 }}>Basında Biz</div>
                                                </div>
                                            </Link>
                                            <Link href="/sikca-sorulan-sorular">
                                                <div className="bhbhbg middleft" style={{ padding: 12, borderRadius: 8 }}>
                                                    <div style={{ fontSize: 16, fontWeight: 500 }}>Sıkça Sorulan Sorular</div>
                                                </div>
                                            </Link>
                                            <Link href="/sorular">
                                                <div className="bhbhbg middleft" style={{ padding: 12, borderRadius: 8 }}>
                                                    <div style={{ fontSize: 16, fontWeight: 500 }}>Sorular & Destek</div>
                                                </div>
                                            </Link>
                                            <Link href="/garantili-villa-kiralama">
                                                <div className="bhbhbg middleft" style={{ padding: 12, borderRadius: 8 }}>
                                                    <div style={{ fontSize: 16, fontWeight: 500 }}>Garantili Kiralama</div>
                                                </div>
                                            </Link>
                                            <Link href="/politika/mesafeli-satis-kiralama-sozlesmesi">
                                                <div className="bhbhbg middleft" style={{ padding: 12, borderRadius: 8 }}>
                                                    <div style={{ fontSize: 16, fontWeight: 500 }}>Mesafeli Satış (Kiralama) Sözleşmesi</div>
                                                </div>
                                            </Link>
                                            <Link href="/odeme-yontemleri">
                                                <div className="bhbhbg middleft" style={{ padding: 12, borderRadius: 8 }}>
                                                    <div style={{ fontSize: 16, fontWeight: 500 }}>Ödeme Yöntemleri</div>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Right side: notifications + login */}
                                <div className="middleft" style={{ marginLeft: "auto", fontWeight: 300, fontSize: 13 }}>
                                    {/* Notification bell */}
                                    <Link href="/bildirimler" style={{ position: "relative", paddingLeft: 12, fontSize: 13, display: "flex", alignItems: "center", textDecoration: "none", color: "inherit" }}>
                                        <div className="bhs middle" style={{ padding: 12 }}>
                                            <img src="/images/bellregular.svg" style={{ height: 16, marginTop: 1 }} alt="Notifications" />
                                            {unreadCount > 0 && (
                                                <div style={{ top: 10, right: 10, position: "absolute", width: 6, height: 6, borderRadius: "50%", background: "#e83e8c" }} />
                                            )}
                                        </div>
                                    </Link>

                                    {/* Login / Profile */}
                                    {user ? (
                                        <div ref={profileRef} style={{ position: "relative", marginLeft: 6 }}>
                                            <div
                                                onClick={() => setProfileDropdown(!profileDropdown)}
                                                className="middle bhs"
                                                style={{ cursor: "pointer", padding: "8px 10px 8px 12px" }}
                                            >
                                                <div style={{
                                                    width: 32, height: 32, borderRadius: "50%",
                                                    background: "linear-gradient(135deg, #6772e5, #50b0f0)",
                                                    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                                                    fontWeight: 700, fontSize: 14, flexShrink: 0,
                                                }}>
                                                    {userInitial}
                                                </div>
                                                <div className="afacad" style={{ marginTop: 2, fontSize: 14, fontWeight: 600, marginLeft: 7, maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                    {userDisplayName}
                                                </div>
                                                <img src="/images/cfo.svg" style={{ marginLeft: 4, height: 14, transform: profileDropdown ? "rotate(-90deg)" : "rotate(90deg)", transition: "transform 0.2s" }} alt="" />
                                            </div>
                                            {profileDropdown && (
                                                <div style={{
                                                    position: "absolute", top: 48, right: 0,
                                                    background: "#fff", border: "1px solid #ecf0ef",
                                                    borderRadius: 16,
                                                    boxShadow: "0 0 2px rgba(145,158,171,.2), 0 12px 24px -4px rgba(145,158,171,.12)",
                                                    padding: "8px", zIndex: 999, minWidth: 220,
                                                }}>
                                                    {/* User info header */}
                                                    <div style={{ padding: "12px 12px 10px", borderBottom: "1px solid #f0f0f0", marginBottom: 4 }}>
                                                        <div style={{ fontSize: 15, fontWeight: 600, color: "#333" }}>{userDisplayName}</div>
                                                        <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{userEmail}</div>
                                                    </div>
                                                    {/* Menu items */}
                                                    <Link href="/hesabim" onClick={() => setProfileDropdown(false)}>
                                                        <div className="bhbhbg" style={{ padding: "10px 12px", borderRadius: 8, fontSize: 15, fontWeight: 500, color: "#333", display: "flex", alignItems: "center", gap: 8 }}>
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                                            Hesabım
                                                        </div>
                                                    </Link>
                                                    <div
                                                        onClick={handleLogout}
                                                        className="bhbhbg"
                                                        style={{ padding: "10px 12px", borderRadius: 8, fontSize: 15, fontWeight: 500, color: "#dc2626", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                                                        Çıkış Yap
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Link href="/giris">
                                            <div className="middle" style={{ marginLeft: 6, maxWidth: 160, overflow: "hidden", padding: "12px 10px 12px 12px" }}>
                                                <img src="/images/accountavatar.svg" alt="Account" />
                                                <div className="afacad" style={{ marginTop: 3, fontSize: 14, fontWeight: 600, marginLeft: 7 }}>
                                                    Giriş Yap
                                                </div>
                                            </div>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
