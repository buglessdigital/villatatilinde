import type { Metadata } from "next";
import IptalIadeContent from "./IptalIadeContent";

export const metadata: Metadata = {
    title: "İptal ve İade Politikası | Villa Tatilinde",
    description:
        "Villa Tatilinde iptal ve iade politikası. Rezervasyon iptal koşulları, iade süreçleri ve depozito politikası hakkında detaylı bilgi.",
    openGraph: {
        title: "İptal ve İade Politikası | Villa Tatilinde",
        description:
            "Villa Tatilinde iptal ve iade politikası hakkında detaylı bilgi.",
        type: "website",
        url: "https://villatatilinde.com/iptal-iade-politikalari",
    },
};

export default function IptalIadePage() {
    return <IptalIadeContent />;
}
