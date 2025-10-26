"use server";

import { createClient } from "@/utils/supabase/server";

export default async function addTodo(
  prevState: {
    fieldErrors?: Record<string, string>;
    success?: boolean;
    values: {
      title: string;
      desc: string;
      deadline: string;
      priority: string;
    };
  } | undefined,
  formData: FormData
) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const desc = formData.get("desc") as string;
  const deadline = formData.get("deadline") as string;
  const priority = formData.get("priority") as string;

  const errors: Record<string, string> = {};

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      fieldError: { general: "You're not logged in!" },
      success: false,
      values: {
        title,
        desc,
        deadline,
        priority,
      },
    };
  }

  if (!title || title.trim().length === 0) {
    errors.title = "Title is required.";
  } else if (title.length < 3) {
    errors.title = "Title must be at least 3 characters.";
  }

  if (deadline && isNaN(Date.parse(deadline))) {
    errors.deadline = "Deadline must be a valid date.";
  }

  if (!priority) {
    errors.priority = "Priority is required.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      fieldErrors: errors,
      success: false,
      values: {
        title,
        desc,
        deadline,
        priority,
      },
    };
  }

  try {
    const { error } = await supabase
      .from("todos")
      .insert([{ title, desc, deadline, priority, user_id: user?.id }])
      .select();

    if (error) {
      console.log(error);
      return {
        fieldErrors: { general: "Nhi add thyu bhai" },
        success: false,
        values: {
          title,
          desc,
          deadline,
          priority,
        },
      };
    }

    return { 
      success: true, 
      fieldErrors: {}, 
      values: { 
        title:"",  
        desc: "",
        deadline: "",
        priority: "",
      } 
    };
  } catch (err) {
    console.log(err);
    return {
      fieldErrors: { general: "Something went wrong while saving your todo." },
      success: false,
      values: {
        title,
        desc,
        deadline,
        priority,
      },
    };
  }
}
