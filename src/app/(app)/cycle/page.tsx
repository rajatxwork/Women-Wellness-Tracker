import { Moon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAuthedUser, getProfile } from "@/lib/supabase/get-user";
import { todayISO } from "@/lib/utils";
import { computeCycleStatus } from "@/lib/cycle";
import { CYCLE_PHASES } from "@/lib/data/cycle-phases";
import { getPhaseTip } from "@/lib/encouragement";
import { Card } from "@/components/ui/card";
import { PageHeading } from "@/components/page-heading";
import { SymptomLogForm } from "@/components/symptom-log-form";
import { PeriodLogForm } from "@/components/period-log-form";
import { CycleCalendar, buildPredictedPeriod } from "@/components/cycle-calendar";

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

  return (
    <div className="space-y-6">
      <PageHeading
        icon={Moon}
        title="Your cycle"
        subtitle="Tracked gently, not obsessively, just enough to understand your own patterns."
      />

      {cycleStatus ? (
        <Card className="bg-blush/30">
          <p className="text-xs font-semibold uppercase tracking-wide text-terracotta-deep">
            Day {cycleStatus.dayOfCycle} of your cycle · {CYCLE_PHASES[cycleStatus.phase].name} phase
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink">{getPhaseTip(cycleStatus.phase)}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-ink-soft">Training note</p>
              <p className="mt-1 text-sm text-ink-soft">
                {CYCLE_PHASES[cycleStatus.phase].trainingNote}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-ink-soft">Nutrition note</p>
              <p className="mt-1 text-sm text-ink-soft">
                {CYCLE_PHASES[cycleStatus.phase].nutritionNote}
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs text-ink-faint">
            Next period predicted around {cycleStatus.nextPeriodDate.toLocaleDateString()} ·
            {" "}Ovulation window around {cycleStatus.ovulationDate.toLocaleDateString()}
          </p>
        </Card>
      ) : (
        <Card>
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
