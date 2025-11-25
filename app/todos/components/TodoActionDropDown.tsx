"use client";

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
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export function TodoActionDropDown({ id }: { id: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFetchingTodo, setIsFetchingTodo] = useState(false);
  
  return (
    <AlertDialog>
      <Sheet>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="">
            <Button
              variant="secondary"
              size="icon-sm"
              className="rounded-full"
              disabled={isFetchingTodo}
            >
              {isFetchingTodo ? <Spinner /> : <MoreVerticalIcon size={16} />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-[12px] tracking-wider opacity-60 pt-0.5 pl-1 pb-0 pr-0">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              <SheetTrigger asChild>
                <DropdownMenuItem onClick={() => setIsOpen(true)}>
                  Edit
                </DropdownMenuItem>
              </SheetTrigger>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem variant="destructive">
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {isOpen && (
          <EditTodoSheetContent
            id={id}
            setOpen={setIsOpen}
            setIsFetchingTodo={setIsFetchingTodo}
          />
        )}
        <DeleteTodoAlert id={id} />
      </Sheet>
    </AlertDialog>
  );
}
