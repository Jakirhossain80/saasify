// FILE: app/(public)/docs/server-vs-client/page.tsx
import DecisionRules from "@/components/docs/DecisionRules";

export const metadata = {
  title: "Server vs Client Components • SaaSify",
  description:
    "Decision rules for Server Components vs Client Components in SaaSify (Next.js App Router).",
};

export default function ServerVsClientDocsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
        <div className="rounded-3xl border bg-card p-6 sm:p-8">
          <p className="text-sm text-muted-foreground">SaaSify • Engineering Docs</p>
          <h1 className="mt-2 font-poppins text-2xl font-semibold sm:text-3xl">
            Server Components vs Client Components
          </h1>
          <p className="mt-2 font-inter text-sm text-muted-foreground sm:text-base">
            Practical decision rules to keep tenant-scoped data secure and the UI fast.
          </p>
        </div>

        <div className="mt-6">
          <DecisionRules />
        </div>
      </div>
    </main>
  );
}
