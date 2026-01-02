// FILE: components/charts/PlatformTotalsChart.tsx
"use client";

import * as React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

type Datum = { name: string; value: number };

type Props = {
  data: Datum[];
};

export default function PlatformTotalsChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="name" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="value" />
      </BarChart>
    </ResponsiveContainer>
  );
}
