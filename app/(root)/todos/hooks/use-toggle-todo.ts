'use client'

import { createClient } from "@/utils/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
const supabase = createClient()
async function toggleTodoCompletion(id: number, completed: boolean) {
  const { error } = await supabase
    .from("todos")
    .update({ is_completed: completed })
    .eq("id", id)
    .select()

  if(error) throw error
} 
export function useToggleTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) => 
      toggleTodoCompletion(id, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
    }
  })
}