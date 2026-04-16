import { Metadata } from "next";
import PromosyonlarContent from "./PromosyonlarContent";

export const metadata: Metadata = {
    title: "Promosyonlar - Villa Tatilinde",
    description:
        "Villa Tatilinde promosyonları, restaurant indirimleri, tekne turu indirimleri ve indirimli villalar. En uygun fiyat garantisiyle tatil fırsatları.",
};

export default function PromosyonlarPage() {
    return <PromosyonlarContent />;
}
