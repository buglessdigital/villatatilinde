"use client";
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import type { ReactNode } from "react";

/* ─── Types ─── */
export type CurrencyCode = "TRY" | "EUR" | "GBP" | "USD" | "RUB";

export interface CurrencyInfo {
    code: CurrencyCode;
    symbol: string;
    label: string;
}

interface ExchangeRates {
    [key: string]: number; // e.g. { EUR: 0.027, USD: 0.029, GBP: 0.023, RUB: 2.5, TRY: 1 }
}

interface CurrencyContextType {
    currency: CurrencyInfo;
    setCurrency: (code: CurrencyCode) => void;
    convertPrice: (tryAmount: number) => number;
    formatPrice: (tryAmount: number) => string;
    // Villa'nın kendi para birimi (GBP, EUR vs.) ile saklanan fiyatı doğru gösterir
    formatVillaCurrencyPrice: (amount: number, villaCurrency?: string) => string;
    rates: ExchangeRates;
    loading: boolean;
}

/* ─── Constants ─── */
export const CURRENCIES: CurrencyInfo[] = [
    { code: "TRY", symbol: "₺", label: "TRY" },
    { code: "EUR", symbol: "€", label: "EUR" },
    { code: "GBP", symbol: "£", label: "GBP" },
    { code: "USD", symbol: "$", label: "USD" },
    { code: "RUB", symbol: "₽", label: "RUB" },
];

const DEFAULT_CURRENCY: CurrencyInfo = CURRENCIES[0]; // TRY

/* ─── Fallback rates (approx) – used if the API call fails ─── */
const FALLBACK_RATES: ExchangeRates = {
    TRY: 1,
    EUR: 0.0256,
    USD: 0.0274,
    GBP: 0.0218,
    RUB: 2.43,
};

/* ─── Context ─── */
const CurrencyContext = createContext<CurrencyContextType | null>(null);

/* ─── Provider ─── */
export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currency, setCurrencyState] = useState<CurrencyInfo>(DEFAULT_CURRENCY);
    const [rates, setRates] = useState<ExchangeRates>(FALLBACK_RATES);
    const [loading, setLoading] = useState(true);

    // Fetch exchange rates on mount
    useEffect(() => {
        let cancelled = false;

        async function fetchRates() {
            try {
                // Primary: Highly reliable CDN-based currency API
                const res = await fetch(
                    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/try.json"
                );

                if (res.ok) {
                    const data = await res.json();
                    if (!cancelled && data.try) {
                        setRates({
                            TRY: 1,
                            EUR: data.try.eur || FALLBACK_RATES.EUR,
                            USD: data.try.usd || FALLBACK_RATES.USD,
                            GBP: data.try.gbp || FALLBACK_RATES.GBP,
                            RUB: data.try.rub || FALLBACK_RATES.RUB,
                        });
                        return;
                    }
                }

                // Secondary Fallback: open.er-api.com
                const altRes = await fetch("https://open.er-api.com/v6/latest/TRY");
                if (altRes.ok) {
                    const altData = await altRes.json();
                    if (!cancelled && altData.rates) {
                        setRates({
                            TRY: 1,
                            EUR: altData.rates.EUR || FALLBACK_RATES.EUR,
                            USD: altData.rates.USD || FALLBACK_RATES.USD,
                            GBP: altData.rates.GBP || FALLBACK_RATES.GBP,
                            RUB: altData.rates.RUB || FALLBACK_RATES.RUB,
                        });
                        return;
                    }
                }

                throw new Error("Tüm kur API'leri yanıt vermedi.");
            } catch (error) {
                // Use fallback rates silently
                console.warn("Exchange rate API failed, using fallback rates:", error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchRates();
        return () => { cancelled = true; };
    }, []);

    // Currency setter
    const setCurrency = useCallback((code: CurrencyCode) => {
        const found = CURRENCIES.find((c) => c.code === code);
        if (found) {
            setCurrencyState(found);
        }
    }, []);

    // Convert a TRY amount to the current currency
    const convertPrice = useCallback(
        (tryAmount: number): number => {
            if (currency.code === "TRY") return tryAmount;
            const rate = rates[currency.code] || 1;
            return Math.round(tryAmount * rate);
        },
        [currency.code, rates]
    );

    // Format a TRY amount in the current currency with symbol
    const formatPrice = useCallback(
        (tryAmount: number): string => {
            const converted = convertPrice(tryAmount);
            if (currency.code === "TRY") {
                return `₺${Math.round(converted).toLocaleString("tr-TR", { maximumFractionDigits: 0 })}`;
            }
            return `${currency.symbol}${Math.round(converted).toLocaleString("tr-TR", { maximumFractionDigits: 0 })}`;
        },
        [convertPrice, currency.code, currency.symbol]
    );

    // Villa'nın kendi para biriminde (GBP, EUR, USD vs.) saklanan fiyatı
    // kullanıcının seçtiği dövize doğru şekilde çevirir.
    // Mantık: villa_para_birimi → TRY → kullanıcı_para_birimi
    const SYMBOLS: Record<string, string> = { TRY: "₺", GBP: "£", EUR: "€", USD: "$", RUB: "₽" };
    const formatVillaCurrencyPrice = useCallback(
        (amount: number, villaCurrency?: string): string => {
            const vCurr = (villaCurrency || "TRY").toUpperCase();
            const targetCode = currency.code;

            // Aynı para birimi ise dönüşüm gerekmez, sayıyı direkt göster
            if (vCurr === targetCode) {
                return `${SYMBOLS[vCurr] || vCurr + " "}${Math.round(amount).toLocaleString("tr-TR", { maximumFractionDigits: 0 })}`;
            }

            // Adım 1: Villa fiyatını TRY'ye çevir
            // rates["GBP"] = "1 TRY kaç GBP yapar" yani ~0.02
            // £400'ü TRY'ye çevirmek için: 400 / 0.02 = 20.000 TRY
            const toTRY = vCurr === "TRY" ? amount : amount / (rates[vCurr] || 1);

            // Adım 2: TRY'yi kullanıcının seçtiği dövize çevir
            const converted = targetCode === "TRY"
                ? Math.round(toTRY)
                : Math.round(toTRY * (rates[targetCode] || 1));

            return `${currency.symbol}${converted.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}`;
        },
        [currency.code, currency.symbol, rates]
    );

    const value = useMemo(
        () => ({
            currency,
            setCurrency,
            convertPrice,
            formatPrice,
            formatVillaCurrencyPrice,
            rates,
            loading,
        }),
        [currency, setCurrency, convertPrice, formatPrice, rates, loading]
    );

    return (
        <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
    );
}

/* ─── Hook ─── */
export function useCurrency(): CurrencyContextType {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error("useCurrency must be used within a CurrencyProvider");
    }
    return context;
}
