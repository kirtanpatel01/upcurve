"use client";

import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger 
} from "@/components/ui/tabs";
import HabitList from "./habit-list";
import ArchivedHabits from "./archived-habits";
import InsightsRadialChart from "./insights-radial-chart";
import InsightsAreaChart from "./insights-area-chart";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function HabitTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "active";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="block md:hidden p-3">
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <TabsList className="w-full">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <HabitList />
        </TabsContent>
        <TabsContent value="archived">
          <ArchivedHabits />
        </TabsContent>
        <TabsContent value="insights" className="space-y-3">
          <InsightsRadialChart />
          <InsightsAreaChart />
        </TabsContent>
      </Tabs>
    </div>
  );
}
