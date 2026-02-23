"use server";

import { Habit, HabitFormValues } from "./types";

export async function addHabits(value: HabitFormValues) {
  return { success: true };
}

export async function updateDraftHabits(habits: Habit[]) {
  return { success: true };
}

export async function deleteSelectedHabits(ids: number[]) {
  return { success: true };
}

export async function toggleHabitCompletion(id: number, completed: boolean) {
  return { success: true };
}