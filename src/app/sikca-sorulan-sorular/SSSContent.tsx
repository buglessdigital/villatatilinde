"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getFaqs } from "@/lib/queries";
import type { DbFaq } from "@/lib/types";

interface FaqView {
    question: string;
    answer: string;
}

export default function SSSContent() {
    const [faqData, setFaqData] = useState<FaqView[]>([]);
    const [loading, setLoading] = useState(true);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    useEffect(() => {
        async function loadFaqs() {
            try {
                const data = await getFaqs();
                const mapped: FaqView[] = data.map((f: DbFaq) => ({
                    question: f.question_tr,
                    answer: f.answer_html_tr || "",
                }));
                setFaqData(mapped);
            } catch (err) {
                console.error("SSS yükleme hatası:", err);
            } finally {
                setLoading(false);
            }
        }
        loadFaqs();
    }, []);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="sss-page">
            <div
                className="paddingMobile"
                style={{ marginTop: "calc(2vh + 2vw)" }}
            >
                <div className="sss-animate">
                    <div style={{ width: "100%", paddingBottom: 48 }}>
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
                            <div
                                style={{ margin: "0 12px", fontWeight: "bold" }}
                            >
                                &bull;
                            </div>
                            <div>
                                <Image
                                    src="/images/hom.png"
                                    width={11}
                                    height={11}
                                    alt="SSS"
                                    style={{ marginRight: 3, height: 11, width: "auto" }}
                                />{" "}
                                SSS
                            </div>
                        </div>

                        {/* ── Page Title ── */}
                        <h1 className="sss-main-title">
                            Sıkça Sorulan Sorular
                        </h1>

                        {/* ── FAQ Accordion List ── */}
                        <div className="middle sss-faq-container">
                            <div
                                style={{
                                    maxWidth: 900,
                                    width: "100%",
                                    marginTop: 32,
                                }}
                            >
                                <div className="sss-accordion-list">
                                    {faqData.map((faq, i) => (
                                        <div
                                            key={i}
                                            className={`sss-accordion-item ${openIndex === i ? "sss-accordion-open" : ""
                                                }`}
                                        >
                                            <button
                                                className="sss-accordion-header"
                                                onClick={() => toggleAccordion(i)}
                                                aria-expanded={openIndex === i}
                                                id={`faq-header-${i}`}
                                            >
                                                <div className="middleft">
                                                    <Image
                                                        src="/images/locs.png"
                                                        width={36}
                                                        height={36}
                                                        alt=""
                                                        className="sss-accordion-icon"
                                                    />
                                                    <div className="sss-accordion-question">
                                                        {faq.question}
                                                    </div>
                                                </div>
                                                <div
                                                    className={`sss-accordion-chevron ${openIndex === i
                                                        ? "sss-accordion-chevron-open"
                                                        : ""
                                                        }`}
                                                >
                                                    <svg
                                                        width="12"
                                                        height="12"
                                                        viewBox="0 0 12 12"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M2 4L6 8L10 4"
                                                            stroke="#999"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </div>
                                            </button>
                                            <div
                                                className="sss-accordion-content"
                                                role="region"
                                                aria-labelledby={`faq-header-${i}`}
                                            >
                                                <div
                                                    className="sss-accordion-body"
                                                    dangerouslySetInnerHTML={{
                                                        __html: faq.answer,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ── Contact CTA Section ── */}
                        <div className="middle sss-faq-container">
                            <div
                                style={{
                                    maxWidth: 900,
                                    width: "100%",
                                    marginTop: 32,
                                }}
                            >
                                <div className="sss-contact-cta">
                                    Diğer Sorularınız için, <br /> Bizimle İletişime
                                    Geçin
                                </div>
                                <div style={{ marginTop: 16 }}>
                                    <a
                                        href="https://wa.me/905323990748"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <div className="sss-contact-item bhs">
                                            <Image
                                                src="/images/cfo.svg"
                                                width={20}
                                                height={20}
                                                alt="WhatsApp"
                                                style={{ height: 20, width: "auto", marginRight: 12 }}
                                            />
                                            <span className="sss-contact-item-text">
                                                WhatsApp&apos;tan ulaşın
                                            </span>
                                        </div>
                                    </a>
                                    <Link href="/iletisim">
                                        <div
                                            className="sss-contact-item bhs"
                                            style={{ marginTop: 6 }}
                                        >
                                            <Image
                                                src="/images/cfo.svg"
                                                width={20}
                                                height={20}
                                                alt="Sohbet"
                                                style={{ height: 20, width: "auto", marginRight: 12 }}
                                            />
                                            <span className="sss-contact-item-text">
                                                Bir sohbet başlatın
                                            </span>
                                        </div>
                                    </Link>
                                    <a
                                        href="tel:+90 242 606 0725"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <div
                                            className="sss-contact-item bhs"
                                            style={{ marginTop: 6 }}
                                        >
                                            <Image
                                                src="/images/cfo.svg"
                                                width={20}
                                                height={20}
                                                alt="Arayın"
                                                style={{ height: 20, width: "auto", marginRight: 12 }}
                                            />
                                            <span className="sss-contact-item-text">
                                                Arayın
                                            </span>
                                        </div>
                                    </a>
                                </div>
                            </div>
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
                                        KALKAN MAH. ŞEHİTLER CAD. NO: 53
                                        KAŞ(ANTALYA)
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
                    marginTop: 48,
                    padding: "4px 1%",
                    borderTop: "1px solid #dfdfe3",
                }}
            >
                <div className="middleft smallFooterC">
                    <div className="smallFooterLeft1">
                        &copy; 2025{" "}
                        <span className="skiptranslate">
                            Villa Tatilinde
                        </span>
                        <br />
                        Belge No: 18069 - PRAEDIUM GROUP TRAVEL AGENCY
                    </div>
                    <div className="smallFooterRight1">
                        <Link href="/sartlar-kosullar">
                            Koşullar ve Şartlar
                        </Link>
                    </div>
                    <div className="smallFooterRight2">
                        <Link href="/gizlilik-politikasi">
                            Gizlilik
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
