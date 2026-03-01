"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { useForm } from "@tanstack/react-form";
import z from "zod";
import { toast } from "sonner";
import { useExerciseStore } from "../store";
import { updateExercise } from "../actions";
import { Exercise } from "../types";
import { useEffect, useState } from "react";
import DeleteExerciseAlertDialog from "./delete-exercise-alert-dialog";

const formSchema = z.object({
  name: z
    .string()
    .min(5, "Exercise name should be more than 5 characters.")
    .max(100, "Exercise name should be less than 100 characters."),
  sets: z.number().min(1, "Number of sets can't be less than 1."),
  type: z.enum(["reps", "duration"]),
  goal: z.number().min(1, "Goal value can't be less than 1."),
});

function EditExerciseSheet() {
  const { selectedExercise } = useExerciseStore();
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      sets: 1,
      type: "reps" as "reps" | "duration",
      goal: 1,
    },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      if (!selectedExercise) return;

      try {
        await updateExercise({ id: selectedExercise.id, ...value });
        toast.success("Exercise updated successfully.");
        setOpen(false);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message || "Failed to update exercise!");
        } else {
          toast.error("Failed to update exercise!");
        }
      }
    },
  });

  // Prefill when sheet opens
  useEffect(() => {
    if (selectedExercise) {
      form.reset({
        name: selectedExercise.name,
        sets: selectedExercise.sets,
        type: selectedExercise.type,
        goal: selectedExercise.goal,
      });
    }
  }, [selectedExercise, open]);

  if (!selectedExercise) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex-1">
          Edit
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Exercise</SheetTitle>
          <SheetDescription>Update the exercise details.</SheetDescription>
        </SheetHeader>

        <form
          id="edit-exercise-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="px-4"
        >
          <FieldGroup>
            {/* NAME */}
            <form.Field name="name">
              {(field) => {
                const invalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name}>Exercise Name</FieldLabel>

                    <Input
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={invalid}
                    />

                    {invalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>

            {/* SETS */}
            <form.Field name="sets">
              {(field) => {
                const invalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name}>Sets</FieldLabel>

                    <Input
                      type="number"
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                      min={1}
                      aria-invalid={invalid}
                    />

                    {invalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>

            {/* TYPE */}
            <form.Field name="type">
              {(field) => {
                const invalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel>Type</FieldLabel>

                    <RadioGroup
                      value={field.state.value}
                      onValueChange={(v) =>
                        field.handleChange(v as "reps" | "duration")
                      }
                      className="flex gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="reps" id="edit-reps" />
                        <FieldLabel htmlFor="edit-reps">Reps</FieldLabel>
                      </div>

                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="duration" id="edit-duration" />
                        <FieldLabel htmlFor="edit-duration">Duration</FieldLabel>
                      </div>
                    </RadioGroup>

                    {invalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>

            {/* GOAL */}
            <form.Field name="goal">
              {(field) => {
                const invalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name}>
                      {form.baseStore.state.values.type === "reps"
                        ? "Goal (Reps)"
                        : "Goal (Seconds)"}
                    </FieldLabel>

                    <Input
                      id={field.name}
                      type="number"
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                      min={1}
                      aria-invalid={invalid}
                    />

                    {invalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
        </form>

        <SheetFooter>
          <DeleteExerciseAlertDialog exerciseId={selectedExercise.id} />
          {/* <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button> */}

          <form.Subscribe selector={(s) => [s.isSubmitting]}>
            {([isSubmitting]) => (
              <Button
                type="submit"
                form="edit-exercise-form"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
            )}
          </form.Subscribe>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default EditExerciseSheet;
