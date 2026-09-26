import { describe, expect, it } from "vitest";
import {
  createCourseSchema,
  updateCourseSchema,
} from "@/lib/validations/course.validation";

describe("createCourseSchema", () => {
  it("accepts valid course data", () => {
    const result = createCourseSchema.safeParse({
      title: "Modern JavaScript",
      description:
        "Learn modern JavaScript concepts including asynchronous programming and APIs.",
      slug: "modern-javascript",
    });

    expect(result.success).toBe(true);
  });

  it("normalizes title, description and slug whitespace", () => {
    const result = createCourseSchema.safeParse({
      title: "  Modern JavaScript  ",
      description:
        "  Learn modern JavaScript concepts including asynchronous programming and APIs.  ",
      slug: "  Modern-JavaScript  ",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.title).toBe("Modern JavaScript");
      expect(result.data.slug).toBe("modern-javascript");
    }
  });

  it("rejects a short title", () => {
    const result = createCourseSchema.safeParse({
      title: "JS",
      description:
        "Learn modern JavaScript concepts including asynchronous programming and APIs.",
      slug: "modern-javascript",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a short description", () => {
    const result = createCourseSchema.safeParse({
      title: "Modern JavaScript",
      description: "Short description",
      slug: "modern-javascript",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid slug", () => {
    const result = createCourseSchema.safeParse({
      title: "Modern JavaScript",
      description:
        "Learn modern JavaScript concepts including asynchronous programming and APIs.",
      slug: "Modern JavaScript!",
    });

    expect(result.success).toBe(false);
  });

  it("accepts partial data for course updates", () => {
    const result = updateCourseSchema.safeParse({
      title: "Updated JavaScript Course",
    });

    expect(result.success).toBe(true);
  });
});
