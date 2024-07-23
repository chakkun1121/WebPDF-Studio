"use client";

import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { toast } from "sonner";
import { download, openFiles } from "@/lib/pdf/file";

const formSchema = z.object({
  Title: z.string().optional(),
  Author: z.string().optional(),
  Subject: z.string().optional(),
  Keywords: z.string().optional(),
  Creator: z.string().optional(),
  Producer: z.string().optional(),
  CreationDate: z.string().optional(),
  ModDate: z.string().optional(),
});
export default function Page() {
  const [pdf, setPdf] = useState<File | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  async function selectFile() {
    setLoading(true);
    try {
      const [file] = await openFiles();
      if (!file || file.type != "application/pdf") {
        throw new Error("PDFファイルを選択してください。");
      }
      setPdf(file);
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      await new Promise(resolve => (reader.onloadend = resolve));
      const arrayBuffer = reader.result as ArrayBuffer;
      const pdfDoc = await PDFDocument.load(new Uint8Array(arrayBuffer), {
        updateMetadata: false,
      });
      console.log(pdfDoc);
      form.setValue("Title", pdfDoc.getTitle());
      form.setValue("Author", pdfDoc.getAuthor());
      form.setValue("Subject", pdfDoc.getSubject());
      form.setValue("Keywords", pdfDoc.getKeywords());
      form.setValue("Creator", pdfDoc.getCreator());
      form.setValue("Producer", pdfDoc.getProducer());
      form.setValue("CreationDate", pdfDoc.getCreationDate()?.toString());
      form.setValue("ModDate", pdfDoc.getModificationDate()?.toString());
    } catch (e) {
      console.error(e);
      toast.error("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    disabled: !pdf || loading || processing,
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    if (!pdf) return;
    try {
      setProcessing(true);
      const reader = new FileReader();
      reader.readAsArrayBuffer(pdf);
      await new Promise(resolve => (reader.onload = resolve));
      const pdfDoc = await PDFDocument.load(
        new Uint8Array(reader.result as ArrayBuffer)
      );
      pdfDoc.setTitle(values.Title || "");
      pdfDoc.setAuthor(values.Author || "");
      pdfDoc.setSubject(values.Subject || "");
      pdfDoc.setKeywords(values.Keywords?.split(",") || []);
      pdfDoc.setCreator(values.Creator || "");
      pdfDoc.setProducer(values.Producer || "");
      pdfDoc.setCreationDate(
        values.CreationDate ? new Date(values.CreationDate) : new Date()
      );
      pdfDoc.setModificationDate(
        values.ModDate ? new Date(values.ModDate) : new Date()
      );
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      download(blob, pdf.name);
    } catch (e) {
      console.error(e);
      toast.error("エラーが発生しました");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <article className="prose lg:prose-xl mx-auto">
        <h2>PDFのメタデータの表示、編集、削除</h2>
        <p>PDF内にあるメタデータの表示、編集、削除ができます。</p>
      </article>
      <section>
        <nav>
          <Button onClick={selectFile} className="">
            ファイルを選択
          </Button>
        </nav>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {[
              "Title",
              "Author",
              "Subject",
              "Keywords",
              "Creator",
              "Producer",
              "CreationDate",
              "ModDate",
            ].map(key => (
              <FormField
                key={key}
                name={key as any}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{key}</FormLabel>
                    <FormControl>
                      <Input placeholder={key} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
            <Button type="submit" disabled={!pdf || loading || processing}>
              保存
            </Button>
            {processing && <p>処理中...</p>}
          </form>
        </Form>
      </section>
    </>
  );
}
