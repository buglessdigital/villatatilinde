"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface PolicyData {
    id: string;
    title: string;
    slug: string;
    content_html: string;
}

export default function PolicyContent({ slug }: { slug: string }) {
    const [policy, setPolicy] = useState<PolicyData | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        async function loadPolicy() {
            const { data, error } = await supabase
                .from("policies")
                .select("*")
                .eq("slug", slug)
                .single();

            if (error || !data) {
                setNotFound(true);
            } else {
                setPolicy(data);
            }
            setLoading(false);
        }
        loadPolicy();
    }, [slug]);

    if (loading) {
        return (
            <div className="paddingMobile" style={{ marginTop: "calc(2vh + 2vw)", textAlign: "center", padding: "80px 20px" }}>
                <div style={{ fontSize: 16, color: "#94a3b8" }}>Yükleniyor...</div>
            </div>
        );
    }

    if (notFound || !policy) {
        return (
            <div className="paddingMobile" style={{ marginTop: "calc(2vh + 2vw)", textAlign: "center", padding: "80px 20px" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
                <h1 style={{ fontSize: 24, fontWeight: 600, color: "#1e293b", marginBottom: 8 }}>Politika Bulunamadı</h1>
                <p style={{ color: "#64748b", fontSize: 15, marginBottom: 24 }}>Aradığınız politika sayfası mevcut değil veya kaldırılmış olabilir.</p>
                <Link href="/" style={{
                    display: "inline-block",
                    padding: "12px 28px",
                    borderRadius: 10,
                    background: "linear-gradient(135deg, #50b0f0, #3b82f6)",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: "none",
                }}>
                    Ana Sayfaya Dön
                </Link>
            </div>
        );
    }

    return (
        <div className="iptal-page">
            <div className="paddingMobile" style={{ marginTop: "calc(2vh + 2vw)" }}>
                {/* ── Policy Content ── */}
                <div className="iptal-animate">
                    {/* ── Breadcrumb ── */}
                    <div
                        className="middle dm-sans"
                        style={{ color: "#85878a", fontSize: 13 }}
                    >
                        <Link href="/">
                            <div className="middle">
                                <Image
                                    src="/images/hom.png"
                                    width={11}
                                    height={11}
                                    alt="Anasayfa"
                                    style={{ marginRight: 3, height: 11, width: "auto" }}
                                />{" "}
                                Anasayfa
                            </div>
                        </Link>
                        <div style={{ margin: "0 12px", fontWeight: "bold" }}>
                            &bull;
                        </div>
                        <div>
                            <Image
                                src="/images/hom.png"
                                width={11}
                                height={11}
                                alt={policy.title}
                                style={{ marginRight: 3, height: 11, width: "auto" }}
                            />{" "}
                            {policy.title}
                        </div>
                    </div>

                    {/* ── Title ── */}
                    <h1 className="iptal-main-title">{policy.title}</h1>

                    {/* ── Content ── */}
                    <div className="middle">
                        <div
                            style={{
                                marginTop: 32,
                                width: "100%",
                                maxWidth: 800,
                            }}
                        >
                            <div
                                className="policy-content"
                                style={{
                                    fontSize: 15,
                                    lineHeight: 1.8,
                                    color: "#333",
                                    whiteSpace: "pre-wrap",
                                }}
                                dangerouslySetInnerHTML={{ __html: policy.content_html }}
                            />
                        </div>
                    </div>
                </div>

                {/* ── Sub Contact Cards ── */}
                <div className="paddingMobile">
                    <div className="subContactC row">
                        <a
                            href="tel:+90 242 606 0725"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div className="subContactInfo middle bhs">
                                <Image
                                    src="/images/phone.png"
                                    width={24}
                                    height={24}
                                    alt="Telefon"
                                    style={{ height: 24, width: "auto" }}
                                />
                                <div style={{ marginLeft: 12 }}>
                                    <div>
                                        <span className="skiptranslate">
                                            Villa Tatilinde
                                        </span>{" "}
                                        Kalkan Ofis
                                    </div>
                                    <div>+90 242 606 0725</div>
                                </div>
                            </div>
                        </a>
                        <a
                            href="mailto:info@villatatilinde.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div className="subContactInfo middle bhs">
                                <Image
                                    src="/images/mail.png"
                                    width={24}
                                    height={24}
                                    alt="E-Posta"
                                    style={{ height: 24, width: "auto", padding: 2 }}
                                />
                                <div style={{ marginLeft: 12 }}>
                                    <div>
                                        <span className="skiptranslate">
                                            Villa Tatilinde
                                        </span>{" "}
                                        E-Posta
                                    </div>
                                    <div className="skiptranslate">
                                        info@villatatilinde.com
                                    </div>
                                </div>
                            </div>
                        </a>
                        <Link href="/iletisim">
                            <div className="subContactInfo middle bhs">
                                <Image
                                    src="/images/loc.png"
                                    width={24}
                                    height={24}
                                    alt="Konum"
                                    style={{ height: 24, width: "auto" }}
                                />
                                <div style={{ marginLeft: 12 }}>
                                    <div>
                                        <span className="skiptranslate">
                                            Villa Tatilinde
                                        </span>{" "}
                                        Kalkan Ofis
                                    </div>
                                    <div>
                                        KALKAN MAH. ŞEHİTLER CAD. NO: 53 KAŞ(ANTALYA)
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>


            </div>

            {/* ── Mini Footer ── */}
            <div
                style={{
                    padding: "4px 1%",
                    marginTop: 48,
                    borderTop: "1px solid #dfdfe3",
                }}
            >
                <div className="middleft smallFooterC">
                    <div className="smallFooterLeft1">
                        &copy; 2025{" "}
                        <span className="skiptranslate">Villa Tatilinde</span>
                        <br />
                        Belge No: 18069 - PRAEDIUM GROUP TRAVEL AGENCY
                    </div>
                    <div className="smallFooterRight1">
                        <Link href="/politika/sartlar-ve-kosullar">Koşullar ve Şartlar</Link>
                    </div>
                    <div className="smallFooterRight2">
                        <Link href="/politika/gizlilik-politikasi">Gizlilik</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
