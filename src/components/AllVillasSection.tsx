"use client";

import React from "react";
import Link from "next/link";

export default function AllVillasSection() {
    return (
        <>
            {/* ─── Tüm Villalar Button ─── */}
            <div
                style={{
                    marginTop: "calc(4vw + 32px)",
                }}
            >
                <div
                    className="middle paddingMobile"
                    style={{
                        width: "100%",
                        marginTop: 20,
                        marginBottom: 12,
                    }}
                >
                    <Link href="/sonuclar" style={{ textDecoration: "none" }}>
                        <div
                            className="allVillasBtn"
                            style={{
                                overflow: "hidden",
                                textAlign: "center",
                                minWidth: 265,
                                background: "#ebeef51a",
                                zIndex: 2,
                                position: "relative",
                                padding: "14px 32px",
                                borderRadius: 14,
                            }}
                        >
                            <div
                                className="bhs middle"
                                style={{
                                    width: "100%",
                                    fontSize: 24,
                                    fontWeight: 500,
                                    color: "#222",
                                }}
                            >
                                Tüm Villalar
                                <img
                                    src="/images/iconlink.svg"
                                    style={{ marginLeft: 6, height: 32 }}
                                    alt="Tüm Villalar"
                                />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </>
    );
}
