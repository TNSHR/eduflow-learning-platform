import { NextResponse } from "next/server";
import { UserRole } from "@/generated/prisma/client";
import { getCurrentUser } from "@/lib/auth/session";
import { getEnrollment } from "@/lib/services/enrollment.service";
import {
  createQuizAttempt,
  getQuizByLessonId,
  getQuizForEvaluation,
} from "@/lib/services/quiz.service";
import { submitQuizSchema } from "@/lib/validations/quiz.validation";
import { validateRequestOrigin } from "@/lib/security/request-security";

type SubmitQuizRouteProps = {
  params: Promise<{
    id: string;
    lessonId: string;
  }>;
};

export async function POST(
  request: Request,
  { params }: SubmitQuizRouteProps
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
          message: "Only students can submit quizzes",
        },
        { status: 403 }
      );
    }

    const { id: courseId, lessonId } = await params;

    const enrollment = await getEnrollment(user.id, courseId);

    if (!enrollment) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not enrolled in this course",
        },
        { status: 403 }
      );
    }

    const quiz = await getQuizByLessonId(lessonId);

    if (!quiz) {
      return NextResponse.json(
        {
          success: false,
          message: "Quiz not found",
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    const validationResult = submitQuizSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const evaluationQuiz = await getQuizForEvaluation(quiz.id);

    if (!evaluationQuiz) {
      return NextResponse.json(
        {
          success: false,
          message: "Unable to evaluate quiz",
        },
        { status: 500 }
      );
    }

    const submittedAnswers = validationResult.data.answers;

    let correctAnswers = 0;

    for (const question of evaluationQuiz.questions) {
      const submittedAnswer = submittedAnswers[question.id];

      if (
        submittedAnswer &&
        submittedAnswer === question.answer
      ) {
        correctAnswers++;
      }
    }

    const totalQuestions = evaluationQuiz.questions.length;

    const score =
      totalQuestions === 0
        ? 0
        : Math.round((correctAnswers / totalQuestions) * 100);

    const attempt = await createQuizAttempt(
      quiz.id,
      user.id,
      score
    );

    return NextResponse.json({
      success: true,
      message: "Quiz submitted successfully",
      result: {
        score,
        correctAnswers,
        totalQuestions,
        attemptId: attempt.id,
        attemptedAt: attempt.attemptedAt,
      },
    });
  } catch (error) {
    console.error("Submit quiz error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit quiz",
      },
      { status: 500 }
    );
  }
}
