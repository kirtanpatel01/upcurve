"use server";

import { db } from "@/lib/db";
import { habits, habitExecutions } from "@/lib/db/schema";
import { desc, eq, and, sql, gte, asc } from "drizzle-orm";
import { getUser } from "@/lib/auth/client";
import { format } from "date-fns";

export async function getHabits() {
  const user = await getUser();
  if (!user) return { success: false, message: "You're not logged in!" };

  const activeHabits = await db
    .select()
    .from(habits)
    .where(and(eq(habits.userId, user.id), eq(habits.isArchived, false)))
    .orderBy(desc(habits.createdAt));

  return { success: true, habits: activeHabits };
}

export async function getArchivedHabits() {
  const user = await getUser();
  if (!user) return { success: false, message: "You're not logged in!" };

  const archivedHabits = await db
    .select()
    .from(habits)
    .where(and(eq(habits.userId, user.id), eq(habits.isArchived, true)))
    .orderBy(desc(habits.createdAt));

  return { success: true, habits: archivedHabits };
}

export async function addHabit(name: string) {
  const user = await getUser();
  if (!user) return { success: false, message: "You're not logged in!" };

  await db.insert(habits).values({
    name,
    userId: user.id,
  });

  return { success: true, message: "Habit created successfully." };
}

export async function editHabit(id: string, name: string) {
  const user = await getUser();
  if (!user) return { success: false, message: "You're not logged in!" };

  await db
    .update(habits)
    .set({ name })
    .where(eq(habits.id, id));

  return { success: true };
}

export async function deleteHabit(id: string) {
  const user = await getUser();
  if (!user) return { success: false, message: "You're not logged in!" };

  await db.delete(habits).where(eq(habits.id, id));
  return { success: true };
}

export async function toggleHabitArchive(id: string, isArchived: boolean) {
  const user = await getUser();
  if (!user) return { success: false, message: "You're not logged in!" };

  await db
    .update(habits)
    .set({ isArchived })
    .where(eq(habits.id, id));

  return { success: true };
}

// Executions

export async function getHabitExecutions(dateStr: string) {
  // dateStr format: YYYY-MM-DD
  const user = await getUser();
  if (!user) return { success: false, message: "You're not logged in!" };

  const executions = await db
    .select({
      id: habitExecutions.id,
      habitId: habitExecutions.habitId,
      date: habitExecutions.date,
      completed: habitExecutions.completed,
    })
    .from(habitExecutions)
    .innerJoin(habits, eq(habits.id, habitExecutions.habitId))
    .where(and(eq(habits.userId, user.id), eq(habitExecutions.date, dateStr)));

  return { success: true, executions };
}

export async function getHistoricalExecutions(days: number) {
  const user = await getUser();
  if (!user) return { success: false, message: "You're not logged in!" };

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = format(startDate, "yyyy-MM-dd");

  const results = await db
    .select({
      date: habitExecutions.date,
      count: sql<number>`cast(count(${habitExecutions.id}) as int)`,
    })
    .from(habitExecutions)
    .innerJoin(habits, eq(habits.id, habitExecutions.habitId))
    .where(
      and(
        eq(habits.userId, user.id),
        eq(habitExecutions.completed, true),
        gte(habitExecutions.date, startDateStr)
      )
    )
    .groupBy(habitExecutions.date)
    .orderBy(asc(habitExecutions.date));

  return { success: true, stats: results };
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

  return { success: true };
}
