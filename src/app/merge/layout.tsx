import { Metadata } from "next";

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

export const metadata: Metadata = {
  title: "PDFファイルを結合",
  description: "複数のPDFファイルを結合します。完全にローカルで作動します。",
  alternates: {
    canonical: "/merge",
  },
};
