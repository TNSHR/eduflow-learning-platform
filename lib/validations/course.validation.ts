import { z } from "zod";

export const createCourseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Course title must be at least 3 characters long")
    .max(150, "Course title must be less than 150 characters"),

  description: z
    .string()
    .trim()
    .min(20, "Course description must be at least 20 characters long")
    .max(2000, "Course description must be less than 2000 characters"),

  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Course slug must be at least 3 characters long")
    .max(160, "Course slug must be less than 160 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can contain only lowercase letters, numbers, and hyphens"
    ),
});

export const updateCourseSchema = createCourseSchema.partial();