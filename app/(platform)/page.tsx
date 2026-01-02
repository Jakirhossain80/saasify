// FILE: app/(platform)/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PlatformIndexPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border bg-card p-6 sm:p-8">
        <h1 className="font-poppins text-2xl font-semibold sm:text-3xl">
          Platform Dashboard
        </h1>
        <p className="mt-2 max-w-2xl font-inter text-sm text-muted-foreground sm:text-base">
          Manage tenants, global users, announcements, and platform-wide analytics.
          (You’ll wire real data in the next phases.)
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild className="rounded-full">
            <Link href="/tenant">Go to Tenant Workspace</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/">Back to Public Home</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Tenants</p>
          <p className="mt-1 font-poppins text-2xl font-semibold">—</p>
          <p className="mt-2 text-sm text-muted-foreground">Connect DB + services to show totals.</p>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Active Tenants</p>
          <p className="mt-1 font-poppins text-2xl font-semibold">—</p>
          <p className="mt-2 text-sm text-muted-foreground">Add tenant status analytics later.</p>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Total Projects</p>
          <p className="mt-1 font-poppins text-2xl font-semibold">—</p>
          <p className="mt-2 text-sm text-muted-foreground">Will come from tenant-scoped counts.</p>
        </div>
      </div>
    </section>
  );
}
