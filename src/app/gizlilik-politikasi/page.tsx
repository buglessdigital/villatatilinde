import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Gizlilik Politikası | Villa Tatilinde",
    description: "Villa Tatilinde gizlilik politikası hakkında detaylı bilgi.",
};

export default function GizlilikPolitikasiPage() {
    redirect("/politika/gizlilik-politikasi");
}
