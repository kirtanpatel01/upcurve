"use server";

import { db } from "@/lib/db";
import { habits, habitExecutions } from "@/lib/db/schema";
import { desc, eq, and, sql, gte, asc } from "drizzle-orm";
import { getUser } from "@/lib/auth";
import { format } from "date-fns";

import { revalidatePath } from "next/cache";

export async function addHabit(name: string) {
  const user = await getUser();
  if (!user) return { success: false, message: "You're not logged in!" };

  await db.insert(habits).values({
    name,
    userId: user.id,
  });

  revalidatePath("/habits");
  return { success: true, message: "Habit created successfully." };
}

export async function editHabit(id: string, name: string) {
  const user = await getUser();
  if (!user) return { success: false, message: "You're not logged in!" };

  await db
    .update(habits)
    .set({ name })
    .where(eq(habits.id, id));

  revalidatePath("/habits");
  return { success: true };
}

export async function deleteHabit(id: string) {
  const user = await getUser();
  if (!user) return { success: false, message: "You're not logged in!" };

  await db.delete(habits).where(eq(habits.id, id));

  revalidatePath("/habits");
  return { success: true };
}

export async function toggleHabitArchive(id: string, isArchived: boolean) {
  const user = await getUser();
  if (!user) return { success: false, message: "You're not logged in!" };

  await db
    .update(habits)
    .set({ isArchived })
    .where(eq(habits.id, id));

  revalidatePath("/habits");
  return { success: true };
}

export async function toggleHabitExecution(habitId: string, dateStr: string, completed: boolean) {
  const user = await getUser();
  if (!user) return { success: false, message: "You're not logged in!" };

  const existing = await db
    .select()
    .from(habitExecutions)
    .where(and(eq(habitExecutions.habitId, habitId), eq(habitExecutions.date, dateStr)))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(habitExecutions)
      .set({ completed, completedAt: completed ? new Date() : null })
      .where(eq(habitExecutions.id, existing[0].id));
  } else {
    await db.insert(habitExecutions).values({
      habitId,
      date: dateStr,
      completed,
      completedAt: completed ? new Date() : null,
    });
  }

  revalidatePath("/habits");
  return { success: true };
}
