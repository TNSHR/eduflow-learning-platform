import { z } from "zod";

export const createLessonSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Lesson title must be at least 3 characters long")
    .max(200, "Lesson title must be less than 200 characters"),

  content: z
    .string()
    .trim()
    .min(10, "Lesson content must be at least 10 characters long")
    .max(10000, "Lesson content must be less than 10000 characters"),

  order: z
    .number()
    .int("Lesson order must be an integer")
    .min(1, "Lesson order must be at least 1"),
});

export const updateLessonSchema = createLessonSchema.partial();