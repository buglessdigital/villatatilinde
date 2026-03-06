"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getBlogs } from "@/lib/queries";
import type { DbBlog } from "@/lib/types";

interface BlogView {
    id: string;
    h: string;
    slug: string;
    coverImage: string;
    dateReadable: string;
    readTime: string;
    descriptionHtmlContent: string;
}

const BLOGS_PER_PAGE = 6;

export default function BloglarContent() {
    const [blogs, setBlogs] = useState<BlogView[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [changingPage, setChangingPage] = useState(false);

    useEffect(() => {
        async function loadBlogs() {
            try {
                const data = await getBlogs();
                const mapped: BlogView[] = data.map((b: DbBlog) => ({
                    id: b.id,
                    h: b.title,
                    slug: b.slug,
                    coverImage: b.cover_image_url || "/images/sailing2.png",
                    dateReadable: b.published_at
                        ? new Date(b.published_at).toLocaleDateString("tr-TR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })
                        : "",
                    readTime: b.read_time_min ? `${b.read_time_min} dk` : "5 dk",
                    descriptionHtmlContent: b.subtitle || b.content_html?.substring(0, 200) || "",
                }));
                setBlogs(mapped);
            } catch (err) {
                console.error("Blog yükleme hatası:", err);
            } finally {
                setLoading(false);
            }
        }
        loadBlogs();
    }, []);

    const totalPages = Math.ceil(blogs.length / BLOGS_PER_PAGE);
    const pageBlogs = blogs.slice(
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

    const getBlogLink = (blog: BlogView) => {
        return `/blog/${blog.slug}`;
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
                        <>
                            {page === 1 && pageBlogs[0] && (
                                <div style={{ marginTop: "20px", minHeight: "410px" }} className="row">
                                    <Link href={getBlogLink(pageBlogs[0])} style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                                        <div className="bs1">
                                            <div style={{ width: "100%", height: "410px", borderRadius: "8px", overflow: "hidden" }} className="hvIm">
                                                <Image
                                                    className="hvi"
                                                    src={pageBlogs[0].coverImage}
                                                    alt={pageBlogs[0].h}
                                                    width={800}
                                                    height={410}
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                />
                                            </div>
                                        </div>
                                        <div className="bs2">
                                            <div>
                                                <div className="inter" style={{ fontSize: "32px", fontWeight: 600 }}>
                                                    {pageBlogs[0].h}
                                                </div>
                                                <div className="inter fourLine" style={{ color: "#000", fontSize: "16px", lineHeight: 1.6, marginTop: "12px", fontWeight: 500 }}>
                                                    <div dangerouslySetInnerHTML={{ __html: pageBlogs[0].descriptionHtmlContent }} />
                                                </div>
                                                <div className="middleft inter" style={{ fontSize: "14px", marginTop: "32px" }}>
                                                    <div style={{ color: "#5c6c75bf" }}>{pageBlogs[0].dateReadable}</div>
                                                    <div style={{ marginLeft: "auto", color: "#5c6c75bf" }}>
                                                        Okuma Süresi <span style={{ color: "#0b0a12", fontWeight: 600 }}>{pageBlogs[0].readTime}</span>
                                                    </div>
                                                </div>
                                                <div className="middlert bhs" style={{ marginTop: "6px" }}>
                                                    <Image src="/images/longright.png" alt="" width={40} height={11} style={{ height: "11px", width: "auto" }} />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            )}
                            <div className="row" style={{ marginTop: "32px" }}>
                                {pageBlogs.slice(page === 1 ? 1 : 0).map((blog) => (
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
                        </>
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
