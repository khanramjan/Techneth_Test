"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import type { AnalyticsPoint } from "@/types/dashboard";

type AnalyticsChartsProps = {
  series: AnalyticsPoint[];
  scoreTrendLabel: string;
  scoreTrendBadge: string;
  dealBarsLabel: string;
};

type TooltipPayload = {
  name: string;
  value: number;
};

type TooltipProps = {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
};

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-[#e0e1d7] bg-white px-3 py-2 text-xs text-[#2b2d26] shadow-[0_10px_25px_rgba(54,56,42,0.14)]">
      <p className="mb-1 font-semibold">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-[#5c5f54]">
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

export function AnalyticsCharts({
  series,
  scoreTrendLabel,
  scoreTrendBadge,
  dealBarsLabel,
}: AnalyticsChartsProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="rounded-2xl border border-[#e4e5dc] bg-[#f9f9f4] p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6d7065]">{scoreTrendLabel}</p>
          <span className="rounded-lg bg-[#ece54b] px-2 py-1 text-[10px] font-bold text-[#323428]">{scoreTrendBadge}</span>
        </div>
        <div className="h-28 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#ece54b" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#ece54b" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#7f8176" }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#25261f"
                strokeWidth={2}
                fill="url(#scoreGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-2xl border border-[#e4e5dc] bg-[#f9f9f4] p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6d7065]">{dealBarsLabel}</p>
        <div className="h-28 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={series} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#7f8176" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="started" radius={[5, 5, 0, 0]} fill="#ece54b" />
              <Bar dataKey="lost" radius={[5, 5, 0, 0]} fill="#f4958d" />
              <Bar dataKey="won" radius={[5, 5, 0, 0]} fill="#b8f06c" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
