"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type LessonCreateFormProps = {
  courseId: string;
  initialOrder: number;
};

export default function LessonCreateForm({
  courseId,
  initialOrder,
}: LessonCreateFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [order, setOrder] = useState(initialOrder.toString());

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/courses/${courseId}/lessons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          order: Number(order),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to create lesson");
        return;
      }

      setSuccess("Lesson created successfully.");

      setTitle("");
      setContent("");
      setOrder((Number(order) + 1).toString());

      router.refresh();
    } catch (error) {
      console.error("Create lesson error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Lesson Details
        </h2>

        <p className="mt-1 text-sm text-gray-600">
          Add learning content to your course.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {success}
        </div>
      )}

      <div>
        <label
          htmlFor="lesson-title"
          className="block text-sm font-medium text-gray-700"
        >
          Lesson title
        </label>

        <input
          id="lesson-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isSubmitting}
          required
          minLength={3}
          maxLength={200}
          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
          placeholder="e.g. Introduction to React"
        />
      </div>

      <div>
        <label
          htmlFor="lesson-content"
          className="block text-sm font-medium text-gray-700"
        >
          Lesson content
        </label>

        <textarea
          id="lesson-content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          disabled={isSubmitting}
          required
          minLength={10}
          maxLength={10000}
          rows={8}
          className="mt-2 w-full resize-y rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
          placeholder="Explain what students will learn in this lesson..."
        />
      </div>

      <div>
        <label
          htmlFor="lesson-order"
          className="block text-sm font-medium text-gray-700"
        >
          Lesson order
        </label>

        <input
          id="lesson-order"
          type="number"
          value={order}
          onChange={(event) => setOrder(event.target.value)}
          disabled={isSubmitting}
          required
          min={1}
          step={1}
          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
        />

        <p className="mt-1 text-xs text-gray-500">
          Determines the order in which lessons appear.
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating lesson..." : "Create lesson"}
      </button>
    </form>
  );
}
