import Link from "next/link";

// import About from "@/docs/about.mdx";
export default function Home() {
  return (
    <>
      <section className="prose lg:prose-xl mx-auto">
        <h2>ツール一覧</h2>
        <ul>
          <li>
            <Link href="/edit-metadata">PDFのメタデータの表示、編集、削除</Link>
          </li>
        </ul>
      </section>
      <article className="prose lg:prose-xl mx-auto">
        {/* Todo: use mdx file */}
        <h2>このアプリについて</h2>
        <p>このアプリは web ブラウザで PDF を編集する無料アプリです。</p>
        <h2>なぜ完全無料かつ広告なしで提供しているのか</h2>
        <p>
          ファイルの処理をローカルで実行するためサーバー必要なく、サーバー代がかからないため無料で提供できます。また、ファイルはローカルで処理をするので外部に一切アップロードしていません。また、プライバシーのため、
          <a
            href="https://search.google.com/search-console/about"
            target="_blank"
          >
            google search console
          </a>
          での検索流入数以外のデータは取得していません。
        </p>
      </article>
    </>
  );
}
