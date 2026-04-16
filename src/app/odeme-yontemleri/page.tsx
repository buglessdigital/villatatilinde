import type { Metadata } from "next";
import OdemeYontemleriContent from "./OdemeYontemleriContent";

export const metadata: Metadata = {
    title: "Ödeme Yöntemleri - Taksit Seçenekleri | Villa Tatilinde",
    description:
        "Villa Tatilinde ödeme yöntemleri ve taksit seçenekleri. Kredi kartı, banka kartı, nakit ve EFT ile güvenli ödeme imkanları. Tüm kredi kartlarına 12 taksit fırsatı.",
    openGraph: {
        title: "Ödeme Yöntemleri - Taksit Seçenekleri | Villa Tatilinde",
        description:
            "Villa Tatilinde ödeme yöntemleri ve taksit seçenekleri hakkında detaylı bilgi.",
        type: "website",
        url: "https://villatatilinde.com/odeme-yontemleri",
    },
};

export default function OdemeYontemleriPage() {
    return <OdemeYontemleriContent />;
}
