'use client'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addTodo, deleteTodo, editTodo, getTodos, toggleTodoArchive, toggleTodoCompletion } from "./action";
import { TodoFormValues } from "./types";

const TODO_QUERY_KEY = "todos";

export const useTodos = () => {
  return useQuery({
    queryKey: [TODO_QUERY_KEY],
    queryFn: getTodos,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export const createTodoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODO_QUERY_KEY] });
    },
    onError: (error: Error) => {
      return error.message || "Failed to create todo";
    },
  });
};

export const editTodoMutation = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { value: TodoFormValues; id: string }) =>
      editTodo(data.value, data.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODO_QUERY_KEY] });
    },
    onError: (error: Error) => {
      return error.message || "Failed to edit todo";
    },
  });
};

export const deleteTodoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTodo(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: [TODO_QUERY_KEY] });
      const previousTodos = queryClient.getQueryData([TODO_QUERY_KEY]);
      
      queryClient.setQueryData([TODO_QUERY_KEY], (old: any) => {
        if (!old || !old.todo) return old;
        return {
          ...old,
          todo: old.todo.filter((t: any) => t.id !== id),
        };
      });
      
      return { previousTodos };
    },
    onError: (error: Error, _, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData([TODO_QUERY_KEY], context.previousTodos);
      }
      return error.message || "Failed to delete todo";
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [TODO_QUERY_KEY] });
    },
  });
};

export const toggleTodoCompletionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleTodoCompletion(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: [TODO_QUERY_KEY] });
      const previousTodos = queryClient.getQueryData([TODO_QUERY_KEY]);
      
      queryClient.setQueryData([TODO_QUERY_KEY], (old: any) => {
        if (!old || !old.todo) return old;
        return {
          ...old,
          todo: old.todo.map((t: any) =>
            t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
          ),
        };
      });
      
      return { previousTodos };
    },
    onError: (error: Error, _, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData([TODO_QUERY_KEY], context.previousTodos);
      }
      return error.message || "Failed to complete todo";
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [TODO_QUERY_KEY] });
    },
  });
};

export const toggleTodoArchiveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleTodoArchive(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: [TODO_QUERY_KEY] });
      const previousTodos = queryClient.getQueryData([TODO_QUERY_KEY]);
      
      queryClient.setQueryData([TODO_QUERY_KEY], (old: any) => {
        if (!old || !old.todo) return old;
        return {
          ...old,
          todo: old.todo.map((t: any) =>
            t.id === id ? { ...t, isArchived: !t.isArchived } : t
          ),
        };
      });
      
      return { previousTodos };
    },
    onError: (error: Error, _, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData([TODO_QUERY_KEY], context.previousTodos);
      }
      return error.message || "Failed to archive todo";
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [TODO_QUERY_KEY] });
    },
  });
};
