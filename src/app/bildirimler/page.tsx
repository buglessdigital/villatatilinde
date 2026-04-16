"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

/* ─── Types ─── */
type CategoryFilter = "all" | "reservation" | "question_answered";

interface ReservationNotif {
    id: string;
    type: "reservation";
    ref_code: string;
    villa_name: string;
    status: string;
    check_in_date: string;
    check_out_date: string;
    created_at: string;
    is_read: boolean;
}

interface QuestionNotif {
    id: string;
    type: "question_answered";
    villa_name: string;
    question: string;
    answer: string;
    created_at: string;
    is_read: boolean;
}

type Notification = ReservationNotif | QuestionNotif;

/* ─── Helpers ─── */
function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "Az önce";
    if (m < 60) return `${m} dakika önce`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} saat önce`;
    const d = Math.floor(h / 24);
    if (d < 7) return `${d} gün önce`;
    return new Date(dateStr).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
    pending:     { label: "Talep Alındı",   color: "#d97706", bg: "#fef3c7" },
    pre_approved:{ label: "Ön Onaylı",      color: "#6772e5", bg: "#ede9fe" },
    confirmed:   { label: "Onaylandı",      color: "#16a34a", bg: "#dcfce7" },
    rejected:    { label: "Reddedildi",     color: "#dc2626", bg: "#fee2e2" },
    cancelled:   { label: "İptal Edildi",   color: "#64748b", bg: "#f1f5f9" },
};

/* ─── Main Component ─── */
export default function BildirimlerPage() {
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState<CategoryFilter>("all");
    const [expanded, setExpanded] = useState<string | null>(null);

    // For non-logged-in question lookup
    const [email, setEmail] = useState<string | null>(null);
    const [emailInput, setEmailInput] = useState("");
    const [searching, setSearching] = useState(false);

    // Auth
    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user: u } }) => {
            setUser(u ?? null);
            setAuthLoading(false);
        });
    }, []);

    // Once auth resolved, load data
    useEffect(() => {
        if (authLoading) return;
        if (user) {
            loadAll(user);
        } else {
            const stored = localStorage.getItem("vt_user_email");
            if (stored) {
                setEmail(stored);
                loadQuestions(stored);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, authLoading]);

    async function loadAll(u: User) {
        setLoading(true);
        const readIds: string[] = JSON.parse(localStorage.getItem("vt_read_notif_ids") || "[]");
        const readQuestionIds: string[] = JSON.parse(localStorage.getItem("vt_read_question_ids") || "[]");

        const [resResult, qResult] = await Promise.all([
            supabase
                .from("reservations")
                .select("id, ref_code, status, check_in_date, check_out_date, created_at, villas(name)")
                .eq("user_id", u.id)
                .order("created_at", { ascending: false }),
            supabase
                .from("villa_questions")
                .select("id, question, answer, is_answered, created_at, villas(name)")
                .eq("user_email", u.email)
                .eq("is_answered", true)
                .order("created_at", { ascending: false }),
        ]);

        const reservations: ReservationNotif[] = (resResult.data || []).map((r: any) => ({
            id: r.id,
            type: "reservation",
            ref_code: r.ref_code,
            villa_name: r.villas?.name || "Villa",
            status: r.status,
            check_in_date: r.check_in_date,
            check_out_date: r.check_out_date,
            created_at: r.created_at,
            is_read: readIds.includes(r.id),
        }));

        const questions: QuestionNotif[] = (qResult.data || []).map((q: any) => ({
            id: q.id,
            type: "question_answered",
            villa_name: q.villas?.name || "Villa",
            question: q.question,
            answer: q.answer || "",
            created_at: q.created_at,
            is_read: readQuestionIds.includes(q.id),
        }));

        setNotifications([...reservations, ...questions].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ));
        setLoading(false);
    }

    async function loadQuestions(userEmail: string) {
        setLoading(true);
        const readIds: string[] = JSON.parse(localStorage.getItem("vt_read_question_ids") || "[]");

        const { data, error } = await supabase
            .from("villa_questions")
            .select("id, question, answer, is_answered, created_at, villas(name)")
            .eq("user_email", userEmail)
            .eq("is_answered", true)
            .order("created_at", { ascending: false });

        if (!error && data) {
            const questions: QuestionNotif[] = data.map((q: any) => ({
                id: q.id,
                type: "question_answered",
                villa_name: q.villas?.name || "Villa",
                question: q.question,
                answer: q.answer || "",
                created_at: q.created_at,
                is_read: readIds.includes(q.id),
            }));
            setNotifications(questions);
        }
        setLoading(false);
    }

    function markRead(id: string, type: "reservation" | "question_answered") {
        const key = type === "reservation" ? "vt_read_notif_ids" : "vt_read_question_ids";
        const stored: string[] = JSON.parse(localStorage.getItem(key) || "[]");
        if (!stored.includes(id)) {
            localStorage.setItem(key, JSON.stringify([...stored, id]));
        }
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        window.dispatchEvent(new Event("vt_notifications_read"));
    }

    function toggleExpand(id: string, type: "reservation" | "question_answered") {
        const next = expanded === id ? null : id;
        setExpanded(next);
        if (next) markRead(id, type);
    }

    async function handleEmailSearch(e: React.FormEvent) {
        e.preventDefault();
        if (!emailInput.trim()) return;
        setSearching(true);
        localStorage.setItem("vt_user_email", emailInput.trim());
        setEmail(emailInput.trim());
        await loadQuestions(emailInput.trim());
        setSearching(false);
    }

    const filtered = notifications.filter(n =>
        category === "all" || n.type === category
    );

    const unread = notifications.filter(n => !n.is_read).length;
    const counts: Record<CategoryFilter, number> = {
        all: notifications.length,
        reservation: notifications.filter(n => n.type === "reservation").length,
        question_answered: notifications.filter(n => n.type === "question_answered").length,
    };

    if (authLoading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid #e2e8f0", borderTopColor: "#6772e5", animation: "spin 0.7s linear infinite" }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    /* ── Not logged in + no email ── */
    if (!user && !email) {
        return (
            <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
                <style>{pageStyles}</style>
                <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
                    <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #f3f0ff, #e0f0ff)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6772e5" strokeWidth="1.5">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                        </svg>
                    </div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", marginBottom: 12, fontFamily: "'Poppins', sans-serif" }}>Bildirimlerim</h1>

                    {/* Login CTA */}
                    <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 16, padding: "20px 24px", marginBottom: 24, textAlign: "left" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            </div>
                            <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 15 }}>Rezervasyon bildirimleri için</div>
                        </div>
                        <p style={{ color: "#64748b", fontSize: 14, margin: "0 0 14px", lineHeight: 1.6 }}>
                            Rezervasyonlarınızın durumunu takip etmek için hesabınıza giriş yapın.
                        </p>
                        <Link href="/giris" style={{ display: "inline-block", padding: "10px 20px", borderRadius: 10, background: "#0f172a", color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
                            Giriş Yap
                        </Link>
                    </div>

                    {/* Email form for question answers */}
                    <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 16, padding: "20px 24px", textAlign: "left" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#50b0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                            </div>
                            <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 15 }}>Soru cevapları için</div>
                        </div>
                        <p style={{ color: "#64748b", fontSize: 14, margin: "0 0 14px", lineHeight: 1.6 }}>
                            Soru gönderirken kullandığınız e-posta adresinizi girin.
                        </p>
                        <form onSubmit={handleEmailSearch} style={{ display: "flex", gap: 8 }}>
                            <input
                                type="email" required value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                placeholder="ornek@email.com"
                                style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                            />
                            <button type="submit" disabled={searching}
                                style={{ padding: "10px 18px", borderRadius: 10, background: "#6772e5", color: "#fff", border: "none", fontWeight: 600, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap" }}>
                                {searching ? "..." : "Göster"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "#f8fafc", paddingBottom: 80 }}>
            <style>{pageStyles}</style>

            {/* ── Header ── */}
            <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 clamp(16px, 5vw, 40px)" }}>
                <div style={{ maxWidth: 720, margin: "0 auto", padding: "clamp(60px, 8vw, 100px) 0 0" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, paddingBottom: 24 }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                                <h1 style={{ fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 800, color: "#0f172a", margin: 0, fontFamily: "'Poppins', sans-serif" }}>
                                    Bildirimlerim
                                </h1>
                                {unread > 0 && (
                                    <div style={{ background: "#ef4444", color: "#fff", fontSize: 12, fontWeight: 700, padding: "2px 9px", borderRadius: 20 }}>
                                        {unread}
                                    </div>
                                )}
                            </div>
                            {user ? (
                                <div style={{ fontSize: 13, color: "#94a3b8" }}>{user.email}</div>
                            ) : email ? (
                                <div style={{ fontSize: 13, color: "#94a3b8", display: "flex", alignItems: "center", gap: 6 }}>
                                    {email}
                                    <button onClick={() => { setEmail(null); setNotifications([]); setEmailInput(""); localStorage.removeItem("vt_user_email"); }}
                                        style={{ background: "none", border: "none", color: "#6772e5", fontSize: 12, fontWeight: 600, cursor: "pointer", padding: 0 }}>
                                        değiştir
                                    </button>
                                </div>
                            ) : null}
                        </div>
                        {!user && (
                            <Link href="/giris" style={{ fontSize: 13, fontWeight: 600, color: "#6772e5", textDecoration: "none", background: "#f3f0ff", padding: "8px 16px", borderRadius: 10, border: "1px solid #c4b5fd" }}>
                                Giriş Yap →
                            </Link>
                        )}
                    </div>

                    {/* ── Category Tabs ── */}
                    <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 0 }}>
                        {([
                            { key: "all" as CategoryFilter, label: "Tümü", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
                            { key: "reservation" as CategoryFilter, label: "Rezervasyonlar", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> },
                            { key: "question_answered" as CategoryFilter, label: "Soru Cevapları", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
                        ]).map(({ key, label, icon }) => (
                            <button key={key} onClick={() => setCategory(key)}
                                className={`notif-tab${category === key ? " notif-tab-active" : ""}`}>
                                {icon} {label}
                                {counts[key] > 0 && <span className="notif-tab-count">{counts[key]}</span>}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Content ── */}
            <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px clamp(16px, 5vw, 40px)" }}>
                {loading ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{ background: "#fff", borderRadius: 16, height: 100, animation: "pulse 1.5s ease-in-out infinite" }} />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 20px" }}>
                        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                            </svg>
                        </div>
                        <div style={{ color: "#64748b", fontSize: 15, fontWeight: 500, marginBottom: 6 }}>
                            {category === "all" ? "Henüz bildirim yok" : category === "reservation" ? "Rezervasyon bildirimi yok" : "Yanıtlanmış soru yok"}
                        </div>
                        <div style={{ color: "#94a3b8", fontSize: 14 }}>
                            {category === "reservation" ? "Rezervasyonlarınız güncellendiğinde buraya gelecek" : "Sorularınız yanıtlandığında burada görünecek"}
                        </div>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {filtered.map(notif => (
                            notif.type === "reservation"
                                ? <ReservationCard key={notif.id} notif={notif as ReservationNotif} expanded={expanded === notif.id} onToggle={() => toggleExpand(notif.id, "reservation")} />
                                : <QuestionCard key={notif.id} notif={notif as QuestionNotif} expanded={expanded === notif.id} onToggle={() => toggleExpand(notif.id, "question_answered")} />
                        ))}
                    </div>
                )}
            </div>

            {/* ── Mini Footer ── */}
            <div style={{ padding: "4px 1%", borderTop: "1px solid #dfdfe3", marginTop: 40 }}>
                <div className="middleft smallFooterC">
                    <div className="smallFooterLeft1">© 2025 Villa Tatilinde<br />Belge No: 18069 - PRAEDIUM GROUP TRAVEL AGENCY</div>
                    <div className="smallFooterRight1"><Link href="/sartlar-kosullar">Koşullar ve Şartlar</Link></div>
                    <div className="smallFooterRight2"><Link href="/gizlilik-politikasi">Gizlilik</Link></div>
                </div>
            </div>
        </div>
    );
}

/* ─── Reservation Card ─── */
function ReservationCard({ notif, expanded, onToggle }: { notif: ReservationNotif; expanded: boolean; onToggle: () => void }) {
    const status = STATUS_MAP[notif.status] || { label: notif.status, color: "#64748b", bg: "#f1f5f9" };
    return (
        <div className="notif-card" style={{ borderLeft: notif.is_read ? "3px solid transparent" : "3px solid #6772e5" }} onClick={onToggle}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: notif.is_read ? "#f1f5f9" : "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: notif.is_read ? "#94a3b8" : "#6772e5" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#6772e5", textTransform: "uppercase", letterSpacing: "0.8px" }}>Rezervasyon</span>
                        <span style={{ fontSize: 11, color: "#94a3b8" }}>•</span>
                        <span style={{ fontSize: 12, color: "#94a3b8" }}>{timeAgo(notif.created_at)}</span>
                        {!notif.is_read && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#6772e5", display: "inline-block" }} />}
                    </div>
                    <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 15, marginBottom: 4 }}>{notif.villa_name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 12, color: "#64748b" }}>{notif.ref_code}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: status.color, background: status.bg, padding: "2px 10px", borderRadius: 20 }}>{status.label}</span>
                    </div>
                </div>
                <div style={{ color: "#94a3b8", transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "none", flexShrink: 0, marginTop: 4 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
            </div>

            {expanded && (
                <div style={{ marginTop: 16, marginLeft: 54 }}>
                    <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "16px 18px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Giriş</div>
                                <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{formatDate(notif.check_in_date)}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Çıkış</div>
                                <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{formatDate(notif.check_out_date)}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Durum</div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: status.color }}>{status.label}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Ref No</div>
                                <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{notif.ref_code}</div>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: 12 }}>
                        <Link href="/hesabim" onClick={(e) => e.stopPropagation()}
                            style={{ fontSize: 13, color: "#6772e5", fontWeight: 600, textDecoration: "none", background: "#ede9fe", padding: "8px 16px", borderRadius: 8, display: "inline-block" }}>
                            Hesabımda Görüntüle →
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─── Question Card ─── */
function QuestionCard({ notif, expanded, onToggle }: { notif: QuestionNotif; expanded: boolean; onToggle: () => void }) {
    return (
        <div className="notif-card" style={{ borderLeft: notif.is_read ? "3px solid transparent" : "3px solid #50b0f0" }} onClick={onToggle}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: notif.is_read ? "#f1f5f9" : "#e0f0ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: notif.is_read ? "#94a3b8" : "#50b0f0" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#50b0f0", textTransform: "uppercase", letterSpacing: "0.8px" }}>Soru Cevabı</span>
                        <span style={{ fontSize: 11, color: "#94a3b8" }}>•</span>
                        <span style={{ fontSize: 12, color: "#94a3b8" }}>{timeAgo(notif.created_at)}</span>
                        {!notif.is_read && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#50b0f0", display: "inline-block" }} />}
                    </div>
                    <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 15, marginBottom: 2 }}>{notif.villa_name}</div>
                    <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: expanded ? 99 : 2, WebkitBoxOrient: "vertical" as const }}>
                        <span style={{ fontWeight: 600, color: "#475569" }}>Sorunuz: </span>{notif.question}
                    </div>
                </div>
                <div style={{ color: "#94a3b8", transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "none", flexShrink: 0, marginTop: 4 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
            </div>
            {expanded && notif.answer && (
                <div style={{ marginTop: 16, marginLeft: 54 }}>
                    <div style={{ background: "#e0f0ff", border: "1px solid #bae6fd", borderRadius: 12, padding: "16px 18px" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#50b0f0", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>Villa Tatilinde Yanıtı</div>
                        <div style={{ fontSize: 14, color: "#1e293b", lineHeight: 1.7 }}>{notif.answer}</div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─── Styles ─── */
const pageStyles = `
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
    .notif-tab {
        display: flex; align-items: center; gap: 7px;
        padding: 10px 16px; border: none; background: transparent;
        color: #64748b; font-size: 14px; font-weight: 500; cursor: pointer;
        border-bottom: 2px solid transparent; white-space: nowrap;
        transition: color 0.2s, border-color 0.2s; font-family: inherit;
    }
    .notif-tab:hover { color: #0f172a; }
    .notif-tab-active { color: #0f172a; border-bottom-color: #0f172a; font-weight: 700; }
    .notif-tab-count {
        background: #e2e8f0; color: #475569; font-size: 11px; font-weight: 700;
        padding: 2px 7px; border-radius: 20px; min-width: 20px; text-align: center;
    }
    .notif-tab-active .notif-tab-count { background: #0f172a; color: #fff; }
    .notif-card {
        background: #fff; border-radius: 16px; padding: 20px; cursor: pointer;
        border: 1px solid #e8ecf0; transition: box-shadow 0.2s, transform 0.15s;
    }
    .notif-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.07); transform: translateY(-1px); }
`;
