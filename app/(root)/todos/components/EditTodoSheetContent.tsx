import {
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import z from "zod";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTodoById } from "../hooks/use-todo-by-id";
import { Spinner } from "@/components/ui/spinner";
import { useEditTodo } from "../hooks/use-edit-todo";
import { Dispatch, useEffect } from "react";
import { useUser } from "@/utils/supabase/use-user";

const formSchema = z.object({
  title: z
    .string()
    .min(3, "Todo title must be 3 or more characters.")
    .max(32, "Todo title can't be more than 32 characters."),
  desc: z.string(),
  deadline: z.string(),
  priority: z.string(),
});

function EditTodoSheetContent({
  id,
  setOpen,
  setIsFetchingTodo,
}: {
  id: number;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  setIsFetchingTodo: Dispatch<React.SetStateAction<boolean>>;
}) {
  const { data: todo, isLoading } = useTodoById(id);
  const { user } = useUser();
  const { mutateAsync: editTodoMutation } = useEditTodo(user?.id);

  useEffect(() => {
    setIsFetchingTodo(isLoading);
  }, [isLoading, setIsFetchingTodo]);

  const form = useForm({
    defaultValues: {
      title: todo?.title || "",
      desc: todo?.desc || "",
      deadline: todo?.deadline || "",
      priority: todo?.priority || "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }: { value: TodoFormValues }) => {
      try {
        await editTodoMutation({ id, value });
        toast.success("Todo updated successfully!");
        form.reset();
        setOpen(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(err.message || "Failed to edit todo");
        } else {
          toast.error("Failed to edit todo");
        }
      }
    },
  });

  if (isLoading) return null;

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Edit Todo</SheetTitle>
        <SheetDescription>
          Update your task details below. You can adjust the title, description,
          deadline, or priority to keep everything accurate and up to date.
        </SheetDescription>
      </SheetHeader>
      <form
        id="edit-todo-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="px-4"
      >
        {/* Title */}
        <FieldGroup>
          <form.Field name="title">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Title <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Enter todo title"
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          {/* Description */}
          <form.Field name="desc">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Short description (optional)"
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          {/* Deadline */}
          <form.Field name="deadline">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel>Deadline</FieldLabel>
                  <Input
                    type="date"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Choose date(Optional)"
                    autoComplete="off"
                  />
                </Field>
              );
            }}
          </form.Field>

          {/* Priority */}
          <form.Field name="priority">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>
                      Priority <span className="text-red-500">*</span>
                    </FieldLabel>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(
                        value as "" | "low" | "medium" | "high"
                      )
                    }
                  >
                    <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>
      </form>

      <SheetFooter>
        <Button
          type="submit"
          form="edit-todo-form"
          disabled={form.state.isSubmitting}
        >
          {form.state.isSubmitting ? (
            <span className="flex items-center gap-2">
              Updating <Spinner />
            </span>
          ) : (
            "Update"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
      </SheetFooter>
    </SheetContent>
  );
}

export default EditTodoSheetContent;
