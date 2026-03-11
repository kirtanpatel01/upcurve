import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { todos } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getAllTodosByUser() {
  const user = await getUser();
  if (!user) return [];

  return db
    .select()
    .from(todos)
    .where(eq(todos.userId, user.id))
    .orderBy(desc(todos.createdAt));
}
