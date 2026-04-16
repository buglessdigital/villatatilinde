import { Metadata } from "next";
import IletisimContent from "./IletisimContent";

export const metadata: Metadata = {
    title: "İletişim - Villa Tatilinde",
    description:
        "Villa Tatilinde ile iletişime geçin. Tüm soru ve rezervasyon talepleriniz için haftanın her günü 09:30 - 22:30 arasında bize ulaşabilirsiniz. Telefon, WhatsApp, e-posta ve sosyal medya ile bize ulaşın.",
    openGraph: {
        title: "İletişim - Villa Tatilinde",
        description:
            "Villa Tatilinde ile iletişime geçin. Tüm soru ve rezervasyon talepleriniz için haftanın her günü 09:30 - 22:30 arasında bize ulaşabilirsiniz.",
        type: "website",
    },
};

export default function IletisimPage() {
    return <IletisimContent />;
}
