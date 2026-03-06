"use server";

import { db } from "@/lib/db";
import { TodoFormValues } from "./types";
import { getUser } from "@/lib/auth";
import { todos } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getTodos() {
  const user = await getUser();
  if (!user) return { success: false, message: "You're not logged in!" };

  const todo = await db
    .select()
    .from(todos)
    .where(eq(todos.userId, user.id))
    .orderBy(desc(todos.createdAt));

  return { success: true, todo };
}

export async function addTodo(values: TodoFormValues) {
  const { title, desc, deadline, priority } = values;

  const user = await getUser();
  if (!user) return { success: false, message: "You're not logged in!" };

  await db.insert(todos).values({
    id: crypto.randomUUID(),
    title,
    desc,
    deadline: deadline ? new Date(deadline) : null,
    priority: priority as "low" | "medium" | "high" | "urgent",
    userId: user.id,
  });

  return { success: true, message: "Todo created successfully." };
}

export async function editTodo(value: TodoFormValues, id: string) {
  const { title, desc, deadline, priority } = value;

  const user = await getUser();
  if (!user) return { success: false, message: "You're not logged in!" };

  await db
    .update(todos)
    .set({
      title,
      desc,
      deadline: deadline ? new Date(deadline) : null,
      priority: priority as "low" | "medium" | "high" | "urgent",
      userId: user.id,
    })
    .where(eq(todos.id, id));

  return { success: true };
}

export async function deleteTodo(id: string) {
  const user = await getUser();
  if (!user) return { success: false, message: "You're not logged in!" };

  await db.delete(todos).where(eq(todos.id, id));
  return { success: true };
}

export async function toggleTodoCompletion(id: string) {
  const user = await getUser();
  if (!user) return { success: false, message: "You're not logged in!" };

  await db
    .update(todos)
    .set({ isCompleted: true, completedAt: new Date() })
    .where(eq(todos.id, id));

  return { success: true };
}

export async function toggleTodoArchive(id: string) {
  const user = await getUser();
  if (!user) return { success: false, message: "You're not logged in!" };

  await db
    .update(todos)
    .set({ isArchived: true })
    .where(eq(todos.id, id));

  return { success: true };
}
