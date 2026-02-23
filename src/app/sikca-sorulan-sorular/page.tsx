import type { Metadata } from "next";
import SSSContent from "./SSSContent";

export const metadata: Metadata = {
    title: "Sıkça Sorulan Sorular - SSS | Villa Tatilinde",
    description:
        "Villa Tatilinde hakkında sıkça sorulan sorular ve cevapları. Villa kiralama, ödeme yöntemleri, iptal ve iade politikaları hakkında merak edilenler.",
    openGraph: {
        title: "Sıkça Sorulan Sorular - SSS | Villa Tatilinde",
        description:
            "Villa Tatilinde hakkında sıkça sorulan sorular ve cevapları.",
        type: "website",
        url: "https://villatatilinde.com/sikca-sorulan-sorular",
    },
};

export default function SSSPage() {
    return <SSSContent />;
}
