import { type RefObject } from "react"
import { useBeat, type Beat } from "@/hooks/use-beat"
import { Card, Logo, dot, Badge, Spark, mono, box, SIG, INK6, INK7, ON, MUT, FNT, AMBER, useInView } from "./info-kit"

/* ── FIG 01 · Engineer the ops layer ── */
const STAGES = [
  { k: "PULL", logos: ["meta", "google-ads", "tiktok", "ga4"], detail: "Spend + results across 4 platforms", meta: "1,284 rows", tone: SIG },
  { k: "RECONCILE", detail: "Collapsed to one schema · “Meta 4× ROAS vs revenue” resolved", meta: "0 mismatches", tone: SIG },
  { k: "CHECK PACING", detail: "Actuals vs the media plan, campaign by campaign", meta: "2 drifting", tone: AMBER },
  { k: "ASSEMBLE", logos: ["sheets"], detail: "Q3 daily report built · tables, deltas, commentary", meta: "built", tone: SIG },
  { k: "DELIVER", logos: ["slack", "gmail"], detail: "Posted to #performance · emailed the client", meta: "sent", tone: SIG },
] as const
const FIG1_BEATS: Beat[] = [
  { at: 0, hold: 0 }, { at: 620, hold: 0 }, { at: 1240, hold: 0 }, { at: 1860, hold: 0 }, { at: 2480, hold: 1700 },
]

function Fig1Row({ s, idx, on, done }: { s: (typeof STAGES)[number]; idx: number; on: boolean; done: boolean }) {
  const lit = on || done
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 13,
        padding: "12px 14px",
        borderRadius: 10,
        border: `1px solid ${on ? s.tone : INK7}`,
        background: on ? (s.tone === AMBER ? "rgba(232,179,58,0.07)" : "rgba(0,224,213,0.06)") : "rgba(255,255,255,0.012)",
        opacity: lit ? 1 : 0.4,
        transition: "opacity .45s var(--ease-standard), border-color .45s, background .45s",
      }}
    >
      <span style={mono(10, lit ? s.tone : FNT, { width: 16, paddingTop: 2, flex: "0 0 auto" })}>{String(idx + 1).padStart(2, "0")}</span>
      <span style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, minWidth: 0 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--zy-font-mono)", fontSize: 11.5, letterSpacing: ".1em", color: ON }}>{s.k}</span>
          {"logos" in s && s.logos ? <span style={{ display: "flex", alignItems: "center", gap: 7 }}>{s.logos.map((l) => <Logo key={l} name={l} size={15} />)}</span> : null}
        </span>
        <span style={mono(10.5, MUT, { lineHeight: 1.5 })}>{s.detail}</span>
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: 7, flex: "0 0 auto", paddingTop: 1 }}>
        {lit ? <span style={mono(9.5, s.tone)}>{s.meta}</span> : null}
        {done && s.tone !== AMBER ? <span style={{ color: s.tone, fontSize: 12 }}>✓</span> : null}
        {done && s.tone === AMBER ? <span style={{ color: s.tone, fontSize: 12 }}>!</span> : null}
      </span>
    </div>
  )
}

export function Fig1() {
  const [ref, seen] = useInView()
  const beat = useBeat(FIG1_BEATS, seen)
  return (
    <div ref={ref as RefObject<HTMLDivElement>}>
      <Card breathe={seen} label="PIPELINE · MORNING PERFORMANCE REPORT" status={<span style={{ display: "flex", alignItems: "center", gap: 7 }}>{dot(true)}<span style={mono(10, SIG)}>06:00 daily · 2 min</span></span>}>
        <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 8 }}>
          {STAGES.map((s, i) => <Fig1Row key={s.k} s={s} idx={i} on={i === beat} done={i < beat || beat === STAGES.length - 1} />)}
          <div style={{ display: "flex", alignItems: "center", gap: 11, marginTop: 4, padding: "12px 14px", ...box, borderColor: SIG, background: "rgba(0,224,213,0.05)" }}>
            <span style={{ width: 26, height: 26, borderRadius: "50%", border: `1px solid ${SIG}`, display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto", color: SIG, fontSize: 12 }}>◐</span>
            <span style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 12.5, color: ON, fontWeight: 500 }}>You review the 2 flagged exceptions.</span>
              <span style={mono(10, MUT)}>Everything else shipped before standup. No one touched it.</span>
            </span>
            <Badge>HUMAN EDGE</Badge>
          </div>
        </div>
      </Card>
    </div>
  )
}

/* ── FIG 02 · Close the loops ── */
const PACE = [0.92, 0.98, 1.05, 1.11, 1.17, 1.22, 1.26, 1.28]
const FIG2_BEATS: Beat[] = [
  { at: 0, hold: 0 }, { at: 1100, hold: 0 }, { at: 2200, hold: 0 }, { at: 3300, hold: 1500 },
]

function Node({ tag, on, accent = SIG, children }: { tag: string; on: boolean; accent?: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "relative",
        borderRadius: 11,
        padding: "13px 15px",
        border: `1px solid ${on ? accent : INK6}`,
        background: on ? (accent === AMBER ? "rgba(232,179,58,0.06)" : "rgba(0,224,213,0.055)") : "linear-gradient(180deg, #0D2245 0%, rgba(7,19,38,0.6) 100%)",
        boxShadow: on ? `0 0 22px ${accent === AMBER ? "rgba(232,179,58,0.16)" : "rgba(0,224,213,0.16)"}` : "none",
        transition: "border-color .4s, background .4s, box-shadow .4s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: accent, boxShadow: `0 0 8px ${accent}`, opacity: on ? 1 : 0.5 }} />
        <span style={mono(10, on ? accent : FNT, { letterSpacing: ".16em" })}>{tag}</span>
      </div>
      {children}
    </div>
  )
}

function Connector({ on }: { on: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", height: 22 }} aria-hidden="true">
      <svg width="14" height="22" viewBox="0 0 14 22">
        <line x1="7" y1="0" x2="7" y2="15" stroke={on ? SIG : INK6} strokeWidth="1.4" strokeDasharray="3 3" className={on ? "aei-flow" : ""} />
        <path d="M3 13 L7 19 L11 13" fill="none" stroke={on ? SIG : INK6} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

export function Fig2() {
  const [ref, seen] = useInView()
  const beat = useBeat(FIG2_BEATS, seen)
  const m = beat === 0 || beat === 3,
    t = beat === 1,
    a = beat === 2
  return (
    <div ref={ref as RefObject<HTMLDivElement>}>
      <Card breathe={seen} label="CLOSED LOOP · BUDGET-PACING GUARD" status={<span style={{ display: "flex", alignItems: "center", gap: 7 }}>{dot(true)}<span style={mono(10, SIG)}>armed · every 30 min</span></span>}>
        <div style={{ position: "relative", padding: "16px 16px 16px 46px" }}>
          <svg aria-hidden="true" style={{ position: "absolute", left: 12, top: 18, bottom: 18, width: 26 }} viewBox="0 0 26 300" preserveAspectRatio="none">
            <path d="M21 286 C6 286 6 286 6 250 L6 50 C6 14 6 14 21 14" fill="none" stroke={beat === 3 ? SIG : INK6} strokeWidth="1.4" strokeDasharray="4 4" className={beat === 3 ? "aei-flow" : ""} vectorEffect="non-scaling-stroke" />
            <path d="M16 9 L21 14 L16 19" fill="none" stroke={beat === 3 ? SIG : INK6} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            <text x="13" y="150" transform="rotate(-90 13 150)" textAnchor="middle" style={{ fill: beat === 3 ? SIG : FNT, fontFamily: "var(--zy-font-mono)", fontSize: 8, letterSpacing: ".12em" }}>RE-CHECKS IN 30 MIN</text>
          </svg>

          <Node tag="MONITOR" on={m}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
              <Logo name="meta" size={15} /><Logo name="google-ads" size={15} />
              <span style={mono(10.5, MUT, { flex: 1 })}>Spend pace · per campaign, checked every 30 min</span>
            </div>
            <div style={{ ...box, padding: "9px 11px 7px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                <span style={mono(10.5, ON)}>VF8 · Prospecting · US</span>
                <span style={mono(11, AMBER)}>128% of plan</span>
              </div>
              <Spark data={PACE} color={AMBER} fill="rgba(232,179,58,0.10)" h={24} />
            </div>
          </Node>

          <Connector on={t} />

          <Node tag="TRIGGER" on={t} accent={AMBER}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
              <span style={{ fontSize: 12.5, color: ON, lineHeight: 1.4 }}>Projected to overspend daily budget <span style={{ color: AMBER }}>&gt; 20%</span> by 12:00</span>
              <Badge color={AMBER}>MET</Badge>
            </div>
          </Node>

          <Connector on={a} />

          <Node tag="ACT" on={a}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 11px", ...box, marginBottom: 8 }}>
              <span style={{ color: SIG, fontSize: 12 }}>✓</span>
              <span style={{ fontSize: 12.5, color: ON, flex: 1, lineHeight: 1.4 }}>Lower daily cap, move <b style={{ color: SIG }}>$1.2K</b> → underpacing set</span>
              <Badge>AUTO · IN GUARDRAILS</Badge>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 11px", borderRadius: 9, border: `1px solid ${INK7}`, background: "rgba(232,179,58,0.05)", marginBottom: 8 }}>
              <Logo name="gmail" size={15} />
              <span style={{ fontSize: 12.5, color: MUT, flex: 1, lineHeight: 1.4 }}>Bigger shift (&gt; +25% / $5K) held for your sign-off</span>
              <Badge color={AMBER}>EMAIL APPROVAL</Badge>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <Logo name="slack" size={15} />
              <span style={mono(10, MUT)}>Logged + posted to <span style={{ color: SIG }}>#performance</span></span>
            </div>
          </Node>
        </div>
      </Card>
    </div>
  )
}

/* ── FIG 03 · Invent new capability ── */
const CX = 100,
  CY = 100,
  R = 74
const LOOPS = [
  { t: "00:00", move: "Launch: 3 hooks vs control", read: "Meta · UGC, founder, problem-led" },
  { t: "06:00", move: "Read 4h: hook B +22% CTR", read: "killed C (−18%) · kept control" },
  { t: "12:00", move: "Promote B → scale winner", read: "CPA −14% vs control" },
  { t: "18:00", move: "Queue next: UGC vs studio", read: "new test live · 4×/day" },
]
const FIG3_BEATS: Beat[] = [
  { at: 0, hold: 0 }, { at: 1100, hold: 0 }, { at: 2200, hold: 0 }, { at: 3300, hold: 1300 },
]
const ang = (i: number) => ((-90 + i * 90) * Math.PI) / 180
const px = (i: number) => CX + R * Math.cos(ang(i))
const py = (i: number) => CY + R * Math.sin(ang(i))

export function Fig3() {
  const [ref, seen] = useInView()
  const beat = useBeat(FIG3_BEATS, seen)
  const handDeg = -90 + beat * 90
  return (
    <div ref={ref as RefObject<HTMLDivElement>}>
      <Card breathe={seen} label="NET-NEW · CREATIVE-TEST VELOCITY LOOP" status={<span style={{ display: "flex", alignItems: "center", gap: 7 }}>{dot(true)}<span style={mono(10, SIG)}>running · 4×/day</span></span>}>
        <div className="aei-fig3-grid" style={{ display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: 18, padding: "18px", alignItems: "center" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <svg viewBox="0 0 200 200" style={{ width: "min(220px, 60vw)", height: "auto", overflow: "visible" }} aria-hidden="true">
              <circle cx={CX} cy={CY} r={R} fill="none" stroke={INK6} strokeWidth="1" />
              {Array.from({ length: 24 }).map((_, i) => {
                const a = ((-90 + i * 15) * Math.PI) / 180
                return <line key={i} x1={CX + (R - 4) * Math.cos(a)} y1={CY + (R - 4) * Math.sin(a)} x2={CX + R * Math.cos(a)} y2={CY + R * Math.sin(a)} stroke={INK7} strokeWidth="1" />
              })}
              <g style={{ transform: `rotate(${handDeg}deg)`, transformOrigin: "100px 100px", transition: "transform .6s var(--ease-standard)" }}>
                <line x1={CX + 26} y1={CY} x2={CX + (R - 10)} y2={CY} stroke={SIG} strokeWidth="1.6" strokeLinecap="round" />
              </g>
              {LOOPS.map((l, i) => {
                const on = i === beat || beat === 3
                return (
                  <g key={l.t}>
                    <circle cx={px(i)} cy={py(i)} r={on ? 6 : 4} fill={on ? SIG : INK6} style={{ filter: on ? "drop-shadow(0 0 7px rgba(0,224,213,0.8))" : "none", transition: "r .3s, fill .3s" }} />
                    <text x={px(i) + (i === 1 ? 12 : i === 3 ? -12 : 0)} y={py(i) + (i === 0 ? -12 : i === 2 ? 18 : 4)} textAnchor={i === 1 ? "start" : i === 3 ? "end" : "middle"} style={{ fill: on ? SIG : FNT, fontFamily: "var(--zy-font-mono)", fontSize: 9, letterSpacing: ".04em" }}>{l.t}</text>
                  </g>
                )
              })}
              <text x={CX} y={CY - 3} textAnchor="middle" style={{ fill: ON, fontFamily: "var(--zy-font-mono)", fontSize: 11, letterSpacing: ".08em" }}>EVERY</text>
              <text x={CX} y={CY + 12} textAnchor="middle" style={{ fill: SIG, fontFamily: "var(--zy-font-sans)", fontWeight: 700, fontSize: 15 }}>6 HOURS</text>
            </svg>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 2px 2px" }}>
              <Logo name="meta" size={14} />
              <span style={mono(9.5, FNT, { letterSpacing: ".1em" })}>LAST 24H · CREATIVE TESTS</span>
            </div>
            {LOOPS.map((l, i) => {
              const on = i === beat || beat === 3
              return (
                <div key={l.t} style={{ display: "flex", gap: 11, alignItems: "flex-start", padding: "9px 11px", borderRadius: 9, border: `1px solid ${on ? SIG : INK7}`, background: on ? "rgba(0,224,213,0.05)" : "rgba(255,255,255,0.012)", opacity: on ? 1 : 0.5, transition: "all .4s var(--ease-standard)" }}>
                  <span style={mono(10, on ? SIG : FNT, { flex: "0 0 auto", paddingTop: 1 })}>{l.t}</span>
                  <span style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 12, color: ON, lineHeight: 1.35, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.move}</span>
                    <span style={mono(9.5, MUT)}>{l.read}</span>
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", padding: "14px 18px", borderTop: `1px solid ${INK7}`, background: "rgba(255,255,255,0.012)" }}>
          <span style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontFamily: "var(--zy-font-sans)", fontWeight: 700, fontSize: 26, color: SIG, textShadow: "0 0 16px rgba(0,224,213,0.4)" }}>28</span>
            <span style={mono(10, MUT, { lineHeight: 1.4 })}>creative tests / week</span>
          </span>
          <span style={mono(11, FNT)}>vs</span>
          <span style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontFamily: "var(--zy-font-sans)", fontWeight: 700, fontSize: 26, color: MUT }}>1</span>
            <span style={mono(10, FNT, { lineHeight: 1.4 })}>a week, by hand</span>
          </span>
          <span style={{ flex: 1, minWidth: 180, textAlign: "right" }}>
            <span style={mono(10.5, MUT, { lineHeight: 1.5 })}>Each winner seeds the next test. <span style={{ color: SIG }}>A tempo no human can hold.</span></span>
          </span>
        </div>
      </Card>
    </div>
  )
}
