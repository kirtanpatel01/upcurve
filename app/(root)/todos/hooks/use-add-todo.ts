"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {addTodo} from "../action";

export function useAddTodo(userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: Todo) => {
      return await addTodo(values);
    },
    onSuccess: () => {
      if (userId) queryClient.invalidateQueries({ queryKey: ["todos", userId] });
    },
  });
}
