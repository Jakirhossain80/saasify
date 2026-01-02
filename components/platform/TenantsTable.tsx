// FILE: components/platform/TenantsTable.tsx
"use client";

import * as React from "react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/common/SearchInput";
import Pagination from "@/components/common/Pagination";

export type TenantRow = {
  id: string;
  name: string;
  slug: string;
  status: "active" | "suspended";
  createdAt: string;
};

type Props = {
  rows: TenantRow[];
  total: number;
  limit: number;
  offset: number;
};

async function apiJson<T>(url: string, init?: RequestInit): Promise<{ ok: true; data: T } | { ok: false; message: string }> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });

  const payload = (await res.json().catch(() => null)) as
    | { ok: true; data: T }
    | { ok: false; error: { message: string } }
    | null;

  if (res.ok && payload && "ok" in payload && payload.ok) return { ok: true, data: payload.data };
  if (payload && "ok" in payload && !payload.ok) return { ok: false, message: payload.error.message };
  return { ok: false, message: "Request failed" };
}

export default function TenantsTable({ rows, total, limit, offset }: Props) {
  const [busyId, setBusyId] = React.useState<string | null>(null);

  async function setStatus(tenantId: string, status: "active" | "suspended") {
    setBusyId(tenantId);
    const r = await apiJson(`/api/platform/tenants/${tenantId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    setBusyId(null);

    if (!r.ok) {
      toast.error(r.message);
      return;
    }

    toast.success(status === "active" ? "Tenant activated" : "Tenant suspended");
    window.location.reload();
  }

  return (
    <div className="rounded-3xl border bg-card">
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="font-poppins text-base font-semibold sm:text-lg">
            Tenant list
          </h2>
          <p className="text-sm text-muted-foreground">
            Total: <span className="font-medium text-foreground">{total}</span>
          </p>
        </div>

        <div className="w-full sm:max-w-md">
          <SearchInput placeholder="Search tenants by name or slug..." />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[240px]">Tenant</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((t) => {
              const isBusy = busyId === t.id;

              return (
                <TableRow key={t.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-poppins text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.id}</p>
                    </div>
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {t.slug || "—"}
                  </TableCell>

                  <TableCell>
                    <Badge variant={t.status === "suspended" ? "secondary" : "default"}>
                      {t.status === "suspended" ? "Suspended" : "Active"}
                    </Badge>
                  </TableCell>

                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "—"}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {t.status === "active" ? (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="rounded-full"
                          disabled={isBusy}
                          onClick={() => setStatus(t.id, "suspended")}
                        >
                          Suspend
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="rounded-full"
                          disabled={isBusy}
                          onClick={() => setStatus(t.id, "active")}
                        >
                          Activate
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 sm:p-6">
        <Pagination limit={limit} offset={offset} itemCount={rows.length} />
      </div>
    </div>
  );
}
