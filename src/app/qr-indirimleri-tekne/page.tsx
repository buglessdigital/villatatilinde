import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Ergün Kaptan Tekne Turu İndirimi | Villa Tatilinde",
    description:
        "Villa Tatilinde tarafından sağlanan ve sunulan Kaş Ergün Kaptan Tekne Turu İndirimi.",
};

/* ─── Promo pills data ─── */
const pills = [
    { href: "/qr-indirimleri-vati", label: "Vati Ocakbaşı %15 İndirim", width: 220, active: false },
    { href: "/qr-indirimleri-musakka", label: "Mussakka Restaurant %15 İndirim", width: 260, active: false },
    { href: "", label: "Ergün Kaptan Tekne Turu %15 İndirim", width: 285, active: true },
    { href: "/qr-indirimleri-sailing", label: "Kaş Özel Sailing %15 İndirim", width: 285, active: false },
];

/* ─── Gallery images ─── */
const galleryImages = [
    { src: "/images/t1.jpeg", colStart: 1, colEnd: 12, rowStart: 1, rowEnd: 3 },
    { src: "/images/t2.jpeg", colStart: 12, colEnd: 17, rowStart: 1, rowEnd: 2 },
    { src: "/images/t3.jpeg", colStart: 17, colEnd: 21, rowStart: 1, rowEnd: 2 },
    { src: "/images/t4.jpeg", colStart: 12, colEnd: 17, rowStart: 2, rowEnd: 3 },
    { src: "/images/t5.jpeg", colStart: 17, colEnd: 21, rowStart: 2, rowEnd: 3 },
];

export default function QrIndirimleriTeknePage() {
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
                                }}
                            >
                                {/* Left arrow */}
                                <div className="middleft">
                                    <Link href="/qr-indirimleri-musakka">
                                        <div
                                            style={{
                                                color: "#fff",
                                                width: 40,
                                                height: 35.5,
                                                fontSize: 16,
                                                fontWeight: 500,
                                                padding: 8,
                                                borderRadius: 20,
                                            }}
                                            className="bhs middle"
                                        >
                                            <img
                                                src="/images/cfo.svg"
                                                style={{ transform: "scaleX(-1)", height: 20 }}
                                                alt=""
                                            />
                                        </div>
                                    </Link>
                                </div>

                                {/* Pills */}
                                {pills.map((pill, i) => (
                                    <div key={i} className="middleft" style={{ marginRight: 12, marginLeft: i === 0 ? 12 : 0 }}>
                                        {pill.active ? (
                                            <div
                                                style={{
                                                    color: "#333",
                                                    width: pill.width,
                                                    fontSize: 16,
                                                    fontWeight: 500,
                                                    background: "#ebeef5aa",
                                                    padding: "6px 12px",
                                                    border: "1px solid #000",
                                                    borderRadius: 20,
                                                }}
                                                className="middle"
                                            >
                                                <img
                                                    src="/images/discount.png"
                                                    style={{ height: 16, marginRight: 4 }}
                                                    alt=""
                                                />
                                                {pill.label}
                                            </div>
                                        ) : (
                                            <Link href={pill.href}>
                                                <div
                                                    style={{
                                                        color: "#333",
                                                        width: pill.width,
                                                        fontSize: 16,
                                                        fontWeight: 500,
                                                        padding: "6px 12px",
                                                        border: "1px solid #000",
                                                        borderRadius: 20,
                                                    }}
                                                    className="bhs middle"
                                                >
                                                    <img
                                                        src="/images/discount.png"
                                                        style={{ height: 16, marginRight: 4 }}
                                                        alt=""
                                                    />
                                                    {pill.label}
                                                </div>
                                            </Link>
                                        )}
                                    </div>
                                ))}

                                {/* Right arrow */}
                                <div className="middleft">
                                    <Link href="/qr-indirimleri-sailing">
                                        <div
                                            style={{
                                                color: "#333",
                                                width: 40,
                                                fontSize: 16,
                                                fontWeight: 500,
                                                padding: "6px 12px",
                                                borderRadius: 20,
                                            }}
                                            className="bhs middle"
                                        >
                                            <img src="/images/cfo.svg" style={{ height: 20 }} alt="" />
                                        </div>
                                    </Link>
                                </div>
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
                                        <br /> Tekne Turu İndirimi
                                    </div>
                                    <div
                                        style={{
                                            textAlign: "left",
                                            fontWeight: 300,
                                            fontSize: 18,
                                        }}
                                    >
                                        Promosyon 2026 yazı boyunca{" "}
                                        <span className="skiptranslate">villatatilinde</span>{" "}
                                        misafirlerine özeldir, Rezervasyonunuz süresince yalnız
                                        1 defa faydalanabilirsiniz, Qr kodunuzu birkaç saniye
                                        içinde oluşturabilir ve ödeme sırasında indirimden
                                        faydalanabilirsiniz
                                        <div style={{ marginTop: 6 }}>
                                            <a
                                                href="https://www.tripadvisor.com.tr/Attraction_Review-g297965-d1924711-Reviews-Boat_Trips_by_Captain_Ergun-Kas_Turkish_Mediterranean_Coast.html"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    textDecoration: "underline",
                                                    color: "#3880ff",
                                                    marginRight: 4,
                                                }}
                                            >
                                                &bull; Ergün Kaptan Tekne Turu &amp; Sailing
                                            </a>{" "}
                                            tripadvisor sayfasını ziyaret edin
                                        </div>
                                        <div style={{ marginTop: 6 }}>
                                            <a
                                                href="https://www.instagram.com/villatatilinde/captainergun/?hl=en"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    textDecoration: "underline",
                                                    color: "#3880ff",
                                                    marginRight: 4,
                                                }}
                                            >
                                                &bull; Ergün Kaptan Tekne Turu &amp; Sailing
                                            </a>{" "}
                                            instagram sayfasını ziyaret edin
                                        </div>
                                        <Link href="/qr-indirim-kodu">
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
                                                    QR Kod Oluştur
                                                    <img
                                                        src="/images/qrw.svg"
                                                        style={{ height: 13, marginLeft: 6 }}
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ─── Image gallery ─── */}
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
                                {galleryImages.map((img, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            cursor: "pointer",
                                            position: "relative",
                                            gridColumnStart: img.colStart,
                                            gridColumnEnd: img.colEnd,
                                            gridRowStart: img.rowStart,
                                            gridRowEnd: img.rowEnd,
                                            width: "100%",
                                            padding: 0,
                                        }}
                                    >
                                        <img
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                            alt=""
                                            src={img.src}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ─── Bottom info section ─── */}
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
                            <div
                                className="poppins"
                                style={{ fontWeight: 700, fontSize: 25 }}
                            >
                                Ergün Kaptan Tekne Turu
                            </div>
                            <div className="row" style={{ marginTop: 12 }}>
                                <div className="cntc31">
                                    <div
                                        style={{
                                            marginRight: 12,
                                            textAlign: "left",
                                            width: "100%",
                                        }}
                                    >
                                        <div className="middleft">
                                            <img
                                                src="/images/tour.png"
                                                style={{
                                                    borderRadius: 16,
                                                    objectFit: "cover",
                                                    width: "100%",
                                                    height: 280,
                                                }}
                                                alt=""
                                            />
                                        </div>
                                        <div className="poppins officeTextUn">
                                            Kaş Ergün Kaptan Tekne Turu
                                        </div>
                                        <div className="dm-sans officeAddress">
                                            Andifli, Liman Sk. 4/A, 07580 Kaş/Antalya
                                        </div>
                                    </div>
                                </div>
                                <div className="cntc32">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1609.8261746879975!2d29.638893487453757!3d36.19933590235121!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c1da513ac4a391%3A0xc9624c6bb198a228!2zQm9hdCBUcmlwcyBieSBDYXB0YWluIEVyZ3VuIHwgS2Vrb3ZhIFRla25lIFR1cnUgfCBLYcWfIFRla25lIFR1cnUgfCDQmtC10LrQvtCy0LAg0L_RgNC-0LPRg9C70LrQsCDQvdCwINC70L7QtNC60LUgfCBUZWtuZSBLaXJhbGFtYQ!5e0!3m2!1sen!2str!4v1733103032455!5m2!1sen!2str"
                                        width="100%"
                                        height="340"
                                        style={{ border: 0, borderRadius: 8 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
