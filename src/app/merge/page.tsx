"use client";

import { Button } from "@/components/ui/button";
import { download, openFiles } from "@/lib/pdf/file";
import { useState } from "react";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { createUUID } from "@/lib/uuid";
import { PDFDocument } from "pdf-lib";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import SortableItem from "./sortableItem";
import { PDF } from "./types";

export default function Page() {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [processing, setProcessing] = useState(false);
  async function selectFiles() {
    try {
      const files = await openFiles("application/pdf", true);
      const ids = files.map(_ => createUUID());
      setPdfs(f => [
        ...f,
        ...files.map((file, i) => ({
          file,
          id: ids[i],
          name: file.name,
        })),
      ]);
      for (let i = 0; i < files.length; i++) {
        const pdf = await PDFDocument.load(await files[i].arrayBuffer());
        const pageNum = pdf.getPageCount();
        setPdfs(f => f.map(v => (v.id === ids[i] ? { ...v, pageNum } : v)));
      }
    } catch (e) {
      console.error(e);
      toast.error("ファイルの読み込みに失敗しました");
    }
  }
  async function mergePDFs() {
    try {
      setProcessing(true);
      const mergedPdf = await PDFDocument.create();
      mergedPdf.setProducer(
        "WebPDF Studio(https://chakkun1121.github.io/WebPDF-Studio/)"
      );
      mergedPdf.setCreator(
        "WebPDF Studio(https://chakkun1121.github.io/WebPDF-Studio/)"
      );
      const targetPdfs = await Promise.all(
        pdfs.map(async pdf => PDFDocument.load(await pdf.file.arrayBuffer()))
      );
      for (const pdf of targetPdfs) {
        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );
        copiedPages.forEach(page => mergedPdf.addPage(page));
      }
      const pdfBytes = await mergedPdf.save();
      const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
      download(pdfBlob, `${pdfs[0].name}-merged.pdf`);
    } catch (e) {
      console.error(e);
      toast.error("PDFの結合に失敗しました");
    } finally {
      setProcessing(false);
    }
  }
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px ドラッグした時にソート機能を有効にする
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    if (active.id !== over.id) {
      const oldIndex = pdfs.findIndex(v => v.id === active.id);
      const newIndex = pdfs.findIndex(v => v.id === over.id);
      setPdfs(arrayMove(pdfs, oldIndex, newIndex));
    }
  };
  return (
    <>
      <article className="prose lg:prose-xl mx-auto">
        <h2>PDFの結合</h2>
        <p>複数のPDFファイルを結合します。結合作業はローカルで実行されます。</p>
      </article>
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <Button onClick={selectFiles} disabled={processing}>
            ファイルを{pdfs.length ? "追加" : "選択"}
          </Button>
          <Button
            disabled={!pdfs.length || processing}
            onClick={() => setPdfs([])}>
            リセット
          </Button>
        </div>
        <div className="border rounded">
          {pdfs.length === 0 && (
            <p className="text-center p-4 text-gray-500">
              ファイルを選択してください
            </p>
          )}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}>
            <SortableContext
              items={pdfs}
              strategy={verticalListSortingStrategy}>
              <ul className="space-y-2 p-4">
                {pdfs.map(pdf => (
                  <SortableItem key={pdf.id} item={pdf} setPdfs={setPdfs} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </div>
        <Button disabled={!pdfs.length || processing} onClick={mergePDFs}>
          結合(自動でダウンロードされます)
        </Button>
      </section>
    </>
  );
}
