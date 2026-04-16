"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Promotion {
    id: string;
    title: string;
}

export default function KuponOlusturPage() {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [name, setName] = useState("");
    const [pnr, setPnr] = useState("");
    const [selectedPromo, setSelectedPromo] = useState("");
    const [loading, setLoading] = useState(false);
    const [successCode, setSuccessCode] = useState("");

    useEffect(() => {
        async function fetchPromotions() {
            const { data } = await supabase
                .from("promotions")
                .select("id, title")
                .eq("is_active", true);
            if (data) {
                setPromotions(data);
            }
        }
        fetchPromotions();
    }, []);

    const generateCode = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let code = "VT-";
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const generatedCode = generateCode();
        const promoName = promotions.find(p => p.id === selectedPromo)?.title || selectedPromo;

        const { error } = await supabase.from("coupon_requests").insert([
            {
                customer_name: name,
                pnr_number: pnr,
                promotion_name: promoName,
                coupon_code: generatedCode,
            }
        ]);

        if (error) {
            console.error("Kupon kaydedilemedi:", error);
            alert("Bir hata oluştu, lütfen daha sonra tekrar deneyin.");
        } else {
            setSuccessCode(generatedCode);
        }

        setLoading(false);
    };

    return (
        <div style={{ minHeight: "80vh", background: "#f8f9fa", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ background: "#fff", padding: 40, borderRadius: 16, boxShadow: "0 4px 16px rgba(0,0,0,0.05)", maxWidth: 500, width: "100%", fontFamily: "'Poppins', sans-serif" }}>
                <h1 style={{ textAlign: "center", marginBottom: 24, fontSize: 24, fontWeight: 600 }}>Promosyon Kuponu Oluştur</h1>
                
                {successCode ? (
                    <div style={{ textAlign: "center", padding: 20, background: "#f0fdf4", borderRadius: 12, border: "1px solid #dcfce7" }}>
                        <div style={{ fontSize: 16, color: "#166534", marginBottom: 16 }}>Tebrikler! Kupon kodunuz başarıyla oluşturuldu.</div>
                        <div style={{ fontSize: 32, fontWeight: 700, color: "#15803d", letterSpacing: 2 }}>{successCode}</div>
                        <div style={{ fontSize: 14, color: "#166534", marginTop: 16 }}>Lütfen bu kodu rezervasyonunuz sırasında veya faydalanacağınız tesiste ibraz ediniz.</div>
                        <button 
                            onClick={() => { setSuccessCode(""); setName(""); setPnr(""); setSelectedPromo(""); }}
                            style={{ background: "#15803d", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 8, marginTop: 24, cursor: "pointer", fontWeight: 500 }}
                        >
                            Yeni Kupon Oluştur
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <label style={{ fontSize: 14, fontWeight: 500 }}>Ad Soyad</label>
                            <input 
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                style={{ padding: 12, borderRadius: 8, border: "1px solid #ddd", fontSize: 15 }}
                                placeholder="Örn: Ahmet Yılmaz"
                            />
                        </div>
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <label style={{ fontSize: 14, fontWeight: 500 }}>Rezervasyon / PNR Numaranız</label>
                            <input 
                                type="text"
                                value={pnr}
                                onChange={(e) => setPnr(e.target.value)}
                                required
                                style={{ padding: 12, borderRadius: 8, border: "1px solid #ddd", fontSize: 15 }}
                                placeholder="Örn: PNR123456"
                            />
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <label style={{ fontSize: 14, fontWeight: 500 }}>Faydalanmak İstediğiniz Ayrıcalık</label>
                            <select 
                                value={selectedPromo}
                                onChange={(e) => setSelectedPromo(e.target.value)}
                                required
                                style={{ padding: 12, borderRadius: 8, border: "1px solid #ddd", fontSize: 15 }}
                            >
                                <option value="" disabled>Lütfen bir promosyon seçin</option>
                                {promotions.map(p => (
                                    <option key={p.id} value={p.id}>{p.title}</option>
                                ))}
                            </select>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            style={{ 
                                background: "#0cbc87", 
                                color: "#fff", 
                                border: "none", 
                                padding: 14, 
                                borderRadius: 8, 
                                fontSize: 16, 
                                fontWeight: 600, 
                                cursor: loading ? "not-allowed" : "pointer",
                                opacity: loading ? 0.7 : 1,
                                marginTop: 10
                            }}
                        >
                            {loading ? "Oluşturuluyor..." : "Kupon Kodu Oluştur"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
