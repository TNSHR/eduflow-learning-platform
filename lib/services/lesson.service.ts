import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@/generated/prisma/client";

export async function createLesson(
  courseId: string,
  data: Prisma.LessonCreateWithoutCourseInput
) {
  return prisma.lesson.create({
    data: {
      ...data,
      course: {
        connect: {
          id: courseId,
        },
      },
    },
  });
}

export async function getLessonsByCourse(courseId: string) {
  return prisma.lesson.findMany({
    where: {
      courseId,
    },
    orderBy: {
      order: "asc",
    },
  });
}

export async function getLessonById(lessonId: string) {
  return prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          instructorId: true,
        },
      },
    },
  });
}

export async function updateLesson(
  lessonId: string,
  data: Prisma.LessonUpdateInput
) {
  return prisma.lesson.update({
    where: {
      id: lessonId,
    },
    data,
  });
}

export async function deleteLesson(lessonId: string) {
  return prisma.lesson.delete({
    where: {
      id: lessonId,
    },
  });
}