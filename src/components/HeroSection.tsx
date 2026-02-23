"use client";

import React from "react";
import SearchFilterBar from "./SearchFilterBar";

export default function HeroSection() {
    return (
        <>
            {/* ===== DESKTOP HERO ===== */}
            <div className="paddingMobile no1023" style={{ paddingTop: 32 }}>
                <div className="dm-sans">
                    {/* Hero Banner */}
                    <div
                        className="middletp"
                        style={{
                            borderRadius: 16,
                            background: "url('/images/filler1.webp')",
                            backgroundPosition: "20% 45%",
                            backgroundSize: "cover",
                            height: 590,
                            padding: "24px 24px 88px",
                        }}
                    >
                        {/* Left Text Content */}
                        <div style={{ width: "calc(100% - 260px)" }}>
                            <div style={{ paddingTop: 32 }}>
                                <div>
                                    <h1
                                        style={{
                                            fontSize: 36,
                                            color: "#fff",
                                            fontWeight: 900,
                                        }}
                                    >
                                        TÜRSAB Resmi Villa Kiralama Acentesi
                                    </h1>
                                </div>
                                <div className="middleft">
                                    <a
                                        href="https://www.tursab.org.tr/pl/qr/AHTKE25120134462dc964be3dd2438b"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <div
                                            className="middleft"
                                            style={{
                                                color: "#fff",
                                                fontSize: 15,
                                                fontWeight: 600,
                                            }}
                                        >
                                            Belge No: 18069 - PRAEDIUM GROUP TRAVEL AGENCY
                                            <img
                                                src="/images/iconlink.svg"
                                                style={{
                                                    filter: "invert(100%)",
                                                    marginLeft: 6,
                                                    height: 20,
                                                }}
                                                alt=""
                                            />
                                        </div>
                                    </a>
                                </div>
                                <div
                                    style={{
                                        marginTop: 78,
                                        fontSize: 24,
                                        maxWidth: "90%",
                                        color: "#fff",
                                        fontWeight: 700,
                                    }}
                                >
                                    Size en uygun villayı, en iyi fiyat garantisi ile ve ücretsiz
                                    iptal ve iade fırsatlarından yararlanarak kiralayın.
                                    Onaylanmış Villa Portföyü, tecrübeli ve güleryüzlü destek
                                    ekibiyle hizmetinizde...
                                </div>
                            </div>
                        </div>

                        {/* Right - Para İade Garantisi Card */}
                        <div style={{ marginLeft: "auto", width: 250 }}>
                            <div
                                style={{
                                    position: "relative",
                                    padding: 8,
                                    background: "#fff",
                                    borderRadius: 16,
                                    width: "100%",
                                }}
                            >
                                <img
                                    src="/images/return.png"
                                    alt="Para İade Garantisi"
                                    style={{
                                        height: 164,
                                        paddingTop: 16,
                                        width: "100%",
                                        objectFit: "contain",
                                        borderRadius: 16,
                                    }}
                                />
                                <div style={{ padding: "16px 8px" }}>
                                    <div>
                                        <div
                                            className="dm-sans"
                                            style={{
                                                color: "#333",
                                                fontSize: 16,
                                                fontWeight: 700,
                                                textAlign: "center",
                                            }}
                                        >
                                            %100 Para İade Garantisi
                                        </div>
                                    </div>
                                    <div style={{ marginTop: 8 }}>
                                        <div
                                            style={{
                                                fontWeight: 300,
                                                fontSize: 14,
                                                color: "#00000088",
                                                lineHeight: 1.2,
                                            }}
                                        >
                                            İptal ve İade Politikası Koşulları Kapsamında{" "}
                                            <img
                                                className="bhs"
                                                src="/images/question.svg"
                                                style={{
                                                    display: "inline",
                                                    verticalAlign: "middle",
                                                    height: 15,
                                                    width: 15,
                                                    borderRadius: "50%",
                                                    background: "#ddd",
                                                    padding: 3,
                                                    marginLeft: 1,
                                                }}
                                                alt=""
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ─── Filter Bar (overlapping hero) ─── */}
                    <div className="middle" style={{ paddingBottom: 32 }}>
                        <div style={{ width: "90%", marginTop: -98 }}>
                            <SearchFilterBar />
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== MOBILE HERO (< 1024px) ===== */}
            <div className="paddingMobile no1024">
                {/* Para İade Garantisi - Mobile */}
                <div style={{ marginLeft: "auto" }}>
                    <div
                        className="middleft"
                        style={{
                            position: "relative",
                            padding: "16px 0 0",
                            background: "#fff",
                            borderRadius: 16,
                            width: "100%",
                        }}
                    >
                        <img
                            src="/images/return.png"
                            alt="Para İade Garantisi"
                            style={{
                                width: 52,
                                objectFit: "contain",
                                borderRadius: 16,
                                marginRight: 8,
                            }}
                        />
                        <div style={{ padding: "4px 8px", textAlign: "left" }}>
                            <div>
                                <div
                                    className="dm-sans"
                                    style={{
                                        color: "#333",
                                        fontSize: 16,
                                        fontWeight: 700,
                                    }}
                                >
                                    %100 Para İade Garantisi
                                </div>
                            </div>
                            <div style={{ marginTop: 4 }}>
                                <div
                                    style={{
                                        fontWeight: 300,
                                        fontSize: 14,
                                        color: "#00000088",
                                        lineHeight: 1.2,
                                    }}
                                >
                                    İptal ve İade Politikası Koşulları Kapsamında{" "}
                                    <img
                                        className="bhs"
                                        src="/images/question.svg"
                                        style={{
                                            display: "inline",
                                            verticalAlign: "middle",
                                            height: 15,
                                            width: 15,
                                            borderRadius: "50%",
                                            background: "#ddd",
                                            padding: 3,
                                            marginLeft: 1,
                                        }}
                                        alt=""
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
