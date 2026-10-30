"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import TabBar from "@/components/trips/TabBar";
import { lock } from "@/app/father/actions";
import { flag, shortDate, type FatherData, type Lab } from "@/lib/father/data";
import LabTable from "./LabTable";
import Trend from "./Trend";

const TABS = [
  { id: "summary", label: "요약" },
  { id: "prep", label: "진료 준비" },
  { id: "trends", label: "추세" },
  { id: "timeline", label: "타임라인" },
  { id: "labs", label: "검사 수치" },
  { id: "questions", label: "질문" },
  { id: "glossary", label: "용어" },
];

const BADGE = {
  crit: "bg-red-500/10 text-red-600 dark:text-red-400",
  warn: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  ok: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  q: "bg-foreground/[0.06] text-muted",
};
const KPI_NAMES = ["Hb", "Reticulocyte", "총 빌리루빈", "AST", "eGFR", "공복 혈당"];

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl border border-card-border bg-gradient-to-b from-card-from to-transparent p-6 sm:p-7 ${className}`}>
      {children}
    </div>
  );
}
function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 text-lg font-semibold tracking-tight">{children}</h2>;
}
function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted">{children}</p>;
}

function Kpi({ lab, dates }: { lab: Lab; dates: string[] }) {
  const n = lab.values.length;
  const v = lab.values[n - 1]!, prev = lab.values[n - 2];
  const f = flag(v, lab.lo, lab.hi);
  const diff = prev != null ? v - prev : null;
  const color = f === "hi" ? "text-red-600 dark:text-red-400" : f === "lo" ? "text-blue-600 dark:text-blue-400" : "";
  return (
    <div className="rounded-2xl border border-card-border bg-gradient-to-b from-card-from to-transparent p-4">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium text-muted">{lab.name}</span>
        <span className="text-[10px] text-muted">{shortDate(dates[n - 1])}</span>
      </div>
      <div className={`mt-1 flex items-baseline gap-1.5 ${color}`}>
        <span className="text-3xl font-semibold tracking-tight tabular-nums">{v}</span>
        <span className="text-xs text-muted">{lab.unit}</span>
      </div>
      <div className="mt-1 text-[11px] text-muted">
        <div>정상 {lab.lo}–{lab.hi}</div>
        {diff != null && (
          <div className="tabular-nums">전회 대비 {diff > 0 ? "▲" : diff < 0 ? "▼" : "–"} {Math.abs(diff).toFixed(diff % 1 ? 1 : 0)}</div>
        )}
      </div>
      <div className="mt-2"><Trend lab={lab} dates={dates} compact /></div>
    </div>
  );
}

export default function Dashboard({ data }: { data: FatherData }) {
  const [tab, setTab] = useState("summary");
  const all = [...data.cbc, ...data.chem];
  const byGroup = (g: Lab["group"]) => all.filter((l) => l.group === g);
  const kpis = KPI_NAMES.map((n) => all.find((l) => l.name === n)!);

  return (
    <section className="mx-auto max-w-5xl px-5 pb-24 pt-28">
      <motion.header initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="mb-8">
        <Eyebrow>Private · 건강 기록</Eyebrow>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="display text-4xl font-semibold sm:text-5xl">{data.patient.name}</h1>
          <form action={lock}>
            <button className="rounded-full border border-card-border px-3 py-1 text-xs text-muted transition-colors hover:border-card-border-hover hover:text-foreground">잠그기</button>
          </form>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {[data.patient.dx, data.patient.hospital, data.patient.doctor, `${data.patient.weightKg} kg`, data.patient.residence, `자료 ${data.dates[0]} ~ ${data.dates.at(-1)}`, `갱신 ${data.updated}`].map((c) => (
            <span key={c} className="rounded-full border border-card-border px-2.5 py-1 text-muted">{c}</span>
          ))}
        </div>
      </motion.header>

      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="space-y-6">

          {tab === "summary" && (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {kpis.map((l) => <Kpi key={l.name} lab={l} dates={data.dates} />)}
              </div>
              <Card className="border-red-500/30 from-red-500/[0.07]">
                <Eyebrow>1순위 — 다음 진료</Eyebrow>
                <H2>{data.priority.title}</H2>
                <ul className="space-y-2 text-[15px] leading-relaxed">
                  {data.priority.points.map((pt) => <li key={pt} dangerouslySetInnerHTML={{ __html: pt }} />)}
                </ul>
                <p className="mt-4 text-xs text-muted">{data.priority.caveat}</p>
              </Card>
              <Card>
                <H2>가족 확인 결과 <span className="text-sm font-normal text-muted">(2026-10-29)</span></H2>
                <ul className="divide-y divide-card-border">
                  {data.family.answered.map((f) => (
                    <li key={f.q} className="grid gap-1 py-3 sm:grid-cols-[200px_1fr] sm:gap-4">
                      <span className="font-medium"><span className="mr-2 text-emerald-600 dark:text-emerald-400">✓</span>{f.q}</span>
                      <span className="text-sm text-muted">{f.a}</span>
                    </li>
                  ))}
                </ul>
                <h3 className="mt-5 mb-2 text-sm font-semibold text-muted">아직 확인 안 됨</h3>
                <ul className="space-y-1.5 text-sm">
                  {data.family.open.map((o) => <li key={o} className="flex gap-2"><span className="text-muted">○</span><span>{o}</span></li>)}
                </ul>
              </Card>
              <Card>
                <H2>현재 상태</H2>
                <ul className="divide-y divide-card-border">
                  {data.status.map((s) => (
                    <li key={s.item} className="grid gap-1 py-3 sm:grid-cols-[180px_130px_1fr] sm:items-baseline sm:gap-4">
                      <span className="font-medium">{s.item}</span>
                      <span><span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${BADGE[s.level]}`}>{s.badge}</span></span>
                      <span className="text-sm text-muted">{s.why}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card>
                <H2>데이터 한계</H2>
                <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted">{data.gaps.map((g) => <li key={g}>{g}</li>)}</ul>
              </Card>
            </>
          )}

          {tab === "prep" && (
            <>
              <Card className="border-red-500/30 from-red-500/[0.07]">
                <Eyebrow>다음 진료 질문지 · 정철원 교수님께 · 어머니/아버지용</Eyebrow>
                <H2>꼭 물어볼 것 {data.visitPrep.must.length}개 <span className="text-sm font-normal text-muted">(위에서부터 순서대로)</span></H2>
                <ol className="space-y-4">
                  {data.visitPrep.must.map((m, i) => (
                    <li key={m.q} className="flex gap-3">
                      <span className="mt-0.5 h-7 w-7 shrink-0 rounded-full bg-foreground text-center text-sm font-bold leading-7 text-background">{i + 1}</span>
                      <div>
                        <p className="text-[16px] font-semibold leading-snug">{m.q}</p>
                        {m.why && <p className="mt-1 text-sm text-muted">→ {m.why}</p>}
                      </div>
                    </li>
                  ))}
                </ol>
                <p className="mt-5 text-xs text-muted">메모: {data.visitPrep.memo}</p>
              </Card>
              <div className="grid gap-6 sm:grid-cols-2">
                <Card>
                  <H2>시간 되면</H2>
                  <ol className="space-y-2 text-[15px]">
                    {data.visitPrep.ifTime.map((q, i) => (
                      <li key={q} className="flex gap-3"><span className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-foreground/[0.06] text-center text-xs font-semibold leading-6 text-muted">{data.visitPrep.must.length + i + 1}</span><span>{q}</span></li>
                    ))}
                  </ol>
                </Card>
                <Card>
                  <H2>진료 끝나고 받아올 것</H2>
                  <ul className="space-y-2 text-[15px]">
                    {data.visitPrep.bring.map((b) => <li key={b} className="flex gap-2"><span className="text-muted">☐</span><span>{b}</span></li>)}
                  </ul>
                </Card>
              </div>
              <Card>
                <Eyebrow>치료 옵션 조사 · 2026-10-29</Eyebrow>
                <H2>레블로질 (Luspatercept)</H2>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <h3 className="mb-1.5 text-sm font-semibold">적격성 — 핵심 게이트</h3>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-muted">{data.luspatercept.gate.map((g) => <li key={g}>{g}</li>)}</ul>
                  </div>
                  <div>
                    <h3 className="mb-1.5 text-sm font-semibold">급여</h3>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-muted">{data.luspatercept.coverage.map((g) => <li key={g}>{g}</li>)}</ul>
                    <h3 className="mb-1.5 mt-4 text-sm font-semibold">용법</h3>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-muted">{data.luspatercept.dosing.map((g) => <li key={g}>{g}</li>)}</ul>
                  </div>
                </div>
                <h3 className="mb-2 mt-6 text-sm font-semibold">비용 추정 <span className="font-normal text-muted">(체중 {data.patient.weightKg}kg · 한국 공시가 미확인)</span></h3>
                <div className="-mx-5 overflow-x-auto px-5">
                  <table className="w-full min-w-[480px] text-sm">
                    <thead><tr className="text-xs uppercase tracking-wider text-muted"><th className="py-2 text-left font-medium">단계</th><th className="py-2 text-left font-medium">용량</th><th className="py-2 text-left font-medium">바이알</th><th className="py-2 text-right font-medium">1회</th><th className="py-2 text-right font-medium">연간(17회)</th></tr></thead>
                    <tbody>{data.luspatercept.cost.map((c) => (
                      <tr key={c.step} className="border-t border-card-border"><td className="py-2 font-medium">{c.step}</td><td className="py-2">{c.dose}</td><td className="py-2">{c.vials}</td><td className="py-2 text-right tabular-nums">{c.perShot}</td><td className="py-2 text-right tabular-nums font-semibold">{c.perYear}</td></tr>
                    ))}</tbody>
                  </table>
                </div>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">{data.luspatercept.costNote.map((g) => <li key={g}>{g}</li>)}</ul>
                <h3 className="mb-1.5 mt-5 text-sm font-semibold">기대 효과 (MEDALIST)</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted">{data.luspatercept.efficacy.map((g) => <li key={g}>{g}</li>)}</ul>
                <p className="mt-4 text-xs text-muted">출처·상세: ~/Dev/father/notes/luspatercept.md</p>
              </Card>
            </>
          )}

          {tab === "trends" && (
            <>
              <div className="flex flex-wrap gap-4 text-xs text-muted">
                <span><i className="mr-1.5 inline-block h-2.5 w-4 rounded-sm bg-foreground/[0.08] align-middle" />정상범위</span>
                <span><i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-red-500 align-middle" />정상 초과</span>
                <span><i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-blue-500 align-middle" />정상 미만</span>
                <span>점에 마우스를 올리면 값·날짜</span>
              </div>
              {([["core", "Hb와 함께 움직이는 묶음", "Hb가 낮은 날 모두 같이 최고/최저 — 하나의 과정(적혈구 파괴)으로 설명"], ["indep", "독립적으로 움직이는 지표", "약물(다나졸)·대사 문제 등 별개 원인"], ["other", "그 외", ""]] as const).map(([g, title, sub]) => (
                <Card key={g}>
                  <H2>{title}</H2>
                  {sub && <p className="-mt-2 mb-4 text-sm text-muted">{sub}</p>}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {byGroup(g).map((l) => (
                      <div key={l.name} className="rounded-2xl border border-card-border p-4">
                        <div className="mb-1 flex items-baseline justify-between">
                          <span className="font-semibold">{l.name}</span>
                          <span className="text-[11px] text-muted">{l.unit} · 정상 {l.lo}–{l.hi}</span>
                        </div>
                        <Trend lab={l} dates={data.dates} />
                        {l.note && <p className="mt-2 text-xs text-muted">{l.note}</p>}
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </>
          )}

          {tab === "timeline" && (
            <>
              <Card>
                <H2>방문별 이벤트</H2>
                <ol className="relative ml-2 border-l border-card-border pl-6">
                  {data.dates.map((d, i) => {
                    const tx = data.transfusions[i]?.given;
                    return (
                      <li key={d} className="relative pb-6 last:pb-0">
                        <span className={`absolute -left-[31px] top-1 h-2.5 w-2.5 rounded-full ring-4 ring-background ${tx ? "bg-red-500" : "bg-foreground/50"}`} />
                        <div className="text-xs font-semibold tabular-nums text-muted">{d}</div>
                        <div className="mt-0.5 text-[15px]">{data.events[i]}</div>
                      </li>
                    );
                  })}
                </ol>
                <p className="mt-4 text-xs text-muted">● 빨간 점 = 수혈 시행</p>
              </Card>
              <Card>
                <H2>수혈 타임라인 <span className="text-sm font-normal text-muted">(처방 기반 추정)</span></H2>
                <div className="-mx-5 overflow-x-auto px-5">
                  <table className="w-full min-w-[520px] text-sm">
                    <thead><tr className="text-xs uppercase tracking-wider text-muted"><th className="py-2 text-left font-medium">방문</th><th className="py-2 text-right font-medium">Hb</th><th className="py-2 pl-4 text-left font-medium">전처치</th><th className="py-2 pl-4 text-left font-medium">해석</th></tr></thead>
                    <tbody>{data.transfusions.map((t) => (
                      <tr key={t.date} className="border-t border-card-border">
                        <td className="py-2 tabular-nums">{t.date}</td>
                        <td className={`py-2 text-right tabular-nums ${t.given ? "font-semibold text-red-600 dark:text-red-400" : ""}`}>{t.hb}</td>
                        <td className="py-2 pl-4">{t.premed}</td>
                        <td className={`py-2 pl-4 ${t.given ? "font-semibold" : "text-muted"}`}>{t.read}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs text-muted">전처치 = 페니라민(항히스타민) + 생리식염수 → 수혈 세트. 수혈 기준 Hb 약 7.5–8 추정. 간격 약 4개월.</p>
              </Card>
              <Card>
                <H2>처방 기록</H2>
                <ul className="divide-y divide-card-border">
                  {data.meds.map((m) => (
                    <li key={m.date + m.drug} className="grid gap-1 py-3 sm:grid-cols-[100px_1fr] sm:gap-4">
                      <span className="text-xs font-semibold tabular-nums text-muted">{m.date}</span>
                      <div>
                        <div className="font-medium">{m.drug} <span className="font-normal text-muted">· {m.how}</span></div>
                        <div className="mt-0.5 text-sm text-muted">{m.note}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            </>
          )}

          {tab === "labs" && (
            <>
              <p className="text-xs text-muted">▲ 정상 초과 · ▼ 정상 미만</p>
              <Card><H2>일반혈액 (CBC)</H2><LabTable rows={data.cbc} dates={data.dates} /></Card>
              <Card><H2>일반화학</H2><LabTable rows={data.chem} dates={data.dates} /></Card>
              <Card>
                <H2>호르몬</H2>
                <p className="text-sm"><b>Erythropoietin (EPO)</b> · 2025-12-24 · <span className="font-semibold text-red-600 dark:text-red-400">82.8 mIU/mL ▲</span> <span className="text-muted">(정상 4.3–29.0)</span></p>
                <p className="mt-1 text-sm text-muted">네스프 시작(2026-03-25) 이전 → 내인성. 빈혈에 대한 보상 반응 수준(고도 상승은 아님).</p>
              </Card>
            </>
          )}

          {tab === "questions" && data.questions.map((q) => (
            <Card key={q.section} className={q.tone === "crit" ? "border-red-500/30 from-red-500/[0.07]" : q.tone === "info" ? "border-blue-500/30 from-blue-500/[0.07]" : ""}>
              <H2>{q.section}</H2>
              <ol className="space-y-3">
                {q.items.map((it, i) => {
                  const n = data.questions.slice(0, data.questions.indexOf(q)).reduce((a, s) => a + (s.tone === "info" ? 0 : s.items.length), 0) + i + 1;
                  return (
                    <li key={it} className="flex gap-3 text-[15px] leading-relaxed">
                      <span className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-foreground/[0.06] text-center text-xs font-semibold leading-6 text-muted">{q.tone === "info" ? "·" : n}</span>
                      {it.startsWith("~~") ? (
                        <span className="text-muted"><s>{it.slice(2, it.indexOf("~~", 2))}</s>{it.slice(it.indexOf("~~", 2) + 2)}</span>
                      ) : (
                        <span className={i === 0 && q.tone === "crit" ? "font-semibold" : ""}>{it}</span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </Card>
          ))}

          {tab === "glossary" && (
            <Card>
              <H2>용어 사전 <span className="text-sm font-normal text-muted">(쉬운 말)</span></H2>
              <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {data.glossary.map((g) => (
                  <div key={g.term}>
                    <dt className="font-semibold">{g.term}</dt>
                    <dd className="mt-0.5 text-sm text-muted">{g.def}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      <p className="mt-12 text-center text-xs text-muted">AI가 포털 수치를 정리·해석한 것으로 의사의 판단이 아닙니다. 모든 해석은 주치의에게 확인하세요.</p>
    </section>
  );
}
