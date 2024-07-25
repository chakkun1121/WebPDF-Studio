import { Metadata } from "next";

export default function NotFound() {
  return <p className="p-2 text-center">ページが見つかりません</p>;
}
export const metadata: Metadata = {
  title: "ページが見つかりません",
};
