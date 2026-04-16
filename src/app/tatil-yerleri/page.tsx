import { Metadata } from "next";
import TatilYerleriContent from "./TatilYerleriContent";

export const metadata: Metadata = {
    title: "Tatil Yerleri - Villa Tatilinde",
    description:
        "Türkiye'nin en güzel tatil bölgelerinde kiralık villa seçenekleri. Kalkan, Kaş, Fethiye, Belek ve daha fazlası. Villa Tatilinde ile hayalinizdeki tatili keşfedin.",
};

export default function TatilYerleriPage() {
    return <TatilYerleriContent />;
}
