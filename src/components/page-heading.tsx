import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHeading({
  icon: Icon,
  title,
  subtitle,
  accentClass = "bg-blush/40 text-terracotta-deep",
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  accentClass?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={cn(
          "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full",
          accentClass,
        )}
      >
        <Icon size={20} strokeWidth={1.8} />
      </span>
      <div>
        <h1 className="font-serif-display text-3xl text-ink">{title}</h1>
        <p className="mt-1 text-ink-soft">{subtitle}</p>
      </div>
    </div>
  );
}
