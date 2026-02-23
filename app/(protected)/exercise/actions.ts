'use server'

import { ExerciseFormValues, ExerciseLogFormValues } from "./types";

export async function addExercise(value: ExerciseFormValues) {
  return { success: true };
}

export async function addExerciseLog(value: ExerciseLogFormValues) {
  return { success: true };
}

export async function updateExercise(values: ExerciseFormValues & { id: number }) {
  return true;
}

export async function deleteExercise(exerciseId: number) {
  return true;
}