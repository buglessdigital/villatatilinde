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

    /* ─── Auth state listener ─── */
    useEffect(() => {
        // Get current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

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
                    zIndex: 114,
                    background: "#fff",
                    boxShadow: "0 2px 10px rgba(0 0 0/0.1)",
                }}
            >
                <div className="middleft" style={{ padding: "8px 0" }}>
                    {/* Hamburger */}
                    <div style={{ paddingRight: 44 }}>
                        <img
                            onClick={() => setMobileMenuOpen(true)}
                            src="/images/reorder-three-outline.svg"
                            style={{ opacity: 0.6, width: 30, height: 30, objectFit: "contain", cursor: "pointer" }}
                            alt="Menu"
                        />
                    </div>

                    {/* Logo */}
                    <Link href="/" className="ml">
                        <img
                            src="/images/vtlo.png"
                            style={{ height: 57, width: 190, objectFit: "contain" }}
                            alt="Villa Tatilinde"
                        />
                    </Link>

                    {/* Language selector (mobile) */}
                    <div className="middle ml" style={{ position: "relative" }} ref={langRef}>
                        <div
                            onClick={() => { setLangDropdown(!langDropdown); setCurrDropdown(false); }}
                            className="middle bhs"
                            style={{ padding: "4px 0", marginLeft: 12, color: "#333", fontWeight: 600, fontSize: 13 }}
                        >
                            <img src={currentLang.flag} style={{ height: 10, objectFit: "contain", marginRight: 5 }} alt="" />
                            <span>{currentLang.label}</span>
                        </div>

                        {/* Language dropdown */}
                        {langDropdown && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: 32,
                                    right: 0,
                                    background: "#fff",
                                    border: "1px solid #ecf0ef",
                                    borderRadius: 16,
                                    boxShadow: "0 0 2px rgba(145,158,171,.2), 0 12px 24px -4px rgba(145,158,171,.12)",
                                    padding: 16,
                                    zIndex: 999,
                                    minWidth: 140,
                                }}
                            >
                                {languages.map((lang) => (
                                    <div
                                        key={lang.code}
                                        onClick={() => handleLanguageChange(lang.code)}
                                        className="bhbhbg middleft"
                                        style={{ padding: "12px 48px 12px 8px", borderRadius: 8 }}
                                    >
                                        <div className="middleft bhs" style={{ marginLeft: 6, color: "#333", fontWeight: 600, fontSize: 15 }}>
                                            <img src={lang.flag} style={{ height: 12, objectFit: "contain", marginRight: 5 }} alt="" />
                                            <span>{lang.label}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Currency selector (mobile) */}
                    <div style={{ position: "relative" }} ref={currRef}>
                        <div
                            onClick={() => { setCurrDropdown(!currDropdown); setLangDropdown(false); }}
                            className="bhs"
                            style={{
                                textAlign: "right",
                                paddingRight: 2,
                                color: "#000",
                                textTransform: "uppercase",
                                fontWeight: 500,
                                fontSize: 13,
                                width: 34,
                                marginLeft: 12,
                                cursor: "pointer",
                            }}
                        >
                            <span>{selectedCurrency.symbol}</span>
                            <span style={{ marginLeft: 2, color: "#000" }}> {selectedCurrency.code.toLowerCase()}</span>
                        </div>

                        {/* Currency dropdown */}
                        {currDropdown && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: 32,
                                    right: 0,
                                    background: "#fff",
                                    border: "1px solid #ecf0ef",
                                    borderRadius: 16,
                                    boxShadow: "0 0 2px rgba(145,158,171,.2), 0 12px 24px -4px rgba(145,158,171,.12)",
                                    padding: 16,
                                    zIndex: 999,
                                    minWidth: 120,
                                }}
                            >
                                {CURRENCIES.map((curr, i) => (
                                    <div
                                        key={curr.code}
                                        onClick={() => { setGlobalCurrency(curr.code as CurrencyCode); setCurrDropdown(false); }}
                                        style={{ padding: "10px 10px", borderTop: i > 0 ? "1px solid #eee" : "none", cursor: "pointer" }}
                                    >
                                        {curr.symbol}
                                        <span style={{ marginLeft: 2, fontSize: 15, color: "#333" }}>{curr.label}</span>
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
                    <div className="middleft" style={{ padding: "12px 30px 4px" }}>
                        <div onClick={() => setMobileMenuOpen(false)} style={{ marginTop: 20 }}>
                            <div className="middleft">
                                <img src="/images/vtStar.png" style={{ height: 17, marginRight: 8 }} alt="" />
                                <Link href="/" style={{ fontSize: 20, fontWeight: 500 }} className="grText middleft">
                                    Anasayfa
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div style={{ padding: "0 30px 24px" }}>
                        {[
                            { href: "/tatil-yerleri", label: "Tatil Yerleri" },
                            { href: "/villa-kategorileri", label: "Villa Kategorileri" },
                            { href: "/indirimli-villalar", label: "İndirimli Villalar" },
                            { href: "/promosyonlar", label: "Promosyonlar", badge: "YENİ" },
                        ].map((item) => (
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
                                    { href: "/hakkimizda", label: "Hakkımızda" },
                                    { href: "/promosyonlar", label: "Tüm Kampanyalar" },
                                    { href: "/bloglar", label: "Blog" },
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
                                    { href: "/odeme-yontemleri", label: "Ödeme Yöntemleri" },
                                    { href: "/iptal-iade-politikalari", label: "İptal ve İadeler" },
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
                                <div className="middlert" style={{ borderRadius: "0 0 12px 12px", paddingTop: 4, paddingRight: 6, paddingBottom: 5 }}>
                                    <div className="middle" style={{}}>
                                        {/* Search input */}
                                        <div style={{ fontSize: 13, marginTop: 1 }} className="middle">
                                            <div style={{ position: "relative" }}>
                                                <input
                                                    type="text"
                                                    placeholder="Villa ismi ile arayın"
                                                    style={{
                                                        background: "#fff",
                                                        height: 27,
                                                        paddingBottom: 2,
                                                        paddingLeft: 12,
                                                        paddingRight: 36,
                                                        fontWeight: 500,
                                                        width: 264,
                                                        border: "1px solid #dfdfe3",
                                                        borderRadius: 32,
                                                        fontSize: 15,
                                                        outline: "none",
                                                        fontFamily: "'DM Sans', serif",
                                                    }}
                                                />
                                                <button
                                                    style={{
                                                        position: "absolute",
                                                        right: 8,
                                                        top: "50%",
                                                        transform: "translateY(-50%)",
                                                        background: "none",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        padding: 0,
                                                    }}
                                                >
                                                    <img src="/images/search3.png" style={{ height: 13, opacity: 0.9 }} alt="Search" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div style={{ marginLeft: 16 }}>
                                            <a href="tel:+90 242 606 0725">
                                                <div
                                                    className="middle bhs"
                                                    style={{
                                                        padding: "5px 8px 5px 6px",
                                                        background: "#fff",
                                                        borderRadius: 32,
                                                        border: "1px solid #dfdfe3aa",
                                                        fontSize: 11,
                                                        fontWeight: 400,
                                                    }}
                                                >
                                                    <img src="/images/sup.png" style={{ height: 13, marginRight: 4 }} alt="" />
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
                                                fontSize: 13,
                                                width: 40,
                                                marginLeft: 24,
                                                position: "relative",
                                            }}
                                        >
                                            <div className="bhs" style={{ padding: "4px 0 8px" }}>
                                                <span>{selectedCurrency.symbol}</span>
                                                <span style={{ marginLeft: 2, color: "#000" }}> {selectedCurrency.code.toLowerCase()}</span>
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
                                                fontSize: 13,
                                                width: 68,
                                                marginLeft: 24,
                                                position: "relative",
                                            }}
                                        >
                                            <div className="middle bhs" style={{ padding: "4px 0 8px", marginLeft: 12, color: "#333", fontWeight: 600, fontSize: 13, width: 35, marginRight: 3 }}>
                                                <img src={currentLang.flag} style={{ height: 10, objectFit: "contain", marginRight: 5 }} alt="" />
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
                                <Link href="/">
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
                                        <div className="middle bhs" style={{ padding: 8 }}>
                                            Tatil Yerleri
                                        </div>
                                    </Link>
                                    <Link href="/villa-kategorileri" style={{ margin: "0 10px" }}>
                                        <div className="middle bhs" style={{ padding: 8 }}>
                                            Kategoriler
                                        </div>
                                    </Link>
                                    <Link href="/promosyonlar" style={{ margin: "0 10px" }}>
                                        <div className="middle bhs" style={{ padding: 8 }}>
                                            Promosyonlar
                                        </div>
                                    </Link>
                                    <Link href="/iletisim" style={{ margin: "0 10px" }}>
                                        <div className="middle bhs" style={{ padding: 8 }}>
                                            İletişim
                                        </div>
                                    </Link>

                                    {/* Destek dropdown */}
                                    <div className="dropOneActivate middle" style={{ position: "relative", margin: "0 10px" }}>
                                        <div className="bhs middle" style={{ padding: "12px 8px" }}>
                                            Destek
                                            <img src="/images/cfo.svg" style={{ marginLeft: 4, height: 16, transform: "rotate(90deg)" }} alt="" />
                                        </div>
                                        <div className="dropone dd1">
                                            <Link href="/bloglar">
                                                <div className="bhbhbg middleft" style={{ padding: 12, borderRadius: 8 }}>
                                                    <div style={{ fontSize: 16, fontWeight: 500 }}>Blog Yazılarımız</div>
                                                </div>
                                            </Link>
                                            <Link href="/sikca-sorulan-sorular">
                                                <div className="bhbhbg middleft" style={{ padding: 12, borderRadius: 8 }}>
                                                    <div style={{ fontSize: 16, fontWeight: 500 }}>Sıkça Sorulan Sorular</div>
                                                </div>
                                            </Link>
                                            <Link href="/garantili-villa-kiralama">
                                                <div className="bhbhbg middleft" style={{ padding: 12, borderRadius: 8 }}>
                                                    <div style={{ fontSize: 16, fontWeight: 500 }}>Garantili Kiralama</div>
                                                </div>
                                            </Link>
                                            <Link href="/iptal-iade-politikalari">
                                                <div className="bhbhbg middleft" style={{ padding: 12, borderRadius: 8 }}>
                                                    <div style={{ fontSize: 16, fontWeight: 500 }}>İptal ve İade Politikası</div>
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
                                    <div className="dropOneActivate middle" style={{ position: "relative", paddingLeft: 12, fontSize: 13 }}>
                                        <div className="bhs middle" style={{ padding: 12 }}>
                                            <img src="/images/bellregular.svg" style={{ height: 16, marginTop: 1 }} alt="Notifications" />
                                            <div
                                                style={{
                                                    top: 10,
                                                    right: 10,
                                                    position: "absolute",
                                                    width: 6,
                                                    height: 6,
                                                    borderRadius: "50%",
                                                    background: "#e83e8c",
                                                }}
                                            />
                                        </div>
                                        <div className="droptwo dd2">
                                            <div className="middleft" style={{ padding: "12px 8px 12px 0", borderBottom: "2px solid rgb(235, 238, 245)" }}>
                                                <div style={{ borderRadius: 8, fontWeight: 700, fontSize: 18, color: "#333" }}>
                                                    Bildirimlerim
                                                </div>
                                                <div style={{ color: "#333", fontWeight: 300, background: "#3297d322", padding: "5px 6px", fontSize: 12, borderRadius: 6, marginLeft: "auto" }}>
                                                    2 yeni bildirim
                                                </div>
                                            </div>
                                            <div className="notifItem bhbhbg">
                                                <div className="oneLine" style={{ width: "75%" }}>
                                                    Canlı destek için hafta içi ve hafta sonu hergün 09:00 - 22:00 arası buradayız
                                                </div>
                                                <div style={{ position: "absolute", right: 8, top: 4, padding: "4px 8px", background: "#3297d322", fontWeight: 300, fontSize: 12, color: "#333", borderRadius: 8 }}>
                                                    chat
                                                </div>
                                            </div>
                                            <div className="notifItem bhbhbg">
                                                <div className="oneLine" style={{ width: "75%" }}>
                                                    İndirimden faydalanmak için hesabım &gt; İndirim QR oluştur sayfasına gidebilirsiniz
                                                </div>
                                                <div style={{ position: "absolute", right: 8, top: 4, padding: "4px 8px", background: "#3297d322", fontWeight: 300, fontSize: 12, color: "#333", borderRadius: 8 }}>
                                                    promosyon
                                                </div>
                                            </div>
                                        </div>
                                    </div>

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
