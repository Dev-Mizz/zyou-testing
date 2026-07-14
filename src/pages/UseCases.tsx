import { useEffect, useRef, useState, memo } from "react"
import { Reveal } from "@/components/motion/Reveal"
import { Stagger } from "@/components/motion/Stagger"
import { Button } from "@/components/ui/Button"
import { Icon } from "@/components/ui/Icon"
import { BrandLogo } from "@/components/ui/BrandLogo"
import { usePrefersReducedMotion, useMediaQuery } from "@/hooks/use-motion"
import { SCENES, BUCKETS, ZYOU, SIG, INK, INK8, INK7, INK6, ON, MUT, FNT } from "@/components/hero/reel/scenes"
import { CALENDLY } from "@/lib/links"
import { ClaudeScene } from "@/components/hero/reel/scenes/ClaudeScene"
import { Seo } from "@/components/ui/Seo"
import "@/components/use-cases/uc.css"

/* ── §1 Hero ── */
function UCHero() {
  const reduce = usePrefersReducedMotion()
  return (
    <section id="top" style={{ position: "relative", overflow: "hidden", padding: "120px 24px 72px" }}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "-20% -10% auto -10%",
          height: "70%",
          zIndex: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(55% 70% at 30% 8%, rgba(0,224,213,0.14), transparent 70%), radial-gradient(45% 55% at 75% 0%, rgba(0,224,213,0.06), transparent 70%)",
          filter: "blur(120px)",
          opacity: 0.9,
          animation: reduce ? "none" : "zy-aurora-drift 16s var(--ease-standard) infinite",
        }}
      />
      <div style={{ position: "relative", zIndex: 1, maxWidth: "var(--zy-container)", margin: "0 auto" }}>
        <Stagger immediate>
          <div className="zy-label-mono" style={{ color: "var(--zy-signal)", marginBottom: 22 }}>USE CASES</div>
          <h1 className="zy-headline-xl" style={{ margin: 0, maxWidth: "17ch" }}>
            The work your team does by hand. <span style={{ color: "var(--zy-signal)" }}>Running on its own.</span>
          </h1>
          <p className="zy-body-lg" style={{ margin: "24px 0 0", maxWidth: "54ch", color: "var(--zy-on-dark-muted)" }}>
            Five questions every advertising operation lives with. Here's what it looks like when an Ads Engineer answers them with systems, not headcount.
          </p>
        </Stagger>
      </div>
    </section>
  )
}

/* ── §1b Mechanic strip ── */
function UCMechanic() {
  const items = [
    { icon: "cpu" as const, k: "THE OPERATOR", t: <>Your own people, <b style={{ color: "var(--zy-on-dark)", fontWeight: 600 }}>leveled up into Ads Engineers.</b></> },
    { icon: "zap" as const, k: "THE INTERFACE", t: <><b style={{ color: "var(--zy-on-dark)", fontWeight: 600 }}>Claude Code</b> is their interface to the AI agents that do the work across every ad platform.</> },
    { icon: "layers" as const, k: "THE LAYER", t: <><b style={{ color: "var(--zy-on-dark)", fontWeight: 600 }}>Zyou</b> is the execution layer those agents run on. Type-safe on live budgets, fully governed. You see only the outcome.</> },
  ]
  return (
    <section style={{ borderTop: "1px solid var(--zy-border-on-dark)", borderBottom: "1px solid var(--zy-border-on-dark)", background: "rgba(255,255,255,0.012)" }}>
      <div className="uc-mech" style={{ maxWidth: "var(--zy-container)", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
        {items.map((m, i) => (
          <Reveal key={m.k} style={{ padding: "34px 30px", borderLeft: i ? "1px solid var(--zy-border-on-dark)" : "none" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 9, marginBottom: 16, color: "var(--zy-signal)" }}>
              <Icon name={m.icon} size={17} stroke={1.7} />
              <span className="zy-label-mono">{m.k}</span>
            </span>
            <p className="zy-body-md" style={{ margin: 0, color: "var(--zy-on-dark-muted)", lineHeight: 1.55, maxWidth: "34ch" }}>{m.t}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ── §2 the swap slot: Input → Claude → Output, auto-loops ── */
const SwapSlot = memo(function SwapSlot({ index }: { index: number }) {
  const [phase, setPhase] = useState(0)
  const reduce = usePrefersReducedMotion()
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setPhase(0)
    if (reduce) {
      setPhase(2)
      return
    }
    const HOLD = [2400, 3600, 3800]
    let p = 0
    const step = () => {
      p = (p + 1) % 3
      setPhase(p)
      timer.current = setTimeout(step, HOLD[p])
    }
    timer.current = setTimeout(step, HOLD[0])
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [index, reduce])

  const sc = SCENES[index]
  const scenes = [sc.input, <ClaudeScene key="c" {...sc.claude} typing={phase === 1} />, sc.output]
  const labels = ["INPUT", "CLAUDE", "OUTPUT"]

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0, gap: 12 }}>
      <div style={{ flex: "0 0 auto", display: "flex", gap: 8, alignItems: "center" }}>
        {labels.map((l, i) => (
          <span key={l} className="zy-data-mono" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 9.5, letterSpacing: ".1em", color: i === phase ? SIG : FNT, transition: "color .3s" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: i === phase ? SIG : INK6, boxShadow: i === phase ? "0 0 8px rgba(0,224,213,0.7)" : "none" }} />
            {l}
            {i < 2 && <span style={{ color: INK6, marginLeft: 2 }}>→</span>}
          </span>
        ))}
      </div>
      <div style={{ position: "relative", flex: "1 1 auto", minHeight: 0 }}>
        <div style={{ position: "absolute", inset: 0 }}>{scenes[phase]}</div>
      </div>
    </div>
  )
})

/* ── static Zyou connector card ── */
function ZyouCard({ bucketKey }: { bucketKey: keyof typeof ZYOU }) {
  const z = ZYOU[bucketKey] || ZYOU.data
  return (
    <div className="uc-breathe" style={{ flex: "0 0 auto", border: `1px solid ${INK6}`, borderRadius: 14, background: `linear-gradient(180deg, ${INK8} 0%, rgba(7,19,38,0.6) 100%)`, padding: "13px 16px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", rowGap: 10 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: "0 0 auto", paddingRight: 16, borderRight: `1px solid ${INK7}` }}>
        <img src="/logos/Lockup_Dark.svg" alt="Zyou" style={{ height: 18, width: "auto", display: "block" }} />
        <span className="zy-data-mono" style={{ fontSize: 8.5, letterSpacing: ".05em", color: MUT }}>EXECUTION LAYER · done · 1.2s</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", rowGap: 8, flex: "1 1 auto" }}>
        {z.steps.map(([k, v]) => (
          <span key={k} style={{ display: "inline-flex", flexDirection: "column", gap: 2 }}>
            <span className="zy-data-mono" style={{ fontSize: 8.5, letterSpacing: ".1em", color: FNT }}>{k}</span>
            <span className="zy-data-mono" style={{ fontSize: 11, color: ON, whiteSpace: "nowrap" }}>{v} <span style={{ color: SIG }}>✓</span></span>
          </span>
        ))}
      </div>
      <div className="uc-zyou-cap" style={{ display: "flex", alignItems: "center", gap: 11, flex: "0 0 auto", paddingLeft: 16, borderLeft: `1px solid ${INK7}` }}>
        <span className="zy-data-mono" style={{ fontSize: 8.5, letterSpacing: ".06em", color: FNT, textAlign: "right", maxWidth: 104, lineHeight: 1.35 }}>{z.cap}</span>
        <span style={{ color: SIG, fontWeight: 700, fontSize: 24, textShadow: "0 0 14px rgba(0,224,213,0.55)", lineHeight: 1 }}>{z.num}</span>
      </div>
    </div>
  )
}

/* ── right-column copy ── */
function BucketCopy({ b }: { b: (typeof BUCKETS)[number] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 11, marginBottom: 14 }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: SIG, boxShadow: "0 0 10px rgba(0,224,213,0.7)", flex: "0 0 auto", transform: "translateY(-2px)" }} />
        <p className="zy-data-mono" style={{ margin: 0, fontSize: 13.5, color: SIG, lineHeight: 1.5 }}>"{b.q}"</p>
      </div>
      <h3 className="zy-headline-sm" style={{ margin: "0 0 18px", color: "#fff" }}>{b.h}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
        {b.work.map((w) => (
          <div key={w} style={{ display: "grid", gridTemplateColumns: "16px 1fr", gap: 11, alignItems: "start" }}>
            <span style={{ width: 7, height: 7, border: `1.5px solid ${INK6}`, borderRadius: 2, marginTop: 6 }} />
            <span className="zy-body-md" style={{ color: "var(--zy-on-dark-muted)", lineHeight: 1.45 }}>{w}</span>
          </div>
        ))}
      </div>
      <div style={{ borderTop: `1px solid ${INK7}`, paddingTop: 14, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ color: SIG, fontSize: 13, lineHeight: 1 }}>✓</span>
        <span className="zy-data-mono" style={{ fontSize: 11.5, letterSpacing: ".04em", color: "var(--zy-on-dark-muted)" }}>{b.proof}</span>
      </div>
    </div>
  )
}

/* ── stepper ── */
function Stepper({ active, onPick }: { active: number; onPick: (i: number) => void }) {
  return (
    <div className="uc-stepper" style={{ flex: "0 0 auto", display: "flex", alignItems: "flex-start", padding: "14px 8px 16px", borderBottom: `1px solid ${INK7}` }}>
      {BUCKETS.map((b, i) => (
        <div key={b.id} style={{ display: "contents" }}>
          <div onClick={() => onPick(i)} style={{ flex: "0 0 auto", width: 108, display: "flex", flexDirection: "column", alignItems: "center", gap: 9, cursor: "pointer", opacity: i === active ? 1 : 0.45, transition: "opacity .25s" }}>
            <span className="zy-data-mono" style={{ width: 38, height: 38, borderRadius: "50%", display: "grid", placeItems: "center", fontSize: 14, border: `1px solid ${i === active ? SIG : INK6}`, background: i === active ? SIG : "transparent", color: i === active ? INK : MUT, boxShadow: i === active ? "0 0 0 4px rgba(0,224,213,0.14)" : "none", transition: "all .25s" }}>{b.n}</span>
            <span className="zy-data-mono" style={{ fontSize: 11, letterSpacing: ".05em", textTransform: "uppercase", color: i === active ? ON : MUT, textAlign: "center" }}>{b.name}</span>
          </div>
          {i < BUCKETS.length - 1 && <span style={{ flex: "1 0 24px", height: 2, marginTop: 18, background: i < active ? SIG : INK6, transition: "background .3s" }} />}
        </div>
      ))}
    </div>
  )
}

/* ── §2 section ── */
function UCBuckets() {
  const N = BUCKETS.length
  const [active, setActive] = useState(0)
  const pinned = useMediaQuery("(min-width: 1081px)")
  const reduce = usePrefersReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const gotoRef = useRef<(i: number) => void>(() => {})

  // mobile/tablet: no scroll-scrub, so cycle the questions on a timer
  useEffect(() => {
    if (pinned || reduce) return
    const id = setInterval(() => setActive((a) => (a + 1) % N), 3400)
    return () => clearInterval(id)
  }, [pinned, reduce, N])

  useEffect(() => {
    if (!pinned) {
      gotoRef.current = (i: number) => setActive(i)
      return
    }
    const wrap = wrapRef.current
    if (!wrap) return
    const onScroll = () => {
      const r = wrap.getBoundingClientRect()
      const total = r.height - window.innerHeight
      const passed = Math.min(Math.max(-r.top, 0), total)
      const p = total > 0 ? passed / total : 0
      const ni = Math.min(N - 1, Math.floor(p * N + 0.0001))
      setActive((prev) => (prev === ni ? prev : ni))
    }
    gotoRef.current = (i: number) => {
      const top = wrap.offsetTop + (wrap.offsetHeight - window.innerHeight) * ((i + 0.4) / N)
      window.scrollTo({ top, behavior: "smooth" })
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [N, pinned])

  const b = BUCKETS[active]
  return (
    <section id="buckets">
      <div ref={wrapRef} style={{ position: "relative" }}>
        <div className="uc-sticky" style={{ position: "sticky", top: 0, height: "100vh", minHeight: 600, display: "flex", flexDirection: "column", maxWidth: "var(--zy-container)", margin: "0 auto", padding: "64px 24px 0" }}>
          <div className="uc-s2head" style={{ flex: "0 0 auto", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 28, flexWrap: "wrap", rowGap: 8, marginBottom: 14 }}>
            <div>
              <div className="zy-label-mono" style={{ color: SIG, marginBottom: 8 }}>THE FIVE QUESTIONS</div>
              <h2 className="zy-headline-sm" style={{ margin: 0, color: "#fff" }}>Five questions. Five running systems.</h2>
            </div>
            <p className="zy-data-mono" style={{ margin: 0, fontSize: 11, letterSpacing: ".04em", color: "var(--zy-on-dark-faint)" }}>Click a step or scroll to watch each one run →</p>
          </div>
          <Stepper active={active} onPick={(i) => gotoRef.current(i)} />
          <div className="uc-bbody" style={{ flex: "1 1 auto", minHeight: 0, display: "grid", gridTemplateColumns: "minmax(0,1fr) 400px", gap: 40, alignItems: "center", padding: "20px 0 24px" }}>
            <div className="uc-bleft" style={{ display: "flex", flexDirection: "column", gap: 12, height: "min(496px, 60vh)", minHeight: 0 }}>
              <div style={{ flex: "1 1 auto", minHeight: 0 }}><SwapSlot index={active} /></div>
              <ZyouCard bucketKey={b.key} />
            </div>
            <BucketCopy b={b} />
          </div>
        </div>
        {pinned && [0, 1, 2, 3, 4].map((i) => <div key={i} style={{ height: "78vh" }} />)}
      </div>
    </section>
  )
}

/* ── §3 Find your team — role overlay ── */
function UCRoles() {
  const ROLES = [
    { label: "Media buyer", b: [1, 2], note: "Media buyer → Execution Automation + Optimisation Loops." },
    { label: "Ad ops", b: [1, 4], note: "Ad ops → Execution Automation + Governance." },
    { label: "Analytics", b: [0, 2], note: "Analytics → Data Unification + Optimisation Loops." },
    { label: "Performance / growth lead", b: [2, 3], note: "Performance / growth lead → Optimisation Loops + Audience Management." },
    { label: "CMO / VP", b: [4, 0], note: "CMO / VP → Governance + Data Unification — visibility and control, end to end." },
  ]
  const [sel, setSel] = useState(0)
  const lit = ROLES[sel].b
  return (
    <section id="team" style={{ padding: "92px 24px" }}>
      <div style={{ maxWidth: "var(--zy-container)", margin: "0 auto" }}>
        <Reveal>
          <h2 className="zy-headline-md" style={{ margin: 0, maxWidth: "22ch", color: "var(--zy-on-dark)" }}>
            Every team crosses over. Here's where each one starts.
          </h2>
          <p className="zy-body-lg" style={{ margin: "18px 0 0", maxWidth: "52ch", color: "var(--zy-on-dark-muted)" }}>
            These buckets aren't departments. They're a view. Pick a role.
          </p>
        </Reveal>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, margin: "34px 0 30px" }}>
          {ROLES.map((r, i) => {
            const on = i === sel
            return (
              <button
                key={r.label}
                onClick={() => setSel(i)}
                className="zy-data-mono"
                style={{
                  cursor: "pointer",
                  fontSize: 12.5,
                  letterSpacing: ".02em",
                  padding: "10px 16px",
                  borderRadius: "var(--zy-radius-pill)",
                  border: `1px solid ${on ? "var(--zy-signal)" : "var(--zy-border-on-dark)"}`,
                  background: on ? "var(--zy-signal)" : "transparent",
                  color: on ? "var(--zy-ink)" : "var(--zy-on-dark-muted)",
                  fontWeight: on ? 700 : 500,
                  transition: "all var(--dur-base) var(--ease-standard)",
                }}
              >
                {r.label}
              </button>
            )
          })}
        </div>

        <div className="uc-rolemap" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
          {BUCKETS.map((b, i) => {
            const on = lit.indexOf(i) > -1
            return (
              <div
                key={b.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 9,
                  padding: "18px 16px",
                  minHeight: 104,
                  borderRadius: "var(--zy-radius-md)",
                  border: `1px solid ${on ? "var(--zy-signal)" : "var(--zy-border-on-dark)"}`,
                  background: on ? "rgba(0,224,213,0.06)" : "rgba(255,255,255,0.012)",
                  boxShadow: on ? "0 0 0 1px var(--zy-signal), 0 12px 30px rgba(0,224,213,0.10)" : "none",
                  opacity: on ? 1 : 0.4,
                  transition: "all var(--dur-base) var(--ease-standard)",
                }}
              >
                <span className="zy-data-mono" style={{ fontSize: 18, color: on ? "var(--zy-signal)" : "var(--zy-on-dark-muted)" }}>{b.n}</span>
                <span className="zy-ui" style={{ fontWeight: 600, fontSize: 13.5, color: "var(--zy-on-dark)" }}>{b.name}</span>
              </div>
            )
          })}
        </div>
        <p className="zy-data-mono" style={{ marginTop: 18, fontSize: 12, color: "var(--zy-on-dark-faint)" }}>{ROLES[sel].note}</p>
      </div>
    </section>
  )
}

/* ── §4 For agencies ── */
function UCAgency() {
  const stmts: [string, string][] = [
    ["Stop rebuilding the same integration for every client.", "Onboarding drops from two weeks to hours."],
    ["Stop fighting API deprecations by hand.", "Platform changes are absorbed before campaigns go dark."],
    ["Stop spending an analyst's whole week on reports.", "Multi-client reporting runs itself."],
  ]
  const clients = ["Mondelez", "Kettl", "Verde", "Hana", "Brava", "Nord"]
  const flows = ["Data", "Exec", "Opt", "Aud", "Gov"]
  return (
    <section style={{ padding: "92px 24px", borderTop: "1px solid var(--zy-border-on-dark)" }}>
      <div style={{ maxWidth: "var(--zy-container)", margin: "0 auto" }}>
        <Reveal>
          <h2 className="zy-headline-md" style={{ margin: 0, maxWidth: "18ch", color: "var(--zy-on-dark)" }}>
            Run it once. Apply it across every client.
          </h2>
        </Reveal>
        <div className="uc-agency" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", marginTop: 38 }}>
          <Reveal style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {stmts.map(([a, bb]) => (
              <div key={a} style={{ display: "grid", gridTemplateColumns: "16px 1fr", gap: 12, alignItems: "start" }}>
                <span style={{ width: 7, height: 7, border: "1.5px solid var(--zy-border-strong)", borderRadius: 2, marginTop: 7 }} />
                <span className="zy-body-md" style={{ color: "var(--zy-on-dark-muted)", lineHeight: 1.5 }}>
                  {a} <b style={{ color: "var(--zy-on-dark)", fontWeight: 600 }}>{bb}</b>
                </span>
              </div>
            ))}
            <p className="zy-body-md" style={{ margin: "6px 0 0", paddingTop: 16, borderTop: "1px solid var(--zy-border-on-dark)", color: "var(--zy-on-dark)", fontWeight: 600, lineHeight: 1.5 }}>
              The brand owns the system. The agency executes on top of it. When the engagement ends, the system stays.
            </p>
          </Reveal>

          <Reveal style={{ position: "relative", border: "1px solid var(--zy-border-on-dark)", borderRadius: "var(--zy-radius-lg)", background: "radial-gradient(120% 90% at 80% 0%, rgba(0,224,213,0.08), transparent 70%)", padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span className="zy-label-mono" style={{ color: "var(--zy-signal)" }}>ONE SYSTEM · EVERY CLIENT</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--zy-signal)" }}>
                <Icon name="layers" size={15} />
                <span className="zy-data-mono" style={{ fontSize: 10, color: "var(--zy-on-dark-muted)" }}>Zyou</span>
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {clients.map((c, ti) => (
                <div key={c} style={{ border: "1px solid var(--zy-border-on-dark)", borderRadius: "var(--zy-radius-md)", background: "rgba(255,255,255,0.015)", padding: "12px 12px 11px" }}>
                  <span className="zy-data-mono" style={{ fontSize: 10.5, color: "var(--zy-on-dark)", display: "block", marginBottom: 10 }}>{c}</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    {flows.map((f, pi) => (
                      <span key={f} className="uc-pip" style={{ animationDelay: `${(ti * 0.18 + pi * 0.12).toFixed(2)}s` }} title={f} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ── §5 What this is not ── */
function UCNot() {
  const NOTS = [
    { not: "Not another dashboard to check.", is: "The work runs whether or not anyone logs in." },
    { not: "Not a chatbot that recites yesterday’s CPA.", is: "It takes the action, then reports it." },
    { not: "Not your agency replaced.", is: "Your team and your agency, doing the work without the manual drag." },
  ]
  return (
    <section style={{ padding: "92px 24px", borderTop: "1px solid var(--zy-border-on-dark)" }}>
      <div style={{ maxWidth: "var(--zy-container)", margin: "0 auto" }}>
        <Stagger className="uc-notgrid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 30 }}>
          {NOTS.map((n) => (
            <div key={n.not} style={{ borderLeft: "2px solid var(--zy-border-strong)", paddingLeft: 20 }}>
              <span className="zy-label-mono" style={{ color: "var(--zy-on-dark-faint)", display: "block", marginBottom: 12 }}>NOT THIS</span>
              <p className="zy-body-lg" style={{ margin: 0, color: "var(--zy-on-dark-muted)", lineHeight: 1.5 }}>
                {n.not}{" "}
                <b style={{ display: "block", marginTop: 8, color: "var(--zy-on-dark)", fontWeight: 600 }}>{n.is}</b>
              </p>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

/* ── §6 Capstone — inputs → Zyou framework → platforms ── */
function UCCapstone() {
  const inputs = [
    { l: "Media Plan", i: "bar-chart" as const },
    { l: "Creatives", i: "paintbrush" as const },
    { l: "Strategy", i: "target" as const },
    { l: "CRM", i: "route" as const },
    { l: "GA4 · CDP", i: "layers" as const },
    { l: "Tasks", i: "workflow" as const },
  ]
  const caps = [
    { l: "Pilot Agent", s: "active · scoped to 1 brand", i: "cpu" as const },
    { l: "Sandbox", s: "validate before live", i: "shield" as const },
    { l: "Guardrails", s: "budget caps · approvals", i: "lock" as const },
    { l: "Autopilot", s: "optimisation loops", i: "zap" as const },
  ]
  const platforms: [string, string][] = [["meta", "Meta"], ["google-ads", "Google"], ["tiktok", "TikTok"]]

  const Conn = () => (
    <div aria-hidden="true" style={{ display: "flex", justifyContent: "center", padding: "6px 0" }}>
      <span style={{ width: 1, height: 26, background: "linear-gradient(180deg, rgba(0,224,213,0.1), var(--zy-signal))" }} />
    </div>
  )

  return (
    <section id="capstone" style={{ position: "relative", overflow: "hidden", padding: "100px 24px", borderTop: "1px solid var(--zy-border-on-dark)" }}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "auto -10% -30% -10%",
          height: "60%",
          zIndex: 0,
          pointerEvents: "none",
          background: "radial-gradient(50% 70% at 50% 100%, rgba(0,224,213,0.12), transparent 70%)",
          filter: "blur(110px)",
        }}
      />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
        <Reveal>
          <h2 className="zy-headline-md" style={{ margin: "0 auto", maxWidth: "28ch", color: "var(--zy-on-dark)" }}>
            None of this touches live spend until it's safe. That's the part you don't see.
          </h2>
        </Reveal>

        <Reveal style={{ marginTop: 44 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {inputs.map((it) => (
              <span key={it.l} style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "9px 14px", borderRadius: "var(--zy-radius-md)", border: "1px solid var(--zy-border-on-dark)", background: "rgba(255,255,255,0.015)" }}>
                <span style={{ color: "var(--zy-on-dark-muted)", display: "inline-flex" }}><Icon name={it.i} size={15} /></span>
                <span className="zy-ui" style={{ fontSize: 13, color: "var(--zy-on-dark)" }}>{it.l}</span>
              </span>
            ))}
          </div>
          <Conn />

          <div style={{ border: "1px solid var(--zy-border-strong)", borderRadius: "var(--zy-radius-lg)", background: "linear-gradient(180deg, rgba(0,224,213,0.05), rgba(13,34,69,0.4))", boxShadow: "0 0 40px rgba(0,224,213,0.12)", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid var(--zy-border-on-dark)" }}>
              <img src="/logos/Lockup_Dark.svg" alt="Zyou" style={{ height: 18, width: "auto" }} />
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--zy-signal)", boxShadow: "var(--zy-glow)", animation: "zy-pulsate 2.4s ease-in-out infinite" }} />
                <span className="zy-data-mono" style={{ fontSize: 11, color: "var(--zy-on-dark-muted)" }}>v2.1.0 · system stable</span>
              </span>
            </div>
            <div className="uc-caps" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, padding: 16 }}>
              {caps.map((c) => (
                <div key={c.l} style={{ textAlign: "left", border: "1px solid var(--zy-border-on-dark)", borderRadius: "var(--zy-radius-md)", background: "rgba(7,19,38,0.5)", padding: "13px 14px" }}>
                  <span style={{ display: "inline-flex", width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center", background: "rgba(0,224,213,0.10)", border: "1px solid rgba(0,224,213,0.22)", color: "var(--zy-signal)", marginBottom: 11 }}>
                    <Icon name={c.i} size={16} stroke={1.7} />
                  </span>
                  <span className="zy-ui" style={{ display: "block", fontSize: 13.5, color: "var(--zy-on-dark)", marginBottom: 4 }}>{c.l}</span>
                  <span className="zy-data-mono" style={{ fontSize: 10, color: "var(--zy-on-dark-faint)" }}>{c.s}</span>
                </div>
              ))}
            </div>
          </div>
          <Conn />

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {platforms.map(([logo, name]) => (
              <span key={name} style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "11px 20px", borderRadius: "var(--zy-radius-md)", border: "1px solid var(--zy-border-on-dark)", background: "rgba(255,255,255,0.015)" }}>
                <BrandLogo name={logo} size={18} color={logo === "tiktok" ? "#fff" : undefined} />
                <span className="zy-ui" style={{ fontSize: 13.5, color: "var(--zy-on-dark)" }}>{name}</span>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--zy-signal)", boxShadow: "var(--zy-glow)" }} />
              </span>
            ))}
          </div>
        </Reveal>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginTop: 48 }}>
          <Button variant="primary" href="/forge">See how it stays safe</Button>
          <Button variant="secondary" href={CALENDLY} target="_blank" rel="noopener noreferrer">Chat with founder</Button>
        </div>
      </div>
    </section>
  )
}

/** /use-cases — the five questions, sticky stepper, swap-in-place demos. */
export function UseCases() {
  return (
    <div className="uc-page">
      <Seo
        title="Advertising Use Cases: AI Agents and Claude | Zyou"
        description="How advertising teams use AI agents and Claude for data analysis, campaign creation, and optimisation, automating manual work to save 10x the time."
        canonical="https://zyou.ai/use-cases"
      />
      <UCHero />
      <UCMechanic />
      <UCBuckets />
      <UCRoles />
      <UCAgency />
      <UCNot />
      <UCCapstone />
    </div>
  )
}
