import type { Metadata } from "next";
import SonuclarContent from "./SonuclarContent";

export const metadata: Metadata = {
    title: "Arama Sonuçları | Villa Tatilinde",
    description:
        "Arama kriterlerinize uygun kiralık villaları görüntüleyin. Konum, fiyat, kapasite ve özelliklere göre filtreleyerek hayalinizdeki villayı bulun.",
};

export default function SonuclarPage() {
    return <SonuclarContent />;
}
