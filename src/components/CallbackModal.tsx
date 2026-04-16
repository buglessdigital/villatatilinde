"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface CallbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    villaName?: string;
    villaSlug?: string;
}

export default function CallbackModal({ isOpen, onClose, villaName, villaSlug }: CallbackModalProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [preferredDate, setPreferredDate] = useState("");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !phone.trim()) return;

        setSubmitting(true);
        try {
            const { error } = await supabase.from("callback_requests").insert([
                {
                    name: name.trim(),
                    phone: phone.trim(),
                    preferred_date: preferredDate || null,
                    message: message.trim() || null,
                    villa_name: villaName || null,
                    villa_slug: villaSlug || null,
                    status: "new",
                },
            ]);

            if (error) {
                console.error("Callback request error:", error);
                alert("Form gönderilemedi. Lütfen tekrar deneyin.");
            } else {
                setSubmitted(true);
                // Reset form after 2.5 seconds
                setTimeout(() => {
                    setSubmitted(false);
                    setName("");
                    setPhone("");
                    setPreferredDate("");
                    setMessage("");
                    onClose();
                }, 2500);
            }
        } catch (err) {
            console.error("Callback request error:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`cb-modal-overlay ${isOpen ? "cb-modal-overlay-active" : ""}`}
                onClick={handleOverlayClick}
            />

            {/* Slide-in Panel */}
            <div className={`cb-modal-panel ${isOpen ? "cb-modal-panel-active" : ""}`}>
                {/* Header */}
                <div className="cb-modal-header">
                    <div className="cb-modal-header-content">
                        <div className="cb-modal-title poppins">Sizi Arayalım</div>
                        <div className="cb-modal-subtitle dm-sans">
                            Bilgilerinizi bırakın, sizi en kısa sürede arayalım
                        </div>
                    </div>
                    <button className="cb-modal-close" onClick={onClose}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Villa badge */}
                {villaName && (
                    <div className="cb-modal-villa-badge dm-sans">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#50b0f0">
                            <path d="M12 3l9 8h-3v10H15v-6H9v6H6V11H3l9-8z" />
                        </svg>
                        {villaName}
                    </div>
                )}

                {/* Content */}
                {submitted ? (
                    <div className="cb-modal-success">
                        <div className="cb-modal-success-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M8 12l2.5 2.5L16 9" />
                            </svg>
                        </div>
                        <div className="cb-modal-success-title poppins">Talebiniz Alındı!</div>
                        <div className="cb-modal-success-text dm-sans">
                            En kısa sürede sizi arayacağız.
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="cb-modal-form">
                        {/* Name */}
                        <div className="cb-modal-field">
                            <label className="cb-modal-label dm-sans">
                                Ad Soyad <span className="cb-modal-required">*</span>
                            </label>
                            <div className="cb-modal-input-wrap">
                                <svg className="cb-modal-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                <input
                                    type="text"
                                    className="cb-modal-input dm-sans"
                                    placeholder="Adınızı girin"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="cb-modal-field">
                            <label className="cb-modal-label dm-sans">
                                Telefon Numarası <span className="cb-modal-required">*</span>
                            </label>
                            <div className="cb-modal-input-wrap">
                                <svg className="cb-modal-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                                <input
                                    type="tel"
                                    className="cb-modal-input dm-sans"
                                    placeholder="05XX XXX XX XX"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Preferred Date */}
                        <div className="cb-modal-field">
                            <label className="cb-modal-label dm-sans">
                                Aranması İstenilen Tarih
                            </label>
                            <div className="cb-modal-input-wrap">
                                <svg className="cb-modal-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                <input
                                    type="date"
                                    className="cb-modal-input dm-sans"
                                    value={preferredDate}
                                    onChange={(e) => setPreferredDate(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Message */}
                        <div className="cb-modal-field">
                            <label className="cb-modal-label dm-sans">
                                Mesajınız <span style={{ color: "#94a3b8", fontWeight: 400 }}>(isteğe bağlı)</span>
                            </label>
                            <textarea
                                className="cb-modal-textarea dm-sans"
                                placeholder="Eklemek istediğiniz bir not varsa yazabilirsiniz..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={3}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="cb-modal-submit-btn dm-sans"
                            disabled={submitting || !name.trim() || !phone.trim()}
                        >
                            {submitting ? (
                                <span className="cb-modal-spinner" />
                            ) : (
                                <>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 2L11 13" />
                                        <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                                    </svg>
                                    Formu Gönder
                                </>
                            )}
                        </button>

                        {/* Privacy Note */}
                        <div className="cb-modal-privacy dm-sans">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="#94a3b8">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                            Bilgileriniz gizli tutulacak ve yalnızca sizinle iletişim amacıyla kullanılacaktır.
                        </div>
                    </form>
                )}
            </div>
        </>
    );
}
