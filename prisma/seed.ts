import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Starting EduFlow database seed...");

  const passwordHash = await bcrypt.hash("Password@123", 12);

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@eduflow.test",
    },
    update: {
  name: "EduFlow Admin",
  passwordHash,
  role: "ADMIN",
},
    create: {
      name: "EduFlow Admin",
      email: "admin@eduflow.test",
      passwordHash,
      role: "ADMIN",
    },
  });

  const teacher1 = await prisma.user.upsert({
    where: {
      email: "teacher1@eduflow.test",
    },
    update: {
  name: "Anita Sharma",
  passwordHash,
  role: "TEACHER",
},
    create: {
      name: "Anita Sharma",
      email: "teacher1@eduflow.test",
      passwordHash,
      role: "TEACHER",
    },
  });

  const teacher2 = await prisma.user.upsert({
    where: {
      email: "teacher2@eduflow.test",
    },
    update: {
  name: "Rahul Verma",
  passwordHash,
  role: "TEACHER",
},
    create: {
      name: "Rahul Verma",
      email: "teacher2@eduflow.test",
      passwordHash,
      role: "TEACHER",
    },
  });

  const student = await prisma.user.upsert({
    where: {
      email: "student1@eduflow.test",
    },
    update: {
  name: "Test Student",
  passwordHash,
  role: "STUDENT",
},
    create: {
      name: "Test Student",
      email: "student1@eduflow.test",
      passwordHash,
      role: "STUDENT",
    },
  });

  const javascriptCourse = await prisma.course.upsert({
    where: {
      slug: "modern-javascript",
    },
    update: {},
    create: {
      title: "Modern JavaScript",
      slug: "modern-javascript",
      description:
        "Learn modern JavaScript fundamentals, asynchronous programming, modules, and practical application development.",
      status: "PUBLISHED",
      instructor: {
        connect: {
          id: teacher1.id,
        },
      },
    },
  });

  const nextjsCourse = await prisma.course.upsert({
    where: {
      slug: "nextjs-16-development",
    },
    update: {},
    create: {
      title: "Next.js 16 Development",
      slug: "nextjs-16-development",
      description:
        "Build production-ready full-stack applications with Next.js 16, React, TypeScript, routing, server components, and APIs.",
      status: "PUBLISHED",
      instructor: {
        connect: {
          id: teacher1.id,
        },
      },
    },
  });

  const pythonCourse = await prisma.course.upsert({
    where: {
      slug: "python-for-data-science",
    },
    update: {},
    create: {
      title: "Python for Data Science",
      slug: "python-for-data-science",
      description:
        "Learn Python programming, data manipulation, visualization, and practical data analysis techniques.",
      status: "DRAFT",
      instructor: {
        connect: {
          id: teacher2.id,
        },
      },
    },
  });

  await prisma.lesson.upsert({
    where: {
      courseId_order: {
        courseId: javascriptCourse.id,
        order: 1,
      },
    },
    update: {},
    create: {
      title: "JavaScript Fundamentals",
      content:
        "Variables, data types, operators, conditions, loops, and functions.",
      order: 1,
      course: {
        connect: {
          id: javascriptCourse.id,
        },
      },
    },
  });

  await prisma.lesson.upsert({
    where: {
      courseId_order: {
        courseId: javascriptCourse.id,
        order: 2,
      },
    },
    update: {},
    create: {
      title: "Asynchronous JavaScript",
      content:
        "Promises, async/await, error handling, and asynchronous workflows.",
      order: 2,
      course: {
        connect: {
          id: javascriptCourse.id,
        },
      },
    },
  });

  await prisma.lesson.upsert({
    where: {
      courseId_order: {
        courseId: nextjsCourse.id,
        order: 1,
      },
    },
    update: {},
    create: {
      title: "Next.js App Router",
      content:
        "Learn layouts, pages, nested routes, dynamic routes, and navigation.",
      order: 1,
      course: {
        connect: {
          id: nextjsCourse.id,
        },
      },
    },
  });

  await prisma.lesson.upsert({
    where: {
      courseId_order: {
        courseId: nextjsCourse.id,
        order: 2,
      },
    },
    update: {},
    create: {
      title: "Server and Client Components",
      content:
        "Understand the Server Component and Client Component architecture in Next.js.",
      order: 2,
      course: {
        connect: {
          id: nextjsCourse.id,
        },
      },
    },
  });

  await prisma.lesson.upsert({
    where: {
      courseId_order: {
        courseId: pythonCourse.id,
        order: 1,
      },
    },
    update: {},
    create: {
      title: "Python Fundamentals",
      content:
        "Variables, collections, functions, modules, and object-oriented programming.",
      order: 1,
      course: {
        connect: {
          id: pythonCourse.id,
        },
      },
    },
  });

  await prisma.enrollment.upsert({
    where: {
      studentId_courseId: {
        studentId: student.id,
        courseId: javascriptCourse.id,
      },
    },
    update: {},
    create: {
      student: {
        connect: {
          id: student.id,
        },
      },
      course: {
        connect: {
          id: javascriptCourse.id,
        },
      },
      progress: 35,
    },
  });

  await prisma.enrollment.upsert({
    where: {
      studentId_courseId: {
        studentId: student.id,
        courseId: nextjsCourse.id,
      },
    },
    update: {},
    create: {
      student: {
        connect: {
          id: student.id,
        },
      },
      course: {
        connect: {
          id: nextjsCourse.id,
        },
      },
      progress: 10,
    },
  });

  console.log("✅ Seed completed successfully.");
  console.log("");
  console.log("Test accounts:");
  console.log(`Admin:   ${admin.email}`);
  console.log(`Teacher: ${teacher1.email}`);
  console.log(`Teacher: ${teacher2.email}`);
  console.log(`Student: ${student.email}`);
  console.log("");
  console.log("Password for all accounts: Password@123");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });