"use server";

import { TodoFormValues } from "./types";

export async function addTodo(value: TodoFormValues) {
  const { title, desc, deadline, priority } = value;

  // if (!user) throw new Error("You're not logged in!");

  if (!title || title.trim().length < 3) {
    throw new Error("Title must be at least 3 characters.");
  }

  if (deadline && isNaN(Date.parse(deadline))) {
    throw new Error("Deadline must be a valid date.");
  }

  if (!priority) {
    throw new Error("Priority is required.");
  }

  return { success: true };
}

export async function editTodo(value: TodoFormValues, id: number) {
  const { title, desc, deadline, priority } = value;

  // if (!user) throw new Error("You're not logged in!");

  if (!title || title.trim().length < 3) {
    throw new Error("Title must be at least 3 characters.");
  }

  if (deadline && isNaN(Date.parse(deadline))) {
    throw new Error("Deadline must be a valid date.");
  }

  if (!priority) {
    throw new Error("Priority is required.");
  }

  return { success: true };
}

export async function deleteTodo(id: number) {
  return { success: true };
}

export async function toggleTodoCompletion(id: number, completed: boolean) {
  return { success: true };
}
