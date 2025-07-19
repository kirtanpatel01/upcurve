import { ExerciseCardType } from "@/components/exercise/ExCards";

export function calculatePerformance(setReps: number[], exercise: ExerciseCardType) {
  const performance = setReps.map((achieved, idx) => {
    const target = exercise.type === 'reps' ? exercise.reps : exercise.duration;
    return {
      set: idx + 1,
      target,
      achieved,
      completionRate: target ? Math.round((achieved / target) * 100) : 0,
    };
  });

  const overallCompletion = Math.round(
    performance.reduce((acc, p) => acc + p.completionRate, 0) / performance.length
  );

  return { performance, overallCompletion };
}
