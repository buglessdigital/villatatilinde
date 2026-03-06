"use client";

import React, { useState } from "react";
import MobileFilterModal from "./MobileFilterModal";

export default function MobileSearchBar() {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div
            className="paddingMobile no1024"
            style={{
                marginTop: 0,
                position: "sticky",
                top: 0,
                zIndex: 114,
                backgroundColor: "#fff",
                paddingTop: "12px",
                paddingBottom: "12px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                borderBottom: "1px solid #f9f9f9"
            }}
        >
            <div
                onClick={() => setModalOpen(true)}
                className="middleft"
                style={{
                    background: "#fff",
                    border: "2px solid rgba(245, 192, 112, 0.79)", /* #f5c070ca */
                    borderRadius: 32,
                    padding: "6px 16px 6px 12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,.04)",
                    minHeight: 56,
                    cursor: "pointer"
                }}
            >
                {/* Search icon */}
                <div className="middle" style={{ padding: "3px 8px 3px 0px" }}>
                    <img
                        src="/images/search3.png"
                        style={{
                            height: 26,
                            objectFit: "contain",
                            opacity: 0.6,
                        }}
                        alt=""
                    />
                </div>

                <div style={{ lineHeight: 1.1, marginLeft: 2, position: "relative" }}>
                    <div
                        style={{
                            color: "rgba(106, 106, 106, 0.67)", /* #6a6a6aaa */
                            fontSize: 16,
                            fontWeight: 400,
                        }}
                    >
                        Konum Seç
                    </div>
                    <div
                        className="middleft"
                        style={{
                            fontSize: 13,
                            fontWeight: 400,
                            color: "#555",
                            marginTop: 4,
                        }}
                    >
                        <div className="middle">
                            <img src="/images/calO.svg" style={{ height: 13, marginRight: 4, opacity: 0.8 }} alt="" />
                            <span style={{ marginTop: 2 }}>Tarihler</span>
                        </div>
                        <div style={{ opacity: 0.9, fontSize: 13, margin: "0 8px" }}>&bull;</div>
                        <div className="middle" style={{ fontSize: 13, fontWeight: 600, color: "rgba(106, 106, 106, 0.93)" }}>
                            <img src="/images/userregular.svg" style={{ opacity: 0.6, height: 12, marginRight: 2 }} alt="" /> &times;
                            <span style={{ marginTop: 1, marginLeft: 2 }}>1</span>
                        </div>
                        <div style={{ opacity: 0.9, fontSize: 13, margin: "0 8px" }}>&bull;</div>
                        <div className="middle" style={{ fontSize: 13, color: "#555" }}>
                            Fiyat
                        </div>
                    </div>
                </div>
                {/* Filter icon */}
                <div className="middle" style={{
                    marginLeft: "auto",
                    width: 32,
                    height: 32,
                    border: "1px solid #ddd",
                    borderRadius: "50%",
                    padding: 6
                }}>
                    <img
                        src="/images/stnga.png"
                        style={{ width: "100%", height: "100%", objectFit: "contain", opacity: 0.7 }}
                        alt=""
                    />
                </div>
            </div>

            <MobileFilterModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
    );
}
