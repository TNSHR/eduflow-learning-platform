import { NextResponse } from "next/server";
import { Prisma, UserRole } from "@/generated/prisma/client";
import { requireRole } from "@/lib/auth/authorization";
import { getCourseById } from "@/lib/services/course.service";
import {
  deleteLesson,
  getLessonById,
  updateLesson,
} from "@/lib/services/lesson.service";
import { updateLessonSchema } from "@/lib/validations/lesson.validation";
import { validateRequestOrigin } from "@/lib/security/request-security";

type RouteContext = {
  params: Promise<{
    id: string;
    lessonId: string;
  }>;
};

export async function PATCH(
  request: Request,
  context: RouteContext
) {

  const originError = validateRequestOrigin(request);

if (originError) {
  return originError;
}
  try {
    const user = await requireRole([
      UserRole.TEACHER,
      UserRole.ADMIN,
    ]);

    const { id, lessonId } = await context.params;

    const course = await getCourseById(id);

    if (!course) {
      return NextResponse.json(
        {
          success: false,
          message: "Course not found",
        },
        { status: 404 }
      );
    }

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

    if (lesson.course.id !== id) {
      return NextResponse.json(
        {
          success: false,
          message: "Lesson does not belong to this course",
        },
        { status: 400 }
      );
    }

    if (
      user.role !== UserRole.ADMIN &&
      course.instructorId !== user.id
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not allowed to manage this course",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const validation = updateLessonSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid lesson data",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const updatedLesson = await updateLesson(
      lessonId,
      validation.data
    );

    return NextResponse.json({
      success: true,
      message: "Lesson updated successfully",
      lesson: updatedLesson,
    });
  } catch (error) {
    console.error("Update lesson error:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "A lesson with this order already exists",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update lesson",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext
) {

  const originError = validateRequestOrigin(request);

if (originError) {
  return originError;
}
  try {
    const user = await requireRole([
      UserRole.TEACHER,
      UserRole.ADMIN,
    ]);

    const { id, lessonId } = await context.params;

    const course = await getCourseById(id);

    if (!course) {
      return NextResponse.json(
        {
          success: false,
          message: "Course not found",
        },
        { status: 404 }
      );
    }

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

    if (lesson.course.id !== id) {
      return NextResponse.json(
        {
          success: false,
          message: "Lesson does not belong to this course",
        },
        { status: 400 }
      );
    }

    if (
      user.role !== UserRole.ADMIN &&
      course.instructorId !== user.id
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not allowed to manage this course",
        },
        { status: 403 }
      );
    }

    await deleteLesson(lessonId);

    return NextResponse.json({
      success: true,
      message: "Lesson deleted successfully",
    });
  } catch (error) {
    console.error("Delete lesson error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to delete lesson",
      },
      { status: 500 }
    );
  }
}