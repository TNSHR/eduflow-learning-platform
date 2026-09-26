import { NextResponse } from "next/server";
import { Prisma, UserRole } from "@/generated/prisma/client";
import { getCurrentUser } from "@/lib/auth/session";
import {
  createEnrollment,
  getStudentEnrollments,
} from "@/lib/services/enrollment.service";
import { createEnrollmentSchema } from "@/lib/validations/enrollment.validation";
import { validateRequestOrigin } from "@/lib/security/request-security";

export async function POST(request: Request) {
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
          message: "Only students can enroll in courses",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const validation = createEnrollmentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid enrollment data",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const enrollment = await createEnrollment(
      user.id,
      validation.data.courseId
    );

    return NextResponse.json(
      {
        success: true,
        message: "Course enrolled successfully",
        enrollment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create enrollment error:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "You are already enrolled in this course",
        },
        { status: 409 }
      );
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Course not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Unable to enroll in course",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
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
          message: "Only students can access enrollments",
        },
        { status: 403 }
      );
    }

    const enrollments = await getStudentEnrollments(user.id);

    return NextResponse.json({
      success: true,
      enrollments,
    });
  } catch (error) {
    console.error("Get enrollments error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch enrollments",
      },
      { status: 500 }
    );
  }
}