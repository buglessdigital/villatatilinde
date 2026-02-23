import type { Metadata } from "next";
import NasilKiralanirContent from "./NasilKiralanirContent";

export const metadata: Metadata = {
    title: "Nasıl Kiralanır - Villa Kiralama Rehberi | Villa Tatilinde",
    description:
        "Villa nasıl kiralanır, nelere dikkat edilmelidir? Villa kiralama yöntemleri, ödeme süreçleri ve dikkat edilmesi gereken ayrıntılar hakkında kapsamlı rehber.",
    openGraph: {
        title: "Nasıl Kiralanır - Villa Kiralama Rehberi | Villa Tatilinde",
        description:
            "Villa nasıl kiralanır, nelere dikkat edilmelidir? Kapsamlı villa kiralama rehberi.",
        type: "website",
        url: "https://villatatilinde.com/nasil-kiralanir",
    },
};

export default function NasilKiralanirPage() {
    return <NasilKiralanirContent />;
}
