"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface BlogRow {
    id: string;
    slug: string;
    title: string;
    subtitle: string;
    summary?: string;
    cover_image_url: string;
    is_published: boolean;
    published_at: string;
    created_at: string;
}

export default function AdminBloglar() {
    const [blogs, setBlogs] = useState<BlogRow[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBlogs();
    }, []);

    async function loadBlogs() {
        const { data } = await supabase
            .from("blogs")
            .select("id, slug, title, subtitle, summary, cover_image_url, is_published, published_at, created_at")
            .order("published_at", { ascending: false });
        if (data) setBlogs(data);
        setLoading(false);
    }

    async function togglePublished(id: string, current: boolean) {
        await supabase.from("blogs").update({ is_published: !current }).eq("id", id);
        setBlogs((prev) => prev.map((b) => (b.id === id ? { ...b, is_published: !current } : b)));
    }

    async function deleteBlog(id: string, title: string) {
        if (!confirm(`"${title}" blog yazısını silmek istediğinizden emin misiniz?`)) return;
        await supabase.from("blogs").delete().eq("id", id);
        setBlogs((prev) => prev.filter((b) => b.id !== id));
    }

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e293b", fontFamily: "'Poppins', sans-serif" }}>Blog Yazıları</h1>
                    <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>Toplam {blogs.length} yazı</p>
                </div>
                <Link href="/admin/bloglar/yeni" style={{ padding: "10px 20px", borderRadius: 10, background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
                    + Yeni Blog Yazısı
                </Link>
            </div>

            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                    <thead>
                        <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                            <th style={thStyle}>Görsel</th>
                            <th style={{ ...thStyle, textAlign: "left" }}>Başlık</th>
                            <th style={thStyle}>Tarih</th>
                            <th style={thStyle}>Durum</th>
                            <th style={thStyle}>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>Yükleniyor...</td></tr>
                        ) : blogs.length === 0 ? (
                            <tr><td colSpan={5} style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>Blog yazısı bulunamadı</td></tr>
                        ) : blogs.map((blog) => (
                            <tr key={blog.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                <td style={{ padding: "10px 16px", textAlign: "center" }}>
                                    <img src={blog.cover_image_url || "/images/natureview.jpg"} alt={blog.title} style={{ width: 56, height: 40, objectFit: "cover", borderRadius: 6 }} />
                                </td>
                                <td style={{ padding: "10px 16px" }}>
                                    <div style={{ fontWeight: 600, color: "#1e293b" }}>{blog.title}</div>
                                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2, maxWidth: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{blog.summary}</div>
                                </td>
                                <td style={{ padding: "10px 16px", textAlign: "center", color: "#64748b", fontSize: 13 }}>
                                    {new Date(blog.created_at).toLocaleDateString("tr-TR")}
                                </td>
                                <td style={{ padding: "10px 16px", textAlign: "center" }}>
                                    <button onClick={() => togglePublished(blog.id, blog.is_published)} style={{ padding: "4px 12px", borderRadius: 20, border: "none", fontSize: 12, fontWeight: 500, cursor: "pointer", background: blog.is_published ? "#dcfce7" : "#fee2e2", color: blog.is_published ? "#16a34a" : "#dc2626" }}>
                                        {blog.is_published ? "Yayında" : "Taslak"}
                                    </button>
                                </td>
                                <td style={{ padding: "10px 16px", textAlign: "center" }}>
                                    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                                        <Link href={`/admin/bloglar/${blog.id}`} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", color: "#3b82f6", fontSize: 12, fontWeight: 500, textDecoration: "none" }}>Düzenle</Link>
                                        <button onClick={() => deleteBlog(blog.id, blog.title)} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #fee2e2", background: "#fff", color: "#dc2626", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>Sil</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const thStyle: React.CSSProperties = { padding: "12px 16px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center" };
