import { useEffect, useRef, useState, type RefObject } from "react"
import { Reveal } from "@/components/motion/Reveal"
import { Button } from "@/components/ui/Button"
import { Icon, type IconName } from "@/components/ui/Icon"
import { usePrefersReducedMotion, useReveal } from "@/hooks/use-motion"

/* The engagement spine — embed → build → train, resolving into "leave". */
const SPINE: { icon: IconName; label: string; head: string; line: string }[] = [
  { icon: "route", label: "EMBED", head: "We embed.", line: "We come inside the building and work alongside your team. Not a tool you log into." },
  { icon: "layers", label: "BUILD", head: "We build.", line: "We stand up the agentic execution layer on your real accounts: connectors, orchestration, guardrails, audit." },
  { icon: "cpu", label: "TRAIN", head: "We train.", line: "Your people become Ads Engineers. They direct and govern the agents that run the work." },
]

/* What stays after Zyou leaves — the execution layer, still running. */
const STACK: { icon: IconName; name: string; desc: string }[] = [
  { icon: "cpu", name: "Core", desc: "Type-safe libraries built on ad platforms. Meta, Google, TikTok, GA4 and CRM, unified and validated." }, { icon: "workflow", name: "Grid", desc: "Orchestration. Agents act the same way, every time." },
  { icon: "shield", name: "Lens", desc: "Audit and governance. Every action logged. Nothing the agent isn't allowed to do." },
  { icon: "layers", name: "Atlas", desc: "Skills. What your team builds once, the whole org reuses." },
]

const BENCH: [string, string][] = [
  ["70%", "less context per call"],
  ["3×", "fewer tool-call failures"],
  ["97%", "repeatability on the same task"],
]

function Spine() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const beatRefs = useRef<(HTMLDivElement | null)[]>([])
  const reduce = usePrefersReducedMotion()
  const [fill, setFill] = useState(reduce ? 1 : 0)
  const [reached, setReached] = useState(reduce ? SPINE.length + 1 : 0)
  const [railEnd, setRailEnd] = useState<number | null>(null)
  // ponytail: cache per-resize geometry so the scroll loop reads layout once
  // (getBoundingClientRect) per frame instead of offsetHeight + every offsetTop.
  const geom = useRef({ h: 0, vh: 800, offs: [] as number[] })

  // End the rail at the last node's icon centre so the line doesn't overflow below it.
  useEffect(() => {
    const measure = () => {
      const last = beatRefs.current[SPINE.length]
      if (last) setRailEnd(last.offsetTop + 23) // 23 = half the 46px icon
      geom.current.h = wrapRef.current?.offsetHeight ?? 0
      geom.current.vh = window.innerHeight || 800
      geom.current.offs = beatRefs.current.map((b) => (b ? b.offsetTop : Infinity))
    }
    measure()
    window.addEventListener("resize", measure)
    document.fonts?.ready.then(measure) // re-measure after font swap shifts layout
    return () => window.removeEventListener("resize", measure)
  }, [])

  useEffect(() => {
    if (reduce) return
    let raf: number | null = null
    const update = () => {
      raf = null
      const el = wrapRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const { h, vh, offs } = geom.current
      if (h <= 0) return
      const start = vh * 0.78
      const f = Math.max(0, Math.min(1, (start - rect.top) / (h * 0.82)))
      setFill(f)
      const fillPx = f * h
      let r = 0
      for (const off of offs) {
        if (off <= fillPx + 24) r += 1
      }
      setReached(r)
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

  const leaveReached = fill > 0.9
  const SPINE_X = 27

  return (
    <div ref={wrapRef} style={{ position: "relative", paddingLeft: 0 }}>
      {/* the vertical signal spine */}
      <div aria-hidden="true" style={{ position: "absolute", left: SPINE_X, top: 8, height: railEnd != null ? railEnd - 8 : "calc(100% - 16px)", width: 2, transform: "translateX(-50%)" }}>
        <span style={{ position: "absolute", inset: 0, background: "var(--zy-border-on-dark)", borderRadius: 2 }} />
        <span
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: `${(reduce ? 1 : fill) * 100}%`,
            background: "linear-gradient(180deg, rgba(0,224,213,0.2), var(--zy-signal))",
            boxShadow: "0 0 9px rgba(0,224,213,0.55)",
            borderRadius: 2,
          }}
        />
        {!reduce ? (
          <span
            style={{
              position: "absolute",
              left: "50%",
              top: `${fill * 100}%`,
              transform: "translate(-50%, -50%)",
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "var(--zy-signal)",
              boxShadow: "0 0 14px rgba(0,224,213,0.95), 0 0 5px rgba(0,224,213,1)",
              opacity: leaveReached ? 0 : 1,
              transition: "opacity .5s var(--ease-standard)",
            }}
          />
        ) : null}
      </div>

      {/* beats */}
      <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        {SPINE.map((b, i) => {
          const on = i < reached
          return (
            <div
              key={b.label}
              ref={(el) => {
                beatRefs.current[i] = el
              }}
              style={{
                display: "flex",
                gap: 22,
                alignItems: "flex-start",
                paddingLeft: 4,
                opacity: on ? 1 : 0.32,
                transform: on ? "none" : "translateY(10px)",
                transition: "opacity .5s var(--ease-standard), transform .5s var(--ease-standard)",
              }}
            >
              <span
                style={{
                  flex: "0 0 auto",
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--zy-ink)",
                  position: "relative",
                  zIndex: 1,
                  border: `1px solid ${on ? "var(--zy-signal)" : "var(--zy-border-strong)"}`,
                  color: on ? "var(--zy-signal)" : "var(--zy-on-dark-muted)",
                  boxShadow: on ? "0 0 14px rgba(0,224,213,0.45)" : "none",
                  transition: "color var(--dur-base), border-color var(--dur-base), box-shadow var(--dur-base)",
                }}
              >
                <Icon name={b.icon} size={22} stroke={1.7} />
              </span>
              <div style={{ paddingTop: 2 }}>
                <span className="zy-label-mono" style={{ display: "block", color: "var(--zy-on-dark-muted)", marginBottom: 8 }}>{b.label}</span>
                <h3 className="zy-headline-sm" style={{ margin: "0 0 8px" }}>{b.head}</h3>
                <p className="zy-body-md" style={{ margin: 0, color: "var(--zy-on-dark-muted)", maxWidth: "52ch" }}>{b.line}</p>
              </div>
            </div>
          )
        })}

        {/* LEAVE — the payoff headline node */}
        <div
          ref={(el) => {
            beatRefs.current[SPINE.length] = el
          }}
          style={{
            display: "flex",
            gap: 22,
            alignItems: "flex-start",
            paddingLeft: 4,
            marginTop: 4,
            opacity: leaveReached ? 1 : 0.32,
            transform: leaveReached ? "none" : "translateY(10px)",
            transition: "opacity .5s var(--ease-standard), transform .5s var(--ease-standard)",
          }}
        >
          <span
            style={{
              flex: "0 0 auto",
              width: 46,
              height: 46,
              borderRadius: "50%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--zy-ink)",
              position: "relative",
              zIndex: 1,
              border: "1px solid var(--zy-signal)",
              color: "var(--zy-signal)",
              boxShadow: "0 0 16px rgba(0,224,213,0.5)",
              animation: leaveReached && !reduce ? "zy-pulsate 2.6s ease-in-out infinite" : "none",
            }}
          >
            <Icon name="zap" size={22} stroke={1.7} />
          </span>
          <div style={{ paddingTop: 2 }}>
            <span className="zy-label-mono" style={{ display: "block", color: "var(--zy-signal)", marginBottom: 8 }}>WHEN WE LEAVE</span>
            <h3 className="zy-headline-md" style={{ margin: 0, maxWidth: "20ch" }}>The system stays. Your team runs it.</h3>
          </div>
        </div>
      </div>
    </div>
  )
}

/* The system that stays — four lit nodes, still pulsing after Zyou is gone. */
function SystemStays() {
  const [ref, inView] = useReveal<HTMLDivElement>({ threshold: 0.3 })
  const reduce = usePrefersReducedMotion()
  const on = inView || reduce
  return (
    <div ref={ref as RefObject<HTMLDivElement>} style={{ marginTop: 64 }}>
      <span className="zy-label-mono" style={{ display: "block", marginBottom: 18, color: "var(--zy-on-dark-muted)" }}>WHAT STAYS · THE EXECUTION LAYER</span>
      <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
        {STACK.map((s, i) => (
          <div
            key={s.name}
            style={{
              background: "linear-gradient(180deg, var(--zy-ink) 0%, var(--zy-ink-800) 100%)",
              border: "1px solid var(--zy-border-strong)",
              borderRadius: "var(--zy-radius-lg)",
              padding: "20px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              opacity: on ? 1 : 0,
              transform: on ? "none" : "translateY(14px)",
              transition: `opacity .5s var(--ease-standard) ${i * 0.08}s, transform .5s var(--ease-standard) ${i * 0.08}s`,
            }}
          >
            <span
              style={{
                width: 40,
                height: 40,
                borderRadius: "var(--zy-radius-md)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,224,213,0.10)",
                border: "1px solid rgba(0,224,213,0.22)",
                color: "var(--zy-signal)",
              }}
            >
              <Icon name={s.icon} size={20} stroke={1.7} />
            </span>
            <div>
              <span className="zy-ui" style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--zy-on-dark)", fontSize: 15, marginBottom: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--zy-signal)", boxShadow: "var(--zy-glow)", animation: on && !reduce ? "zy-pulsate 2.8s ease-in-out infinite" : "none" }} />
                {s.name}
              </span>
              <span className="zy-body-sm" style={{ display: "block", color: "var(--zy-on-dark-muted)" }}>{s.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* compact benchmark proof strip */}
      <div style={{ position: "relative", overflow: "hidden", marginTop: 20, borderRadius: "var(--zy-radius-lg)", border: "1px solid var(--zy-border-on-dark)" }}>
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            background: "radial-gradient(80% 160% at 78% 120%, rgba(0,224,213,0.20), transparent 60%), radial-gradient(60% 140% at 20% 130%, rgba(0,224,213,0.10), transparent 60%)",
            filter: "blur(50px)",
            animation: "zy-aurora-drift 13s var(--ease-standard) infinite",
          }}
        />
        <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
          {BENCH.map(([v, l], i) => (
            <div key={l} style={{ padding: "24px 24px", borderLeft: i === 0 ? "none" : "1px solid var(--zy-border-on-dark)" }}>
              <div className="zy-data-mono" style={{ fontSize: 34, color: "var(--zy-signal)", textShadow: "0 0 18px rgba(0,224,213,0.45)", lineHeight: 1 }}>{v}</div>
              <div className="zy-body-sm" style={{ color: "var(--zy-on-dark-muted)", marginTop: 10 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** §5 The System — how we work (the spine) resolving into what stays (the stack). */
export function HowWeWork() {
  return (
    <section id="how" style={{ padding: "96px 24px", borderTop: "1px solid var(--zy-border-on-dark)" }}>
      <div style={{ maxWidth: "var(--zy-container)", margin: "0 auto" }}>
        <Reveal>
          <span className="zy-label-mono" style={{ display: "block", marginBottom: 20 }}>HOW WE WORK</span>
          <h2 className="zy-headline-lg" style={{ margin: "0 0 6px", maxWidth: "22ch" }}>
            <span style={{ color: "var(--zy-signal)" }}>Forge</span>, our forward-deployed engineering arm.
          </h2>
          <p className="zy-headline-sm" style={{ margin: "0 0 16px", maxWidth: "40ch", color: "var(--zy-on-dark-muted)" }}>
            We build your execution layer on Zyou infrastructure, then train your team to run it.
          </p>
          <p className="zy-body-lg" style={{ color: "var(--zy-on-dark-muted)", margin: "0 0 56px", maxWidth: "60ch" }}>Not a six-month engagement that ends in a deck.</p>
        </Reveal>

        <Spine />
        <SystemStays />

        <div style={{ marginTop: 48 }}>
          <Button variant="secondary" size="lg" href="/forge">
            See how Forge works
          </Button>
        </div>
      </div>
    </section>
  )
}
