"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function MobileBestPriceBanner() {
    const [activeModal, setActiveModal] = useState<number | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                const scrollAmount = 332; // card width + gap
                if (scrollLeft + clientWidth >= scrollWidth - 10) {
                    scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
                } else {
                    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
                }
            }
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (activeModal !== null) {
            document.body.classList.add("modal-open");
        } else {
            document.body.classList.remove("modal-open");
        }
        return () => {
            document.body.classList.remove("modal-open");
        };
    }, [activeModal]);

    const closeModal = () => setActiveModal(null);

    const ContactLinks = () => (
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #bceab7" }}>
            <div style={{ color: "#006400", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
                Daha fazla bilgi için bize ulaşın
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <a href="https://wa.me/905323990748" style={{ display: "flex", alignItems: "center", gap: 6, color: "#008a20", fontSize: 14, textDecoration: "none" }}>
                    <img src="/images/wp.svg" style={{ width: 16 }} alt="" /> WhatsApp
                </a>
                <a href="tel:+905323990748" style={{ display: "flex", alignItems: "center", gap: 6, color: "#008a20", fontSize: 14, textDecoration: "none" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> Arayın
                </a>
                <a href="mailto:info@villatatilinde.com" style={{ display: "flex", alignItems: "center", gap: 6, color: "#008a20", fontSize: 14, textDecoration: "none" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> Mail Atın
                </a>
            </div>
        </div>
    );

    return (
        <>
            <style>
                {`
                    @keyframes slideUpBanner {
                        from { transform: translateY(100%); }
                        to { transform: translateY(0); }
                    }
                    @keyframes fadeInBanner {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                `}
            </style>
            <div className="paddingMobile no1024" style={{ marginTop: 16 }}>
                <div
                    ref={scrollRef}
                    style={{
                        display: "flex",
                        gap: 12,
                        overflowX: "auto",
                        paddingBottom: 8,
                        msOverflowStyle: "none",
                        scrollbarWidth: "none",
                        scrollSnapType: "x mandatory",
                    }}
                >
                    {/* 1. En Uygun Fiyat Garantisi */}
                    <div
                        onClick={() => setActiveModal(0)}
                        style={{
                            minWidth: 320,
                            flex: "0 0 auto",
                            background: "#000",
                            scrollSnapAlign: "start",
                            borderRadius: 16,
                            border: "1px solid #f6f6f6",
                            padding: 12,
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer"
                        }}
                    >
                        <img src="/images/checkBub.png" style={{ height: 44, width: 44, objectFit: "contain", flexShrink: 0 }} alt="" />
                        <div style={{ marginLeft: 12, flex: 1, overflow: "hidden" }}>
                            <div className="oneLine" style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>En Uygun Fiyat Garantisi</div>
                            <div className="oneLine" style={{ fontSize: 13, fontWeight: 400, color: "#ccc" }}>Daha Ucuzunu Bulursanız Fiyat Farkı İa...</div>
                        </div>
                        <div style={{ marginLeft: "auto", flexShrink: 0 }}>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#f6f6f6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 14, color: "#000" }}>?</div>
                        </div>
                    </div>

                    {/* 2. %100 Para İade Garantisi */}
                    <div
                        onClick={() => setActiveModal(2)}
                        style={{
                            minWidth: 320,
                            flex: "0 0 auto",
                            scrollSnapAlign: "start",
                            background: "#b8d9eb",
                            borderRadius: 16,
                            border: "1px solid #b8d9eb",
                            padding: 12,
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer"
                        }}
                    >
                        <div style={{ width: 44, height: 44, background: "#d0021b", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "2px dashed #fff", outline: "2px solid #d0021b" }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <div style={{ marginLeft: 12, flex: 1, overflow: "hidden" }}>
                            <div className="oneLine" style={{ fontSize: 16, fontWeight: 600, color: "#111" }}>%100 Para İade Garantisi</div>
                            <div className="oneLine" style={{ fontSize: 13, fontWeight: 400, color: "#444" }}>Mesafeli Satış Sözleşmesi Koşulları Kapsamında...</div>
                        </div>
                        <div style={{ marginLeft: "auto", flexShrink: 0 }}>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#f6f6f6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 14, color: "#000" }}>?</div>
                        </div>
                    </div>

                    {/* 3. Türsab ve Etbis Onaylı */}
                    <div
                        onClick={() => setActiveModal(1)}
                        style={{
                            minWidth: 320,
                            flex: "0 0 auto",
                            scrollSnapAlign: "start",
                            background: "#fff",
                            borderRadius: 16,
                            border: "1px solid #efefef",
                            padding: 12,
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer"
                        }}
                    >
                        <div style={{ width: 44, height: 44, background: "#adeb8d", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00802c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <div style={{ marginLeft: 12, flex: 1, overflow: "hidden" }}>
                            <div className="oneLine" style={{ fontSize: 16, fontWeight: 700, color: "#111" }}>Türsab ve Etbis Onaylı</div>
                            <div className="oneLine" style={{ fontSize: 13, fontWeight: 400, color: "#666" }}>Guvenli Kiralama</div>
                        </div>
                        <div style={{ marginLeft: "auto", flexShrink: 0 }}>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#f6f6f6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 14, color: "#000" }}>?</div>
                        </div>
                    </div>

                    {/* 4. Kısmi ödeme ile rezerve et */}
                    <div
                        onClick={() => setActiveModal(3)}
                        style={{
                            minWidth: 320,
                            flex: "0 0 auto",
                            scrollSnapAlign: "start",
                            background: "#ffcccc",
                            borderRadius: 16,
                            border: "1px solid #ffcccc",
                            padding: 12,
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer"
                        }}
                    >
                        <div style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 900, fontSize: 44, color: "#e3191c", WebkitTextStroke: "1px #b11316", textShadow: "2px 2px 4px rgba(0,0,0,0.2)" }}>%</div>
                        <div style={{ marginLeft: 12, flex: 1, overflow: "hidden" }}>
                            <div className="oneLine" style={{ fontSize: 16, fontWeight: 500, color: "#111" }}>Kısmi ödeme ile rezerve et</div>
                            <div className="oneLine" style={{ fontSize: 13, fontWeight: 400, color: "#444" }}>Kalano girişte öde</div>
                        </div>
                        <div style={{ marginLeft: "auto", flexShrink: 0 }}>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#f6f6f6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 14, color: "#000" }}>?</div>
                        </div>
                    </div>

                    {/* 5. Kartla Öde */}
                    <div
                        onClick={() => setActiveModal(4)}
                        style={{
                            minWidth: 320,
                            flex: "0 0 auto",
                            scrollSnapAlign: "start",
                            background: "#fc6758",
                            borderRadius: 16,
                            border: "1px solid #fc6758",
                            padding: 12,
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer"
                        }}
                    >
                        <div style={{ width: 44, height: 44, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, flexShrink: 0 }}>
                            <div style={{ color: "#1a1f71", fontWeight: 800, fontSize: 14, fontStyle: "italic", background: "#fff", padding: "0 4px", borderRadius: 4, lineHeight: 1 }}>VISA</div>
                            <div style={{ display: "flex", gap: -4 }}>
                                <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#eb001b", zIndex: 1 }}></div>
                                <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#f79e1b", marginLeft: -6, zIndex: 2 }}></div>
                            </div>
                        </div>
                        <div style={{ marginLeft: 12, flex: 1, overflow: "hidden" }}>
                            <div className="oneLine" style={{ fontSize: 16, fontWeight: 500, color: "#111" }}>Kartla Öde</div>
                            <div className="oneLine" style={{ fontSize: 13, fontWeight: 400, color: "#333" }}>Tum kartlara taksit firsati</div>
                        </div>
                        <div style={{ marginLeft: "auto", flexShrink: 0 }}>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#f6f6f6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 14, color: "#000" }}>?</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Overlay and Container */}
            {activeModal !== null && (
                <div
                    onClick={closeModal}
                    style={{
                        position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                        background: "rgba(0,0,0,0.5)", zIndex: 99999,
                        display: "flex", flexDirection: "column", justifyContent: "flex-end",
                        animation: "fadeInBanner 0.2s ease-out forwards"
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: activeModal === 0 || activeModal === 1 ? "#fff" : "#e8fdf0",
                            borderTopLeftRadius: 32, borderTopRightRadius: 32,
                            width: "100%", maxHeight: "90vh", overflowY: "auto",
                            paddingTop: 16,
                            display: "flex", flexDirection: "column",
                            animation: "slideUpBanner 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                            boxShadow: "0 -4px 16px rgba(0,0,0,0.1)"
                        }}
                    >
                        {/* Header */}
                        <div style={{ position: "relative", textAlign: "center", marginBottom: 24 }}>
                            <div onClick={closeModal} style={{ width: 44, height: 5, background: "#ccc", borderRadius: 6, margin: "0 auto 20px", cursor: "pointer" }} />
                            <img src="/images/vtlo.png" alt="Logo" style={{ height: 44, objectFit: "contain", marginBottom: 4 }} />
                            <div style={{ fontSize: 13, color: "#666", fontWeight: activeModal === 0 ? 500 : 400 }}>
                                Praedium Group {activeModal === 0 && "Güvencesi İle"}
                            </div>
                        </div>

                        {/* Modal 0: En Uygun Fiyat Garantisi */}
                        {activeModal === 0 && (
                            <div style={{ padding: "0 24px 24px", textAlign: "center" }}>
                                <div style={{ background: "#ff6b6b", width: 48, height: 48, borderRadius: 8, display: "flex", justifyContent: "center", alignItems: "center", margin: "0 auto 16px", transform: "rotate(-10deg)" }}>
                                    <div style={{ color: "#fff", fontWeight: "bold", fontSize: 24, transform: "rotate(10deg)" }}>%</div>
                                </div>
                                <div style={{ fontSize: 18, fontWeight: 800, color: "#000", marginBottom: 16 }}>Tüm Villalarda En Uygun Fiyat Garantisi</div>
                                <div style={{ fontSize: 15, color: "#444", marginBottom: 16, lineHeight: 1.4, textAlign: "left" }}>
                                    Villa Tatilinde, misafirlerine en uygun fiyat garantisi sunuyoruz
                                </div>
                                <div style={{ fontSize: 15, color: "#444", marginBottom: 24, lineHeight: 1.4, textAlign: "left" }}>
                                    Daha ucuz fiyat bulursanız aradaki fiyat farkı iade
                                </div>

                                <div style={{ fontSize: 16, fontWeight: 800, color: "#000", marginBottom: 16 }}>Türsab Güvencesi İle</div>

                                <div style={{ border: "1px solid #e0e0e0", borderRadius: 16, padding: 16, textAlign: "left", marginBottom: 16 }}>
                                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Türsab'a kayıtlı resmi acente</div>
                                    <div style={{ fontSize: 14, color: "#333", marginBottom: 4 }}>Belge No: 18069</div>
                                    <div style={{ fontSize: 14, color: "#333", marginBottom: 16 }}>PRAEDIUM GROUP TRAVEL AGENCY</div>
                                    <a href="https://www.tursab.org.tr/pl/qr/AHTKE25120134462dc964be3dd2438b" target="_blank" rel="noopener noreferrer" style={{ display: "block", background: "#e8fdf0", color: "#008a20", fontWeight: 600, textAlign: "center", padding: "10px 0", borderRadius: 8, fontSize: 14, textDecoration: "none" }}>
                                        Doğruluğunu kontrol etmek için tıklayın
                                    </a>
                                </div>

                                <div style={{ textAlign: "left", paddingBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                                    <div>
                                        <div style={{ fontSize: 14, color: "#333", marginBottom: 8 }}>T.C. Kültür ve Turizm Bakanlığı</div>
                                        <a href="https://www.tursab.org.tr/pl/qr/AHTKE25120134462dc964be3dd2438b" style={{ fontSize: 13, color: "#4da8ff", wordBreak: "break-all" }}>
                                            https://www.tursab.org.tr/pl/qr/AHTKE25120134462dc964be3dd2438b
                                        </a>
                                    </div>
                                    <img src="/images/tursab-dds-18069.png" style={{ height: 40 }} alt="tursab" />
                                </div>
                            </div>
                        )}

                        {/* Modal 1: Türsab ve Etbis Onaylı */}
                        {activeModal === 1 && (
                            <div style={{ padding: "0 24px 24px", textAlign: "center" }}>
                                <div style={{ border: "1px solid #e0e0e0", borderRadius: 16, padding: 16, textAlign: "left", marginBottom: 16 }}>
                                    <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 16 }}>
                                        <img src="/images/qr2.jpg" alt="Etbis" style={{ width: 80, height: 80, objectFit: "contain", marginRight: 16, border: "1px solid #eee", borderRadius: 8 }} />
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Etbis 'e Kayıtlı</div>
                                            <div style={{ fontSize: 14, color: "#666", marginBottom: 4 }}>Lisans No: 32468348</div>
                                            <div style={{ fontSize: 12, color: "#888" }}>• PRAEDIUM GROUP TRAVEL AGENCY</div>
                                        </div>
                                    </div>
                                    <a href="https://etbis.gov.tr" target="_blank" rel="noopener noreferrer" style={{ display: "block", background: "#e8fdf0", color: "#008a20", fontWeight: 600, textAlign: "center", padding: "10px 0", borderRadius: 8, fontSize: 13, textDecoration: "none" }}>
                                        Doğruluğunu kontrol etmek için kare kodu okutun
                                    </a>
                                </div>

                                <div style={{ border: "1px solid #e0e0e0", borderRadius: 16, padding: 16, textAlign: "left", marginBottom: 16 }}>
                                    <div style={{ fontSize: 14, color: "#333", marginBottom: 8 }}>ETBİS : Elektronik Ticaret Bilgi Sistemi</div>
                                    <a href="https://etbis.gov.tr" style={{ fontSize: 13, color: "#4da8ff", wordBreak: "break-all" }}>
                                        https://etbis.gov.tr
                                    </a>
                                </div>

                                <div style={{ border: "1px solid #e0e0e0", borderRadius: 16, padding: 16, textAlign: "left", marginBottom: 16 }}>
                                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Türsab'a kayıtlı resmi acente</div>
                                    <div style={{ fontSize: 14, color: "#333", marginBottom: 4 }}>Belge No: 18069</div>
                                    <div style={{ fontSize: 14, color: "#333", marginBottom: 16 }}>PRAEDIUM GROUP TRAVEL AGENCY</div>
                                    <a href="https://www.tursab.org.tr/pl/qr/AHTKE25120134462dc964be3dd2438b" target="_blank" rel="noopener noreferrer" style={{ display: "block", background: "#e8fdf0", color: "#008a20", fontWeight: 600, textAlign: "center", padding: "10px 0", borderRadius: 8, fontSize: 14, textDecoration: "none" }}>
                                        Doğruluğunu kontrol etmek için tıklayın
                                    </a>
                                </div>

                                <div style={{ textAlign: "left", paddingBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                                    <div>
                                        <div style={{ fontSize: 14, color: "#333", marginBottom: 8 }}>T.C. Kültür ve Turizm Bakanlığı</div>
                                        <a href="https://www.tursab.org.tr/pl/qr/AHTKE25120134462dc964be3dd2438b" style={{ fontSize: 13, color: "#4da8ff", wordBreak: "break-all" }}>
                                            https://www.tursab.org.tr/pl/qr/AHTKE25120134462dc964be3dd2438b
                                        </a>
                                    </div>
                                    <img src="/images/tursab-dds-18069.png" style={{ height: 40 }} alt="tursab" />
                                </div>
                            </div>
                        )}

                        {/* Modal 2: %100 Para İade Garantisi */}
                        {activeModal === 2 && (
                            <div style={{ padding: "0 24px 40px", textAlign: "left", flex: 1 }}>
                                <div style={{ fontSize: 18, fontWeight: 700, color: "#000", marginBottom: 20 }}>
                                    %100 Para İade Garantisi
                                </div>
                                <div style={{ fontSize: 15, color: "#333", marginBottom: 12, display: "flex", gap: 6 }}>
                                    <span>•</span> Mesafeli Satış Sözleşmesi Koşulları Kapsamındadır
                                </div>
                                <div style={{ fontSize: 15, color: "#333", marginBottom: 12, display: "flex", gap: 6 }}>
                                    <span>•</span>
                                    <Link href="/mesafeli-satis-sozlesmesi" onClick={closeModal} style={{ color: "inherit", textDecoration: "none" }}>
                                        Mesafeli Satış Sözleşmesi görüntülemek için tıklayın
                                        <span style={{ display: "inline-block", background: "#ddd", borderRadius: "50%", width: 16, height: 16, textAlign: "center", lineHeight: "16px", fontSize: 11, fontWeight: "bold", marginLeft: 6 }}>?</span>
                                    </Link>
                                </div>
                                <ContactLinks />
                            </div>
                        )}

                        {/* Modal 3: Kısmi ödeme */}
                        {activeModal === 3 && (
                            <div style={{ padding: "0 24px 40px", textAlign: "left", flex: 1 }}>
                                <div style={{ fontSize: 18, fontWeight: 700, color: "#000", marginBottom: 20 }}>
                                    Bir Kısmını Şimdi Kalanı Girişte Ödeyin
                                </div>
                                <div style={{ fontSize: 15, color: "#333", marginBottom: 12, display: "flex", gap: 6 }}>
                                    <span>•</span> Kısmi Ön Ödeme ile villa rezervasyonunuzu tamamlayın
                                </div>
                                <div style={{ fontSize: 15, color: "#333", marginBottom: 12, display: "flex", gap: 6 }}>
                                    <span>•</span> Kalan ödemeyi girişte yapın
                                </div>
                                <ContactLinks />
                            </div>
                        )}

                        {/* Modal 4: Kartla Öde */}
                        {activeModal === 4 && (
                            <div style={{ padding: "0 24px 40px", textAlign: "left", flex: 1 }}>
                                <div style={{ fontSize: 18, fontWeight: 700, color: "#000", marginBottom: 20, lineHeight: 1.3 }}>
                                    Ön ödemenizi Kredi kartıyla ve taksit seçenekleri ile yapabilirsiniz
                                </div>
                                <div style={{ fontSize: 15, color: "#333", marginBottom: 16, display: "flex", gap: 6 }}>
                                    <span>•</span> ön ödemenizi online ve taksit seçenekleri ile yapabilirsiniz
                                </div>
                                <div style={{ display: "flex", gap: 12, marginBottom: 16, paddingLeft: 14 }}>
                                    <div style={{ color: "#1a1f71", fontWeight: 800, fontSize: 16, fontStyle: "italic" }}>VISA</div>
                                    <div style={{ display: "flex", gap: -4 }}>
                                        <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#eb001b", zIndex: 1 }}></div>
                                        <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#f79e1b", marginLeft: -6, zIndex: 2 }}></div>
                                    </div>
                                    <div style={{ color: "#5bb2e2", fontWeight: 700, fontSize: 14, fontStyle: "italic", marginLeft: 6 }}>AMEX</div>
                                </div>
                                <div style={{ fontSize: 15, color: "#333", marginBottom: 12, display: "flex", gap: 6 }}>
                                    <span>•</span> Kalan ödeme girişte nakit veya EFT ile yapılmaktadır.
                                </div>
                                <ContactLinks />
                            </div>
                        )}

                    </div>
                </div>
            )}
        </>
    );
}

