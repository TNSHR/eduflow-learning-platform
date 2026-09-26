import { NextResponse } from "next/server";
import { Prisma, UserRole } from "@/generated/prisma/client";
import { requireRole } from "@/lib/auth/authorization";
import { getCourseById } from "@/lib/services/course.service";
import {
  createLesson,
  getLessonsByCourse,
} from "@/lib/services/lesson.service";
import { createLessonSchema } from "@/lib/validations/lesson.validation";
import { AppError } from "@/lib/utils/app-error";
import { validateRequestOrigin } from "@/lib/security/request-security";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

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

    const lessons = await getLessonsByCourse(id);

    return NextResponse.json({
      success: true,
      lessons,
    });
  } catch (error) {
    console.error("Get lessons error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch lessons",
      },
      { status: 500 }
    );
  }
}

export async function POST(
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

    const { id } = await context.params;

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

    const validation = createLessonSchema.safeParse(body);

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

    const lesson = await createLesson(id, validation.data);

    return NextResponse.json(
      {
        success: true,
        message: "Lesson created successfully",
        lesson,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create lesson error:", error);

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

    if (error instanceof AppError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create lesson",
      },
      { status: 500 }
    );
  }
}