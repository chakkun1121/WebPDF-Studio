import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/ui-element/header";

export const metadata: Metadata = {
  title: {
    default: "Web PDF Editor | chakkun1121",
    template: "%s | Web PDF Editor | chakkun1121",
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
        {children}
      </body>
    </html>
  );
}
