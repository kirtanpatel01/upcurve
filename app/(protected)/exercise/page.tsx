import Link from "next/link";
import AddExerciseDialog from "./components/add-exercise-dialog";
import { getAllExercisesByUser, getExerciseLogs, getUser } from "./data";
import { Button } from "@/components/ui/button";
import ExerciseLogCard from "./components/exercise-log-card";
import { Exercise, ExerciseLog } from "./types";
import ExerciseSelection from "./components/exercise-selection";
import ExercisesBarChart from "./components/exercise-bar-chart";
import ExerciseInsights from "./components/exercise-insights";

async function page() {
  const user = await getUser();
  if (!user)
    return (
      <div className="min-h-[95%] w-full flex flex-col justify-center items-center gap-6">
        <span className="text-9xl font-bold">401</span>
        <div className="flex items-center gap-2">
          Unauthenticated!{" "}
          <Link href={"/auth/login"}>
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    );

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
