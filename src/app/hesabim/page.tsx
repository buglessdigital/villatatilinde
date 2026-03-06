"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

/* ─── Types ─── */
interface UserProfile {
    id: string;
    email: string | null;
    full_name: string | null;
    avatar_url: string | null;
    provider: string | null;
    phone_number: string | null;
    phone_code: string | null;
    subscription: boolean;
    created_at: string;
    updated_at: string;
}

interface WishVilla {
    id: string;
    slug: string;
    name: string;
    cover_image_url: string;
    location_label: string;
}

export default function HesabimPage() {
    const router = useRouter();

    /* ─── State ─── */
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [signOutConfirm, setSignOutConfirm] = useState(false);
    const [wishesArray, setWishesArray] = useState<WishVilla[]>([]);
    const [redOutline, setRedOutline] = useState(false);
    const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
    const [newImageFile, setNewImageFile] = useState<File | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Form fields (editable copies)
    const [formName, setFormName] = useState("");
    const [formEmail, setFormEmail] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);
    const personalInfoRef = useRef<HTMLDivElement>(null);
    const wishesRef = useRef<HTMLDivElement>(null);

    /* ─── Profile completion percentage ─── */
    const percent = (() => {
        if (!profile) return 0;
        const hasEmail = !!profile.email;
        const hasName = !!profile.full_name;
        const hasPhone = !!profile.phone_number;
        if (hasEmail && hasName && hasPhone) return 100;
        let count = 0;
        if (hasEmail) count++;
        if (hasName) count++;
        if (hasPhone) count++;
        return Math.round((count / 3) * 100);
    })();

    /* ─── Fetch user & profile ─── */
    const fetchUserData = useCallback(async () => {
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) {
                setUser(null);
                setProfile(null);
                setLoading(false);
                return;
            }

            setUser(authUser);

            // Fetch profile from public.users table
            const { data: profileData } = await supabase
                .from("users")
                .select("*")
                .eq("id", authUser.id)
                .single();

            if (profileData) {
                setProfile(profileData);
                setOriginalProfile({ ...profileData });
                setFormName(profileData.full_name || "");
                setFormEmail(profileData.email || "");

                // Fetch wishes (favorites)
                const { data: wishData } = await supabase
                    .from("user_wishes")
                    .select("villa_id, villas(id, slug, name, cover_image_url, location_label)")
                    .eq("user_id", authUser.id);

                if (wishData && wishData.length > 0) {
                    const villas = wishData
                        .map((w: Record<string, unknown>) => w.villas as WishVilla)
                        .filter(Boolean);
                    setWishesArray(villas);
                }
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    /* ─── Sign Out ─── */
    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            setUser(null);
            setProfile(null);
            setSignOutConfirm(false);
            router.push("/");
        } catch (error) {
            console.error("Sign out error:", error);
        }
    };

    /* ─── Scroll helpers ─── */
    const scrollToPersonalInfo = () => {
        personalInfoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const scrollToWishes = () => {
        setRedOutline(false);
        setTimeout(() => {
            setRedOutline(true);
            setTimeout(() => setRedOutline(false), 600);
        }, 100);
        wishesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    /* ─── Image Upload ─── */
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 50_000_000) {
            alert("Dosya boyutu 50 MB'ı aşamaz.");
            return;
        }

        setNewImageFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => {
            setNewImagePreview(ev.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    /* ─── Save Profile ─── */
    const handleSave = async () => {
        if (!user || !profile) return;

        // Validate email if changed
        if (formEmail && formEmail !== originalProfile?.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formEmail)) {
                alert("Geçersiz e-posta adresi. Lütfen kontrol edin.");
                return;
            }
        }

        setSaving(true);

        try {
            let avatarUrl = profile.avatar_url;

            // Upload new image if selected
            if (newImageFile) {
                setUploadingImage(true);
                const fileExt = newImageFile.name.split(".").pop();
                const fileName = `${user.id}_${Date.now()}.${fileExt}`;
                const filePath = `user-avatars/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from("avatars")
                    .upload(filePath, newImageFile, {
                        cacheControl: "3600",
                        upsert: true,
                    });

                if (uploadError) {
                    console.error("Upload error:", uploadError);
                    // Continue saving without new image
                } else {
                    const { data: urlData } = supabase.storage
                        .from("avatars")
                        .getPublicUrl(filePath);
                    avatarUrl = urlData.publicUrl;
                }
                setUploadingImage(false);
            }

            // Update users table
            const { error: updateError } = await supabase
                .from("users")
                .update({
                    full_name: formName || profile.full_name,
                    email: formEmail || profile.email,
                    avatar_url: avatarUrl,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", user.id);

            if (updateError) {
                console.error("Update error:", updateError);
                alert("Kaydetme sırasında hata: " + updateError.message);
            } else {
                // Update local state
                const updated: UserProfile = {
                    ...profile,
                    full_name: formName || profile.full_name,
                    email: formEmail || profile.email,
                    avatar_url: avatarUrl,
                };
                setProfile(updated);
                setOriginalProfile({ ...updated });
                setNewImagePreview(null);
                setNewImageFile(null);
                setToastMessage("Değişiklikler kaydedildi");
                setTimeout(() => setToastMessage(null), 3000);
            }
        } catch (error) {
            console.error("Save error:", error);
            alert("Bir hata oluştu.");
        } finally {
            setSaving(false);
        }
    };

    /* ─── Toggle Subscription ─── */
    const handleToggleSubscription = async (checked: boolean) => {
        if (!user || !profile) return;

        try {
            const { error } = await supabase
                .from("users")
                .update({ subscription: checked })
                .eq("id", user.id);

            if (!error) {
                setProfile({ ...profile, subscription: checked });
            }
        } catch (error) {
            console.error("Toggle subscription error:", error);
        }
    };

    /* ─── Render: Loading ─── */
    if (loading) {
        return (
            <div className="middle" style={{ minHeight: "70vh", minBlockSize: "70dvh" }}>
                <div style={{
                    width: 40, height: 40,
                    border: "4px solid #f3f3f3",
                    borderTop: "4px solid #6772e5",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                }}>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    /* ─── Render: No User → Login Prompt ─── */
    if (!user) {
        return (
            <div style={{ minHeight: "70vh", minBlockSize: "70dvh" }}>
                <div className="middle" style={{ height: "calc(100vh - 340px)", minBlockSize: "calc(100dvh - 340px)" }}>
                    <Link href="/giris">
                        <div className="bhs" style={{
                            marginTop: 148, marginBottom: 148,
                            padding: "12px 32px",
                            borderBottom: "1px solid #aaa"
                        }}>
                            <div className="middle btnActive" style={{ fontWeight: 600 }}>
                                Giriş Yap
                                <svg style={{ marginLeft: 12 }} width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        );
    }

    /* ─── Render: Main Account Page ─── */
    return (
        <div style={{ minHeight: "70vh", minBlockSize: "70dvh" }}>
            <div className="hesabim-animate paddingMobile hesabim-myC">
                <div className="middletp" style={{ alignItems: "flex-start" }}>

                    {/* ─── LEFT SIDEBAR (Desktop only) ─── */}
                    <div className="no767 hesabim-sidebar">
                        <div className="middlert">
                            <button
                                onClick={scrollToPersonalInfo}
                                className="btnActive"
                                style={{
                                    background: "none", border: "none", cursor: "pointer",
                                    fontSize: "1.2rem", padding: 4
                                }}
                            >
                                {/* createOutline (Ionicons) */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512" fill="none" stroke="currentColor" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M384 224v184a40 40 0 01-40 40H104a40 40 0 01-40-40V168a40 40 0 0140-40h167.48" /><path d="M459.94 53.25a16.06 16.06 0 00-23.22-.56L424.35 65a8 8 0 000 11.31l11.34 11.32a8 8 0 0011.34 0l12.06-12c6.1-6.09 6.67-16.01.85-22.38z" /><path d="M399.34 90L218.82 270.2a9 9 0 00-2.31 3.93L208.16 299a3.91 3.91 0 004.86 4.86l24.85-8.35a9 9 0 003.93-2.31L422 112.66a9 9 0 000-12.66l-9.95-10a9 9 0 00-12.71 0z" />
                                </svg>
                            </button>
                        </div>

                        {/* Avatar */}
                        <div className="middle" onClick={scrollToPersonalInfo} style={{ cursor: "pointer" }}>
                            {profile?.avatar_url ? (
                                <img
                                    src={profile.avatar_url}
                                    alt="Profil"
                                    style={{ borderRadius: "50%", width: 82, height: 82, objectFit: "cover" }}
                                />
                            ) : (
                                <div style={{
                                    borderRadius: "50%", width: 82, height: 82,
                                    background: "#e0e0e0",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 32, color: "#999", fontWeight: 600
                                }}>
                                    {profile?.full_name?.charAt(0)?.toUpperCase() || "?"}
                                </div>
                            )}
                        </div>

                        {/* Name */}
                        <div className="middle" style={{ marginTop: ".7rem", fontWeight: 600 }}>
                            <span className="skiptranslate">
                                {profile?.full_name || user?.user_metadata?.full_name || "Siz"}
                            </span>
                        </div>

                        {/* Phone */}
                        {profile?.phone_number && (
                            <div className="middle" style={{ color: "#6a6a6a", marginTop: 4, fontWeight: 300, fontSize: ".8rem" }}>
                                {profile.phone_code} {profile.phone_number}
                            </div>
                        )}

                        {/* Sidebar Menu */}
                        <div style={{ borderTop: "1px solid #dfdfe3", paddingTop: "1rem", marginTop: "1rem" }}>
                            {/* Hesabım */}
                            <div className="middleft btnActive hesabim-ppTab hesabim-ppTabActive">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 512 512" fill="none" stroke="currentColor" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: -1, marginRight: ".6rem", flexShrink: 0 }}>
                                    <path d="M384 224v184a40 40 0 01-40 40H104a40 40 0 01-40-40V168a40 40 0 0140-40h167.48" /><path d="M459.94 53.25a16.06 16.06 0 00-23.22-.56L424.35 65a8 8 0 000 11.31l11.34 11.32a8 8 0 0011.34 0l12.06-12c6.1-6.09 6.67-16.01.85-22.38z" /><path d="M399.34 90L218.82 270.2a9 9 0 00-2.31 3.93L208.16 299a3.91 3.91 0 004.86 4.86l24.85-8.35a9 9 0 003.93-2.31L422 112.66a9 9 0 000-12.66l-9.95-10a9 9 0 00-12.71 0z" />
                                </svg>
                                Hesabım
                            </div>

                            {/* Rezervasyon Mesajlarım */}
                            <Link href="/bildirimlerim">
                                <div className="middleft btnActive hesabim-ppTab">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 512 512" fill="none" stroke="currentColor" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: -1, marginRight: ".6rem", flexShrink: 0 }}>
                                        <rect x="48" y="80" width="416" height="384" rx="48" /><line x1="128" y1="48" x2="128" y2="80" /><line x1="384" y1="48" x2="384" y2="80" /><line x1="464" y1="160" x2="48" y2="160" /><path d="M148 284h40v40h-40zM236 284h40v40h-40zM324 284h40v40h-40zM148 372h40v40h-40zM236 372h40v40h-40zM324 372h40v40h-40z" />
                                    </svg>
                                    Rezervasyon Mesajlarım
                                </div>
                            </Link>

                            {/* İndirim QR Kodu Oluştur */}
                            <div className="middleft btnActive hesabim-ppTab" onClick={scrollToWishes} style={{ cursor: "pointer" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 512 512" fill="none" stroke="currentColor" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: -1, marginRight: ".6rem", flexShrink: 0 }}>
                                    <rect x="336" y="336" width="80" height="80" rx="8" /><rect x="272" y="272" width="64" height="64" rx="8" /><rect x="416" y="416" width="64" height="64" rx="8" /><rect x="432" y="272" width="48" height="48" rx="8" /><rect x="272" y="432" width="48" height="48" rx="8" /><rect x="336" y="64" width="80" height="80" rx="8" /><rect x="288" y="112" width="0" height="64" rx="8" /><rect x="448" y="256" width="0" height="48" rx="8" /><rect x="64" y="336" width="80" height="80" rx="8" /><rect x="64" y="64" width="80" height="80" rx="8" /><rect x="48" y="48" width="176" height="176" rx="20" /><rect x="288" y="48" width="176" height="176" rx="20" /><rect x="48" y="288" width="176" height="176" rx="20" />
                                </svg>
                                İndirim QR Kodu Oluştur
                            </div>

                            {/* Çıkış */}
                            <div
                                onClick={() => setSignOutConfirm(true)}
                                className="middleft btnActive hesabim-rrTab"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 512 512" fill="none" stroke="currentColor" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 0, marginRight: ".6rem", flexShrink: 0, color: "#FC3441" }}>
                                    <path d="M304 336v40a40 40 0 01-40 40H104a40 40 0 01-40-40V136a40 40 0 0140-40h152c22.09 0 48 17.91 48 40v40" /><path d="M368 336l80-80-80-80" /><line x1="176" y1="256" x2="432" y2="256" />
                                </svg>
                                Çıkış
                            </div>

                            {/* Sign out confirmation popover */}
                            {signOutConfirm && (
                                <div style={{
                                    background: "#fff",
                                    border: "1px solid #ddd",
                                    borderRadius: 12,
                                    padding: "16px 16px 8px",
                                    marginTop: 8,
                                    boxShadow: "0 4px 12px rgba(0,0,0,.1)"
                                }}>
                                    <div style={{ fontSize: ".8rem", color: "#6a6a6aaa" }}>
                                        Çıkış yapmak istediğinizden emin misiniz?
                                    </div>
                                    <div className="middle" style={{ marginTop: 6, gap: 8 }}>
                                        <button
                                            onClick={handleSignOut}
                                            style={{
                                                background: "#f56c6c", color: "#fff",
                                                border: "none", borderRadius: 6,
                                                padding: "6px 16px", cursor: "pointer", fontSize: 14
                                            }}
                                        >
                                            Çıkış Yap
                                        </button>
                                        <button
                                            onClick={() => setSignOutConfirm(false)}
                                            style={{
                                                background: "#f5f5f5", color: "#333",
                                                border: "none", borderRadius: 6,
                                                padding: "6px 16px", cursor: "pointer", fontSize: 14
                                            }}
                                        >
                                            Vazgeç
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ─── RIGHT CONTENT ─── */}
                    <div className="hesabim-rightSide">

                        {/* Profile completion bar */}
                        <div style={{ background: "#f5f5f6", padding: "1rem", borderRadius: "1rem" }}>
                            <div style={{ fontWeight: 600, fontSize: "1rem" }}>
                                {percent !== 100 ? "Profilinizi Tamamlayın" : "Profiliniz"}
                            </div>

                            <div style={{ marginTop: "1rem", position: "relative" }}>
                                <div className="middleft" style={{ width: "100%", background: "#0cbc8722", borderRadius: "1rem" }}>
                                    <div style={{
                                        width: `${percent}%`,
                                        background: "#0cbc87",
                                        height: 5,
                                        borderRadius: "1rem",
                                        transition: "width 0.4s ease"
                                    }} />
                                    <div style={{
                                        width: 40, textAlign: "right",
                                        marginTop: -24, marginLeft: -40,
                                        fontSize: ".8rem", color: "#6a6a6a"
                                    }}>
                                        {percent}%
                                    </div>
                                </div>
                            </div>

                            {/* Profile summary */}
                            <div className="middleft" style={{
                                justifyContent: "space-between",
                                fontSize: "1rem", fontWeight: 500,
                                borderRadius: ".6rem",
                                marginTop: "1.5rem",
                                padding: ".8rem 1.1rem",
                                background: "#fff"
                            }}>
                                <div>
                                    {/* Name display */}
                                    {profile?.full_name ? (
                                        <div className="middleft" style={{ marginTop: 8, fontWeight: 400, fontSize: 15, color: "#03a84e" }}>
                                            <Image src="/images/accountavatar.svg" alt="" width={13} height={12} style={{ marginRight: 8, objectFit: "contain" }} />
                                            Merhaba <strong className="skiptranslate" style={{ marginLeft: 4 }}>{profile.full_name}</strong>
                                        </div>
                                    ) : (
                                        <div onClick={scrollToPersonalInfo} className="middleft bhs" style={{ marginTop: 8, fontWeight: 400, fontSize: 15, color: "#444" }}>
                                            <span style={{ marginRight: 8, fontSize: 12 }}>➕</span>
                                            İsminizi kaydedin
                                        </div>
                                    )}

                                    {/* Email display */}
                                    {profile?.email ? (
                                        <div className="middleft" style={{ marginTop: 8, fontWeight: 400, fontSize: 15, color: "#03a84e" }}>
                                            <Image src="/images/enveloperegular.svg" alt="" width={13} height={11} style={{ marginRight: 8, objectFit: "contain" }} />
                                            {profile.email}
                                        </div>
                                    ) : (
                                        <div onClick={scrollToPersonalInfo} className="middleft bhs" style={{ marginTop: 8, fontWeight: 400, fontSize: 15, color: "#444" }}>
                                            <span style={{ marginRight: 8, fontSize: 12 }}>➕</span>
                                            E-posta ekle
                                        </div>
                                    )}

                                    {/* Provider info */}
                                    {profile?.provider && (
                                        <div className="middleft" style={{ marginTop: 8, fontWeight: 400, fontSize: 15, color: "#03a84e" }}>
                                            <span style={{ marginRight: 8, fontSize: 13 }}>✅</span>
                                            {profile.provider === "google" ? "Google ile doğrulandı" : "E-posta ile doğrulandı"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ─── Personal Info Form ─── */}
                        <div ref={personalInfoRef} id="personelInfo" style={{
                            border: "1px solid #dfdfe3",
                            marginTop: "2rem",
                            borderRadius: "1rem"
                        }}>
                            <div style={{ padding: "1rem", fontWeight: 600, fontSize: "1.3rem" }}>
                                Kişisel Bilgilerim
                            </div>
                            <div style={{ borderTop: "1px solid #dfdfe3" }}>
                                <div style={{ padding: "1rem" }}>

                                    {/* Profile Image Upload */}
                                    <div className="middleft">
                                        <label style={{ cursor: "pointer" }}>
                                            <div style={{ color: "#85878a", fontWeight: 300, fontSize: 14, lineHeight: 1.1 }}>
                                                Profil resmi
                                            </div>
                                            <div className="middleft" style={{ marginTop: ".5rem" }}>
                                                <div className="hesabim-upload-area">
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        style={{ display: "none" }}
                                                        disabled={uploadingImage}
                                                    />
                                                    {newImagePreview ? (
                                                        <img src={newImagePreview} alt="Yeni profil" style={{ borderRadius: "50%", width: 82, height: 82, objectFit: "cover" }} />
                                                    ) : profile?.avatar_url ? (
                                                        <img src={profile.avatar_url} alt="Profil" style={{ borderRadius: "50%", width: 82, height: 82, objectFit: "cover" }} />
                                                    ) : (
                                                        <div style={{
                                                            borderRadius: "50%", width: 82, height: 82,
                                                            background: "#e0e0e0",
                                                            display: "flex", alignItems: "center", justifyContent: "center",
                                                            fontSize: 32, color: "#999", fontWeight: 600
                                                        }}>
                                                            {profile?.full_name?.charAt(0)?.toUpperCase() || "?"}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </label>
                                    </div>

                                    {/* Name Input */}
                                    <div style={{ marginTop: "2rem" }}>
                                        <div style={{ color: "#85878aaa", fontSize: ".96rem" }}>
                                            Tam Adınız
                                        </div>
                                        <input
                                            type="text"
                                            value={formName}
                                            onChange={(e) => setFormName(e.target.value)}
                                            placeholder="Tam Adınız"
                                            className="hesabim-input"
                                            style={{ maxWidth: 400 }}
                                        />

                                        {/* Email Input */}
                                        <div style={{ color: "#85878aaa", fontSize: ".96rem", marginTop: "1.2rem" }}>
                                            Email
                                        </div>
                                        <input
                                            type="email"
                                            value={formEmail}
                                            onChange={(e) => setFormEmail(e.target.value)}
                                            placeholder="E-posta"
                                            className="hesabim-input"
                                            style={{ maxWidth: 400 }}
                                        />

                                        {/* Phone Number (readonly) */}
                                        {profile?.phone_number && (
                                            <div style={{ width: "100%", marginTop: "1.4rem" }}>
                                                <div style={{ width: 400 }}>
                                                    <div style={{ color: "#85878aaa", fontSize: ".96rem" }}>
                                                        Phone Number
                                                    </div>
                                                    <div className="middleft">
                                                        <input
                                                            type="text"
                                                            readOnly
                                                            value={`${profile.phone_code || ""} ${profile.phone_number}`}
                                                            placeholder="Phone Number"
                                                            className="hesabim-input"
                                                            style={{ maxWidth: 400 }}
                                                        />
                                                        <span style={{ marginLeft: -30, color: "#0cbc87" }}>✓</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className="middle" style={{ marginTop: "2rem", paddingBottom: "1rem" }}>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving || uploadingImage}
                                        className="hesabim-save-btn"
                                    >
                                        {saving ? "Kaydediliyor..." : uploadingImage ? "Resim yükleniyor..." : "Değişiklikleri Kaydet"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ─── Favorites Section ─── */}
                        <div
                            ref={wishesRef}
                            id="wishesContainer"
                            className={redOutline ? "hesabim-redo" : ""}
                            style={{
                                transitionDuration: ".4s",
                                marginTop: 40,
                                border: "1px solid #dfdfe3",
                                borderRadius: "1rem"
                            }}
                        >
                            <div className="middleft" style={{ padding: "1rem", marginTop: ".5rem", fontSize: "1.1rem", fontWeight: 600 }}>
                                Beğendiğim Villalar
                            </div>
                            <div className="row" style={{ padding: "4px 1rem 4px", borderTop: "1px solid #dfdfe3" }}>
                                {wishesArray.length === 0 && (
                                    <div style={{ padding: 12, color: "#6a6a6aaa" }}>
                                        İstek listeniz boş
                                    </div>
                                )}
                                {wishesArray.map((wish, i) => (
                                    <div key={i}>
                                        <Link href={`/tatilvillasi/${wish.slug}`}>
                                            {wish.cover_image_url && (
                                                <div
                                                    className="btnActive middle"
                                                    style={{
                                                        border: "1px solid #dfdfe3aa",
                                                        borderRadius: 16,
                                                        padding: "12px",
                                                        margin: "12px 12px 12px 0",
                                                        overflow: "hidden",
                                                        boxShadow: "0 1px 3px rgba(0,0,0,.06)"
                                                    }}
                                                >
                                                    <img
                                                        src={wish.cover_image_url}
                                                        alt={wish.name}
                                                        style={{ height: 58, width: "30%", objectFit: "cover", borderRadius: 12 }}
                                                    />
                                                    <div style={{ width: "60%", paddingLeft: "1rem", paddingRight: "1rem", paddingTop: ".2rem", flexGrow: 1 }}>
                                                        <div className="skiptranslate" style={{ fontWeight: 500 }}>
                                                            {wish.name}
                                                        </div>
                                                        <div className="oneLine" style={{ marginTop: ".1rem", fontSize: 12, opacity: .7 }}>
                                                            {wish.location_label}
                                                        </div>
                                                    </div>
                                                    <Image src="/images/cfo.svg" alt="" width={20} height={20} />
                                                </div>
                                            )}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ─── Promotions Section ─── */}
                        <div className="hesabim-promotions">
                            <div className="middleft" style={{ padding: "1rem", marginTop: ".5rem", fontSize: "1.1rem", fontWeight: 600 }}>
                                Promosyonlardan Haberdar olun
                            </div>
                            <div className="middleft" style={{ padding: "1rem", borderTop: "1px solid #dfdfe3", flexWrap: "wrap" }}>
                                <div className="hesabim-getNotOnPhone">
                                    {!profile?.email && (
                                        <div className="middleft">
                                            <div style={{ marginTop: "1rem", color: "#677788aa", fontWeight: 400, fontSize: ".9rem" }}>
                                                Promosyon e-postaları almak için bir e-posta kaydedin
                                            </div>
                                        </div>
                                    )}

                                    <div className="middleft">
                                        {(!profile?.subscription || !profile?.email) ? (
                                            <div style={{ marginTop: "1rem", color: "#677788aa", fontWeight: 400, fontSize: ".9rem" }}>
                                                İnaktif
                                            </div>
                                        ) : (
                                            <div style={{ marginTop: "1rem", color: "#677788aa", fontWeight: 400, fontSize: ".9rem" }}>
                                                Aktif
                                            </div>
                                        )}
                                    </div>

                                    <div className="middleft" style={{ marginTop: "1rem" }}>
                                        <label className="hesabim-toggle">
                                            <input
                                                type="checkbox"
                                                checked={profile?.subscription || false}
                                                disabled={!profile?.email}
                                                onChange={(e) => handleToggleSubscription(e.target.checked)}
                                            />
                                            <span className="hesabim-toggle-slider"></span>
                                        </label>
                                        {profile?.email && (
                                            <div style={{ marginLeft: "1rem" }}>
                                                <div className="middleft">
                                                    <div style={{ color: "#3880ff", marginTop: ".2rem", opacity: .7, fontWeight: 400, fontSize: "1rem" }}>
                                                        {profile.email}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ color: "#000", fontSize: 14, marginTop: 12, opacity: .7 }}>
                                        Abone olarak,{" "}
                                        <Link href="/sartlar-kosullar"><span style={{ textDecoration: "underline" }}>şartlar ve koşulları</span></Link>{" "}
                                        kabul etmiş ve{" "}
                                        <Link href="/gizlilik-politikasi"><span style={{ textDecoration: "underline" }}>gizlilik politikamızı</span></Link>{" "}
                                        onaylamış olursunuz.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ─── Mobile Bottom Links ─── */}
                        <div className="no768" style={{ color: "#333", marginTop: 48, marginBottom: 50 }}>
                            <Link href="/bildirimlerim">
                                <div className="middleft" style={{
                                    borderTop: "1px solid #ddd",
                                    padding: "1.2rem",
                                    fontSize: "1.1rem",
                                    fontWeight: 700
                                }}>
                                    <Image src="/images/calO.svg" alt="" width={22} height={22} style={{ padding: 2, marginRight: 8, objectFit: "contain" }} />
                                    Rezervasyon Mesajlarım
                                    <Image src="/images/longright.png" alt="" width={38} height={20} style={{ padding: 2, marginLeft: 8, objectFit: "contain" }} />
                                </div>
                            </Link>

                            <div
                                onClick={() => setSignOutConfirm(true)}
                                className="middleft"
                                style={{
                                    color: "#f56c6c",
                                    borderTop: "1px solid #ddd",
                                    padding: "1.2rem 1.2rem 0",
                                    fontSize: "1.1rem",
                                    fontWeight: 700,
                                    cursor: "pointer"
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 512 512" fill="none" stroke="currentColor" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 0, marginRight: ".6rem", flexShrink: 0, color: "#f56c6c" }}>
                                    <path d="M304 336v40a40 40 0 01-40 40H104a40 40 0 01-40-40V136a40 40 0 0140-40h152c22.09 0 48 17.91 48 40v40" /><path d="M368 336l80-80-80-80" /><line x1="176" y1="256" x2="432" y2="256" />
                                </svg>
                                Çıkış Yap
                            </div>

                            {/* Mobile sign out confirmation */}
                            {signOutConfirm && (
                                <div style={{
                                    background: "#fff",
                                    border: "1px solid #ddd",
                                    borderRadius: 12,
                                    padding: "16px",
                                    margin: "12px 1.2rem",
                                    boxShadow: "0 4px 12px rgba(0,0,0,.1)"
                                }}>
                                    <div style={{ fontSize: ".85rem", color: "#6a6a6a" }}>
                                        Çıkış yapmak istediğinizden emin misiniz?
                                    </div>
                                    <div className="middle" style={{ marginTop: 8, gap: 8 }}>
                                        <button
                                            onClick={handleSignOut}
                                            style={{
                                                background: "#f56c6c", color: "#fff",
                                                border: "none", borderRadius: 6,
                                                padding: "8px 20px", cursor: "pointer", fontSize: 14
                                            }}
                                        >
                                            Çıkış Yap
                                        </button>
                                        <button
                                            onClick={() => setSignOutConfirm(false)}
                                            style={{
                                                background: "#f5f5f5", color: "#333",
                                                border: "none", borderRadius: 6,
                                                padding: "8px 20px", cursor: "pointer", fontSize: 14
                                            }}
                                        >
                                            Vazgeç
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* ─── Toast Notification ─── */}
            {toastMessage && (
                <div className="hesabim-toast">
                    {toastMessage}
                    <button onClick={() => setToastMessage(null)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", marginLeft: 12, fontSize: 14 }}>
                        ✕
                    </button>
                </div>
            )}

            {/* ─── Saving/Uploading Overlay ─── */}
            {(saving || uploadingImage) && (
                <div className="hesabim-overlay">
                    <div className="hesabim-overlay-content">
                        <div style={{
                            width: 40, height: 40,
                            border: "4px solid #f3f3f3",
                            borderTop: "4px solid #6772e5",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite"
                        }} />
                        <p style={{ marginTop: 12, color: "#333", fontWeight: 500 }}>
                            {uploadingImage ? "Resim yükleniyor..." : "Kaydediliyor..."}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
