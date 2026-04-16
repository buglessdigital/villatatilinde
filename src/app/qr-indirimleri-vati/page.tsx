import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Vati Ocakbaşı İndirimi | Villa Tatilinde",
    description:
        "Villa Tatilinde tarafından sağlanan ve sunulan Kaş Vati Ocakbaşı İndirimi.",
};

/* ─── Promo pills data ─── */
const pills = [
    { href: "", label: "Vatiş Ocakbaşı %15 İndirim", width: 220, active: true },
    { href: "/qr-indirimleri-musakka", label: "Mussakka Restaurant %15 İndirim", width: 260, active: false },
    { href: "/qr-indirimleri-tekne", label: "Ergün Kaptan Tekne Turu %15 İndirim", width: 285, active: false },
    { href: "/qr-indirimleri-sailing", label: "Kaş Özel Sailing %15 İndirim", width: 285, active: false },
];

/* ─── Gallery images ─── */
const galleryImages = [
    { src: "/images/vati3.jpg", colStart: 1, colEnd: 12, rowStart: 1, rowEnd: 3 },
    { src: "/images/vati4.png", colStart: 12, colEnd: 17, rowStart: 1, rowEnd: 2 },
    { src: "/images/vati3.jpg", colStart: 17, colEnd: 21, rowStart: 1, rowEnd: 2 },
    { src: "/images/vati3.jpg", colStart: 12, colEnd: 17, rowStart: 2, rowEnd: 3 },
    { src: "/images/vati3.jpg", colStart: 17, colEnd: 21, rowStart: 2, rowEnd: 3 },
];

export default function QrIndirimleriVatiPage() {
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
                                    <Link href="/qr-indirimleri-tekne">
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
                                    <Link href="/qr-indirimleri-musakka">
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
                                        <br /> Vati Ocakbaşı İndirimi
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
                                        1 defa faydalanabilirsiniz, Kupon kodunuzu birkaç saniye
                                        içinde oluşturabilir ve ödeme sırasında indirimden
                                        faydalanabilirsiniz
                                        <div style={{ marginTop: 6 }}>
                                            <a
                                                href="https://www.vatiocakbasi.com/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    textDecoration: "underline",
                                                    color: "#3880ff",
                                                    marginRight: 4,
                                                }}
                                            >
                                                &bull; Vati Ocakbaşı
                                            </a>{" "}
                                            sayfasını ziyaret edin
                                        </div>
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
                                Vati Ocakbaşı
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
                                                src="/images/vati.jpg"
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
                                            Vati Ocakbaşı (Kaş Restaurant)
                                        </div>
                                        <div className="dm-sans officeAddress">
                                            Andifli, Uğur Mumcu Cd. No: 37, 07580 Kaş/Antalya
                                        </div>
                                    </div>
                                </div>
                                <div className="cntc32">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3219.378717571376!2d29.62671757623545!3d36.20598880096903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c1da5f9f1f6cf9%3A0xb3f45d313e7bdb40!2zVmF0aSBPY2FrYmHFn8SxIChLYcWfIFJlc3RhdXJhbnQp!5e0!3m2!1sen!2str!4v1733097593529!5m2!1sen!2str"
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
