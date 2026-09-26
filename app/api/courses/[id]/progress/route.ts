import { NextResponse } from "next/server";
import { UserRole } from "@/generated/prisma/client";
import { getCurrentUser } from "@/lib/auth/session";
import {
  getCourseProgress,
  updateEnrollmentProgress,
} from "@/lib/services/progress.service";
import { updateProgressSchema } from "@/lib/validations/progress.validation";

type ProgressRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: ProgressRouteProps
) {
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
          message: "Only students can access course progress",
        },
        { status: 403 }
      );
    }

    const { id: courseId } = await params;

    const progress = await getCourseProgress(user.id, courseId);

    if (!progress) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not enrolled in this course",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error("Get course progress error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch course progress",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: ProgressRouteProps
) {
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
          message: "Only students can update course progress",
        },
        { status: 403 }
      );
    }

    const { id: courseId } = await params;

    const body = await request.json();

    const validation = updateProgressSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid progress value",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const existingProgress = await getCourseProgress(
      user.id,
      courseId
    );

    if (!existingProgress) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not enrolled in this course",
        },
        { status: 403 }
      );
    }

    /*
     * Progress should never move backwards.
     *
     * Example:
     * Current = 50
     * Requested = 25
     * Result remains = 50
     */
    const nextProgress = Math.max(
      existingProgress.progress,
      validation.data.progress
    );

    const progress = await updateEnrollmentProgress(
      user.id,
      courseId,
      nextProgress
    );

    return NextResponse.json({
      success: true,
      message: "Course progress updated",
      progress,
    });
  } catch (error) {
    console.error("Update course progress error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update course progress",
      },
      { status: 500 }
    );
  }
}