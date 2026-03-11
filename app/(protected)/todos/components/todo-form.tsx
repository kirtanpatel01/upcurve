"use client";

import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { formSchema } from "../utils/validations";
import { TodoFormValues } from "../utils/types";
import { useTodoStore } from "./todo-store-provider";
import { addTodo } from "../utils/action";
import { Loader2, Plus } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function TodoForm() {
  const addTodoToStore = useTodoStore((state) => state.addTodoToStore);

  const form = useForm({
    defaultValues: {
      title: "",
    } as TodoFormValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const res = await addTodo(value);
        if (res.success && res.data) {
          addTodoToStore(res.data);
          form.reset();
        } else {
          toast.error(res.message || "Failed to add todo");
        }
      } catch (err: unknown) {
        toast.error("An unexpected error occurred");
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="relative flex-1"
    >
      <form.Field name="title">
        {(field) => (
          <div className="relative flex items-center">
            <Plus className="absolute left-3 text-muted-foreground" size={18} />
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Add a task..."
              className="pl-10 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/20 transition-all rounded-xl"
              autoComplete="off"
            />
            <form.Subscribe selector={(state) => [state.isSubmitting]}>
              {([isSubmitting]) => (
                isSubmitting && (
                  <div className="absolute right-3">
                    <Spinner />
                  </div>
                )
              )}
            </form.Subscribe>
          </div>
        )}
      </form.Field>
    </form>
  );
}
