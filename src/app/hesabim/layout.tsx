import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Hesabım | Villa Tatilinde",
    description: "Hesabım sayfası - Villa Tatilinde. Profil bilgilerinizi güncelleyin, beğendiğiniz villaları görüntüleyin ve hesap ayarlarınızı yönetin.",
};

export default function HesabimLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
