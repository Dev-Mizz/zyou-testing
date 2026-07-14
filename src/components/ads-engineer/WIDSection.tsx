import { useEffect, useRef, useState } from "react"
import { useMediaQuery } from "@/hooks/use-motion"
import { mono, SIG, INK6, INK7, ON, MUT, FNT } from "./info-kit"
import { Fig1, Fig2, Fig3 } from "./figures"

const MOVES = [
  { n: "01", title: "Engineer the ops layer", sub: "The work your team does by hand, rebuilt as systems that run themselves.", Fig: Fig1 },
  { n: "02", title: "Close the loops", sub: "Where performance waited on a human noticing, closed into a loop that runs itself.", Fig: Fig2 },
  { n: "03", title: "Invent new capability", sub: "What the team could not do before, because no human can run at this cadence.", Fig: Fig3 },
]

function Arrow({ dir, onClick }: { dir: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={dir < 0 ? "Previous" : "Next"}
      style={{
        width: 44, height: 44, borderRadius: "50%", flex: "0 0 auto", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
        background: "rgba(7,19,38,0.6)", border: `1px solid ${INK6}`, color: ON,
        backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", transition: "border-color .2s, color .2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = SIG
        e.currentTarget.style.color = SIG
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = INK6
        e.currentTarget.style.color = ON
      }}
    >
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true" style={{ transform: dir < 0 ? "scaleX(-1)" : "none" }}>
        <path d="M5 2.5 L10 7.5 L5 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

/** §5 "What it does" — one figure active at a time, tabs/arrows/dots/keys/swipe. */
export function WIDSection() {
  const [active, setActive] = useState(0)
  const mobile = !useMediaQuery("(min-width: 760px)")
  const N = MOVES.length
  const go = (i: number) => setActive((i + N) % N)
  const activeRef = useRef(active)
  activeRef.current = active

  useEffect(() => {
    const onK = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(activeRef.current - 1)
      if (e.key === "ArrowRight") go(activeRef.current + 1)
    }
    window.addEventListener("keydown", onK)
    return () => window.removeEventListener("keydown", onK)
    // go/activeRef are stable; bind the key handler once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const tx = useRef<number | null>(null)
  const onTS = (e: React.TouchEvent) => {
    tx.current = e.touches[0].clientX
  }
  const onTE = (e: React.TouchEvent) => {
    if (tx.current == null) return
    const dx = e.changedTouches[0].clientX - tx.current
    if (Math.abs(dx) > 44) go(active + (dx < 0 ? 1 : -1))
    tx.current = null
  }

  const m = MOVES[active]
  const ActiveFig = m.Fig

  return (
    <section id="does" style={{ position: "relative", zIndex: 1, padding: "clamp(72px, 11vh, 132px) 24px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "clamp(28px, 4vh, 44px)" }}>
          <span className="zy-label-mono" style={{ display: "block", color: SIG }}>WHAT IT DOES</span>
          <h2 className="zy-headline-md" style={{ margin: "14px auto 0", maxWidth: "22ch", fontSize: "clamp(23px, 3.2vw, 38px)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            Build at the systems level.<br />Automate at the campaign level.
          </h2>
        </div>

        {!mobile && (
          <div style={{ display: "flex", justifyContent: "center", gap: 0, borderBottom: `1px solid ${INK7}`, marginBottom: 22 }}>
            {MOVES.map((mv, i) => {
              const on = i === active
              return (
                <button key={mv.n} onClick={() => go(i)} style={{ display: "flex", alignItems: "baseline", gap: 10, padding: "0 26px 16px", cursor: "pointer", background: "transparent", border: "none", borderBottom: `2px solid ${on ? SIG : "transparent"}`, marginBottom: -1 }}>
                  <span style={mono(11, on ? SIG : FNT, { letterSpacing: ".1em" })}>{mv.n}</span>
                  <span style={{ fontFamily: "var(--zy-font-sans)", fontWeight: 600, fontSize: 16, color: on ? ON : MUT, whiteSpace: "nowrap" }}>{mv.title}</span>
                </button>
              )
            })}
          </div>
        )}

        {mobile && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
            <Arrow dir={-1} onClick={() => go(active - 1)} />
            <span style={{ display: "flex", alignItems: "baseline", gap: 9, textAlign: "center", minWidth: 0 }}>
              <span style={mono(11, SIG, { letterSpacing: ".1em" })}>{m.n}</span>
              <span style={{ fontFamily: "var(--zy-font-sans)", fontWeight: 600, fontSize: 16, color: ON }}>{m.title}</span>
            </span>
            <Arrow dir={1} onClick={() => go(active + 1)} />
          </div>
        )}

        <p className="zy-body-md" style={{ textAlign: "center", color: MUT, margin: "0 auto clamp(24px, 4vh, 40px)", maxWidth: "52ch", minHeight: "2.8em", lineHeight: 1.5 }}>{m.sub}</p>

        <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 2vw, 22px)" }}>
          {!mobile && <Arrow dir={-1} onClick={() => go(active - 1)} />}
          <div onTouchStart={onTS} onTouchEnd={onTE} style={{ position: "relative", flex: 1, minWidth: 0, minHeight: 540, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div key={active} style={{ width: "100%", maxWidth: 780, margin: "0 auto" }}>
              <ActiveFig />
            </div>
          </div>
          {!mobile && <Arrow dir={1} onClick={() => go(active + 1)} />}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: "clamp(22px, 4vh, 36px)" }}>
          {MOVES.map((mv, i) => (
            <button key={mv.n} onClick={() => go(i)} aria-label={`Go to ${mv.title}`} style={{ width: i === active ? 26 : 8, height: 8, borderRadius: 4, padding: 0, cursor: "pointer", border: "none", background: i === active ? SIG : INK6, boxShadow: i === active ? "0 0 10px rgba(0,224,213,0.5)" : "none" }} />
          ))}
        </div>
      </div>
    </section>
  )
}
