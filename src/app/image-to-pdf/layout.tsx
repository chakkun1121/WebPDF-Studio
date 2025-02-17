import { Metadata } from "next";

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

export const metadata: Metadata = {
  title: "画像ファイルをPDFに変換",
  description: "画像ファイルをPDFに変換します。完全にローカルで作動します。",
  alternates: {
    canonical: "/image-to-pdf",
  },
};
