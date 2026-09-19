import Link from "next/link";
import { format, differenceInCalendarDays } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { getAuthedUser, getProfile } from "@/lib/supabase/get-user";
import { todayISO } from "@/lib/utils";
import { computeCycleStatus } from "@/lib/cycle";
import { CYCLE_PHASES } from "@/lib/data/cycle-phases";
import { getPhaseTip } from "@/lib/encouragement";
import { Card } from "@/components/ui/card";
import { SymptomLogForm } from "@/components/symptom-log-form";
import { PeriodLogForm } from "@/components/period-log-form";
import { CycleCalendar, buildPredictedPeriod } from "@/components/cycle-calendar";
import { CyclePhaseRing } from "@/components/cycle-phase-ring";
import { BRAND_ASSETS, PHASE_ICONS } from "@/lib/brand-assets";

export default async function CyclePage() {
  const user = await getAuthedUser();
  if (!user) return null;

  const supabase = await createClient();
  const today = todayISO();

  const [profile, { data: cycleLogs }, { data: todaySymptoms }] = await Promise.all([
    getProfile(user.id),
    supabase
      .from("cycle_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("period_start", { ascending: false }),
    supabase
      .from("symptom_logs")
      .select("*")
      .eq("user_id", user.id)
      .eq("log_date", today)
      .maybeSingle(),
  ]);

  const avgCycleLength = profile?.avg_cycle_length ?? 28;
  const cycleStatus = profile?.last_period_start
    ? computeCycleStatus(new Date(profile.last_period_start + "T00:00:00"), avgCycleLength)
    : null;

  const openCycleLog = (cycleLogs ?? []).find((c) => !c.period_end) ?? null;

  const loggedPeriods = (cycleLogs ?? []).map((c) => ({
    start: new Date(c.period_start + "T00:00:00"),
    end: new Date((c.period_end ?? c.period_start) + "T00:00:00"),
  }));

  const predictedPeriod = cycleStatus ? buildPredictedPeriod(cycleStatus.nextPeriodDate) : null;
  const daysToOvulation = cycleStatus
    ? differenceInCalendarDays(cycleStatus.ovulationDate, new Date())
    : null;

  return (
    <div className="space-y-6">
      <div
        className="relative overflow-hidden rounded-organic border border-border bg-cover bg-top p-5 sm:p-6"
        style={{ backgroundImage: `url(${BRAND_ASSETS.gradientCornerGlow}), var(--gradient-glow)` }}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-surface/70">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cycleStatus ? PHASE_ICONS[cycleStatus.phase] : BRAND_ASSETS.logoMark}
              alt=""
              className="h-6 w-6 object-contain"
            />
          </span>
          <div>
            <h1 className="font-serif-display text-3xl text-ink">
              Your <em className="italic">cycle</em>
            </h1>
            <p className="mt-1 text-sm text-ink-soft">
              Tracked gently, not obsessively, just enough to understand your own patterns.
            </p>
          </div>
        </div>
      </div>

      {cycleStatus ? (
        <>
          <Card>
            <CyclePhaseRing
              phase={cycleStatus.phase}
              dayOfCycle={cycleStatus.dayOfCycle}
              cycleLength={avgCycleLength}
            />
            <p className="mx-auto mt-4 max-w-md text-center text-sm leading-relaxed text-ink-soft">
              {getPhaseTip(cycleStatus.phase)}
            </p>

            <div className="mx-auto mt-5 grid max-w-sm grid-cols-3 gap-3">
              <div className="flex aspect-square flex-col items-center justify-center rounded-full border border-border bg-surface-soft">
                <p className="text-lg font-semibold text-ink">{cycleStatus.dayOfCycle}</p>
                <p className="text-[10px] uppercase tracking-wide text-ink-faint">Cycle day</p>
              </div>
              <div className="flex aspect-square flex-col items-center justify-center rounded-full border border-border bg-surface-soft">
                <p className="text-lg font-semibold text-ink">{cycleStatus.daysUntilNextPeriod}d</p>
                <p className="text-[10px] uppercase tracking-wide text-ink-faint">To period</p>
              </div>
              <div className="flex aspect-square flex-col items-center justify-center rounded-full border border-border bg-surface-soft">
                <p className="text-lg font-semibold text-ink">{avgCycleLength}d</p>
                <p className="text-[10px] uppercase tracking-wide text-ink-faint">Avg length</p>
              </div>
            </div>
          </Card>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-organic-sm bg-blush/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-blush-deep">Predicted period</p>
              <p className="mt-1.5 font-serif-display text-lg text-ink">
                {format(cycleStatus.nextPeriodDate, "MMM d")}
              </p>
              <p className="mt-1 text-xs text-ink-soft">In {cycleStatus.daysUntilNextPeriod} days</p>
            </div>
            <div className="rounded-organic-sm bg-gold/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-terracotta-deep">Ovulation window</p>
              <p className="mt-1.5 font-serif-display text-lg text-ink">
                {format(cycleStatus.ovulationDate, "MMM d")}
              </p>
              <p className="mt-1 text-xs text-ink-soft">
                {daysToOvulation !== null && daysToOvulation >= 0
                  ? `In ${daysToOvulation} days`
                  : "Already passed this cycle"}
              </p>
            </div>
            <div className="rounded-organic-sm bg-terracotta/15 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-terracotta-deep">Train like this</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink">
                {CYCLE_PHASES[cycleStatus.phase].trainingNote}
              </p>
              <Link href="/workout" className="mt-2 inline-block text-xs font-semibold text-terracotta-deep">
                Go to workout →
              </Link>
            </div>
            <div className="rounded-organic-sm bg-sage/25 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-sage-deep">Eat like this</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink">
                {CYCLE_PHASES[cycleStatus.phase].nutritionNote}
              </p>
              <Link href="/nutrition" className="mt-2 inline-block text-xs font-semibold text-sage-deep">
                Go to nutrition →
              </Link>
            </div>
          </div>
        </>
      ) : (
        <Card className="flex flex-col items-center gap-3 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BRAND_ASSETS.emptyStatePlant} alt="" className="h-16 w-16" />
          <p className="text-sm text-ink-soft">
            Log your last period start below and we&apos;ll start mapping your phases for you.
          </p>
        </Card>
      )}

      <Card>
        <h2 className="mb-4 font-serif-display text-lg text-ink">Log your period</h2>
        <PeriodLogForm avgCycleLength={avgCycleLength} openCycleLogId={openCycleLog?.id ?? null} />
      </Card>

      <Card>
        <h2 className="mb-4 font-serif-display text-lg text-ink">How are you feeling today?</h2>
        <SymptomLogForm initial={todaySymptoms ?? null} />
      </Card>

      <Card>
        <CycleCalendar
          monthDate={new Date()}
          loggedPeriods={loggedPeriods}
          predictedPeriod={predictedPeriod}
          ovulationDate={cycleStatus?.ovulationDate ?? null}
        />
      </Card>
    </div>
  );
}
