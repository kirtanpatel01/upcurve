"use client";

import { createClient } from "@/utils/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { HabitHistory } from "../utils/types";

const supabase = createClient();

async function fetchAllHabitHistoryByUser(userId: string): Promise<HabitHistory[]> {
  const { data: habit_history, error } = await supabase
    .from("habit_history")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return habit_history;
}

export function useHabitHistoryByUser(userId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery<HabitHistory[]>({
    queryKey: ["habit_history", userId],
    queryFn: () => fetchAllHabitHistoryByUser(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
  
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("habit_history-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "habit_history" },
        () => {
          // console.log("Realtime change:", payload);
          queryClient.invalidateQueries({ queryKey: ["habit_history", userId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  return query;
}
