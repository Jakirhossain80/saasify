import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <main className="w-full max-w-2xl px-6 py-20 text-center">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">
          SaaSify
        </h1>

        <p className="mt-4 text-base leading-7 text-muted-foreground">
          A Next.js + TypeScript multi-tenant SaaS dashboard for Projects
          Management. Sign in to access your workspace.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/sign-in"
            className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-primary-foreground transition-colors hover:opacity-90"
          >
            Sign in
          </Link>

          <Link
            href="/sign-up"
            className="inline-flex h-11 items-center justify-center rounded-full border border-border px-6 transition-colors hover:bg-muted"
          >
            Create account
          </Link>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          After signing in, you’ll be redirected to your tenant dashboard.
        </p>
      </main>
    </div>
  );
}
