import type { CourseStatus } from "@/generated/prisma/client";
import CourseDeleteButton from "@/components/courses/course-delete-button";
import Link from "next/link";

type CourseCardProps = {
  course: {
    id: string;
    title: string;
    slug: string;
    description: string;
    status: CourseStatus;
    instructor: {
      name: string;
    };
    _count: {
      lessons: number;
      enrollments: number;
    };
  };
};

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-gray-900">
            {course.title}
          </h3>

          <p className="mt-1 break-all text-sm text-gray-500">
            /{course.slug}
          </p>
        </div>

        <span className="w-fit shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
          {course.status}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-gray-600">
        {course.description}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-500">Instructor</p>

          <p className="mt-1 truncate text-sm font-medium text-gray-900">
            {course.instructor.name}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-500">Lessons</p>

          <p className="mt-1 text-sm font-medium text-gray-900">
            {course._count.lessons}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-500">Enrollments</p>

          <p className="mt-1 text-sm font-medium text-gray-900">
            {course._count.enrollments}
          </p>
        </div>
      </div>
     <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-4">
  <Link
    href={`/dashboard/courses/${course.id}`}
    className="rounded-lg bg-black px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
  >
    View Course
  </Link>

  <Link
    href={`/dashboard/courses/${course.id}/edit`}
    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
  >
    Edit
  </Link>

  <CourseDeleteButton
    courseId={course.id}
    courseTitle={course.title}
  />
</div>
    </article>
  );
}