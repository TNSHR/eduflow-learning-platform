import Link from "next/link";

const features = [
  {
    title: "Learn at Your Pace",
    description:
      "Access structured courses, lessons, and learning content from one place.",
  },
  {
    title: "Track Your Progress",
    description:
      "Complete lessons and monitor your course progress as you learn.",
  },
  {
    title: "Test Your Knowledge",
    description:
      "Take quizzes, receive scores, and review your previous attempts.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navigation */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-indigo-600"
          >
            EduFlow
          </Link>

          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Create Account
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
              Smart Learning & Course Management
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Learn. Practice.{" "}
              <span className="text-indigo-600">Progress.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              EduFlow brings courses, lessons, progress tracking, and quizzes
              together in one secure learning platform.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                Start Learning
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-slate-900">
                {feature.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
        <div className="rounded-2xl bg-indigo-600 px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready to start learning?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-indigo-100">
            Create your EduFlow account and start exploring courses and
            learning content.
          </p>

          <Link
            href="/register"
            className="mt-6 inline-flex rounded-lg bg-white px-6 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
          >
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} EduFlow. All rights reserved.</p>

          <div className="flex gap-4">
            <a
              href="https://github.com/TNSHR"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900"
            >
              GitHub
            </a>

            <a
              href="https://www.linkedin.com/in/shrinath25"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
