"use client";

import { useEffect, useState } from "react";

type QuizAttempt = {
  id: string;
  score: number;
  attemptedAt: string;
};

type QuizAttemptHistoryProps = {
  courseId: string;
  lessonId: string;
   refreshKey?: number;
};

type AttemptResponse = {
  success: boolean;
  quizId: string;
  attempts: QuizAttempt[];
  bestScore: number | null;
  totalAttempts: number;
};

export default function QuizAttemptHistory({
  courseId,
  lessonId,refreshKey,
}: QuizAttemptHistoryProps) {
  const [data, setData] = useState<AttemptResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAttempts() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `/api/courses/${courseId}/lessons/${lessonId}/quiz/attempts`
        );

        const result = await response.json();

        if (!response.ok) {
          setError(result.message || "Unable to load quiz history.");
          return;
        }

        setData(result);
      } catch (error) {
        console.error("Load quiz attempts error:", error);
        setError("Something went wrong while loading quiz history.");
      } finally {
        setIsLoading(false);
      }
    }

    loadAttempts();
  }, [courseId, lessonId,refreshKey]);

  if (isLoading) {
    return (
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 w-48 rounded bg-gray-200" />
          <div className="mt-4 h-20 rounded bg-gray-100" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm text-red-700">{error}</p>
      </section>
    );
  }

  if (!data || data.totalAttempts === 0) {
    return null;
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Quiz Performance
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Track your quiz attempts and best score.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-500">
            Best Score
          </p>

          <p className="mt-1 text-3xl font-bold text-gray-900">
            {data.bestScore}%
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-500">
            Total Attempts
          </p>

          <p className="mt-1 text-3xl font-bold text-gray-900">
            {data.totalAttempts}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Recent Attempts
        </h3>

        <div className="divide-y divide-gray-100 rounded-lg border border-gray-200">
          {data.attempts.map((attempt) => (
            <div
              key={attempt.id}
              className="flex items-center justify-between gap-4 p-4"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {attempt.score}%
                </p>

                <p className="text-sm text-gray-500">
                  {new Date(attempt.attemptedAt).toLocaleString()}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  attempt.score >= 80
                    ? "bg-green-100 text-green-700"
                    : attempt.score >= 50
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                {attempt.score >= 80
                  ? "Strong"
                  : attempt.score >= 50
                    ? "Needs Practice"
                    : "Keep Practicing"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
