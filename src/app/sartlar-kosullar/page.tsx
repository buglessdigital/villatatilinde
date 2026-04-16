import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Şartlar ve Koşullar | Villa Tatilinde",
    description: "Villa Tatilinde şartlar ve koşullar hakkında detaylı bilgi.",
};

export default function SartlarKosullarPage() {
    redirect("/politika/sartlar-ve-kosullar");
}
