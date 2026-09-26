import { NextResponse } from "next/server";
import { UserRole } from "@/generated/prisma/client";
import { getCurrentUser } from "@/lib/auth/session";
import { getEnrollment } from "@/lib/services/enrollment.service";
import { getLessonById } from "@/lib/services/lesson.service";
import {
  completeLesson,
  getCourseProgress,
} from "@/lib/services/progress.service";
import { prisma } from "@/lib/db/prisma";
import { validateRequestOrigin } from "@/lib/security/request-security";

type CompleteLessonRouteProps = {
  params: Promise<{
    id: string;
    lessonId: string;
  }>;
};

export async function POST(
  request: Request,
  { params }: CompleteLessonRouteProps
) {
    const originError = validateRequestOrigin(request);

if (originError) {
  return originError;
}
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
        },
        { status: 401 }
      );
    }

    if (user.role !== UserRole.STUDENT) {
      return NextResponse.json(
        {
          success: false,
          message: "Only students can complete lessons",
        },
        { status: 403 }
      );
    }

    const { id: courseId, lessonId } = await params;

    const lesson = await getLessonById(lessonId);

    if (!lesson) {
      return NextResponse.json(
        {
          success: false,
          message: "Lesson not found",
        },
        { status: 404 }
      );
    }

    if (lesson.course.id !== courseId) {
      return NextResponse.json(
        {
          success: false,
          message: "Lesson does not belong to this course",
        },
        { status: 400 }
      );
    }

    const enrollment = await getEnrollment(
      user.id,
      courseId
    );

    if (!enrollment) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not enrolled in this course",
        },
        { status: 403 }
      );
    }

    await completeLesson(user.id, lessonId);

    const progress = await getCourseProgress(
      user.id,
      courseId
    );

    if (!progress) {
      return NextResponse.json(
        {
          success: false,
          message: "Unable to calculate course progress",
        },
        { status: 500 }
      );
    }

    await prisma.enrollment.update({
      where: {
        studentId_courseId: {
          studentId: user.id,
          courseId,
        },
      },
      data: {
        progress: progress.progress,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Lesson completed successfully",
      progress: {
        percentage: progress.progress,
        completedLessons: progress.completedLessons,
        totalLessons: progress.totalLessons,
      },
    });
  } catch (error) {
    console.error("Complete lesson error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to complete lesson",
      },
      { status: 500 }
    );
  }
}