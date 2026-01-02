// FILE: components/common/SearchInput.tsx
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  placeholder?: string;
};

export default function SearchInput({ placeholder = "Search..." }: Props) {
  const router = useRouter();
  const sp = useSearchParams();

  const [value, setValue] = React.useState<string>(sp.get("search") ?? "");

  React.useEffect(() => {
    setValue(sp.get("search") ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp.get("search")]);

  function apply(nextSearch: string) {
    const params = new URLSearchParams(sp.toString());
    const s = nextSearch.trim();

    if (s) params.set("search", s);
    else params.delete("search");

    // Reset pagination when searching
    params.set("offset", "0");
    if (!params.get("limit")) params.set("limit", "12");

    router.push(`?${params.toString()}`);
  }

  return (
    <div className="flex w-full flex-col gap-2 sm:max-w-md sm:flex-row sm:items-center">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="h-11"
        onKeyDown={(e) => {
          if (e.key === "Enter") apply(value);
        }}
        aria-label="Search projects"
      />
      <div className="flex gap-2">
        <Button className="h-11 rounded-full" onClick={() => apply(value)}>
          Search
        </Button>
        <Button
          variant="outline"
          className="h-11 rounded-full"
          onClick={() => apply("")}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
