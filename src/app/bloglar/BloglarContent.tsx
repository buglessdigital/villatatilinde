"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

/* ── Sample blog data (will be replaced with dynamic API data) ── */
const sampleBlogs = [
    {
        id: 1,
        h: "Kaş'ta Villa Tatili Rehberi",
        slug: "kasta-villa-tatili-rehberi",
        type: 1,
        coverImage: "/images/sailing2.png",
        dateReadable: "15 Şubat 2026",
        readTime: "5 dk",
        descriptionHtmlContent:
            "Kaş, Türkiye'nin en güzel tatil destinasyonlarından biri olarak bilinir. Muhteşem deniz manzaraları, tarihi kalıntıları ve eşsiz doğasıyla her yıl binlerce turisti ağırlamaktadır. Villa kiralama seçenekleri ile unutulmaz bir tatil deneyimi yaşayabilirsiniz.",
    },
    {
        id: 2,
        h: "Kalkan'da Yapılacak En İyi Aktiviteler",
        slug: "kalkanda-yapilacak-en-iyi-aktiviteler",
        type: 1,
        coverImage: "/images/sailing2.png",
        dateReadable: "10 Şubat 2026",
        readTime: "7 dk",
        descriptionHtmlContent:
            "Kalkan, sakin atmosferi ve turkuaz renkli denizi ile Antalya'nın en popüler tatil beldelerinden biridir. Tekne turları, dalış aktiviteleri, yürüyüş parkurları ve çok daha fazlası sizi bekliyor.",
    },
    {
        id: 3,
        h: "Villa Kiralama İpuçları ve Dikkat Edilmesi Gerekenler",
        slug: "villa-kiralama-ipuclari",
        type: 2,
        coverImage: "/images/sailing2.png",
        dateReadable: "5 Şubat 2026",
        readTime: "6 dk",
        descriptionHtmlContent:
            "Villa kiralama sürecinde dikkat etmeniz gereken önemli noktalar, doğru villa seçimi, fiyat karşılaştırması ve güvenli ödeme yöntemleri hakkında detaylı rehberimiz.",
    },
    {
        id: 4,
        h: "Antalya'nın Gizli Cennetleri",
        slug: "antalyanin-gizli-cennetleri",
        type: 1,
        coverImage: "/images/sailing2.png",
        dateReadable: "1 Şubat 2026",
        readTime: "8 dk",
        descriptionHtmlContent:
            "Antalya'nın keşfedilmemiş koyları, doğal güzellikleri ve saklı cennetleri. Kalabalıktan uzak, huzurlu bir tatil için en güzel rotalar ve öneriler.",
    },
    {
        id: 5,
        h: "Fethiye'de Ailecek Tatil Planlaması",
        slug: "fethiyede-ailecek-tatil-planlamasi",
        type: 2,
        coverImage: "/images/sailing2.png",
        dateReadable: "25 Ocak 2026",
        readTime: "4 dk",
        descriptionHtmlContent:
            "Fethiye'de aile dostu villalar, çocuklara uygun aktiviteler ve en güzel plajlar hakkında kapsamlı rehberimiz. Ailenizle birlikte unutulmaz bir tatil geçirin.",
    },
    {
        id: 6,
        h: "Bodrum Villa Tatili: Nereye, Nasıl?",
        slug: "bodrum-villa-tatili",
        type: 3,
        coverImage: "/images/sailing2.png",
        dateReadable: "20 Ocak 2026",
        readTime: "6 dk",
        descriptionHtmlContent:
            "Bodrum yarımadasının en güzel villaları, ulaşım seçenekleri, yeme-içme önerileri ve gece hayatı hakkında detaylı bilgiler. Bodrum'da mükemmel bir tatil planlamanız için ihtiyacınız olan her şey.",
    },
];

const BLOGS_PER_PAGE = 6;

export default function BloglarContent() {
    const [page, setPage] = useState(1);
    const [changingPage, setChangingPage] = useState(false);

    const totalPages = Math.ceil(sampleBlogs.length / BLOGS_PER_PAGE);
    const pageBlogs = sampleBlogs.slice(
        BLOGS_PER_PAGE * (page - 1),
        BLOGS_PER_PAGE * page
    );

    const pager = (n: number) => {
        setChangingPage(true);
        setPage(n);
        setTimeout(() => {
            setChangingPage(false);
        }, 400);
    };

    const getBlogLink = (blog: (typeof sampleBlogs)[0]) => {
        if (blog.type === 1) return `/blog/b1/${blog.slug}`;
        if (blog.type === 2) return `/blog/b2/${blog.slug}`;
        return `/blog/b3/${blog.slug}`;
    };

    return (
        <div className="blogMain" style={{ animation: "fadeInUp 0.5s ease forwards" }}>
            <div
                className="paddingMobile"
                style={{
                    color: "#0b0a12",
                    paddingBottom: "80px",
                    marginTop: "calc(3vh + 2vw)",
                }}
            >
                <div>
                    <div
                        className="inter"
                        style={{
                            fontSize: "calc(16px + 1.5vw)",
                            fontWeight: "bold",
                        }}
                    >
                        <span>Villa Tatilinde</span> Blog
                    </div>

                    {/* ── Blog Grid ── */}
                    {!changingPage && (
                        <div className="row" style={{ marginTop: "32px" }}>
                            {pageBlogs.map((blog) => (
                                <div key={blog.id} className="blogSmall">
                                    <Link href={getBlogLink(blog)}>
                                        <div style={{ width: "100%" }} className="hvIm">
                                            <Image
                                                className="hvi"
                                                src={blog.coverImage}
                                                alt={blog.h}
                                                width={600}
                                                height={240}
                                                style={{
                                                    borderRadius: "8px",
                                                    width: "100%",
                                                    height: "240px",
                                                    objectFit: "cover",
                                                }}
                                            />
                                            <div>
                                                <div>
                                                    <h2
                                                        className="inter"
                                                        style={{
                                                            fontSize: "32px",
                                                            marginBottom: 0,
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        {blog.h}
                                                    </h2>
                                                    <div
                                                        className="inter fourLine"
                                                        style={{
                                                            color: "#000",
                                                            fontSize: "16px",
                                                            lineHeight: 1.6,
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        <div
                                                            dangerouslySetInnerHTML={{
                                                                __html: blog.descriptionHtmlContent,
                                                            }}
                                                        />
                                                    </div>
                                                    <div
                                                        className="middleft inter"
                                                        style={{ fontSize: "14px", marginTop: "32px" }}
                                                    >
                                                        <div style={{ color: "#5c6c75bf" }}>
                                                            {blog.dateReadable}
                                                        </div>
                                                        <div
                                                            style={{
                                                                marginLeft: "auto",
                                                                color: "#5c6c75bf",
                                                            }}
                                                        >
                                                            Okuma Süresi{" "}
                                                            <span
                                                                style={{
                                                                    color: "#0b0a12",
                                                                    fontWeight: 600,
                                                                }}
                                                            >
                                                                {blog.readTime}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="middlert bhs"
                                                        style={{ marginTop: "6px" }}
                                                    >
                                                        <Image
                                                            src="/images/longright.png"
                                                            alt=""
                                                            width={40}
                                                            height={11}
                                                            style={{ height: "11px", width: "auto" }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── Loading Skeletons ── */}
                    {changingPage && (
                        <div className="row" style={{ marginTop: "32px" }}>
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="breg"
                                    style={{
                                        height: "434px",
                                        borderRadius: "16px",
                                        background: "#f0f0f0",
                                        animation: "pulse 1.5s ease-in-out infinite",
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {/* ── Pagination ── */}
                    <div className="row inter">
                        <div style={{ width: "100%" }}>
                            <div
                                className="middle inter"
                                style={{ fontWeight: 400, marginTop: "32px" }}
                            >
                                {/* Previous Button */}
                                {page > 1 ? (
                                    <div
                                        onClick={() => pager(page - 1)}
                                        className="bhs middle"
                                        style={{
                                            marginRight: "4px",
                                            width: "52px",
                                            height: "46px",
                                            background: "#f0f3f2",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <Image
                                            src="/images/cfo.svg"
                                            alt="Previous"
                                            width={24}
                                            height={24}
                                            style={{
                                                opacity: 0.7,
                                                height: "24px",
                                                transform: "scaleX(-1)",
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div
                                        style={{
                                            marginRight: "4px",
                                            width: "52px",
                                            height: "46px",
                                            background: "#fff",
                                            borderRadius: "8px",
                                        }}
                                    />
                                )}

                                {/* Page numbers */}
                                {page > 2 && (
                                    <div
                                        onClick={() => pager(page - 2)}
                                        className="bhs middle"
                                        style={{
                                            marginRight: "4px",
                                            width: "42px",
                                            height: "46px",
                                            background: "#f0f3f2",
                                            fontWeight: 600,
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {page - 2}
                                    </div>
                                )}

                                {page > 1 && (
                                    <div
                                        onClick={() => pager(page - 1)}
                                        className="bhs middle"
                                        style={{
                                            marginRight: "4px",
                                            width: "42px",
                                            height: "46px",
                                            background: "#f0f3f2",
                                            fontWeight: 600,
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {page - 1}
                                    </div>
                                )}

                                {/* Current page */}
                                <div
                                    className="bhs middle"
                                    style={{
                                        marginRight: "4px",
                                        width: "42px",
                                        height: "46px",
                                        background: "#0aad0a",
                                        color: "#fff",
                                        fontWeight: 600,
                                        borderRadius: "8px",
                                    }}
                                >
                                    {page}
                                </div>

                                {totalPages > page && (
                                    <div
                                        onClick={() => pager(page + 1)}
                                        className="bhs middle"
                                        style={{
                                            marginRight: "4px",
                                            width: "42px",
                                            height: "46px",
                                            background: "#f0f3f2",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {page + 1}
                                    </div>
                                )}

                                {page === 1 && totalPages > page + 1 && (
                                    <div
                                        onClick={() => pager(page + 2)}
                                        className="middle"
                                        style={{
                                            marginRight: "4px",
                                            width: "42px",
                                            height: "46px",
                                            background: "#f0f3f2",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {page + 2}
                                    </div>
                                )}

                                {/* Next Button */}
                                {totalPages > page ? (
                                    <div
                                        onClick={() => pager(page + 1)}
                                        className="bhs middle"
                                        style={{
                                            width: "52px",
                                            height: "46px",
                                            background: "#f0f3f2",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <Image
                                            src="/images/cfo.svg"
                                            alt="Next"
                                            width={24}
                                            height={24}
                                            style={{ opacity: 0.7, height: "24px" }}
                                        />
                                    </div>
                                ) : (
                                    <div
                                        style={{
                                            width: "52px",
                                            height: "46px",
                                            background: "#fff",
                                            borderRadius: "8px",
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Mini Footer ── */}
            <div
                style={{
                    padding: "4px 1%",
                    borderTop: "1px solid #dfdfe3",
                }}
            >
                <div className="middleft smallFooterC">
                    <div className="smallFooterLeft1">
                        © 2026 Villa Tatilinde
                        <br />
                        Belge No: 18069 - PRAEDIUM GROUP TRAVEL AGENCY
                    </div>
                    <div className="smallFooterRight1">
                        <Link href="/sartlar-kosullar">Koşullar ve Şartlar</Link>
                    </div>
                    <div className="smallFooterRight2">
                        <Link href="/gizlilik-politikasi">Gizlilik</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
