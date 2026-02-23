"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

/* ── Sample FAQ Data ── */
const faqData = [
    {
        question: "Villa nasıl kiralanır?",
        answer: `<p>Villa kiralama süreci oldukça kolaydır. Sitemizde beğendiğiniz villayı seçtikten sonra, tarih ve kişi sayısı bilgilerini girerek müsaitlik kontrolü yapabilirsiniz. Uygun olan villayı bulduktan sonra <strong>rezervasyon isteği</strong> oluşturabilirsiniz.</p>
    <p style="margin-top:8px;">Rezervasyon isteğiniz ekibimiz tarafından en kısa sürede değerlendirilir ve size geri dönüş yapılır.</p>`,
    },
    {
        question: "Ödeme yöntemleri nelerdir?",
        answer: `<p>Visa, Mastercard, American Express ve Troy kartlarınızla güvenli bir şekilde ödeme yapabilirsiniz. Ayrıca <strong>taksit imkanı</strong> da sunulmaktadır.</p>
    <p style="margin-top:8px;">Tüm ödemeler iyzico güvencesi altında gerçekleştirilmektedir.</p>`,
    },
    {
        question: "İptal ve iade politikası nasıldır?",
        answer: `<p>İptal ve iade politikamız villa sahibinin belirlediği koşullara göre değişiklik gösterebilir. Genel olarak, giriş tarihinden <strong>30 gün öncesine</strong> kadar yapılan iptallerde tam iade sağlanmaktadır.</p>
    <p style="margin-top:8px;">Detaylı bilgi için <a href="/iptal-iade-politikalari" style="color:#50b0f0;text-decoration:underline;">İptal ve İade Politikası</a> sayfamızı ziyaret edebilirsiniz.</p>`,
    },
    {
        question: "Villa fiyatları neye göre belirlenir?",
        answer: `<p>Villa fiyatları; villanın konumu, kapasitesi, özellikleri, sezon dönemi ve konaklama süresine göre belirlenmektedir. <strong>Erken rezervasyon</strong> ve uzun süreli konaklama avantajlarından yararlanabilirsiniz.</p>`,
    },
    {
        question: "Villalarda temizlik ve hijyen nasıl sağlanıyor?",
        answer: `<p>Tüm villalarımız her misafir değişiminde profesyonel temizlik ekipleri tarafından <strong>titizlikle temizlenmektedir</strong>. Çarşaf, havlu ve temel temizlik malzemeleri villada hazır olarak sunulmaktadır.</p>`,
    },
    {
        question: "Özel havuzlu villa kiralayabilir miyim?",
        answer: `<p>Evet, portföyümüzde <strong>özel havuzlu</strong> birçok villa bulunmaktadır. Ayrıca havuzu korunaklı (dışarıdan görünmeyen) villalar, çocuk havuzlu villalar gibi özel kategorilerde de villa seçeneklerimiz mevcuttur.</p>`,
    },
    {
        question: "Rezervasyon onayı ne kadar sürede gelir?",
        answer: `<p>Rezervasyon isteğiniz ekibimiz tarafından genellikle <strong>2 saat içinde</strong> değerlendirilir ve size geri dönüş yapılır. Yoğun dönemlerde bu süre uzayabilir, ancak aynı gün içinde mutlaka dönüş sağlanmaktadır.</p>`,
    },
    {
        question: "Villa Tatilinde güvenilir mi?",
        answer: `<p>Villa Tatilinde, <strong>TÜRSAB Belge No: 18069</strong> ile tescilli, yasal güvencelere sahip profesyonel bir villa kiralama acentesidir. Tüm ödemeler iyzico güvencesi altında yapılmakta olup, villalarımız ekibimiz tarafından kontrol edilmektedir.</p>`,
    },
    {
        question: "Taksitle ödeme yapabilir miyim?",
        answer: `<p>Evet, birçok banka kartı ile <strong>taksitli ödeme</strong> imkanı sunmaktayız. Detaylı bilgi için <a href="/odeme-yontemleri" style="color:#50b0f0;text-decoration:underline;">Ödeme Yöntemleri</a> sayfamızı inceleyebilirsiniz.</p>`,
    },
    {
        question: "Check-in ve check-out saatleri nedir?",
        answer: `<p>Genel olarak check-in saati <strong>16:00</strong>, check-out saati ise <strong>10:00</strong>'dır. Ancak bu saatler villaya göre değişiklik gösterebilir. Detaylı bilgi villa sayfasında belirtilmektedir.</p>`,
    },
];

export default function SSSContent() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="sss-page">
            <div
                className="paddingMobile"
                style={{ marginTop: "calc(2vh + 2vw)" }}
            >
                <div className="sss-animate">
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
                            <div
                                style={{ margin: "0 12px", fontWeight: "bold" }}
                            >
                                &bull;
                            </div>
                            <div>
                                <Image
                                    src="/images/hom.png"
                                    width={11}
                                    height={11}
                                    alt="SSS"
                                    style={{ marginRight: 3, height: 11, width: "auto" }}
                                />{" "}
                                SSS
                            </div>
                        </div>

                        {/* ── Page Title ── */}
                        <h1 className="sss-main-title">
                            Sıkça Sorulan Sorular
                        </h1>

                        {/* ── FAQ Accordion List ── */}
                        <div className="middle sss-faq-container">
                            <div
                                style={{
                                    maxWidth: 900,
                                    width: "100%",
                                    marginTop: 32,
                                }}
                            >
                                <div className="sss-accordion-list">
                                    {faqData.map((faq, i) => (
                                        <div
                                            key={i}
                                            className={`sss-accordion-item ${openIndex === i ? "sss-accordion-open" : ""
                                                }`}
                                        >
                                            <button
                                                className="sss-accordion-header"
                                                onClick={() => toggleAccordion(i)}
                                                aria-expanded={openIndex === i}
                                                id={`faq-header-${i}`}
                                            >
                                                <div className="middleft">
                                                    <Image
                                                        src="/images/locs.png"
                                                        width={36}
                                                        height={36}
                                                        alt=""
                                                        className="sss-accordion-icon"
                                                    />
                                                    <div className="sss-accordion-question">
                                                        {faq.question}
                                                    </div>
                                                </div>
                                                <div
                                                    className={`sss-accordion-chevron ${openIndex === i
                                                            ? "sss-accordion-chevron-open"
                                                            : ""
                                                        }`}
                                                >
                                                    <svg
                                                        width="12"
                                                        height="12"
                                                        viewBox="0 0 12 12"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M2 4L6 8L10 4"
                                                            stroke="#999"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </div>
                                            </button>
                                            <div
                                                className="sss-accordion-content"
                                                role="region"
                                                aria-labelledby={`faq-header-${i}`}
                                            >
                                                <div
                                                    className="sss-accordion-body"
                                                    dangerouslySetInnerHTML={{
                                                        __html: faq.answer,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ── Contact CTA Section ── */}
                        <div className="middle sss-faq-container">
                            <div
                                style={{
                                    maxWidth: 900,
                                    width: "100%",
                                    marginTop: 32,
                                }}
                            >
                                <div className="sss-contact-cta">
                                    Diğer Sorularınız için, <br /> Bizimle İletişime
                                    Geçin
                                </div>
                                <div style={{ marginTop: 16 }}>
                                    <a
                                        href="https://wa.me/905323990748"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <div className="sss-contact-item bhs">
                                            <Image
                                                src="/images/cfo.svg"
                                                width={20}
                                                height={20}
                                                alt="WhatsApp"
                                                style={{ height: 20, width: "auto", marginRight: 12 }}
                                            />
                                            <span className="sss-contact-item-text">
                                                WhatsApp&apos;tan ulaşın
                                            </span>
                                        </div>
                                    </a>
                                    <Link href="/iletisim">
                                        <div
                                            className="sss-contact-item bhs"
                                            style={{ marginTop: 6 }}
                                        >
                                            <Image
                                                src="/images/cfo.svg"
                                                width={20}
                                                height={20}
                                                alt="Sohbet"
                                                style={{ height: 20, width: "auto", marginRight: 12 }}
                                            />
                                            <span className="sss-contact-item-text">
                                                Bir sohbet başlatın
                                            </span>
                                        </div>
                                    </Link>
                                    <a
                                        href="tel:+90 242 606 0725"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <div
                                            className="sss-contact-item bhs"
                                            style={{ marginTop: 6 }}
                                        >
                                            <Image
                                                src="/images/cfo.svg"
                                                width={20}
                                                height={20}
                                                alt="Arayın"
                                                style={{ height: 20, width: "auto", marginRight: 12 }}
                                            />
                                            <span className="sss-contact-item-text">
                                                Arayın
                                            </span>
                                        </div>
                                    </a>
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
                                        <span className="skiptranslate">
                                            Villa Tatilinde
                                        </span>{" "}
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
                                        <span className="skiptranslate">
                                            Villa Tatilinde
                                        </span>{" "}
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
                                        <span className="skiptranslate">
                                            Villa Tatilinde
                                        </span>{" "}
                                        Kalkan Ofis
                                    </div>
                                    <div>
                                        KALKAN MAH. ŞEHİTLER CAD. NO: 53
                                        KAŞ(ANTALYA)
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* ── Newsletter Subscription ── */}
                <div className="middle subsC">
                    <div style={{ textAlign: "center" }}>
                        <div
                            style={{
                                fontWeight: 300,
                                fontSize: 32,
                            }}
                        >
                            <span className="skiptranslate">
                                Villa Tatilinde
                            </span>{" "}
                            Aylık Mail Aboneliği
                        </div>
                        <div
                            style={{
                                fontSize: 16,
                                marginTop: 16,
                                opacity: 0.8,
                            }}
                        >
                            En yeni villalar güncel promosyonlar indirimli
                            villalar ve çok daha fazlası
                        </div>
                        <div
                            className="middleft"
                            style={{ marginTop: 32 }}
                        >
                            <input
                                className="subsInput"
                                placeholder="E-postanızı yazın"
                                type="email"
                            />
                            <div className="subsBtn bhs middle">
                                ABONE OL
                            </div>
                        </div>
                        <div
                            style={{
                                fontSize: 14,
                                marginTop: 4,
                                opacity: 0.7,
                            }}
                        >
                            Abone olarak,{" "}
                            <Link href="/sartlar-kosullar">
                                <span
                                    style={{ textDecoration: "underline" }}
                                >
                                    şartlar ve koşulları
                                </span>
                            </Link>{" "}
                            kabul etmiş ve{" "}
                            <Link href="/gizlilik-politikasi">
                                <span
                                    style={{ textDecoration: "underline" }}
                                >
                                    gizlilik politikamızı
                                </span>
                            </Link>{" "}
                            onaylamış olursunuz.
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Mini Footer ── */}
            <div
                style={{
                    marginTop: 48,
                    padding: "4px 1%",
                    borderTop: "1px solid #dfdfe3",
                }}
            >
                <div className="middleft smallFooterC">
                    <div className="smallFooterLeft1">
                        &copy; 2026{" "}
                        <span className="skiptranslate">
                            Villa Tatilinde
                        </span>
                        <br />
                        Belge No: 18069 - PRAEDIUM GROUP TRAVEL AGENCY
                    </div>
                    <div className="smallFooterRight1">
                        <Link href="/sartlar-kosullar">
                            Koşullar ve Şartlar
                        </Link>
                    </div>
                    <div className="smallFooterRight2">
                        <Link href="/gizlilik-politikasi">
                            Gizlilik
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
