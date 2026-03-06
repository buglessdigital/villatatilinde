"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function GirisPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Hide the main site footer on this page
    useEffect(() => {
        const siteFooter = document.querySelector(".site-footer") as HTMLElement;
        if (siteFooter) siteFooter.style.display = "none";
        return () => {
            if (siteFooter) siteFooter.style.display = "";
        };
    }, []);

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/`,
                    },
                });
                if (error) {
                    setError(error.message);
                } else {
                    setSuccess("Kayıt başarılı! Lütfen e-posta adresinizi doğrulayın.");
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) {
                    setError(error.message);
                } else {
                    router.push("/");
                }
            }
        } catch (err) {
            setError("Bir hata oluştu. Lütfen tekrar deneyin.");
            console.error("Auth error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError("");
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });
            if (error) {
                setError(error.message);
            }
        } catch (err) {
            setError("Google ile giriş yapılırken bir hata oluştu.");
            console.error("Google login error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="giris-page-wrapper">
            {/* ─── Main Content ─── */}
            <div className="giris-content">
                {/* Left side - Image */}
                <div className="giris-left">
                    <Image
                        src="/images/01.jpg"
                        alt="Villa Tatilinde"
                        fill
                        style={{ objectFit: "cover" }}
                        priority
                    />
                </div>

                {/* Right side - Form */}
                <div className="giris-right">
                    <div className="giris-form-container">
                        {/* Logo */}
                        <div className="giris-logo no1023">
                            <Image
                                src="/images/vtlo.png"
                                alt="Villa Tatilinde"
                                width={280}
                                height={80}
                                style={{ objectFit: "contain", height: "auto", maxHeight: 96 }}
                            />
                        </div>

                        {/* Title */}
                        <h1 className="giris-title afacad">
                            {isSignUp ? "Üye Ol" : "Giriş Yapın"}
                        </h1>

                        {/* Terms text */}
                        <div className="giris-terms">
                            Abone olarak,{" "}
                            <Link href="/sartlar-kosullar" style={{ textDecoration: "underline" }}>
                                şartlar ve koşulları
                            </Link>{" "}
                            kabul etmiş ve{" "}
                            <Link href="/gizlilik-politikasi" style={{ textDecoration: "underline" }}>
                                gizlilik politikamızı
                            </Link>{" "}
                            onaylamış olursunuz.
                        </div>

                        {/* Error / Success Messages */}
                        {error && (
                            <div style={{
                                background: "#fee2e2",
                                color: "#dc2626",
                                padding: "10px 14px",
                                borderRadius: "8px",
                                fontSize: "14px",
                                marginTop: "16px",
                            }}>
                                {error}
                            </div>
                        )}
                        {success && (
                            <div style={{
                                background: "#dcfce7",
                                color: "#16a34a",
                                padding: "10px 14px",
                                borderRadius: "8px",
                                fontSize: "14px",
                                marginTop: "16px",
                            }}>
                                {success}
                            </div>
                        )}

                        {/* Email/Password Form */}
                        <form onSubmit={handleEmailAuth} style={{ marginTop: "20px" }}>
                            <label htmlFor="email" className="giris-label">
                                E-posta
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="E-posta adresiniz"
                                className="giris-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <label htmlFor="password" className="giris-label" style={{ marginTop: "12px" }}>
                                Şifre
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Şifreniz"
                                className="giris-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />

                            <button
                                id="email-sign-in-button"
                                type="submit"
                                className="giris-submit-btn"
                                disabled={loading}
                                style={{ marginTop: "16px" }}
                            >
                                {loading
                                    ? "İşleniyor..."
                                    : isSignUp
                                        ? "ÜYE OL"
                                        : "GİRİŞ YAP"}
                            </button>
                        </form>

                        {/* Divider */}
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            margin: "20px 0",
                            gap: "12px",
                        }}>
                            <div style={{ flex: 1, height: "1px", background: "#ddd" }} />
                            <span style={{ color: "#888", fontSize: "14px" }}>veya</span>
                            <div style={{ flex: 1, height: "1px", background: "#ddd" }} />
                        </div>

                        {/* Google Sign In Button */}
                        <button
                            id="google-sign-in-button"
                            type="button"
                            className="giris-submit-btn"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "12px",
                                background: "#fff",
                                color: "#222",
                                border: "1px solid #ddd",
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 48 48">
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                            </svg>
                            Google ile Giriş Yap
                        </button>

                        {/* Toggle Sign Up / Sign In */}
                        <div style={{
                            textAlign: "center",
                            marginTop: "24px",
                            paddingTop: "20px",
                            borderTop: "1px solid #eee",
                        }}>
                            <p style={{ color: "#555", fontSize: "15px", marginBottom: "8px" }}>
                                {isSignUp
                                    ? "Zaten üye misiniz?"
                                    : "Henüz üye değil misiniz?"}
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsSignUp(!isSignUp);
                                    setError("");
                                    setSuccess("");
                                }}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#2563eb",
                                    fontSize: "15px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                    padding: 0,
                                }}
                            >
                                {isSignUp ? "Giriş Yap" : "Üye Ol"}
                            </button>
                        </div>

                        {/* Help link */}
                        <div className="giris-help">
                            <Link href="/iletisim">
                                <span className="giris-help-link">
                                    Yardıma mı ihtiyacınız var?
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Simple Footer ─── */}
            <div className="giris-footer">
                <div className="giris-footer-inner">
                    <div className="giris-footer-left">
                        <div>
                            &copy; 2024{" "}
                            <span className="skiptranslate">Villa Tatilinde</span>
                            <br />
                            Belge No: 18069 - PRAEDIUM GROUP TRAVEL AGENCY
                        </div>
                    </div>
                    <div className="giris-footer-right">
                        <Link href="/sartlar-kosullar">Kullanım Koşulları</Link>
                        <Link href="/gizlilik-politikasi" style={{ marginLeft: 26 }}>
                            Gizlilik
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
