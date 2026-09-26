import { prisma } from "@/lib/db/prisma";

export async function getCourseProgress(
  studentId: string,
  courseId: string
) {
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId,
        courseId,
      },
    },
    select: {
      id: true,
      progress: true,
      enrolledAt: true,
      updatedAt: true,
      courseId: true,
      course: {
        select: {
          id: true,
          _count: {
            select: {
              lessons: true,
            },
          },
        },
      },
    },
  });

  if (!enrollment) {
    return null;
  }

  const completedLessons = await prisma.lessonProgress.count({
    where: {
      studentId,
      lesson: {
        courseId,
      },
      completed: true,
    },
  });

  const totalLessons = enrollment.course._count.lessons;

  const calculatedProgress =
    totalLessons === 0
      ? 0
      : Math.round((completedLessons / totalLessons) * 100);

  return {
    enrollmentId: enrollment.id,
    courseId: enrollment.courseId,
    progress: calculatedProgress,
    completedLessons,
    totalLessons,
    enrolledAt: enrollment.enrolledAt,
    updatedAt: enrollment.updatedAt,
  };
}

export async function completeLesson(
  studentId: string,
  lessonId: string
) {
  return prisma.lessonProgress.upsert({
    where: {
      studentId_lessonId: {
        studentId,
        lessonId,
      },
    },
    update: {
      completed: true,
      completedAt: new Date(),
    },
    create: {
      studentId,
      lessonId,
      completed: true,
      completedAt: new Date(),
    },
  });
}

export async function updateEnrollmentProgress(
  studentId: string,
  courseId: string,
  progress: number
) {
  return prisma.enrollment.update({
    where: {
      studentId_courseId: {
        studentId,
        courseId,
      },
    },
    data: {
      progress,
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
}