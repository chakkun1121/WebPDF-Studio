export async function openFiles(
  accept = "application/pdf"
): Promise<Array<File | undefined>> {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = accept;
  const files = await new Promise<Array<File | undefined>>(resolve => {
    input.onchange = e => {
      const files = (e.target as HTMLInputElement).files;
      resolve(files ? Array.from(files) : [undefined]);
    };
    input.click();
  });
  return files;
}
export function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
  a.remove();
}
