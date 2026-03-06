"use client";

import { useRef, createContext, useContext } from "react";
import { useStore } from "zustand";
import { createTodoStore, TodoStore } from "../utils/store";
import { Todo } from "../utils/types";

export const TodoStoreContext = createContext<ReturnType<typeof createTodoStore> | null>(null);

export interface TodoStoreProviderProps {
  children: React.ReactNode;
  initialTodos: Todo[];
}

export default function TodoStoreProvider({ children, initialTodos }: TodoStoreProviderProps) {
  const storeRef = useRef<ReturnType<typeof createTodoStore>>(null);
  if (!storeRef.current) {
    storeRef.current = createTodoStore({ 
      todos: initialTodos,
      isInitialized: true 
    });
  }

  return (
    <TodoStoreContext.Provider value={storeRef.current}>
      {children}
    </TodoStoreContext.Provider>
  );
}

export function useTodoStore<T>(selector: (state: TodoStore) => T): T {
  const storeContext = useContext(TodoStoreContext);
  if (!storeContext) {
    throw new Error("useTodoStore must be used within TodoStoreProvider");
  }
  return useStore(storeContext, selector);
}
