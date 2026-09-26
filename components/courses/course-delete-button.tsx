"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CourseDeleteButtonProps = {
  courseId: string;
  courseTitle: string;
};

export default function CourseDeleteButton({
  courseId,
  courseTitle,
}: CourseDeleteButtonProps) {
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (isDeleting) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setIsDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to delete course");
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Delete course error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>

      {error && (
        <p
          role="alert"
          className="mt-2 text-xs text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}