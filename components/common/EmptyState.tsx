// FILE: components/common/EmptyState.tsx
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

type Props = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function EmptyState({ title, description, action }: Props) {
  return (
    <Card className="rounded-3xl border bg-card p-8 text-center">
      <h2 className="font-poppins text-xl font-semibold">{title}</h2>
      {description ? (
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </Card>
  );
}
