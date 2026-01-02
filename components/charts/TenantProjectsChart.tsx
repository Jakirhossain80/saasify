// FILE: components/charts/TenantProjectsChart.tsx
"use client";

import * as React from "react";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from "recharts";

type Datum = { name: string; value: number };

type Props = {
  data: Datum[];
};

export default function TenantProjectsChart({ data }: Props) {
  // Do not hardcode colors; let Recharts default or rely on theme tokens later.
  // We keep cells without explicit fill to respect the "no specific colors" principle.
  const normalized = data.map((d) => ({ ...d, value: Number.isFinite(d.value) ? d.value : 0 }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip />
        <Pie data={normalized} dataKey="value" nameKey="name" outerRadius={90} innerRadius={55}>
          {normalized.map((_, idx) => (
            <Cell key={idx} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
