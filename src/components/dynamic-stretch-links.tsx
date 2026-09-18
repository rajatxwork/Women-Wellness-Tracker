import { Flame } from "lucide-react";
import { stretchVideoSearchUrl } from "@/lib/video-link";

const AREAS: { value: "upper" | "lower" | "full"; label: string }[] = [
  { value: "upper", label: "Upper body" },
  { value: "lower", label: "Lower body" },
  { value: "full", label: "Full body" },
];

export function DynamicStretchLinks() {
  return (
    <div className="rounded-2xl border border-border bg-surface-soft p-3.5">
      <div className="mb-2 flex items-center gap-2">
        <Flame size={16} className="text-terracotta-deep" />
        <p className="text-sm font-semibold text-ink">Warm up first: dynamic stretches</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {AREAS.map((a) => (
          <a
            key={a.value}
            href={stretchVideoSearchUrl(a.value)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center rounded-full bg-cream-soft px-3.5 text-sm font-medium text-ink-soft transition-colors hover:bg-blush/50 hover:text-ink"
          >
            {a.label}
          </a>
        ))}
      </div>
    </div>
  );
}
