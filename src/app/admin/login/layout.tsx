import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Giriş - Villa Tatilinde",
    description: "Villa Tatilinde admin paneli giriş sayfası",
};

export default function AdminLoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
