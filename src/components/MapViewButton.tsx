import Link from "next/link";

export default function MapViewButton() {
    return (
        <div className="middle" style={{ marginTop: 12 }}>
            <Link href="/harita" style={{ textDecoration: "none" }}>
                <div className="middle mapViewBtn">
                    <img
                        src="/images/map.svg"
                        style={{ height: 13, marginRight: 4, filter: "brightness(0) invert(1)" }}
                        alt=""
                    />
                    Harita Görünümü
                </div>
            </Link>
        </div>
    );
}
