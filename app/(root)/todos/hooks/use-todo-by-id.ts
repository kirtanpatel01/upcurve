import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { TodoFormValues } from "../components/TodoForm";

const supabase = createClient();

async function fetchTodoById(id: number | undefined) {
  const { data: todo, error } = await supabase
    .from("todos")
    .select("*")
    .eq("id", id)
    .single()
  
    if(error) throw error
    return todo
}

export function useTodoById(id: number | undefined) {
  return useQuery<TodoFormValues>({
    queryKey: ["todos", id],
    queryFn: () => fetchTodoById(id!),
    enabled: !!id,
  })
}