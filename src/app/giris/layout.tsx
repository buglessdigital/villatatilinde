import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Giriş Yap - Villa Tatilinde",
    description:
        "Villa Tatilinde hesabınıza giriş yapın veya kaydolun. Telefon numaranız ile güvenli giriş yapabilirsiniz.",
};

export default function GirisLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
