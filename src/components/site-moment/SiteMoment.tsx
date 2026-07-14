import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/Button"
import { usePrefersReducedMotion } from "@/hooks/use-motion"

const MANIFESTO_HEAD = "AI is scaling faster than teams can hire."
const MANIFESTO_SUB = "The first to close that gap wins."

const BEATS = [
  {
    key: "PAST",
    label: "THEN",
    at: 0.0,
    head: "Every platform shift added more complexity.",
    body: "Search, programmatic, social. Each wave demanded more tooling, more hires, more agencies. SaaS helped teams keep up, but human hands still ran every decision.",
  },
  {
    key: "AI",
    label: "AI INFLECTION",
    at: 0.62,
    head: "AI scaled ad work past what teams can run by hand.",
    body: "One brief becomes thousands of live creative combinations across five platforms, optimising in real time. The volume of decisions is no longer a human-scale problem.",
  },
  {
    key: "NOW",
    label: "NOW",
    at: 1.0,
    head: "Now every serious marketing org is building AI systems.",
    body: "The shift is already here. Zyou builds the infrastructure that turns your ads team into Ads Engineers: people who direct the agents instead of running campaigns by hand.",
  },
]

const WORK_D = "M44 288 C 150 286, 248 280, 300 260 C 352 240, 402 116, 430 46"
const CAP_D = "M44 284 L430 168"
const INFLECT_X = 300,
  INFLECT_Y = 260

function ScrollAlongMoment() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const workRef = useRef<SVGPathElement>(null)
  const capRef = useRef<SVGPathElement>(null)
  const reduce = usePrefersReducedMotion()

  const [len, setLen] = useState({ work: 760, cap: 420 })
  const [st, setSt] = useState({ p: reduce ? 1 : 0, hx: 44, hy: 288 })
  // ponytail: cache per-resize geometry so the scroll loop never re-reads layout
  // (getTotalLength/offsetHeight) per frame — that was the "forced reflow" cost.
  const geom = useRef({ workLen: 760, secH: 0, vh: 800 })

  useEffect(() => {
    const measure = () => {
      const w = workRef.current ? workRef.current.getTotalLength() : 760
      const c = capRef.current ? capRef.current.getTotalLength() : 420
      geom.current.workLen = w
      geom.current.secH = sectionRef.current?.offsetHeight ?? 0
      geom.current.vh = window.innerHeight || 800
      setLen({ work: w, cap: c })
    }
    measure()
    window.addEventListener("resize", measure)
    document.fonts?.ready.then(measure) // re-measure after font swap shifts layout
    return () => window.removeEventListener("resize", measure)
  }, [])

  useEffect(() => {
    if (reduce) {
      const w = workRef.current
      const end = w ? w.getPointAtLength(w.getTotalLength()) : { x: 430, y: 46 }
      setSt({ p: 1, hx: end.x, hy: end.y })
      return
    }
    let raf: number | null = null
    const update = () => {
      raf = null
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = geom.current.secH - geom.current.vh
      const p = total > 0 ? Math.max(0, Math.min(1, -rect.top / total)) : 0
      const draw = Math.max(0, Math.min(1, (p - 0.08) / 0.78))
      const w = workRef.current
      let hx = 44,
        hy = 288
      if (w) {
        const pt = w.getPointAtLength(draw * geom.current.workLen)
        hx = pt.x
        hy = pt.y
      }
      setSt({ p: draw, hx, hy })
    }
    const onScroll = () => {
      if (raf == null) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduce])

  const draw = st.p
  const workOffset = len.work * (1 - draw)
  const capOffset = len.cap * (1 - Math.min(1, draw * 1.1))

  let activeIdx = 0
  BEATS.forEach((b, i) => {
    if (draw >= b.at - 0.001) activeIdx = i
  })

  return (
    <div ref={sectionRef} style={{ position: "relative", height: reduce ? "auto" : "320vh" }}>
      <div
        style={{
          position: reduce ? "relative" : "sticky",
          top: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "88px 24px",
          overflow: "hidden",
        }}
      >
        {/* focal bloom */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            background: "radial-gradient(38% 44% at 50% 46%, rgba(0,224,213,0.10), transparent 70%)",
            filter: "blur(120px)",
            animation: "zy-breathe 10s var(--ease-standard) infinite",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 980, margin: "0 auto" }}>
          {/* centred headline */}
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <span className="zy-label-mono" style={{ display: "block", marginBottom: 16, color: "var(--zy-signal)" }}>THE MOMENT</span>
            <h2 className="zy-headline-md" style={{ margin: "0 auto 10px", maxWidth: "none", whiteSpace: "nowrap", fontSize: "clamp(19px, 4vw, 30px)" }}>{MANIFESTO_HEAD}</h2>
            <p className="zy-headline-sm" style={{ margin: "0 auto", maxWidth: "28ch", color: "var(--zy-on-dark-muted)", fontSize: 20 }}>{MANIFESTO_SUB}</p>
          </div>

          {/* graph left · caption right */}
          <div style={{ display: "flex", gap: 52, alignItems: "flex-start", flexWrap: "wrap", justifyContent: "center" }}>
            {/* graph */}
            <div style={{ flex: "0 0 auto", width: "min(460px, 100%)" }}>
              <svg viewBox="0 0 502 320" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ display: "block", overflow: "visible", aspectRatio: "502 / 320" }}>
                <defs>
                  <linearGradient id="zy-gap2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(0,224,213,0.26)" />
                    <stop offset="100%" stopColor="rgba(0,224,213,0)" />
                  </linearGradient>
                </defs>

                {/* axes */}
                <g stroke="var(--zy-border-strong)" strokeWidth="1">
                  <line x1="44" y1="36" x2="44" y2="296" />
                  <line x1="44" y1="296" x2="438" y2="296" />
                </g>
                <g stroke="var(--zy-border-on-dark)" strokeWidth="1" opacity="0.55">
                  {[230, 164, 98].map((y) => (
                    <line key={y} x1="44" y1={y} x2="438" y2={y} />
                  ))}
                </g>

                {/* Y-axis label */}
                <text x="14" y="168" fill="var(--zy-on-dark-faint)" fontSize="9" fontFamily="var(--zy-font-mono)" textAnchor="middle" letterSpacing="0.06em" transform="rotate(-90, 14, 168)">
                  SCALE ↑
                </text>

                {/* widening-gap glow */}
                <path d={`${WORK_D} L430 168 L44 284 Z`} fill="url(#zy-gap2)" filter="blur(2px)" style={{ opacity: Math.max(0, (draw - 0.2) / 0.8) * 0.9 }} />

                {/* team capacity — linear, muted */}
                <path ref={capRef} d={CAP_D} fill="none" stroke="var(--zy-on-dark-faint)" strokeWidth="2" strokeLinecap="round" style={{ strokeDasharray: len.cap, strokeDashoffset: capOffset }} />

                {/* ad work — exponential, signal teal */}
                <path
                  ref={workRef}
                  d={WORK_D}
                  fill="none"
                  stroke="var(--zy-signal)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  style={{ strokeDasharray: len.work, strokeDashoffset: workOffset, filter: "drop-shadow(0 0 7px rgba(0,224,213,0.55))" }}
                />

                {/* point markers */}
                {BEATS.map((b) => {
                  const lit = draw >= b.at - 0.02
                  const x = b.key === "PAST" ? 60 : b.key === "AI" ? INFLECT_X : 430
                  const y = b.key === "PAST" ? 286 : b.key === "AI" ? INFLECT_Y : 46
                  return (
                    <g key={b.key} style={{ opacity: lit ? 1 : 0.22, transition: "opacity .35s ease" }}>
                      {b.key === "AI" ? <line x1={INFLECT_X} y1="40" x2={INFLECT_X} y2="296" stroke="var(--zy-signal)" strokeWidth="1" strokeDasharray="3 5" opacity="0.5" /> : null}
                      <circle cx={x} cy={y} r={b.key === "NOW" ? 5.5 : 4.5} fill="var(--zy-ink)" stroke="var(--zy-signal)" strokeWidth="2" style={{ filter: "drop-shadow(0 0 8px rgba(0,224,213,0.6))" }} />
                      <text x={x} y={y < 120 ? y - 14 : y + 22} textAnchor="middle" fill="var(--zy-signal)" fontSize="10" fontFamily="var(--zy-font-mono)" fontWeight="700" letterSpacing="0.1em">
                        {b.label}
                      </text>
                    </g>
                  )
                })}

                {/* TIME axis label */}
                <text x="44" y="314" fill="var(--zy-on-dark-faint)" fontSize="10" fontFamily="var(--zy-font-mono)" letterSpacing="0.08em">TIME →</text>

                {/* glowing draw-head */}
                {!reduce && draw > 0.001 && draw < 0.999 ? <circle cx={st.hx} cy={st.hy} r="4" fill="var(--zy-signal)" style={{ filter: "drop-shadow(0 0 9px rgba(0,224,213,0.95))" }} /> : null}
              </svg>
              {/* legend index */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 20, marginTop: 10 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ width: 22, height: 2.5, background: "var(--zy-signal)", borderRadius: 2, boxShadow: "0 0 6px rgba(0,224,213,0.55)" }} />
                  <span className="zy-label-mono" style={{ fontSize: 10, color: "var(--zy-signal)", letterSpacing: "0.08em" }}>AD WORK</span>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ width: 22, height: 2, background: "var(--zy-on-dark-faint)", borderRadius: 2 }} />
                  <span className="zy-label-mono" style={{ fontSize: 10, color: "var(--zy-on-dark-muted)", letterSpacing: "0.08em" }}>TEAM CAPACITY</span>
                </span>
              </div>
            </div>

            {/* caption panel */}
            <div style={{ flex: "1 1 260px", maxWidth: 380 }}>
              {/* crossfading beats — grid overlay so container self-sizes to tallest */}
              <div style={{ display: "grid", marginBottom: 28 }}>
                {BEATS.map((b, i) => (
                  <div
                    key={b.key}
                    style={{
                      gridArea: "1 / 1",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      opacity: i === activeIdx ? 1 : 0,
                      transform: i === activeIdx ? "none" : "translateY(8px)",
                      transition: "opacity .45s var(--ease-standard), transform .45s var(--ease-standard)",
                      pointerEvents: i === activeIdx ? "auto" : "none",
                      visibility: i === activeIdx ? "visible" : "hidden",
                    }}
                  >
                    <span className="zy-label-mono" style={{ color: "var(--zy-signal)" }}>{b.label}</span>
                    <p className="zy-headline-sm" style={{ margin: 0, fontSize: 20 }}>{b.head}</p>
                    <p className="zy-body-md" style={{ margin: 0, color: "var(--zy-on-dark-muted)" }}>{b.body}</p>
                  </div>
                ))}
              </div>

              {/* NOW CTA — appears with the NOW beat */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 14,
                  opacity: draw > 0.86 ? 1 : 0,
                  transform: draw > 0.86 ? "none" : "translateY(8px)",
                  transition: "opacity .5s var(--ease-standard), transform .5s var(--ease-standard)",
                  pointerEvents: draw > 0.86 ? "auto" : "none",
                }}
              >
                <Button variant="primary" size="lg" href="/ads-engineer">
                  Meet the Ads Engineer
                </Button>
              </div>
            </div>
          </div>

          {/* scroll affordance */}
          {!reduce ? (
            <div aria-hidden="true" style={{ marginTop: 32, textAlign: "center", opacity: draw < 0.04 ? 0.6 : 0, transition: "opacity .4s ease" }}>
              <span className="zy-label-mono" style={{ color: "var(--zy-on-dark-faint)" }}>SCROLL ↓</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

/** §2 The Moment — the inevitability case, told by scrolling along the curve. */
export function SiteMoment() {
  return (
    <section id="moment" style={{ borderTop: "1px solid var(--zy-border-on-dark)" }}>
      <ScrollAlongMoment />
    </section>
  )
}
