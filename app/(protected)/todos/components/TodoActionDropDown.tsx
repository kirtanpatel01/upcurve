import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import EditTodoSheetContent from "./EditTodoSheetContent";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import DeleteTodoAlert from "./DeleteTodoAlert";
import { type Todo } from "../utils/types";
import { useState } from "react";

export function TodoActionDropDown({ todo }: { todo: Todo }) {
  const [open, setOpen] = useState(false)
  return (
    <AlertDialog>
      <Sheet open={open} onOpenChange={setOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="">
            <Button variant="secondary" size="icon-sm" className="rounded-full">
              <MoreVerticalIcon size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-[12px] tracking-wider opacity-60 pt-0.5 pl-1 pb-0 pr-0">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              <SheetTrigger asChild>
                <DropdownMenuItem>Edit</DropdownMenuItem>
              </SheetTrigger>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem variant="destructive">
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <EditTodoSheetContent todo={todo} closeSheet={() => setOpen(false)} />
        <DeleteTodoAlert id={todo.id} />
      </Sheet>
    </AlertDialog>
  );
}
