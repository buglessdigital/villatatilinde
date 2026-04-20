import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Promotion {
    id: string;
    title: string;
    slug: string;
    description: string;
    image_url: string;
    gallery_images: string[];
    discount_text: string;
    category: string;
    address: string;
    map_embed_url: string;
    external_url: string;
    validity_start: string;
    validity_end: string;
    is_couponable: boolean;
}

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function PromosyonDetayPage({ params }: Props) {
    const { slug } = await params;

    // Aktif promosyonu getir
    const { data: promo } = await supabase
        .from("promotions")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

    if (!promo) return notFound();

    // Diğer aktif promosyonları al (pills bar için)
    const { data: allPromos } = await supabase
        .from("promotions")
        .select("slug, title, discount_text")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

    const otherPromos = (allPromos || []) as { slug: string; title: string; discount_text: string }[];

    return (
        <div>
            <div className="animAlive3" style={{ marginTop: "calc(1vh + 2vw)" }}>
                <div style={{ width: "100%", margin: "0 auto" }}>

                    {/* ─── Promo pills bar ─── */}
                    <div className="paddingMobile">
                        <div className="middle">
                            <div
                                style={{
                                    display: "flex",
                                    borderBottom: "1px solid #dfdfe3aa",
                                    flexWrap: "nowrap",
                                    overflowX: "auto",
                                    paddingBottom: 12,
                                    gap: 12,
                                }}
                            >
                                {otherPromos.map((p) => {
                                    const isActive = p.slug === slug;
                                    return isActive ? (
                                        <div
                                            key={p.slug}
                                            style={{
                                                color: "#333",
                                                fontSize: 16,
                                                fontWeight: 500,
                                                background: "#ebeef5aa",
                                                padding: "6px 12px",
                                                border: "1px solid #000",
                                                borderRadius: 20,
                                                whiteSpace: "nowrap",
                                                flexShrink: 0,
                                            }}
                                            className="middle"
                                        >
                                            <img src="/images/discount.png" style={{ height: 16, marginRight: 4 }} alt="" />
                                            {p.title} {p.discount_text && `${p.discount_text}`}
                                        </div>
                                    ) : (
                                        <Link key={p.slug} href={`/promosyonlar/${p.slug}`}>
                                            <div
                                                style={{
                                                    color: "#333",
                                                    fontSize: 16,
                                                    fontWeight: 500,
                                                    padding: "6px 12px",
                                                    border: "1px solid #000",
                                                    borderRadius: 20,
                                                    whiteSpace: "nowrap",
                                                    flexShrink: 0,
                                                }}
                                                className="bhs middle"
                                            >
                                                <img src="/images/discount.png" style={{ height: 16, marginRight: 4 }} alt="" />
                                                {p.title} {p.discount_text && `${p.discount_text}`}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ─── Hero text ─── */}
                        <div className="middle">
                            <div className="paddingMobile">
                                <div style={{ padding: "calc(2vh + 2vw) 0" }}>
                                    <div
                                        style={{
                                            textAlign: "left",
                                            fontWeight: 400,
                                            fontSize: "calc(32px + 1.8vw)",
                                            lineHeight: 1.1,
                                        }}
                                    >
                                        <span className="skiptranslate">Villa Tatilinde</span>
                                        <br /> {promo.title}
                                    </div>
                                    <div
                                        style={{
                                            textAlign: "left",
                                            fontWeight: 300,
                                            fontSize: 18,
                                        }}
                                    >
                                        {promo.description || ""}
                                        {promo.external_url && (
                                            <div style={{ marginTop: 6 }}>
                                                <a
                                                    href={promo.external_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        textDecoration: "underline",
                                                        color: "#3880ff",
                                                        marginRight: 4,
                                                    }}
                                                >
                                                    &bull; {promo.title}
                                                </a>{" "}
                                                sayfasını ziyaret edin
                                            </div>
                                        )}
                                        {promo.is_couponable !== false && (
                                            <Link href="/kupon-olustur">
                                                <div className="middleft" style={{ marginTop: 20 }}>
                                                    <div
                                                        className="middle bhs"
                                                        style={{
                                                            fontWeight: 500,
                                                            background: "#000",
                                                            color: "#fff",
                                                            fontSize: 15,
                                                            padding: "10px 16px",
                                                            borderRadius: 32,
                                                        }}
                                                    >
                                                        Kupon Kodu Oluştur
                                                        <img
                                                            src="/images/qrw.svg"
                                                            style={{ height: 13, marginLeft: 6 }}
                                                            alt=""
                                                        />
                                                    </div>
                                                </div>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ─── Image gallery ─── */}
                    {promo.gallery_images && promo.gallery_images.length > 0 && (
                        <div style={{ padding: "10px 0" }}>
                            <div
                                className="pag"
                                style={{
                                    minHeight: 64,
                                    position: "relative",
                                    width: "100%",
                                    overflow: "hidden",
                                    marginTop: 10,
                                    paddingBottom: 4,
                                }}
                            >
                                <div className="promosyonGrid">
                                    {promo.gallery_images.length === 1 ? (
                                        <div style={{ gridColumn: "1 / 21", gridRow: "1 / 3", width: "100%", position: "relative" }}>
                                            <img style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" src={promo.gallery_images[0]} />
                                        </div>
                                    ) : promo.gallery_images.length === 2 ? (
                                        <>
                                            <div style={{ gridColumn: "1 / 12", gridRow: "1 / 3", width: "100%" }}>
                                                <img style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" src={promo.gallery_images[0]} />
                                            </div>
                                            <div style={{ gridColumn: "12 / 21", gridRow: "1 / 3", width: "100%" }}>
                                                <img style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" src={promo.gallery_images[1]} />
                                            </div>
                                        </>
                                    ) : promo.gallery_images.length === 3 ? (
                                        <>
                                            <div style={{ gridColumn: "1 / 12", gridRow: "1 / 3", width: "100%" }}>
                                                <img style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" src={promo.gallery_images[0]} />
                                            </div>
                                            <div style={{ gridColumn: "12 / 21", gridRow: "1 / 2", width: "100%" }}>
                                                <img style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" src={promo.gallery_images[1]} />
                                            </div>
                                            <div style={{ gridColumn: "12 / 21", gridRow: "2 / 3", width: "100%" }}>
                                                <img style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" src={promo.gallery_images[2]} />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div style={{ gridColumn: "1 / 12", gridRow: "1 / 3", width: "100%" }}>
                                                <img style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" src={promo.gallery_images[0]} />
                                            </div>
                                            <div style={{ gridColumn: "12 / 17", gridRow: "1 / 2", width: "100%" }}>
                                                <img style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" src={promo.gallery_images[1]} />
                                            </div>
                                            <div style={{ gridColumn: "17 / 21", gridRow: "1 / 2", width: "100%" }}>
                                                <img style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" src={promo.gallery_images[2]} />
                                            </div>
                                            <div style={{ gridColumn: "12 / 17", gridRow: "2 / 3", width: "100%" }}>
                                                <img style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" src={promo.gallery_images[3] || promo.gallery_images[0]} />
                                            </div>
                                            {promo.gallery_images[4] && (
                                                <div style={{ gridColumn: "17 / 21", gridRow: "2 / 3", width: "100%" }}>
                                                    <img style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" src={promo.gallery_images[4]} />
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Image from image_url if no gallery */}
                    {(!promo.gallery_images || promo.gallery_images.length === 0) && promo.image_url && (
                        <div style={{ padding: "10px 0" }}>
                            <img src={promo.image_url} alt={promo.title} style={{ width: "100%", height: 400, objectFit: "cover" }} />
                        </div>
                    )}

                    {/* ─── Bottom info section ─── */}
                    {(promo.address || promo.map_embed_url) && (
                        <div
                            className="paddingMobile"
                            style={{
                                background: "#f8f8f8",
                                paddingBottom: 72,
                                marginTop: 32,
                                paddingTop: 42,
                            }}
                        >
                            <div>
                                <div className="poppins" style={{ fontWeight: 700, fontSize: 25 }}>
                                    {promo.title}
                                </div>
                                <div className="row" style={{ marginTop: 12 }}>
                                    {promo.address && (
                                        <div className="cntc31">
                                            <div style={{ marginRight: 12, textAlign: "left", width: "100%" }}>
                                                {promo.image_url && (
                                                    <div className="middleft">
                                                        <img
                                                            src={promo.image_url}
                                                            style={{
                                                                borderRadius: 16,
                                                                objectFit: "cover",
                                                                width: "100%",
                                                                height: 280,
                                                            }}
                                                            alt=""
                                                        />
                                                    </div>
                                                )}
                                                <div className="poppins officeTextUn">
                                                    {promo.title}
                                                </div>
                                                <div className="dm-sans officeAddress">
                                                    {promo.address}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {promo.map_embed_url && promo.map_embed_url.startsWith("https://www.google.com/maps/embed") && (
                                        <div className="cntc32">
                                            <iframe
                                                src={promo.map_embed_url}
                                                width="100%"
                                                height="340"
                                                style={{ border: 0, borderRadius: 8 }}
                                                allowFullScreen
                                                loading="lazy"
                                                referrerPolicy="no-referrer-when-downgrade"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
