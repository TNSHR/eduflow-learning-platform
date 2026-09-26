import { NextResponse } from "next/server";
import { UserRole } from "@/generated/prisma/client";
import { requireRole } from "@/lib/auth/authorization";
import {
  deleteCourse,
  getCourseById,
  updateCourse,
} from "@/lib/services/course.service";
import { updateCourseSchema } from "@/lib/validations/course.validation";
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

    return NextResponse.json({
      success: true,
      course,
    });
  } catch (error) {
    console.error("Get course error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch course",
      },
      { status: 500 }
    );
  }
}

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
          message: "You are not allowed to update this course",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const validation = updateCourseSchema.safeParse(body);

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

    const updatedCourse = await updateCourse(
      id,
      validation.data
    );

    return NextResponse.json({
      success: true,
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Update course error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update course",
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
          message: "You are not allowed to delete this course",
        },
        { status: 403 }
      );
    }

    await deleteCourse(id);

    return NextResponse.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to delete course",
      },
      { status: 500 }
    );
  }
}