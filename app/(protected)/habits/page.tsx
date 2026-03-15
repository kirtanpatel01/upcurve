import HabitList from "./components/habit-list";
import { format } from "date-fns";
import { Suspense } from "react";
import ArchivedHabits from "./components/archived-habits";
import HabitStoreProvider from "./components/habit-store-provider";
import HabitTabs from "./components/habit-tabs";
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
import InsightsRadialChart from "./components/insights-radial-chart";
import InsightsAreaChart from "./components/insights-area-chart";

export default async function HabitsPage() {
  const today = format(new Date(), "yyyy-MM-dd");

  const [habits, executions, archivedHabits] = await Promise.all([
    getHabitsData(),
    getHabitExecutionsData(today),
    getArchivedHabitsData(),
  ]);

  // We fetch historical data but don't AWAIT it here, or we await it in a separate block
  const historicalStatsPromise = getHistoricalExecutionsData(30);

  return (
    <HabitStoreProvider
      initialHabits={habits}
      initialArchivedHabits={archivedHabits}
      initialExecutions={executions}
      historicalStats={await historicalStatsPromise || []}
      today={today}
    >
      {/* Desktop View */}
      <div className="hidden md:flex w-full gap-4 items-start p-4">
        <div className="space-y-4 flex-1 max-w-lg">
          <HabitList />

          {archivedHabits?.length > 0 && (
            <Accordion type="single" collapsible className="mt-8 border-none">
              <AccordionItem value="archived" className="border-none">
                <AccordionTrigger className="hover:no-underline opacity-60 text-sm">
                  View Archived Habits
                </AccordionTrigger>
                <AccordionContent>
                  <ArchivedHabits />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>

        <div className="w-full max-w-md 2xl:max-w-lg space-y-4">
          <InsightsRadialChart />
          <InsightsAreaChart />
        </div>
      </div>

      {/* Mobile View */}
      <Suspense>
        <HabitTabs />
      </Suspense>
    </HabitStoreProvider>
  );
}
