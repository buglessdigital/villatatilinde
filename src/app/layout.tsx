import type { Metadata } from "next";
import "./globals.css";
import SiteShell from "@/components/SiteShell";
import { CurrencyProvider } from "@/context/CurrencyContext";

export const metadata: Metadata = {
  title: "Villa Tatilinde",
  description:
    "Villa Tatilinde, Profesyonel Villa Kiralama Acentesi, Tecrübeli Destek Ekibi ve Özenle Seçilmiş ve Onaylanmış Villa Portföyü ile Uygun Fiyat Garantisi Bu Yaz #VillaTatilinde",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light" />
        <meta
          name="viewport"
          content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
      </head>
      <body suppressHydrationWarning>
        <CurrencyProvider>
          <SiteShell>{children}</SiteShell>
        </CurrencyProvider>
      </body>
    </html>
  );
}

