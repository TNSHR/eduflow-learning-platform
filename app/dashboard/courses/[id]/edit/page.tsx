import { notFound, redirect } from "next/navigation";
import CourseEditForm from "@/components/courses/course-edit-form";
import { getCurrentUser } from "@/lib/auth/session";
import { getCourseById } from "@/lib/services/course.service";
import { UserRole } from "@/generated/prisma/client";

type EditCoursePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCoursePage({
  params,
}: EditCoursePageProps) {
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

  if (
    user.role !== UserRole.ADMIN &&
    course.instructorId !== user.id
  ) {
    redirect("/dashboard/courses");
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 sm:p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-gray-500">
            EduFlow Learning Platform
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Edit Course
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Update your course information.
          </p>
        </div>

        <CourseEditForm
          courseId={course.id}
          initialTitle={course.title}
          initialDescription={course.description}
          initialSlug={course.slug}
        />
      </div>
    </main>
  );
}