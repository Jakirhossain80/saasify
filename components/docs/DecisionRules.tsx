// FILE: components/docs/DecisionRules.tsx
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function DecisionRules() {
  return (
    <div className="space-y-4">
      <Card className="rounded-3xl border bg-card p-6 sm:p-8">
        <h2 className="font-poppins text-lg font-semibold">
          Practical rule (default)
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            Page + data fetching = Server Component
          </span>{" "}
          •{" "}
          <span className="font-medium text-foreground">
            UI widgets/forms = Client Component
          </span>
        </p>

        <Separator className="my-6" />

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="font-poppins font-semibold">
              Prefer Server Components when
            </h3>
            <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
              <li>
                Rendering pages that require{" "}
                <span className="font-medium text-foreground">
                  secure tenant-scoped data
                </span>{" "}
                on first load
              </li>
              <li>
                Showing lists/details where{" "}
                <span className="font-medium text-foreground">
                  no heavy interactivity
                </span>{" "}
                is required
              </li>
              <li>
                You want{" "}
                <span className="font-medium text-foreground">
                  SSR benefits
                </span>{" "}
                (faster initial paint, less client JS)
              </li>
              <li>
                You want authorization to happen{" "}
                <span className="font-medium text-foreground">
                  on the server boundary
                </span>{" "}
                (guards + tenant resolution)
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-poppins font-semibold">
              Use Client Components when
            </h3>
            <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
              <li>
                You need{" "}
                <span className="font-medium text-foreground">
                  React Hook Form
                </span>
                , controlled inputs, client-side validation UX
              </li>
              <li>
                Complex table interactions (sorting UI, inline edits,{" "}
                <span className="font-medium text-foreground">debounced</span>{" "}
                search input)
              </li>
              <li>
                Zustand UI state (sidebar open, tenant switcher modal, local UI
                preferences)
              </li>
              <li>
                Toasts, dialogs, dropdowns (shadcn/ui often requires{" "}
                <span className="font-medium text-foreground">
                  “use client”
                </span>
                )
              </li>
            </ul>
          </div>
        </div>
      </Card>

      <Card className="rounded-3xl border bg-card p-6 sm:p-8">
        <h2 className="font-poppins text-lg font-semibold">
          SaaSify examples
        </h2>

        <Separator className="my-6" />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border bg-background p-4">
            <h3 className="font-poppins text-sm font-semibold">
              Server Components (examples)
            </h3>
            <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
              <li>
                <code className="rounded bg-muted px-1 py-0.5">
                  app/(tenant)/[tenantSlug]/projects/page.tsx
                </code>
              </li>
              <li>
                <code className="rounded bg-muted px-1 py-0.5">
                  app/(tenant)/[tenantSlug]/dashboard/page.tsx
                </code>
              </li>
              <li>
                <code className="rounded bg-muted px-1 py-0.5">
                  app/(platform)/dashboard/page.tsx
                </code>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border bg-background p-4">
            <h3 className="font-poppins text-sm font-semibold">
              Client Components (examples)
            </h3>
            <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
              <li>
                <code className="rounded bg-muted px-1 py-0.5">
                  components/projects/ProjectForm.tsx
                </code>
              </li>
              <li>
                <code className="rounded bg-muted px-1 py-0.5">
                  components/common/SearchInput.tsx
                </code>
              </li>
              <li>
                <code className="rounded bg-muted px-1 py-0.5">
                  components/tenant/TenantSwitcher.tsx
                </code>
              </li>
              <li>
                <code className="rounded bg-muted px-1 py-0.5">
                  components/charts/*
                </code>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Default to Server Components, then “promote” specific UI pieces to
          Client Components only when necessary.
        </p>
      </Card>
    </div>
  );
}
