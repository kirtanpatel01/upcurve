import { todos } from "@/lib/db/schema";
import { formSchema } from "./validations";
import { z } from "zod";

export type Todo = typeof todos.$inferSelect;
export type TodoInsert = typeof todos.$inferInsert;
export type TodoFormValues = z.infer<typeof formSchema>;