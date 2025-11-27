"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useExerciseStore } from "../store";

import { useForm } from "@tanstack/react-form";
import z from "zod";
import { toast } from "sonner";
import { useEffect } from "react";
import { addExerciseLog } from "../actions";
import { Field, FieldLabel } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import EditExerciseSheet from "./edit-exercise-sheet";
import { Separator } from "@/components/ui/separator";

const logSchema = z.object({
  values: z.array(z.number().min(0, "Value must be at least 0.")),
});

export default function ExerciseLogCard() {
  const { selectedExercise } = useExerciseStore();

  const form = useForm({
    defaultValues: {
      values: [] as number[],
    },
    validators: { onSubmit: logSchema },
    onSubmit: async ({ value }) => {
      if (!selectedExercise) return;

      try {
        await addExerciseLog({
          exercise_id: selectedExercise.id,
          values: value.values,
        });

        toast.success("Log saved successfully.");
        // form.reset();
      } catch (e) {
        toast.error("Failed to save log.");
      }
    },
  });

  useEffect(() => {
    if (selectedExercise) {
      form.setFieldValue("values", Array(selectedExercise.sets).fill(0));
    }
  }, [selectedExercise]);

  if (!selectedExercise) {
    return (
      <Card className="w-full max-w-96">
        <CardHeader>
          <CardTitle>No exercise selected</CardTitle>
          <CardDescription>Select an exercise to add logs.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-96">
      <CardHeader>
        <CardTitle>{selectedExercise.name}</CardTitle>
        <CardDescription>
          Add your{" "}
          {selectedExercise.type === "reps" ? "rep counts" : "duration"} for{" "}
          {selectedExercise.sets} sets.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="exercise-log-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <form.Field name="values">
            {(field) => (
              <div className="space-y-4">
                {field.state.value.map((v, i) => (
                  <div key={i} className="space-y-1">
                    <FieldLabel className="text-sm font-medium">
                      Set {i + 1} <Badge>Goal: {selectedExercise.goal}</Badge>
                    </FieldLabel>

                    <Input
                      type="number"
                      min={0}
                      value={v}
                      onChange={(e) => {
                        const copy = [...field.state.value];
                        copy[i] = Number(e.target.value);
                        field.handleChange(copy);
                      }}
                    />

                    {field.state.meta.errors?.[i] && (
                      <p className="text-red-500 text-xs">
                        {field.state.meta.errors[i]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </form.Field>
        </form>
      </CardContent>

      <Separator />

      <CardFooter className="">
        <Field orientation={"horizontal"} className="">
          <EditExerciseSheet />
          <form.Subscribe selector={(state) => [state.isSubmitting]}>
            {([isSubmitting]) => {
              return (
                <Button
                  type="submit"
                  form="exercise-log-form"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              );
            }}
          </form.Subscribe>
        </Field>
      </CardFooter>
    </Card>
  );
}
