import { db } from "@/lib/db";
import { habits, habitExecutions } from "@/lib/db/schema";
import { desc, eq, and, sql, gte, asc } from "drizzle-orm";
import { getUser } from "@/lib/auth";
import { format } from "date-fns";

export async function getHabitsData() {
  const user = await getUser();
  if (!user) return [];

  return db
    .select()
    .from(habits)
    .where(and(eq(habits.userId, user.id), eq(habits.isArchived, false)))
    .orderBy(desc(habits.createdAt));
}

export async function getArchivedHabitsData() {
  const user = await getUser();
  if (!user) return [];

  return db
    .select()
    .from(habits)
    .where(and(eq(habits.userId, user.id), eq(habits.isArchived, true)))
    .orderBy(desc(habits.createdAt));
}

export async function getHabitExecutionsData(dateStr: string) {
  const user = await getUser();
  if (!user) return [];

  return db
    .select({
      id: habitExecutions.id,
      habitId: habitExecutions.habitId,
      date: habitExecutions.date,
      completed: habitExecutions.completed,
    })
    .from(habitExecutions)
    .innerJoin(habits, eq(habits.id, habitExecutions.habitId))
    .where(and(eq(habits.userId, user.id), eq(habitExecutions.date, dateStr)));
}

export async function getHistoricalExecutionsData(days: number) {
  const user = await getUser();
  if (!user) return [];

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = format(startDate, "yyyy-MM-dd");

  return db
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
}
