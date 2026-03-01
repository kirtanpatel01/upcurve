"use server";

import { db } from "@/lib/db";
import { TodoFormValues } from "./types";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { todos } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getTodos() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { success: false, message: "You're not logged in!" };

  const { user } = session;

  const todo = await db.select().from(todos).where(eq(todos.userId, user.id));

  return { success: true, todo };
}

export async function addTodo(values: TodoFormValues) {
  const { title, desc, deadline, priority } = values;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { success: false, message: "You're not logged in!" };

  const { user } = session;

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

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { success: false, message: "You're not logged in!" };

  const { user } = session;

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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { success: false, message: "You're not logged in!" };

  await db.delete(todos).where(eq(todos.id, id));

  return { success: true };
}

export async function toggleTodoCompletion(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { success: false, message: "You're not logged in!" };

  await db
    .update(todos)
    .set({ isCompleted: true, completedAt: new Date() })
    .where(eq(todos.id, id));

  return { success: true };
}

export async function toggleTodoArchive(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { success: false, message: "You're not logged in!" };

  await db
    .update(todos)
    .set({ isArchived: true })
    .where(eq(todos.id, id));

  return { success: true };
}
