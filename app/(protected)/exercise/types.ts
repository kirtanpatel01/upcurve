export interface ExerciseFormValues {
  id?: number;
  name: string;
  sets: number;
  type: "reps" | "duration";
  goal: number;
}

export interface Exercise extends Omit<ExerciseFormValues, "id"> {
  id: number;
}

export interface ExerciseLogFormValues {
  exercise_id: number;
  values: number[];
}

export interface ExerciseLog extends ExerciseLogFormValues {
  id: number;
  user_id: string;
  created_at: string;
}
