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
                    margin: "0 0 12px 0",
                }}
            >
                Vila Tatilinde Ayrıcalıklarınız
            </h3>

            <div
                ref={scrollRef}
                style={{
                    display: "flex",
                    gap: 0,
                    overflowX: "auto",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    WebkitOverflowScrolling: "touch",
                }}
                className="hideScrollbar"
            >
                {PRIVILEGE_CARDS.map((card, i) => (
                    <div
                        key={i}
                        style={{
                            width: 400,
                            maxWidth: "100%",
                            background: "#fff",
                            flexShrink: 0,
                            paddingRight: 8,
                        }}
                    >
                        <Link href={card.href}>
                            <div
                                className="bhs middleft"
                                style={{
                                    borderRadius: 16,
                                    border: "2px solid #f6f6f6",
                                    overflow: "hidden",
                                }}
                            >
                                <div className="row">
                                    <img
                                        src={card.image}
                                        style={{
                                            height: 78,
                                            width: 110,
                                            borderRadius: 16,
                                            ...card.imageStyle,
                                        }}
                                        alt=""
                                    />
                                </div>
                                <div
                                    style={{
                                        padding: "12px 0",
                                        marginLeft: "5%",
                                        maxWidth: "calc(100% - 100px)",
                                    }}
                                >
                                    <div
                                        className="oneLine"
                                        style={{
                                            fontSize: 15,
                                            fontWeight: 400,
                                            color: "#111",
                                        }}
                                    >
                                        {card.title}
                                    </div>
                                    <div
                                        className="twoLine"
                                        style={{
                                            fontSize: 13,
                                            fontWeight: 400,
                                            color: "#333",
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
