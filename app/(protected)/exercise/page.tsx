import AddExerciseDialog from "./components/add-exercise-dialog";
import { getAllExercisesByUser, getExerciseLogs, getUser } from "./data";
import ExerciseLogCard from "./components/exercise-log-card";
import { Exercise, ExerciseLog } from "./types";
import ExerciseSelection from "./components/exercise-selection";
import ExercisesBarChart from "./components/exercise-bar-chart";
import ExerciseInsights from "./components/exercise-insights";
import Unauthenticated from "@/components/unauthenticated";
import { createClient } from "@/utils/supabase/server";

async function page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <Unauthenticated />

  const exercises: Exercise[] = await getAllExercisesByUser();
  const exercisesLogs: ExerciseLog[] = await getExerciseLogs();

  return (
    <div className="p-4 space-y-4">
      <header className="flex gap-4">
        <ExerciseSelection exercises={exercises} />
        <AddExerciseDialog />
      </header>

      <main className="flex gap-4 flex-wrap">
        <ExerciseLogCard />

        <ExercisesBarChart
          initialExercises={exercises}
          initialLogs={exercisesLogs}
        />

        <ExerciseInsights initialLogs={exercisesLogs} />
      </main>
    </div>
  );
}

export default page;
