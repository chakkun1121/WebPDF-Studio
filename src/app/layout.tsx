import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/ui-element/header";

export const metadata: Metadata = {
  title: {
    default: "WebPDF Studio | chakkun1121",
    template: "%s | WebPDF Studio | chakkun1121",
  },
  description: "Webブラウザ上でPDFを編集する無料アプリです",
  metadataBase: new URL("https://chakkun1121.github.io/webpdf-studio/"),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <Header />
        <main className="max-w-7xl mx-auto p-2">{children}</main>
      </body>
    </html>
  );
}
