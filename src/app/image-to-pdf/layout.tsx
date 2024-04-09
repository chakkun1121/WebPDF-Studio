import { Metadata } from "next";

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

export const metadata: Metadata = {
  title: "PDFのメタデータの表示、編集、削除",
  description:
    "PDFのメタデータを表示、編集、削除するWebアプリケーションです。Producerも編集、削除できます。",
  alternates: {
    canonical: "/image-to-pdf",
  },
};
