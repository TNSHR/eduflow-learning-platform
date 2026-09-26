"use client";

import { useState } from "react";
import QuizPlayer from "@/components/quizzes/quiz-player";
import QuizAttemptHistory from "@/components/quizzes/quiz-attempt-history";

type QuizSectionProps = {
  courseId: string;
  lessonId: string;
};

export default function QuizSection({
  courseId,
  lessonId,
}: QuizSectionProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  function handleQuizSubmitted() {
    setRefreshKey((current) => current + 1);
  }

  return (
    <div className="space-y-6">
      <QuizPlayer
        courseId={courseId}
        lessonId={lessonId}
        onQuizSubmitted={handleQuizSubmitted}
      />

      <QuizAttemptHistory
        courseId={courseId}
        lessonId={lessonId}
        refreshKey={refreshKey}
      />
    </div>
  );
}
