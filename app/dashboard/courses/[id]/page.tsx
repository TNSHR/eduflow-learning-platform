
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { UserRole } from "@/generated/prisma/client";
import { getCurrentUser } from "@/lib/auth/session";
import { getCourseById } from "@/lib/services/course.service";
import { getEnrollment } from "@/lib/services/enrollment.service";
import LessonDeleteButton from "@/components/lessons/lesson-delete-button";
import CourseEnrollButton from "@/components/courses/course-enroll-button";

type CourseDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;

  const course = await getCourseById(id);

  if (!course) {
    notFound();
  }

  const canManage =
    user.role === UserRole.ADMIN ||
    (user.role === UserRole.TEACHER &&
      course.instructorId === user.id);

  const isStudent = user.role === UserRole.STUDENT;

  const enrollment = isStudent
    ? await getEnrollment(user.id, course.id)
    : null;

  const isEnrolled = Boolean(enrollment);

  return (
    <main className="min-h-screen bg-gray-50 p-6 sm:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Course Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              EduFlow Learning Platform
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              {course.title}
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              {course.description}
            </p>
          </div>

          {canManage && (
            <Link
              href={`/dashboard/courses/${course.id}/edit`}
              className="w-fit rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Edit Course
            </Link>
          )}
        </div>

        {/* Course Information */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Status</p>

              <p className="mt-1 font-semibold text-gray-900">
                {course.status}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Lessons</p>

              <p className="mt-1 font-semibold text-gray-900">
                {course.lessons.length}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Enrollments</p>

              <p className="mt-1 font-semibold text-gray-900">
                {course._count.enrollments}
              </p>
            </div>
          </div>

          {/* Student Enrollment */}
          {isStudent && (
            <div className="mt-6 border-t border-gray-100 pt-6">
              <div className="mx-auto max-w-sm">
                <CourseEnrollButton
                  courseId={course.id}
                  isEnrolled={isEnrolled}
                />
              </div>
            </div>
          )}
        </section>

        {/* Lessons */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Lessons
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Course learning content
              </p>
            </div>

            {canManage && (
              <Link
                href={`/dashboard/courses/${course.id}/lessons/new`}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Add Lesson
              </Link>
            )}
          </div>

          {course.lessons.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                No lessons yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Add the first lesson to this course.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {course.lessons.map((lesson) => (
                <article
                  key={lesson.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
                        {lesson.order}
                      </div>

                      <div className="min-w-0">
                        <div>
  {isStudent ? (
    <Link
      href={`/dashboard/courses/${course.id}/lessons/${lesson.id}`}
      className="font-semibold text-gray-900 transition hover:text-gray-600"
    >
      {lesson.title}
    </Link>
  ) : (
    <h3 className="font-semibold text-gray-900">
      {lesson.title}
    </h3>
  )}

  <p className="mt-2 text-sm leading-6 text-gray-600">
    {lesson.content}
  </p>

  {isStudent && (
    <Link
      href={`/dashboard/courses/${course.id}/lessons/${lesson.id}`}
      className="mt-3 inline-block text-sm font-medium text-gray-700 underline underline-offset-4"
    >
      Open Lesson →
    </Link>
  )}
</div>
                      </div>
                    </div>

                    {canManage && (
                      <div className="flex shrink-0 items-center gap-2">
                        <Link
                          href={`/dashboard/courses/${course.id}/lessons/${lesson.id}/edit`}
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                          Edit
                        </Link>

                        <LessonDeleteButton
                          courseId={course.id}
                          lessonId={lesson.id}
                          lessonTitle={lesson.title}
                        />
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

