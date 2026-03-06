"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";

/* ─── Privilege Cards Data ─── */
const PRIVILEGE_CARDS = [
    {
        image: "/images/vati52.png",
        imageStyle: { objectFit: "cover" as const, padding: "2px 2px 2px 3px" },
        title: (
            <>
                <strong>Vati Ocakbaşında</strong> %15 indirim
            </>
        ),
        description:
            "Kaş marina Vati ocakbaşında villatatilinde misafirlerine özel indirim",
        href: "/qr-indirimleri-vati",
    },
    {
        image: "/images/muss012.jpeg",
        imageStyle: { objectFit: "cover" as const, padding: "2px 2px 2px 3px" },
        title: (
            <>
                <strong>Mussakka Restaurantda</strong> %15 indirim
            </>
        ),
        description:
            "Kalkan Mussakka Restaurantda villatatilinde misafirlerine özel indirim",
        href: "/qr-indirimleri-musakka",
    },
    {
        image: "/images/tour2.png",
        imageStyle: { objectFit: "cover" as const, padding: "2px 2px 2px 3px" },
        title: (
            <>
                <strong>Bot Turunda</strong> %15 indirim
            </>
        ),
        description:
            "Ergün Kaptan Kaş bot turlarında villatatilinde misafirlerine özel indirim",
        href: "/qr-indirimleri-tekne",
    },
    {
        image: "/images/sailing2.png",
        imageStyle: { objectFit: "cover" as const, padding: "2px 2px 2px 3px" },
        title: (
            <>
                <strong>Sailing&apos;de</strong> %15 indirim
            </>
        ),
        description:
            "Sailingde villatatilinde misafirlerine özel indirim",
        href: "/qr-indirimleri-sailing",
    },
];

export default function PrivilegesSection() {
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <div className="paddingMobile" style={{ position: "relative", marginTop: 20, minHeight: 109 }}>
            <h3
                className="titleCats"
                style={{
                    textAlign: "left",
                    fontSize: 24,
                    fontWeight: 600,
                    color: "#000",
                    margin: "0 0 16px 0",
                }}
            >
                Villa Tatilinde Ayrıcalıklarınız
            </h3>

            <style>{`
                .privileges-grid {
                    display: flex;
                    gap: 16px;
                    overflow-x: auto;
                    padding-bottom: 12px;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                    -webkit-overflow-scrolling: touch;
                }
                .privileges-grid::-webkit-scrollbar {
                    display: none;
                }
                .privilege-item {
                    width: 300px;
                    flex-shrink: 0;
                }
                .privilege-card-inner {
                    display: flex;
                    align-items: center;
                    padding: 8px;
                    border-radius: 16px;
                    border: 1px solid #eaeaea;
                    background: #fff;
                    height: 100%;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .privilege-card-inner:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                    transform: translateY(-2px);
                }
                @media (min-width: 1024px) {
                    .privileges-grid {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 24px;
                        overflow-x: visible;
                    }
                    .privilege-item {
                        width: 100%;
                    }
                }
            `}</style>

            <div ref={scrollRef} className="privileges-grid">
                {PRIVILEGE_CARDS.map((card, i) => (
                    <div key={i} className="privilege-item">
                        <Link href={card.href} style={{ textDecoration: "none" }}>
                            <div className="privilege-card-inner bhs">
                                <img
                                    src={card.image}
                                    style={{
                                        height: 72,
                                        width: 100,
                                        borderRadius: 12,
                                        flexShrink: 0,
                                        ...card.imageStyle,
                                    }}
                                    alt=""
                                />
                                <div style={{ marginLeft: 12, flex: 1, overflow: "hidden" }}>
                                    <div
                                        className="oneLine"
                                        style={{
                                            fontSize: 15,
                                            fontWeight: 400,
                                            color: "#111",
                                            marginBottom: 4
                                        }}
                                    >
                                        {card.title}
                                    </div>
                                    <div
                                        className="twoLine"
                                        style={{
                                            fontSize: 13,
                                            fontWeight: 400,
                                            color: "#555",
                                            lineHeight: 1.3
                                        }}
                                    >
                                        {card.description}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
