import { prisma } from "@/lib/db/prisma";

export async function createEnrollment(
  studentId: string,
  courseId: string
) {
  return prisma.enrollment.create({
    data: {
      student: {
        connect: {
          id: studentId,
        },
      },
      course: {
        connect: {
          id: courseId,
        },
      },
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          status: true,
        },
      },
    },
  });
}

export async function getStudentEnrollments(studentId: string) {
  return prisma.enrollment.findMany({
    where: {
      studentId,
    },
    orderBy: {
      enrolledAt: "desc",
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          status: true,
          instructor: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              lessons: true,
            },
          },
        },
      },
    },
  });
}

export async function getEnrollment(
  studentId: string,
  courseId: string
) {
  return prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId,
        courseId,
      },
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          status: true,
        },
      },
    },
  });
}

export async function deleteEnrollment(
  studentId: string,
  courseId: string
) {
  return prisma.enrollment.delete({
    where: {
      studentId_courseId: {
        studentId,
        courseId,
      },
    },
  });
}