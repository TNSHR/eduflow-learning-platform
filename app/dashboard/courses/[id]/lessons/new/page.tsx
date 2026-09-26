import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { UserRole } from "@/generated/prisma/client";
import { getCurrentUser } from "@/lib/auth/session";
import { getCourseById } from "@/lib/services/course.service";
import LessonCreateForm from "@/components/lessons/lesson-create-form";

type NewLessonPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NewLessonPage({
  params,
}: NewLessonPageProps) {
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

  const { id } = await params;

  const course = await getCourseById(id);

  if (!course) {
    notFound();
  }

  const canManage =
    user.role === UserRole.ADMIN ||
    course.instructorId === user.id;

  if (!canManage) {
    redirect("/dashboard/courses");
  }

  const nextOrder =
    course.lessons.length > 0
      ? Math.max(...course.lessons.map((lesson) => lesson.order)) + 1
      : 1;

  return (
    <main className="min-h-screen bg-gray-50 p-6 sm:p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link
            href={`/dashboard/courses/${course.id}`}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← Back to course
          </Link>

          <p className="mt-6 text-sm font-medium text-gray-500">
            {course.title}
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Add Lesson
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Add learning content to this course.
          </p>
        </div>

        <LessonCreateForm
          courseId={course.id}
          initialOrder={nextOrder}
        />
      </div>
    </main>
  );
}
