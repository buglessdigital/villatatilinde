"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface VillaQuestion {
    id: string;
    villa_id: string;
    user_name: string;
    user_email: string;
    user_phone?: string;
    question: string;
    answer: string | null;
    is_answered: boolean;
    created_at: string;
    villas: {
        name: string;
    };
}

export default function AdminSorular() {
    const [questions, setQuestions] = useState<VillaQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [answeringQuestion, setAnsweringQuestion] = useState<VillaQuestion | null>(null);
    const [answerText, setAnswerText] = useState("");

    useEffect(() => {
        loadQuestions();
    }, []);

    async function loadQuestions() {
        setLoading(true);
        const { data, error } = await supabase
            .from("villa_questions")
            .select(`
                *,
                villas ( name )
            `)
            .order("created_at", { ascending: false });

        if (!error && data) {
            setQuestions(data as any[]);
        }
        setLoading(false);
    }

    // Modal submit handler
    async function handleAnswerSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!answeringQuestion) return;

        const { error } = await supabase
            .from("villa_questions")
            .update({ answer: answerText, is_answered: true })
            .eq("id", answeringQuestion.id);

        if (!error) {
            setQuestions((prev) =>
                prev.map((q) =>
                    q.id === answeringQuestion.id
                        ? { ...q, answer: answerText, is_answered: true }
                        : q
                )
            );
            setAnsweringQuestion(null);
            setAnswerText("");
        } else {
            alert("Cevap kaydedilirken hata oluştu!");
        }
    }

    async function deleteQuestion(id: string) {
        if (!confirm("Bu soruyu silmek istediğinize emin misiniz?")) return;
        const { error } = await supabase.from("villa_questions").delete().eq("id", id);
        if (!error) {
            setQuestions((prev) => prev.filter((q) => q.id !== id));
        }
    }

    if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Sorular yükleniyor...</div>;

    return (
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e293b", fontFamily: "'Poppins', sans-serif" }}>Müşteri Soruları</h1>
                    <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>Villalara sorulan soruları yanıtlayın veya silin.</p>
                </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                        <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569", fontSize: 13, textTransform: "uppercase" }}>
                            <th style={{ padding: "16px 20px" }}>Durum</th>
                            <th style={{ padding: "16px 20px" }}>Tarih / Villa</th>
                            <th style={{ padding: "16px 20px" }}>Müşteri</th>
                            <th style={{ padding: "16px 20px" }}>Soru & Cevap</th>
                            <th style={{ padding: "16px 20px", textAlign: "right" }}>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.length === 0 ? (
                            <tr><td colSpan={5} style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>Masada yanıt bekleyen soru yok!</td></tr>
                        ) : questions.map((q) => (
                            <tr key={q.id} style={{ borderBottom: "1px solid #f1f5f9", background: q.is_answered ? "transparent" : "#fffbeb" }}>
                                <td style={{ padding: "16px 20px" }}>
                                    {q.is_answered ? (
                                        <span style={{ padding: "4px 8px", background: "#dcfce7", color: "#16a34a", borderRadius: 6, fontSize: 12, fontWeight: 600 }}>Cevaplandı</span>
                                    ) : (
                                        <span style={{ padding: "4px 8px", background: "#fef3c7", color: "#d97706", borderRadius: 6, fontSize: 12, fontWeight: 600 }}>Bekliyor</span>
                                    )}
                                </td>
                                <td style={{ padding: "16px 20px", color: "#64748b", fontSize: 13 }}>
                                    <div>{new Date(q.created_at).toLocaleDateString("tr-TR")}</div>
                                    <div style={{ color: "#0f172a", fontWeight: 500, marginTop: 4 }}>{q.villas?.name || "Bilinmiyor"}</div>
                                </td>
                                <td style={{ padding: "16px 20px" }}>
                                    <div style={{ fontWeight: 600, color: "#1e293b", fontSize: 14 }}>{q.user_name}</div>
                                    <div style={{ color: "#64748b", fontSize: 12 }}>{q.user_email}</div>
                                    {q.user_phone && <div style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>Tel: {q.user_phone}</div>}
                                </td>
                                <td style={{ padding: "16px 20px", color: "#334155", fontSize: 13, maxWidth: 350 }}>
                                    <div style={{ fontWeight: 600, color: "#1e293b", marginBottom: 4 }}>Soru:</div>
                                    <div>{q.question}</div>
                                    {q.is_answered && q.answer && (
                                        <div style={{ margin: "10px 0 0", padding: "10px", background: "#f8fafc", borderRadius: 8, borderLeft: "3px solid #3b82f6" }}>
                                            <strong style={{ color: "#1e293b", display: "block", marginBottom: 2 }}>Yanıtınız:</strong>
                                            {q.answer}
                                        </div>
                                    )}
                                </td>
                                <td style={{ padding: "16px 20px", textAlign: "right" }}>
                                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                        <button 
                                            onClick={() => {
                                                setAnsweringQuestion(q);
                                                setAnswerText(q.answer || "");
                                            }}
                                            style={{ 
                                                padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none",
                                                background: "#3b82f6", color: "#fff" 
                                            }}
                                        >
                                            {q.is_answered ? "Düzenle" : "Cevapla"}
                                        </button>
                                        <button 
                                            onClick={() => deleteQuestion(q.id)}
                                            style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "1px solid #fee2e2", background: "#fff", color: "#dc2626" }}
                                        >
                                            Sil
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Answer Modal */}
            {answeringQuestion && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
                    <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 500, maxWidth: "90%", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}>
                        <h2 style={{ fontSize: 20, fontWeight: 600, color: "#1e293b", marginBottom: 16 }}>Soruya Yanıt Ver</h2>
                        <div style={{ padding: 16, background: "#f1f5f9", borderRadius: 8, color: "#475569", fontSize: 14, marginBottom: 20 }}>
                            "{answeringQuestion.question}"
                        </div>
                        <form onSubmit={handleAnswerSubmit}>
                            <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#334155", marginBottom: 8 }}>Yanıtınız</label>
                            <textarea
                                value={answerText}
                                onChange={(e) => setAnswerText(e.target.value)}
                                rows={5}
                                required
                                style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, fontFamily: "inherit", outline: "none", resize: "vertical", marginBottom: 20 }}
                                placeholder="Müşteriye verilecek cevabı buraya yazın..."
                            />
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                                <button type="button" onClick={() => setAnsweringQuestion(null)} style={{ padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, background: "#f1f5f9", color: "#64748b", border: "none", cursor: "pointer" }}>İptal</button>
                                <button type="submit" style={{ padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, background: "#3b82f6", color: "#fff", border: "none", cursor: "pointer" }}>Yanıtı Kaydet</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
