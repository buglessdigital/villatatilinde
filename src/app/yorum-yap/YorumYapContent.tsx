"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Star, CheckCircle2 } from "lucide-react";
import Image from "next/image";

function YorumYapPageInner() {
    const searchParams = useSearchParams();
    const villaIdParam = searchParams.get("villaId");

    const [villas, setVillas] = useState<{ id: string; name: string }[]>([]);
    const [selectedVillaName, setSelectedVillaName] = useState("");
    const [formData, setFormData] = useState({
        villa_id: villaIdParam || "",
        user_name: "",
        user_email: "",
        rating: 5,
        comment: "",
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchData() {
            const { data } = await supabase
                .from("villas")
                .select("id, name")
                .eq("is_published", true)
                .order("name");
            
            if (data) {
                setVillas(data);
                if (villaIdParam) {
                    const idToFind = (villaIdParam as string).toLowerCase();
                    const v = data.find(item => item.id.toLowerCase() === idToFind);
                    if (v) setSelectedVillaName(v.name);
                }
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
            setError("Lütfen konakladığınız villayı seçin.");
            setLoading(false);
            return;
        }

        const { error: submitError } = await supabase
            .from("villa_reviews")
            .insert([{
                villa_id: formData.villa_id,
                user_name: formData.user_name,
                user_email: formData.user_email,
                rating: formData.rating,
                comment: formData.comment,
                is_approved: false
            }]);

        if (submitError) {
            setError("Yorum gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
        } else {
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
                            <div style={{ fontSize: 24, marginTop: 24, fontWeight: 700, fontFamily: "afacad" }}>Yorumunuz Alındı</div>
                            <div className="dm-sans" style={{ marginTop: 16, color: "#747579" }}>
                                Deneyiminizi paylaştığınız için teşekkür ederiz. Onay sonrası yayına alınacaktır.
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
                <div style={{ textAlign: "center", marginBottom: 64 }}>
                    <div className="middle skiptranslate" style={{ gap: 8, marginBottom: 16 }}>
                        <div style={{ padding: "4px 12px", background: "#f5c0701a", color: "#f5c070", borderRadius: 20, fontSize: 13, fontWeight: 700, fontFamily: "afacad" }}>
                            MİSAFİR DENEYİMLERİ
                        </div>
                    </div>
                    <h1 className="iletisim-main-title" style={{ textAlign: "center" }}>
                        Tatil Deneyiminizi Paylaşın
                    </h1>
                    <p className="dm-sans iletisim-main-desc" style={{ maxWidth: 700, margin: "16px auto 0" }}>
                        {selectedVillaName ? (
                            <><strong>{selectedVillaName}</strong> konaklamanız hakkındaki görüşleriniz, hem ekibimize hem de diğer misafirlerimize yol gösterir.</>
                        ) : (
                            "Konaklamanız hakkındaki görüşleriniz, hem ekibimize hem de diğer misafirlerimize yol göstermesi açısından bizim için paha biçilemez."
                        )}
                    </p>
                </div>

                <div className="row middle">
                    <div className="cntc22" style={{ width: "100%", maxWidth: 800, paddingLeft: 0 }}>
                        <div className="sendMes">
                            <div className="iletisim-form-title" style={{ marginBottom: 32 }}>Değerlendirme Formu</div>

                            {error && (
                                <div style={{ marginBottom: 20, padding: 12, background: "#fff5f5", color: "#c53030", borderRadius: 8, border: "1px solid #feb2b2" }}>
                                    {error}
                                </div>
                            )}

                            <div>
                                <div className="dm-sans iletisim-field-label">Konakladığınız Villa</div>
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
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: 24 }}>
                                <div className="dm-sans iletisim-field-label" style={{ marginBottom: 12 }}>Puanınız</div>
                                <div className="middleft" style={{ gap: 8 }}>
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <div 
                                            key={s} 
                                            className="bhs middle" 
                                            onClick={() => setFormData({...formData, rating: s})}
                                            style={{ 
                                                width: 44, 
                                                height: 44, 
                                                borderRadius: 8, 
                                                background: formData.rating >= s ? "#f5c070" : "#eee",
                                                color: formData.rating >= s ? "#fff" : "#999",
                                                fontSize: 18,
                                                fontWeight: 700,
                                                transition: "all 0.2s",
                                                cursor: "pointer"
                                            }}
                                        >
                                            {s}
                                        </div>
                                    ))}
                                    <span className="dm-sans" style={{ marginLeft: 12, fontWeight: 500, color: "#666" }}>/ 5 Yıldız</span>
                                </div>
                            </div>

                            <div style={{ marginTop: 24 }}>
                                <div className="dm-sans iletisim-field-label">Yorumunuz</div>
                                <div className="iletisim-input-wrap">
                                    <textarea
                                        required
                                        className="iletisim-textarea"
                                        placeholder="Tatiliniz nasıl geçti? Memnun kaldığınız detayları belirtin..."
                                        rows={5}
                                        value={formData.comment}
                                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
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
                                    {loading ? "Gönderiliyor..." : "Yorumu Yayınla"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function YorumYapContent() {
    return (
        <Suspense fallback={<div className="iletisim-page"><div className="paddingMobile">Yükleniyor...</div></div>}>
            <YorumYapPageInner />
        </Suspense>
    );
}
