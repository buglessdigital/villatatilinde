"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentUser, isAdmin, signOut } from "@/lib/auth";
import Link from "next/link";

/* ─── Sidebar Menu Items ─── */
const menuItems = [
    { label: "Dashboard", href: "/admin", icon: "📊" },
    { label: "Villalar", href: "/admin/villalar", icon: "🏠" },
    { label: "Bloglar", href: "/admin/bloglar", icon: "📝" },
    { label: "SSS", href: "/admin/sss", icon: "❓" },
    { label: "Kategoriler", href: "/admin/kategoriler", icon: "📂" },
    { label: "Destinasyonlar", href: "/admin/destinasyonlar", icon: "📍" },
    { label: "Politikalar", href: "/admin/politikalar", icon: "📜" },
    { label: "Rezervasyonlar", href: "/admin/rezervasyonlar", icon: "📅" },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);
    const [checking, setChecking] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userEmail, setUserEmail] = useState("");

    // Giriş sayfasında layout uygulamaya gerek yok
    const isLoginPage = pathname === "/admin/login";

    useEffect(() => {
        // Login sayfasında auth kontrolü yapma
        if (isLoginPage) {
            setChecking(false);
            setAuthorized(true);
            return;
        }

        async function checkAuth() {
            const user = await getCurrentUser();
            if (!user) {
                router.replace("/admin/login");
                return;
            }

            const adminCheck = await isAdmin();
            if (!adminCheck) {
                await signOut();
                router.replace("/admin/login");
                return;
            }

            setUserEmail(user.email || "");
            setAuthorized(true);
            setChecking(false);
        }
        checkAuth();
    }, [pathname, router, isLoginPage]);

    // Login sayfası için layout uygulamadan direkt children göster
    if (isLoginPage) {
        return <>{children}</>;
    }

    // Auth kontrol ediliyor
    if (checking) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#0f172a",
                color: "#94a3b8",
                fontSize: 16,
                fontFamily: "'DM Sans', sans-serif",
            }}>
                Yetki kontrol ediliyor...
            </div>
        );
    }

    if (!authorized) return null;

    const handleSignOut = async () => {
        await signOut();
        router.replace("/admin/login");
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
            {/* ─── Sidebar ─── */}
            <aside
                style={{
                    width: sidebarOpen ? 250 : 64,
                    background: "#0f172a",
                    borderRight: "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    flexDirection: "column",
                    transition: "width 0.2s ease",
                    overflow: "hidden",
                    flexShrink: 0,
                }}
            >
                {/* Logo */}
                <div style={{
                    padding: sidebarOpen ? "20px 20px 16px" : "20px 12px 16px",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                    {sidebarOpen && (
                        <Link href="/admin" style={{ textDecoration: "none" }}>
                            <div style={{ color: "#fff", fontSize: 18, fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>
                                Admin Panel
                            </div>
                        </Link>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{
                            background: "rgba(255,255,255,0.06)",
                            border: "none",
                            color: "#94a3b8",
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            cursor: "pointer",
                            fontSize: 16,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {sidebarOpen ? "◀" : "▶"}
                    </button>
                </div>

                {/* Menu Items */}
                <nav style={{ flex: 1, padding: "12px 8px" }}>
                    {menuItems.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                        padding: sidebarOpen ? "10px 14px" : "10px 12px",
                                        marginBottom: 4,
                                        borderRadius: 10,
                                        background: active ? "rgba(80, 176, 240, 0.15)" : "transparent",
                                        color: active ? "#50b0f0" : "#94a3b8",
                                        fontSize: 14,
                                        fontWeight: active ? 600 : 400,
                                        cursor: "pointer",
                                        transition: "all 0.15s",
                                    }}
                                >
                                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                                    {sidebarOpen && <span>{item.label}</span>}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info Footer */}
                <div style={{
                    padding: sidebarOpen ? "16px 20px" : "16px 12px",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                }}>
                    {sidebarOpen && (
                        <div style={{
                            fontSize: 12,
                            color: "rgba(255,255,255,0.4)",
                            marginBottom: 8,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}>
                            {userEmail}
                        </div>
                    )}
                    <button
                        onClick={handleSignOut}
                        style={{
                            width: "100%",
                            padding: "8px 12px",
                            borderRadius: 8,
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            background: "rgba(239, 68, 68, 0.1)",
                            color: "#f87171",
                            fontSize: 13,
                            cursor: "pointer",
                        }}
                    >
                        {sidebarOpen ? "Çıkış Yap" : "🚪"}
                    </button>
                </div>
            </aside>

            {/* ─── Main Content ─── */}
            <main style={{
                flex: 1,
                background: "#f8fafc",
                minHeight: "100vh",
                overflow: "auto",
            }}>
                {/* Top Bar */}
                <div style={{
                    padding: "16px 32px",
                    background: "#fff",
                    borderBottom: "1px solid #e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                    <div style={{ fontSize: 14, color: "#64748b" }}>
                        Villa Tatilinde Yönetim Paneli
                    </div>
                    <Link href="/" style={{
                        fontSize: 13,
                        color: "#50b0f0",
                        textDecoration: "none",
                    }}>
                        Siteyi Görüntüle →
                    </Link>
                </div>

                {/* Page Content */}
                <div style={{ padding: "24px 32px" }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
