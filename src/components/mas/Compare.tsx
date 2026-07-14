import { useEffect, useRef, useState, type ReactNode } from "react"
import { usePrefersReducedMotion } from "@/hooks/use-motion"

/**
 * Raw-vs-Zyou comparison.
 * Desktop (≥761px): the design-system reference layout — two static columns side
 * by side (`.cols`/`.col`), reusing the existing mas-err/mas-pay column styles.
 * Mobile (≤760px): an auto-sweeping before/after wipe; the seam follows the finger
 * once grabbed. Reduced-motion → wipe parked at 50%.
 */
export function Compare({
  first,
  second,
  labelA,
  labelB,
  height = "clamp(280px, 44vh, 380px)",
}: {
  first: ReactNode
  second: ReactNode
  labelA: string
  labelB: string
  height?: number | string
}) {
  const wrap = useRef<HTMLDivElement>(null)
  const drag = useRef(false)
  const [p, setP] = useState(50)
  const [auto, setAuto] = useState(true)
  const reduce = usePrefersReducedMotion()
  // Default false → SSR + desktop get the static split; mobile flips to the wipe.
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)")
    const on = () => setMobile(mq.matches)
    on()
    mq.addEventListener("change", on)
    return () => mq.removeEventListener("change", on)
  }, [])

  useEffect(() => {
    if (mobile === false || !auto || reduce) return
    let raf = 0
    let t0 = 0
    const DUR = 9000 // slow, full end-to-end sweep
    const loop = (t: number) => {
      if (!t0) t0 = t
      const ph = ((t - t0) % DUR) / DUR
      const tri = ph < 0.5 ? ph * 2 : 2 - ph * 2 // 0→1→0
      const e = tri < 0.5 ? 2 * tri * tri : 1 - Math.pow(-2 * tri + 2, 2) / 2 // ease — lingers fully open at each end
      setP(e * 100) // 0 = only Zyou, 100 = only raw
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [mobile, auto, reduce])

  // DESKTOP — static side-by-side, exactly the reference's two-column shape.
  if (!mobile) {
    return (
      <div className="cols">
        <div className="col raw">
          <div className="col-head"><span className="badge">{labelA}</span></div>
          {first}
        </div>
        <div className="col zyou">
          <div className="col-head"><span className="badge">{labelB}</span></div>
          {second}
        </div>
      </div>
    )
  }

  // MOBILE — before/after wipe.
  const move = (x: number) => {
    const el = wrap.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setP(Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100)))
  }

  const inset = `inset(0 ${(100 - p).toFixed(2)}% 0 0)`
  return (
    <div
      ref={wrap}
      className="mas-cmp"
      style={{ position: "relative", height, overflow: "hidden", cursor: "ew-resize", userSelect: "none", touchAction: "pan-y" }}
      onPointerDown={() => {
        setAuto(false)
        drag.current = true
      }}
      onPointerMove={(e) => drag.current && move(e.clientX)}
      onPointerUp={() => (drag.current = false)}
      onPointerCancel={() => (drag.current = false)}
      onPointerLeave={() => (drag.current = false)}
    >
      <div className="cmp-layer">{second}</div>
      <div className="cmp-layer" style={{ clipPath: inset, WebkitClipPath: inset }}>
        {first}
      </div>
      {/* one label at a time, flipping at the midpoint — past 50% raw dominates, below it Zyou does */}
      <span className="mas-cmp-tag a" style={{ opacity: p >= 50 ? 1 : 0 }}>{labelA}</span>
      <span className="mas-cmp-tag b" style={{ opacity: p < 50 ? 1 : 0 }}>{labelB}</span>
      <div className="mas-cmp-seam" style={{ left: `${p}%` }}>
        <span className="mas-cmp-grip" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 9h15M16 6l3 3-3 3" />
            <path d="M20 15H5M8 12l-3 3 3 3" />
          </svg>
        </span>
      </div>
    </div>
  )
}
