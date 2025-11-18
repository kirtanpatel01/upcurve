"use client";

import { createClient } from "@/utils/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Todo } from "../utils/types";

const supabase = createClient();

async function fetchAllTodosByUser(userId: string): Promise<Todo[]> {
  const { data: todos, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return todos;
}

export function useTodosByUser(userId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery<Todo[]>({
    queryKey: ["todos", userId],
    queryFn: () => fetchAllTodosByUser(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel("todos-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "todos" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["todos", userId] });
        }
      )

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  return query;
}
