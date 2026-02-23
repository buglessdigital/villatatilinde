"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import DateRangePicker from "./DateRangePicker";

/* ─── Location Data ─── */
const LOCATIONS_LIST: Record<string, string> = {
    Hepsi: "Hepsi",
    kalkanAll: "Kalkan Tümü",
    kalkanMerkez: "Kalkan Merkez",
    kalkanKalamar: "Kalkan / Kalamar",
    kalkanKomurluk: "Kalkan Kömürlük",
    kalkanKisla: "Kalkan Kışla",
    kalkanOrtaalan: "Kalkan Ortaalan",
    kalkanKiziltas: "Kalkan Kızıltaş",
    kalkanKaputas: "Kalkan Kaputaş",
    kalkanPatara: "Kalkan Patara",
    kalkanOrdu: "Kalkan Ordu",
    kalkanUlugol: "Kalkan Ulugöl",
    kalkanKordere: "Kalkan Kördere",
    kalkanIslamlar: "Kalkan İslamlar",
    kalkanUzumlu: "Kalkan Üzümlü",
    kalkanBezirgan: "Kalkan Bezirgan",
    kalkanSaribelen: "Kalkan Sarıbelen",
    kalkanYesilkoy: "Kalkan Yeşilköy",
    kalkanCavdir: "Kalkan Çavdır",
    kasMerkez: "Kaş Merkez",
    fethiyeMerkez: "Fethiye",
    belekMerkez: "Belek",
};

/* Grouped for the dropdown display */
interface LocationGroup {
    header: string;
    key: string;
    bold?: boolean;
    children?: { key: string; label: string }[];
}

const LOCATION_GROUPS: LocationGroup[] = [
    { header: "Tüm Konumlar", key: "Hepsi", bold: true },
    {
        header: "Kalkan - Hepsi",
        key: "kalkanAll",
        bold: true,
        children: [
            { key: "kalkanMerkez", label: "Kalkan Merkez" },
            { key: "kalkanKalamar", label: "Kalkan / Kalamar" },
            { key: "kalkanKomurluk", label: "Kalkan / Kömürlük" },
            { key: "kalkanKisla", label: "Kalkan / Kışla" },
            { key: "kalkanOrtaalan", label: "Kalkan / Ortaalan" },
            { key: "kalkanKiziltas", label: "Kalkan / Kızıltaş" },
            { key: "kalkanKaputas", label: "Kalkan / Kaputaş" },
            { key: "kalkanPatara", label: "Kalkan / Patara" },
            { key: "kalkanOrdu", label: "Kalkan / Ordu" },
            { key: "kalkanUlugol", label: "Kalkan / Ulugöl" },
            { key: "kalkanKordere", label: "Kalkan / Kördere" },
            { key: "kalkanIslamlar", label: "Kalkan / İslamlar" },
            { key: "kalkanUzumlu", label: "Kalkan / Üzümlü" },
            { key: "kalkanBezirgan", label: "Kalkan / Bezirgan" },
            { key: "kalkanSaribelen", label: "Kalkan / Sarıbelen" },
            { key: "kalkanYesilkoy", label: "Kalkan / Yeşilköy" },
            { key: "kalkanCavdir", label: "Kalkan / Çavdır" },
        ],
    },
    {
        header: "",
        key: "__divider",
        children: [
            { key: "kasMerkez", label: "Kaş Merkez" },
            { key: "fethiyeMerkez", label: "Fethiye" },
            { key: "belekMerkez", label: "Belek" },
        ],
    },
];

interface SearchFilterBarProps {
    /** Initial location key (e.g. from URL params) */
    initialLocation?: string;
    /** Initial people count (e.g. from URL params) */
    initialPeople?: number;
    /** Whether to navigate on search or call onSearch callback */
    onSearch?: (params: { location: string; people: number }) => void;
}

export default function SearchFilterBar({
    initialLocation = "",
    initialPeople = 2,
    onSearch,
}: SearchFilterBarProps) {
    const router = useRouter();

    /* ─── Filter State ─── */
    const [toLocation, setToLocation] = useState(initialLocation);
    const [toAdult, setToAdult] = useState(initialPeople);
    const [drop1Open, setDrop1Open] = useState(false);
    const [toSearch, setToSearch] = useState(false);

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
        setToAdult((prev) => (prev > 0 ? prev - 1 : 0));
    }, []);

    const handleAdultPlus = useCallback(() => {
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
        if (toAdult > 0) {
            params.set("people", String(toAdult));
        }

        const qs = params.toString();
        router.push(`/sonuclar${qs ? `?${qs}` : ""}`);
    }, [toLocation, toAdult, router, onSearch]);

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
                            marginRight: 8,
                            padding: "2px 8px",
                            borderRadius: 12,
                            border: "1px solid #ddd",
                            fontSize: 15,
                            fontWeight: 600,
                        }}
                    >
                        <img
                            src="/images/wp.svg"
                            style={{ height: 16, marginRight: 4 }}
                            alt=""
                        />
                        +90 532 399 07 48
                    </div>
                </a>
                Aradığınız villayı bulmanıza yardımcı olabiliriz
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
                            {toLocation
                                ? LOCATIONS_LIST[toLocation] || "Konum Seçimi"
                                : "Konum Seçimi"}
                        </span>
                    </div>

                    {/* Location Dropdown */}
                    <div
                        ref={drop1Ref}
                        className={`heroDropdown${drop1Open ? " heroDropdownActive" : ""}`}
                        style={{ maxHeight: 400, overflowY: "auto" }}
                    >
                        <div style={{ paddingRight: 16 }}>
                            {LOCATION_GROUPS.map((group, gi) => (
                                <React.Fragment key={gi}>
                                    {/* Group header */}
                                    {group.key !== "__divider" && (
                                        <>
                                            <div
                                                onClick={() =>
                                                    handleLocationSelect(group.key)
                                                }
                                                className="bhbhbg middleft"
                                                style={{
                                                    padding: 12,
                                                    borderRadius: 8,
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        fontSize: 16,
                                                        fontWeight: group.bold ? 700 : 500,
                                                    }}
                                                >
                                                    {group.header}
                                                </div>
                                            </div>
                                            {gi === 0 && (
                                                <div
                                                    style={{
                                                        borderBottom: "1px solid #eee",
                                                        margin: "6px 12px",
                                                    }}
                                                />
                                            )}
                                        </>
                                    )}

                                    {/* Children */}
                                    {group.children && (
                                        <div
                                            style={{
                                                paddingLeft: group.key !== "__divider" ? 12 : 0,
                                            }}
                                        >
                                            {group.children.map((child) => (
                                                <div
                                                    key={child.key}
                                                    onClick={() =>
                                                        handleLocationSelect(child.key)
                                                    }
                                                    className="bhbhbg middleft"
                                                    style={{
                                                        padding: 12,
                                                        borderRadius: 8,
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            fontSize: 16,
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        {child.label}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Divider after Kalkan group */}
                                    {gi === 1 && (
                                        <div
                                            style={{
                                                borderBottom: "1px solid #eee",
                                                margin: "6px 12px",
                                            }}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── 2. Giriş - Çıkış ── */}
                <DateRangePicker />

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
