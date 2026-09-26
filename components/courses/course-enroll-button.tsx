"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type CourseEnrollButtonProps = {
  courseId: string;
  isEnrolled: boolean;
};

export default function CourseEnrollButton({
  courseId,
  isEnrolled,
}: CourseEnrollButtonProps) {
  const router = useRouter();

  const [isEnrolling, setIsEnrolling] = useState(false);
  const [error, setError] = useState("");

  async function handleEnroll() {
    if (isEnrolling || isEnrolled) return;

    setIsEnrolling(true);
    setError("");

    try {
      const response = await fetch("/api/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to enroll in course");
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Course enrollment error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsEnrolling(false);
    }
  }

  if (isEnrolled) {
    return (
      <div className="space-y-2">
        <div className="rounded-lg bg-green-50 px-4 py-2.5 text-center text-sm font-medium text-green-700">
          You are enrolled
        </div>

        <button
          type="button"
          onClick={() => router.push("/dashboard/my-courses")}
          className="w-full rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          My Courses
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleEnroll}
        disabled={isEnrolling}
        className="w-full rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isEnrolling ? "Enrolling..." : "Enroll Now"}
      </button>

      {error && (
        <p role="alert" className="text-center text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}