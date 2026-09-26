"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type LessonDeleteButtonProps = {
  courseId: string;
  lessonId: string;
  lessonTitle: string;
};

export default function LessonDeleteButton({
  courseId,
  lessonId,
  lessonTitle,
}: LessonDeleteButtonProps) {
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (isDeleting) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${lessonTitle}"?`
    );

    if (!confirmed) return;

    setIsDeleting(true);
    setError("");

    try {
      const response = await fetch(
        `/api/courses/${courseId}/lessons/${lessonId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to delete lesson");
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Delete lesson error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="shrink-0 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>

      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}