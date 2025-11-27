"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { deleteExercise } from "../actions";
import { toast } from "sonner";
import { useExerciseStore } from "../store";

interface Props {
  exerciseId: number;
}

export default function DeleteExerciseAlertDialog({ exerciseId }: Props) {
  const [loading, setLoading] = useState(false);
  const { setSelectedExercise } = useExerciseStore();

  async function handleDelete() {
    try {
      setLoading(true);
      await deleteExercise(exerciseId);
      toast.success("Exercise deleted successfully.");
      setSelectedExercise(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to delete exercise!");
      } else {
        toast.error("Failed to delete exercise!");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Exercise?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently delete this exercise along with its
            associated logs. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
