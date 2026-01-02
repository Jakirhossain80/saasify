// FILE: components/projects/ProjectForm.tsx
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { CreateProjectSchema, UpdateProjectSchema, type ProjectStatus } from "@/schemas/project.schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type CreateValues = z.infer<typeof CreateProjectSchema>;
type UpdateValues = z.infer<typeof UpdateProjectSchema>;

type Props =
  | {
      mode: "create";
      tenantId: string;
      tenantSlug: string;
    }
  | {
      mode: "edit";
      tenantId: string;
      tenantSlug: string;
      projectId: string;
      initial: { title: string; description: string; status: ProjectStatus };
    };

async function apiJson<T>(url: string, init?: RequestInit): Promise<{ ok: true; data: T } | { ok: false; message: string; fieldErrors?: Record<string, string[]> }> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });

  const payload = (await res.json().catch(() => null)) as
    | { ok: true; data: T }
    | { ok: false; error: { message: string; fieldErrors?: Record<string, string[]> } }
    | null;

  if (res.ok && payload && "ok" in payload && payload.ok) return { ok: true, data: payload.data };
  if (payload && "ok" in payload && !payload.ok) {
    return { ok: false, message: payload.error.message, fieldErrors: payload.error.fieldErrors };
  }
  return { ok: false, message: "Request failed" };
}

export default function ProjectForm(props: Props) {
  const isEdit = props.mode === "edit";

  const form = useForm<CreateValues | UpdateValues>({
    resolver: zodResolver(isEdit ? UpdateProjectSchema : CreateProjectSchema),
    defaultValues: isEdit
      ? {
          title: props.initial.title,
          description: props.initial.description,
          status: props.initial.status,
        }
      : {
          title: "",
          description: "",
        },
    mode: "onSubmit",
  });

  const [submitting, setSubmitting] = React.useState(false);

  async function onSubmit(values: CreateValues | UpdateValues) {
    setSubmitting(true);

    const url =
      props.mode === "create"
        ? `/api/tenant/${props.tenantId}/projects`
        : `/api/tenant/${props.tenantId}/projects/${props.projectId}`;

    const method = props.mode === "create" ? "POST" : "PATCH";

    const res = await apiJson(url, {
      method,
      body: JSON.stringify(values),
    });

    setSubmitting(false);

    if (!res.ok) {
      toast.error(res.message);

      if (res.fieldErrors) {
        for (const [k, msgs] of Object.entries(res.fieldErrors)) {
          if (k === "title") form.setError("title" as any, { type: "server", message: msgs[0] });
          if (k === "description") form.setError("description" as any, { type: "server", message: msgs[0] });
          if (k === "status") form.setError("status" as any, { type: "server", message: msgs[0] });
        }
      }
      return;
    }

    toast.success(props.mode === "create" ? "Project created" : "Project updated");
    window.location.href =
      props.mode === "create"
        ? `/tenant/${props.tenantSlug}/projects`
        : `/tenant/${props.tenantSlug}/projects/${props.projectId}`;
  }

  return (
    <Card id={props.mode === "create" ? "create-project" : "edit-project"} className="rounded-3xl border bg-card p-6 sm:p-8">
      <div className="space-y-2">
        <h2 className="font-poppins text-lg font-semibold">
          {props.mode === "create" ? "Create project" : "Edit project"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {props.mode === "create"
            ? "Add a new project to this tenant."
            : "Update title, description, or status."}
        </p>
      </div>

      <form className="mt-6 space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="e.g. New onboarding flow"
            {...form.register("title")}
            aria-invalid={Boolean(form.formState.errors.title)}
          />
          {form.formState.errors.title?.message ? (
            <p className="text-sm text-destructive">{String(form.formState.errors.title.message)}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="What is this project about?"
            rows={4}
            {...form.register("description")}
            aria-invalid={Boolean(form.formState.errors.description)}
          />
          {form.formState.errors.description?.message ? (
            <p className="text-sm text-destructive">{String(form.formState.errors.description.message)}</p>
          ) : null}
        </div>

        {isEdit ? (
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              {...form.register("status")}
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
            {form.formState.errors.status?.message ? (
              <p className="text-sm text-destructive">{String(form.formState.errors.status.message)}</p>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" className="rounded-full" disabled={submitting}>
            {submitting ? "Saving..." : props.mode === "create" ? "Create" : "Save changes"}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={() =>
              (window.location.href =
                props.mode === "create"
                  ? `/tenant/${props.tenantSlug}/projects`
                  : `/tenant/${props.tenantSlug}/projects/${props.projectId}`)
            }
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
