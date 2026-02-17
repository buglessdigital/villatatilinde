import { Metadata } from "next";
import KategorilerContent from "./KategorilerContent";

export const metadata: Metadata = {
    title: "Villa Kategorileri - Villa Tatilinde",
    description:
        "Villa Tatili için Çeşitli Villa Kategorileri Listesi. Ekonomik, muhafazakar, balayı, ultralüks, deniz manzaralı ve daha fazla villa kategorisi.",
};

export default function KategorilerPage() {
    return <KategorilerContent />;
}
