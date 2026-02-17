import type { Metadata } from "next";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const formattedName = slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    return {
        title: `${formattedName} - Villa Tatilinde`,
        description: `${formattedName} detayları, fiyatları, özellikleri ve rezervasyon bilgileri. Villa Tatilinde ile hayalinizdeki tatili keşfedin.`,
    };
}

export default function VillaDetailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
