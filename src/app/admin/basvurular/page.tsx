"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Search, Eye, X, Check, Clock, Edit } from "lucide-react";

interface VillaApplication {
    id: string;
    full_name: string;
    email: string;
    phone_code: string;
    phone_number: string;
    tourism_license_no: string | null;
    location: string;
    pool_type: string;
    notes: string | null;
    status: "pending" | "reviewed" | "approved" | "rejected";
    admin_notes: string | null;
    created_at: string;
    updated_at: string;
}

const STATUS_MAP = {
    pending: { label: "Beklemede", color: "#b45309", bg: "#fef3c7" },
    reviewed: { label: "İnceleniyor", color: "#1d4ed8", bg: "#dbeafe" },
    approved: { label: "Onaylandı", color: "#15803d", bg: "#dcfce7" },
    rejected: { label: "Reddedildi", color: "#b91c1c", bg: "#fee2e2" }
};

export default function AdminBasvurularPage() {
    const [applications, setApplications] = useState<VillaApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Modal state
    const [selectedApp, setSelectedApp] = useState<VillaApplication | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    
    // Edit state inside modal
    const [editStatus, setEditStatus] = useState<VillaApplication["status"]>("pending");
    const [editAdminNotes, setEditAdminNotes] = useState("");
    const [saving, setSaving] = useState(false);

    const fetchApplications = async () => {
        try {
            const { data, error } = await supabase
                .from("villa_applications")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            if (data) setApplications(data as VillaApplication[]);
        } catch (error) {
            console.error("Error fetching applications:", error);
            alert("Başvurular yüklenirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const filteredApplications = applications.filter(app => 
        app.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenModal = (app: VillaApplication) => {
        setSelectedApp(app);
        setEditStatus(app.status);
        setEditAdminNotes(app.admin_notes || "");
        setModalOpen(true);
    };

    const handleSaveUpdates = async () => {
        if (!selectedApp) return;
        setSaving(true);
        
        try {
            const { error } = await supabase
                .from("villa_applications")
                .update({
                    status: editStatus,
                    admin_notes: editAdminNotes,
                    updated_at: new Date().toISOString()
                })
                .eq("id", selectedApp.id);

            if (error) throw error;
            
            // Re-fetch or update local state
            await fetchApplications();
            setModalOpen(false);
            
        } catch (error) {
            console.error("Error updating application:", error);
            alert("Güncelleme sırasında bir hata oluştu.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Yükleniyor...</div>;
    }

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b" }}>Villa Sahibi Başvuruları</h1>
                
                <div style={{ position: "relative", width: 300 }}>
                    <Search size={18} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                    <input 
                        type="text" 
                        placeholder="İsim, email veya konum ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: "100%", padding: "10px 12px 10px 38px",
                            border: "1px solid #cbd5e1", borderRadius: 8, outline: "none", fontSize: 14
                        }}
                    />
                </div>
            </div>

            {/* Table */}
            <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                                <th style={{ padding: "12px 20px", fontSize: 13, fontWeight: 600, color: "#64748b" }}>Tarih</th>
                                <th style={{ padding: "12px 20px", fontSize: 13, fontWeight: 600, color: "#64748b" }}>Ad Soyad</th>
                                <th style={{ padding: "12px 20px", fontSize: 13, fontWeight: 600, color: "#64748b" }}>İletişim</th>
                                <th style={{ padding: "12px 20px", fontSize: 13, fontWeight: 600, color: "#64748b" }}>Konum & Havuz</th>
                                <th style={{ padding: "12px 20px", fontSize: 13, fontWeight: 600, color: "#64748b" }}>Durum</th>
                                <th style={{ padding: "12px 20px", fontSize: 13, fontWeight: 600, color: "#64748b", textAlign: "right" }}>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredApplications.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ padding: "30px", textAlign: "center", color: "#94a3b8" }}>
                                        Başvuru bulunamadı.
                                    </td>
                                </tr>
                            ) : filteredApplications.map(app => {
                                const st = STATUS_MAP[app.status];
                                const date = new Date(app.created_at).toLocaleDateString("tr-TR", { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                                
                                return (
                                    <tr key={app.id} style={{ borderBottom: "1px solid #f1f5f9" }} className="hover:bg-slate-50">
                                        <td style={{ padding: "16px 20px", fontSize: 14, color: "#475569" }}>{date}</td>
                                        <td style={{ padding: "16px 20px", fontSize: 14, fontWeight: 500, color: "#0f172a" }}>{app.full_name}</td>
                                        <td style={{ padding: "16px 20px", fontSize: 13, color: "#475569" }}>
                                            <div>{app.email}</div>
                                            <div style={{ marginTop: 2 }}>{app.phone_code} {app.phone_number}</div>
                                        </td>
                                        <td style={{ padding: "16px 20px", fontSize: 14, color: "#475569" }}>
                                            <div>{app.location}</div>
                                            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{app.pool_type}</div>
                                        </td>
                                        <td style={{ padding: "16px 20px" }}>
                                            <span style={{ 
                                                padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                                                background: st.bg, color: st.color
                                            }}>
                                                {st.label}
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px 20px", textAlign: "right" }}>
                                            <button 
                                                onClick={() => handleOpenModal(app)}
                                                style={{ 
                                                    padding: "6px 12px", background: "#f1f5f9", border: "none", 
                                                    borderRadius: 6, color: "#334155", cursor: "pointer", fontSize: 13,
                                                    display: "inline-flex", alignItems: "center", gap: 6, transition: "background 0.2s"
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = "#e2e8f0"}
                                                onMouseLeave={(e) => e.currentTarget.style.background = "#f1f5f9"}
                                            >
                                                <Eye size={14} /> Detay
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Details Modal */}
            {modalOpen && selectedApp && (
                <div style={{ 
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
                    background: "rgba(15, 23, 42, 0.6)", zIndex: 9999,
                    display: "flex", alignItems: "center", justifyContent: "center", padding: 20
                }}>
                    <div style={{ 
                        background: "white", borderRadius: 16, width: "100%", maxWidth: 700,
                        maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
                    }}>
                        {/* Modal Header */}
                        <div style={{ padding: "20px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#0f172a" }}>Başvuru Detayı</h2>
                            <button onClick={() => setModalOpen(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#64748b" }}>
                                <X size={20} />
                            </button>
                        </div>
                        
                        {/* Modal Body */}
                        <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                                <div>
                                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Ad Soyad</div>
                                    <div style={{ fontSize: 15, fontWeight: 500, color: "#0f172a" }}>{selectedApp.full_name}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Tarih</div>
                                    <div style={{ fontSize: 15, color: "#0f172a" }}>
                                        {new Date(selectedApp.created_at).toLocaleString("tr-TR")}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>E-posta</div>
                                    <div style={{ fontSize: 15, color: "#0f172a" }}>{selectedApp.email}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Telefon</div>
                                    <div style={{ fontSize: 15, color: "#0f172a" }}>{selectedApp.phone_code} {selectedApp.phone_number}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Konum / İl / İlçe</div>
                                    <div style={{ fontSize: 15, color: "#0f172a" }}>{selectedApp.location}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Havuz Çeşidi</div>
                                    <div style={{ fontSize: 15, color: "#0f172a" }}>{selectedApp.pool_type}</div>
                                </div>
                                <div style={{ gridColumn: "span 2" }}>
                                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Turizm Belgesi No</div>
                                    <div style={{ fontSize: 15, color: selectedApp.tourism_license_no ? "#0f172a" : "#94a3b8" }}>
                                        {selectedApp.tourism_license_no || "Belirtilmemiş"}
                                    </div>
                                </div>
                                <div style={{ gridColumn: "span 2" }}>
                                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Müşteri Ek Açıklaması</div>
                                    <div style={{ fontSize: 14, color: selectedApp.notes ? "#0f172a" : "#94a3b8", background: "#f8fafc", padding: 12, borderRadius: 8, whiteSpace: "pre-wrap" }}>
                                        {selectedApp.notes || "Açıklama girilmemiş."}
                                    </div>
                                </div>
                            </div>

                            <hr style={{ border: 0, height: 1, background: "#e2e8f0", margin: "24px 0" }} />

                            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", marginBottom: 16 }}>Yönetim İşlemleri</h3>
                            
                            <div style={{ marginBottom: 20 }}>
                                <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#475569", marginBottom: 8 }}>Başvuru Durumu</label>
                                <select 
                                    value={editStatus}
                                    onChange={(e) => setEditStatus(e.target.value as any)}
                                    style={{ 
                                        width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", 
                                        borderRadius: 8, outline: "none", fontSize: 14, background: "white"
                                    }}
                                >
                                    <option value="pending">Beklemede</option>
                                    <option value="reviewed">İnceleniyor</option>
                                    <option value="approved">Onaylandı</option>
                                    <option value="rejected">Reddedildi</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#475569", marginBottom: 8 }}>Admin Notları (Sadece yöneticiler görebilir)</label>
                                <textarea 
                                    value={editAdminNotes}
                                    onChange={(e) => setEditAdminNotes(e.target.value)}
                                    placeholder="Bu başvuruyla ilgili kendi notlarınızı buraya ekleyebilirsiniz..."
                                    style={{ 
                                        width: "100%", padding: "12px", border: "1px solid #cbd5e1", 
                                        borderRadius: 8, outline: "none", fontSize: 14, minHeight: 100, resize: "vertical"
                                    }}
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div style={{ padding: "16px 24px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end", gap: 12, background: "#f8fafc", borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
                            <button 
                                onClick={() => setModalOpen(false)}
                                disabled={saving}
                                style={{ 
                                    padding: "8px 16px", background: "white", border: "1px solid #cbd5e1", 
                                    borderRadius: 6, color: "#475569", fontWeight: 500, cursor: saving ? "not-allowed" : "pointer"
                                }}
                            >
                                İptal
                            </button>
                            <button 
                                onClick={handleSaveUpdates}
                                disabled={saving}
                                style={{ 
                                    padding: "8px 16px", background: "#3b82f6", border: "none", 
                                    borderRadius: 6, color: "white", fontWeight: 500, cursor: saving ? "not-allowed" : "pointer",
                                    display: "flex", alignItems: "center", gap: 8
                                }}
                            >
                                {saving ? "Kaydediliyor..." : <><Check size={16} /> Değişiklikleri Kaydet</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
