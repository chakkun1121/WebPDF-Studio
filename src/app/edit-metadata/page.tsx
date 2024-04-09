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
  function selectFile() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf";
    input.onchange = e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && file.type === "application/pdf") {
        console.log(file);
        setPdf(file);
        const reader = new FileReader();
        reader.onload = async e => {
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
        };
        reader.readAsArrayBuffer(file);
      }
    };
    input.click();
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    disabled: !pdf,
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    if (!pdf) return;
    const reader = new FileReader();
    reader.onload = async e => {
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
      const url = URL.createObjectURL(blob);
      // download
      const a = document.createElement("a");
      a.href = url;
      a.download = pdf.name;
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
    };
    reader.readAsArrayBuffer(pdf);
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
            <Button type="submit" disabled={!pdf}>
              保存
            </Button>
          </form>
        </Form>
      </section>
    </>
  );
}
