// action.ts

"use server";

import { createClient } from "@/utils/supabase/server";

export async function addTodo(value: TodoFormValues) {
  const supabase = await createClient();
  const { title, desc, deadline, priority } = value;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("You're not logged in!");

  if (!title || title.trim().length < 3) {
    throw new Error("Title must be at least 3 characters.");
  }

  if (deadline && isNaN(Date.parse(deadline))) {
    throw new Error("Deadline must be a valid date.");
  }

  if (!priority) {
    throw new Error("Priority is required.");
  }

  const { error } = await supabase
    .from("todos")
    .insert([{ title, desc, deadline, priority, user_id: user?.id }]);

  if (error) {
    console.log(error);
    throw new Error("Failed to add todo. Please try again.");
  }

  return { success: true };
}

export async function editTodo(value: TodoFormValues, id: number) {
  const supabase = await createClient();
  const { title, desc, deadline, priority } = value;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("You're not logged in!");

  if (!title || title.trim().length < 3) {
    throw new Error("Title must be at least 3 characters.");
  }

  if (deadline && isNaN(Date.parse(deadline))) {
    throw new Error("Deadline must be a valid date.");
  }

  if (!priority) {
    throw new Error("Priority is required.");
  }

  const { error } = await supabase
    .from("todos")
    .update({ title, desc, deadline, priority })
    .eq("id", id);

  if (error) {
    console.log(error);
    throw new Error("Failed to edit todo. Please try again.");
  }

  return { success: true };
}

export async function deleteTodo(id: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("You're not logged in!");

  const { error } = await supabase
    .from("todos")
    .delete()
    .eq("id", id);
  
  if(error) {
    console.log(error)
    throw new Error("Failed to delete the todo. Please try again.");
  }

  return { success: true }
}
