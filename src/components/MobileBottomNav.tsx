"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function MobileBottomNav() {
    const pathname = usePathname();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        async function fetchUnread() {
            try {
                const email = localStorage.getItem("vt_user_email");
                if (!email) return;
                const readIds: string[] = JSON.parse(localStorage.getItem("vt_read_question_ids") || "[]");
                const { data } = await supabase
                    .from("villa_questions")
                    .select("id")
                    .eq("user_email", email)
                    .eq("is_answered", true);
                if (data) {
                    const unread = data.filter((q: any) => !readIds.includes(q.id)).length;
                    setUnreadCount(unread);
                }
            } catch (_) {}
        }
        fetchUnread();
        // Re-check when notifications page marks them as read
        window.addEventListener("vt_notifications_read", fetchUnread);
        return () => window.removeEventListener("vt_notifications_read", fetchUnread);
    }, []);

    // Do not show on admin routes or villa details
    if (pathname.startsWith("/admin") || pathname.startsWith("/tatilvillasi/")) return null;

    const isSearchRoute = pathname.startsWith("/sonuclar");

    const defaultNavItems = [
        {
            label: "Ana sayfa",
            icon: (
                <svg viewBox="0 0 24 24" fill={pathname === "/" ? "#3B82F6" : "#6b7280"} width="26" height="26">
                    <path d="M12 3l9 8h-3v10H15v-6H9v6H6V11H3l9-8z" />
                </svg>
            ),
            path: "/",
            color: pathname === "/" ? "#3B82F6" : "#4b5563"
        },
        {
            label: "Fırsatlar",
            icon: (
                <svg viewBox="0 0 24 24" fill={pathname === "/indirimli-villalar" ? "#222" : "#6b7280"} width="26" height="26">
                    <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.41l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.41zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" />
                </svg>
            ),
            path: "/indirimli-villalar",
            color: pathname === "/indirimli-villalar" ? "#222" : "#4b5563"
        },
        {
            label: "WhatsApp",
            icon: (
                <svg viewBox="0 0 24 24" fill="#25D366" width="26" height="26">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 2.17.69 4.18 1.86 5.86L3 22l4.28-.84C8.83 23.01 10.37 23 12 23c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.83 14.33c-.26.74-1.27 1.46-1.92 1.55-.54.08-1.23.23-3.83-.84-3.14-1.3-5.18-4.51-5.33-4.71-.16-.21-1.28-1.7-1.28-3.24 0-1.54.8-2.31 1.08-2.61.28-.31.62-.39.83-.39.21 0 .42 0 .61.01.19.01.44-.07.67.48.24.56.81 1.99.88 2.14.08.15.13.33.02.54-.11.21-.16.33-.32.53-.15.18-.33.39-.47.53-.16.16-.33.34-.14.67.18.32.81 1.34 1.74 2.16 1.2.11 2.21.46 2.44.6.24.13.37.11.51-.05.15-.17.65-.75.82-1.01.17-.26.34-.22.65-.11.31.11 1.94.91 2.28 1.08.33.17.56.26.64.4.08.14.08.82-.18 1.56z" />
                </svg>
            ),
            path: "https://wa.me/905323990748",
            color: "#4b5563",
            external: true
        },
        {
            label: "Bildirimlerim",
            icon: (
                <div style={{ position: "relative" }}>
                    <svg viewBox="0 0 24 24" fill={pathname === "/bildirimler" ? "#222" : "#6b7280"} width="26" height="26">
                        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                    </svg>
                    {unreadCount > 0 && (
                    <div style={{
                        position: "absolute",
                        top: -4,
                        right: -6,
                        backgroundColor: "#ef4444",
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: 700,
                        width: 16,
                        height: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        lineHeight: 1
                    }}>
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </div>
                    )}
                </div>
            ),
            path: "/bildirimler",
            color: pathname === "/bildirimler" ? "#222" : "#4b5563"
        },
        {
            label: "Hesabım",
            icon: (
                <svg viewBox="0 0 24 24" fill={pathname === "/hesabim" ? "#222" : "#6b7280"} width="26" height="26">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
            ),
            path: "/hesabim",
            color: pathname === "/hesabim" ? "#222" : "#4b5563"
        }
    ];

    const searchNavItems = [
        {
            label: "Ana sayfa",
            icon: (
                <svg viewBox="0 0 24 24" fill={pathname === "/" ? "#3B82F6" : "#6b7280"} width="26" height="26">
                    <path d="M12 3l9 8h-3v10H15v-6H9v6H6V11H3l9-8z" />
                </svg>
            ),
            path: "/",
            color: pathname === "/" ? "#3B82F6" : "#4b5563",
            external: false
        },
        {
            // Note: Since this redirects to the map URL with the current parameters, you can format it suitably.
            // For now, it stays on a placeholder or links to /harita with standard current search params.
            label: "Harita Görünümü",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
                    <path d="M9 3L5 5v16l4-2z"></path>
                    <path d="M9 3v16l6 2V5z"></path>
                    <path d="M15 5l4-2v16l-4 2z"></path>
                </svg>
            ),
            // Keeping "/harita" to match convention. Adapt query strings if required.
            path: "/harita",
            color: pathname === "/harita" ? "#222" : "#4b5563",
            external: false
        },
        {
            label: "Bildirimlerim",
            icon: (
                <div style={{ position: "relative" }}>
                    <svg viewBox="0 0 24 24" fill={pathname === "/bildirimler" ? "#222" : "#6b7280"} width="26" height="26">
                        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                    </svg>
                    {unreadCount > 0 && (
                    <div style={{
                        position: "absolute",
                        top: -4,
                        right: -6,
                        backgroundColor: "#ef4444",
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: 700,
                        width: 16,
                        height: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        lineHeight: 1
                    }}>
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </div>
                    )}
                </div>
            ),
            path: "/bildirimler",
            color: pathname === "/bildirimler" ? "#222" : "#4b5563",
            external: false
        },
        {
            label: "Hesabım",
            icon: (
                <svg viewBox="0 0 24 24" fill={pathname === "/hesabim" ? "#222" : "#6b7280"} width="26" height="26">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
            ),
            path: "/hesabim",
            color: pathname === "/hesabim" ? "#222" : "#4b5563",
            external: false
        }
    ];

    const activeNavItems = isSearchRoute ? searchNavItems : defaultNavItems;

    return (
        <>
            {/* Nav container */}
            <div className="no1024 mobile-bottom-nav-wrapper" style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                height: 65,
                backgroundColor: "#fff",
                borderTop: "1px solid #f0f0f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 10px",
                paddingBottom: "env(safe-area-inset-bottom)",
                zIndex: 99999,
                boxShadow: "0 -2px 10px rgba(0,0,0,0.03)"
            }}>
                {activeNavItems.map((item, idx) => (
                    item.external ? (
                        <a
                            key={idx}
                            href={item.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                flex: 1,
                                minWidth: 0,
                                overflow: "hidden",
                                textDecoration: "none"
                            }}
                        >
                            <div style={{ marginBottom: 4, flexShrink: 0 }}>{item.icon}</div>
                            <span style={{ fontSize: 10, fontWeight: 500, color: item.color, letterSpacing: "-0.2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%", width: "100%", textAlign: "center", display: "block" }}>{item.label}</span>
                        </a>
                    ) : (
                        <Link
                            key={idx}
                            href={item.path}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                flex: 1,
                                minWidth: 0,
                                overflow: "hidden",
                                textDecoration: "none"
                            }}
                        >
                            <div style={{ marginBottom: 4, flexShrink: 0 }}>{item.icon}</div>
                            <span style={{ fontSize: 10, fontWeight: item.path === pathname ? 600 : 500, color: item.color, letterSpacing: "-0.2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%", width: "100%", textAlign: "center", display: "block" }}>{item.label}</span>
                        </Link>
                    )
                ))}
            </div>

            {/* Spacer to prevent content from hiding behind the navbar */}
            <div className="no1024 mobile-bottom-nav-wrapper" style={{ height: "calc(65px + env(safe-area-inset-bottom))" }} />
        </>
    );
}
