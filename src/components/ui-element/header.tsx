import Link from "next/link";

export default function Header() {
  return (
    <header className="p-2">
      <h1 className="text-2xl">
        <Link href="/">WebPDF Studio</Link>
      </h1>
    </header>
  );
}
