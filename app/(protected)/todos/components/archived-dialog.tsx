"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Archive } from "lucide-react";
import TodoList from "./todo-list";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ArchivedDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
        >
          Archived
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold tracking-tight">Archived Todos</DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-2">
          <ScrollArea className="h-[60vh] pr-4">
            <TodoList view="archived" />
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
