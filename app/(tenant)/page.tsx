// FILE: app/(tenant)/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TenantIndexPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border bg-card p-6 sm:p-8">
        <h1 className="font-poppins text-2xl font-semibold sm:text-3xl">
          Tenant Workspace
        </h1>
        <p className="mt-2 max-w-2xl font-inter text-sm text-muted-foreground sm:text-base">
          This is the tenant area entry point. In the next phase you’ll add tenant
          resolution (tenantId) and membership checks before showing tenant-scoped data.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild className="rounded-full">
            <Link href="/">Public Home</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/platform">Platform Dashboard</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5">
          <p className="font-poppins text-base font-semibold">Next step</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add tenant resolution + membership guards, then build Projects module.
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <p className="font-poppins text-base font-semibold">Projects</p>
          <p className="mt-1 text-sm text-muted-foreground">
            You’ll add /tenant/[tenantSlug]/projects after tenant context exists.
          </p>
        </div>
      </div>
    </section>
  );
}
