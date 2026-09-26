
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type LessonProgressButtonProps = {
  courseId: string;
  lessonId: string;
  progress: number;
  isCompleted: boolean;
};

export default function LessonProgressButton({
  courseId,
  lessonId,
  progress,
  isCompleted,
}: LessonProgressButtonProps) {
  const router = useRouter();

  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(isCompleted);
  const [currentProgress, setCurrentProgress] = useState(progress);

  async function handleComplete() {
    if (isUpdating || completed) {
      return;
    }

    setIsUpdating(true);
    setError("");

    try {
      const response = await fetch(
        `/api/courses/${courseId}/lessons/${lessonId}/complete`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to complete lesson");
        return;
      }

      setCompleted(true);

      setCurrentProgress(
        data.progress?.percentage ?? currentProgress
      );

      router.refresh();
    } catch (error) {
      console.error("Complete lesson error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="mt-6">
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">
            Course Progress
          </span>

          <span className="font-semibold text-gray-900">
            {currentProgress}%
          </span>
        </div>

        <div
          className="h-2 overflow-hidden rounded-full bg-gray-100"
          aria-label={`Course progress: ${currentProgress}%`}
        >
          <div
            className="h-full rounded-full bg-black transition-all duration-300"
            style={{
              width: `${currentProgress}%`,
            }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleComplete}
        disabled={isUpdating || completed}
        className="w-full rounded-lg bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isUpdating
          ? "Updating progress..."
          : completed
            ? "✓ Lesson Completed"
            : "Mark Lesson Complete"}
      </button>

      {error && (
        <p
          role="alert"
          className="mt-2 text-center text-sm text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}

