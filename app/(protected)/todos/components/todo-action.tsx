import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Pencil, Archive } from "lucide-react";
import EditTodoSheetContent from "./edit-todo-sheet-content";
import { useState } from "react";
import { Todo } from "../utils/types";
import { useTodoStore } from "./todo-store-provider";
import { toggleTodoArchive } from "../utils/action";
import { toast } from "sonner";

export function TodoAction({ todo }: { todo: Todo }) {
  const [open, setOpen] = useState(false);
  const updateTodoInStore = useTodoStore((state) => state.updateTodoInStore);

  const handleArchive = async () => {
    updateTodoInStore(todo.id, { isArchived: true });
    try {
      const res = await toggleTodoArchive(todo.id);
      if (!res.success) {
        updateTodoInStore(todo.id, { isArchived: false });
        toast.error("Failed to archive todo");
      }
    } catch (err) {
      updateTodoInStore(todo.id, { isArchived: false });
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="flex items-center gap-1 border border-border/10 rounded-md">
      {!todo.isCompleted ? (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer">
              <Pencil size={14} />
            </Button>
          </SheetTrigger>
          <EditTodoSheetContent todo={todo} closeSheet={() => setOpen(false)} />
        </Sheet>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
          onClick={handleArchive}
        >
          <Archive size={14} />
        </Button>
      )}
    </div>
  );
}
