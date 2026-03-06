"use server";

import { db } from "@/lib/db";
import { todos, habits, habitExecutions, exercises, exerciseLogs } from "@/lib/db/schema";
import { eq, and, gte, desc, sql } from "drizzle-orm";
import { getUser } from "@/lib/auth";
import { format, startOfDay, subDays } from "date-fns";

export async function getDashboardData() {
  const user = await getUser();
  if (!user) return { success: false, message: "Unauthorized" };

  const todayStr = format(new Date(), "yyyy-MM-dd");
  // Heatmap: Last 365 Days
  const ninetyDaysAgo = subDays(new Date(), 365);

  // 1. Fetch Todos
  const activeTodos = await db
    .select()
    .from(todos)
    .where(and(eq(todos.userId, user.id), eq(todos.isArchived, false)))
    .orderBy(desc(todos.createdAt));

  // 2. Fetch Habits & Today's Executions
  const userHabits = await db
    .select()
    .from(habits)
    .where(and(eq(habits.userId, user.id), eq(habits.isArchived, false)));

  const todayExecutions = await db
    .select()
    .from(habitExecutions)
    .innerJoin(habits, eq(habits.id, habitExecutions.habitId))
    .where(and(eq(habits.userId, user.id), eq(habitExecutions.date, todayStr)));

  // 3. Fetch Exercises & Today's Logs
  const userExercises = await db
    .select()
    .from(exercises)
    .where(and(eq(exercises.userId, user.id), eq(exercises.isArchived, false)));

  const todayLogs = await db
    .select()
    .from(exerciseLogs)
    .innerJoin(exercises, eq(exercises.id, exerciseLogs.exerciseId))
    .where(and(eq(exercises.userId, user.id), gte(exerciseLogs.createdAt, startOfDay(new Date()))));

  // 4. Heatmap Data (Parallelizing if possible, but Drizzle is fast)
  const habitStats = await db
    .select({
      date: habitExecutions.date,
      count: sql<number>`count(${habitExecutions.id})`,
    })
    .from(habitExecutions)
    .innerJoin(habits, eq(habits.id, habitExecutions.habitId))
    .where(and(eq(habits.userId, user.id), eq(habitExecutions.completed, true)))
    .groupBy(habitExecutions.date);

  const todoStats = await db
    .select({
      date: sql<string>`to_char(${todos.completedAt}, 'YYYY-MM-DD')`,
      count: sql<number>`count(${todos.id})`,
    })
    .from(todos)
    .where(and(eq(todos.userId, user.id), eq(todos.isCompleted, true), gte(todos.completedAt, ninetyDaysAgo)))
    .groupBy(sql`to_char(${todos.completedAt}, 'YYYY-MM-DD')`);

  const exerciseStats = await db
    .select({
      date: sql<string>`to_char(${exerciseLogs.createdAt}, 'YYYY-MM-DD')`,
      count: sql<number>`count(${exerciseLogs.id})`,
    })
    .from(exerciseLogs)
    .innerJoin(exercises, eq(exercises.id, exerciseLogs.exerciseId))
    .where(and(eq(exercises.userId, user.id), gte(exerciseLogs.createdAt, ninetyDaysAgo)))
    .groupBy(sql`to_char(${exerciseLogs.createdAt}, 'YYYY-MM-DD')`);

  return {
    success: true,
    data: {
      todos: activeTodos,
      habits: userHabits,
      habitExecutions: todayExecutions.map(e => ({ ...e.habit_executions })),
      exercises: userExercises,
      exerciseLogs: todayLogs.map(l => ({ ...l.exercise_logs })),
      heatmap: {
        habits: habitStats,
        todos: todoStats,
        exercises: exerciseStats,
      }
    }
  };
}
