// FILE: components/common/Pagination.tsx
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = {
  limit: number;
  offset: number;
  itemCount: number; // number of items returned for the current page (helps decide next button)
};

export default function Pagination({ limit, offset, itemCount }: Props) {
  const router = useRouter();
  const sp = useSearchParams();

  const canPrev = offset > 0;
  const canNext = itemCount >= limit; // heuristic: if we got a full page, assume there might be more

  function setParam(nextOffset: number) {
    const params = new URLSearchParams(sp.toString());
    params.set("limit", String(limit));
    params.set("offset", String(Math.max(nextOffset, 0)));
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4">
      <p className="text-sm text-muted-foreground">
        Page offset: <span className="font-medium text-foreground">{offset}</span> • Limit:{" "}
        <span className="font-medium text-foreground">{limit}</span>
      </p>

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="rounded-full"
          disabled={!canPrev}
          onClick={() => setParam(offset - limit)}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          className="rounded-full"
          disabled={!canNext}
          onClick={() => setParam(offset + limit)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
