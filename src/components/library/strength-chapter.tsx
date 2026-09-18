import { FORM_PRINCIPLES, WARMUP_TIPS, PROGRESSION_VARIABLES } from "@/lib/data/movement";
import { LibrarySection } from "@/components/library/library-section";
import { WeeklyScheduleGrid } from "@/components/library/weekly-schedule-grid";
import { MovementPatternLibrary } from "@/components/library/movement-pattern-library";
import { BodyweightProgression } from "@/components/library/bodyweight-progression";

export function StrengthChapter() {
  return (
    <div className="space-y-8">
      <LibrarySection
        id="strength-schedule"
        title="Weekly training schedule"
        subtitle="A simple, repeatable structure for the week."
      >
        <WeeklyScheduleGrid />
      </LibrarySection>

      <LibrarySection
        id="strength-patterns"
        title="Movement pattern library"
        subtitle="Every core pattern, with a gym, home, and bodyweight option."
      >
        <MovementPatternLibrary />
      </LibrarySection>

      <LibrarySection
        id="strength-progressions"
        title="Bodyweight progression levels"
        subtitle="No equipment? Build up through three levels of challenge."
      >
        <BodyweightProgression />
      </LibrarySection>

      <LibrarySection id="strength-form" title="Form principles & warm up" defaultOpen={false}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-border bg-surface-soft p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
              Form principles
            </p>
            <ul className="mt-2 space-y-2">
              {FORM_PRINCIPLES.map((p) => (
                <li key={p} className="text-sm leading-relaxed text-ink">
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-surface-soft p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
              Warm up tips
            </p>
            <ul className="mt-2 space-y-2">
              {WARMUP_TIPS.map((p) => (
                <li key={p} className="text-sm leading-relaxed text-ink">
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-4 rounded-3xl border border-border bg-surface-soft p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Ways to make any move harder
          </p>
          <ul className="mt-2 space-y-2">
            {PROGRESSION_VARIABLES.map((v) => (
              <li key={v.name} className="text-sm leading-relaxed text-ink">
                <span className="font-semibold">{v.name}.</span> {v.detail}
              </li>
            ))}
          </ul>
        </div>
      </LibrarySection>
    </div>
  );
}
