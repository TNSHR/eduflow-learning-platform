import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { UserRole } from "@/generated/prisma/client";
import { getCurrentUser } from "@/lib/auth/session";
import { getLessonById } from "@/lib/services/lesson.service";
import { createQuiz } from "@/lib/services/quiz.service";
import { createQuizSchema } from "@/lib/validations/quiz.validation";

type QuizRouteProps = {
  params: Promise<{
    id: string;
    lessonId: string;
  }>;
};

export async function POST(
  request: Request,
  { params }: QuizRouteProps
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

    if (
      user.role !== UserRole.TEACHER &&
      user.role !== UserRole.ADMIN
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Only teachers and admins can create quizzes",
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

    if (
      user.role === UserRole.TEACHER &&
      lesson.course.instructorId !== user.id
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "You do not have permission to manage this lesson",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const validationResult = createQuizSchema.safeParse(body);

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

    const { title, questions } = validationResult.data;

    const quiz = await createQuiz(
      lessonId,
      title,
      questions
    );

    return NextResponse.json(
      {
        success: true,
        message: "Quiz created successfully",
        quiz,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create quiz error:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "A quiz already exists for this lesson",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create quiz",
      },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: Request,
  { params }: QuizRouteProps
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

    const quiz = await import("@/lib/services/quiz.service").then(
      ({ getQuizByLessonId }) => getQuizByLessonId(lessonId)
    );

    if (!quiz) {
      return NextResponse.json(
        {
          success: false,
          message: "Quiz not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      quiz,
    });
  } catch (error) {
    console.error("Get quiz error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch quiz",
      },
      { status: 500 }
    );
  }
}
