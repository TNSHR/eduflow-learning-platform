import Link from "next/link";
import LoginForm from "@/components/auth/login-form";

type LoginPageProps = {
  searchParams: Promise<{
    registered?: string;
  }>;
};

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-indigo-600"
          >
            EduFlow
          </Link>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Welcome to EduFlow
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Sign in to continue your learning journey.
          </p>
        </div>

        {params.registered === "true" && (
          <div
            role="status"
            className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            Account created successfully. Please sign in to continue.
          </div>
        )}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          New to EduFlow?{" "}
          <Link
            href="/register"
            className="font-medium text-gray-900 underline underline-offset-2 hover:text-gray-600"
          >
            Create an account
          </Link>
        </p>

        <p className="mt-3 text-center text-xs text-gray-500">
          Secure learning platform powered by Next.js 16
        </p>
      </div>
    </main>
  );
}
