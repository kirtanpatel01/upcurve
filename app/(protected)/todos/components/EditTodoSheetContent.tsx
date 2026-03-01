import {
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { type Todo, TodoFormValues } from "../utils/types";
import { formSchema } from "../utils/validations";
import { editTodoMutation } from "../utils/hooks";

function EditTodoSheetContent({
  todo,
  closeSheet,
}: {
  todo: Todo;
  closeSheet: () => void;
}) {
  const { mutateAsync: editTodo, isPending: isEditing } = editTodoMutation(todo.id);
  const form = useForm({
    defaultValues: {
      title: todo?.title || "",
      desc: todo?.desc || "",
      deadline: todo?.deadline ? new Date(todo.deadline).toISOString().split('T')[0] : "",
      priority: todo?.priority || "low",
    } as TodoFormValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }: { value: TodoFormValues }) => {
      try {
        await editTodo({ value, id: todo.id });
        toast.success("Todo updated successfully!");
        form.reset();
        closeSheet();
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(err.message || "Failed to edit todo");
        } else {
          toast.error("Failed to edit todo");
        }
      }
    },
  });

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
        onSubmit={async (e) => {
          e.preventDefault();
          await form.handleSubmit();
        }}
        className="px-4"
      >
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
                    onValueChange={(value: "low" | "medium" | "high" | "urgent") =>
                      field.handleChange(value)
                    }
                  >
                    <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
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
          disabled={isEditing}
          className="cursor-pointer"
        >
          {isEditing ? "Updating..." : "Update"}
        </Button>
        <Button type="button" variant="outline" onClick={() => form.reset()} className="cursor-pointer">
          Reset
        </Button>
      </SheetFooter>
    </SheetContent>
  );
}

export default EditTodoSheetContent;
