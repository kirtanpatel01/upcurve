import TodoList from "./components/todo-list";
import { TodosChart } from "./components/todos-charts";
import TodoInsights from "./components/todos-insights";
import { getAllTodosByUser } from "./utils/data";
import TodoStoreProvider from "./components/todo-store-provider";
import TodoTabs from "./components/todo-tabs";
import { Suspense } from "react";

export default async function page() {
  const initialTodos = await getAllTodosByUser();

  return (
    <TodoStoreProvider initialTodos={initialTodos}>
        {/* Desktop View */}
        <div className="p-4 hidden lg:flex flex-col lg:flex-row gap-4">
          <div className="w-full max-w-lg flex-shrink-0">
            <TodoList />
          </div>
          
          <div className="w-full max-w-2xl space-y-4">
            <TodoInsights />
            <TodosChart />
          </div>
        </div>

        {/* Mobile View with Persisted Tabs */}
        <Suspense>
          <TodoTabs />
        </Suspense>
    </TodoStoreProvider>
  );
}
