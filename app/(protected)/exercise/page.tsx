import { getAllExercisesByUser, getExerciseLogs } from "./data";
import ExerciseStoreProvider from "./components/exercise-store-provider";
import ExerciseSidebar from "./components/exercise-sidebar";
import ExerciseDashboard from "./components/exercise-dashboard";
import AddExerciseDialog from "./components/add-exercise-dialog";
import { TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ClientTabs from "../habits/components/client-tabs";

export const dynamic = "force-dynamic";

export default async function ExercisePage(props: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const searchParams = await props.searchParams;
  const currentTab = searchParams.tab || "exercises";
  const exercises = await getAllExercisesByUser();
  const logs = await getExerciseLogs();

  return (
    <div className="w-full max-w-xl md:max-w-6xl flex flex-col md:flex-row h-[calc(100dvh-4rem)] md:min-h-[calc(100vh-4rem)] overflow-hidden">
      <ExerciseStoreProvider initialExercises={exercises} initialLogs={logs}>
        {/* Mobile View: Persistent Selector + Tabs */}
        <div className="flex md:hidden flex-col w-full h-full overflow-hidden">
          {/* Top Persistent Exercise Selector */}
          <div className="p-3 border-b bg-background sticky top-0 z-10 space-y-2 flex-shrink-0">
            <div className="flex justify-between items-center px-1">
              <h1 className="text-lg font-bold tracking-tight">Exercises</h1>
              <AddExerciseDialog />
            </div>
            <ExerciseSidebar />
          </div>

          {/* Activity / Insights Tabs */}
          <div className="p-3 flex-1 overflow-y-auto">
            <ClientTabs currentTab={currentTab === "exercises" ? "activity" : currentTab}>
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
            </ClientTabs>
          </div>
        </div>

        {/* Desktop View: Sidebar + Hub */}
        <div className="hidden md:flex w-full">
          {/* Left Sidebar */}
          <aside className="h-full w-72 flex-shrink-0 flex flex-col gap-3 p-3 border-r">
            <div className="flex justify-between items-center px-1">
              <h1 className="text-lg font-bold tracking-tight">Exercises</h1>
              <AddExerciseDialog />
            </div>
            <ExerciseSidebar />
          </aside>

          {/* Right Active Hub */}
          <main className="h-full flex-1 p-3">
            <ExerciseDashboard />
          </main>
        </div>
      </ExerciseStoreProvider>
    </div>
  );
}
