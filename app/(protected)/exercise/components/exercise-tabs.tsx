"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ExerciseDashboard from "./exercise-dashboard";

export default function ExerciseTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rawTab = searchParams.get("tab");
  const currentTab = (!rawTab || rawTab === "exercises") ? "activity" : rawTab;

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="w-full mb-3">
        <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
        <TabsTrigger value="insights" className="flex-1">Insights</TabsTrigger>
      </TabsList>
      
      <TabsContent value="activity" className="mt-0">
        <ExerciseDashboard view="activity" />
      </TabsContent>
      
      <TabsContent value="insights" className="mt-0">
        <ExerciseDashboard view="insights" />
      </TabsContent>
    </Tabs>
  );
}
