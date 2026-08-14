import type { Matchup } from "@/lib/wnba";

function Dots({ results }: { results: ("W" | "L")[] }) {
  // most recent first in data; show oldest→newest
  const seq = [...results].reverse();
  return (
    <span className="inline-flex gap-1" aria-label={`Last ${seq.length}: ${seq.join(" ")}`}>
      {seq.map((r, i) => (
        <span
          key={i}
          className={`inline-flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-semibold ${
            r === "W"
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              : "bg-red-500/15 text-red-600 dark:text-red-400"
          }`}
        >
          {r}
        </span>
      ))}
    </span>
  );
}

function Side({ m, side }: { m: Matchup; side: "home" | "away" }) {
  const { team, trend } = m[side];
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-sm font-semibold">{team.abbreviation}</p>
      <Dots results={trend.lastResults} />
      <p className="text-xs text-muted">
        {trend.avgFor} for · {trend.avgAgainst} against ·{" "}
        {trend.avgMargin > 0 ? "+" : ""}
        {trend.avgMargin} margin
      </p>
      {trend.restDays !== null && (
        <p className="text-xs text-muted">
          {trend.restDays <= 1 ? (
            <span className="font-medium text-red-600 dark:text-red-400">
              B2B · {trend.gamesLast7} in 7d
            </span>
          ) : (
            `${trend.restDays}d rest · ${trend.gamesLast7} in 7d`
          )}
        </p>
      )}
    </div>
  );
}

export default function TeamTrends({ matchup }: { matchup: Matchup }) {
  const combined = Math.round((matchup.away.trend.avgFor + matchup.home.trend.avgFor) * 10) / 10;
  return (
    <div className="rounded-2xl border border-card-border p-4">
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted">Team trends · last 10</p>
      <div className="flex items-start justify-between gap-4">
        <Side m={matchup} side="away" />
        <div className="text-center">
          <p className="text-xs text-muted">implied total</p>
          <p className="text-lg font-semibold">{combined}</p>
        </div>
        <Side m={matchup} side="home" />
      </div>
    </div>
  );
}
