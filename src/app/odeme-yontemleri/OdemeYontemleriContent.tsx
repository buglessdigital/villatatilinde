"use client";

import Image from "next/image";
import Link from "next/link";

const cardLogos = [
    "hc1", "hc2", "hc3", "hc4", "hc5", "hc6", "hc7",
    "hc9", "hc10", "hc11", "hc12", "hc13", "hc14", "hc15",
];

export default function OdemeYontemleriContent() {
    return (
        <div className="odeme-page">
            <div
                className="paddingMobile"
                style={{ marginTop: "calc(2vh + 2vw)" }}
            >
                <div className="odeme-animate">
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
                            <div style={{ margin: "0 12px", fontWeight: "bold" }}>
                                &bull;
                            </div>
                            <div>
                                <Image
                                    src="/images/hom.png"
                                    width={11}
                                    height={11}
                                    alt="Ödeme Yöntemleri"
                                    style={{ marginRight: 3, height: 11, width: "auto" }}
                                />{" "}
                                Ödeme Yöntemleri
                            </div>
                        </div>

                        {/* ── Page Title ── */}
                        <div className="middle">
                            <h1 className="odeme-main-title">
                                Ödeme &amp; Taksit Seçenekleri
                            </h1>
                        </div>
                        <div className="taksitFirstInfo">
                            Online ödemelerinizi iyzico ile güvenle yapabilirsiniz
                        </div>

                        {/* ── Payment Content ── */}
                        <div className="middle">
                            <div
                                style={{
                                    marginTop: 24,
                                    paddingBottom: 48,
                                    width: "100%",
                                    maxWidth: 600,
                                }}
                            >
                                {/* ── Ön Ödeme Section ── */}
                                <div
                                    style={{
                                        background: "#fff",
                                        borderRadius: "1.5rem",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: "calc(15px + .6vw)",
                                            fontWeight: 500,
                                        }}
                                    >
                                        Ön Ödeme
                                        <div
                                            className="middleft"
                                            style={{
                                                color: "#333333aa",
                                                marginTop: 20,
                                                fontSize: 14,
                                                fontWeight: 300,
                                            }}
                                        >
                                            <div className="odeme-badge">Nakit</div>
                                            <div className="odeme-badge" style={{ marginLeft: "0.5rem" }}>
                                                EFT
                                            </div>
                                            <div className="odeme-badge" style={{ marginLeft: "0.5rem" }}>
                                                Kredi Kartı
                                            </div>
                                            <div className="odeme-badge" style={{ marginLeft: "0.5rem" }}>
                                                Banka Kartı
                                            </div>
                                        </div>
                                        <div className="middleft" style={{ marginTop: "0.1rem" }}>
                                            <div
                                                style={{
                                                    fontWeight: 400,
                                                    fontSize: 15,
                                                    marginTop: 12,
                                                    color: "#747579",
                                                }}
                                            >
                                                EFT ile, Nakit, Kredi Kartı ile veya Banka Kartı
                                                ile Ödeme İmkanı
                                            </div>
                                        </div>

                                        {/* ── Taksit Info ── */}
                                        <div
                                            style={{
                                                fontSize: 18,
                                                marginTop: 20,
                                                fontWeight: 500,
                                                color: "#000",
                                            }}
                                        >
                                            Tüm kredi kartlarına 12 taksit fırsatı
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 14,
                                                marginTop: 4,
                                                fontWeight: 400,
                                                color: "#6a6a6aaa",
                                            }}
                                        >
                                            Sanal Pos ile Güvenli Online Ödeme
                                        </div>

                                        {/* ── Card Logos ── */}
                                        <div
                                            className="row"
                                            style={{ marginTop: "0.6rem" }}
                                        >
                                            {cardLogos.map((logo) => (
                                                <Image
                                                    key={logo}
                                                    src={`/images/${logo}.svg`}
                                                    width={60}
                                                    height={14}
                                                    alt={logo}
                                                    className="crd"
                                                    style={{
                                                        marginRight: 12,
                                                        marginBottom: 16,
                                                        height: 14,
                                                        width: "auto",
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* ── Kalan Ödeme Section ── */}
                                    <div
                                        style={{
                                            borderTop: "1px solid #dfdfe3",
                                            paddingTop: "1.5rem",
                                            marginTop: "2rem",
                                            fontSize: "calc(15px + .6vw)",
                                            fontWeight: 500,
                                        }}
                                    >
                                        Girişte Yapılacak Ön Ödemeden Kalan Ödeme
                                    </div>
                                    <div
                                        className="middleft"
                                        style={{
                                            color: "#333333aa",
                                            marginTop: 20,
                                            fontSize: 14,
                                            fontWeight: 300,
                                        }}
                                    >
                                        <div className="odeme-badge">EFT</div>
                                        <div className="odeme-badge" style={{ marginLeft: "0.5rem" }}>
                                            Nakit
                                        </div>
                                    </div>
                                    <div className="middleft" style={{ marginTop: "0.1rem" }}>
                                        <div
                                            style={{
                                                fontWeight: 400,
                                                fontSize: 15,
                                                marginTop: 12,
                                                color: "#747579",
                                            }}
                                        >
                                            EFT veya Nakit Ödeme İmkanı
                                        </div>
                                    </div>

                                    {/* ── Depozito Section ── */}
                                    <div
                                        style={{
                                            borderTop: "1px solid #dfdfe3",
                                            paddingTop: "1.5rem",
                                            marginTop: "2rem",
                                            fontSize: "calc(15px + .6vw)",
                                            fontWeight: 500,
                                        }}
                                    >
                                        Girişte Ödenmesi Gereken Depozito
                                    </div>
                                    <div
                                        className="middleft"
                                        style={{
                                            color: "#333333aa",
                                            marginTop: 20,
                                            fontSize: 14,
                                            fontWeight: 300,
                                        }}
                                    >
                                        <div className="odeme-badge">Nakit</div>
                                    </div>
                                    <div className="middleft" style={{ marginTop: "0.1rem" }}>
                                        <div
                                            style={{
                                                fontWeight: 400,
                                                fontSize: 15,
                                                marginTop: 12,
                                                color: "#747579",
                                            }}
                                        >
                                            Depozito giriş sırasında nakit alınır ve çıkış
                                            sonrasında nakit iade edilir
                                        </div>
                                    </div>
                                </div>

                                {/* ── Bottom Links ── */}
                                <div
                                    style={{
                                        borderTop: "1px solid #ddd",
                                        marginTop: "3rem",
                                        color: "#333333",
                                        fontWeight: 500,
                                        fontSize: "1rem",
                                    }}
                                >
                                    <Link href="/mesafeli-satis-sozlesmesi">
                                        <div
                                            className="middleft bhs"
                                            style={{
                                                fontSize: 17,
                                                marginTop: "2rem",
                                                fontWeight: 500,
                                            }}
                                        >
                                            <Image
                                                src="/images/cfo.svg"
                                                width={14}
                                                height={14}
                                                alt=""
                                                style={{ height: 14, width: "auto" }}
                                            />
                                            <div
                                                style={{
                                                    marginLeft: "0.4rem",
                                                    width: "calc(100% - 48px - 1rem)",
                                                }}
                                            >
                                                Mesafeli Satış Sözleşmesi için tıklayın
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div style={{ color: "#333333", fontWeight: 500, fontSize: "1rem" }}>
                                    <Link href="/iletisim">
                                        <div
                                            className="middleft bhs"
                                            style={{
                                                fontSize: 17,
                                                marginTop: "1.5rem",
                                                fontWeight: 500,
                                            }}
                                        >
                                            <Image
                                                src="/images/cfo.svg"
                                                width={14}
                                                height={14}
                                                alt=""
                                                style={{ height: 14, width: "auto" }}
                                            />
                                            <div
                                                style={{
                                                    marginLeft: "0.4rem",
                                                    width: "calc(100% - 48px - 1rem)",
                                                }}
                                            >
                                                Daha fazla bilgi için bizimle iletişime geçin
                                            </div>
                                        </div>
                                    </Link>
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
                                        <span className="skiptranslate">Villa Tatilinde</span>{" "}
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
                                        <span className="skiptranslate">Villa Tatilinde</span>{" "}
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
                                        <span className="skiptranslate">Villa Tatilinde</span>{" "}
                                        Kalkan Ofis
                                    </div>
                                    <div>
                                        KALKAN MAH. ŞEHİTLER CAD. NO: 53 KAŞ(ANTALYA)
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
                    padding: "4px 1%",
                    marginTop: 48,
                    borderTop: "1px solid #dfdfe3",
                }}
            >
                <div className="middleft smallFooterC">
                    <div className="smallFooterLeft1">
                        &copy; 2025{" "}
                        <span className="skiptranslate">Villa Tatilinde</span>
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
