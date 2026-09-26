"use client";

import { useEffect, useState } from "react";

type QuizQuestion = {
  id: string;
  text: string;
  options: string[];
};

type Quiz = {
  id: string;
  title: string;
  questions: QuizQuestion[];
};

type QuizPlayerProps = {
  courseId: string;
  lessonId: string;
  onQuizSubmitted?: () => void;
};

type QuizResult = {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  attemptId: string;
  attemptedAt: string;
};

export default function QuizPlayer({
  courseId,
  lessonId,onQuizSubmitted,
}: QuizPlayerProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    async function loadQuiz() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `/api/courses/${courseId}/lessons/${lessonId}/quiz`
        );

        const data = await response.json();

        if (response.status === 404) {
          setQuiz(null);
          return;
        }

        if (!response.ok) {
          setError(data.message || "Unable to load quiz");
          return;
        }

        setQuiz(data.quiz);
      } catch (error) {
        console.error("Load quiz error:", error);
        setError("Something went wrong while loading the quiz.");
      } finally {
        setIsLoading(false);
      }
    }

    loadQuiz();
  }, [courseId, lessonId]);

  function handleAnswerChange(
    questionId: string,
    answer: string
  ) {
    if (isSubmitting || result) return;

    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: answer,
    }));

    setSubmitError("");
  }

  async function handleSubmit() {
    if (!quiz || isSubmitting || result) return;

    setSubmitError("");

    const unansweredQuestions = quiz.questions.filter(
      (question) => !answers[question.id]
    );

    if (unansweredQuestions.length > 0) {
      setSubmitError(
        `Please answer all ${quiz.questions.length} questions before submitting.`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/courses/${courseId}/lessons/${lessonId}/quiz/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answers,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setSubmitError(
          data.message || "Unable to submit quiz."
        );
        return;
      }

      setResult(data.result);
      onQuizSubmitted?.();
    } catch (error) {
      console.error("Submit quiz error:", error);
      setSubmitError(
        "Something went wrong while submitting the quiz."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleRetry() {
    setAnswers({});
    setResult(null);
    setSubmitError("");
  }

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">
          Loading quiz...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-900">
          Unable to load quiz
        </h2>

        <p className="mt-2 text-sm text-red-700">
          {error}
        </p>
      </section>
    );
  }

  if (!quiz) {
    return (
      <section className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          No quiz available
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          This lesson does not have a quiz yet.
        </p>
      </section>
    );
  }

  if (result) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500">
            Quiz Completed
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {quiz.title}
          </h2>

          <div className="mx-auto mt-6 flex h-28 w-28 items-center justify-center rounded-full border-8 border-gray-100">
            <span className="text-3xl font-bold text-gray-900">
              {result.score}%
            </span>
          </div>

          <p className="mt-5 text-sm text-gray-600">
            You answered{" "}
            <span className="font-semibold text-gray-900">
              {result.correctAnswers}
            </span>{" "}
            out of{" "}
            <span className="font-semibold text-gray-900">
              {result.totalQuestions}
            </span>{" "}
            questions correctly.
          </p>

          <button
            type="button"
            onClick={handleRetry}
            className="mt-6 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="border-b border-gray-100 pb-6">
        <p className="text-sm font-medium text-gray-500">
          Knowledge Check
        </p>

        <h2 className="mt-1 text-2xl font-bold text-gray-900">
          {quiz.title}
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Answer all questions and submit your quiz.
        </p>
      </div>

      <div className="mt-8 space-y-8">
        {quiz.questions.map((question, questionIndex) => (
          <div
            key={question.id}
            className="rounded-xl border border-gray-200 p-5"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
                {questionIndex + 1}
              </span>

              <h3 className="pt-1 font-semibold leading-6 text-gray-900">
                {question.text}
              </h3>
            </div>

            <div className="mt-5 space-y-3">
              {question.options.map((option) => {
                const isSelected =
                  answers[question.id] === option;

                return (
                  <label
                    key={option}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                      isSelected
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option}
                      checked={isSelected}
                      onChange={() =>
                        handleAnswerChange(
                          question.id,
                          option
                        )
                      }
                      disabled={isSubmitting}
                      className="h-4 w-4"
                    />

                    <span className="text-sm text-gray-700">
                      {option}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {submitError && (
        <p
          role="alert"
          className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {submitError}
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="mt-8 w-full rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Submitting Quiz..." : "Submit Quiz"}
      </button>
    </section>
  );
}
