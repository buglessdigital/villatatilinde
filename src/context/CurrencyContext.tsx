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
                // Using exchangerate-api.com (free, 1500 requests / month)
                // Base currency: TRY – get all conversion rates from TRY
                const res = await fetch(
                    "https://open.er-api.com/v6/latest/TRY"
                );

                if (!res.ok) {
                    // Try alternative free API
                    const altRes = await fetch(
                        "https://api.exchangerate.host/latest?base=TRY&symbols=EUR,USD,GBP,RUB"
                    );
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
                        }
                    }
                    return;
                }

                const data = await res.json();

                if (!cancelled && data.rates) {
                    setRates({
                        TRY: 1,
                        EUR: data.rates.EUR || FALLBACK_RATES.EUR,
                        USD: data.rates.USD || FALLBACK_RATES.USD,
                        GBP: data.rates.GBP || FALLBACK_RATES.GBP,
                        RUB: data.rates.RUB || FALLBACK_RATES.RUB,
                    });
                }
            } catch {
                // Use fallback rates silently
                console.warn("Exchange rate API failed, using fallback rates.");
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
                return `₺${converted.toLocaleString("tr-TR")}`;
            }
            // For non-TRY, use standard formatting
            return `${currency.symbol}${converted.toLocaleString("tr-TR")}`;
        },
        [convertPrice, currency.code, currency.symbol]
    );

    const value = useMemo(
        () => ({
            currency,
            setCurrency,
            convertPrice,
            formatPrice,
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
