"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface FaqRow {
    id: string;
    question_tr: string;
    answer_html_tr: string;
    sort_order: number;
    is_published: boolean;
}

export default function AdminSSS() {
    const [faqs, setFaqs] = useState<FaqRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({ question_tr: "", answer_html_tr: "", sort_order: 0, is_published: true });
    const [saving, setSaving] = useState(false);

    useEffect(() => { loadFaqs(); }, []);

    async function loadFaqs() {
        const { data } = await supabase.from("faqs").select("*").order("sort_order");
        if (data) setFaqs(data);
        setLoading(false);
    }

    async function deleteFaq(id: string) {
        if (!confirm("Bu soruyu silmek istediğinizden emin misiniz?")) return;
        await supabase.from("faqs").delete().eq("id", id);
        setFaqs((prev) => prev.filter((f) => f.id !== id));
    }

    function startEdit(faq: FaqRow) {
        setEditingId(faq.id);
        setForm({ question_tr: faq.question_tr, answer_html_tr: faq.answer_html_tr, sort_order: faq.sort_order, is_published: faq.is_published });
    }

    function startNew() {
        setEditingId("new");
        setForm({ question_tr: "", answer_html_tr: "", sort_order: faqs.length + 1, is_published: true });
    }

    async function handleSave() {
        setSaving(true);
        if (editingId === "new") {
            const slug = form.question_tr
                .toLowerCase()
                .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
                .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
                .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
                + "-" + Date.now();
            const { data, error } = await supabase.from("faqs").insert({ ...form, slug }).select().single();
            if (error) { alert("Kayıt hatası: " + error.message); setSaving(false); return; }
            if (data) setFaqs((prev) => [...prev, data]);
        } else {
            const { error } = await supabase.from("faqs").update(form).eq("id", editingId);
            if (error) { alert("Güncelleme hatası: " + error.message); setSaving(false); return; }
            setFaqs((prev) => prev.map((f) => (f.id === editingId ? { ...f, ...form } : f)));
        }
        setEditingId(null);
        setSaving(false);
    }

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e293b", fontFamily: "'Poppins', sans-serif" }}>Sıkça Sorulan Sorular</h1>
                    <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>Toplam {faqs.length} soru</p>
                </div>
                <button onClick={startNew} style={{ padding: "10px 20px", borderRadius: 10, background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}>
                    + Yeni Soru Ekle
                </button>
            </div>

            {/* Edit/Add Form */}
            {editingId && (
                <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: 24, marginBottom: 20 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{editingId === "new" ? "Yeni Soru" : "Soruyu Düzenle"}</h3>
                    <div style={{ marginBottom: 12 }}>
                        <label style={labelStyle}>Soru</label>
                        <input style={inputStyle} value={form.question_tr} onChange={(e) => setForm({ ...form, question_tr: e.target.value })} placeholder="Soru metni..." />
                    </div>
                    <div style={{ marginBottom: 12 }}>
                        <label style={labelStyle}>Cevap (Link eklemek için metni seçip üstteki zincir 🔗 ikonuna tıklayın)</label>
                        <div style={{ background: "#fff", borderRadius: 8, overflow: 'hidden' }}>
                            <ReactQuill 
                                theme="snow" 
                                value={form.answer_html_tr} 
                                onChange={(val) => setForm({ ...form, answer_html_tr: val })}
                                modules={{
                                    toolbar: [
                                        [{ 'header': [1, 2, false] }],
                                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                                        ['link'],
                                        ['clean']
                                    ],
                                }}
                            />
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 12 }}>
                        <div>
                            <label style={labelStyle}>Sıralama</label>
                            <input type="number" style={{ ...inputStyle, width: 80 }} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: +e.target.value })} />
                        </div>
                        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginTop: 18 }}>
                            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} style={{ width: 18, height: 18, accentColor: "#f59e0b" }} />
                            Yayında
                        </label>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={handleSave} disabled={saving} style={{ padding: "8px 20px", borderRadius: 8, background: "#f59e0b", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>
                            {saving ? "Kaydediliyor..." : "Kaydet"}
                        </button>
                        <button onClick={() => setEditingId(null)} style={{ padding: "8px 20px", borderRadius: 8, background: "#f1f5f9", color: "#64748b", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>İptal</button>
                    </div>
                </div>
            )}

            {/* FAQ List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {loading ? (
                    <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>Yükleniyor...</div>
                ) : faqs.map((faq) => (
                    <div key={faq.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "16px 20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                    <div style={{ fontSize: 15, fontWeight: 600, color: "#1e293b" }}>{faq.question_tr}</div>
                                    {!faq.is_published && <span style={{ fontSize: 11, background: "#fef3c7", color: "#d97706", padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>Taslak</span>}
                                </div>
                                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: faq.answer_html_tr }}></div>
                            </div>
                            <div style={{ display: "flex", gap: 8, marginLeft: 16, flexShrink: 0 }}>
                                <span style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>#{faq.sort_order}</span>
                                <button onClick={() => startEdit(faq)} style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #e2e8f0", background: "#fff", color: "#6772e5", fontSize: 12, cursor: "pointer" }}>Düzenle</button>
                                <button onClick={() => deleteFaq(faq.id)} style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #fee2e2", background: "#fff", color: "#dc2626", fontSize: 12, cursor: "pointer" }}>Sil</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 };
const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" };
