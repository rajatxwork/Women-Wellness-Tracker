import {
  CARDIO_TYPES,
  CARDIO_WEEKLY_TARGETS,
  CARDIO_NO_EQUIPMENT_OPTIONS,
  CARDIO_EQUIPMENT_OPTIONS,
  CARDIO_FRICTION_TIPS,
} from "@/lib/data/cardio";
import { LibrarySection } from "@/components/library/library-section";

export function CardioChapter() {
  return (
    <div className="space-y-8">
      <LibrarySection id="cardio-types" title="The two types of cardio" subtitle="Both matter, for different reasons.">
        <div className="grid gap-4 sm:grid-cols-2">
          {CARDIO_TYPES.map((c) => (
            <div key={c.type} className="rounded-3xl border border-border bg-surface-soft p-4">
              <h3 className="font-serif-display text-base text-ink">{c.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{c.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.examples.map((ex) => (
                  <span
                    key={ex}
                    className="rounded-full bg-water/15 px-2.5 py-1 text-[11px] font-medium text-water"
                  >
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </LibrarySection>

      <LibrarySection id="cardio-targets" title="Weekly targets">
        <div className="rounded-3xl border border-border bg-surface-soft p-4">
          <p className="text-sm leading-relaxed text-ink">
            Aim for{" "}
            <span className="font-semibold">
              {CARDIO_WEEKLY_TARGETS.moderateMinutesLow}–{CARDIO_WEEKLY_TARGETS.moderateMinutesHigh}{" "}
              minutes
            </span>{" "}
            of moderate cardio a week, or{" "}
            <span className="font-semibold">
              {CARDIO_WEEKLY_TARGETS.vigorousMinutesLow}–{CARDIO_WEEKLY_TARGETS.vigorousMinutesHigh}{" "}
              minutes
            </span>{" "}
            of vigorous cardio.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-ink-faint">{CARDIO_WEEKLY_TARGETS.note}</p>
        </div>
      </LibrarySection>

      <LibrarySection id="cardio-equipment" title="No equipment needed, or make it harder">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-border bg-surface-soft p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
              No equipment
            </p>
            <ul className="mt-2 space-y-1.5">
              {CARDIO_NO_EQUIPMENT_OPTIONS.map((o) => (
                <li key={o} className="text-sm text-ink">
                  {o}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-surface-soft p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
              With equipment
            </p>
            <ul className="mt-2 space-y-1.5">
              {CARDIO_EQUIPMENT_OPTIONS.map((o) => (
                <li key={o} className="text-sm text-ink">
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </LibrarySection>

      <LibrarySection id="cardio-friction" title="Low friction ways to fit it in">
        <ul className="space-y-2">
          {CARDIO_FRICTION_TIPS.map((tip) => (
            <li
              key={tip}
              className="rounded-2xl border border-border bg-surface-soft px-4 py-2.5 text-sm text-ink"
            >
              {tip}
            </li>
          ))}
        </ul>
      </LibrarySection>
    </div>
  );
}
