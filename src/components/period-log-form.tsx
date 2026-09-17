"use client";

import { useState, useTransition } from "react";
import { logPeriodStart, logPeriodEnd, updateCycleSettings } from "@/app/actions/cycle";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { todayISO } from "@/lib/utils";

export function PeriodLogForm({
  avgCycleLength,
  openCycleLogId,
}: {
  avgCycleLength: number;
  openCycleLogId: string | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [startDate, setStartDate] = useState(todayISO());
  const [endDate, setEndDate] = useState(todayISO());
  const [cycleLength, setCycleLength] = useState(avgCycleLength);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <Label htmlFor="period-start">Period started</Label>
          <Input
            id="period-start"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <Button
          size="sm"
          disabled={isPending}
          onClick={() => startTransition(() => logPeriodStart(startDate))}
        >
          Log period start
        </Button>
      </div>

      {openCycleLogId && (
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <Label htmlFor="period-end">Period ended</Label>
            <Input
              id="period-end"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <Button
            size="sm"
            variant="outline"
            disabled={isPending}
            onClick={() => startTransition(() => logPeriodEnd(openCycleLogId, endDate))}
          >
            Log period end
          </Button>
        </div>
      )}

      <div className="flex flex-wrap items-end gap-3 border-t border-border pt-4">
        <div>
          <Label htmlFor="cycle-length">Average cycle length</Label>
          <Input
            id="cycle-length"
            type="number"
            min={15}
            max={60}
            value={cycleLength}
            onChange={(e) => setCycleLength(Number(e.target.value))}
            className="w-28"
          />
        </div>
        <Button
          size="sm"
          variant="ghost"
          disabled={isPending}
          onClick={() => startTransition(() => updateCycleSettings(cycleLength))}
        >
          Update
        </Button>
      </div>
    </div>
  );
}
