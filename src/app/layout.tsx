import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
    <html lang="tr">
      <head>
        <meta name="color-scheme" content="light" />
        <meta
          name="viewport"
          content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
      </head>
      <body>
        <CurrencyProvider>
          <Navbar />
          {children}
          <Footer />
        </CurrencyProvider>
      </body>
    </html>
  );
}

