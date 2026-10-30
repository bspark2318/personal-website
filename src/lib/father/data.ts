// Source of truth: ~/Dev/father/father_health_log.md — keep this file in sync with it.

export type Group = "core" | "indep" | "other" | "";

export interface Lab {
  name: string;
  unit: string;
  lo: number;
  hi: number;
  values: (number | null)[];
  group: Group;
  note?: string;
}

export interface FatherData {
  updated: string;
  patient: { name: string; dx: string; hospital: string; doctor: string };
  dates: string[];
  events: string[];
  meds: { date: string; drug: string; how: string; note: string }[];
  transfusions: { date: string; hb: number; premed: string; read: string; given: boolean }[];
  cbc: Lab[];
  chem: Lab[];
  status: { item: string; level: "crit" | "warn" | "ok" | "q"; badge: string; why: string }[];
  gaps: string[];
  questions: { section: string; tone: "crit" | "plain" | "info"; items: string[] }[];
  glossary: { term: string; def: string }[];
}

const L = (
  name: string, unit: string, lo: number, hi: number,
  values: (number | null)[], group: Group = "", note?: string
): Lab => ({ name, unit, lo, hi, values, group, note });

export const FATHER: FatherData = {
  updated: "2026-10-29",
  patient: {
    name: "박종호",
    dx: "MDS · 골수형성이상증후군",
    hospital: "삼성서울병원 혈액종양내과",
    doctor: "정철원 교수",
  },
  dates: ["2025-12-24", "2026-03-25", "2026-05-20", "2026-06-17", "2026-09-16"],
  events: [
    "다나졸 400mg/일 복용 중 · 내인성 EPO 82.8 측정 · 수혈검사 처방",
    "네스프 120mcg 시작 (×2 처방, 8주분) · 수혈 없음(추정)",
    "수혈 (Hb 7.2) · 다나졸 중단 확인 · 네스프 ×1",
    "네스프 ×1 · 수혈 없음 (Hb 9.1)",
    "수혈 (Hb 7.4) · 네스프 ×1",
  ],
  meds: [
    { date: "2025-12-24", drug: "다나졸 200mg", how: "아침·저녁 식후 (400mg/일)", note: "MDS 빈혈 적응외 사용(합성 안드로겐). 2026-05 이전 중단. 부작용: 간기능이상·부종" },
    { date: "2026-03-25", drug: "네스프 120mcg ×2", how: "피하주사", note: "장기작용 EPO(darbepoetin). ESA 시작일. 2개 = 8주분 → 월 1회" },
    { date: "2026-05-20", drug: "네스프 120mcg ×1 · 페니라민 4mg · NS 100ml", how: "피하 / 정맥", note: "항히스타민+식염수 = 수혈 전처치 → 수혈 시행. 다나졸 부재 → 중단 확정" },
    { date: "2026-06-17", drug: "네스프 120mcg ×1", how: "피하주사", note: "전처치 없음 → 수혈 없음. 9/16까지 13주인데 1개 → 간격 불일치, 확인 필요" },
    { date: "2026-09-16", drug: "네스프 120mcg ×1 · 페니라민 · NS 100ml", how: "피하 / 정맥", note: "수혈 시행. 5/20과 동일 세트" },
  ],
  transfusions: [
    { date: "2025-12-24", hb: 8.8, premed: "미입력", read: "–", given: false },
    { date: "2026-03-25", hb: 9.3, premed: "미입력", read: "수혈 후 값일 가능성 (전 방문 처방 확인 필요)", given: false },
    { date: "2026-05-20", hb: 7.2, premed: "O", read: "수혈함", given: true },
    { date: "2026-06-17", hb: 9.1, premed: "X", read: "수혈 없음 — 5/20 수혈 + 네스프 효과", given: false },
    { date: "2026-09-16", hb: 7.4, premed: "O", read: "수혈함", given: true },
  ],
  cbc: [
    L("WBC", "x10³/μL", 3.8, 10.58, [3.41, 2.96, 3.79, 3.17, 3.31], "other", "경도 백혈구감소"),
    L("RBC", "x10⁶/μL", 4.23, 5.59, [2.59, 2.79, 2.04, 2.75, 2.09]),
    L("Hb", "g/dL", 13.6, 17.4, [8.8, 9.3, 7.2, 9.1, 7.4], "core", "마스터 변수. 7대 → 수혈"),
    L("Hct", "%", 40.4, 51.3, [28.0, 31.1, 23.9, 30.8, 23.9]),
    L("MCV", "fL", 85.8, 98.1, [108.1, 111.5, 117.2, 112.0, 114.4], "core", "대구성. 망상적혈구 많을 때 ↑"),
    L("MCH", "pg", 28.8, 33.5, [34.0, 33.3, 35.3, 33.1, 35.4]),
    L("MCHC", "g/dL", 32.3, 34.9, [31.4, 29.9, 30.1, 29.5, 31.0]),
    L("혈소판", "x10³/μL", 141, 316, [277, 287, 210, 193, 214], "indep", "다나졸 중단 후 ~75 하락, 정상 범위"),
    L("Seg. neutrophil", "%", 41.5, 73.5, [55.3, 49.3, 53.3, 49.6, 53.2]),
    L("ANC", "x10³/μL", 1.57, 8.3, [1.89, 1.46, 2.02, 1.57, 1.76], "other", "경계선, 감염 위험 경도"),
    L("Lymphocyte", "%", 19.9, 49.2, [28.2, 29.7, 28.5, 28.7, 26.0]),
    L("ALC", "x10³/μL", 1.0, 4.8, [0.96, 0.88, 1.08, 0.91, 0.86]),
    L("Monocyte", "%", 2.2, 8.2, [14.7, 17.6, 16.1, 18.9, 18.1], "indep", "지속 상승. CMML 기준 수치"),
    L("AMC", "x10³/μL", 0.08, 1.0, [null, 0.52, 0.61, 0.6, 0.6]),
    L("Nucleated RBC", "/100 WBC", 0, 0, [0, 0, 1, 0, 0]),
    L("Reticulocyte", "%", 0.5, 2.0, [8.86, 7.08, 13.8, 8.03, 14.96], "core", "매우 높음. Hb 낮을 때 더 ↑"),
    L("Blast", "%", 0, 0, [0, 0, 0, 0, 0], "", "말초 미성숙구 없음"),
  ],
  chem: [
    L("총 단백", "g/dL", 6.4, 8.3, [6.8, 6.7, 6.7, 6.6, 6.9]),
    L("알부민", "g/dL", 3.5, 5.2, [4.0, 4.3, 4.1, 4.3, 4.4], "other", "영양 양호"),
    L("글로불린", "g/dL", 2, 3.5, [2.8, 2.4, 2.6, 2.3, 2.5]),
    L("총 빌리루빈", "mg/dL", 0, 1.2, [0.9, 0.7, 1.5, 1.4, 2.0], "core", "5월부터 상승. 적혈구 파괴 산물"),
    L("AST", "U/L", 0, 40, [105, 90, 201, 133, 212], "core", "ALT와 분리 → 적혈구 기원 추정"),
    L("ALT", "U/L", 0, 41, [39, 37, 123, 94, 61], "indep", "다나졸 노출기 ↑, 중단 후 ↓"),
    L("ALP", "U/L", 40, 129, [82, 85, 88, 93, 93]),
    L("공복 혈당", "mg/dL", 70, 99, [139, 119, 164, 152, 165], "indep", "전 기간 당뇨 범위, 미치료"),
    L("BUN", "mg/dL", 6, 23, [14.2, 16.3, 16.3, 16.3, 18.9]),
    L("크레아티닌", "mg/dL", 0.7, 1.2, [1.66, 1.78, 2.27, 1.68, 2.01], "core", "Hb 낮을 때 ↑, 수혈 후 회복"),
    L("eGFR", "mL/min/1.73m²", 60, 150, [43.8, 40.3, 29.8, 42.9, 34.5], "core", "CKD 3b 수준"),
    L("요산", "mg/dL", 3.4, 7.0, [2.6, 2.7, 2.9, 2.7, 3.0], "indep", "설명 안 되는 저하"),
    L("칼슘", "mg/dL", 8.6, 10.2, [9.3, 8.9, 9.0, 9.4, 9.2]),
    L("인", "mg/dL", 2.5, 4.5, [2.9, 3.3, 3.4, 3.2, 3.3]),
  ],
  status: [
    { item: "빈혈", level: "crit", badge: "수혈 의존", why: "Hb 7.2–9.3. Hb 7대 도달 시 수혈(5/20, 9/16). 간격 약 4개월." },
    { item: "네스프 120mcg 월 1회", level: "warn", badge: "부분 효과", why: "Hb 하락 속도 −1.1/월 → −0.56/월로 둔화. 수혈 독립은 불가." },
    { item: "다나졸", level: "q", badge: "중단 (~5월)", why: "ALT 123 피크 후 중단과 함께 하강 → 간독성 추정. 혈소판 ~75 하락 동반." },
    { item: "AST 212", level: "crit", badge: "적혈구 기원 추정", why: "ALT 61과 분리 → 간이 아닌 적혈구에서 나오는 것으로 보임." },
    { item: "신장 eGFR 30–44", level: "warn", badge: "CKD 3b", why: "Hb 낮을 때 악화, 수혈 후 일부 회복. 장기 추세 불명확." },
    { item: "공복혈당 119–165", level: "warn", badge: "당뇨 범위", why: "전 기간 상승, 치료 기록 없음. HbA1c 미확인." },
    { item: "요산 2.6–3.0", level: "q", badge: "설명 안 됨", why: "세포 파괴가 많으면 높아야 정상인데 낮음." },
    { item: "급성 전환 징후", level: "ok", badge: "없음", why: "Blast 0%, 혈소판 정상." },
    { item: "감염 위험", level: "warn", badge: "경도", why: "ANC 1.5–2.0 경계, 림프구 <1.0." },
  ],
  gaps: [
    "포털 수치 전부 입력 완료 (CBC 5회 · 화학 5회 · EPO 1회 · 처방 5회).",
    "조회 불가: 수혈검사 결과, 골수검사(병리), 영상 → 의무기록 사본 신청 필요.",
    "LDH · haptoglobin · Coombs · ferritin · HbA1c · 소변검사 기록 없음.",
    "2025-10-01 이전(진단 당시) 기록 미확인.",
  ],
  questions: [
    { section: "A. 빈혈의 원인 — 가장 중요", tone: "crit", items: [
      "망상적혈구가 7–15%로 계속 높은데, 골수가 못 만드는 게 아니라 만든 적혈구가 파괴되는 것 아닌가요? 용혈 검사 — LDH, haptoglobin, 간접 빌리루빈, Coombs(DAT) — 한 적이 있나요? 없다면 해주실 수 있나요?",
      "MDS 환자에서 PNH 클론이 같이 있는 경우가 있다고 들었는데, PNH flow cytometry 검사가 되어 있나요?",
      "AST가 212인데 ALT는 61입니다. 간이 아니라 적혈구에서 나오는 것 아닌가요?",
      "정확한 진단명과 아형(subtype), 위험도 점수(IPSS-R)는 무엇인가요? 골수검사는 언제 했고 결과(blast %, 염색체)는 어땠나요?",
    ]},
    { section: "B. 치료", tone: "plain", items: [
      "네스프 120mcg 월 1회로 Hb가 9에서 7대로 3개월마다 떨어집니다. 용량을 올리거나 간격을 줄일 수 있나요? 다른 약(luspatercept 등)으로 바꿀 단계인가요?",
      "다나졸은 왜 중단했나요? 간수치 때문이었나요?",
      "수혈 기준 Hb가 몇인가요? 7.4에서 느끼는 증상을 고려하면 기준을 올릴 필요는 없나요?",
      "수혈을 계속 받으면 철 과잉이 생긴다고 들었는데, ferritin은 확인하고 있나요?",
    ]},
    { section: "C. 동반 문제", tone: "plain", items: [
      "공복혈당이 1년 내내 119–165입니다. HbA1c 확인이나 내분비내과 협진이 필요하지 않나요?",
      "크레아티닌 1.66–2.27, eGFR 30–44입니다. 신장내과 협진이 필요한가요? 수혈 후 회복되는 부분과 고정된 부분을 어떻게 보시나요?",
      "요산이 계속 2.6–3.0으로 낮습니다. 세포 파괴가 많으면 높아야 하는데 왜 낮은가요?",
      "단핵구가 15–19%로 계속 높습니다. 진단에 반영된 부분인가요?",
    ]},
    { section: "D. 가족 확인 사항 (병원 아닌 가족에게)", tone: "info", items: [
      "다른 병원에서 받는 약이 있는지 (혈압약, 당뇨약, 요산약 등)",
      "3/25, 6/17에 실제로 수혈(2–4시간 수액)을 받았는지, 아니면 주사만 맞고 갔는지",
      "6/17–9/16 사이 다른 곳에서 네스프를 맞은 적 있는지",
      "Hb 7대일 때 증상: 피로, 숨참, 가슴 불편감, 어지러움",
      "진단서·골수검사 결과지·초기 검사 기록 보관 여부",
    ]},
  ],
  glossary: [
    { term: "MDS (골수형성이상증후군)", def: "골수가 혈액세포를 불량품으로 만드는 병. 빈혈·백혈구감소·혈소판감소가 생기고, 일부는 급성백혈병으로 진행." },
    { term: "Hb (헤모글로빈)", def: "적혈구 속 산소 운반 단백. 빈혈의 핵심 수치. 정상 남성 13.6–17.4. 7대면 보통 수혈 고려." },
    { term: "망상적혈구 (Reticulocyte)", def: "갓 만들어진 ‘새끼’ 적혈구. 높으면 골수가 열심히 만들고 있다는 뜻. 정상 0.5–2%." },
    { term: "용혈 (Hemolysis)", def: "적혈구가 만들어진 뒤 혈관 안이나 비장에서 파괴되는 것. 빌리루빈·LDH·AST 상승, haptoglobin 감소로 나타남." },
    { term: "무효조혈", def: "골수 안에서 적혈구가 완성되기 전에 죽는 것. MDS의 특징. 용혈과 비슷한 수치 패턴을 만듦." },
    { term: "빌리루빈 (Bilirubin)", def: "헤모글로빈이 분해될 때 나오는 노란 색소. 적혈구 파괴가 많으면 상승." },
    { term: "AST / ALT", def: "‘간수치’로 불리지만 AST는 적혈구·근육에도 많음. AST만 높고 ALT는 낮으면 간 이외 원인 의심." },
    { term: "MCV", def: "적혈구 평균 크기. 크면(대구성) MDS 또는 망상적혈구 많음을 반영." },
    { term: "EPO / 네스프 (Darbepoetin)", def: "EPO = 신장이 만드는 ‘적혈구 만들어라’ 호르몬. 네스프는 장기작용 합성 EPO 주사." },
    { term: "다나졸 (Danazol)", def: "합성 남성호르몬. MDS 빈혈·혈소판감소에 적응외 사용. 주요 부작용 간기능이상." },
    { term: "LDH · Haptoglobin · Coombs(DAT) · PNH flow", def: "용혈 검사 세트. LDH↑·haptoglobin↓이면 용혈. Coombs = 면역성 용혈 여부. PNH flow = 보체에 취약한 적혈구 클론 검출." },
    { term: "Cr / eGFR", def: "신장 기능. Cr(크레아티닌) 높고 eGFR 낮으면 신기능 저하. eGFR 30–44 = CKD 3b (중등도 저하)." },
    { term: "ANC / ALC / 단핵구", def: "중성구(세균 방어)·림프구(바이러스 방어)·단핵구 수. ANC <1.5 감염 주의. 단핵구 ≥10% 지속은 CMML 기준에 해당." },
    { term: "IPSS-R", def: "MDS 위험도 점수. blast %, 염색체, 혈구 수치로 산출. 치료 방향 결정의 기준." },
    { term: "Ferritin", def: "체내 철 저장량. 반복 수혈 시 철 과잉 → 간·심장 손상 가능." },
  ],
};

export type Flag = "hi" | "lo" | "";
export function flag(v: number | null, lo: number, hi: number): Flag {
  if (v == null) return "";
  if (v > hi) return "hi";
  if (v < lo) return "lo";
  return "";
}
export function shortDate(d: string) {
  return d.slice(5).replace("-", "/");
}
