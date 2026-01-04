// File: app/docs/page.tsx
import Link from "next/link";
import Navbar from "@/components/public/Navbar";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">Docs</h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          This is a minimal placeholder for SaaSify documentation. Add pages for architecture decisions
          like tenant resolution, RBAC guards, and Server vs Client component rules.
        </p>

        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-semibold">Suggested docs (MVP)</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-sm text-zinc-600 dark:text-zinc-400">
            <li>Tenant routing and resolution strategy</li>
            <li>RBAC model and permission boundaries</li>
            <li>Server Components vs Client Components rules</li>
            <li>API conventions and validation approach</li>
          </ul>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white px-6 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-black dark:text-zinc-100 dark:hover:bg-zinc-950"
            >
              Back to Home
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-black"
            >
              Get Started
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
