// page.tsx

"use client";
import Review from "./components/Review";
import TodoList from "./components/TodoList";
import { useUser } from "@/utils/supabase/use-user";
import { useTodosByUser } from "./hooks/use-todos-by-user";
import { TodosBarChart } from "./components/TodosBarChart";

function Page() {
  const { user, loading: userLoading } = useUser();
  const { data: todos, isLoading: todosLoading } = useTodosByUser(user?.id);
  const loading = userLoading || todosLoading;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col xl:flex-row">
      <div className="p-4">
        <div className="w-full max-w-md flex flex-col items-center gap-4 rounded-xl p-4 md:p-8 bg-accent border border-primary/25">
          <TodoList todos={todos || []} loading={loading} />
        </div>
      </div>

      <div className="w-full max-w-6xl p-4 space-y-4 flex flex-col">
        <Review todos={todos || []} loading={loading} />
        <TodosBarChart todos={todos || []} loading={loading} />
      </div>
    </div>
  );
}

export default Page;
