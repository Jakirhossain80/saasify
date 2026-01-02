// FILE: app/(platform)/layout.tsx
"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/platform" className="font-poppins text-lg font-semibold">
              SaaSify <span className="text-indigo-600 dark:text-indigo-400">Platform</span>
            </Link>
            <span className="hidden text-sm text-muted-foreground sm:inline">
              Admin Area
            </span>
          </div>

          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost" className="rounded-full">
              <Link href="/platform">Dashboard</Link>
            </Button>
            <Button asChild variant="ghost" className="rounded-full">
              <Link href="/tenant">Tenant Workspace</Link>
            </Button>
            <div className="ml-2">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9",
                  },
                }}
              />
            </div>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
