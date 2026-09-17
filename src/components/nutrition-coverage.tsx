import { getCoverageNudge, getCoveragePraise } from "@/lib/encouragement";

type CoverageRow = { slug: string; name: string; daysHit: number };

export function NutritionCoverage({ rows }: { rows: CoverageRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-ink-faint">
        Pick a few focus areas to see your weekly coverage here.
      </p>
    );
  }

  const strong = rows.filter((r) => r.daysHit >= 4).sort((a, b) => b.daysHit - a.daysHit);
  const light = rows.filter((r) => r.daysHit < 4).sort((a, b) => a.daysHit - b.daysHit);

  return (
    <div className="space-y-5">
      <div className="space-y-2.5">
        {rows.map((row) => (
          <div key={row.slug}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-ink">{row.name}</span>
              <span className="text-ink-faint">{row.daysHit}/7 days</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-cream-soft">
              <div
                className="h-full rounded-full bg-sage-deep transition-all"
                style={{ width: `${(row.daysHit / 7) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-1.5 text-sm text-ink-soft">
        {strong[0] && <p>{getCoveragePraise(strong[0].name)}</p>}
        {light[0] && <p>{getCoverageNudge(light[0].name)}</p>}
      </div>
    </div>
  );
}
