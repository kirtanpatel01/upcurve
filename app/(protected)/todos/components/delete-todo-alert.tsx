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
import { deleteTodoMutation } from "../utils/hooks";

function DeleteTodoAlert({ id }: { id: string }) {
  const { mutateAsync, isPending } = deleteTodoMutation();
  const submit = async () => {
    try {
      await mutateAsync(id);
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
          This action cannot be undone. This will permanently delete your todo
          and remove your data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="bg-mute cursor-pointer">Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={submit}
          className="bg-destructive/90 hover:bg-destructive cursor-pointer"
          disabled={isPending}
        >
          {isPending ? "Deleting..." : "Delete"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}

export default DeleteTodoAlert;
