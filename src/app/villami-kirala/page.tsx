"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function VillamiKiralaPage() {
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone_code: "+90",
        phone_number: "",
        location: "",
        tourism_license_no: "",
        pool_type: "Özel Havuz",
        notes: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const { error: insertError } = await supabase
                .from("villa_applications")
                .insert([
                    {
                        full_name: formData.full_name,
                        email: formData.email,
                        phone_code: formData.phone_code,
                        phone_number: formData.phone_number,
                        location: formData.location,
                        tourism_license_no: formData.tourism_license_no || null,
                        pool_type: formData.pool_type,
                        notes: formData.notes || null,
                        status: "pending",
                    }
                ]);

            if (insertError) throw insertError;

            setSuccess(true);
            setFormData({
                full_name: "",
                email: "",
                phone_code: "+90",
                phone_number: "",
                location: "",
                tourism_license_no: "",
                pool_type: "Özel Havuz",
                notes: "",
            });
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err: any) {
            console.error("Başvuru hatası:", err);
            setError(err.message || "Bir hata oluştu, lütfen daha sonra tekrar deneyin.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ minHeight: "80vh", backgroundColor: "#fafafa" }}>
            {/* Header Area */}
            <div
                style={{
                    background: "linear-gradient(135deg, #0ba360 0%, #3cba92 100%)",
                    padding: "4rem 1rem",
                    textAlign: "center",
                    color: "white"
                }}
            >
                <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "1rem", letterSpacing: "-0.5px" }}>
                    Villamı Kiraya Vermek İstiyorum
                </h1>
                <p style={{ fontSize: "1.1rem", maxWidth: 600, margin: "0 auto", opacity: 0.9 }}>
                    Villanızı platformumuz üzerinden binlerce tatilciye ulaştırın. Bilgilerinizi doldurun, en kısa sürede sizinle iletişime geçelim.
                </p>
            </div>

            {/* Form Area */}
            <div style={{ maxWidth: 800, margin: "-40px auto 4rem", padding: "0 1rem", position: "relative", zIndex: 10 }}>
                <div style={{
                    background: "white",
                    borderRadius: 16,
                    padding: "2rem",
                    boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)",
                    border: "1px solid #eaeaea"
                }}>
                    {success ? (
                        <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                            <div style={{
                                width: 80, height: 80, background: "#e8f5e9", borderRadius: "50%",
                                color: "#0cbc87", fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center",
                                margin: "0 auto 1.5rem"
                            }}>
                                ✓
                            </div>
                            <h2 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#222", marginBottom: "0.5rem" }}>
                                Başvurunuz Alındı!
                            </h2>
                            <p style={{ color: "#666", fontSize: "1.05rem", maxWidth: 400, margin: "0 auto 2rem" }}>
                                Teşekkür ederiz. Talebinizi inceledikten sonra uzman ekibimiz en kısa sürede sizinle iletişime geçecektir.
                            </p>
                            <button
                                onClick={() => setSuccess(false)}
                                style={{
                                    background: "#f0f0f0", color: "#333", border: "none",
                                    padding: "0.8rem 1.5rem", borderRadius: 8, fontWeight: 500, cursor: "pointer",
                                    transition: "background 0.2s"
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = "#e0e0e0"}
                                onMouseLeave={(e) => e.currentTarget.style.background = "#f0f0f0"}
                            >
                                Yeni Başvuru Yap
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                            {error && (
                                <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "1rem", borderRadius: 8, fontSize: "0.95rem" }}>
                                    {error}
                                </div>
                            )}

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
                                {/* Left Column */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                    <div>
                                        <label style={{ display: "block", marginBottom: 6, fontSize: "0.9rem", color: "#555", fontWeight: 500 }}>
                                            Ad Soyad <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="full_name"
                                            value={formData.full_name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Örn. Ahmet Yılmaz"
                                            style={{
                                                width: "100%", padding: "0.8rem 1rem", border: "1px solid #ddd",
                                                borderRadius: 8, fontSize: "1rem", outline: "none", transition: "border-color 0.2s"
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = "#0cbc87"}
                                            onBlur={(e) => e.target.style.borderColor = "#ddd"}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", marginBottom: 6, fontSize: "0.9rem", color: "#555", fontWeight: 500 }}>
                                            E-posta <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="Örn. ahmet@email.com"
                                            style={{
                                                width: "100%", padding: "0.8rem 1rem", border: "1px solid #ddd",
                                                borderRadius: 8, fontSize: "1rem", outline: "none", transition: "border-color 0.2s"
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = "#0cbc87"}
                                            onBlur={(e) => e.target.style.borderColor = "#ddd"}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", marginBottom: 6, fontSize: "0.9rem", color: "#555", fontWeight: 500 }}>
                                            Telefon Numarası <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <div style={{ display: "flex", gap: 8 }}>
                                            <input
                                                type="text"
                                                name="phone_code"
                                                value={formData.phone_code}
                                                onChange={handleChange}
                                                required
                                                style={{
                                                    width: "80px", padding: "0.8rem", border: "1px solid #ddd",
                                                    borderRadius: 8, fontSize: "1rem", textAlign: "center", outline: "none", transition: "border-color 0.2s"
                                                }}
                                                onFocus={(e) => e.target.style.borderColor = "#0cbc87"}
                                                onBlur={(e) => e.target.style.borderColor = "#ddd"}
                                            />
                                            <input
                                                type="tel"
                                                name="phone_number"
                                                value={formData.phone_number}
                                                onChange={handleChange}
                                                required
                                                placeholder="5XX XXX XX XX"
                                                style={{
                                                    flex: 1, padding: "0.8rem 1rem", border: "1px solid #ddd",
                                                    borderRadius: 8, fontSize: "1rem", outline: "none", transition: "border-color 0.2s"
                                                }}
                                                onFocus={(e) => e.target.style.borderColor = "#0cbc87"}
                                                onBlur={(e) => e.target.style.borderColor = "#ddd"}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: "block", marginBottom: 6, fontSize: "0.9rem", color: "#555", fontWeight: 500 }}>
                                            Turizm Belgesi No <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="tourism_license_no"
                                            value={formData.tourism_license_no}
                                            onChange={handleChange}
                                            required
                                            placeholder="Belge numaranızı giriniz"
                                            style={{
                                                width: "100%", padding: "0.8rem 1rem", border: "1px solid #ddd",
                                                borderRadius: 8, fontSize: "1rem", outline: "none", transition: "border-color 0.2s"
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = "#0cbc87"}
                                            onBlur={(e) => e.target.style.borderColor = "#ddd"}
                                        />
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                    <div>
                                        <label style={{ display: "block", marginBottom: 6, fontSize: "0.9rem", color: "#555", fontWeight: 500 }}>
                                            Konum / İl / İlçe <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            required
                                            placeholder="Örn. Antalya / Kaş"
                                            style={{
                                                width: "100%", padding: "0.8rem 1rem", border: "1px solid #ddd",
                                                borderRadius: 8, fontSize: "1rem", outline: "none", transition: "border-color 0.2s"
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = "#0cbc87"}
                                            onBlur={(e) => e.target.style.borderColor = "#ddd"}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", marginBottom: 6, fontSize: "0.9rem", color: "#555", fontWeight: 500 }}>
                                            Havuz Çeşidi <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <div style={{ position: "relative" }}>
                                            <select
                                                name="pool_type"
                                                value={formData.pool_type}
                                                onChange={handleChange}
                                                required
                                                style={{
                                                    width: "100%", padding: "0.8rem 1rem", border: "1px solid #ddd",
                                                    borderRadius: 8, fontSize: "1rem", outline: "none", transition: "border-color 0.2s",
                                                    appearance: "none", background: "white"
                                                }}
                                                onFocus={(e) => e.target.style.borderColor = "#0cbc87"}
                                                onBlur={(e) => e.target.style.borderColor = "#ddd"}
                                            >
                                                <option value="Özel Havuz">Özel Havuz</option>
                                                <option value="Müşterek Havuz">Müşterek Havuz</option>
                                                <option value="Isıtmalı Havuz">Isıtmalı Havuz</option>
                                                <option value="Havuzsuz">Havuzsuz</option>
                                            </select>
                                            <div style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#888" }}>
                                                ▼
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                                        <label style={{ display: "block", marginBottom: 6, fontSize: "0.9rem", color: "#555", fontWeight: 500 }}>
                                            Ek Açıklama (Opsiyonel)
                                        </label>
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleChange}
                                            placeholder="Villanız hakkında eklemek istediğiniz diğer detaylar..."
                                            style={{
                                                width: "100%", padding: "0.8rem 1rem", border: "1px solid #ddd", flex: 1, minHeight: 120,
                                                borderRadius: 8, fontSize: "1rem", outline: "none", transition: "border-color 0.2s", resize: "vertical"
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = "#0cbc87"}
                                            onBlur={(e) => e.target.style.borderColor = "#ddd"}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: "1rem" }}>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    style={{
                                        width: "100%", padding: "1rem", background: submitting ? "#9ae4c5" : "#0cbc87",
                                        color: "white", border: "none", borderRadius: 8, fontSize: "1.1rem", fontWeight: 600,
                                        cursor: submitting ? "not-allowed" : "pointer", transition: "all 0.2s",
                                        boxShadow: "0 4px 14px 0 rgba(12,188,135,0.39)"
                                    }}
                                    onMouseEnter={(e) => { if(!submitting) e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(12,188,135,0.4)"; }}
                                    onMouseLeave={(e) => { if(!submitting) e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px 0 rgba(12,188,135,0.39)"; }}
                                >
                                    {submitting ? "Gönderiliyor..." : "Başvurumu Gönder"}
                                </button>
                                <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#888", marginTop: 12 }}>
                                    Göndererek <span style={{ textDecoration: "underline", cursor: "pointer" }}>Kullanım Koşullarını</span> ve <span style={{ textDecoration: "underline", cursor: "pointer" }}>Gizlilik Politikasını</span> kabul etmiş olursunuz.
                                </p>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
