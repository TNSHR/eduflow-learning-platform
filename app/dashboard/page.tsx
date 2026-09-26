import Link from "next/link";
import { redirect } from "next/navigation";
import { UserRole } from "@/generated/prisma/client";
import LogoutButton from "@/components/auth/logout-button";
import { getCurrentUser } from "@/lib/auth/session";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const isStudent = user.role === UserRole.STUDENT;
  const isTeacher = user.role === UserRole.TEACHER;
  const isAdmin = user.role === UserRole.ADMIN;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link
            href="/dashboard"
            className="text-2xl font-bold tracking-tight text-indigo-600"
          >
            EduFlow
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-gray-600 sm:block">
              {user.name}
            </span>

            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* Welcome Section */}
        <section>
          <p className="text-sm font-medium text-indigo-600">
            {isStudent
              ? "Student Learning Workspace"
              : "EduFlow Management Workspace"}
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Welcome, {user.name}
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            {isStudent
              ? "Continue your learning journey, explore courses, and track your progress."
              : "Manage courses and learning content from your EduFlow workspace."}
          </p>
        </section>

        {/* Student Dashboard */}
        {isStudent && (
          <section className="mt-8">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Browse Courses */}
              <Link
                href="/dashboard/courses"
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
                  </svg>
                </div>

                <h2 className="mt-5 text-xl font-semibold text-gray-900">
                  Browse Courses
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Explore published courses, view available lessons, and
                  enroll in courses that interest you.
                </p>

                <span className="mt-5 inline-block text-sm font-semibold text-indigo-600 group-hover:underline">
                  Explore courses →
                </span>
              </Link>

              {/* My Courses */}
              <Link
                href="/dashboard/my-courses"
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-green-300 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12l4 4L19 6" />
                  </svg>
                </div>

                <h2 className="mt-5 text-xl font-semibold text-gray-900">
                  My Courses
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Continue your enrolled courses and keep track of your
                  learning progress.
                </p>

                <span className="mt-5 inline-block text-sm font-semibold text-green-600 group-hover:underline">
                  Continue learning →
                </span>
              </Link>
            </div>
          </section>
        )}

        {/* Teacher / Admin Dashboard */}
        {(isTeacher || isAdmin) && (
          <section className="mt-8">
            <Link
              href="/dashboard/courses"
              className="group block max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
              </div>

              <h2 className="mt-5 text-xl font-semibold text-gray-900">
                Course Management
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Create, edit, and manage courses and lessons from the course
                management workspace.
              </p>

              <span className="mt-5 inline-block text-sm font-semibold text-indigo-600 group-hover:underline">
                Manage courses →
              </span>
            </Link>
          </section>
        )}

        {/* Account Information */}
        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Account Information
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {/* Email */}
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Email</p>

              <p className="mt-1 break-all font-medium text-gray-900">
                {user.email}
              </p>
            </div>

            {/* Role */}
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Role</p>

              <p className="mt-1 font-medium text-gray-900">
                {user.role}
              </p>
            </div>

            {/* Account */}
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Account</p>

              <p className="mt-1 font-medium text-green-600">
                Active
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>
            © {new Date().getFullYear()} EduFlow. All rights reserved.
          </p>

          <div className="flex gap-5">
            <a
              href="https://github.com/TNSHR"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-gray-900"
            >
              GitHub
            </a>

            <a
              href="https://www.linkedin.com/in/shrinath25"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-gray-900"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}