"use client";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useDeleteTodo } from "../hooks/use-delete-todo";
import { useUser } from "@/utils/supabase/use-user";

function DeleteTodoAlert({ id }: { id: number }) {
  const { user } = useUser();
  const { mutateAsync: addTodoMutation } = useDeleteTodo(user?.id);

  const submit = async () => {
    try {
      await addTodoMutation(id);
      toast.success("Successfully deleted!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Failed to delete todo");
      } else {
        toast.error("Failed to delete todo");
      }
    }
  };
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={submit}>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}

export default DeleteTodoAlert;
