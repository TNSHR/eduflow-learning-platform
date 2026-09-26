import { z } from "zod";

export const createQuizSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Quiz title must be at least 3 characters long")
    .max(200, "Quiz title must be less than 200 characters"),

  questions: z
    .array(
      z.object({
        text: z
          .string()
          .trim()
          .min(5, "Question must be at least 5 characters long")
          .max(1000, "Question must be less than 1000 characters"),

        options: z
          .array(
            z
              .string()
              .trim()
              .min(1, "Option cannot be empty")
              .max(300, "Option must be less than 300 characters")
          )
          .min(2, "A question must have at least 2 options")
          .max(6, "A question cannot have more than 6 options"),

        answer: z
          .string()
          .trim()
          .min(1, "Correct answer is required"),
      })
    )
    .min(1, "Quiz must contain at least one question")
    .max(50, "Quiz cannot contain more than 50 questions"),
});

export const submitQuizSchema = z.object({
  answers: z.record(z.string(), z.string()),
});
