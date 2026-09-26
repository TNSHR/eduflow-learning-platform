"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function CourseCreateForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
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
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          slug,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to create course");
        return;
      }

      setSuccess("Course created successfully.");

      setTitle("");
      setDescription("");
      setSlug("");

      router.refresh();
    } catch (error) {
      console.error("Create course error:", error);
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
          Create a Course
        </h2>

        <p className="mt-1 text-sm text-gray-600">
          Add a new course to your learning platform.
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
          htmlFor="course-title"
          className="block text-sm font-medium text-gray-700"
        >
          Course title
        </label>

        <input
          id="course-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isSubmitting}
          required
          minLength={3}
          maxLength={150}
          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
          placeholder="e.g. Advanced TypeScript"
        />
      </div>

      <div>
        <label
          htmlFor="course-description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>

        <textarea
          id="course-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          disabled={isSubmitting}
          required
          minLength={20}
          maxLength={2000}
          rows={5}
          className="mt-2 w-full resize-y rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
          placeholder="Describe what students will learn..."
        />
      </div>

      <div>
        <label
          htmlFor="course-slug"
          className="block text-sm font-medium text-gray-700"
        >
          URL slug
        </label>

        <input
          id="course-slug"
          type="text"
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          disabled={isSubmitting}
          required
          minLength={3}
          maxLength={160}
          pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
          placeholder="advanced-typescript"
        />

        <p className="mt-1 text-xs text-gray-500">
          Use lowercase letters, numbers, and hyphens.
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating course..." : "Create course"}
      </button>
    </form>
  );
}