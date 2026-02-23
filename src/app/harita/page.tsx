import type { Metadata } from "next";
import HaritaContent from "./HaritaContent";

export const metadata: Metadata = {
    title: "Harita | Villa Tatilinde",
    description:
        "Villa Tatilinde harita üzerinde tatil villaları. Kalkan, Kaş ve Fethiye bölgelerindeki villaları harita üzerinde görüntüleyin.",
};

export default function HaritaPage() {
    return <HaritaContent />;
}
