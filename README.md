## 🔐 Demo Credentials

The following seeded accounts are available for evaluating the deployed EduFlow application.

> **Live Demo:** https://eduflow-learning-platform.vercel.app/login

### Admin

```text
Email:    admin@eduflow.test
Password: Password@123
```

### Teacher 1

```text
Email:    teacher1@eduflow.test
Password: Password@123
```

### Teacher 2

```text
Email:    teacher2@eduflow.test
Password: Password@123
```

### Student

```text
Email:    student1@eduflow.test
Password: Password@123
```

### Suggested Evaluation Flow

* **Student:** Browse published courses → Enroll → Continue learning → Complete lessons → Attempt quizzes → View progress.
* **Teacher:** Create and manage courses → Add lessons → Create quizzes → Manage owned course content.
* **Admin:** Access the broader course-management functionality and review the platform from an administrative perspective.

> These credentials are **demo/assessment accounts only** and should not be used for real or sensitive data.



# EduFlow — Smart Learning & Course Management Platform

EduFlow is a full-stack learning and course management platform built with **Next.js 16, React 19, TypeScript, Tailwind CSS, PostgreSQL, Prisma, and secure session-based authentication**.

The platform is designed around a realistic learning workflow rather than a basic CRUD application:

**Authentication → Role-based access → Course catalogue → Enrollment → Lessons → Progress tracking → Quizzes → Attempt history**

## Features

### Authentication & Authorization

* Student, Teacher, and Admin roles
* Registration and login
* Password hashing with `bcryptjs`
* Secure database-backed sessions
* HttpOnly session cookie
* Session expiration
* Logout with server-side session invalidation
* Role-based authorization
* Teacher ownership checks for course and lesson management
* Students cannot access teacher/admin management operations

### Course Management

Teachers and administrators can:
Email: teacher1@eduflow.test
Password: Password@123

* Create courses
* View courses
* Update courses
* Delete courses
* Assign courses to instructors
* Manage course status
* View lesson and enrollment counts

Course input is validated using **Zod**.

### Lesson Management

Teachers and administrators can:

* Create lessons
* Edit lessons
* Delete lessons
* Control lesson ordering
* View lessons within their courses

Students can access lessons only after enrolling in the course.

### Student Enrollment

Students can:

* Browse published courses
* Enroll in courses
* View enrolled courses
* Continue learning from their dashboard

Duplicate enrollments are prevented at the database level.

### Learning Progress

EduFlow tracks:

* Lesson completion
* Completed lesson count
* Total lessons
* Course completion percentage
* Completion timestamps

Progress is calculated from lesson completion rather than relying only on a client-controlled percentage.

### Quizzes

Students can:

* Open quizzes associated with lessons
* Answer questions
* Submit quizzes
* Receive a calculated score
* Retry quizzes
* View previous attempts
* View best score
* View total attempts
* View recent attempt history

Correct answers are **not exposed through the student quiz API**. Evaluation is performed server-side.

### Validation & Security

The application includes:

* Zod request validation
* Input trimming and normalization
* Email normalization
* Password hashing
* HttpOnly cookies
* SameSite cookie protection
* Session expiration
* Role-based authorization
* Resource ownership checks
* Request-origin validation for state-changing API requests
* Database uniqueness constraints
* Server-side quiz evaluation
* Duplicate-click protection on important UI actions
* Structured API error responses
* Database health endpoint

## Technology Stack

| Layer             | Technology                      |
| ----------------- | ------------------------------- |
| Framework         | Next.js 16                      |
| Frontend          | React 19                        |
| Language          | TypeScript                      |
| Styling           | Tailwind CSS                    |
| Database          | PostgreSQL                      |
| ORM               | Prisma 7                        |
| Authentication    | Custom database-backed sessions |
| Password Security | bcryptjs                        |
| Validation        | Zod                             |
| Testing           | Vitest                          |
| Runtime           | Node.js                         |
| Version Control   | Git / GitHub                    |

## Architecture

```text
                         ┌──────────────────────┐
                         │      Browser         │
                         │  React / Next.js UI  │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     Next.js 16       │
                         │ App Router           │
                         │ Server Components    │
                         │ Client Components    │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
          ┌──────────────────┐            ┌──────────────────┐
          │ Route Handlers   │            │ Server Services  │
          │ REST APIs        │            │ Business Logic   │
          └────────┬─────────┘            └────────┬─────────┘
                   │                               │
                   └──────────────┬────────────────┘
                                  ▼
                         ┌──────────────────┐
                         │ Prisma ORM       │
                         │ Validation/Auth  │
                         └────────┬─────────┘
                                  ▼
                         ┌──────────────────┐
                         │ PostgreSQL       │
                         └──────────────────┘
```

## Project Structure

```text
eduflow-learning-platform/
│
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── courses/
│   │   ├── enrollments/
│   │   └── health/
│   │
│   ├── dashboard/
│   │   ├── courses/
│   │   └── my-courses/
│   │
│   ├── login/
│   └── page.tsx
│
├── components/
│   ├── courses/
│   ├── lessons/
│   └── quizzes/
│
├── lib/
│   ├── auth/
│   ├── db/
│   ├── security/
│   ├── services/
│   ├── utils/
│   └── validations/
│
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
│
├── tests/
│   └── validations/
│
├── prisma.config.ts
├── vitest.config.ts
├── package.json
└── README.md
```

## Database Design

The main entities are:

```text
User
 │
 ├── Course
 │     └── Lesson
 │           └── Quiz
 │                 └── Question
 │
 ├── Enrollment
 │
 ├── LessonProgress
 │
 ├── QuizAttempt
 │
 └── Session
```

### Main relationships

* A User can have a Student, Teacher, or Admin role.
* A Teacher/Admin can manage courses according to authorization rules.
* A Course contains multiple Lessons.
* A Lesson can contain one Quiz.
* A Quiz contains multiple Questions.
* Students enroll in Courses.
* Students have independent LessonProgress records.
* Students can create multiple QuizAttempts.
* Sessions belong to authenticated users.

Database constraints are used for important invariants such as:

* Unique user email
* Unique course slug
* Unique student/course enrollment
* Unique course lesson order
* Unique student/lesson progress
* Unique lesson/quiz relationship

## Authentication Flow

```text
User
 │
 ▼
Register / Login
 │
 ▼
Zod Validation
 │
 ▼
Password Verification / Hashing
 │
 ▼
Create Database Session
 │
 ▼
HttpOnly Cookie
 │
 ▼
Authenticated Request
 │
 ▼
getCurrentUser()
 │
 ▼
Role / Ownership Authorization
 │
 ▼
Protected Resource
```

The session token is stored server-side and the browser receives only the session cookie.

## Quiz Security

Quiz answers are intentionally separated from the student-facing quiz response.

```text
Student
   │
   ▼
GET Quiz
   │
   └── Questions + Options
       NO Correct Answers
           
Student submits answers
   │
   ▼
Server retrieves answer key
   │
   ▼
Server evaluates answers
   │
   ▼
Calculate score
   │
   ▼
Persist QuizAttempt
   │
   ▼
Return score
```

This prevents the correct answers from being trusted from client-side data.

## API Overview

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

### Courses

```text
GET    /api/courses
POST   /api/courses
GET    /api/courses/:id
PATCH  /api/courses/:id
DELETE /api/courses/:id
```

### Lessons

```text
GET    /api/courses/:id/lessons
POST   /api/courses/:id/lessons
PATCH  /api/courses/:id/lessons/:lessonId
DELETE /api/courses/:id/lessons/:lessonId
```

### Learning Progress

```text
POST /api/courses/:id/lessons/:lessonId/complete
GET  /api/courses/:id/progress
```

### Enrollment

```text
GET  /api/enrollments
POST /api/enrollments
```

### Quiz

```text
GET  /api/courses/:id/lessons/:lessonId/quiz
POST /api/courses/:id/lessons/:lessonId/quiz
GET  /api/courses/:id/lessons/:lessonId/quiz/attempts
POST /api/courses/:id/lessons/:lessonId/quiz/submit
```

### Health

```text
GET /api/health/db
```

## Testing

Vitest is used for automated validation tests.

Current automated test coverage includes:

* Registration validation
* Login validation
* Email normalization
* Password validation
* Name validation
* Course validation
* Course input normalization
* Course slug validation
* Partial course updates

Current result:

```text
Test Files: 2 passed
Tests:      13 passed
```

Additional verification performed before submission:

```text
TypeScript       PASS
ESLint           PASS
Vitest           13/13 PASS
Next.js Build    PASS
Static Pages     14/14 generated
```

## Performance & Next.js Practices

The application uses Next.js App Router features including:

* Server Components for server-rendered dashboard pages
* Client Components only where browser interaction is required
* Server-side authentication checks
* Dynamic routes for courses and lessons
* Database queries performed on the server
* Prisma relation queries
* Indexed database fields
* Production builds through Next.js
* Optimized production compilation

The production build currently completes successfully with Next.js 16.

## Error Handling

API handlers distinguish common failures such as:

* Invalid input
* Unauthorized access
* Forbidden operations
* Missing resources
* Duplicate records
* Database failures

The application also provides:

```text
GET /api/health/db
```

to verify PostgreSQL connectivity.

## Local Development

### Requirements

* Node.js 22+
* PostgreSQL
* npm

### Installation

```bash
npm install
```

### Environment

Create `.env`:

```env
DATABASE_URL="your-postgresql-connection-string"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Database

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Generate the Prisma client:

```bash
npx prisma generate
```

### Development server

```bash
npm run dev
```

Application:

```text
http://localhost:3000
```

### Validation

```bash
npx tsc --noEmit
npm run lint
npm test
npm run build
```

## Production Considerations

For deployment:

* PostgreSQL should use a managed production database.
* Environment variables must be configured through the deployment platform.
* `DATABASE_URL` must never be committed.
* `NEXT_PUBLIC_APP_URL` must match the deployed application origin.
* HTTPS should be used in production.
* Production database credentials should use least-privilege access.
* Database backups and monitoring should be configured for production use.
* Authentication/session infrastructure can be scaled independently through the database layer.

## Deployment

The target deployment platform is **Vercel**.

Required production environment variables:

```text
DATABASE_URL
NEXT_PUBLIC_APP_URL
```

The GitHub repository is:

```text
https://github.com/TNSHR/eduflow-learning-platform
```

## Demo Flow

A concise evaluator demonstration can follow this sequence:

```text
1. Register / Login
2. Show role-based dashboard
3. Teacher creates a course
4. Teacher adds lessons
5. Student browses published courses
6. Student enrolls
7. Student opens a lesson
8. Student marks lesson complete
9. Progress percentage updates
10. Student completes the quiz
11. Quiz score is displayed
12. Quiz attempt history updates
13. Demonstrate protected teacher/admin operations
14. Show automated tests and production build
```

## Project Status

The project has been implemented as a production-oriented full-stack learning platform with:

* Authentication
* Authorization
* Course CRUD
* Lesson CRUD
* Enrollment
* Progress tracking
* Quizzes
* Quiz attempt history
* Validation
* Security controls
* Automated tests
* Production build verification

## Author

**Shrinath Sharma**

* GitHub: https://github.com/TNSHR
* LinkedIn: https://www.linkedin.com/in/shrinath25
