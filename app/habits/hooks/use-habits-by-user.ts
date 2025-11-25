"use client";

import { createClient } from "@/utils/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Habit } from "../utils/types";

const supabase = createClient();

async function fetchAllHabitsByUser(userId: string): Promise<Habit[]> {
  const { data: habits, error } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return habits;
}

export function useHabitsByUser(userId: string) {
  const queryClient = useQueryClient();

  const query = useQuery<Habit[]>({
    queryKey: ["habits", userId],
    queryFn: () => fetchAllHabitsByUser(userId!),
    enabled: !!userId,
    gcTime: Infinity,
  });
  
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("habits-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "habits" },
        () => {
          console.log("Realtime change from habits!")
          queryClient.invalidateQueries({ queryKey: ["habits", userId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  return query;
}
