"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { Plus } from "lucide-react";
import React from "react";
import z from "zod";
import { HabitFormValues } from "../utils/types";
import { toast } from "sonner";
import { addHabits } from "../utils/action";

const formSchema = z.object({
  title: z
    .string()
    .min(5, "Title should be more 5 characters.")
    .max(100, "Title should not be more 100 characters."),
  in_list: z.boolean(),
});

function AddHabitDialog() {
  const form = useForm({
    defaultValues: {
      title: "",
      in_list: true,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }: { value: HabitFormValues }) => {
      try {
        // onAdd( value.title, value.in_list);
        addHabits(value)
        toast.success("Habit added successfully.");
        form.reset();
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message || "Failed to add habit!");
        } else {
          toast.error("Failed to add!");
        }
      }
    },
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button">
          <Plus />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
          <DialogDescription>
            Add new habit task to your list.
          </DialogDescription>
        </DialogHeader>
        <form
          id="add-habit-form"
          // className="py-8"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field name="title">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Enter the title for the task"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="in_list">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field orientation={"horizontal"} data-invalid={isInvalid}>
                    <Checkbox
                      id={field.name}
                      name={field.name}
                      checked={field.state.value}
                      onCheckedChange={(checked) =>
                        field.handleChange(checked === true)
                      }
                      aria-invalid={isInvalid}
                    />
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>
                        Include in list ?
                      </FieldLabel>
                      <FieldDescription>
                        If you deselect this option the above task will not be
                        included in the list, meaning it won&apos;t appear in
                        daily tasks.
                      </FieldDescription>
                    </FieldContent>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant={"secondary"}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form="add-habit-form">
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddHabitDialog;
