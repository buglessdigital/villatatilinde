"use client";

import { useEffect, useState } from "react";

// Politika versiyonu — politika değiştiğinde bu değeri güncelle
const POLICY_VERSION = "v1.01";
const CONSENT_KEY = "cookie_consent";
const POLICY_KEY = "cookie_policy_version";
const CONSENT_DATE_KEY = "cookie_consent_date";
// 6 ay sonra yenileme (milisaniye)
const RENEWAL_MS = 6 * 30 * 24 * 60 * 60 * 1000;

function shouldShowBanner(): boolean {
  if (typeof window === "undefined") return false;

  const consent = localStorage.getItem(CONSENT_KEY);
  const savedVersion = localStorage.getItem(POLICY_KEY);
  const consentDate = localStorage.getItem(CONSENT_DATE_KEY);

  // 1. Hiç tercih kaydedilmemiş (ilk ziyaret veya çerez temizleme)
  if (!consent) return true;

  // 2. Politika versiyonu değişmiş
  if (savedVersion !== POLICY_VERSION) return true;

  // 3. 6 aydan fazla geçmiş
  if (consentDate) {
    const elapsed = Date.now() - parseInt(consentDate, 10);
    if (elapsed > RENEWAL_MS) return true;
  }

  return false;
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (shouldShowBanner()) {
      setTimeout(() => setVisible(true), 600);
    }
  }, []);

  const saveConsent = (accepted: boolean) => {
    localStorage.setItem(CONSENT_KEY, accepted ? "accepted" : "rejected");
    localStorage.setItem(POLICY_KEY, POLICY_VERSION);
    localStorage.setItem(CONSENT_DATE_KEY, Date.now().toString());
    setVisible(false);
  };

  if (!mounted || !visible) return null;

  return (
    <>
      <style>{`
        @keyframes cookieFadeUp {
          from { opacity: 0; transform: translateX(-50%) translateY(16px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        .ck-wrap {
          position: fixed;
          bottom: 88px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          width: calc(100% - 24px);
          max-width: 560px;
          background: #ffffff;
          border: 1px solid #ede8e0;
          border-radius: 14px;
          box-shadow:
            0 4px 6px rgba(0,0,0,0.04),
            0 12px 40px rgba(0,0,0,0.10);
          padding: 18px 20px 16px;
          font-family: 'DM Sans', sans-serif;
          animation: cookieFadeUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards;
        }

        @media (min-width: 768px) {
          .ck-wrap {
            bottom: 28px;
            max-width: 560px;
          }

          @keyframes cookieFadeUp {
            from { opacity: 0; transform: translateX(-50%) translateY(12px); }
            to   { opacity: 1; transform: translateX(-50%) translateY(0); }
          }
        }

        /* İnce üst şerit — site aksanı */
        .ck-wrap::before {
          content: '';
          display: block;
          height: 3px;
          background: linear-gradient(90deg, #e87c3e, #f0a05a);
          border-radius: 12px 12px 0 0;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
        }

        .ck-title {
          font-size: 13px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 5px;
          letter-spacing: 0.01em;
          text-transform: uppercase;
        }

        .ck-text {
          font-size: 12.5px;
          color: #5a5a5a;
          line-height: 1.55;
          margin: 0;
        }

        .ck-text a {
          color: #e87c3e;
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: opacity 0.15s;
        }

        .ck-text a:hover { opacity: 0.75; }

        .ck-actions {
          display: flex;
          gap: 8px;
          margin-top: 14px;
        }

        .ck-btn {
          flex: 1;
          padding: 9px 14px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          border: none;
          transition: opacity 0.15s, transform 0.1s;
          letter-spacing: 0.01em;
        }

        .ck-btn:active { transform: scale(0.97); }

        .ck-btn--accept {
          background: linear-gradient(135deg, #e87c3e, #f0a05a);
          color: #ffffff;
        }

        .ck-btn--accept:hover { opacity: 0.88; }

        .ck-btn--reject {
          background: #f5f1ec;
          color: #4a4a4a;
          border: 1px solid #e8e0d6;
        }

        .ck-btn--reject:hover { background: #ece6df; }
      `}</style>

      <div className="ck-wrap" role="dialog" aria-label="Çerez Bildirimi">
        <p className="ck-title">Çerez Kullanımı</p>
        <p className="ck-text">
          Sitemizde deneyiminizi iyileştirmek ve kişiselleştirilmiş içerik sunmak
          için çerezler kullanıyoruz.{" "}
          <a href="/politika/privacy" target="_blank" rel="noopener noreferrer">
            Gizlilik Politikası
          </a>
          &apos;nı inceleyebilirsiniz.
        </p>
        <div className="ck-actions">
          <button
            className="ck-btn ck-btn--reject"
            onClick={() => saveConsent(false)}
            aria-label="Çerezleri Reddet"
          >
            Reddet
          </button>
          <button
            className="ck-btn ck-btn--accept"
            onClick={() => saveConsent(true)}
            aria-label="Çerezleri Kabul Et"
          >
            Kabul Et
          </button>
        </div>
      </div>
    </>
  );
}
