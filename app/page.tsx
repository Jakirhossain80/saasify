// File: app/page.tsx
import Link from "next/link";
import Navbar from "@/components/public/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100">
      {/* 1) Navbar */}
      <Navbar />

      <main>
        {/* 2) Hero */}
        <section className="mx-auto max-w-6xl px-4 pt-14 pb-10 sm:px-6 sm:pt-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                Multi-tenant SaaS starter • Next.js App Router • TypeScript
              </p>

              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                SaaSify — a clean multi-tenant Projects platform for real teams.
              </h1>

              <p className="text-pretty text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                Build a production-style SaaS with platform admin controls, tenant workspaces, and
                role-based access — centered around a Projects module with secure APIs and server actions.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/sign-up"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-black"
                >
                  Get Started (Sign Up)
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white px-6 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-black dark:text-zinc-100 dark:hover:bg-zinc-950"
                >
                  Read Docs
                </Link>
              </div>

              <div className="grid gap-3 pt-2 sm:grid-cols-3">
                <Stat label="Tenants" value="Isolated workspaces" />
                <Stat label="RBAC" value="Role-based access" />
                <Stat label="Projects" value="Team collaboration" />
              </div>
            </div>

            {/* Minimal “preview card” instead of images */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Platform Overview</p>
                <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-black dark:text-zinc-400">
                  MVP-ready
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <PreviewRow title="Tenant provisioning" desc="Create, manage, and scope access per tenant." />
                <PreviewRow title="Projects module" desc="CRUD, membership, and server-validated actions." />
                <PreviewRow title="Secure backend" desc="Protected routes, guards, and audit-friendly APIs." />
              </div>

              <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-black dark:text-zinc-300">
                Tip: Use <span className="font-semibold">/docs</span> to document architecture decisions
                (Server vs Client, RBAC, tenant resolution).
              </div>
            </div>
          </div>
        </section>

        {/* 3) Core Features */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">Core features for a real SaaS</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Minimal UI, maximum architectural clarity — built for a portfolio that reads like production.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              title="Multi-tenant architecture"
              desc="Tenant-isolated routing and data boundaries that scale."
            />
            <FeatureCard
              title="Role-based access control"
              desc="Platform admin, tenant admin, and tenant users with clear permissions."
            />
            <FeatureCard
              title="Projects & memberships"
              desc="Create projects, manage members, and control visibility."
            />
            <FeatureCard
              title="Secure APIs & server actions"
              desc="Validated inputs, guarded endpoints, and predictable side effects."
            />
          </div>
        </section>

        {/* 4) How It Works */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              A simple onboarding flow that matches how SaaS products work in the real world.
            </p>
          </div>

          <ol className="mt-8 grid gap-4 lg:grid-cols-3">
            <StepCard step="01" title="Sign up" desc="Create your account and access the platform." />
            <StepCard
              step="02"
              title="Create or join a tenant"
              desc="Spin up a workspace or accept an invite."
            />
            <StepCard
              step="03"
              title="Manage projects"
              desc="Create projects, add members, and collaborate securely."
            />
          </ol>
        </section>

        {/* 5) Docs / Technical Philosophy */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="max-w-3xl space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">Docs & technical philosophy</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                Keep your architecture decisions documented — Server vs Client Components, tenant
                resolution strategy, RBAC guards, and API conventions.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/docs"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white px-6 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-black dark:text-zinc-100 dark:hover:bg-zinc-950"
                >
                  View Docs
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-black"
                >
                  Start Building
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 6) Final CTA */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-2xl font-semibold tracking-tight">Ready to build a real SaaS?</h2>
            <p className="mx-auto mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
              SaaSify gives you a clean foundation to demonstrate production-grade patterns in your portfolio.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-black"
              >
                Get Started
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white px-6 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-black dark:text-zinc-100 dark:hover:bg-zinc-950"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 7) Footer */}
      <footer className="border-t border-zinc-200 bg-white py-10 dark:border-zinc-800 dark:bg-black">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            © {new Date().getFullYear()} SaaSify. Built with Next.js + TypeScript.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/docs"
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Docs
            </Link>
            <Link
              href="/sign-in"
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{desc}</p>
    </div>
  );
}

function StepCard({ step, title, desc }: { step: string; title: string; desc: string }) {
  return (
    <li className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">STEP {step}</p>
      <p className="mt-2 text-sm font-semibold">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{desc}</p>
    </li>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

function PreviewRow({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{desc}</p>
    </div>
  );
}
