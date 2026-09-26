import Link from "next/link";
import RegisterForm from "@/components/auth/register-form";

export default function RegisterPage() {
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
            Create your account
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Join EduFlow and start your learning journey.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <RegisterForm />
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          Secure learning platform powered by Next.js 16
        </p>
      </div>
    </main>
  );
}
