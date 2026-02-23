import TodoList from "./components/TodoList";
import TodosBarChart from "./components/TodosBarChart";
import TodoInsights from "./components/todos-insights";
import Unauthenticated from "@/components/unauthenticated";

export default async function page() {
  // if (!user) return <Unauthenticated />

  return (
  <div className="min-h-[calc(100vh-3.5rem)] flex flex-col xl:flex-row p-4 gap-4">
    
    <div className="w-full max-w-md flex flex-col items-center gap-4 rounded-xl p-4 md:p-8 bg-accent border border-primary/25">
      <TodoList initialTodos={[]} />
    </div>

    <div className="w-full max-w-6xl space-y-4 flex flex-col">
      <TodosBarChart initialTodos={[]} />
    </div>

    <TodoInsights todos={[]} />
  </div>
);
}
