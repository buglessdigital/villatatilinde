"use client";
import React, { useEffect, useRef, useState } from "react";

export default function YandexMapView({ lat, lng, title }: { lat: number, lng: number, title?: string }) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [loaded, setLoaded] = useState(false);
    const mapInstance = useRef<any>(null);

    useEffect(() => {
        if (!document.getElementById("yandex-map-script")) {
            const script = document.createElement("script");
            script.id = "yandex-map-script";
            script.src = "https://api-maps.yandex.ru/2.1/?lang=tr_TR";
            script.async = true;
            script.onload = () => {
                if ((window as any).ymaps) {
                    (window as any).ymaps.ready(() => setLoaded(true));
                }
            };
            document.head.appendChild(script);
        } else {
            if ((window as any).ymaps) {
                (window as any).ymaps.ready(() => setLoaded(true));
            } else {
                document.getElementById("yandex-map-script")?.addEventListener("load", () => {
                    if ((window as any).ymaps) {
                        (window as any).ymaps.ready(() => setLoaded(true));
                    }
                });
            }
        }
    }, []);

    useEffect(() => {
        if (!loaded || !mapRef.current) return;
        const ymaps = (window as any).ymaps;
        if (!ymaps) return;

        if (mapRef.current.innerHTML !== "") {
            mapRef.current.innerHTML = "";
        }

        const map = new ymaps.Map(mapRef.current, {
            center: [lat, lng],
            zoom: 13,
            controls: ['zoomControl', 'fullscreenControl']
        });
        
        mapInstance.current = map;

        let placemark = new ymaps.Placemark([lat, lng], {
            iconCaption: title || ''
        }, {
            preset: 'islands#blueIcon'
        });
        
        map.geoObjects.add(placemark);

        return () => {
            if (mapInstance.current) {
                mapInstance.current.destroy();
                mapInstance.current = null;
            }
        };
    }, [loaded, lat, lng, title]);

    return (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
            {!loaded && <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", background: "#f1f5f9" }}>Harita Yükleniyor...</div>}
            <div ref={mapRef} style={{ width: "100%", height: "100%", display: loaded ? "block" : "none" }}></div>
        </div>
    );
}
