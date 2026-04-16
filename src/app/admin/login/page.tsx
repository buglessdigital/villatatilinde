"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmail } from "@/lib/auth";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const result = await signInWithEmail(email, password);

        if (result.error) {
            setError(result.error);
            setLoading(false);
            return;
        }

        router.push("/admin");
    };

    return (
        <div style={styles.wrapper}>
            {/* Background gradient */}
            <div style={styles.bgGradient} />

            <div style={styles.card}>
                {/* Logo */}
                <div style={styles.logoWrap}>
                    <img
                        src="/images/logo.png"
                        alt="Villa Tatilinde"
                        style={styles.logo}
                    />
                </div>

                <h1 style={styles.title}>Admin Paneli</h1>
                <p style={styles.subtitle}>Yönetim paneline giriş yapın</p>

                {/* Error message */}
                {error && (
                    <div style={styles.errorBox}>
                        <span style={{ marginRight: 8 }}>⚠️</span>
                        {error}
                    </div>
                )}

                {/* Login form */}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>E-posta Adresi</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@villatatilinde.com"
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Şifre</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            style={styles.input}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...styles.button,
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                    >
                        {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                    </button>
                </form>

                <div style={styles.footer}>
                    <a href="/" style={styles.footerLink}>
                        ← Ana Sayfaya Dön
                    </a>
                </div>
            </div>
        </div>
    );
}

/* ─── Inline Styles ─── */
const styles: Record<string, React.CSSProperties> = {
    wrapper: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
    },
    bgGradient: {
        position: "absolute",
        inset: 0,
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
        zIndex: 0,
    },
    card: {
        position: "relative",
        zIndex: 1,
        width: "100%",
        maxWidth: 420,
        margin: "20px",
        padding: "40px 36px",
        borderRadius: 20,
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    },
    logoWrap: {
        textAlign: "center" as const,
        marginBottom: 24,
    },
    logo: {
        height: 48,
        objectFit: "contain" as const,
        filter: "brightness(0) invert(1)",
    },
    title: {
        textAlign: "center" as const,
        fontSize: 26,
        fontWeight: 700,
        color: "#fff",
        marginBottom: 6,
        fontFamily: "'Poppins', sans-serif",
    },
    subtitle: {
        textAlign: "center" as const,
        fontSize: 14,
        color: "rgba(255,255,255,0.5)",
        marginBottom: 28,
    },
    errorBox: {
        background: "rgba(239, 68, 68, 0.15)",
        border: "1px solid rgba(239, 68, 68, 0.3)",
        borderRadius: 10,
        padding: "12px 16px",
        color: "#fca5a5",
        fontSize: 13,
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
    },
    form: {
        display: "flex",
        flexDirection: "column" as const,
        gap: 18,
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column" as const,
        gap: 6,
    },
    label: {
        fontSize: 13,
        fontWeight: 500,
        color: "rgba(255,255,255,0.7)",
    },
    input: {
        width: "100%",
        padding: "12px 16px",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.15)",
        background: "rgba(255,255,255,0.08)",
        color: "#fff",
        fontSize: 15,
        outline: "none",
        transition: "border-color 0.2s",
        boxSizing: "border-box" as const,
    },
    button: {
        width: "100%",
        padding: "14px",
        borderRadius: 10,
        border: "none",
        background: "linear-gradient(135deg, #50b0f0, #3b82f6)",
        color: "#fff",
        fontSize: 15,
        fontWeight: 600,
        marginTop: 8,
        transition: "opacity 0.2s, transform 0.1s",
    },
    footer: {
        textAlign: "center" as const,
        marginTop: 24,
    },
    footerLink: {
        color: "rgba(255,255,255,0.4)",
        fontSize: 13,
        textDecoration: "none",
    },
};
