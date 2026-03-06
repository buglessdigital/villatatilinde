import type { Metadata } from "next";
import { getBlogBySlug } from "@/lib/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface Props {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const blog = await getBlogBySlug(params.slug);
    if (!blog) return { title: "Bulunamadı" };
    return {
        title: `${blog.title} - Villa Tatilinde Blog`,
        description: blog.subtitle || "Villa Tatilinde Blog",
    };
}

export default async function BlogDetailPage({ params }: Props) {
    const blog = await getBlogBySlug(params.slug);
    if (!blog) return notFound();

    const dateReadable = blog.published_at
        ? new Date(blog.published_at).toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })
        : "";

    return (
        <div className="blogb1">
            <div className="paddingMobile middleAfter768">
                <div className="middle nasilLeft">
                    <div>
                        <div style={{ fontSize: "14px", letterSpacing: "1px", fontWeight: 600 }}>
                            {blog.tags?.[0] || "BİLGİLENDİRME"}
                        </div>
                        <div className="nasilMainText">
                            {blog.title}
                        </div>
                        <div style={{ marginTop: "24px", fontSize: "14px", letterSpacing: "1px", fontWeight: 400 }}>
                            {blog.author || "Villa Tatilinde"}
                        </div>
                        <div style={{ marginTop: "8px", fontSize: "13px", letterSpacing: "1px", fontWeight: 500 }}>
                            {dateReadable}
                        </div>
                    </div>
                </div>
                {blog.cover_image_url && (
                    <Image
                        src={blog.cover_image_url}
                        alt={blog.title}
                        width={600}
                        height={700}
                        className="nasilRight"
                        style={{ objectFit: "cover" }}
                    />
                )}
            </div>

            <div className="nasilDesc paddingMobile">
                <div className="paddingMobile" style={{ paddingBottom: "32px", fontSize: "20px", fontWeight: 500 }}>
                    <div dangerouslySetInnerHTML={{ __html: blog.content_html || "" }} />
                </div>

                <div className="paddingMobile">
                    <div className="subContactC row">
                        <a href="tel:+90 242 606 0725" target="_blank">
                            <div className="subContactInfo middle bhs">
                                <Image src="/images/phone.png" alt="Phone" width={24} height={24} style={{ height: "24px", width: "auto" }} />
                                <div style={{ marginLeft: "12px" }}>
                                    <div>Villa Tatilinde Kalkan Ofis</div>
                                    <div>+90 242 606 0725</div>
                                </div>
                            </div>
                        </a>
                        <a href="mailto:info@villatatilinde.com" target="_blank">
                            <div className="subContactInfo middle bhs">
                                <Image src="/images/mail.png" alt="Mail" width={24} height={24} style={{ height: "24px", width: "auto", padding: "2px" }} />
                                <div style={{ marginLeft: "12px" }}>
                                    <div>Villa Tatilinde E-Posta</div>
                                    <div>info@villatatilinde.com</div>
                                </div>
                            </div>
                        </a>
                        <Link href="/iletisim">
                            <div className="subContactInfo middle bhs">
                                <Image src="/images/loc.png" alt="Location" width={24} height={24} style={{ height: "24px", width: "auto" }} />
                                <div style={{ marginLeft: "12px" }}>
                                    <div>Villa Tatilinde Kalkan Ofis</div>
                                    <div>KALKAN MAH. ŞEHİTLER CAD. NO: 53 KAŞ(ANTALYA)</div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="middle subsC" style={{ marginTop: "60px", marginBottom: "60px", textAlign: "center" }}>
                    <div>
                        <div style={{ fontWeight: 300, fontSize: "32px" }}>
                            Villa Tatilinde Aylık Mail Aboneliği
                        </div>
                        <div style={{ fontSize: "16px", marginTop: "16px", opacity: 0.8 }}>
                            En yeni villalar güncel promosyonlar indirimli villalar ve çok daha fazlası
                        </div>
                        <div className="middleft" style={{ marginTop: "32px", justifyContent: "center" }}>
                            <input
                                className="subsInput"
                                placeholder="E-postanızı yazın"
                                style={{ padding: "12px 16px", borderRadius: "8px", border: "1px solid #ccc", outline: "none", width: "300px", maxWidth: "100%" }}
                            />
                            <div className="subsBtn bhs middle" style={{ marginLeft: "8px", background: "#0aad0a", color: "#fff", padding: "12px 24px", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}>
                                ABONE OL
                            </div>
                        </div>
                        <div style={{ fontSize: "14px", marginTop: "12px", opacity: 0.7 }}>
                            Abone olarak, <Link href="/sartlar-kosullar"><span style={{ textDecoration: "underline" }}>şartlar ve koşulları</span></Link> kabul etmiş ve <Link href="/gizlilik-politikasi"><span style={{ textDecoration: "underline" }}>gizlilik politikamızı</span></Link> onaylamış olursunuz.
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: "48px", padding: "24px 1%", borderTop: "1px solid #dfdfe3" }}>
                <div className="middleft smallFooterC">
                    <div className="smallFooterLeft1">
                        &copy; 2026 Villa Tatilinde<br />
                        Belge No: 18069 - PRAEDIUM GROUP TRAVEL AGENCY
                    </div>
                    <div className="smallFooterRight1" style={{ marginLeft: "auto", marginRight: "16px" }}>
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
