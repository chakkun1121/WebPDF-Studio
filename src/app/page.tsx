// import About from "@/docs/about.mdx";
export default function Home() {
  return (
    <main className="p-2 max-w-7xl mx-auto">
      <section></section>
      <article className="prose lg:prose-xl mx-auto">
        {/* Todo: use mdx file */}
        <h2>このアプリについて</h2>
        <p>このアプリは web ブラウザで PDF を編集する無料アプリです。</p>
        <h2>なぜ完全無料かつ広告なしで提供しているのか</h2>
        <p>
          ファイルの処理をローカルで実行するためサーバー必要なく、サーバー代がかからないため無料で提供しています。また、ファイルはローカルで処理をするので外部に一切アップロードしていません。
        </p>
      </article>
    </main>
  );
}
