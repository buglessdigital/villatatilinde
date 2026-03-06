"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
    const router = useRouter();
    const [message, setMessage] = useState("Hesabınız doğrulanıyor, lütfen bekleyin...");

    useEffect(() => {
        const checkAuth = async () => {
            // If the URL contains an error description, show it
            const params = new URLSearchParams(window.location.search);
            const hashParams = new URLSearchParams(window.location.hash.replace("#", "?"));

            const errorDesc = params.get("error_description") || hashParams.get("error_description");
            if (errorDesc) {
                setMessage(`Giriş hatası: ${errorDesc}. Yönlendiriliyorsunuz...`);
                setTimeout(() => router.push("/giris"), 4000);
                return;
            }

            // Let supabase process the code or token from URL. 
            // We listen to the auth state change:
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                if (event === "SIGNED_IN" || session) {
                    router.push("/");
                }
            });

            // Also check immediately in case it's already done
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.push("/");
            } else {
                // Fallback redirect if something gets stuck
                setTimeout(() => {
                    router.push("/");
                }, 5000);
            }

            return () => {
                subscription.unsubscribe();
            };
        };

        checkAuth();
    }, [router]);

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            fontFamily: "var(--font-dm-sans), sans-serif",
            flexDirection: "column",
            gap: "1rem"
        }}>
            <div style={{
                width: "40px",
                height: "40px",
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #6772e5",
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
            }}>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
            <p style={{ fontSize: "16px", color: "#333", fontWeight: 500 }}>
                {message}
            </p>
        </div>
    );
}
