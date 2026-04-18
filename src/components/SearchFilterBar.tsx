"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import DateRangePicker from "./DateRangePicker";

import { supabase } from "@/lib/supabase";

function toDateStr(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

interface SearchFilterBarProps {
    /** Initial location key (e.g. from URL params) */
    initialLocation?: string;
    /** Initial people count (e.g. from URL params) */
    initialPeople?: number;
    /** Initial check-in date (YYYY-MM-DD) */
    initialCheckIn?: string;
    /** Initial check-out date (YYYY-MM-DD) */
    initialCheckOut?: string;
    /** Initial search term */
    initialSearch?: string;
    /** Whether to navigate on search or call onSearch callback */
    onSearch?: (params: { location: string; people: number }) => void;
}

export default function SearchFilterBar({
    initialLocation = "",
    initialPeople = 2,
    initialCheckIn,
    initialCheckOut,
    initialSearch = "",
    onSearch,
}: SearchFilterBarProps) {
    const router = useRouter();

    /* ─── Filter State ─── */
    const [toLocation, setToLocation] = useState(initialLocation);
    const [toAdult, setToAdult] = useState(initialPeople);
    const [drop1Open, setDrop1Open] = useState(false);
    const [toSearch, setToSearch] = useState(false);
    const [villaSearch, setVillaSearch] = useState(initialSearch);
    const [adultsChanged, setAdultsChanged] = useState(initialPeople !== 2);
    const [searchCheckIn, setSearchCheckIn] = useState<Date | null>(() => {
        if (!initialCheckIn) return null;
        const [y, m, d] = initialCheckIn.split("-").map(Number);
        return new Date(y, m - 1, d);
    });
    const [searchCheckOut, setSearchCheckOut] = useState<Date | null>(() => {
        if (!initialCheckOut) return null;
        const [y, m, d] = initialCheckOut.split("-").map(Number);
        return new Date(y, m - 1, d);
    });

    useEffect(() => {
        setToLocation(initialLocation);
    }, [initialLocation]);

    useEffect(() => {
        setToAdult(initialPeople);
    }, [initialPeople]);

    useEffect(() => {
        if (initialCheckIn) {
            const [y, m, d] = initialCheckIn.split("-").map(Number);
            setSearchCheckIn(new Date(y, m - 1, d));
        } else {
            setSearchCheckIn(null);
        }
    }, [initialCheckIn]);

    useEffect(() => {
        if (initialCheckOut) {
            const [y, m, d] = initialCheckOut.split("-").map(Number);
            setSearchCheckOut(new Date(y, m - 1, d));
        } else {
            setSearchCheckOut(null);
        }
    }, [initialCheckOut]);

    const [dbLocations, setDbLocations] = useState<{key: string, label: string}[]>([]);

    useEffect(() => {
        supabase.from("destinations").select("name, filter_param").eq("is_active", true).order("sort_order")
            .then(({ data }) => {
                if (data) {
                    setDbLocations(data.map(d => ({ key: d.filter_param, label: d.name })));
                }
            });
    }, []);

    /* ─── Refs ─── */
    const drop1Ref = useRef<HTMLDivElement>(null);
    const drop1BtnRef = useRef<HTMLDivElement>(null);

    /* ─── Click outside to close dropdown ─── */
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                drop1Ref.current &&
                !drop1Ref.current.contains(e.target as Node) &&
                drop1BtnRef.current &&
                !drop1BtnRef.current.contains(e.target as Node)
            ) {
                setDrop1Open(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /* ─── Handlers ─── */
    const handleLocationSelect = useCallback((loc: string) => {
        setToLocation(loc);
        setDrop1Open(false);
    }, []);

    const handleAdultMinus = useCallback(() => {
        setAdultsChanged(true);
        setToAdult((prev) => (prev > 0 ? prev - 1 : 0));
    }, []);

    const handleAdultPlus = useCallback(() => {
        setAdultsChanged(true);
        setToAdult((prev) => (prev < 30 ? prev + 1 : 30));
    }, []);

    const handleSearch = useCallback(() => {
        setToSearch(true);
        setTimeout(() => setToSearch(false), 600);

        if (onSearch) {
            onSearch({ location: toLocation, people: toAdult });
            return;
        }

        const params = new URLSearchParams();
        if (toLocation && toLocation !== "Hepsi") {
            params.set("location", toLocation);
        }
        if (adultsChanged && toAdult > 0) {
            params.set("people", String(toAdult));
        }
        if (villaSearch.trim()) {
            params.set("search", villaSearch.trim());
        }
        if (searchCheckIn && searchCheckOut) {
            params.set("checkIn", toDateStr(searchCheckIn));
            params.set("checkOut", toDateStr(searchCheckOut));
        }

        const qs = params.toString();
        router.push(`/sonuclar${qs ? `?${qs}` : ""}`);
    }, [toLocation, toAdult, adultsChanged, villaSearch, searchCheckIn, searchCheckOut, router, onSearch]);

    return (
        <div
            style={{
                borderRadius: 16,
                padding: "16px 50px 24px 32px",
                background: "#fff",
                width: "94%",
                marginTop: 32,
                boxShadow: "0 0 40px rgba(29, 58, 83, .1)",
            }}
        >
            {/* WhatsApp help line */}
            <div
                className="middleft"
                style={{
                    fontWeight: 500,
                    color: "#747579",
                    fontSize: 14,
                }}
            >
                <a
                    className="middle"
                    href="https://wa.me/905323990748"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <div
                        className="bhs middle"
                        style={{
                            marginRight: 12,
                            padding: "4px 12px",
                            borderRadius: 16,
                            border: "1px solid #d1d1d5",
                            fontSize: 15,
                            fontWeight: 600,
                        }}
                    >
                        <img
                            src="/images/wp.svg"
                            style={{ height: 18, marginRight: 6 }}
                            alt=""
                        />
                        +90 532 399 07 48
                    </div>
                </a>
                <div style={{ position: "relative", marginLeft: 8 }}>
                    <input
                        type="text"
                        placeholder="Villa ismi ile arayın"
                        value={villaSearch}
                        onChange={(e) => setVillaSearch(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                        style={{
                            background: "#fff",
                            height: 36,
                            paddingBottom: 2,
                            paddingLeft: 16,
                            paddingRight: 40,
                            fontWeight: 500,
                            width: 260,
                            border: "1px solid #c4c4c8",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                            borderRadius: 32,
                            fontSize: 15,
                            outline: "none",
                            fontFamily: "'DM Sans', serif",
                            transition: "all 0.2s ease",
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = "#B5682C";
                            e.target.style.boxShadow = "0 2px 12px rgba(181, 104, 44, 0.2)";
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = "#c4c4c8";
                            e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                        }}
                    />
                    <button
                        onClick={handleSearch}
                        style={{
                            position: "absolute",
                            right: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <img src="/images/search3.png" style={{ height: 16, opacity: 0.8 }} alt="Search" />
                    </button>
                </div>
            </div>

            {/* ─── Three Filter Columns ─── */}
            <div
                className="middleft"
                style={{
                    position: "relative",
                    justifyContent: "space-between",
                    marginTop: 12,
                }}
            >
                {/* ── 1. Konum ── */}
                <div
                    style={{
                        width: "32%",
                        position: "relative",
                        background:
                            "linear-gradient(45deg, rgb(158, 83, 32) 20%, rgb(30, 144, 255) 100%)",
                        padding: 16,
                        borderRadius: 16,
                    }}
                >
                    <div
                        className="middleft"
                        style={{ color: "#ffffff", fontWeight: 600 }}
                    >
                        <img
                            src="/images/pn.png"
                            style={{
                                filter: "invert(100%)",
                                marginLeft: 2,
                                opacity: 1,
                                marginRight: 8,
                                height: 18,
                            }}
                            alt=""
                        />
                        Konum
                    </div>

                    {/* Konum Selector Button */}
                    <div
                        ref={drop1BtnRef}
                        onClick={() => setDrop1Open((p) => !p)}
                        className="bhbhbg dm-sans"
                        style={{
                            marginTop: 8,
                            height: 48,
                            padding: 12,
                            width: "100%",
                            borderRadius: 8,
                            background: "#fff",
                            cursor: "pointer",
                        }}
                    >
                        <span
                            style={{
                                color: "#747579cc",
                                fontSize: 19,
                                fontWeight: 500,
                            }}
                        >
                            {toLocation === "Hepsi" || !toLocation
                                ? "Konum Seçimi"
                                : dbLocations.find((l) => l.key === toLocation)?.label || "Konum Seçimi"}
                        </span>
                    </div>

                    {/* Location Dropdown */}
                    <div
                        ref={drop1Ref}
                        className={`heroDropdown${drop1Open ? " heroDropdownActive" : ""}`}
                        style={{ maxHeight: 400, overflowY: "auto" }}
                    >
                        <div style={{ paddingRight: 16 }}>
                            <div
                                onClick={() => handleLocationSelect("Hepsi")}
                                className="bhbhbg middleft"
                                style={{ padding: 12, borderRadius: 8 }}
                            >
                                <div style={{ fontSize: 16, fontWeight: 700 }}>Tüm Konumlar</div>
                            </div>
                            <div style={{ borderBottom: "1px solid #eee", margin: "6px 12px" }} />
                            <div style={{ paddingLeft: 12 }}>
                                {dbLocations.map((loc) => (
                                    <div
                                        key={loc.key}
                                        onClick={() => handleLocationSelect(loc.key)}
                                        className="bhbhbg middleft"
                                        style={{ padding: 12, borderRadius: 8 }}
                                    >
                                        <div style={{ fontSize: 16, fontWeight: 500 }}>{loc.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── 2. Giriş - Çıkış ── */}
                <DateRangePicker
                    initialCheckIn={initialCheckIn}
                    initialCheckOut={initialCheckOut}
                    onDateChange={(start, end) => { setSearchCheckIn(start); setSearchCheckOut(end); }}
                />

                {/* ── 3. Kişi Sayısı ── */}
                <div
                    style={{
                        width: "32%",
                        position: "relative",
                        background:
                            "linear-gradient(45deg, rgb(158, 83, 32) 20%, rgb(30, 144, 255) 100%)",
                        padding: 16,
                        borderRadius: 16,
                    }}
                >
                    <div
                        className="middleft"
                        style={{ color: "#fff", fontWeight: 600 }}
                    >
                        <img
                            src="/images/userregular.svg"
                            style={{
                                filter: "invert(100%)",
                                marginLeft: 2,
                                opacity: 0.4,
                                marginRight: 8,
                                height: 15,
                            }}
                            alt=""
                        />
                        Kişi Sayısı{" "}
                        <div
                            className="bhs"
                            style={{ marginBottom: 4, marginLeft: 8 }}
                            title="0 - 3 Yaş arası kişi sayısına dahil değildir."
                        >
                            <img
                                src="/images/question.svg"
                                style={{
                                    verticalAlign: "middle",
                                    height: 16,
                                    width: 16,
                                    borderRadius: "50%",
                                    background: "#ddd",
                                    padding: 3,
                                }}
                                alt=""
                            />
                        </div>
                    </div>
                    <div>
                        <div
                            className="middle"
                            style={{
                                background: "#fff",
                                padding: "11.5px 10px",
                                borderRadius: 8,
                                marginTop: 7,
                            }}
                        >
                            <div
                                className="dm-sans"
                                style={{
                                    color: "#747579cc",
                                    fontSize: 19,
                                    fontWeight: 500,
                                }}
                            >
                                Kişi Sayısı
                            </div>

                            {/* Minus */}
                            <div
                                onClick={handleAdultMinus}
                                className="bhs middle"
                                style={{
                                    fontSize: 20,
                                    border: "1px solid #dfdfe3aa",
                                    marginLeft: "auto",
                                    borderRadius: "50%",
                                    width: 28,
                                    height: 28,
                                    cursor: "pointer",
                                    userSelect: "none",
                                }}
                            >
                                &minus;
                            </div>

                            {/* Count or "Tümü" */}
                            {toAdult > 0 ? (
                                <div
                                    className="middle"
                                    style={{
                                        marginLeft: 4,
                                        borderRadius: "50%",
                                        width: 28,
                                        height: 28,
                                        fontSize: 19,
                                    }}
                                >
                                    {toAdult}
                                </div>
                            ) : (
                                <div
                                    className="middle"
                                    style={{
                                        marginLeft: 4,
                                        borderRadius: "50%",
                                        width: 38,
                                        height: 28,
                                        fontSize: 13,
                                    }}
                                >
                                    Tümü
                                </div>
                            )}

                            {/* Plus */}
                            <div
                                onClick={handleAdultPlus}
                                className="bhs middle"
                                style={{
                                    fontSize: 20,
                                    border: "1px solid #dfdfe3aa",
                                    marginLeft: 4,
                                    borderRadius: "50%",
                                    width: 28,
                                    height: 28,
                                    cursor: "pointer",
                                    userSelect: "none",
                                }}
                            >
                                &#43;
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Search Button ── */}
                <div
                    onClick={handleSearch}
                    className="middle bhIntense"
                    style={{
                        position: "absolute",
                        marginTop: -30,
                        right: -78,
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        background: "#B5682C",
                        cursor: "pointer",
                    }}
                >
                    <img
                        className={toSearch ? "boing" : ""}
                        src="/images/magw.svg"
                        style={{ height: 24 }}
                        alt="Ara"
                    />
                </div>
            </div>
        </div>
    );
}
