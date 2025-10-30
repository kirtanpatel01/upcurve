"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTodo} from "../action";

export function useDeleteTodo(userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return await deleteTodo(id);
    },
    onSuccess: () => {
      if (userId) queryClient.invalidateQueries({ queryKey: ["todos", userId] });
    },
  });
}
