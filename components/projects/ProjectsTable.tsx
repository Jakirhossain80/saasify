// FILE: components/projects/ProjectsTable.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type ProjectRow = {
  id: string;
  title: string;
  description: string;
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
};

type Props = {
  tenantId: string;
  tenantSlug: string;
  rows: ProjectRow[];
  canManage: boolean;
};

async function apiRequest<T>(url: string, init?: RequestInit): Promise<{ ok: true; data: T } | { ok: false; message: string }> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });

  const json = (await res.json().catch(() => null)) as unknown;

  const payload = json as { ok?: boolean; data?: T; error?: { message?: string } };
  if (res.ok && payload?.ok) return { ok: true, data: payload.data as T };

  return { ok: false, message: payload?.error?.message ?? "Request failed" };
}

export default function ProjectsTable({ tenantId, tenantSlug, rows, canManage }: Props) {
  const [busyId, setBusyId] = React.useState<string | null>(null);

  async function onArchive(id: string, nextStatus: "archived" | "active") {
    if (!canManage) return;

    setBusyId(id);
    const r = await apiRequest(
      `/api/tenant/${tenantId}/projects/${id}`,
      { method: "PATCH", body: JSON.stringify({ status: nextStatus }) }
    );
    setBusyId(null);

    if (!r.ok) {
      toast.error(r.message);
      return;
    }

    toast.success(nextStatus === "archived" ? "Project archived" : "Project restored");
    window.location.reload();
  }

  async function onDelete(id: string) {
    if (!canManage) return;

    setBusyId(id);
    const r = await apiRequest(
      `/api/tenant/${tenantId}/projects/${id}`,
      { method: "DELETE" }
    );
    setBusyId(null);

    if (!r.ok) {
      toast.error(r.message);
      return;
    }

    toast.success("Project deleted");
    window.location.reload();
  }

  return (
    <div className="rounded-3xl border bg-card">
      <div className="flex items-center justify-between gap-3 border-b p-4 sm:p-6">
        <h2 className="font-poppins text-base font-semibold sm:text-lg">Project list</h2>
        <p className="text-sm text-muted-foreground">{rows.length} items</p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[240px]">Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Created</TableHead>
              <TableHead className="hidden md:table-cell">Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((p) => {
              const isBusy = busyId === p.id;
              const detailsHref = `/tenant/${tenantSlug}/projects/${p.id}`;

              return (
                <TableRow key={p.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="space-y-1">
                      <Link
                        href={detailsHref}
                        className="font-poppins text-sm font-semibold hover:underline"
                      >
                        {p.title}
                      </Link>
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {p.description || "—"}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant={p.status === "archived" ? "secondary" : "default"}>
                      {p.status === "archived" ? "Archived" : "Active"}
                    </Badge>
                  </TableCell>

                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}
                  </TableCell>

                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : "—"}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline" size="sm" className="rounded-full">
                        <Link href={detailsHref}>View</Link>
                      </Button>

                      {canManage ? (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="rounded-full"
                            disabled={isBusy}
                            onClick={() => onArchive(p.id, p.status === "archived" ? "active" : "archived")}
                          >
                            {p.status === "archived" ? "Restore" : "Archive"}
                          </Button>

                          <Button
                            variant="destructive"
                            size="sm"
                            className="rounded-full"
                            disabled={isBusy}
                            onClick={() => onDelete(p.id)}
                          >
                            Delete
                          </Button>
                        </>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
