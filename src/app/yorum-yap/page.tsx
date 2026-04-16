import { Metadata } from "next";
import YorumYapContent from "./YorumYapContent";

export const metadata: Metadata = {
    title: "Yorum Yap - Villa Tatilinde",
    description: "Konakladığınız villa hakkındaki deneyimlerinizi paylaşın.",
};

export default function YorumYapPage() {
    return <YorumYapContent />;
}
