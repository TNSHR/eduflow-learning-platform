import { z } from "zod";

export const updateProgressSchema = z.object({
  progress: z
    .number()
    .int("Progress must be an integer")
    .min(0, "Progress cannot be less than 0")
    .max(100, "Progress cannot be greater than 100"),
});