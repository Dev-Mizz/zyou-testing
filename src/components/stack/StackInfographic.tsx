import { useEffect, useRef, useState } from "react"
import { BrandLogo } from "@/components/ui/BrandLogo"
import { usePrefersReducedMotion, useMediaQuery } from "@/hooks/use-motion"

/* Five-layer execution stack — shared by the homepage (WhatIs) and /modern-ai-stack.
   Closed = isometric stacked slabs; open = flat labelled cards. L2 + L3 are exec. */
type Layer = {
  l: number
  t: string
  s: string | null
  name?: string
  exec?: boolean
  logos?: string[]
  more?: string
}
const LAYERS: Layer[] = [
  { l: 5, t: "What your team sees", s: "Dashboards, alerts, briefs, where people already work." },
  { l: 4, t: "Skills & workflows", s: "Built by Ads Engineers. Shared org-wide, compounds.", name: "Atlas" },
  { l: 3, t: "Agentic infrastructure", s: "Session mgmt · orchestration · token efficiency. Lens audits every call.", name: "Grid · Lens", exec: true },
  { l: 2, t: "Core engine", s: "Type-safety · validation · semantic error handling.", name: "Core", exec: true },
  { l: 1, t: "Platforms and Data Sources", s: null, logos: ["meta", "google-ads", "amazon", "dv360", "ttd"], more: "+ analytics, attribution, commerce" },
]
const PLANE_BG: Record<number, string> = {
  1: "linear-gradient(180deg,#0B1A31,#081427)",
  2: "linear-gradient(180deg,#10254A,#0C1E3E)",
  3: "linear-gradient(180deg,#142C56,#0F2548)",
  4: "linear-gradient(180deg,#10254A,#0C1E3E)",
  5: "linear-gradient(180deg,#173667,#122C56)",
}

/**
 * On first entry shows the stacked isometric "closed" state with teal motes
 * rising, holds ~1.8s, then opens flat with the exec edges lighting. Replays on
 * re-entry. Reduced-motion lands straight on the flat, lit cards.
 */
export function StackInfographic() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = usePrefersReducedMotion()
  const mobile = !useMediaQuery("(min-width: 600px)")
  const [open, setOpen] = useState(reduce)
  const [lit, setLit] = useState(reduce)
  const [motes, setMotes] = useState(!reduce)
  const armed = useRef(true)
  const holdT = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (reduce) {
      setOpen(true)
      setLit(true)
      setMotes(false)
      return
    }
    const el = ref.current
    if (!el) return
    const play = () => {
      setOpen(false)
      setMotes(true)
      setLit(false)
      holdT.current = setTimeout(() => {
        setOpen(true)
        setMotes(false)
        setLit(true)
      }, 1800)
    }
    const reset = () => {
      if (holdT.current) clearTimeout(holdT.current)
      setOpen(false)
      setMotes(true)
      setLit(false)
    }
    reset()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio >= 0.15) {
            if (armed.current) {
              armed.current = false
              play()
            }
          } else if (e.intersectionRatio === 0) {
            if (!armed.current) {
              armed.current = true
              reset()
            }
          }
        })
      },
      { threshold: [0, 0.15, 0.5] },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      if (holdT.current) clearTimeout(holdT.current)
    }
  }, [reduce])

  const planeW = mobile ? 300 : 392
  const planeH = mobile ? 66 : 72
  const isoT = "rotateX(55deg) rotateZ(-45deg)"

  return (
    <div ref={ref} style={{ position: "relative", height: mobile ? 372 : 430, perspective: 1500, perspectiveOrigin: "50% 48%" }}>
      <style>{"@keyframes zy-mote-rise{0%{transform:translateY(40px);opacity:0}20%{opacity:1}100%{transform:translateY(-120px);opacity:0}}"}</style>
      {/* dot-grid halo behind the stack */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: -30,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          WebkitMaskImage: "radial-gradient(ellipse 78% 72% at 50% 48%, #000 36%, transparent 100%)",
          maskImage: "radial-gradient(ellipse 78% 72% at 50% 48%, #000 36%, transparent 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          transformStyle: "preserve-3d",
          transform: open ? "none" : isoT,
          transition: "transform 1.1s cubic-bezier(.16,1,.3,1)",
        }}
      >
        {/* motes */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: motes ? 1 : 0, transition: "opacity .5s" }}>
          {!reduce &&
            [0, 1, 2, 3, 4, 5, 6].map((k) => (
              <span
                key={k}
                style={{
                  position: "absolute",
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "var(--zy-signal)",
                  boxShadow: "0 0 8px rgba(0,224,213,0.8)",
                  bottom: "34%",
                  left: `${20 + k * 9}%`,
                  animation: "zy-mote-rise 2.4s var(--ease-standard) infinite",
                  animationDelay: `${k * 0.34}s`,
                }}
              />
            ))}
        </div>

        {LAYERS.map((layer) => {
          const l = layer.l
          const i = l - 1
          const transform = open ? `translateY(${(3 - l) * 76}px)` : `translateZ(${(l - 3) * 60}px)`
          const execBorder = layer.exec ? (lit ? "var(--zy-signal)" : "rgba(0,224,213,0.5)") : "var(--zy-border-on-dark)"
          return (
            <div
              key={l}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: planeW,
                height: planeH,
                margin: `${-planeH / 2}px 0 0 ${-planeW / 2}px`,
                borderRadius: "var(--zy-radius-md)",
                border: `1px solid ${execBorder}`,
                boxShadow: layer.exec && lit ? "var(--zy-glow)" : "none",
                background: PLANE_BG[l],
                transformStyle: "preserve-3d",
                opacity: 1,
                transform,
                transition: "transform 1.05s cubic-bezier(.16,1,.3,1), border-color .5s ease, box-shadow .5s ease",
                transitionDelay: `${(i * 0.07).toFixed(2)}s`,
                willChange: "transform",
              }}
            >
              <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "42px 1fr auto", alignItems: "center", gap: 14, padding: "0 18px" }}>
                <span className="zy-data-mono" style={{ fontSize: 14, color: layer.exec ? "var(--zy-signal)" : "var(--zy-on-dark-faint)", letterSpacing: ".04em" }}>
                  L{l}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--zy-on-dark)", lineHeight: 1.2 }}>{layer.t}</div>
                  {layer.s ? <div style={{ fontSize: 11, color: "var(--zy-on-dark-muted)", lineHeight: 1.35, marginTop: 2 }}>{layer.s}</div> : null}
                  {layer.logos ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 11, flexWrap: "wrap", marginTop: 4 }}>
                      {layer.logos.map((name) => (
                        <BrandLogo key={name} name={name} size={15} />
                      ))}
                      <span className="zy-data-mono" style={{ fontSize: 8.5, letterSpacing: ".05em", color: "var(--zy-on-dark-faint)" }}>
                        {layer.more}
                      </span>
                    </div>
                  ) : null}
                </div>
                {layer.name && !mobile ? (
                  <span
                    className="zy-data-mono"
                    style={{
                      fontSize: 10,
                      letterSpacing: ".08em",
                      whiteSpace: "nowrap",
                      color: layer.exec ? "var(--zy-signal)" : "var(--zy-on-dark-faint)",
                      border: `1px solid ${layer.exec ? "rgba(0,224,213,0.4)" : "var(--zy-border-on-dark)"}`,
                      borderRadius: 5,
                      padding: "4px 7px",
                    }}
                  >
                    {layer.name}
                  </span>
                ) : (
                  <span />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
