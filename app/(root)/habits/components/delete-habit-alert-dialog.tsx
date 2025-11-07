import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import React from "react";
import { Habit } from "../utils/types";

function DeleteHabitAlertDialog({
  habit,
  onDelete,
}: {
  habit: Habit;
  onDelete: (id: number) => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon-sm" variant="destructive">
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure ?</AlertDialogTitle>
          <AlertDialogDescription>
            Once you delete this habit task, there won&apos;t any backup to
            restore it!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="w-full text-center py-8">
          <span className="bg-secondary text-secondary-foreground px-3 py-2 border border-accent/50 rounded-xl shadow-md">
            {habit.title}
          </span>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancle</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant={"destructive"} onClick={() => onDelete(habit.id)}>
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteHabitAlertDialog;
