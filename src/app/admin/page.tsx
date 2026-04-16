"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Home, FileText, HelpCircle, Folder, MapPin, Plus, ExternalLink } from "lucide-react";

interface DashboardStats {
    villaCount: number;
    blogCount: number;
    faqCount: number;
    categoryCount: number;
    destinationCount: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        villaCount: 0,
        blogCount: 0,
        faqCount: 0,
        categoryCount: 0,
        destinationCount: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                const [villas, blogs, faqs, categories, destinations] = await Promise.all([
                    supabase.from("villas").select("id", { count: "exact", head: true }),
                    supabase.from("blogs").select("id", { count: "exact", head: true }),
                    supabase.from("faqs").select("id", { count: "exact", head: true }),
                    supabase.from("categories").select("id", { count: "exact", head: true }),
                    supabase.from("destinations").select("id", { count: "exact", head: true }),
                ]);

                setStats({
                    villaCount: villas.count || 0,
                    blogCount: blogs.count || 0,
                    faqCount: faqs.count || 0,
                    categoryCount: categories.count || 0,
                    destinationCount: destinations.count || 0,
                });
            } catch (err) {
                console.error("Dashboard istatistikleri yüklenemedi:", err);
            } finally {
                setLoading(false);
            }
        }
        loadStats();
    }, []);

    const statCards = [
        { label: "Villalar", value: stats.villaCount, icon: <Home size={28} color="#50b0f0" />, color: "#50b0f0", href: "/admin/villalar" },
        { label: "Blog Yazıları", value: stats.blogCount, icon: <FileText size={28} color="#10b981" />, color: "#10b981", href: "/admin/bloglar" },
        { label: "SSS", value: stats.faqCount, icon: <HelpCircle size={28} color="#f59e0b" />, color: "#f59e0b", href: "/admin/sss" },
        { label: "Kategoriler", value: stats.categoryCount, icon: <Folder size={28} color="#8b5cf6" />, color: "#8b5cf6", href: "/admin/kategoriler" },
        { label: "Destinasyonlar", value: stats.destinationCount, icon: <MapPin size={28} color="#ef4444" />, color: "#ef4444", href: "/admin/destinasyonlar" },
    ];

    return (
        <div>
            <h1 style={{
                fontSize: 26,
                fontWeight: 700,
                color: "#1e293b",
                marginBottom: 8,
                fontFamily: "'Poppins', sans-serif",
            }}>
                Dashboard
            </h1>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 32 }}>
                Villa Tatilinde yönetim paneline hoş geldiniz
            </p>

            {/* Stat Cards */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 20,
            }}>
                {statCards.map((card) => (
                    <a
                        key={card.label}
                        href={card.href}
                        style={{
                            textDecoration: "none",
                            background: "#fff",
                            borderRadius: 16,
                            padding: "24px 20px",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                            transition: "transform 0.15s, box-shadow 0.15s",
                            cursor: "pointer",
                        }}
                    >
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 16,
                        }}>
                            <span style={{
                                fontSize: 32,
                                width: 52,
                                height: 52,
                                borderRadius: 14,
                                background: `${card.color}15`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}>
                                {card.icon}
                            </span>
                        </div>
                        <div style={{
                            fontSize: 32,
                            fontWeight: 700,
                            color: "#1e293b",
                            fontFamily: "'Poppins', sans-serif",
                        }}>
                            {loading ? "—" : card.value}
                        </div>
                        <div style={{
                            fontSize: 14,
                            color: "#64748b",
                            marginTop: 4,
                        }}>
                            {card.label}
                        </div>
                    </a>
                ))}
            </div>

            {/* Quick Actions */}
            <div style={{ marginTop: 40 }}>
                <h2 style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#1e293b",
                    marginBottom: 16,
                }}>
                    Hızlı İşlemler
                </h2>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {[
                        { label: "Yeni Villa Ekle", href: "/admin/villalar/yeni", color: "#50b0f0", icon: <Plus size={16} /> },
                        { label: "Blog Yazısı Ekle", href: "/admin/bloglar/yeni", color: "#10b981", icon: <Plus size={16} /> },
                        { label: "Siteyi Görüntüle", href: "/", color: "#8b5cf6", icon: <ExternalLink size={16} /> },
                    ].map((action) => (
                        <a
                            key={action.label}
                            href={action.href}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "10px 20px",
                                borderRadius: 10,
                                border: `1px solid ${action.color}40`,
                                background: `${action.color}10`,
                                color: action.color,
                                fontSize: 14,
                                fontWeight: 500,
                                textDecoration: "none",
                                transition: "all 0.15s",
                            }}
                        >
                            {action.icon} {action.label}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
