
import Link from "next/link";
import { redirect } from "next/navigation";
import CourseCreateForm from "@/components/courses/course-create-form";
import { getCurrentUser } from "@/lib/auth/session";
import { getCourses } from "@/lib/services/course.service";
import { UserRole } from "@/generated/prisma/client";
import CourseCard from "@/components/courses/course-card";

export default async function CoursesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const courses = await getCourses();

  /*
   * STUDENT VIEW
   *
   * Students can browse courses but cannot access
   * teacher/admin management controls.
   */
  if (user.role === UserRole.STUDENT) {
    const availableCourses = courses.filter(
      (course) => course.status === "PUBLISHED"
    );

    return (
      <main className="min-h-screen bg-gray-50 p-6 sm:p-8">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8">
            <p className="text-sm font-medium text-gray-500">
              EduFlow Learning Platform
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              Browse Courses
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Explore available courses and start learning.
            </p>
          </header>

          {availableCourses.length === 0 ? (
            <section className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <h2 className="text-lg font-semibold text-gray-900">
                No courses available
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                There are no published courses available right now.
              </p>
            </section>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {availableCourses.map((course) => (
                <article
                  key={course.id}
                  className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                      Published
                    </span>

                    <span className="text-sm text-gray-500">
                      {course._count.lessons}{" "}
                      {course._count.lessons === 1
                        ? "lesson"
                        : "lessons"}
                    </span>
                  </div>

                  <h2 className="mt-4 text-xl font-semibold text-gray-900">
                    {course.title}
                  </h2>

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
                    {course.description}
                  </p>

                  <div className="mt-5 text-sm text-gray-500">
                    Instructor:{" "}
                    <span className="font-medium text-gray-700">
                      {course.instructor.name}
                    </span>
                  </div>

                  <div className="mt-auto pt-6">
                    <Link
                      href={`/dashboard/courses/${course.id}`}
                      className="block rounded-lg bg-black px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                      View Course
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              href="/dashboard/my-courses"
              className="text-sm font-medium text-gray-700 underline-offset-4 hover:underline"
            >
              Go to My Courses →
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /*
   * TEACHER / ADMIN VIEW
   */

  const visibleCourses =
    user.role === UserRole.ADMIN
      ? courses
      : courses.filter((course) => course.instructorId === user.id);

  return (
    <main className="min-h-screen bg-gray-50 p-6 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-sm font-medium text-gray-500">
            EduFlow Learning Platform
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Course Management
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Create and manage courses for your learners.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <section>
            <CourseCreateForm />
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {user.role === UserRole.ADMIN
                    ? "All Courses"
                    : "My Courses"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {visibleCourses.length}{" "}
                  {visibleCourses.length === 1
                    ? "course"
                    : "courses"}
                </p>
              </div>
            </div>

            {visibleCourses.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  No courses yet
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Create your first course using the form.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {visibleCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
