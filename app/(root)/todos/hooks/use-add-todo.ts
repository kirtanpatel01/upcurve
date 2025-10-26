"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import addTodo from "../action";

export function useAddTodo(userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await addTodo(undefined, formData);
      return result;
    },
    onSuccess: () => {
      // Invalidate the todos query so it refetches
      if (userId) queryClient.invalidateQueries({ queryKey: ["todos", userId] });
    },
  });
}
