import z from "zod";

export const formSchema = z.object({
  title: z
    .string()
    .min(1, "Todo title is required.")
    .max(100, "Todo title is too long."),
});
