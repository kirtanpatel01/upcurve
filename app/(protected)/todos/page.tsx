import { createClient } from "@/utils/supabase/server";
import TodoList from "./components/TodoList";
import TodosBarChart from "./components/TodosBarChart";
import TodoInsights from "./components/todos-insights";

export default async function page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>You&apos;re not authenticated!</div>;
  }

  const { data: todos, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (
  <div className="min-h-[calc(100vh-3.5rem)] flex flex-col xl:flex-row p-4 gap-4">
    
    <div className="w-full max-w-md flex flex-col items-center gap-4 rounded-xl p-4 md:p-8 bg-accent border border-primary/25">
      <TodoList initialTodos={todos} />
    </div>

    <div className="w-full max-w-6xl space-y-4 flex flex-col">
      <TodosBarChart initialTodos={todos} />
    </div>

    <TodoInsights todos={todos} />
  </div>
);
}
