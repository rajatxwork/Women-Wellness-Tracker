"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const TERRACOTTA = "#c97b5e";
const SAGE = "#7a9478";
const BLUSH = "#e2a6a8";
const WATER = "#7fb0a8";
const PLUM = "#8a6a7a";

const tooltipStyle = {
  borderRadius: 16,
  border: "1px solid #ece0d5",
  background: "#fffdfb",
  fontSize: 13,
  boxShadow: "0 8px 30px -12px rgba(90,62,46,0.25)",
};

const axisStyle = { fontSize: 12, fill: "#9c8d85" };

export function WeightProgressionChart({
  data,
}: {
  data: { date: string; weight: number | null; reps: number | null }[];
}) {
  if (data.length === 0) {
    return <EmptyChart label="No sets logged for this exercise yet." />;
  }
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ece0d5" vertical={false} />
        <XAxis dataKey="date" tick={axisStyle} tickLine={false} axisLine={false} />
        <YAxis tick={axisStyle} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line type="monotone" dataKey="weight" stroke={TERRACOTTA} strokeWidth={2.5} dot={{ r: 3 }} name="Weight (kg)" connectNulls />
        <Line type="monotone" dataKey="reps" stroke={SAGE} strokeWidth={2.5} dot={{ r: 3 }} name="Reps" connectNulls />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function WeeklyConsistencyChart({
  data,
}: {
  data: { week: string; completed: number; planned: number }[];
}) {
  if (data.length === 0) return <EmptyChart label="Log a session and this will start filling in." />;
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ece0d5" vertical={false} />
        <XAxis dataKey="week" tick={axisStyle} tickLine={false} axisLine={false} />
        <YAxis tick={axisStyle} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="planned" fill="#f4ebe1" radius={[8, 8, 0, 0]} name="Planned" />
        <Bar dataKey="completed" fill={TERRACOTTA} radius={[8, 8, 0, 0]} name="Completed" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function HabitCompletionChart({
  data,
}: {
  data: { name: string; rate: number }[];
}) {
  if (data.length === 0) return <EmptyChart label="Add a habit to see your completion rate here." />;
  return (
    <ResponsiveContainer width="100%" height={Math.max(160, data.length * 44)}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 24, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ece0d5" horizontal={false} />
        <XAxis type="number" domain={[0, 100]} tick={axisStyle} tickLine={false} axisLine={false} unit="%" />
        <YAxis type="category" dataKey="name" tick={axisStyle} tickLine={false} axisLine={false} width={120} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}%`} />
        <Bar dataKey="rate" fill={SAGE} radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function WaterTrendChart({ data }: { data: { date: string; ml: number }[] }) {
  if (data.length === 0) return <EmptyChart label="Log some water and your trend will show up here." />;
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="waterFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={WATER} stopOpacity={0.4} />
            <stop offset="95%" stopColor={WATER} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#ece0d5" vertical={false} />
        <XAxis dataKey="date" tick={axisStyle} tickLine={false} axisLine={false} />
        <YAxis tick={axisStyle} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area type="monotone" dataKey="ml" stroke={WATER} strokeWidth={2.5} fill="url(#waterFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function NutritionCoverageChart({
  data,
}: {
  data: { name: string; daysHit: number }[];
}) {
  if (data.length === 0) return <EmptyChart label="Pick some focus areas to see coverage here." />;
  return (
    <ResponsiveContainer width="100%" height={Math.max(160, data.length * 36)}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 24, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ece0d5" horizontal={false} />
        <XAxis type="number" domain={[0, 7]} tick={axisStyle} tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey="name" tick={axisStyle} tickLine={false} axisLine={false} width={140} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}/7 days`} />
        <Bar dataKey="daysHit" fill={BLUSH} radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CycleLengthChart({
  data,
}: {
  data: { cycle: string; length: number }[];
}) {
  if (data.length === 0) return <EmptyChart label="Log a couple of cycles to see your pattern here." />;
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ece0d5" vertical={false} />
        <XAxis dataKey="cycle" tick={axisStyle} tickLine={false} axisLine={false} />
        <YAxis tick={axisStyle} tickLine={false} axisLine={false} domain={["dataMin - 3", "dataMax + 3"]} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v} days`} />
        <Bar dataKey="length" fill={PLUM} radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex h-32 items-center justify-center rounded-2xl bg-cream-soft text-center text-sm text-ink-faint">
      {label}
    </div>
  );
}
