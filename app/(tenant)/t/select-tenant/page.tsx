// FILE: app/t/select-tenant/page.tsx
import Link from "next/link";

export default function SelectTenantPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-poppins text-2xl font-semibold">Select tenant</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        (MVP placeholder) Show tenant switcher here.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/dashboard"
          className="inline-flex h-10 items-center justify-center rounded-full border bg-card px-5 text-sm"
        >
          Platform dashboard
        </Link>
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-full bg-indigo-600 px-5 text-sm text-white"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
