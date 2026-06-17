import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://parameter.id"),
  title: "Parameter — Studio Produk Digital Indonesia",
  description:
    "Parameter membangun produk digital yang beneran dipakai. Kami bikin SaaS sendiri (Platform Belajar Pro, Ritme) & bantu UMKM punya aplikasi, sistem, website, dan landing page yang naikin produktivitas.",
  openGraph: {
    title: "Parameter — Studio Produk Digital Indonesia",
    description:
      "Builder produk digital, bukan sekadar vendor. Atur parameter pertumbuhan bisnismu.",
    type: "website",
    locale: "id_ID",
    images: ["/parameter-square.jpg"],
  },
  icons: {
    icon: [
      { url: "/parameter-favicon-white-20260617.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: [{ url: "/parameter-favicon-white-20260617.png", type: "image/png" }],
    apple: [
      { url: "/parameter-apple-icon-white-20260617.png", type: "image/png", sizes: "180x180" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
