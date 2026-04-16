import { supabase } from "@/lib/supabase";
import type { Metadata } from "next";
import PolicyContent from "../politika/[slug]/PolicyContent";

export async function generateMetadata(): Promise<Metadata> {
    const slug = "kvkk-aydinlatma-metni";
    const { data } = await supabase
        .from("policies")
        .select("title")
        .eq("slug", slug)
        .single();

    const title = data?.title || "KVKK Aydınlatma Metni";

    return {
        title: `${title} | Villa Tatilinde`,
        description: `Villa Tatilinde ${title.toLowerCase()} hakkında detaylı bilgi.`,
    };
}

export default function KvkkAydinlatmaMetniPage() {
    return <PolicyContent slug="kvkk-aydinlatma-metni" />;
}
