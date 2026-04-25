"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getBlogs } from "@/lib/queries";
import type { DbBlog } from "@/lib/types";

interface BlogView {
    id: string;
    title: string;
    slug: string;
    subtitle: string;
    coverImage: string;
    mobileCoverImage: string;
    coverPosition: string;
    mobilePosition: string;
    dateReadable: string;
    readTime: string;
    tag: string;
    author: string;
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
                    title: b.title,
                    slug: b.slug,
                    subtitle: b.subtitle || "",
                    coverImage: b.cover_image_url || "/images/sailing2.png",
                    mobileCoverImage: b.mobile_image_url || b.cover_image_url || "/images/sailing2.png",
                    coverPosition: (b as any).cover_image_position || "50% 50%",
                    mobilePosition: (b as any).mobile_image_position || "50% 50%",
                    dateReadable: b.published_at
                        ? new Date(b.published_at).toLocaleDateString("tr-TR", {
                            day: "numeric", month: "long", year: "numeric",
                        })
                        : "",
                    readTime: b.read_time_min ? `${b.read_time_min} dk` : "5 dk",
                    tag: b.tags?.[0] || "Blog",
                    author: b.author || "Villa Tatilinde",
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
    const pageBlogs = blogs.slice(BLOGS_PER_PAGE * (page - 1), BLOGS_PER_PAGE * page);

    const pager = (n: number) => {
        setChangingPage(true);
        setPage(n);
        setTimeout(() => {
            setChangingPage(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 350);
    };

    const skeletons = (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 28, marginTop: 40 }}>
            {[1, 2, 3].map((i) => (
                <div key={i} style={{ borderRadius: 20, overflow: "hidden", background: "#f1f5f9", height: 420, animation: "pulse 1.5s ease-in-out infinite" }} />
            ))}
        </div>
    );

    return (
        <div className="blogMain" style={{ animation: "fadeInUp 0.5s ease forwards" }}>
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                .blog-card-item {
                    border-radius: 20px;
                    overflow: hidden;
                    background: #fff;
                    border: 1px solid #e8ecf0;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
                    transition: transform 0.25s ease, box-shadow 0.25s ease;
                    display: flex;
                    flex-direction: column;
                    text-decoration: none;
                    color: inherit;
                }
                .blog-card-item:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 16px 40px rgba(0,0,0,0.1);
                }
                .blog-card-img {
                    width: 100%;
                    height: 230px;
                    object-fit: cover;
                    display: block;
                    transition: transform 0.4s ease;
                }
                .blog-card-item:hover .blog-card-img {
                    transform: scale(1.04);
                }
                .blog-img-wrap {
                    overflow: hidden;
                    flex-shrink: 0;
                    position: relative;
                }
                .blog-card-tag {
                    position: absolute;
                    top: 14px;
                    left: 14px;
                    background: rgba(16, 185, 129, 0.92);
                    backdrop-filter: blur(4px);
                    color: #fff;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    padding: 4px 12px;
                    border-radius: 20px;
                }
                .blog-card-body {
                    flex: 1;
                    padding: 22px 24px 24px;
                    display: flex;
                    flex-direction: column;
                }
                .blog-card-title {
                    font-size: 20px;
                    font-weight: 700;
                    color: #0f172a;
                    line-height: 1.35;
                    margin: 0 0 10px;
                    font-family: 'Poppins', sans-serif;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .blog-card-subtitle {
                    font-size: 14px;
                    color: #64748b;
                    line-height: 1.6;
                    flex: 1;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .blog-card-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-top: 18px;
                    padding-top: 16px;
                    border-top: 1px solid #f1f5f9;
                }
                .blog-card-meta {
                    font-size: 13px;
                    color: #94a3b8;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .blog-card-read {
                    font-size: 13px;
                    font-weight: 600;
                    color: #10b981;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                /* Featured card (first blog on page 1) */
                .blog-featured {
                    border-radius: 24px;
                    overflow: hidden;
                    background: #fff;
                    border: 1px solid #e8ecf0;
                    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
                    transition: box-shadow 0.25s ease;
                    text-decoration: none;
                    color: inherit;
                    display: flex;
                    flex-direction: row;
                    min-height: 420px;
                }
                .blog-featured:hover {
                    box-shadow: 0 20px 60px rgba(0,0,0,0.12);
                }
                .blog-featured-img-wrap {
                    flex: 0 0 55%;
                    position: relative;
                    overflow: hidden;
                }
                .blog-featured-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.4s ease;
                }
                .blog-featured:hover .blog-featured-img {
                    transform: scale(1.03);
                }
                .blog-featured-body {
                    flex: 1;
                    padding: clamp(28px, 4vw, 48px);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .blog-featured-tag {
                    display: inline-block;
                    background: #f0fdf4;
                    color: #10b981;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    padding: 5px 12px;
                    border-radius: 20px;
                    margin-bottom: 18px;
                    border: 1px solid #bbf7d0;
                }
                .blog-featured-title {
                    font-size: clamp(22px, 2.5vw, 32px);
                    font-weight: 800;
                    color: #0f172a;
                    line-height: 1.25;
                    margin: 0 0 14px;
                    font-family: 'Poppins', sans-serif;
                }
                .blog-featured-subtitle {
                    font-size: 15px;
                    color: #64748b;
                    line-height: 1.65;
                    flex: 1;
                    display: -webkit-box;
                    -webkit-line-clamp: 4;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .blog-featured-footer {
                    margin-top: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 10px;
                }

                                @media (max-width: 768px) {
                    .blog-featured {
                        flex-direction: column;
                        min-height: auto;
                    }
                    .blog-featured-img-wrap {
                        flex: none;
                        height: 240px;
                        width: 100%;
                    }
                    /* Mobilde desktop görseli gizle, mobil görseli göster */
                    .blog-featured-img-desktop { display: none !important; }
                    .blog-card-img-desktop { display: none !important; }
                }
                /* Varsayılan olarak mobil görselleri gizle */
                .blog-featured-img-mobile,
                .blog-card-img-mobile { display: none !important; }
                @media (max-width: 768px) {
                    /* Mobilde desktop görselleri gizle */
                    .blog-featured-img-mobile { display: block !important; }
                    .blog-card-img-mobile { display: block !important; }
                }
            `}</style>

            <div className="paddingMobile" style={{ color: "#0b0a12", paddingBottom: "80px", marginTop: "calc(3vh + 2vw)" }}>
                <div>
                    {/* Page Header */}
                    <div style={{ marginBottom: 12 }}>
                        <div className="inter" style={{ fontSize: "calc(16px + 1.5vw)", fontWeight: "bold" }}>
                            <span>Villa Tatilinde</span> Blog
                        </div>
                        <p style={{ marginTop: 10, fontSize: 16, color: "#64748b", maxWidth: 600 }}>
                            Tatil rehberleri, villa tavsiyeleri ve seyahat ilhamı için okumaya devam edin.
                        </p>
                    </div>

                    {/* Loading */}
                    {loading && skeletons}

                    {/* Content */}
                    {!loading && !changingPage && (
                        <>
                            {/* Featured first blog */}
                            {page === 1 && pageBlogs[0] && (
                                <Link href={`/blog/${pageBlogs[0].slug}`} className="blog-featured" style={{ marginTop: 32 }}>
                                                                <div className="blog-featured-img-wrap">
                                        {pageBlogs[0].mobileCoverImage !== pageBlogs[0].coverImage ? (
                                            <>
                                                {/* Mobil görsel */}
                                                <Image
                                                    className="blog-featured-img blog-featured-img-mobile"
                                                    src={pageBlogs[0].mobileCoverImage}
                                                    alt={pageBlogs[0].title}
                                                    fill
                                                    sizes="100vw"
                                                    style={{ objectFit: "cover", objectPosition: pageBlogs[0].mobilePosition }}
                                                />
                                                {/* Web görsel */}
                                                <Image
                                                    className="blog-featured-img blog-featured-img-desktop"
                                                    src={pageBlogs[0].coverImage}
                                                    alt={pageBlogs[0].title}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 55vw"
                                                    style={{ objectFit: "cover", objectPosition: pageBlogs[0].coverPosition }}
                                                />
                                            </>
                                        ) : (
                                            <Image
                                                className="blog-featured-img"
                                                src={pageBlogs[0].coverImage}
                                                alt={pageBlogs[0].title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 55vw"
                                                style={{ objectFit: "cover", objectPosition: pageBlogs[0].coverPosition }}
                                            />
                                        )}
                                        <div style={{ position: "absolute", top: 16, left: 16 }}>
                                            <div style={{ background: "rgba(255,255,255,0.95)", color: "#10b981", fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", padding: "4px 12px", borderRadius: 20 }}>
                                                {pageBlogs[0].tag}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="blog-featured-body">
                                        <div>
                                            <h2 className="blog-featured-title">{pageBlogs[0].title}</h2>
                                            <p className="blog-featured-subtitle">{pageBlogs[0].subtitle}</p>
                                        </div>
                                        <div className="blog-featured-footer">
                                            <div style={{ fontSize: 13, color: "#94a3b8" }}>
                                                {pageBlogs[0].dateReadable && (
                                                    <span>{pageBlogs[0].dateReadable}</span>
                                                )}
                                                {pageBlogs[0].readTime && (
                                                    <span style={{ marginLeft: 8 }}>• {pageBlogs[0].readTime} okuma</span>
                                                )}
                                            </div>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: "#10b981", display: "flex", alignItems: "center", gap: 6 }}>
                                                Oku
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )}

                            {/* Grid of remaining blogs */}
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 28, marginTop: 32 }}>
                                {pageBlogs.slice(page === 1 ? 1 : 0).map((blog) => (
                                    <Link key={blog.id} href={`/blog/${blog.slug}`} className="blog-card-item">
                                        <div className="blog-img-wrap">
                                            {blog.mobileCoverImage !== blog.coverImage ? (
                                                <>
                                                    <Image
                                                        className="blog-card-img blog-card-img-mobile"
                                                        src={blog.mobileCoverImage}
                                                        alt={blog.title}
                                                        width={600}
                                                        height={230}
                                                        style={{ width: "100%", height: "230px", objectFit: "cover", objectPosition: blog.mobilePosition }}
                                                    />
                                                    <Image
                                                        className="blog-card-img blog-card-img-desktop"
                                                        src={blog.coverImage}
                                                        alt={blog.title}
                                                        width={600}
                                                        height={230}
                                                        style={{ width: "100%", height: "230px", objectFit: "cover", objectPosition: blog.coverPosition }}
                                                    />
                                                </>
                                            ) : (
                                                <Image
                                                    className="blog-card-img"
                                                    src={blog.coverImage}
                                                    alt={blog.title}
                                                    width={600}
                                                    height={230}
                                                    style={{ width: "100%", height: "230px", objectFit: "cover", objectPosition: blog.coverPosition }}
                                                />
                                            )}
                                            <div className="blog-card-tag">{blog.tag}</div>
                                        </div>
                                        <div className="blog-card-body">
                                            <h2 className="blog-card-title">{blog.title}</h2>
                                            {blog.subtitle && (
                                                <p className="blog-card-subtitle">{blog.subtitle}</p>
                                            )}
                                            <div className="blog-card-footer">
                                                <div className="blog-card-meta">
                                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                                                    </svg>
                                                    {blog.dateReadable || blog.readTime + " okuma"}
                                                </div>
                                                <div className="blog-card-read">
                                                    {blog.readTime} okuma
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                        <path d="M5 12h14M12 5l7 7-7 7"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Skeleton while changing page */}
                    {changingPage && skeletons}

                    {/* Pagination */}
                    {!loading && totalPages > 1 && (
                        <div style={{ display: "flex", justifyContent: "center", marginTop: 48, gap: 6 }}>
                            {/* Previous */}
                            {page > 1 ? (
                                <button onClick={() => pager(page - 1)} style={{ width: 46, height: 46, borderRadius: 10, background: "#f1f5f9", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                                </button>
                            ) : (
                                <div style={{ width: 46, height: 46 }} />
                            )}

                            {/* Page numbers */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                                .reduce<(number | "...")[]>((acc, n, i, arr) => {
                                    if (i > 0 && n - (arr[i - 1] as number) > 1) acc.push("...");
                                    acc.push(n);
                                    return acc;
                                }, [])
                                .map((item, i) => item === "..." ? (
                                    <div key={`ellipsis-${i}`} style={{ width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 16 }}>…</div>
                                ) : (
                                    <button key={item} onClick={() => pager(item as number)} style={{ width: 46, height: 46, borderRadius: 10, background: page === item ? "#10b981" : "#f1f5f9", color: page === item ? "#fff" : "#334155", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 15, transition: "all 0.2s" }}>
                                        {item}
                                    </button>
                                ))
                            }

                            {/* Next */}
                            {page < totalPages ? (
                                <button onClick={() => pager(page + 1)} style={{ width: 46, height: 46, borderRadius: 10, background: "#f1f5f9", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                                </button>
                            ) : (
                                <div style={{ width: 46, height: 46 }} />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
