import { z } from "zod";

export const createEnrollmentSchema = z.object({
  courseId: z
    .string()
    .trim()
    .min(1, "Course ID is required"),
});