import Link from "next/link";
import { redirect } from "next/navigation";
import { UserRole } from "@/generated/prisma/client";
import { getCurrentUser } from "@/lib/auth/session";
import { getStudentEnrollments } from "@/lib/services/enrollment.service";

export default async function MyCoursesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== UserRole.STUDENT) {
    redirect("/dashboard");
  }

  const enrollments = await getStudentEnrollments(user.id);

  return (
    <main className="min-h-screen bg-gray-50 p-6 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-gray-500">
            EduFlow Learning Platform
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            My Courses
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Continue learning from the courses you are enrolled in.
          </p>
        </div>

        {enrollments.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              No courses yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              You are not enrolled in any courses yet.
            </p>

            <Link
              href="/dashboard/courses"
              className="mt-5 inline-flex rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Browse Courses
            </Link>
          </section>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((enrollment) => (
              <article
                key={enrollment.id}
                className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {enrollment.course.status}
                  </span>

                  <span className="text-sm font-semibold text-gray-700">
                    {enrollment.progress}%
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-semibold text-gray-900">
                  {enrollment.course.title}
                </h2>

                <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
                  {enrollment.course.description}
                </p>

                <div className="mt-5 space-y-2 text-sm text-gray-500">
                  <p>
                    Instructor:{" "}
                    <span className="font-medium text-gray-700">
                      {enrollment.course.instructor.name}
                    </span>
                  </p>

                  <p>
                    Lessons:{" "}
                    <span className="font-medium text-gray-700">
                      {enrollment.course._count.lessons}
                    </span>
                  </p>
                </div>

                <div className="mt-auto pt-6">
                  <Link
                    href={`/dashboard/courses/${enrollment.course.id}`}
                    className="block rounded-lg bg-black px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-gray-800"
                  >
                    Continue Learning
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}