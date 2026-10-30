import { flag, shortDate, type Lab } from "@/lib/father/data";

const CELL = {
  hi: "text-red-600 dark:text-red-400 font-semibold",
  lo: "text-blue-600 dark:text-blue-400 font-semibold",
  "": "text-foreground/80",
};

export default function LabTable({ rows, dates }: { rows: Lab[]; dates: string[] }) {
  return (
    <div className="-mx-5 overflow-x-auto px-5">
      <table className="w-full min-w-[640px] border-collapse text-[13px]">
        <thead>
          <tr className="text-xs uppercase tracking-wider text-muted">
            <th className="sticky left-0 bg-background py-2 pr-3 text-left font-medium">검사</th>
            <th className="py-2 pr-3 text-left font-medium">정상</th>
            {dates.map((d) => <th key={d} className="py-2 pr-3 text-right font-medium tabular-nums">{shortDate(d)}</th>)}
            <th className="py-2 text-left font-medium">메모</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-t border-card-border">
              <td className="sticky left-0 bg-background py-2 pr-3 font-medium whitespace-nowrap">
                {r.name} <span className="text-[11px] font-normal text-muted">{r.unit}</span>
              </td>
              <td className="py-2 pr-3 text-muted whitespace-nowrap tabular-nums">{r.lo}–{r.hi}</td>
              {r.values.map((v, i) => {
                const f = flag(v, r.lo, r.hi);
                return (
                  <td key={i} className={`py-2 pr-3 text-right tabular-nums whitespace-nowrap ${CELL[f]}`}>
                    {v == null ? "–" : v}{f === "hi" ? " ▲" : f === "lo" ? " ▼" : ""}
                  </td>
                );
              })}
              <td className="py-2 text-xs text-muted">{r.note ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
