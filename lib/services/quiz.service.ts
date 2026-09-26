import { prisma } from "@/lib/db/prisma";

export async function createQuiz(
  lessonId: string,
  title: string,
  questions: {
    text: string;
    options: string[];
    answer: string;
  }[]
) {
  return prisma.quiz.create({
    data: {
      lesson: {
        connect: { id: lessonId },
      },
      title,
      questions: {
        create: questions.map((question) => ({
          text: question.text,
          options: question.options,
          answer: question.answer,
        })),
      },
    },
    include: {
      questions: true,
    },
  });
}

export async function getQuizByLessonId(lessonId: string) {
  return prisma.quiz.findUnique({
    where: {
      lessonId,
    },
    include: {
      questions: {
        select: {
          id: true,
          text: true,
          options: true,
        },
      },
    },
  });
}

export async function getQuizForEvaluation(quizId: string) {
  return prisma.quiz.findUnique({
    where: {
      id: quizId,
    },
    include: {
      questions: {
        select: {
          id: true,
          answer: true,
        },
      },
    },
  });
}

export async function createQuizAttempt(
  quizId: string,
  studentId: string,
  score: number
) {
  return prisma.quizAttempt.create({
    data: {
      quiz: {
        connect: { id: quizId },
      },
      student: {
        connect: { id: studentId },
      },
      score,
    },
  });
}

export async function getStudentQuizAttempts(
  studentId: string,
  quizId: string
) {
  const attempts = await prisma.quizAttempt.findMany({
    where: {
      studentId,
      quizId,
    },
    orderBy: {
      attemptedAt: "desc",
    },
    select: {
      id: true,
      score: true,
      attemptedAt: true,
    },
  });

  const bestScore =
    attempts.length > 0
      ? Math.max(...attempts.map((attempt) => attempt.score))
      : null;

  return {
    attempts,
    bestScore,
    totalAttempts: attempts.length,
  };
}