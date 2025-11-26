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
import { deleteTodo } from "../utils/action";

function DeleteTodoAlert({ id }: { id: number }) {
  const submit = async () => {
    try {
      await deleteTodo(id);
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
        <AlertDialogCancel className="bg-mute">Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={submit} className="bg-destructive/90 hover:bg-destructive">Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}

export default DeleteTodoAlert;
