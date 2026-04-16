import { supabase } from "@/lib/supabase";
import type { Metadata } from "next";
import PolicyContent from "./PolicyContent";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const { data } = await supabase
        .from("policies")
        .select("title")
        .eq("slug", slug)
        .single();

    const title = data?.title || "Politika";

    return {
        title: `${title} | Villa Tatilinde`,
        description: `Villa Tatilinde ${title.toLowerCase()} hakkında detaylı bilgi.`,
        openGraph: {
            title: `${title} | Villa Tatilinde`,
            description: `Villa Tatilinde ${title.toLowerCase()} hakkında detaylı bilgi.`,
            type: "website",
            url: `https://villatatilinde.com/politika/${slug}`,
        },
    };
}

export default async function PolicyPage({ params }: Props) {
    const { slug } = await params;
    return <PolicyContent slug={slug} />;
}
