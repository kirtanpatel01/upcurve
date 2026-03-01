import z from "zod";

export const formSchema = z.object({
  title: z
    .string()
    .min(3, "Todo title must be 3 or more characters.")
    .max(32, "Todo title can't be more than 32 characters."),
  desc: z.string().optional(),
  deadline: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"], {
    error: "Priority is required.",
  }),
});
