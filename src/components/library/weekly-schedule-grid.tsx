import { WEEKLY_STRUCTURE } from "@/lib/data/movement";
import { cn } from "@/lib/utils";
import { Dumbbell, HeartPulse, Moon, Sparkles } from "lucide-react";

const DAY_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const TYPE_STYLES: Record<
  (typeof WEEKLY_STRUCTURE)[number]["type"],
  { icon: typeof Dumbbell; badge: string; label: string }
> = {
  strength: { icon: Dumbbell, badge: "bg-terracotta/15 text-terracotta-deep", label: "Strength" },
  cardio: { icon: HeartPulse, badge: "bg-water/15 text-water", label: "Cardio" },
  recovery: { icon: Sparkles, badge: "bg-sage/15 text-sage-deep", label: "Recovery" },
  rest: { icon: Moon, badge: "bg-rose/15 text-rose", label: "Rest" },
};

export function WeeklyScheduleGrid() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      {WEEKLY_STRUCTURE.map((day, i) => {
        const style = TYPE_STYLES[day.type];
        const Icon = style.icon;
        return (
          <div
            key={day.day}
            className="flex flex-col gap-3 rounded-3xl border border-border bg-surface-soft p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                {DAY_LABELS[i]}
              </p>
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full",
                  style.badge,
                )}
              >
                <Icon size={16} strokeWidth={1.8} />
              </span>
            </div>
            <span
              className={cn(
                "inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
                style.badge,
              )}
            >
              {style.label}
            </span>
            <p className="text-sm leading-relaxed text-ink">{day.focus}</p>
          </div>
        );
      })}
    </div>
  );
}
