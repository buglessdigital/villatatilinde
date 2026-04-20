import { supabase } from "@/lib/supabase";
import { Calendar, Ticket, Gift, Clock } from "lucide-react";

// Server Component with ISR (revalidate every hour, or fetch dynamically)
export const revalidate = 60;

export const metadata = {
    title: "Kampanyalar ve İndirim Kodları - Villa Tatilinde",
    description: "Villa Tatilinde güncel kampanyalar, resmi tatil fırsatları ve indirim kupon kodları. Size özel ayrıcalıklarla villanızı ayırtın.",
};

export default async function KampanyalarPage() {
    // Sadece aktif ve süresi dolmamış kuponları getir
    const { data: coupons } = await supabase
        .from("coupons")
        .select("*")
        .eq("is_active", true)
        .or('valid_until.is.null,valid_until.gte.' + new Date().toISOString())
        .order("discount_amount", { ascending: false });

    const activeCoupons = coupons || [];

    // Fetch Campaigns / Holidays
    const { data: campaignsData } = await supabase
        .from("campaigns")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

    const campaigns = campaignsData || [];

    return (
        <>
            {/* ─── Hero Section ─── */}
            <div style={{
                position: "relative",
                backgroundColor: "#0f172a",
                padding: "80px 20px 60px",
                textAlign: "center",
                overflow: "hidden"
            }}>
                <div style={{
                    position: "absolute",
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: "radial-gradient(circle at 50% 150%, rgba(80, 176, 240, 0.4) 0%, rgba(15, 23, 42, 1) 70%)",
                    zIndex: 0
                }} />
                
                <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto" }}>
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)",
                        padding: "6px 16px", borderRadius: 30, color: "#fff",
                        fontSize: 14, fontWeight: 500, marginBottom: 20,
                        border: "1px solid rgba(255,255,255,0.2)"
                    }}>
                        <Gift size={16} color="#50b0f0" />
                        Villa Tatilinde Ayrıcalıklarınız
                    </div>
                    
                    <h1 style={{
                        fontSize: "clamp(2rem, 5vw, 3.5rem)",
                        fontWeight: 800,
                        color: "#fff",
                        lineHeight: 1.1,
                        marginBottom: 20,
                        fontFamily: "'Poppins', sans-serif"
                    }}>
                        Kampanyalar ve<br />
                        <span style={{ color: "#50b0f0" }}>Özel İndirim Kodları</span>
                    </h1>
                    
                    <p style={{
                        fontSize: 18,
                        color: "#94a3b8",
                        maxWidth: 600,
                        margin: "0 auto"
                    }}>
                        Tatilinizi daha avantajlı fiyata rezerve etmeniz için sunduğumuz güncel kampanyalar ve indirim kuponları.
                    </p>
                </div>
            </div>

            <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px 80px" }}>
                {/* ─── Active Coupons Section ─── */}
                <div style={{ marginTop: 40, marginBottom: 60 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                        <Ticket size={28} color="#50b0f0" />
                        <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b", fontFamily: "'Poppins', sans-serif" }}>
                            Aktif İndirim Kodları
                        </h2>
                    </div>

                    {activeCoupons.length === 0 ? (
                        <div style={{
                            padding: 40,
                            textAlign: "center",
                            background: "#f8fafc",
                            borderRadius: 16,
                            border: "1px dashed #cbd5e1"
                        }}>
                            <p style={{ color: "#64748b", fontSize: 16 }}>Şu an için aktif bir indirim kodu bulunmuyor. Yeni fırsatlar için bizi takip edin!</p>
                        </div>
                    ) : (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                            gap: 24
                        }}>
                            {activeCoupons.map((coupon) => (
                                <div key={coupon.id} style={{
                                    background: "#fff",
                                    borderRadius: 16,
                                    border: "1px solid #e2e8f0",
                                    overflow: "hidden",
                                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                    position: "relative"
                                }}>
                                    <div style={{
                                        position: "absolute", top: 16, right: -30,
                                        background: "#ef4444", color: "#fff",
                                        padding: "4px 30px", fontSize: 12, fontWeight: 700,
                                        transform: "rotate(45deg)", boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                                    }}>
                                        FIRSAT
                                    </div>
                                    <div style={{ padding: 24, paddingRight: 40 }}>
                                        <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                                            Kupon Kodu
                                        </div>
                                        <div style={{
                                            fontSize: 28,
                                            fontWeight: 800,
                                            color: "#1e293b",
                                            fontFamily: "'Courier New', monospace",
                                            letterSpacing: 2,
                                            marginBottom: 20
                                        }}>
                                            {coupon.code}
                                        </div>
                                        
                                        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: 12, color: "#64748b" }}>İndirim</div>
                                                <div style={{ fontSize: 18, fontWeight: 700, color: "#10b981" }}>
                                                    {coupon.discount_type === "percentage" ? `%${coupon.discount_amount}` : `${coupon.discount_amount} ₺`}
                                                </div>
                                            </div>
                                            {coupon.valid_until && (
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: 12, color: "#64748b" }}>Son Gün</div>
                                                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", display: "flex", alignItems: "center", gap: 4 }}>
                                                        <Clock size={14} />
                                                        {new Date(coupon.valid_until).toLocaleDateString("tr-TR")}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 0 }}>
                                            * Rezervasyon ödeme adımında "Kupon Kodu" alanına girerek anında {coupon.discount_type === "percentage" ? `%${coupon.discount_amount}` : `${coupon.discount_amount} ₺`} indirim kazanabilirsiniz.
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ─── Holidays Section ─── */}
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                        <Calendar size={28} color="#50b0f0" />
                        <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b", fontFamily: "'Poppins', sans-serif" }}>
                            Resmi Tatiller & Fırsat Dönemleri
                        </h2>
                    </div>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: 20
                    }}>
                        {campaigns.length === 0 ? (
                            <div style={{ color: "#64748b", fontSize: 15 }}>Şu an için duyurulan bir etkinlik bulunmuyor.</div>
                        ) : (
                            campaigns.map((c) => (
                                <div key={c.id} style={{
                                    background: "#f8fafc",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: 12,
                                    overflow: "hidden"
                                }}>
                                    {(c.image_url || c.mobile_image_url) && (
                                        <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
                                            {/* Masaüstü: 16:9 */}
                                            {c.image_url && (
                                                <div className="campaign-img-desktop" style={{ aspectRatio: "16/9" }}>
                                                    <img src={c.image_url} alt={c.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                                                </div>
                                            )}
                                            {/* Mobil: 4:3 */}
                                            {c.mobile_image_url && (
                                                <div className="campaign-img-mobile" style={{ aspectRatio: "4/3" }}>
                                                    <img src={c.mobile_image_url} alt={c.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div style={{ padding: 20 }}>
                                        <div style={{ color: "#50b0f0", fontSize: 14, fontWeight: 600, margin: "0 0 4px" }}>
                                            {c.date_text}
                                        </div>
                                        <div style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", margin: "0 0 8px", fontFamily: "'Poppins', sans-serif" }}>
                                            {c.title}
                                        </div>
                                        {c.description && (
                                            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.5, margin: "0 0 12px" }}>
                                                {c.description}
                                            </p>
                                        )}
                                        {c.coupon_code && (
                                            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px dashed #cbd5e1" }}>
                                                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>Bu Döneme Özel İndirim:</div>
                                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                    <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#059669", padding: "6px 12px", borderRadius: 6, fontSize: 15, fontWeight: 700, fontFamily: "'Courier New', monospace" }}>
                                                        {c.coupon_code}
                                                    </div>
                                                    <div style={{ fontSize: 14, fontWeight: 700, color: "#10b981", background: "#f0fdf4", padding: "6px 10px", borderRadius: 6 }}>
                                                        {c.discount_type === "percentage" ? `%${c.discount_amount} İndirim` : `${c.discount_amount}₺ İndirim`}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </>
    );
}
