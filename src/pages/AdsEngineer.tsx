import { useEffect, useRef, type CSSProperties, type RefObject } from "react"
import { Reveal } from "@/components/motion/Reveal"
import { Stagger } from "@/components/motion/Stagger"
import { ScrollWords } from "@/components/motion/ScrollWords"
import { Button } from "@/components/ui/Button"
import { useReveal } from "@/hooks/use-motion"
import { useScrub, scrubScroll, smooth01, clampN, easeInOut } from "@/hooks/use-scrub"
import { AEStage, AEAurora, AEType, AE_EMPH } from "@/components/ads-engineer/ae-kit"
import { WIDSection } from "@/components/ads-engineer/WIDSection"
import { Seo } from "@/components/ui/Seo"
import "@/components/ads-engineer/ae.css"

const scrollToId = (id: string) => {
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - 88
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" })
}

/* ── §1 Hero ── */
function AEHero({ onExplore }: { onExplore: () => void }) {
  return (
    <section id="reframe" style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px 24px", textAlign: "center", overflow: "hidden" }}>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, maskImage: "linear-gradient(to top, #000 62%, transparent 90%)", WebkitMaskImage: "linear-gradient(to top, #000 62%, transparent 90%)" }}>
        <AEAurora intensity={1.8} band={[0.62, 1.04]} />
      </div>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, background: "radial-gradient(60% 42% at 50% 42%, rgba(7,19,38,0.85), transparent 70%)" }} />

      <Stagger immediate style={{ position: "relative", zIndex: 1, maxWidth: 1040, margin: "0 auto" }}>
        <span className="zy-label-mono" style={{ display: "block", marginBottom: 30, color: "var(--zy-signal)" }}>THE ADS ENGINEER</span>
        <h1 className="zy-headline-xl" style={{ margin: 0, fontSize: AEType.h1, lineHeight: 1.08, letterSpacing: "-0.02em" }}>
          Your ad team doesn’t need new tools.<br />They need to operate like <span className="zy-accent">engineers</span>.
        </h1>
        <p className="zy-body-lg" style={{ color: "var(--zy-on-dark-muted)", margin: "28px auto 0", maxWidth: "46ch" }}>
          Your own people, leveled up to direct the agents instead of doing the work.
        </p>
        <div style={{ marginTop: 44 }}>
          <Button variant="primary" size="lg" onClick={onExplore}>Explore use cases</Button>
        </div>
      </Stagger>

      <button onClick={() => scrollToId("analogy")} aria-label="Scroll" style={{ position: "absolute", zIndex: 1, bottom: 32, left: "50%", transform: "translateX(-50%)", cursor: "pointer", background: "transparent", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <span className="zy-label-mono" style={{ fontSize: 10, color: "var(--zy-on-dark-faint)" }}>SCROLL</span>
        <span style={{ width: 1, height: 32, background: "linear-gradient(var(--zy-on-dark-faint), transparent)" }} />
      </button>
    </section>
  )
}

/* ── §2 The analogy — scroll-scrubbed cascading swaps ── */
function Swap({ a, b, p, center, width = 0.1, d, style, colorA, colorB, className }: { a: string; b: string; p: number; center: number; width?: number; d: number; style?: CSSProperties; colorA: string; colorB: string; className?: string }) {
  const oa = clampN(1 - smooth01(center - width, center, p))
  const ob = clampN(smooth01(center, center + width, p))
  const t = smooth01(center - width, center + width, p)
  const cell: CSSProperties = { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap" }
  return (
    <span className={className} style={{ position: "relative", display: "block", ...style }}>
      <span style={{ ...cell, opacity: oa, transform: `translateY(${(-t * d).toFixed(1)}px)`, color: colorA }}>{a}</span>
      <span style={{ ...cell, opacity: ob, transform: `translateY(${((1 - t) * d).toFixed(1)}px)`, color: colorB }}>{b}</span>
    </span>
  )
}

function AEAnalogy() {
  const ref = useRef<HTMLElement>(null)
  const p = useScrub(ref, 0.92)
  const big: CSSProperties = { height: "clamp(42px, 5vw, 58px)", fontFamily: "var(--zy-font-sans)", fontWeight: 700, fontSize: AEType.h2, letterSpacing: "-0.02em" }
  const mid: CSSProperties = { height: "clamp(28px, 3.4vw, 40px)", fontFamily: "var(--zy-font-sans)", fontWeight: 500, fontSize: AEType.h4 }
  return (
    <section id="analogy" ref={ref} style={{ position: "relative", zIndex: 1, height: "180vh" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "96px 24px", textAlign: "center" }}>
        <span className="zy-label-mono" style={{ color: "var(--zy-signal)", marginBottom: 24 }}>THE ANALOGY</span>
        <p style={{ maxWidth: "28ch", margin: "0 0 56px", fontFamily: "var(--zy-font-sans)", fontWeight: 500, fontSize: AEType.h4, lineHeight: 1.3, letterSpacing: "-0.01em", color: "var(--zy-on-dark-muted)" }}>
          A software engineer doesn’t code manually anymore.
        </p>
        <div style={{ display: "grid", gap: 22, justifyItems: "center", width: "min(620px, 92vw)" }}>
          <Swap a="Software Engineer" b="Ads Engineer" p={p} center={0.4} d={44} style={big} colorA="var(--zy-on-dark)" colorB="var(--zy-signal)" />
          <span className="zy-label-mono" style={{ color: "var(--zy-on-dark-muted)" }}>DIRECTS THE AGENTS THAT</span>
          <Swap a="ship the code." b="run the campaigns." p={p} center={0.52} d={32} style={mid} colorA="var(--zy-on-dark-muted)" colorB="var(--zy-on-dark)" />
        </div>
        <Swap className="ae-an-sub" a="The engineer stopped typing and started directing." b="The same move, now for advertising." p={p} center={0.62} d={22} style={{ height: 28, marginTop: 52, width: "min(620px, 92vw)", fontFamily: "var(--zy-font-sans)", fontWeight: 400, fontSize: AEType.bodyMd }} colorA="var(--zy-on-dark-muted)" colorB="var(--zy-on-dark-muted)" />
      </div>
    </section>
  )
}

/* ── §3 The convergence — scrubbed five-discipline rosette ── */
const DISC = [
  { label: ["Performance", "Marketing"], teal: false },
  { label: ["Creative &", "Strategy"], teal: false },
  { label: ["Data &", "Analytics"], teal: false },
  { label: ["Campaign", "Operations"], teal: false },
  { label: ["Systems", "Thinking"], teal: true },
]
const CX = 500, CY = 500, DCEN = 150, RCIR = 226, RLAB = 392, RTH = 348
const ANG = (i: number) => ((-90 + i * 72) * Math.PI) / 180

function AEConvergeScene() {
  const secRef = useRef<HTMLElement>(null)
  const lineRefs = useRef<(SVGLineElement | null)[]>([])
  const labelRefs = useRef<(SVGGElement | null)[]>([])
  const circRefs = useRef<(SVGCircleElement | null)[]>([])
  const coreRef = useRef<SVGGElement>(null)
  const pentaRef = useRef<SVGRectElement>(null)
  const glowRef = useRef<SVGCircleElement>(null)
  const logoRef = useRef<SVGImageElement>(null)
  const capRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const render = (p: number) => {
      const draw = smooth01(0.04, 0.3, p)
      const bloom = easeInOut(smooth01(0.36, 0.74, p))
      const thFade = smooth01(0.34, 0.62, p)
      const penta = smooth01(0.72, 0.96, p)

      for (let i = 0; i < DISC.length; i++) {
        const a = ANG(i), cos = Math.cos(a), sin = Math.sin(a)
        const ex = CX + cos * RTH * draw, ey = CY + sin * RTH * draw
        const line = lineRefs.current[i]
        if (line) {
          line.setAttribute("x2", ex.toFixed(1))
          line.setAttribute("y2", ey.toFixed(1))
          line.style.opacity = (draw * (1 - thFade)).toFixed(3)
        }
        const lab = labelRefs.current[i]
        if (lab) lab.style.opacity = smooth01(0.1 + i * 0.02, 0.3 + i * 0.02, p).toFixed(3)
        const circ = circRefs.current[i]
        if (circ) {
          const ccx = CX + cos * DCEN * bloom, ccy = CY + sin * DCEN * bloom
          circ.setAttribute("cx", ccx.toFixed(1))
          circ.setAttribute("cy", ccy.toFixed(1))
          circ.setAttribute("r", (RCIR * bloom).toFixed(1))
          circ.style.opacity = (bloom * (DISC[i].teal ? 0.95 : 0.5)).toFixed(3)
        }
      }
      if (coreRef.current) coreRef.current.style.opacity = clampN(1 - bloom * 1.5).toFixed(3)
      if (glowRef.current) glowRef.current.style.opacity = (penta * 0.5).toFixed(3)
      if (pentaRef.current) pentaRef.current.style.opacity = penta.toFixed(3)
      if (logoRef.current) logoRef.current.style.opacity = penta.toFixed(3)

      const co = [
        clampN(1 - smooth01(0.3, 0.46, p)),
        clampN(smooth01(0.4, 0.56, p) - smooth01(0.66, 0.8, p)),
        smooth01(0.8, 0.96, p),
      ]
      capRefs.current.forEach((c, i) => {
        if (c) c.style.opacity = co[i].toFixed(3)
      })
    }
    return scrubScroll(() => secRef.current, render, 0.92)
  }, [])

  const seat = (i: number) => ({ cx: CX + Math.cos(ANG(i)) * DCEN, cy: CY + Math.sin(ANG(i)) * DCEN })

  return (
    <section id="madeof" ref={secRef} style={{ position: "relative", zIndex: 1, height: "220vh" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
        <div className="ae-converge-grid" style={{ width: "100%", maxWidth: 980, margin: "0 auto", display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: "clamp(20px, 4vw, 48px)", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <span className="zy-label-mono" style={{ display: "block", color: "var(--zy-signal)", marginBottom: "clamp(20px, 4vh, 38px)" }}>WHAT IT’S MADE OF</span>
            <div className="ae-converge-reserve" style={{ position: "relative", minHeight: "clamp(150px, 26vh, 230px)" }}>
              <p ref={(el) => { capRefs.current[0] = el }} className="ae-cap" style={{ position: "absolute", left: 0, right: 0, top: 0, margin: 0, fontFamily: "var(--zy-font-sans)", fontWeight: 500, fontSize: AEType.h4, lineHeight: 1.3, color: "var(--zy-on-dark)", opacity: 0 }}>Five disciplines your people already have.</p>
              <p ref={(el) => { capRefs.current[1] = el }} className="ae-cap" style={{ position: "absolute", left: 0, right: 0, top: 0, margin: 0, fontFamily: "var(--zy-font-sans)", fontWeight: 500, fontSize: AEType.h4, lineHeight: 1.3, color: "var(--zy-on-dark-muted)", opacity: 0 }}>Held together by the one that’s new to the room.</p>
              <div ref={(el) => { capRefs.current[2] = el }} className="ae-cap" style={{ left: 0, right: 0, top: 0, opacity: 0 }}>
                <h2 style={{ margin: 0, fontFamily: "var(--zy-font-sans)", fontWeight: 700, fontSize: AEType.h2, lineHeight: 1.04, letterSpacing: "-0.02em", color: "var(--zy-signal)" }}>The Ads Engineer.</h2>
                <p style={{ margin: "14px 0 0", fontFamily: "var(--zy-font-sans)", fontWeight: 500, fontSize: AEType.h4, lineHeight: 1.28, color: "var(--zy-on-dark-muted)" }}>Where five disciplines converge into one operator.</p>
              </div>
            </div>
          </div>

          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg className="ae-converge-svg" viewBox="-60 -60 1120 1120" style={{ width: "min(64vh, 100%, 600px)", height: "min(64vh, 100%, 600px)", overflow: "visible" }} aria-hidden="true">
              <defs>
                {DISC.map((_, i) => (
                  <clipPath key={`cp${i}`} id={`aeClip${i}`} clipPathUnits="userSpaceOnUse" {...(i > 0 ? { clipPath: `url(#aeClip${i - 1})` } : {})}>
                    <circle cx={seat(i).cx} cy={seat(i).cy} r={RCIR} />
                  </clipPath>
                ))}
              </defs>

              {DISC.map((d, i) => (
                <line key={`ln${i}`} ref={(el) => { lineRefs.current[i] = el }} x1={CX} y1={CY} x2={CX} y2={CY} stroke={d.teal ? "rgba(0,224,213,0.75)" : "rgba(255,255,255,0.4)"} strokeWidth={d.teal ? 1.5 : 1} style={{ opacity: 0 }} />
              ))}

              {DISC.map((d, i) => (
                <circle key={`cc${i}`} ref={(el) => { circRefs.current[i] = el }} cx={CX} cy={CY} r="0" fill="none" stroke={d.teal ? "rgba(0,224,213,0.9)" : "rgba(0,224,213,0.45)"} strokeWidth={d.teal ? 2 : 1.25} style={{ opacity: 0 }} />
              ))}

              <circle ref={glowRef} cx={CX} cy={CY} r="92" fill="rgba(0,224,213,0.22)" style={{ opacity: 0, filter: "blur(30px)" }} />
              <rect ref={pentaRef} x="0" y="0" width="1000" height="1000" clipPath="url(#aeClip4)" fill="var(--zy-signal)" style={{ opacity: 0, filter: "drop-shadow(0 0 12px rgba(0,224,213,0.6))" }} />

              <image ref={logoRef} href="/logos/Logo_Light.svg" x="448" y="455" width="104" height="90" preserveAspectRatio="xMidYMid meet" style={{ opacity: 0 }} />

              <g ref={coreRef}>
                <circle cx={CX} cy={CY} r="5" fill="var(--zy-signal)" style={{ filter: "drop-shadow(0 0 6px rgba(0,224,213,0.9))" }} />
                <circle className="ae-core-pulse" cx={CX} cy={CY} r="10" fill="none" stroke="var(--zy-signal)" strokeWidth="1.5" />
              </g>

              {DISC.map((d, i) => {
                const a = ANG(i), cos = Math.cos(a), sin = Math.sin(a)
                const x = CX + cos * RLAB, y = CY + sin * RLAB
                const ta = cos > 0.2 ? "start" : cos < -0.2 ? "end" : "middle"
                return (
                  <g key={`lb${i}`} ref={(el) => { labelRefs.current[i] = el }} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`} style={{ opacity: 0 }}>
                    <text textAnchor={ta} dominantBaseline="central" style={{ fill: d.teal ? "var(--zy-signal)" : "var(--zy-on-dark)", fontFamily: "var(--zy-font-mono)", fontWeight: 500, fontSize: 25, letterSpacing: "0.01em", filter: d.teal ? "drop-shadow(0 0 8px rgba(0,224,213,0.5))" : "none" }}>
                      <tspan x="0" dy="-0.55em">{d.label[0]}</tspan>
                      <tspan x="0" dy="1.15em">{d.label[1]}</tspan>
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── §6 The distinction ── */
function AEDistinction() {
  return (
    <section id="distinction" style={{ position: "relative", zIndex: 1, minHeight: "88vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "110px 24px" }}>
      <Reveal style={{ maxWidth: 1000, margin: "0 auto", width: "100%" }}>
        <span className="zy-label-mono" style={{ display: "block", textAlign: "center", marginBottom: "clamp(40px, 7vh, 72px)", color: "var(--zy-signal)" }}>THE DISTINCTION</span>
        <div className="ae-distinction-grid" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "clamp(28px, 5vw, 64px)", alignItems: "stretch" }}>
          <div>
            <span className="zy-label-mono" style={{ display: "block", marginBottom: 20, color: "var(--zy-on-dark-faint)" }}>THE PERFORMANCE MARKETER</span>
            <p style={{ margin: 0, fontFamily: "var(--zy-font-sans)", fontWeight: 600, fontSize: AEType.h3, lineHeight: 1.18, letterSpacing: "-0.01em", color: "var(--zy-on-dark-muted)" }}>Optimizes campaigns.</p>
            <p className="zy-data-mono" style={{ margin: "20px 0 0", color: "var(--zy-on-dark-faint)", fontSize: 13, lineHeight: 1.7 }}>Help that ends when you close the tab.</p>
          </div>
          <div className="ae-distinction-rule" style={{ position: "relative", width: 1, background: "var(--zy-border-on-dark)", alignSelf: "stretch" }}>
            <span aria-hidden="true" style={{ position: "absolute", left: "50%", top: "50%", width: 9, height: 9, borderRadius: "50%", transform: "translate(-50%,-50%)", background: "var(--zy-signal)", boxShadow: "var(--zy-glow)" }} />
          </div>
          <div>
            <span className="zy-label-mono" style={{ display: "block", marginBottom: 20, color: "var(--zy-signal)" }}>THE ADS ENGINEER</span>
            <p style={{ margin: 0, fontFamily: "var(--zy-font-sans)", fontWeight: 700, fontSize: AEType.h3, lineHeight: 1.18, letterSpacing: "-0.01em", color: AE_EMPH }}>Builds the systems that act without waiting for a human to notice.</p>
            <p className="zy-data-mono" style={{ margin: "20px 0 0", color: "var(--zy-on-dark-muted)", fontSize: 13, lineHeight: 1.7 }}>Leverage that runs without you. The systems stay, and compound.</p>
          </div>
        </div>
        <p className="zy-body-lg" style={{ color: "var(--zy-on-dark-muted)", margin: "clamp(40px, 7vh, 72px) auto 0", maxWidth: "40ch", textAlign: "center" }}>
          Most teams have the first. The second is what’s next.
        </p>
      </Reveal>
    </section>
  )
}

/* ── §7 Already real ── */
const SIGNALS = [
  { read: "$132K–$198K", text: "Stripe formalized a forward-deployed AI role inside marketing, to build the systems and own the infrastructure." },
  { read: "$100M+ SPEND", text: "Agencies running hundreds of millions are moving their best ops people into this function." },
  { read: "NO NAME YET", text: "The practitioners are already doing the work. The title just hasn’t caught up." },
]
function AERealRow({ s, i }: { s: (typeof SIGNALS)[number]; i: number }) {
  const [ref, inView] = useReveal<HTMLDivElement>({ threshold: 0.6 })
  return (
    <div
      ref={ref as RefObject<HTMLDivElement>}
      className="ae-signal-row"
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0,0.3fr) minmax(0,0.7fr)",
        gap: 36,
        alignItems: "baseline",
        padding: "28px 0",
        borderTop: "1px solid var(--zy-border-on-dark)",
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(12px)",
        transition: `opacity .6s var(--ease-standard) ${i * 0.08}s, transform .6s var(--ease-standard) ${i * 0.08}s`,
      }}
    >
      <span className="zy-data-mono" style={{ color: "var(--zy-on-dark-muted)", fontSize: 16 }}>{s.read}</span>
      <p className="zy-body-md" style={{ color: "var(--zy-on-dark)", margin: 0 }}>{s.text}</p>
    </div>
  )
}
function AEReal() {
  return (
    <section id="real" style={{ position: "relative", zIndex: 1, minHeight: "84vh", display: "flex", alignItems: "center", padding: "96px 24px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", width: "100%" }}>
        <Stagger style={{ textAlign: "center", marginBottom: 24 }}>
          <span className="zy-label-mono" style={{ display: "block", color: "var(--zy-signal)" }}>ALREADY REAL</span>
          <h2 className="zy-headline-lg" style={{ margin: "20px auto 0", maxWidth: "16ch", fontSize: AEType.h2 }}>The role exists. It’s been missing a name.</h2>
        </Stagger>
        <div style={{ borderBottom: "1px solid var(--zy-border-on-dark)", marginTop: 24 }}>
          {SIGNALS.map((s, i) => <AERealRow key={s.read} s={s} i={i} />)}
        </div>
      </div>
    </section>
  )
}

/* ── §8 Become it (capstone) ── */
function AEBecome({ onExplore }: { onExplore: () => void }) {
  return (
    <section id="become" style={{ position: "relative", zIndex: 1, minHeight: "88vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "120px 24px" }}>
      <div style={{ position: "relative", maxWidth: 900 }}>
        <span className="zy-label-mono" style={{ display: "block", marginBottom: 28, color: "var(--zy-signal)" }}>BECOME IT</span>
        <ScrollWords text="This is who your team becomes. We’re how it gets there." className="zy-headline-xl" style={{ margin: "0 auto", maxWidth: "20ch", fontSize: AEType.h1, lineHeight: 1.12, letterSpacing: "-0.02em" }} />
        <p className="zy-body-lg" style={{ color: "var(--zy-on-dark-muted)", margin: "24px auto 0", maxWidth: "44ch" }}>
          Zyou builds the systems. Forge embeds and trains your team to run them.
        </p>
        <div style={{ marginTop: 44, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Button variant="primary" size="lg" onClick={onExplore}>Explore use cases</Button>
        </div>
      </div>
    </section>
  )
}

/** /ads-engineer — long-scroll cinematic deep page on the Ads Engineer role. */
export function AdsEngineer() {
  const onExplore = () => scrollToId("does")
  return (
    <div className="ae-page">
      <Seo
        title="The Ads Engineer | Directing AI Agents, Not Manual Campaigns"
        description="The role your ad team grows into: directing agents instead of running campaigns by hand, and how marketers use Claude for advertising."
        canonical="https://zyou.ai/ads-engineer"
      />
      <AEStage />
      <span id="top" />
      <AEHero onExplore={onExplore} />
      <AEAnalogy />
      <AEConvergeScene />
      <WIDSection />
      <AEDistinction />
      <AEReal />
      <AEBecome onExplore={onExplore} />
    </div>
  )
}
