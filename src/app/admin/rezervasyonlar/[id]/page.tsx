"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Reservation {
    id: string;
    ref_code: string;
    status: string;
    source: string;
    renter_first_name: string;
    renter_last_name: string;
    renter_email: string;
    renter_phone_code: string;
    renter_phone_number: string;
    renter_tc_passport: string;
    check_in_date: string;
    check_out_date: string;
    nights: number;
    total_guests: number;
    currency: string;
    total_amount: number;
    prepayment_amount: number;
    remaining_amount: number;
    admin_notes: string;
    created_at: string;
    updated_at: string;
}

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
    pending: { label: "Beklemede", bg: "#fef3c7", color: "#92400e" },
    pre_approved: { label: "Ön Onay Verildi", bg: "#ede9fe", color: "#6772e5" },
    confirmed: { label: "Onaylandı", bg: "#dcfce7", color: "#166534" },
    rejected: { label: "Reddedildi", bg: "#fee2e2", color: "#991b1b" },
};

function formatTR(n: number): string {
    return Math.round(n).toLocaleString("tr-TR", { maximumFractionDigits: 0 });
}

export default function ReservationDetailPage() {
    const router = useRouter();
    const params = useParams();
    const rezId = params.id as string;

    const [rez, setRez] = useState<Reservation | null>(null);
    const [loading, setLoading] = useState(true);
    const [adminNotes, setAdminNotes] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadReservation();
    }, [rezId]);

    async function loadReservation() {
        const { data, error } = await supabase.from("reservations").select("*").eq("id", rezId).single();
        if (error || !data) {
            setLoading(false);
            return;
        }
        setRez(data);
        setAdminNotes(data.admin_notes || "");
        setLoading(false);
    }

    async function updateStatus(newStatus: string) {
        if (!rez) return;

        if (newStatus === "confirmed") {
            // Block dates in villa_disabled_dates
            // We extract villa slug from admin_notes
            const slugMatch = rez.admin_notes?.match(/Slug:\s*(.+)/);
            const villaSlug = slugMatch?.[1]?.trim();

            // Mark dates as blocked even without villa_id
            // This will be used when checking availability
        }

        const { error } = await supabase
            .from("reservations")
            .update({ status: newStatus })
            .eq("id", rez.id);

        if (error) {
            alert("Hata: " + error.message);
            return;
        }
        setRez({ ...rez, status: newStatus });
    }

    async function saveNotes() {
        if (!rez) return;
        setSaving(true);
        await supabase.from("reservations").update({ admin_notes: adminNotes }).eq("id", rez.id);
        setRez({ ...rez, admin_notes: adminNotes });
        setSaving(false);
    }

    function sendWhatsApp() {
        if (!rez) return;
        const phone = (rez.renter_phone_code + rez.renter_phone_number).replace(/[^0-9]/g, "");
        const paymentUrl = `${window.location.origin}/odeme/${rez.id}`;
        const message = encodeURIComponent(
            `Merhaba ${rez.renter_first_name} ${rez.renter_last_name},\n\n` +
            `${rez.ref_code} numaralı rezervasyon talebiniz ön onay almıştır.\n\n` +
            `📅 Giriş: ${rez.check_in_date}\n📅 Çıkış: ${rez.check_out_date}\n` +
            `🌙 ${rez.nights} Gece\n` +
            `💰 Toplam: ₺${formatTR(rez.total_amount)}\n` +
            `💳 Ön Ödeme (%15): ₺${formatTR(rez.prepayment_amount)}\n\n` +
            `Ödeme linkiniz aşağıdadır:\n${paymentUrl}\n\n` +
            `Villa Tatilinde`
        );
        window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
    }

    if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Yükleniyor...</div>;
    if (!rez) return <div style={{ padding: 40, textAlign: "center", color: "#dc2626" }}>Rezervasyon bulunamadı</div>;

    const st = STATUS_MAP[rez.status] || { label: rez.status, bg: "#f1f5f9", color: "#64748b" };

    return (
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <button onClick={() => router.push("/admin/rezervasyonlar")} style={{ background: "none", border: "none", color: "#64748b", fontSize: 13, cursor: "pointer", marginBottom: 16 }}>
                ← Rezervasyonlara dön
            </button>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e293b", fontFamily: "'Poppins', sans-serif" }}>
                        Rezervasyon #{rez.ref_code}
                    </h1>
                    <span style={{ padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: st.bg, color: st.color }}>{st.label}</span>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {rez.status === "pending" && (
                        <button onClick={() => updateStatus("pre_approved")} style={actionBtnStyle("#6772e5")}>Ön Onayla</button>
                    )}
                    {rez.status === "pre_approved" && (
                        <>
                            <button onClick={sendWhatsApp} style={actionBtnStyle("#25D366")}>📱 WP ile Ödeme Linki Gönder</button>
                            <button onClick={() => updateStatus("confirmed")} style={actionBtnStyle("#10b981")}>✅ Ödeme Alındı</button>
                        </>
                    )}
                    {(rez.status === "pending" || rez.status === "pre_approved") && (
                        <button onClick={() => { if (confirm("Reddetmek istediğinize emin misiniz?")) updateStatus("rejected"); }} style={{ ...actionBtnStyle("#dc2626"), background: "#fff", color: "#dc2626", border: "1px solid #fee2e2" }}>Reddet</button>
                    )}
                </div>
            </div>

            {/* Guest Info */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                <div style={cardStyle}>
                    <h3 style={cardTitleStyle}>👤 Misafir Bilgileri</h3>
                    <InfoRow label="Ad Soyad" value={`${rez.renter_first_name} ${rez.renter_last_name}`} />
                    <InfoRow label="E-posta" value={rez.renter_email || "-"} />
                    <InfoRow label="Telefon" value={`${rez.renter_phone_code} ${rez.renter_phone_number}`} />
                    <InfoRow label="TC / Pasaport" value={rez.renter_tc_passport || "-"} />
                    <InfoRow label="Misafir Sayısı" value={String(rez.total_guests)} />
                </div>

                <div style={cardStyle}>
                    <h3 style={cardTitleStyle}>📅 Konaklama Bilgileri</h3>
                    <InfoRow label="Giriş Tarihi" value={rez.check_in_date} />
                    <InfoRow label="Çıkış Tarihi" value={rez.check_out_date} />
                    <InfoRow label="Gece Sayısı" value={`${rez.nights} gece`} />
                    <InfoRow label="Kaynak" value={rez.source || "website"} />
                    <InfoRow label="Oluşturulma" value={new Date(rez.created_at).toLocaleString("tr-TR")} />
                </div>
            </div>

            {/* Financial Info */}
            <div style={{ ...cardStyle, marginBottom: 20 }}>
                <h3 style={cardTitleStyle}>💰 Finansal Bilgiler</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                    <div style={{ textAlign: "center", padding: 16, background: "#f0fdf4", borderRadius: 10 }}>
                        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Toplam Tutar</div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: "#166534" }}>₺{formatTR(rez.total_amount)}</div>
                    </div>
                    <div style={{ textAlign: "center", padding: 16, background: "#eff6ff", borderRadius: 10 }}>
                        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Ön Ödeme (%20)</div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: "#6772e5" }}>₺{formatTR(rez.prepayment_amount)}</div>
                    </div>
                    <div style={{ textAlign: "center", padding: 16, background: "#fefce8", borderRadius: 10 }}>
                        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Girişte Ödenecek</div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: "#92400e" }}>₺{formatTR(rez.remaining_amount)}</div>
                    </div>
                </div>
            </div>

            {/* Admin Notes */}
            <div style={{ ...cardStyle, marginBottom: 20 }}>
                <h3 style={cardTitleStyle}>📝 Admin Notları</h3>
                <textarea
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box", height: 120, resize: "vertical", fontFamily: "'DM Sans', sans-serif" }}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                />
                <button
                    onClick={saveNotes}
                    disabled={saving}
                    style={{ marginTop: 8, padding: "8px 20px", borderRadius: 8, background: "#6772e5", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}
                >
                    {saving ? "Kaydediliyor..." : "Notları Kaydet"}
                </button>
            </div>
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9", fontSize: 14 }}>
            <span style={{ color: "#64748b" }}>{label}</span>
            <span style={{ fontWeight: 500, color: "#1e293b" }}>{value}</span>
        </div>
    );
}

const cardStyle: React.CSSProperties = { background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: 24 };
const cardTitleStyle: React.CSSProperties = { fontSize: 16, fontWeight: 600, color: "#1e293b", marginBottom: 16 };
const actionBtnStyle = (bg: string): React.CSSProperties => ({
    padding: "8px 20px",
    borderRadius: 10,
    background: bg,
    color: "#fff",
    fontSize: 13,
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
});
