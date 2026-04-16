"use client";

import Image from "next/image";
import Link from "next/link";

const guaranteeItems = [
    {
        title: "Onaylanmış Villa Portföyü",
        content: (
            <>
                Websitemizde görüntülediğiniz tüm villalar, apartlar, bağ evi ve tatil
                evleri yerinde kontrol edilmiş ve onaylanmıştır.
                <br />
                Tüm sorularınız için haftanın her günü{" "}
                <Link href="/iletisim" style={{ fontWeight: 500 }}>
                    ofisimize uğrayabilir
                </Link>
                ,{" "}
                <a
                    style={{ fontWeight: 500 }}
                    href="tel:+90 242 606 0725"
                    target="_blank"
                    rel="noreferrer"
                >
                    bizi arayabilir
                </a>
                ,{" "}
                <a
                    style={{ fontWeight: 500 }}
                    href="https://wa.me/905323990748"
                    target="_blank"
                    rel="noreferrer"
                >
                    WhatsApp
                </a>{" "}
                üzerinden ulaşabilir veya{" "}
                <Link href="/iletisim" style={{ fontWeight: 500 }}>
                    canlı destek
                </Link>{" "}
                hattımıza bağlanabilirsiniz.
            </>
        ),
        isLast: false,
    },
    {
        title: "Villa Tatilinde Türsab'a Kayıtlı",
        content: null,
        tursab: true,
        isLast: false,
    },
    {
        title: "Villa Tatilinde Etbis'e Kayıtlı",
        content: null,
        etbis: true,
        isLast: false,
    },
    {
        title: "Profesyonel Destek Ekibi",
        content:
            "Haftanın her günü 09:00 - 21:00 saatleri arasında tüm soru görüş öneri ve istekleriniz için bizlere ulaşabilir en kısa zamanda aklınıza takılan tüm sorulara cevap bulabilirsiniz.",
        isLast: false,
    },
    {
        title: "En Uygun Fiyat Garantisi",
        content: null,
        priceGuarantee: true,
        isLast: false,
    },
    {
        title: "Sadece Villa Tatilinde'ye Özel Promosyon ve İndirimler",
        content:
            "Haftalık indirimler, özel indirim süreleri, son dakika indirimleri, promosyonlar, kısa süreli kiralamalar ve çok daha fazlası Villa Tatilinde.",
        isLast: true,
    },
];

export default function GarantiliVillaContent() {
    return (
        <div style={{ animation: "fadeInUp 0.5s ease forwards" }}>
            <div
                className="paddingMobile"
                style={{ marginTop: "calc(2vh + 2vw)" }}
            >
                <div style={{ width: "100%", paddingBottom: "48px" }}>
                    {/* ── Breadcrumb ── */}
                    <div
                        className="middle dm-sans"
                        style={{ color: "#85878a", fontSize: "13px" }}
                    >
                        <Link href="/">
                            <div className="middle">
                                <Image
                                    src="/images/hom.png"
                                    alt=""
                                    width={11}
                                    height={11}
                                    style={{ marginRight: "3px", height: "11px" }}
                                />{" "}
                                Anasayfa
                            </div>
                        </Link>
                        <div style={{ margin: "0 12px", fontWeight: "bold" }}>&bull;</div>
                        <div>
                            <Image
                                src="/images/hom.png"
                                alt=""
                                width={11}
                                height={11}
                                style={{ marginRight: "3px", height: "11px" }}
                            />{" "}
                            Garantili Villa Kiralama
                        </div>
                    </div>

                    {/* ── Title ── */}
                    <div style={{ marginTop: "16px", color: "#000" }}>
                        <div
                            className="middle"
                            style={{
                                fontSize: "calc(16px + 1.5vw)",
                                fontWeight: 600,
                            }}
                        >
                            Garantili Villa Kiralama
                        </div>

                        {/* ── Items ── */}
                        <div className="middle">
                            <div
                                className="row"
                                style={{
                                    color: "#444",
                                    width: "100%",
                                    maxWidth: "900px",
                                    marginTop: "24px",
                                }}
                            >
                                {/* 1 – Onaylanmış Villa Portföyü */}
                                <div style={{ width: "100%" }}>
                                    <div className="pitemsGaranti">
                                        <div className="pi1Garanti">Onaylanmış Villa Portföyü</div>
                                        <div
                                            style={{
                                                lineHeight: 1.6,
                                                marginTop: ".5rem",
                                                color: "#747579",
                                                fontWeight: 400,
                                                fontSize: "20px",
                                            }}
                                        >
                                            Websitemizde görüntülediğiniz tüm villalar, apartlar, bağ
                                            evi ve tatil evleri yerinde kontrol edilmiş ve
                                            onaylanmıştır.
                                            <br />
                                            Tüm sorularınız için haftanın her günü{" "}
                                            <Link href="/iletisim" style={{ fontWeight: 500 }}>
                                                ofisimize uğrayabilir
                                            </Link>
                                            ,{" "}
                                            <a
                                                style={{ fontWeight: 500 }}
                                                href="tel:+90 242 606 0725"
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                bizi arayabilir
                                            </a>
                                            ,{" "}
                                            <a
                                                style={{ fontWeight: 500 }}
                                                href="https://wa.me/905323990748"
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                WhatsApp
                                            </a>{" "}
                                            üzerinden ulaşabilir veya{" "}
                                            <Link href="/iletisim" style={{ fontWeight: 500 }}>
                                                canlı destek
                                            </Link>{" "}
                                            hattımıza bağlanabilirsiniz.
                                        </div>
                                    </div>
                                </div>

                                {/* 2 – TÜRSAB */}
                                <div style={{ width: "100%" }}>
                                    <div className="pitemsGaranti">
                                        <div className="pi1Garanti">
                                            Villa Tatilinde Türsab&apos;a Kayıtlı
                                        </div>
                                        <div className="middleft" style={{ marginTop: "24px" }}>
                                            <div className="middletp">
                                                <div>
                                                    <a
                                                        href="https://www.tursab.org.tr/pl/qr/AHTKE25120134462dc964be3dd2438b"
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        <div style={{ marginBottom: "8px" }}>
                                                            Belge No: 18069 <br /> PRAEDIUM GROUP TRAVEL
                                                            AGENCY
                                                        </div>
                                                    </a>
                                                    <div
                                                        className="pi2Garanti"
                                                        style={{ marginTop: "2px", color: "#747579" }}
                                                    >
                                                        <span style={{ fontWeight: 500 }}>
                                                            Villa Tatilinde
                                                        </span>{" "}
                                                        Kiralama Acentesi Praedium Group bünyesinde
                                                        türsab&apos;a kayıtlı lisanslı bir kiralama
                                                        firmasıdır.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 3 – ETBİS */}
                                <div style={{ width: "100%" }}>
                                    <div className="pitemsGaranti">
                                        <div className="pi1Garanti">
                                            Villa Tatilinde Etbis&apos;e Kayıtlı
                                        </div>
                                        <div className="middleft" style={{ marginTop: "24px" }}>
                                            <div className="middletp">
                                                <div>
                                                    <div
                                                        className="pi2Garanti"
                                                        style={{
                                                            marginTop: "-5px",
                                                            fontWeight: 500,
                                                            color: "#747579",
                                                        }}
                                                    >
                                                        Etbis Kayıt Doğrulama Linki :{" "}
                                                        <a
                                                            href="https://etbis.eticaret.gov.tr/sitedogrulama/5073561215243103"
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            style={{ color: "#3880ff" }}
                                                        >
                                                            etbis.gov.tr
                                                        </a>
                                                    </div>
                                                    <div
                                                        className="pi2Garanti"
                                                        style={{ marginTop: "2px", color: "#747579" }}
                                                    >
                                                        <span style={{ fontWeight: 500 }}>
                                                            Villa Tatilinde
                                                        </span>{" "}
                                                        Kiralama Acentesi Praedium Group bünyesinde
                                                        türsab&apos;a kayıtlı lisanslı bir kiralama
                                                        firmasıdır.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 4 – Profesyonel Destek Ekibi */}
                                <div style={{ width: "100%" }}>
                                    <div className="pitemsGaranti">
                                        <div className="pi1Garanti">Profesyonel Destek Ekibi</div>
                                        <div
                                            style={{
                                                lineHeight: 1.6,
                                                marginTop: ".4rem",
                                                color: "#747579",
                                                fontWeight: 400,
                                                fontSize: "20px",
                                            }}
                                        >
                                            Haftanın her günü 09:00 - 21:00 saatleri arasında tüm
                                            soru görüş öneri ve istekleriniz için bizlere ulaşabilir
                                            en kısa zamanda aklınıza takılan tüm sorulara cevap
                                            bulabilirsiniz.
                                        </div>
                                    </div>
                                </div>

                                {/* 5 – En Uygun Fiyat Garantisi */}
                                <div style={{ width: "100%", position: "relative" }}>
                                    <div className="pitemsGaranti">
                                        <div className="pi1Garanti">En Uygun Fiyat Garantisi</div>
                                        <div className="pi2Garanti">
                                            <div
                                                className="middleft"
                                                style={{ display: "inline-block" }}
                                            >
                                                <div className="ribbon-coming-soon23">
                                                    En Uygun Fiyat Garantisi
                                                </div>
                                            </div>{" "}
                                            bu işareti gördüğünüz tüm villalar için en uygun fiyat
                                            garantisi sunulmaktadır, daha uygun fiyat tespit
                                            edildiği durumda fiyat farkı iade edilir veya iadeniz
                                            aynı iş günü içinde gerçekleşir.
                                        </div>
                                    </div>
                                </div>

                                {/* 6 – Promosyon ve İndirimler */}
                                <div style={{ width: "100%" }}>
                                    <div className="pitemsGarantii">
                                        <div className="pi1Garanti">
                                            Sadece Villa Tatilinde&apos;ye Özel Promosyon ve
                                            İndirimler
                                        </div>
                                        <div className="pi2Garanti">
                                            Haftalık indirimler, özel indirim süreleri, son dakika
                                            indirimleri, promosyonlar, kısa süreli kiralamalar ve
                                            çok daha fazlası Villa Tatilinde.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Sub-Contact Cards ── */}
            <div className="paddingMobile">
                <div className="subContactC row">
                    <a href="tel:+90 242 606 0725" target="_blank" rel="noreferrer">
                        <div className="subContactInfo middle bhs">
                            <Image
                                src="/images/phone.png"
                                alt="Phone"
                                width={24}
                                height={24}
                                style={{ height: "24px" }}
                            />
                            <div style={{ marginLeft: "12px" }}>
                                <div>Villa Tatilinde Kalkan Ofis</div>
                                <div>+90 242 606 0725</div>
                            </div>
                        </div>
                    </a>
                    <a href="mailto:info@villatatilinde.com" target="_blank" rel="noreferrer">
                        <div className="subContactInfo middle bhs">
                            <Image
                                src="/images/mail.png"
                                alt="Email"
                                width={24}
                                height={24}
                                style={{ height: "24px", padding: "2px" }}
                            />
                            <div style={{ marginLeft: "12px" }}>
                                <div>Villa Tatilinde E-Posta</div>
                                <div>info@villatatilinde.com</div>
                            </div>
                        </div>
                    </a>
                    <Link href="/iletisim">
                        <div className="subContactInfo middle bhs">
                            <Image
                                src="/images/loc.png"
                                alt="Location"
                                width={24}
                                height={24}
                                style={{ height: "24px" }}
                            />
                            <div style={{ marginLeft: "12px" }}>
                                <div>Villa Tatilinde Kalkan Ofis</div>
                                <div>KALKAN MAH. ŞEHİTLER CAD. NO: 53 KAŞ(ANTALYA)</div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>



            {/* ── Mini Footer ── */}
            <div
                style={{
                    marginTop: "48px",
                    padding: "4px 1%",
                    borderTop: "1px solid #dfdfe3",
                }}
            >
                <div className="middleft smallFooterC">
                    <div className="smallFooterLeft1">
                        © 2025 Villa Tatilinde
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
