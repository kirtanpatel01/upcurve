"use server";

import { createClient } from "@/utils/supabase/server";
import { Habit, HabitFormValues } from "./types";

export async function addHabits(value: HabitFormValues) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("You're not logged in!");

  const { error } = await supabase
    .from("habits")
    .insert([{ ...value, user_id: user?.id }]);

  if (error) {
    console.log(error);
    throw new Error("Failed to add habit. Please try again.");
  }

  return { success: true };
}

export async function updateDraftHabits(habits: Habit[]) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("habits")
    .upsert(habits, { onConflict: "id" })
    .select();

  if (error) throw error;
  return data;
}

export async function deleteSelectedHabits(ids: number[]) {
  const supabase = await createClient();
  const { error } = await supabase.from("habits").delete().in("id", ids)
  if(error) throw error;
}

export async function toggleHabitCompletion(id: number, completed: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("habits")
    .update({
      is_completed: completed,
      completed_at: completed ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if(error) throw error;
}
