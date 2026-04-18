"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface ContactMedia {
    gallery_images: string[];
    video_url: string;
    video_poster_url: string;
}

const defaultMedia: ContactMedia = {
    gallery_images: [
        "/images/ofis21.jpeg",
        "/images/light2.jpeg",
        "/images/ofis23.jpeg",
        "/images/ofis28.jpg",
        "/images/ofis30.jpg",
        "/images/ofis29.jpg",
    ],
    video_url: "/images/ovid.mp4",
    video_poster_url: "/images/bgimage.jpeg",
};

export default function IletisimContent() {
    // ── Form state ──
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        message: "",
    });
    const [formAgree, setFormAgree] = useState(false);
    const [sentForm, setSentForm] = useState(false);
    const [sendingForm, setSendingForm] = useState(false);
    const [redoMail, setRedoMail] = useState(false);
    const [redoCheck, setRedoCheck] = useState(false);

    // ── KVKK Modal state ──
    const [formModal, setFormModal] = useState(false);

    // ── Contact media from Supabase ──
    const [media, setMedia] = useState<ContactMedia>(defaultMedia);

    useEffect(() => {
        async function loadMedia() {
            const { data } = await supabase
                .from("site_settings")
                .select("value")
                .eq("key", "contact_media")
                .single();
            if (data?.value) {
                try {
                    const parsed = typeof data.value === "string" ? JSON.parse(data.value) : data.value;
                    setMedia({
                        gallery_images: parsed.gallery_images || defaultMedia.gallery_images,
                        video_url: parsed.video_url || defaultMedia.video_url,
                        video_poster_url: parsed.video_poster_url || defaultMedia.video_poster_url,
                    });
                } catch { /* use defaults */ }
            }
        }
        loadMedia();
    }, []);

    // ── Email validation ──
    const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

    // ── Send message handler ──
    const sendMes = useCallback(() => {
        if (formAgree) {
            if (validateEmail(formData.email)) {
                setRedoMail(false);
                if (formData.message.length > 2) {
                    setSendingForm(true);
                    // Simulate sending (implement actual API call here)
                    setTimeout(() => {
                        setSendingForm(false);
                        setSentForm(true);
                    }, 1500);
                }
            } else {
                setRedoMail(true);
                setTimeout(() => {
                    setRedoMail(false);
                    setTimeout(() => {
                        setRedoMail(true);
                    }, 200);
                }, 200);
            }
        } else {
            setRedoCheck(true);
            setTimeout(() => {
                setRedoCheck(false);
                setTimeout(() => {
                    setRedoCheck(true);
                }, 200);
            }, 200);
        }
    }, [formAgree, formData]);

    // ── KVKK Modal opener ──
    const formModaler = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setFormModal(true);
    };

    return (
        <div className="iletisim-page">
            <div className="paddingMobile" style={{ color: "#0b0a12", paddingBottom: 12, paddingTop: 48 }}>
                {/* ── Page Title ── */}
                <div style={{ textAlign: "left" }}>
                    <h1 className="iletisim-main-title">
                        Bize Ulaşın
                    </h1>
                    <p className="dm-sans iletisim-main-desc">
                        Tüm sorularınız için profesyonel ekibimiz ile sizlere yardımcı olmaktan memnuniyet duyarız.
                        Tüm soru ve rezervasyon talepleriniz için haftanın her günü 09:30 - 22:30 arasında bize
                        ulaşabilirsiniz.
                    </p>
                </div>

                {/* ── Contact Cards Row ── */}
                <div className="row iletisim-cards-row">
                    {/* Card 1 – Bizi Arayın */}
                    <div className="cntc1">
                        <Image
                            src="/images/sup.png"
                            alt="Destek"
                            width={56}
                            height={56}
                            style={{
                                borderRadius: "50%",
                                padding: 12,
                                marginRight: 12,
                                background: "#17a2b81a",
                            }}
                        />
                        <div className="iletisim-card-title">Bizi Arayın</div>
                        <div className="dm-sans iletisim-card-subtitle">
                            Haftanın her günü 09:30 - 22:30
                        </div>
                        <div className="middle dm-sans iletisim-card-buttons">
                            <a
                                href="https://wa.me/905323990748"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ marginRight: 12 }}
                            >
                                <div className="bhs middle iletisim-wa-btn">
                                    <Image
                                        src="/images/wp.svg"
                                        alt="WhatsApp"
                                        width={18}
                                        height={18}
                                        style={{ marginRight: 6 }}
                                    />
                                    WhatsApp Üzerinden
                                </div>
                            </a>
                            <a href="tel:+90 242 606 0725" target="_blank" rel="noopener noreferrer">
                                <div className="bhs middle iletisim-phone-btn">
                                    <Image
                                        src="/images/phonesolid.svg"
                                        alt="Telefon"
                                        width={12}
                                        height={12}
                                        style={{ marginRight: 6, marginTop: 1.5 }}
                                    />
                                    +90 242 606 0725
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Card 2 – E-Posta Gönderin */}
                    <div className="cntc2">
                        <div className="middle">
                            <div className="middle iletisim-icon-circle iletisim-icon-email">
                                <Image
                                    src="/images/enveloperegular.svg"
                                    alt="E-Posta"
                                    width={25}
                                    height={25}
                                />
                            </div>
                        </div>
                        <div className="iletisim-card-title" style={{ fontSize: 21 }}>
                            E-Posta Gönderin
                        </div>
                        <div className="dm-sans" style={{ marginTop: 8, color: "#747579" }}>
                            En geç 1 iş günü içinde cevap verilir
                        </div>
                        <div className="middle dm-sans" style={{ marginTop: 16, fontSize: 18, fontWeight: 600 }}>
                            <a href="mailto:info@villatatilinde.com" target="_blank" rel="noopener noreferrer">
                                <div className="bhs middle skiptranslate" style={{ color: "#000" }}>
                                    info@villatatilinde.com
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Card 3 – Sosyal Medya */}
                    <div className="cntc3">
                        <div className="middle">
                            <div className="middle iletisim-icon-circle iletisim-icon-social">
                                <Image
                                    src="/images/hashtagsolid.svg"
                                    alt="Sosyal Medya"
                                    width={25}
                                    height={25}
                                />
                            </div>
                        </div>
                        <div className="iletisim-card-title" style={{ fontSize: 21, marginTop: 8 }}>
                            Sosyal Medya
                        </div>
                        <div className="dm-sans" style={{ marginTop: 8, color: "#747579" }}>
                            Sosyal medya hesaplarımızdan bizi takip etmeyi unutmayın!
                        </div>
                        <div className="middle dm-sans" style={{ marginTop: 16, fontSize: 13, fontWeight: 600 }}>
                            <a href="https://instagram.com/villatatilinde" target="_blank" rel="noopener noreferrer">
                                <Image
                                    className="bhs"
                                    src="/images/instagram-color.svg"
                                    alt="Instagram"
                                    width={24}
                                    height={24}
                                />
                            </a>
                            <a
                                href="https://www.facebook.com/share/17PKGdZK2x/?mibextid=wwXIfr"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ marginLeft: 20 }}
                            >
                                <Image
                                    className="bhs"
                                    src="/images/facebook-color.svg"
                                    alt="Facebook"
                                    width={24}
                                    height={24}
                                />
                            </a>
                        </div>
                    </div>
                </div>

                {/* ── Office Image + Contact Form Row ── */}
                <div className="row" style={{ marginTop: 78 }}>
                    <div className="cntc21">
                        <Image
                            src={media.gallery_images[0]}
                            alt="Villa Tatilinde Ofis"
                            width={800}
                            height={600}
                            loading="lazy"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: 16,
                            }}
                        />
                    </div>
                    <div className="cntc22">
                        {/* ── Form Sent Success ── */}
                        {sentForm && (
                            <div className="middle iletisim-sent-success">
                                <div>
                                    <Image
                                        src="/images/checkBub.png"
                                        alt="Başarılı"
                                        width={64}
                                        height={64}
                                        style={{ marginLeft: 8 }}
                                    />
                                    <div className="middle" style={{ fontSize: 20, marginTop: 16 }}>
                                        Mesajınız Gönderildi
                                    </div>
                                    <div style={{ marginTop: 16, fontWeight: 400 }}>
                                        Bizimle İletişime Geçtiğiniz İçin Teşekkürler
                                    </div>
                                    <div style={{ marginTop: 16, fontWeight: 400 }}>
                                        En kısa zamanda {formData.email}&apos;a e-posta ile cevap verilecektir
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Contact Form ── */}
                        {!sentForm && (
                            <div className="sendMes">
                                <div>
                                    <div className="iletisim-form-title">Mesaj Gönderin</div>

                                    {/* İsim + Soyad */}
                                    <div className="middle" style={{ marginTop: 32 }}>
                                        <div className="mesName">
                                            <div className="dm-sans iletisim-field-label">İsim</div>
                                            <div className="iletisim-input-wrap">
                                                <input
                                                    type="text"
                                                    className="iletisim-input"
                                                    placeholder="İsminiz"
                                                    value={formData.name}
                                                    onChange={(e) =>
                                                        setFormData((p) => ({ ...p, name: e.target.value }))
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div style={{ flexGrow: 1 }}>
                                            <div className="dm-sans iletisim-field-label">Soyad</div>
                                            <div className="iletisim-input-wrap">
                                                <input
                                                    type="text"
                                                    className="iletisim-input"
                                                    placeholder="Soyadınız"
                                                    value={formData.surname}
                                                    onChange={(e) =>
                                                        setFormData((p) => ({ ...p, surname: e.target.value }))
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div style={{ marginTop: 32 }}>
                                        <div style={{ flexGrow: 1 }}>
                                            <div className="dm-sans iletisim-field-label">Email</div>
                                            <div
                                                className={`iletisim-input-wrap${redoMail ? " iletisim-redo-mail" : ""}`}
                                            >
                                                <input
                                                    type="email"
                                                    className="iletisim-input"
                                                    placeholder="E-mail"
                                                    value={formData.email}
                                                    onChange={(e) =>
                                                        setFormData((p) => ({ ...p, email: e.target.value }))
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mesaj */}
                                    <div style={{ marginTop: 32 }}>
                                        <div style={{ flexGrow: 1 }}>
                                            <div className="dm-sans iletisim-field-label">Mesaj</div>
                                            <div className="iletisim-input-wrap">
                                                <textarea
                                                    className="iletisim-textarea"
                                                    placeholder="Mesajınız"
                                                    rows={4}
                                                    value={formData.message}
                                                    onChange={(e) =>
                                                        setFormData((p) => ({ ...p, message: e.target.value }))
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* KVKK Checkbox */}
                                    <div
                                        className={`middle iletisim-kvkk-row${redoCheck && !formAgree ? " iletisim-redo-check" : ""
                                            }`}
                                        style={{ marginTop: 16 }}
                                    >
                                        <label className="iletisim-checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={formAgree}
                                                onChange={(e) => setFormAgree(e.target.checked)}
                                                className="iletisim-checkbox"
                                            />
                                            <span style={{ textAlign: "left", whiteSpace: "normal" }}>
                                                <span
                                                    className="iletisim-kvkk-link"
                                                    onClick={formModaler}
                                                >
                                                    Kişisel verilerin korunma kanunu
                                                </span>{" "}
                                                okudum ve kabul ediyorum
                                            </span>
                                        </label>
                                    </div>

                                    {/* Gönder Button */}
                                    <div className="middle" style={{ marginTop: 20 }}>
                                        <div
                                            className={`middle bhs iletisim-send-btn${sendingForm ? " iletisim-loading" : ""
                                                }`}
                                            onClick={sendMes}
                                        >
                                            {sendingForm ? "Gönderiliyor..." : "Gönder"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Office Gallery Row ── */}
                <div className="row" style={{ marginTop: 78 }}>
                    <div className="or1">
                        <Image
                            src={media.gallery_images[1]}
                            alt="Villa Tatilinde Ofis"
                            width={800}
                            height={500}
                            loading="lazy"
                            style={{ display: "block", height: "100%", width: "100%", objectFit: "cover" }}
                        />
                    </div>
                    <div className="or2">
                        <Image
                            src={media.gallery_images[2]}
                            alt="Villa Tatilinde Ofis"
                            width={400}
                            height={250}
                            loading="lazy"
                            style={{ display: "block", height: "50%", width: "100%", objectFit: "cover" }}
                        />
                        <Image
                            src={media.gallery_images[3]}
                            alt="Villa Tatilinde Ofis"
                            width={400}
                            height={250}
                            loading="lazy"
                            style={{ display: "block", height: "50%", width: "100%", objectFit: "cover" }}
                        />
                    </div>
                    <div className="or2">
                        <Image
                            src={media.gallery_images[4]}
                            alt="Villa Tatilinde Ofis"
                            width={400}
                            height={250}
                            loading="lazy"
                            style={{ display: "block", height: "50%", width: "100%", objectFit: "cover" }}
                        />
                        <Image
                            src={media.gallery_images[5]}
                            alt="Villa Tatilinde Ofis"
                            width={400}
                            height={250}
                            loading="lazy"
                            style={{ display: "block", height: "50%", width: "100%", objectFit: "cover" }}
                        />
                    </div>
                </div>

                {/* ── Video + Map Section ── */}
                <div>
                    <h2 className="iletisim-section-title" style={{ marginTop: 78 }}>
                        Videomuz
                    </h2>
                    <div className="row" style={{ marginTop: 12 }}>
                        <div className="cntc31">
                            <div style={{ marginRight: 12, textAlign: "left", width: "100%" }}>
                                <div className="middleft">
                                    <video
                                        poster={media.video_poster_url}
                                        controlsList="nodownload"
                                        controls
                                        preload="none"
                                        playsInline
                                        muted
                                        loop
                                        style={{
                                            background: "#eee",
                                            borderRadius: 8,
                                            margin: 0,
                                            display: "inline-block",
                                            height: 350,
                                            width: "100%",
                                        }}
                                    >
                                        <source src={media.video_url} type="video/mp4" />
                                        Your browser does not support HTML video.
                                    </video>
                                </div>
                                <div className="officeTextUn">Kalkan Ofis</div>
                                <div className="dm-sans officeAddress">
                                    KALKAN MAH. ŞEHİTLER CAD. NO: 53 KAŞ(ANTALYA)
                                </div>
                            </div>
                        </div>
                        <div className="cntc32">
                            <iframe
                                className="iletisim-map-iframe"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3216.927588850738!2d29.415370300000003!3d36.2655369!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c02dba3bad4697%3A0x554e9829dbdc235d!2sVilla%20Tatilinde!5e0!3m2!1sen!2str!4v1753197478944!5m2!1sen!2str"
                                width="100%"
                                style={{ height: 350, border: 0, borderRadius: 8 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Villa Tatilinde Harita"
                            />
                        </div>
                    </div>
                </div>

                {/* ── Yol Tarifi Section ── */}
                <div className="roadMap">
                    <div style={{ marginBottom: 12 }}>Yol Tarifi</div>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3216.927588850738!2d29.415370300000003!3d36.2655369!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c02dba3bad4697%3A0x554e9829dbdc235d!2sVilla%20Tatilinde!5e0!3m2!1sen!2str!4v1753197478944!5m2!1sen!2str"
                        width="100%"
                        style={{ height: 320, border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Villa Tatilinde Yol Tarifi"
                    />
                </div>
            </div>

            {/* ── KVKK Modal Overlay ── */}
            {formModal && (
                <div
                    className="iletisim-modal-overlay"
                    onClick={() => setFormModal(false)}
                />
            )}

            {/* ── KVKK Modal ── */}
            {formModal && (
                <div className="iletisim-modal">
                    <div className="iletisim-modal-inner">
                        <div className="bhs iletisim-modal-close" onClick={() => setFormModal(false)}>
                            Kapat
                        </div>
                        <div className="dm-sans iletisim-modal-body">
                            <h3 style={{ marginBottom: 16 }}>Kişisel Verilerin Korunması Kanunu (KVKK)</h3>
                            <p>
                                6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca, kişisel verileriniz
                                Villa Tatilinde tarafından aşağıda açıklanan kapsamda işlenebilecektir.
                            </p>
                            <br />
                            <p>
                                Kişisel verileriniz, hizmetlerimizin sunulması, talebinizin değerlendirilmesi ve
                                sizinle iletişime geçilmesi amacıyla işlenmektedir. Verileriniz üçüncü kişilerle
                                paylaşılmamaktadır.
                            </p>
                            <br />
                            <p>
                                KVKK&apos;nın 11. maddesi gereğince, kişisel verilerinize ilişkin haklarınızı
                                kullanmak için info@villatatilinde.com adresine başvurabilirsiniz.
                            </p>
                        </div>
                    </div>
                    <div className="dm-sans iletisim-modal-footer">
                        <div className="middleft">
                            <a className="middleft bhs" href="https://wa.me/905323990748" target="_blank" rel="noopener noreferrer">
                                <Image
                                    src="/images/wp.svg"
                                    alt="WhatsApp"
                                    width={13}
                                    height={13}
                                    style={{ marginRight: 5 }}
                                />
                                WhatsApp Destek için tıklayın
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
