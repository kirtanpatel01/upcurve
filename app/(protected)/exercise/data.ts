"use server";

import { createClient } from "@/utils/supabase/server";
import { Exercise, ExerciseLog } from "./types";

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return user;
}

export async function getAllExercisesByUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data: exercises, error } = await supabase
    .from("exercise")
    .select("*")
    .eq("user_id", user?.id)
  
  if(error) throw error
  
  return exercises
}

export async function getExerciseLogs() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data: logs, error: e2 } = await supabase
    .from("exercise_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (e2) throw new Error(e2.message);

  return logs as ExerciseLog[]
}