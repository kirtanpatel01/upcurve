import HabitList from "./components/habit-list";
import { format } from "date-fns";
import { TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ArchivedHabits from "./components/archived-habits";
import HabitStoreProvider from "./components/habit-store-provider";
import InsightsTab from "./components/insights-tab";
import ClientTabs from "./components/client-tabs";
import {
  getHabitsData,
  getHabitExecutionsData,
  getArchivedHabitsData,
  getHistoricalExecutionsData,
} from "./data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default async function HabitsPage(props: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const searchParams = await props.searchParams;
  const currentTab = searchParams.tab || "active";
  const today = format(new Date(), "yyyy-MM-dd");

  const [habits, executions, archivedHabits, historicalStats] = await Promise.all([
    getHabitsData(),
    getHabitExecutionsData(today),
    getArchivedHabitsData(),
    getHistoricalExecutionsData(30),
  ]);

  return (
    <div className="p-3 w-full max-w-xl md:max-w-5xl">
      <HabitStoreProvider
        initialHabits={habits}
        initialArchivedHabits={archivedHabits}
        initialExecutions={executions}
        today={today}
      >
        {/* Mobile View: Tabs */}
        <div className="block md:hidden">
          <ClientTabs currentTab={currentTab}>
            <TabsList className="w-full">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              <HabitList
                initialHabits={habits}
                initialExecutions={executions}
              />
            </TabsContent>
            <TabsContent value="archived">
              <ArchivedHabits initialArchivedHabits={archivedHabits} />
            </TabsContent>
            <TabsContent value="insights">
              <InsightsTab 
                historicalData={historicalStats || []}
                initialHabits={habits}
                initialExecutions={executions}
              />
            </TabsContent>
          </ClientTabs>
        </div>

        {/* Desktop View: Grid Layout */}
        <div className="hidden md:grid md:grid-cols-[1fr_350px] lg:grid-cols-[1fr_400px] gap-4 items-start">
          <div className="space-y-2">
            <HabitList
              initialHabits={habits}
              initialExecutions={executions}
            />
            
            {archivedHabits && archivedHabits.length > 0 && (
              <Accordion type="single" collapsible className="mt-8">
                <AccordionItem value="archived" className="border-none">
                  <AccordionTrigger className="py-3 hover:no-underline">
                    View Archived Habits
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
                    <ArchivedHabits initialArchivedHabits={archivedHabits} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
          
          <InsightsTab 
            historicalData={historicalStats || []}
            initialHabits={habits}
            initialExecutions={executions}
          />
        </div>
      </HabitStoreProvider>
    </div>
  );
}
