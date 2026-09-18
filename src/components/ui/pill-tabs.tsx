"use client";

import { cn } from "@/lib/utils";

export function PillTabs<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-2 overflow-x-auto pb-1", className)}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={cn(
              "flex h-11 flex-shrink-0 items-center justify-center whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition-colors",
              active
                ? "border-terracotta bg-terracotta text-white"
                : "border-border bg-surface-soft text-ink-soft hover:border-terracotta/40",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
