import { supabase } from "@/lib/supabase";
import type { Metadata } from "next";
import PolicyContent from "../politika/[slug]/PolicyContent";

export async function generateMetadata(): Promise<Metadata> {
    const slug = "mesafeli-satis-sozlesmesi";
    const { data } = await supabase
        .from("policies")
        .select("title")
        .eq("slug", slug)
        .single();

    const title = data?.title || "Mesafeli Satış Sözleşmesi";

    return {
        title: `${title} | Villa Tatilinde`,
        description: `Villa Tatilinde ${title.toLowerCase()} hakkında detaylı bilgi.`,
    };
}

export default function MesafeliSatisSozlesmesiPage() {
    return <PolicyContent slug="mesafeli-satis-sozlesmesi" />;
}
