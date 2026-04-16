"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

export default function SiteShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    // Supabase bazen OAuth token'ı /auth/callback yerine root'a yönlendirebilir.
    // Hash'te access_token varsa /auth/callback'e taşıyoruz.
    useEffect(() => {
        if (typeof window === "undefined") return;
        const hash = window.location.hash;
        if (hash && hash.includes("access_token") && pathname === "/") {
            router.replace("/auth/callback" + hash);
        }
    }, [pathname, router]);

    // Sayfa değiştirildiğinde veya yenilendiğinde en üste kaydırmayı zorla
    useEffect(() => {
        if (typeof window !== "undefined") {
            // Tarayıcının önceki scroll pozisyonunu hatırlamasını engelle
            if ("scrollRestoration" in window.history) {
                window.history.scrollRestoration = "manual";
            }
            // Sayfanın en üstüne anında git
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }
    }, [pathname]);
    const isAdmin = pathname.startsWith("/admin");

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <>
            <Navbar />
            {children}
            <MobileBottomNav />
            <Footer />
        </>
    );
}
