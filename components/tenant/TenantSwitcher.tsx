// FILE: components/tenant/TenantSwitcher.tsx
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTenantStore, type TenantChoice } from "@/store/tenant";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const TENANT_COOKIE = "saasify_tenant";

export type TenantSwitcherItem = {
  tenantId: string;
  name: string;
  slug: string;
  role?: "tenant_admin" | "tenant_user";
};

type TenantSwitcherProps = {
  items: TenantSwitcherItem[];
  className?: string;
};

function setTenantCookie(tenantId: string) {
  const isProd = process.env.NODE_ENV === "production";
  const maxAgeSeconds = 60 * 60 * 24 * 30; // 30 days

  // Cookie string format (document.cookie)
  const parts = [
    `${TENANT_COOKIE}=${encodeURIComponent(tenantId)}`,
    "Path=/",
    `Max-Age=${maxAgeSeconds}`,
    "SameSite=Lax",
  ];

  if (isProd) parts.push("Secure");

  document.cookie = parts.join("; ");
}

export default function TenantSwitcher({ items, className }: TenantSwitcherProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { selected, setSelected } = useTenantStore();

  const initialValue =
    selected?.tenantId ||
    (items.length === 1 ? items[0]?.tenantId : "") ||
    "";

  const [value, setValue] = React.useState<string>(initialValue);

  React.useEffect(() => {
    if (!value && items.length === 1) setValue(items[0]?.tenantId ?? "");
  }, [items, value]);

  const chosen = React.useMemo(() => {
    const found = items.find((x) => x.tenantId === value);
    if (!found) return null;

    const choice: TenantChoice = {
      tenantId: found.tenantId,
      tenantName: found.name,
      tenantSlug: found.slug,
    };

    return choice;
  }, [items, value]);

  function handleContinue() {
    if (!chosen?.tenantId) return;

    setTenantCookie(chosen.tenantId);
    setSelected(chosen);

    const next = searchParams.get("next");
    if (next && next.startsWith("/")) {
      router.push(next);
      router.refresh();
      return;
    }

    // MVP: route segmentation exists; tenant-specific routes come next phase
    router.push("/tenant");
    router.refresh();
  }

  return (
    <Card className={cn("rounded-3xl border bg-card p-6 sm:p-8", className)}>
      <div className="space-y-2">
        <h1 className="font-poppins text-2xl font-semibold sm:text-3xl">
          Select a tenant
        </h1>
        <p className="font-inter text-sm text-muted-foreground sm:text-base">
          Choose the workspace you want to access. Your selection is saved for future visits.
        </p>
      </div>

      <div className="mt-6">
        <RadioGroup value={value} onValueChange={setValue} className="space-y-3">
          {items.map((t) => (
            <div
              key={t.tenantId}
              className={cn(
                "flex items-center justify-between gap-4 rounded-2xl border bg-background p-4",
                value === t.tenantId && "border-indigo-500/50 ring-2 ring-indigo-500/20"
              )}
            >
              <div className="flex items-start gap-3">
                <RadioGroupItem value={t.tenantId} id={t.tenantId} />
                <div className="space-y-0.5">
                  <Label htmlFor={t.tenantId} className="cursor-pointer font-poppins">
                    {t.name}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    /{t.slug}
                    {t.role ? (
                      <span className="ml-2 rounded-full border px-2 py-0.5 text-[11px]">
                        {t.role === "tenant_admin" ? "Tenant Admin" : "Tenant User"}
                      </span>
                    ) : null}
                  </p>
                </div>
              </div>

              <span className="text-xs text-muted-foreground">Workspace</span>
            </div>
          ))}
        </RadioGroup>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            className="rounded-full"
            disabled={!chosen?.tenantId}
            onClick={handleContinue}
          >
            Continue
          </Button>

          <Button
            variant="outline"
            className="rounded-full"
            type="button"
            onClick={() => router.push("/")}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </Card>
  );
}

