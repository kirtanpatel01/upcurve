import { InferSelectModel } from "drizzle-orm";
import { exercises, exerciseLogs } from "@/lib/db/schema";

export type Exercise = InferSelectModel<typeof exercises>;
export type ExerciseLog = InferSelectModel<typeof exerciseLogs>;
