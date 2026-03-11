"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import TodoList from "./todo-list";
import { TodosChart } from "./todos-charts";
import TodoInsights from "./todos-insights";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TodoTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "todos";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="lg:hidden p-3 overflow-hidden">
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <TabsList className="w-full">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="todos">
          <TodoList />
        </TabsContent>
        <TabsContent value="archived">
          <ScrollArea className="h-[calc(100vh-7.8rem)]">
            <TodoList view="archived" />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="insights">
          <ScrollArea className="h-[calc(100vh-7.8rem)]">
            <TodoInsights />
            <TodosChart />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
