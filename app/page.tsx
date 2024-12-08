import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8 bg-neutral-50">
      <main className="flex flex-col gap-4">
        <h1 className="text-heading-1 text-center mb-8 text-neutral-900">Welcome to LinguaLeap</h1>
        <Link
          href="/sign-in"
          className="rounded-md border-0 transition-colors flex items-center justify-center bg-brand-600 text-white hover:bg-brand-700 font-body-bold h-12 px-8 min-w-[200px] text-center shadow-sm"
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          className="rounded-md border-0 transition-colors flex items-center justify-center bg-brand-600 text-white hover:bg-brand-700 font-body-bold h-12 px-8 min-w-[200px] text-center shadow-sm"
        >
          Sign Up
        </Link>
        <Link
          href="/exercises"
          className="rounded-md border-0 transition-colors flex items-center justify-center bg-brand-600 text-white hover:bg-brand-700 font-body-bold h-12 px-8 min-w-[200px] text-center shadow-sm"
        >
          Generate Exercises
        </Link>
        <Link
          href="/profile"
          className="rounded-md border border-solid border-neutral-200 transition-colors flex items-center justify-center bg-white text-neutral-900 hover:bg-neutral-50 font-body h-12 px-8 min-w-[200px] text-center shadow-sm"
        >
          Profile
        </Link>
      </main>
    </div>
  );
}
