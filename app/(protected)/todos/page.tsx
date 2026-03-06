import TodoList from "./components/todo-list";
import { TodosChart } from "./components/todos-charts";
import TodoInsights from "./components/todos-insights";
import { getTodos } from "./utils/action";
import TodoStoreProvider from "./components/todo-store-provider";
import TodoTabs from "./components/todo-tabs";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function page() {
  const res = await getTodos();
  const initialTodos = res.success ? (res.todo || []) : [];

  return (
    <TodoStoreProvider initialTodos={initialTodos}>
      <div className="">
        {/* Desktop View */}
        <div className="p-3 sm:p-4 hidden xl:flex flex-col xl:flex-row gap-3 sm:gap-4">
          <TodoList />
          <div className="flex-1 space-y-3 sm:space-y-4 max-w-2xl">
            <TodoInsights />
            <TodosChart />
          </div>
        </div>

        {/* Mobile View with Persisted Tabs */}
        <Suspense>
          <TodoTabs />
        </Suspense>
      </div>
    </TodoStoreProvider>
  );
}
