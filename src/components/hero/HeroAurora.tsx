import { useEffect, useRef } from "react"
import { usePrefersReducedMotion } from "@/hooks/use-motion"

type HeroAuroraProps = {
  /** vertical band [top, bottom] as fractions of height the ribbons occupy */
  band?: [number, number]
  intensity?: number
}

/**
 * Canvas flowing-ribbon aurora: low-alpha teal polylines on drifting sine
 * paths, additively blended. Paints a static first frame (visible even where
 * rAF is paused) and honors reduced-motion. Decorative → aria-hidden.
 */
export function HeroAurora({ band = [0.12, 0.74], intensity = 1.5 }: HeroAuroraProps) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduce = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = Math.max(1, w * dpr)
      canvas.height = Math.max(1, h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const cy = (band[0] + band[1]) / 2
    const spread = (band[1] - band[0]) / 2
    const RIB = [
      { yf: cy - spread * 0.55, amp: 0.11, freq: 1.3, speed: 0.035, phase: 0.0 },
      { yf: cy - spread * 0.08, amp: 0.14, freq: 1.0, speed: -0.028, phase: 1.7 },
      { yf: cy + spread * 0.45, amp: 0.10, freq: 1.6, speed: 0.042, phase: 3.1 },
      { yf: cy + spread * 0.9, amp: 0.08, freq: 2.0, speed: -0.05, phase: 4.6 },
    ]
    const LINES = 26

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
          const a = 0.072 * intensity * (1 - Math.abs(off) * 1.5)
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
      ro.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [band, intensity, reduce])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  )
}
