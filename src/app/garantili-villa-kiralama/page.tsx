import type { Metadata } from "next";
import GarantiliVillaContent from "./GarantiliVillaContent";

export const metadata: Metadata = {
    title: "Garantili Villa Kiralama | Villa Tatilinde",
    description:
        "Villa Tatilinde garantili villa kiralama hizmeti. Onaylanmış villa portföyü, TÜRSAB ve ETBİS kayıtlı, profesyonel destek ekibi ve en uygun fiyat garantisi.",
    keywords: [
        "garantili villa kiralama",
        "güvenli villa kiralama",
        "tursab kayıtlı",
        "etbis kayıtlı",
        "lisanslı kiralama",
    ],
};

export default function GarantiliVillaKiralamaPage() {
    return <GarantiliVillaContent />;
}
