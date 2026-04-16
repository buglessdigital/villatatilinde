"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Suspense } from "react";

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [message, setMessage] = useState("Hesabınız doğrulanıyor, lütfen bekleyin...");

    useEffect(() => {
        const handleCallback = async () => {
            const error = searchParams.get("error");
            const errorDescription = searchParams.get("error_description");
            const code = searchParams.get("code");

            if (error || errorDescription) {
                setMessage(`Giriş hatası: ${errorDescription || error}. Yönlendiriliyorsunuz...`);
                setTimeout(() => router.push("/giris"), 3000);
                return;
            }

            const nextPath = searchParams.get("next") || "/";

            if (code) {
                const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
                if (exchangeError) {
                    setMessage("Giriş işlemi başarısız. Yönlendiriliyorsunuz...");
                    setTimeout(() => router.push("/giris"), 3000);
                    return;
                }
                router.push(nextPath);
                return;
            }

            // Fallback: check for existing session (implicit flow / hash tokens)
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.push(nextPath);
            } else {
                setTimeout(() => router.push("/"), 3000);
            }
        };

        handleCallback();
    }, [router, searchParams]);

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

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh"
            }}>
                <p>Yükleniyor...</p>
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}
