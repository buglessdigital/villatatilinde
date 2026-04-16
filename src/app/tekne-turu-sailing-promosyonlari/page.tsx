import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Tekne Turu Sailing Promosyonları | Villa Tatilinde",
    description:
        "Villa Tatilinde tarafından sağlanan ve sunulan Tekne Turu ve Sailing Promosyonları.",
};

/* ─── Static promo data ─── */
const promos = [
    {
        slug: "qr-indirimleri-tekne",
        image: "/images/tour.png",
        discount: "%15 İndirim",
        title: "Tekne Turu İndirimi",
        description: "Kaş'ın en popüler günübirlik tekne turuna davetlisiniz",
        validity: "1 Haz -  30Eyl",
    },
    {
        slug: "qr-indirimleri-sailing",
        image: "/images/sailing1.jpeg",
        discount: "%15 İndirim",
        title: "Kaş Marina Sailing İndirimleri",
        description: "Size özel exclusive sailing indirimleri",
        validity: "1 Haz -  30Eyl",
    },
];

export default function TekneTuruSailingPromosyonlariPage() {
    return (
        <div className="paddingMobile" style={{ paddingBottom: 72 }}>
            {/* Breadcrumb */}
            <div
                className="middle dm-sans"
                style={{
                    color: "#85878a",
                    fontSize: 13,
                    marginTop: "calc(2vh + 2vw)",
                }}
            >
                <Link href="/promosyonlar">
                    <div className="middle">
                        <img
                            src="/images/hom.png"
                            style={{ marginRight: 3, height: 11 }}
                            alt=""
                        />{" "}
                        Promosyonlar
                    </div>
                </Link>
                <div style={{ margin: "0 12px", fontWeight: "bold" }}>&bull;</div>
                <div>
                    <img
                        src="/images/star.png"
                        style={{ marginRight: 3, height: 11 }}
                        alt=""
                    />{" "}
                    Tekne Turu Sailing Promosyonlari
                </div>
            </div>

            {/* Title */}
            <div style={{ marginTop: 16, color: "#000" }}>
                <div
                    className="middle"
                    style={{
                        fontSize: "calc(16px + 1.5vw)",
                        fontWeight: 600,
                    }}
                >
                    Tekne Turu Sailing Promosyonlari
                </div>
            </div>

            {/* Promo cards */}
            <div className="row resProC">
                {promos.map((promo, i) => (
                    <div
                        key={promo.slug}
                        className={i === 0 ? "resPro1" : "resPro2"}
                        style={{
                            boxShadow: "0 .125rem .25rem rgba(0,0,0,.075)",
                        }}
                    >
                        <Link href={`/${promo.slug}`}>
                            <div
                                style={{
                                    borderRadius: 16,
                                    overflow: "hidden",
                                    position: "relative",
                                }}
                            >
                                {/* Location icon */}
                                <div
                                    className="bhs middle"
                                    style={{
                                        position: "absolute",
                                        right: 12,
                                        top: 12,
                                        width: 28,
                                        height: 28,
                                        borderRadius: 8,
                                        background: "#fff",
                                    }}
                                >
                                    <img
                                        src="/images/loc.png"
                                        style={{
                                            width: 16,
                                            objectFit: "contain",
                                        }}
                                        alt=""
                                    />
                                </div>

                                {/* Images icon */}
                                <div
                                    className="bhs middle"
                                    style={{
                                        position: "absolute",
                                        right: 12,
                                        top: 48,
                                        width: 28,
                                        height: 28,
                                        borderRadius: 8,
                                        background: "#fff",
                                    }}
                                >
                                    <img
                                        src="/images/ims.png"
                                        style={{
                                            width: 20,
                                            opacity: 0.8,
                                            objectFit: "contain",
                                        }}
                                        alt=""
                                    />
                                </div>

                                {/* Promo image */}
                                <img
                                    src={promo.image}
                                    style={{
                                        height: 300,
                                        width: "100%",
                                        objectFit: "cover",
                                    }}
                                    alt={promo.title}
                                />

                                {/* Info section */}
                                <div
                                    style={{
                                        width: "100%",
                                        padding: "22px 24px",
                                        background: "#fff",
                                    }}
                                >
                                    {/* Discount badge */}
                                    <div className="middleft">
                                        <div
                                            className="middle"
                                            style={{
                                                color: "#333",
                                                fontSize: 16,
                                                fontWeight: 500,
                                                padding: "6px 12px",
                                                border: "1px solid #333",
                                                borderRadius: 20,
                                            }}
                                        >
                                            <img
                                                src="/images/discount.png"
                                                style={{
                                                    height: 16,
                                                    marginRight: 4,
                                                }}
                                                alt=""
                                            />
                                            {promo.discount}
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <div
                                        style={{
                                            marginTop: 20,
                                            letterSpacing: 1,
                                            fontWeight: 500,
                                            fontSize: 30,
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        {promo.title}
                                    </div>

                                    {/* Description */}
                                    <div
                                        style={{
                                            fontSize: 15,
                                            lineHeight: 1.6,
                                            marginTop: 12,
                                            fontWeight: 500,
                                        }}
                                    >
                                        {promo.description}
                                    </div>

                                    {/* Validity */}
                                    <div
                                        className="poppins"
                                        style={{
                                            fontSize: 14,
                                            marginTop: 40,
                                            textAlign: "right",
                                        }}
                                    >
                                        <div className="afacad">
                                            Promosyon Geçerlilik Tarihi
                                        </div>
                                        {promo.validity}
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
