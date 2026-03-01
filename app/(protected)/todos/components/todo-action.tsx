import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Pencil, Archive, Trash2 } from "lucide-react";
import EditTodoSheetContent from "./EditTodoSheetContent";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import DeleteTodoAlert from "./DeleteTodoAlert";
import { useState } from "react";
import { Todo } from "../utils/types";
import { toggleTodoArchiveMutation } from "../utils/hooks";

export function TodoAction({ todo }: { todo: Todo }) {
  const [open,setOpen] = useState(false)
  const { mutate: toggleTodoArchive, isPending: isArchiving } = toggleTodoArchiveMutation();
  return (
    <div className="flex items-center gap-1 border border-border/10 rounded-md">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer">
            <Pencil size={14} />
          </Button>
        </SheetTrigger>
        <EditTodoSheetContent todo={todo} closeSheet={() => setOpen(false)} />
      </Sheet>

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
        onClick={() => toggleTodoArchive(todo.id)}
        disabled={isArchiving}
      >
        <Archive size={14} />
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-destructive/10 text-destructive cursor-pointer">
            <Trash2 size={14} />
          </Button>
        </AlertDialogTrigger>
        <DeleteTodoAlert id={todo.id} />
      </AlertDialog>
    </div>

  );
}
