"use client";

import { Button } from "@/components/ui/button";
import { download, openFiles } from "@/lib/pdf/file";
import { PDFDocument } from "pdf-lib";
import { useState } from "react";

export default function Page() {
  const [converting, setConverting] = useState(false);
  async function convertImageToPDF() {
    const files = await openFiles("image/png, image/jpeg");
    setConverting(true);
    await Promise.all(
      Array.from(files).map(async file => {
        if (!file) return;
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        await new Promise(resolve => {
          reader.onload = resolve;
        });
        const pdfDoc = await PDFDocument.create();
        pdfDoc.setTitle(file.name);
        pdfDoc.setProducer(
          "WebPDF Studio(https://chakkun1121.github.io/WebPDF-Studio/)"
        );
        pdfDoc.setCreator(
          "WebPDF Studio(https://chakkun1121.github.io/WebPDF-Studio/)"
        );
        const image = await (async () => {
          if (file.type === "image/png") {
            return await pdfDoc.embedPng(reader.result as ArrayBuffer);
          }
          if (file.type === "image/jpeg") {
            return await pdfDoc.embedJpg(reader.result as ArrayBuffer);
          }
          throw new Error("Unsupported image type");
        })();
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
        const pdfBytes = await pdfDoc.save();
        const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
        download(pdfBlob, file.name + ".pdf");
      })
    );
    setConverting(false);
  }
  return (
    <>
      <article className="prose lg:prose-xl mx-auto">
        <h2>画像をPDFに変換</h2>
        <p>
          画像をPDFに変換します。pngとjpegに対応しています。変換後は自動的にダウンロードされます。
          複数ファイルを選択した場合はそれぞれダウンロードされるので連続ダウンロードを許可してください。
        </p>
      </article>
      <section className="text-center">
        <Button onClick={convertImageToPDF} disabled={converting}>
          画像を選択
        </Button>
        {converting && <p>変換中...</p>}
      </section>
    </>
  );
}
