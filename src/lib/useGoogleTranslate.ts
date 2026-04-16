"use client";

/**
 * Google Translate integration — mirrors the reference Vue.js project exactly.
 *
 * How it works:
 * 1. A hidden <div id="google_translate_element"> is rendered in the DOM.
 * 2. The Google Translate script is loaded once, which populates that div
 *    with a hidden <select> element listing the available languages.
 * 3. When the user picks a language from the custom dropdown in the Navbar,
 *    we find the correct <option> inside the hidden <select> and dispatch
 *    a "change" event, which tells the Google Translate runtime to translate
 *    the page.
 * 4. The selected language is persisted via the `googtrans` cookie so that
 *    it survives page reloads.
 */

/* ── Label maps used to find the right <option> regardless of the
      Google Translate UI's own current language ── */
const LANG_LABELS: Record<string, string[]> = {
    ar: ["عربي", "Arabic", "Arapça", "Arabisch", "арабский"],
    en: ["إنجليزي", "English", "İngilizce", "Englisch", "Английский"],
    de: ["الألمانية", "German", "Almanca", "Deutsch", "немецкий"],
    ru: ["الروسية", "Russian", "Rusça", "Russisch", "Русский"],
    tr: ["تركي", "Turkish", "Türkçe", "Türkisch", "турецкий"],
};

/* ── Cookie helpers ── */
function getCookie(cname: string): string {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1);
        if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
    }
    return "";
}

function setCookie(cname: string, cvalue: string, exdays: number) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    const expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function checkDoubleCookie(name: string): number {
    const nameEq = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(";");
    let count = 0;
    for (let i = 0; i < cookies.length; i++) {
        if (cookies[i].includes(nameEq)) count += 1;
    }
    return count;
}

/* ── Detect initial language from cookie ── */
export function getInitialLanguageFromCookie(): string {
    if (typeof document === "undefined") return "tr";
    const ck = getCookie("googtrans");
    if (ck) {
        const lang = ck.split("/").pop();
        if (lang && ["ar", "en", "de", "ru", "tr"].includes(lang)) return lang;
    }
    return "tr";
}

/* ── Global flags (singleton pattern — persisted across re-renders) ── */
let scriptLoaded = false;
let scriptLoading = false;
let changeLock = false;

/**
 * Load the Google Translate script and initialise the widget inside
 * #google_translate_element. Resolves once the widget is ready.
 */
function loadGoogleTranslateScript(): Promise<void> {
    return new Promise((resolve) => {
        if (scriptLoaded) {
            resolve();
            return;
        }

        if (scriptLoading) {
            // Already loading — poll until ready
            const poll = setInterval(() => {
                if (scriptLoaded) {
                    clearInterval(poll);
                    resolve();
                }
            }, 100);
            return;
        }

        scriptLoading = true;

        // Expose the init callback on window so the script can call it
        (window as any).googleTranslateElementInit = () => {
            const google = (window as any).google;
            if (google && google.translate && google.translate.TranslateElement) {
                new google.translate.TranslateElement(
                    {
                        pageLanguage: "tr",
                        includedLanguages: "ar,en,de,ru,tr",
                        layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL,
                        autoDisplay: false,
                    },
                    "google_translate_element"
                );

                // The widget takes a moment to populate the <select>
                const waitForSelect = setInterval(() => {
                    const sel = document.querySelector(
                        "#google_translate_element select"
                    ) as HTMLSelectElement | null;
                    if (sel && sel.options.length > 0) {
                        clearInterval(waitForSelect);
                        scriptLoaded = true;
                        scriptLoading = false;
                        resolve();
                    }
                }, 100);
            }
        };

        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src =
            "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        document.head.appendChild(script);
    });
}

/**
 * Change the page language via Google Translate.
 * This is the main function called from the Navbar.
 */
export async function changeLanguage(langCode: string): Promise<void> {
    if (changeLock) return;
    changeLock = true;

    try {
        // Set the cookie first so Google Translate picks up the right language
        // even on first-ever load.
        document.cookie = "googtrans=/tr/" + langCode;

        // Handle double-cookie edge case
        const ckDouble = checkDoubleCookie("googtrans");
        if (ckDouble >= 2) {
            setCookie("googtrans", "/tr/" + langCode, -10);
            document.cookie = "googtrans=/tr/" + langCode;
        }

        // Ensure the script is loaded
        await loadGoogleTranslateScript();

        const sel = document.querySelector(
            "#google_translate_element select"
        ) as HTMLSelectElement | null;

        if (!sel) {
            changeLock = false;
            return;
        }

        const labels = LANG_LABELS[langCode];
        if (!labels) {
            changeLock = false;
            return;
        }

        // Iterate through <option>s to find the matching language
        for (let i = 0; i < sel.options.length; i++) {
            const optLabel = sel.options[i].label || sel.options[i].text;
            if (labels.some((l) => optLabel === l)) {
                sel.selectedIndex = i;
                sel.dispatchEvent(new Event("change"));
                break;
            }
        }
    } finally {
        setTimeout(() => {
            changeLock = false;
        }, 200);
    }
}

/**
 * Auto-initialise translation on page load if a non-Turkish language
 * was previously selected (restores the saved `googtrans` cookie).
 * Mirrors the reference project's `mounted()` behaviour.
 */
export async function initializeTranslation(): Promise<void> {
    if (typeof document === "undefined") return;

    const ck = getCookie("googtrans");
    if (!ck) return;

    const lang = ck.split("/").pop();
    if (!lang || lang === "tr" || !["ar", "en", "de", "ru"].includes(lang)) return;

    // Handle double‑cookie edge case (same as reference project)
    const ckDouble = checkDoubleCookie("googtrans");
    if (ckDouble >= 2) {
        setCookie("googtrans", "/tr/" + lang, -10);
    }

    // Load script & apply the stored language
    try {
        await loadGoogleTranslateScript();

        // Small delay to let Google Translate initialise fully
        await new Promise((r) => setTimeout(r, 500));

        const sel = document.querySelector(
            "#google_translate_element select"
        ) as HTMLSelectElement | null;

        if (!sel) return;

        const labels = LANG_LABELS[lang];
        if (!labels) return;

        for (let i = 0; i < sel.options.length; i++) {
            const optLabel = sel.options[i].label || sel.options[i].text;
            if (labels.some((l) => optLabel === l)) {
                sel.selectedIndex = i;
                sel.dispatchEvent(new Event("change"));
                break;
            }
        }
    } catch (err) {
        console.error("Failed to initialise translation:", err);
    }
}
