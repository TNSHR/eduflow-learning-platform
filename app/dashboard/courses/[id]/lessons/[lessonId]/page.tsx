import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { UserRole } from "@/generated/prisma/client";
import { getCurrentUser } from "@/lib/auth/session";
import { getLessonById } from "@/lib/services/lesson.service";
import { getEnrollment } from "@/lib/services/enrollment.service";
import { getCourseProgress } from "@/lib/services/progress.service";

import LessonProgressButton from "@/components/lessons/lesson-progress-button";
import { prisma } from "@/lib/db/prisma";
import QuizSection from "@/components/quizzes/quiz-section";

type LessonPageProps = {
  params: Promise<{
    id: string;
    lessonId: string;
  }>;
};

export default async function LessonPage({
  params,
}: LessonPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== UserRole.STUDENT) {
    redirect("/dashboard");
  }

  const { id: courseId, lessonId } = await params;

  const lesson = await getLessonById(lessonId);

  if (!lesson) {
    notFound();
  }

  if (lesson.course.id !== courseId) {
    notFound();
  }

  const enrollment = await getEnrollment(
    user.id,
    courseId
  );

  if (!enrollment) {
    redirect(`/dashboard/courses/${courseId}`);
  }

  /*
   * Get the student's actual course progress.
   */
  const progress = await getCourseProgress(
    user.id,
    courseId
  );

  /*
   * Check whether this particular lesson
   * has already been completed.
   */
  const lessonProgress = await prisma.lessonProgress.findUnique({
    where: {
      studentId_lessonId: {
        studentId: user.id,
        lessonId,
      },
    },
    select: {
      completed: true,
      completedAt: true,
    },
  });

  const currentProgress = progress?.progress ?? 0;
  const isCompleted = lessonProgress?.completed ?? false;

  return (
    <main className="min-h-screen bg-gray-50 p-6 sm:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Navigation */}
        <div className="mb-8">
          <Link
            href={`/dashboard/courses/${courseId}`}
            className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
          >
            ← Back to course
          </Link>

          <p className="mt-6 text-sm font-medium text-gray-500">
            {lesson.course.title}
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Lesson {lesson.order}: {lesson.title}
          </h1>
        </div>

        {/* Lesson Content */}
        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <p className="mb-6 text-sm font-medium text-gray-500">
              Lesson {lesson.order}
            </p>

            <h2 className="text-2xl font-bold text-gray-900">
              {lesson.title}
            </h2>

            <div className="mt-6">
              <p className="whitespace-pre-wrap text-base leading-8 text-gray-700">
                {lesson.content}
              </p>
            </div>
          </div>
        </article>

        {/* Progress */}
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="font-semibold text-gray-900">
              Your Learning Progress
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Complete this lesson to update your course progress.
            </p>
          </div>

          <LessonProgressButton
            courseId={courseId}
            lessonId={lessonId}
            progress={currentProgress}
            isCompleted={isCompleted}
          />
        </section>

        <section className="mt-6">
  <QuizSection
  courseId={courseId}
  lessonId={lessonId}
/>
</section>
      </div>
    </main>
  );
}
