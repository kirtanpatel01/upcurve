"use server";

import { db } from "@/lib/db";
import { exercises, exerciseLogs } from "@/lib/db/schema";
import { getUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function addExercise(data: { name: string; type: "reps" | "duration"; sets: number; goal: number; durationUnit?: "sec" | "min" | "hr" }) {
  const user = await getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const [newExercise] = await db.insert(exercises).values({
    name: data.name,
    type: data.type,
    sets: data.sets,
    goal: data.goal,
    durationUnit: data.durationUnit,
    userId: user.id,
  }).returning();

  revalidatePath("/exercise");
  return { success: true, data: newExercise };
}

export async function addExerciseLog(data: { exercise_id: string; values: number[] }) {
  const user = await getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  await db.insert(exerciseLogs).values({
    exerciseId: data.exercise_id,
    values: data.values,
  });

  revalidatePath("/exercise");
  return { success: true };
}

export async function updateExercise(id: string, data: { name: string; type: "reps" | "duration"; sets: number; goal: number; durationUnit?: "sec" | "min" | "hr" }) {
  const user = await getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  await db.update(exercises)
    .set({
      name: data.name,
      type: data.type,
      sets: data.sets,
      goal: data.goal,
      durationUnit: data.type === "duration" ? data.durationUnit : null,
    })
    .where(eq(exercises.id, id));

  revalidatePath("/exercise");
  return { success: true };
}

export async function deleteExercise(id: string) {
  const user = await getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  await db.delete(exercises).where(eq(exercises.id, id));

  revalidatePath("/exercise");
  return { success: true };
}
