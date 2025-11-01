// page.tsx

"use client";
import { Separator } from "@/components/ui/separator";
import Review from "./components/Review";
import TodoList from "./components/TodoList";
import { useUser } from "@/utils/supabase/use-user";
import { useTodosByUser } from "./hooks/use-todos-by-user";

function Page() {
  const { user, loading: userLoading } = useUser();
  const { data: todos, isLoading: todosLoading } = useTodosByUser(user?.id);
  const loading = userLoading || todosLoading;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col sm:flex-row">
      <div className="flex flex-col items-center gap-4 rounded-xl p-4 md:p-8 bg-accent m-4 border border-primary/25">
        <TodoList todos={todos || []} loading={loading} />
      </div>
      <Separator orientation="vertical" className="hidden sm:block" />
      <Separator orientation="horizontal" className="sm:hidden" />
      <div>
        <Review todos={todos || []} loading={loading} />
      </div>
    </div>
  );
}

export default Page;
