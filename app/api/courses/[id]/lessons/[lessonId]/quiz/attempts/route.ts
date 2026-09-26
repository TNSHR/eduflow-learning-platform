import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import {
  getQuizByLessonId,
  getStudentQuizAttempts,
} from "@/lib/services/quiz.service";
import { getLessonById } from "@/lib/services/lesson.service";

type RouteContext = {
  params: Promise<{
    id: string;
    lessonId: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    if (user.role !== "STUDENT") {
      return NextResponse.json(
        { message: "Only students can view quiz attempts" },
        { status: 403 }
      );
    }

    const { id: courseId, lessonId } = await context.params;

    const lesson = await getLessonById(lessonId);

    if (!lesson) {
      return NextResponse.json(
        { message: "Lesson not found" },
        { status: 404 }
      );
    }

    if (lesson.course.id !== courseId) {
      return NextResponse.json(
        { message: "Lesson does not belong to this course" },
        { status: 400 }
      );
    }

    const quiz = await getQuizByLessonId(lessonId);

    if (!quiz) {
      return NextResponse.json(
        { message: "Quiz not found" },
        { status: 404 }
      );
    }

    const result = await getStudentQuizAttempts(
      user.id,
      quiz.id
    );

    /*
     * Normalize the service result so the API always
     * returns a predictable response shape.
     */
    const attempts = Array.isArray(result)
      ? result
      : result.attempts;

    const bestScore =
      attempts.length > 0
        ? Math.max(...attempts.map((attempt) => attempt.score))
        : null;

    return NextResponse.json({
      success: true,
      quizId: quiz.id,
      attempts,
      bestScore,
      totalAttempts: attempts.length,
    });
  } catch (error) {
    console.error("Get quiz attempts error:", error);

    return NextResponse.json(
      {
        message: "Unable to load quiz attempts",
      },
      { status: 500 }
    );
  }
}
