import type { Metadata } from "next";
import BloglarContent from "./BloglarContent";

export const metadata: Metadata = {
    title: "Blog - Villa Tatilinde | Villa Kiralama Rehberi",
    description:
        "Villa Tatilinde Blog sayfası. Villa kiralama, tatil rehberi, gezi yazıları ve daha fazlası hakkında güncel blog yazılarımızı keşfedin.",
    keywords: [
        "villa blog",
        "tatil rehberi",
        "villa kiralama blog",
        "kaş kalkan blog",
        "tatil yazıları",
    ],
};

export default function BloglarPage() {
    return <BloglarContent />;
}
