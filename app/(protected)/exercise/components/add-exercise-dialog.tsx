"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { useForm } from "@tanstack/react-form";
import { Plus } from "lucide-react";
import z from "zod";
import { ExerciseFormValues } from "../types";
import { toast } from "sonner";
import { addExercise } from "../actions";
import { useState } from "react";
// import { addExercise } from "../utils/action";

const formSchema = z.object({
  name: z
    .string()
    .min(5, "Exercise name should be more than 5 characters.")
    .max(100, "Exercise name should be less than 100 characters."),
  sets: z.number().min(1, "Number of sets can't be less than 1."),
  type: z.enum(["reps", "duration"]),
  goal: z.number().min(1, "Goal value can't be less than 1."),
});

function AddExerciseDialog() {
  const [open, setOpen] = useState(false)
  const form = useForm({
    defaultValues: {
      name: "",
      sets: 1,
      type: "reps",
      goal: 1,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }: { value: ExerciseFormValues }) => {
      try {
        console.log(value);
        await addExercise(value);
        toast.success("Exercise added successfully.");
        form.reset();
        setOpen(false)
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message || "Failed to add exercise!");
        } else {
          toast.error("Failed to add exercise!");
        }
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">
          <Plus />
          Add Exercise
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Exercise</DialogTitle>
          <DialogDescription>
            Add a new exercise to your workout list.
          </DialogDescription>
        </DialogHeader>

        <form
          id="add-exercise-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            {/* EXERCISE NAME */}
            <form.Field name="name">
              {(field) => {
                const invalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name}>Exercise Name</FieldLabel>

                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={invalid}
                      placeholder="Enter exercise name"
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
                      id={field.name}
                      type="number"
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                      aria-invalid={invalid}
                      min={1}
                    />

                    {invalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>

            {/* TYPE (REPS / DURATION) */}
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
                        <RadioGroupItem value="reps" id="reps" />
                        <FieldLabel htmlFor="reps">Reps</FieldLabel>
                      </div>

                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="duration" id="duration" />
                        <FieldLabel htmlFor="duration">Duration</FieldLabel>
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
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                      aria-invalid={invalid}
                      min={1}
                    />

                    {invalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
        </form>

        <DialogFooter>
          <Field orientation={"horizontal"}>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>

            <form.Subscribe selector={(state) => [state.isSubmitting]}>
              {([isSubmitting]) => {
                return (
                  <Button
                    type="submit"
                    form="add-exercise-form"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Adding..." : "Add"}
                  </Button>
                );
              }}
            </form.Subscribe>
          </Field>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddExerciseDialog;
