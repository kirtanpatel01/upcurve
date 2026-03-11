"use server";

import { db } from "@/lib/db";
import { TodoFormValues } from "./types";
import { getUser } from "@/lib/auth";
import { todos } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

import { revalidatePath } from "next/cache";

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
  const { title } = values;

  const user = await getUser();
  if (!user) return { success: false, message: "You're not logged in!" };

  const [newTodo] = await db.insert(todos).values({
    id: crypto.randomUUID(),
    title,
    userId: user.id,
  }).returning();

  revalidatePath("/todos");
  return { success: true, message: "Todo created successfully.", data: newTodo };
}

export async function editTodo(value: TodoFormValues, id: string) {
  const { title } = value;

  const user = await getUser();
  if (!user) return { success: false, message: "You're not logged in!" };

  await db
    .update(todos)
    .set({
      title,
      userId: user.id,
    })
    .where(eq(todos.id, id));

  revalidatePath("/todos");
  return { success: true };
}

export async function deleteTodo(id: string) {
  const user = await getUser();
  if (!user) return { success: false, message: "You're not logged in!" };

  await db.delete(todos).where(eq(todos.id, id));

  revalidatePath("/todos");
  return { success: true };
}

export async function toggleTodoCompletion(id: string, isCompleted: boolean) {
  const user = await getUser();
  if (!user) return { success: false, message: "You're not logged in!" };

  await db
    .update(todos)
    .set({ 
      isCompleted, 
      completedAt: isCompleted ? new Date() : null 
    })
    .where(eq(todos.id, id));

  revalidatePath("/todos");
  return { success: true };
}

export async function toggleTodoArchive(id: string, isArchived: boolean) {
  const user = await getUser();
  if (!user) return { success: false, message: "You're not logged in!" };

  await db
    .update(todos)
    .set({ isArchived })
    .where(eq(todos.id, id));

  revalidatePath("/todos");
  return { success: true };
}
