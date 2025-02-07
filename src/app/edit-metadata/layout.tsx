import { Metadata } from "next";

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
export const metadata: Metadata = {
  title: "PDFのメタデータの表示、編集、削除",
  description:
    "          PDF内にあるメタデータの表示、編集、削除ができます。他のアプリでは困難なPDF作成アプリの抹消も対応しています。",
  alternates: {
    canonical: "/edit-metadata",
  },
};
