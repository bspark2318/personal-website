import type { MatchupSide } from "@/lib/wnba";
import PlayerLogTable from "./PlayerLogTable";

export default function MatchupCard({ side }: { side: MatchupSide }) {
  return (
    <div className="flex-1">
      <div className="mb-3 flex items-center gap-2">
        {side.team.logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={side.team.logo} alt="" className="h-6 w-6" />
        )}
        <h2 className="text-sm font-semibold">{side.team.displayName}</h2>
        <span className="text-xs text-muted">projected starters (by minutes)</span>
      </div>
      <div className="flex flex-col gap-3">
        {side.starters.map((p) => (
          <PlayerLogTable key={p.playerId} player={p} />
        ))}
      </div>
    </div>
  );
}
