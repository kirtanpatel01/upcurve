'use server'

import { createClient } from "@/utils/supabase/server";
import { ExerciseFormValues, ExerciseLogFormValues } from "./types";

export async function addExercise(value: ExerciseFormValues) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("You're not logged in!");

  const { error } = await supabase
    .from("exercise")
    .insert([{ ...value, user_id: user?.id }])
    .select();

  if (error) {
    console.log(error);
    throw new Error("Failed to add habit. Please try again.");
  }

  return { success: true };
}

export async function addExerciseLog(value: ExerciseLogFormValues) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("You are not logged in!");

  const { error } = await supabase
    .from("exercise_logs")
    .insert([
      {
        user_id: user.id,
        exercise_id: value.exercise_id,
        values: value.values,
      },
    ])
    .select();

  if (error) {
    console.log(error);
    throw new Error("Failed to add exercise log. Please try again.");
  }

  return { success: true };
}

export async function updateExercise(values: ExerciseFormValues & { id: number }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("exercise")
    .update({
      name: values.name,
      sets: values.sets,
      type: values.type,
      goal: values.goal,
    })
    .eq("id", values.id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  return true;
}

export async function deleteExercise(exerciseId: number) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("exercise")
    .delete()
    .eq("id", exerciseId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  return true;
}