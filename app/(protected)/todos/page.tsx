import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TodoList from "./components/TodoList";
import { TodosChart } from "./components/todos-charts";
import TodoInsights from "./components/todos-insights";

export default async function page() {
  return (
    <div className="">
      <div className="p-3 sm:p-4 hidden xl:flex flex-col xl:flex-row gap-3 sm:gap-4">
        <TodoList />
        <div className="flex-1 space-y-3 sm:space-y-4 max-w-2xl">
          <TodoInsights />
          <TodosChart />
        </div>
      </div>
      <div className="xl:hidden p-3">
        <Tabs defaultValue="todos">
          <TabsList className="w-full">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          <TabsContent value="todos">
            <TodoList />
          </TabsContent>
          <TabsContent value="insights" className="space-y-3">
            <TodoInsights />
            <TodosChart />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
