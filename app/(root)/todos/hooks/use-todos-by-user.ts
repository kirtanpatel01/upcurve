"use client";

import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

const supabase = createClient();

async function fetchAllTodosByUser(userId: string): Promise<Todo[]> {
  const { data: todos, error } = await supabase
    .from("todos")
    .select('*')
    .eq('user_id', userId)
    .order("created_at", { ascending: false })

    if(error) throw error
    return todos
}

export function useTodosByUser(userId?: string) {
  return useQuery<Todo[]>({
    queryKey: ["todos", userId],
    queryFn: () => fetchAllTodosByUser(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
  });
}

