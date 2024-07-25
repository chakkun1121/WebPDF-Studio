import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CaretSortIcon, Cross1Icon } from "@radix-ui/react-icons";
import { CSS } from "@dnd-kit/utilities";
import { PDF } from "./types";

export default function SortableItem({
  item,
  setPdfs,
}: {
  item: PDF;
  setPdfs: React.Dispatch<React.SetStateAction<PDF[]>>;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="p-2 rounded bg-card cursor-move flex justify-between gap-4 items-center"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}>
      <div className="flex gap-2 items-center">
        <CaretSortIcon />
        {item.name}
        {item.pageNum && (
          <span className="text-sm opacity-90">({item.pageNum}ページ)</span>
        )}
      </div>
      <Button
        aria-label="削除"
        onClick={() => {
          setPdfs(pdfs => pdfs.filter(v => v.id !== item.id));
        }}
        variant="ghost">
        <Cross1Icon />
      </Button>
    </div>
  );
}
