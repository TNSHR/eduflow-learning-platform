import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@/generated/prisma/client";

export async function createCourse(
  instructorId: string,
  data: Prisma.CourseCreateWithoutInstructorInput
) {
  return prisma.course.create({
    data: {
      ...data,
      instructor: {
        connect: {
          id: instructorId,
        },
      },
    },
  });
}

export async function getCourses() {
  return prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          lessons: true,
          enrollments: true,
        },
      },
    },
  });
}

export async function getCourseById(courseId: string) {
  return prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      lessons: {
        orderBy: {
          order: "asc",
        },
      },
      _count: {
        select: {
          enrollments: true,
        },
      },
    },
  });
}

export async function updateCourse(
  courseId: string,
  data: Prisma.CourseUpdateInput
) {
  return prisma.course.update({
    where: {
      id: courseId,
    },
    data,
  });
}

export async function deleteCourse(courseId: string) {
  return prisma.course.delete({
    where: {
      id: courseId,
    },
  });
}