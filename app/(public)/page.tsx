// FILE: app/(public)/page.tsx
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PublicHomePage() {
  return (
    <main className="min-h-[calc(100vh-0px)] bg-background text-foreground">
      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Multi-tenant SaaS • Projects Module • Next.js + TypeScript
            </p>

            <h1 className="mt-3 font-poppins text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Build and manage projects across tenants with{" "}
              <span className="text-indigo-600 dark:text-indigo-400">SaaSify</span>
            </h1>

            <p className="mt-4 max-w-xl font-inter text-base text-muted-foreground sm:text-lg">
              A production-ready multi-tenant dashboard with Clerk auth, MongoDB, strict tenant isolation,
              and clean UI using shadcn/ui + Tailwind. Start small, scale safely.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild className="rounded-full">
                <Link href="/sign-in">Sign in</Link>
              </Button>

              <Button asChild variant="outline" className="rounded-full">
                <Link href="/sign-up">Create account</Link>
              </Button>

              <Button asChild variant="secondary" className="rounded-full">
                <Link href="/tenant">Go to Tenant Workspace</Link>
              </Button>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border bg-card p-4">
                <p className="font-poppins text-sm font-semibold">Tenant Isolation</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Every query is tenant-scoped by design.
                </p>
              </div>
              <div className="rounded-2xl border bg-card p-4">
                <p className="font-poppins text-sm font-semibold">RBAC</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Platform Admin, Tenant Admin, Tenant Users.
                </p>
              </div>
              <div className="rounded-2xl border bg-card p-4">
                <p className="font-poppins text-sm font-semibold">Fast DX</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  App Router, Server Actions, Zod, TS-first.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-gradient-to-tr from-indigo-500/10 via-transparent to-slate-500/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border bg-card p-4 shadow-sm">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border bg-muted">
                <Image
                  src="/saasify-hero.png"
                  alt="SaaSify dashboard preview"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>

              <div className="mt-4 rounded-2xl border bg-background p-4">
                <p className="font-poppins text-sm font-semibold">Tip</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add an image named <span className="font-medium">saasify-hero.png</span> to{" "}
                  <span className="font-medium">/public</span> for this preview.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SaaSify — Projects SaaS Dashboard
          </p>
          <div className="flex gap-4 text-sm">
            <Link className="text-muted-foreground hover:text-foreground" href="/platform">
              Platform
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/tenant">
              Tenant
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
