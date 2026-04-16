"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { HelpCircle, Send, CheckCircle2 } from "lucide-react";
import Image from "next/image";

function SorularPageInner() {
    const searchParams = useSearchParams();
    const villaIdParam = searchParams.get("villaId");

    const [villas, setVillas] = useState<{ id: string; name: string }[]>([]);
    const [selectedVillaName, setSelectedVillaName] = useState("");
    const [formData, setFormData] = useState({
        villa_id: villaIdParam || "",
        user_name: "",
        user_email: "",
        user_phone: "",
        question: "",
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const [villasRes, sessionRes] = await Promise.all([
                supabase.from("villas").select("id, name").eq("is_published", true).order("name"),
                supabase.auth.getSession(),
            ]);

            if (villasRes.data) {
                setVillas(villasRes.data);
                if (villaIdParam) {
                    const v = villasRes.data.find(item => item.id.toLowerCase() === villaIdParam.toLowerCase());
                    if (v) setSelectedVillaName(v.name);
                }
            }

            // Oturum açıksa email ve adı otomatik doldur
            const authUser = sessionRes.data.session?.user;
            if (authUser) {
                const email = authUser.email || "";
                const name = authUser.user_metadata?.full_name || authUser.user_metadata?.name || "";
                setIsLoggedIn(true);
                setFormData(prev => ({
                    ...prev,
                    user_email: email,
                    user_name: name || prev.user_name,
                }));
                try { localStorage.setItem("vt_user_email", email); } catch (_) {}
            }
        }
        fetchData();
    }, [villaIdParam]);

    useEffect(() => {
        if (villaIdParam) {
            setFormData(prev => ({ ...prev, villa_id: villaIdParam }));
        }
    }, [villaIdParam]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!formData.villa_id) {
            setError("Lütfen bilgi almak istediğiniz villayı seçin.");
            setLoading(false);
            return;
        }

        const { error: submitError } = await supabase
            .from("villa_questions")
            .insert([{
                villa_id: formData.villa_id,
                user_name: formData.user_name,
                user_email: formData.user_email,
                user_phone: formData.user_phone || null,
                question: formData.question,
                is_answered: false
            }]);

        if (submitError) {
            setError("Sorunuz iletilirken bir hata oluştu. Lütfen tekrar deneyin.");
        } else {
            // Email'i localStorage'a kaydet — bildirimler sayfasında kullanılır
            try {
                localStorage.setItem("vt_user_email", formData.user_email);
            } catch (_) {}
            setSubmitted(true);
        }
        setLoading(false);
    };

    if (submitted) {
        return (
            <div className="iletisim-page">
                <div className="paddingMobile" style={{ paddingBottom: 120, paddingTop: 100 }}>
                    <div className="iletisim-sent-success middle">
                        <div>
                            <Image src="/images/checkBub.png" alt="Başarılı" width={64} height={64} />
                            <div style={{ fontSize: 24, marginTop: 24, fontWeight: 700, fontFamily: "afacad" }}>Mesajınız İletildi</div>
                            <div className="dm-sans" style={{ marginTop: 16, color: "#747579" }}>
                                Sorunuz uzman ekibimize ulaştı. En kısa sürede size dönüş yapacağız.
                            </div>
                            <button 
                                onClick={() => window.location.href = "/"}
                                className="bhs"
                                style={{ 
                                    marginTop: 32, 
                                    padding: "12px 24px", 
                                    background: "#0b0a12", 
                                    color: "#fff", 
                                    borderRadius: 8,
                                    border: "none",
                                    fontWeight: 600
                                }}
                            >
                                Anasayfaya Dön
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="iletisim-page">
            <div className="paddingMobile" style={{ color: "#0b0a12", paddingBottom: 100, paddingTop: 48 }}>
                
                {/* ── Page Title ── */}
                <div style={{ textAlign: "left", marginBottom: 48 }}>
                    <div className="middleft skiptranslate" style={{ gap: 8, marginBottom: 12 }}>
                        <div style={{ padding: "4px 12px", background: "#17a2b81a", color: "#50b0f0", borderRadius: 20, fontSize: 13, fontWeight: 700, fontFamily: "afacad" }}>
                            SORULAR & DESTEK
                        </div>
                    </div>
                    <h1 className="iletisim-main-title">
                        Size Nasıl Yardımcı Olabiliriz?
                    </h1>
                    <p className="dm-sans iletisim-main-desc" style={{ maxWidth: 800 }}>
                        {selectedVillaName ? (
                            <><strong>{selectedVillaName}</strong> hakkında merak ettiğiniz her şeyi bize sorabilirsiniz.</>
                        ) : (
                            "Rezervasyon süreci, villa detayları veya konaklama hakkında merak ettiğiniz her konuda uzman ekibimiz sizlere yardımcı olmaktan memnuniyet duyar."
                        )}
                    </p>
                </div>

                <div className="row">
                    {/* ── Left Column: Info & Contact ── */}
                    <div className="cntc21">
                        <div style={{ background: "#f8fafc", padding: 32, borderRadius: 16, border: "1px solid #ecf0ef" }}>
                            <h3 className="afacad" style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Destek Kanalları</h3>
                            
                            <div className="space-y-6" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                <div className="middleft" style={{ gap: 16 }}>
                                    <div className="middle" style={{ width: 48, height: 48, background: "#fff", borderRadius: 12, border: "1px solid #eee", flexShrink: 0 }}>
                                        <Image src="/images/phonesolid.svg" alt="Tel" width={18} height={18} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontFamily: "afacad", fontSize: 17 }}>Hızlı Telefon Hattı</div>
                                        <div className="dm-sans" style={{ color: "#747579", fontSize: 14 }}>Haftanın her günü 09:30 - 22:30</div>
                                    </div>
                                </div>

                                <div className="middleft" style={{ gap: 16 }}>
                                    <div className="middle" style={{ width: 48, height: 48, background: "#fff", borderRadius: 12, border: "1px solid #eee", flexShrink: 0 }}>
                                        <Image src="/images/wp.svg" alt="WP" width={22} height={22} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontFamily: "afacad", fontSize: 17 }}>WhatsApp Destek</div>
                                        <div className="dm-sans" style={{ color: "#747579", fontSize: 14 }}>Anlık sorularınız için bize yazın</div>
                                    </div>
                                </div>
                            </div>

                            <div className="iletisim-card-buttons middleft" style={{ marginTop: 32 }}>
                                <a href="https://wa.me/905323990748" className="bhs middle iletisim-wa-btn" style={{ textDecoration: "none" }}>
                                    <Image src="/images/wp.svg" alt="WhatsApp" width={16} height={16} style={{ marginRight: 8 }} />
                                    Mesaj Gönderin
                                </a>
                                <a href="tel:+902426060725" className="bhs middle iletisim-phone-btn" style={{ textDecoration: "none", marginLeft: 12 }}>
                                    Bizi Arayın
                                </a>
                            </div>
                        </div>

                        <div style={{ marginTop: 24, padding: "0 16px" }}>
                            <p className="dm-sans" style={{ fontSize: 14, color: "#747579", lineHeight: 1.6 }}>
                                * Gönderdiğiniz sorular bölge uzmanlarımız tarafından titizlikle incelenir. 
                                En geç 1 iş günü içinde e-posta adresinize detaylı yanıt iletilir.
                            </p>
                        </div>
                    </div>

                    {/* ── Right Column: Form ── */}
                    <div className="cntc22">
                        <div className="sendMes">
                            <div className="iletisim-form-title" style={{ marginBottom: 32 }}>Soru Formu</div>

                            {error && (
                                <div style={{ marginBottom: 20, padding: 12, background: "#fff5f5", color: "#c53030", borderRadius: 8, fontSize: 14, fontWeight: 500, border: "1px solid #feb2b2" }}>
                                    {error}
                                </div>
                            )}

                            <div style={{ marginTop: 24 }}>
                                <div className="dm-sans iletisim-field-label">İlgilendiğiniz Villa</div>
                                <div className="iletisim-input-wrap">
                                    {villaIdParam ? (
                                        <input
                                            readOnly
                                            className="iletisim-input"
                                            value={selectedVillaName || "Yükleniyor..."}
                                            style={{ background: "#f0f0f0", cursor: "not-allowed" }}
                                        />
                                    ) : (
                                        <select
                                            required
                                            value={formData.villa_id}
                                            onChange={(e) => setFormData({ ...formData, villa_id: e.target.value })}
                                            className="iletisim-input"
                                            style={{ appearance: "none", background: "url('/images/cfo.svg') no-repeat right 16px center / 12px", paddingRight: 40 }}
                                        >
                                            <option value="">Lütfen Villa Seçiniz</option>
                                            {villas.map((villa) => (
                                                <option key={villa.id} value={villa.id}>{villa.name}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            </div>

                            <div className="row" style={{ marginTop: 24 }}>
                                <div className="mesName" style={{ width: "48%", marginRight: "4%" }}>
                                    <div className="dm-sans iletisim-field-label">Adınız Soyadınız</div>
                                    <div className="iletisim-input-wrap">
                                        <input
                                            type="text"
                                            required
                                            className="iletisim-input"
                                            placeholder="İsminiz"
                                            value={formData.user_name}
                                            onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div style={{ width: "48%" }}>
                                    <div className="dm-sans iletisim-field-label">E-posta</div>
                                    <div className="iletisim-input-wrap">
                                        <input
                                            type="email"
                                            required
                                            className="iletisim-input"
                                            placeholder="E-mail"
                                            value={formData.user_email}
                                            onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
                                            readOnly={isLoggedIn}
                                            style={isLoggedIn ? { background: "#f8fafc", color: "#64748b", cursor: "default" } : undefined}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: 24 }}>
                                <div className="dm-sans iletisim-field-label">Telefon Numarası (Opsiyonel)</div>
                                <div className="iletisim-input-wrap">
                                    <input
                                        type="tel"
                                        className="iletisim-input"
                                        placeholder="0555 555 55 55"
                                        value={formData.user_phone}
                                        onChange={(e) => setFormData({ ...formData, user_phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div style={{ marginTop: 24 }}>
                                <div className="dm-sans iletisim-field-label">Sorunuz</div>
                                <div className="iletisim-input-wrap">
                                    <textarea
                                        required
                                        className="iletisim-textarea"
                                        placeholder="Merak ettiklerinizi buraya yazabilirsiniz..."
                                        rows={5}
                                        value={formData.question}
                                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                        style={{ height: 120, paddingTop: 12 }}
                                    />
                                </div>
                            </div>

                            <div className="middle" style={{ marginTop: 32 }}>
                                <button
                                    className={`bhs middle iletisim-send-btn ${loading ? "iletisim-loading" : ""}`}
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    style={{ width: "100%", border: "none", cursor: "pointer", height: 54, fontSize: 16, fontWeight: 700 }}
                                >
                                    {loading ? "Gönderiliyor..." : "Soruyu Gönder"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SorularContent() {
    return (
        <Suspense fallback={<div className="iletisim-page"><div className="paddingMobile">Yükleniyor...</div></div>}>
            <SorularPageInner />
        </Suspense>
    );
}
