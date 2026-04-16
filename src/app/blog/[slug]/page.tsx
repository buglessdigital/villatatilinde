import type { Metadata } from "next";
import { getBlogBySlug } from "@/lib/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);
    if (!blog) return { title: "Bulunamadı" };
    return {
        title: `${blog.title} - Villa Tatilinde Blog`,
        description: blog.subtitle || "Villa Tatilinde Blog",
        openGraph: {
            title: blog.title,
            description: blog.subtitle || "",
            images: blog.cover_image_url ? [blog.cover_image_url] : [],
        },
    };
}

const blogStyles = `
    .blog-content {
        font-size: 1.1rem;
        line-height: 1.9;
        color: #334155;
        font-family: 'DM Sans', sans-serif;
        box-sizing: border-box;
        width: 100%;
    }
    .blog-content * {
        max-width: 100% !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
        white-space: normal !important;
    }
    .blog-content h1, .blog-content h2, .blog-content h3 {
        color: #0f172a;
        margin-top: 2.5rem;
        margin-bottom: 1rem;
        font-family: 'Poppins', sans-serif;
        font-weight: 700;
        letter-spacing: -0.02em;
    }
    .blog-content h2 { font-size: 1.75rem; }
    .blog-content h3 { font-size: 1.4rem; }
    .blog-content p { margin-bottom: 1.5rem; }
    .blog-content img {
        width: 100%;
        height: auto;
        border-radius: 12px;
        margin: 2rem 0;
        box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    }
    .blog-content blockquote {
        border-left: 4px solid #6772e5;
        padding: 1.25rem 1.5rem;
        margin: 2rem 0;
        font-style: italic;
        color: #475569;
        background: #f3f0ff;
        border-radius: 0 12px 12px 0;
    }
    .blog-content a {
        color: #6772e5;
        text-decoration: underline;
        text-underline-offset: 4px;
    }
    .blog-content ul, .blog-content ol {
        margin-bottom: 1.5rem;
        padding-left: 1.75rem;
    }
    .blog-content li { margin-bottom: 0.5rem; }

    /* Standard layout hero */
    .blog-hero {
        display: none;
    }
    .blog-hero-overlay {
        display: none;
    }
    .blog-hero-content {
        display: none;
    }
    .blog-hero-inner {
        display: none;
    }
    /* Cover image inside card */
    .blog-cover-img-wrap {
        border-radius: 14px;
        overflow: hidden;
        margin-bottom: 32px;
    }
    .blog-tag {
        display: inline-block;
        background: #6772e5;
        color: #fff;
        padding: 5px 14px;
        border-radius: 30px;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 1.2px;
        text-transform: uppercase;
        margin-bottom: 16px;
    }
    .blog-card {
        max-width: 980px;
        margin: -28px auto 0;
        background: #fff;
        border-radius: 20px 20px 0 0;
        padding: clamp(28px, 5vw, 56px);
        position: relative;
        z-index: 10;
        min-height: 200px;
    }
    .blog-meta-bar {
        display: flex;
        align-items: center;
        gap: 14px;
        padding-bottom: 28px;
        border-bottom: 1px solid #e2e8f0;
        margin-bottom: 40px;
        flex-wrap: wrap;
    }
    .blog-avatar {
        width: 46px;
        height: 46px;
        border-radius: 50%;
        background: linear-gradient(135deg, #6772e5, #50b0f0);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 18px;
        font-weight: 700;
        flex-shrink: 0;
    }
    .blog-back-btn {
        margin-left: auto;
        font-size: 13px;
        color: #64748b;
        text-decoration: none;
        background: #f1f5f9;
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: 500;
        white-space: nowrap;
        transition: background 0.2s;
    }
    .blog-back-btn:hover { background: #e2e8f0; }

    /* Modern layout */
    .blog-modern-wrap {
        max-width: 880px;
        margin: 0 auto;
        padding: clamp(60px, 10vw, 100px) clamp(16px, 5vw, 40px) 0;
    }
    .blog-modern-tag {
        color: #50b0f0;
        font-weight: 700;
        font-size: 12px;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        margin-bottom: 20px;
    }
    .blog-modern-title {
        font-size: clamp(36px, 5.5vw, 62px);
        font-weight: 800;
        line-height: 1.12;
        letter-spacing: -1.5px;
        color: #0f172a;
        margin: 0 0 20px;
        font-family: 'Poppins', sans-serif;
    }
    .blog-modern-subtitle {
        font-size: clamp(18px, 2.2vw, 22px);
        color: #64748b;
        line-height: 1.6;
        margin: 0 0 36px;
        font-weight: 400;
    }
    .blog-modern-divider {
        border: none;
        border-top: 1px solid #e2e8f0;
        margin: 0 0 40px;
    }
    .blog-modern-image {
        margin-top: 60px;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0,0,0,0.1);
    }

    /* CTA Section */
    .blog-cta {
        background: linear-gradient(135deg, #f3f0ff, #e0f0ff);
        border-radius: 20px;
        padding: clamp(28px, 5vw, 48px);
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: center;
        text-align: center;
    }
    .blog-cta-buttons {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        justify-content: center;
    }
    .blog-cta-btn {
        background: #fff;
        padding: 12px 24px;
        border-radius: 50px;
        color: #334155;
        text-decoration: none;
        font-weight: 600;
        box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 15px;
        transition: box-shadow 0.2s, transform 0.2s;
    }
    .blog-cta-btn:hover {
        box-shadow: 0 6px 20px rgba(0,0,0,0.1);
        transform: translateY(-1px);
    }
    .blog-footer {
        padding: 32px clamp(16px, 3vw, 40px);
        border-top: 1px solid #e2e8f0;
        margin-top: 80px;
    }
    .blog-footer-inner {
        max-width: 1100px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
    }

    @media (max-width: 640px) {
        .blog-card { border-radius: 16px 16px 0 0; padding: 24px 16px; }
        .blog-back-btn { display: none; }
        .blog-modern-wrap { padding-top: 56px; }
    }
`;

export default async function BlogDetailPage({ params }: Props) {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);
    if (!blog) return notFound();

    const dateReadable = blog.published_at
        ? new Date(blog.published_at).toLocaleDateString("tr-TR", {
            day: "numeric", month: "long", year: "numeric",
        })
        : new Date(blog.created_at).toLocaleDateString("tr-TR", {
            day: "numeric", month: "long", year: "numeric",
        });

    const isModern = blog.blog_type === "modern";

    const ctaSection = (
        <div className="paddingMobile" style={{ maxWidth: 980, margin: "80px auto 0" }}>
            <div className="blog-cta">
                <h3 style={{ margin: 0, fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: 700, color: "#1e293b", fontFamily: "'Poppins', sans-serif" }}>
                    Harika bir tatil için buradayız
                </h3>
                <p style={{ margin: 0, color: "#64748b", fontSize: 16 }}>
                    Villa tatilinizle ilgili her türlü soru ve talebiniz için iletişime geçin.
                </p>
                <div className="blog-cta-buttons">
                    <a href="tel:+902426060725" className="blog-cta-btn">
                        📞 +90 242 606 0725
                    </a>
                    <a href="mailto:info@villatatilinde.com" className="blog-cta-btn">
                        ✉️ info@villatatilinde.com
                    </a>
                </div>
            </div>
        </div>
    );

    const footerSection = (
        <div className="blog-footer">
            <div className="blog-footer-inner">
                <div style={{ color: "#94a3b8", fontSize: 13 }}>
                    &copy; {new Date().getFullYear()} Villa Tatilinde. Tüm Hakları Saklıdır.<br />
                    <span style={{ fontSize: 12 }}>Belge No: 18069 - PRAEDIUM GROUP TRAVEL AGENCY</span>
                </div>
                <div style={{ display: "flex", gap: 24, fontSize: 13, fontWeight: 500 }}>
                    <Link href="/sartlar-kosullar" style={{ color: "#94a3b8", textDecoration: "none" }}>Koşullar ve Şartlar</Link>
                    <Link href="/gizlilik-politikasi" style={{ color: "#94a3b8", textDecoration: "none" }}>Gizlilik Politikası</Link>
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ background: isModern ? "#fff" : "#f8fafc", minHeight: "100vh", paddingBottom: 40 }}>
            <style>{blogStyles}</style>

            {isModern ? (
                /* ═══════════════════════════════════════════════════════════
                   TASARIM 2 — Modern: İçerik önce, görsel altta
                   ═══════════════════════════════════════════════════════════ */
                <>
                    <div className="blog-modern-wrap">
                        {/* Back link */}
                        <Link href="/bloglar" style={{ fontSize: 13, color: "#94a3b8", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 32 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                            Tüm Blog Yazıları
                        </Link>

                        {/* Tag */}
                        <div className="blog-modern-tag">{blog.tags?.[0] || "Blog"}</div>

                        {/* Title */}
                        <h1 className="blog-modern-title">{blog.title}</h1>

                        {/* Subtitle */}
                        {blog.subtitle && (
                            <p className="blog-modern-subtitle">{blog.subtitle}</p>
                        )}

                        {/* Author bar */}
                        <div className="blog-meta-bar">
                            <div className="blog-avatar">{blog.author.charAt(0)}</div>
                            <div>
                                <div style={{ fontWeight: 600, color: "#1e293b", fontSize: 15 }}>{blog.author || "Villa Tatilinde"}</div>
                                <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 2 }}>
                                    {dateReadable}{blog.read_time_min ? ` • ${blog.read_time_min} dk okuma` : ""}
                                </div>
                            </div>
                        </div>

                        <hr className="blog-modern-divider" />

                        {/* Content */}
                        <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.content_html || "" }} />

                        {/* Image at the bottom */}
                        {blog.cover_image_url && (
                            <div className="blog-modern-image">
                                <Image
                                    src={blog.cover_image_url}
                                    alt={blog.title}
                                    width={600}
                                    height={230}
                                    sizes="(max-width: 640px) 100vw, 880px"
                                    style={{ width: "100%", height: "230px", display: "block", objectFit: "cover" }}
                                />
                            </div>
                        )}
                    </div>

                    {ctaSection}
                    {footerSection}
                </>
            ) : (
                /* ═══════════════════════════════════════════════════════════
                   TASARIM 1 — Standard: Görsel üstte hero olarak
                   ═══════════════════════════════════════════════════════════ */
                <>
                    {/* Content Card */}
                    <div className="paddingMobile" style={{ paddingTop: "calc(70px + 3vh)" }}>
                        <div className="blog-card">
                            {/* Tag */}
                            <div className="blog-tag" style={{ marginBottom: 16 }}>{blog.tags?.[0] || "Blog"}</div>

                            {/* Title */}
                            <h1 style={{ fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 800, color: "#0f172a", fontFamily: "'Poppins', sans-serif", letterSpacing: "-0.5px", lineHeight: 1.2, margin: "0 0 12px" }}>
                                {blog.title}
                            </h1>

                            {/* Subtitle */}
                            {blog.subtitle && (
                                <p style={{ fontSize: "clamp(15px, 1.8vw, 18px)", color: "#64748b", lineHeight: 1.6, margin: "0 0 24px", fontWeight: 400 }}>
                                    {blog.subtitle}
                                </p>
                            )}

                            {/* Meta bar */}
                            <div className="blog-meta-bar">
                                <div className="blog-avatar">{blog.author.charAt(0)}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, color: "#1e293b", fontSize: 15 }}>{blog.author || "Villa Tatilinde"}</div>
                                    <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 2 }}>
                                        {dateReadable}{blog.read_time_min ? ` • ${blog.read_time_min} dk okuma` : ""}
                                    </div>
                                </div>
                                <Link href="/bloglar" className="blog-back-btn">
                                    ← Tüm Yazılar
                                </Link>
                            </div>

                            {/* Cover image inside card */}
                            {blog.cover_image_url && (
                                <div className="blog-cover-img-wrap">
                                    <Image
                                        src={blog.cover_image_url}
                                        alt={blog.title}
                                        width={600}
                                        height={230}
                                        priority
                                        sizes="(max-width: 640px) 100vw, 980px"
                                        style={{ width: "100%", height: "230px", objectFit: "cover", display: "block" }}
                                    />
                                </div>
                            )}

                            {/* Content */}
                            <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.content_html || "" }} />
                        </div>
                    </div>

                    {ctaSection}
                    {footerSection}
                </>
            )}
        </div>
    );
}
