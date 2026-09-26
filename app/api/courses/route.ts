import { NextResponse } from "next/server";
import { UserRole } from "@/generated/prisma/client";
import { requireRole } from "@/lib/auth/authorization";
import { AppError } from "@/lib/utils/app-error";
import { Prisma } from "@/generated/prisma/client";
import {
  createCourse,
  getCourses,
} from "@/lib/services/course.service";
import { createCourseSchema } from "@/lib/validations/course.validation";
import { validateRequestOrigin } from "@/lib/security/request-security";

export async function GET() {
  try {
    const courses = await getCourses();

    return NextResponse.json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Get courses error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch courses",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {

   const originError = validateRequestOrigin(request);

  if (originError) {
    return originError;
  }
  try {
    const user = await requireRole([
      UserRole.TEACHER,
      UserRole.ADMIN,
    ]);

    const body = await request.json();

    const validation = createCourseSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid course data",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const course = await createCourse(
      user.id,
      validation.data
    );

    return NextResponse.json(
      {
        success: true,
        message: "Course created successfully",
        course,
      },
      { status: 201 }
    );
  } catch (error) {
  console.error("Create course error:", error);

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Course slug already exists",
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
      message: "Unable to create course",
    },
    { status: 500 }
  );
}
}