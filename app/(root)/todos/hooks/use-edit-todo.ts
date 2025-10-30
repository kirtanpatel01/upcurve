'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editTodo } from "../action";

export function useEditTodo(userId?: string ) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      value,
    }: {
      id: number;
      value: Todo;
    }) => {
      await editTodo(value, id);
      return { id, value };
    },

    onSuccess: () => {
      if (userId) queryClient.invalidateQueries({ queryKey: ["todos", userId] });
    },
  });
}
