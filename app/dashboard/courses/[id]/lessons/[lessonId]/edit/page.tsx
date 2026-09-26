import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { UserRole } from "@/generated/prisma/client";
import { getCurrentUser } from "@/lib/auth/session";
import { getLessonById } from "@/lib/services/lesson.service";
import LessonEditForm from "@/components/lessons/lesson-edit-form";

type LessonEditPageProps = {
  params: Promise<{
    id: string;
    lessonId: string;
  }>;
};

export default async function LessonEditPage({
  params,
}: LessonEditPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (
    user.role !== UserRole.TEACHER &&
    user.role !== UserRole.ADMIN
  ) {
    redirect("/dashboard");
  }

  const { id, lessonId } = await params;

  const lesson = await getLessonById(lessonId);

  if (!lesson) {
    notFound();
  }

  // Make sure the lesson belongs to the course in the URL.
  if (lesson.course.id !== id) {
    notFound();
  }

  const canManage =
    user.role === UserRole.ADMIN ||
    lesson.course.instructorId === user.id;

  if (!canManage) {
    redirect("/dashboard/courses");
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 sm:p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link
            href={`/dashboard/courses/${id}`}
            className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
          >
            ← Back to course
          </Link>

          <p className="mt-6 text-sm font-medium text-gray-500">
            {lesson.course.title}
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Edit Lesson
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Update the lesson content and ordering.
          </p>
        </div>

        <LessonEditForm
          courseId={id}
          lessonId={lesson.id}
          initialTitle={lesson.title}
          initialContent={lesson.content}
          initialOrder={lesson.order}
        />
      </div>
    </main>
  );
}
