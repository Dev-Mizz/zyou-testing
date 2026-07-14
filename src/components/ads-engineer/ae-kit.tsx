/* eslint-disable react-refresh/only-export-components --
   shared AE kit: a couple of components alongside the AEType/AE_EMPH constants. */
import { useEffect, useRef, type CSSProperties } from "react"
import { usePrefersReducedMotion } from "@/hooks/use-motion"

/* Page-local type scale — one shared set of rungs so every section sizes consistently. */
export const AEType = {
  display: "clamp(40px, 6vw, 72px)",
  h1: "clamp(32px, 4.6vw, 52px)",
  h2: "clamp(27px, 3.4vw, 42px)",
  h3: "clamp(21px, 2.6vw, 30px)",
  h4: "clamp(18px, 2vw, 24px)",
  bodyLg: "clamp(17px, 1.7vw, 20px)",
  bodyMd: "clamp(15px, 1.5vw, 18px)",
}
export const AE_EMPH = "#ffffff" // pure-white emphasis tier — key statements only

/* Clean depth stage — fixed, quiet. Ink with a faint volumetric glow + edge vignette. */
export function AEStage() {
  return (
    <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "var(--zy-ink)" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(125% 90% at 50% 32%, rgba(20,46,92,0.40), transparent 58%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(115% 115% at 50% 50%, transparent 52%, rgba(2,6,14,0.92) 100%)" }} />
    </div>
  )
}

/**
 * AEAurora — canvas flowing-ribbon aurora, teal-on-Ink. Many low-alpha teal
 * polylines following drifting sine paths, additively blended. Paints a static
 * first frame, then animates via rAF unless reduced-motion.
 */
export function AEAurora({ style, intensity = 1, band = [0.34, 0.92] }: { style?: CSSProperties; intensity?: number; band?: [number, number] }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduce = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0,
      h = 0
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = Math.max(1, w * dpr)
      canvas.height = Math.max(1, h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    let ro: ResizeObserver | undefined
    if (window.ResizeObserver) {
      ro = new ResizeObserver(resize)
      ro.observe(canvas)
    }
    const cy = (band[0] + band[1]) / 2,
      spread = (band[1] - band[0]) / 2
    const RIB = [
      { yf: cy - spread * 0.5, amp: 0.1, freq: 1.4, speed: 0.05, phase: 0.0 },
      { yf: cy + spread * 0.1, amp: 0.13, freq: 1.1, speed: -0.04, phase: 1.7 },
      { yf: cy + spread * 0.6, amp: 0.09, freq: 1.8, speed: 0.06, phase: 3.1 },
    ]
    const LINES = 22
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = "lighter"
      ctx.lineWidth = 1
      for (const rb of RIB) {
        for (let i = 0; i < LINES; i++) {
          const off = i / (LINES - 1) - 0.5
          ctx.beginPath()
          for (let x = 0; x <= w; x += 9) {
            const nx = x / (w || 1)
            const y = h * rb.yf + Math.sin(nx * Math.PI * rb.freq + t * rb.speed + rb.phase) * h * rb.amp + off * h * 0.085
            if (x === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          const a = 0.065 * intensity * (1 - Math.abs(off) * 1.5)
          if (a > 0) {
            ctx.strokeStyle = `rgba(0,224,213,${a.toFixed(3)})`
            ctx.stroke()
          }
        }
      }
      ctx.globalCompositeOperation = "source-over"
    }
    let raf: number | null = null
    let start: number | null = null
    const loop = (ts: number) => {
      if (start == null) start = ts
      draw((ts - start) / 1000)
      raf = requestAnimationFrame(loop)
    }
    draw(0)
    if (!reduce) raf = requestAnimationFrame(loop)
    return () => {
      if (ro) ro.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduce, intensity, band])

  return <canvas ref={ref} aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", ...style }} />
}
