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
import { useTodoStore } from "./todo-store-provider";
import { deleteTodo } from "../utils/action";
import { useState } from "react";

function DeleteTodoAlert({ id }: { id: string }) {
  const removeTodoFromStore = useTodoStore((state) => state.removeTodoFromStore);
  const [isDeleting, setIsDeleting] = useState(false);

  const submit = async () => {
    setIsDeleting(true);
    // Optimistic removal
    removeTodoFromStore(id);
    
    try {
      const res = await deleteTodo(id);
      if (res.success) {
        toast.success("Successfully deleted!");
      } else {
        toast.error("Failed to delete todo");
      }
    } catch (err: unknown) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your todo
          and remove your data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="bg-mute cursor-pointer">Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={submit}
          className="bg-destructive/90 hover:bg-destructive cursor-pointer"
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}

export default DeleteTodoAlert;
