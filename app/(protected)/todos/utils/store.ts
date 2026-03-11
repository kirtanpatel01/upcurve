import { createStore } from "zustand";
import { Todo } from "./types";

export interface TodoState {
  todos: Todo[];
}

export interface TodoActions {
  setTodos: (todos: Todo[]) => void;
  addTodoToStore: (todo: Todo) => void;
  updateTodoInStore: (id: string, data: Partial<Todo>) => void;
  removeTodoFromStore: (id: string) => void;
}

export type TodoStore = TodoState & TodoActions;

export const createTodoStore = (initialState: Partial<TodoState> = {}) => {
  return createStore<TodoStore>((set) => ({
    todos: [],
    isInitialized: false,
    ...initialState,

    setTodos: (todos) => set({ todos }),
    addTodoToStore: (todo) => set((state) => ({ 
      todos: [todo, ...state.todos] 
    })),
    updateTodoInStore: (id, data) => set((state) => ({
      todos: state.todos.map(t => t.id === id ? { ...t, ...data } : t)
    })),
    removeTodoFromStore: (id) => set((state) => ({
      todos: state.todos.filter(t => t.id !== id)
    })),
  }));
};
