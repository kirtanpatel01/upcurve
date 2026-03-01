import TodoList from "./components/TodoList";
import { TodosChart } from "./components/todos-charts";
import TodoInsights from "./components/todos-insights";

export default async function page() {
  return (
    <div className="p-3 sm:p-4 flex flex-col xl:flex-row gap-3 sm:gap-4">
      <TodoList />
      <div className="flex-1 space-y-3 sm:space-y-4 max-w-2xl">
        <TodoInsights />
        <TodosChart />
      </div>
    </div>
  );
}
