import { db } from "@/lib/db";
import { exercises, exerciseLogs } from "@/lib/db/schema";
import { getUser } from "@/lib/auth";
import { eq, desc, inArray } from "drizzle-orm";

export async function getAllExercisesByUser() {
  const user = await getUser();
  if (!user) return [];
  
  return db
    .select()
    .from(exercises)
    .where(eq(exercises.userId, user.id))
    .orderBy(desc(exercises.createdAt));
}

export async function getExerciseLogs() {
  const user = await getUser();
  if (!user) return [];
  
  const userExercises = await db
    .select({ id: exercises.id })
    .from(exercises)
    .where(eq(exercises.userId, user.id));
    
  if (userExercises.length === 0) return [];
  
  const exerciseIds = userExercises.map(e => e.id);
  
  return db
    .select()
    .from(exerciseLogs)
    .where(inArray(exerciseLogs.exerciseId, exerciseIds))
    .orderBy(desc(exerciseLogs.createdAt));
}
