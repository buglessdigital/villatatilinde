"use client";
import React, { useEffect, useRef, useState } from "react";

export default function MapPicker({ lat, lng, onChange }: { lat: string; lng: string; onChange: (lat: string, lng: string) => void }) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        // Load leaflet css
        if (!document.getElementById("leaflet-css")) {
            const link = document.createElement("link");
            link.id = "leaflet-css";
            link.rel = "stylesheet";
            link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
            document.head.appendChild(link);
        }

        // Load leaflet js
        if (!document.getElementById("leaflet-script")) {
            const script = document.createElement("script");
            script.id = "leaflet-script";
            script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
            script.async = true;
            script.onload = () => setLoaded(true);
            document.head.appendChild(script);
        } else {
            if ((window as any).L) {
                setLoaded(true);
            } else {
                document.getElementById("leaflet-script")?.addEventListener("load", () => setLoaded(true));
            }
        }
    }, []);

    useEffect(() => {
        if (!loaded || !mapRef.current) return;
        const L = (window as any).L;
        if (!L) return;

        // Default to Kalkan
        const defaultLat = 36.265;
        const defaultLng = 29.412;
        const initLat = parseFloat(lat) || defaultLat;
        const initLng = parseFloat(lng) || defaultLng;

        const map = L.map(mapRef.current).setView([initLat, initLng], 12);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        let marker: any = null;

        // Leaflet marker icons have issue with standard loading, need to set manually if issue occurs
        // But for unpkg it usually works. Let's provide fallback just in case
        delete (L.Icon.Default.prototype as any)._getIconUrl;

        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        if (parseFloat(lat) && parseFloat(lng)) {
            marker = L.marker([initLat, initLng]).addTo(map);
        }

        map.on('click', function(e: any) {
            const newLat = e.latlng.lat;
            const newLng = e.latlng.lng;
            if (marker) {
                marker.setLatLng(e.latlng);
            } else {
                marker = L.marker(e.latlng).addTo(map);
            }
            onChange(newLat.toString(), newLng.toString());
        });

        return () => {
            map.remove();
        };
    }, [loaded, lat, lng, onChange]);

    return (
        <div style={{ width: "100%", height: "400px", borderRadius: "8px", overflow: "hidden", border: "1px solid #cbd5e1" }}>
            {!loaded && <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", background: "#f1f5f9" }}>Harita Yükleniyor...</div>}
            <div ref={mapRef} style={{ width: "100%", height: "100%", display: loaded ? "block" : "none" }}></div>
            <div style={{ textAlign: "center", padding: "8px", fontSize: "12px", color: "#64748b", background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
                Harita üzerinde tıklayarak villa konumunu seçebilirsiniz. (Seçilen Koordinat: {lat || "-"}, {lng || "-"})
            </div>
        </div>
    );
}
