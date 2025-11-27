"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Exercise } from "../types";
import { useExerciseStore } from "../store";

export default function ExerciseSelection({
  exercises,
}: {
  exercises: Exercise[];
}) {
  const { selectedExercise, setSelectedExercise } = useExerciseStore();
  function handleChange(name: string) {
    const exercise = exercises.find((ex) => ex.name === name);
    if (exercise) setSelectedExercise(exercise);
  }

  return (
    <Select
      value={selectedExercise?.name ?? ""}
      onValueChange={handleChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select Exercise" />
      </SelectTrigger>
      <SelectContent>
        {exercises?.map((ex) => (
          <SelectItem key={ex.id} value={`${ex.name}`}>
            {ex.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
