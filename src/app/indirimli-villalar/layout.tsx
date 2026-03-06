import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "İndirimli Villalar | Villa Tatilinde",
    description:
        "İndirim içeren villalar listesi. Villa Tatilinde tarafından sunulan özel indirimli villalar.",
};

export default function IndirimliVillalarLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
