import { useEffect, useRef, useState, type RefObject } from "react"

/** Clamp. */
export const clampN = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v))

/** Smoothstep from a→b, Hermite-eased, result in [0,1]. */
export const smooth01 = (a: number, b: number, x: number) => {
  const t = clampN((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/** Cubic ease-in-out. */
export const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

/** Progress 0→1 of an element scrolling through the viewport (top → bottom of its travel). */
export function progressOf(el: HTMLElement): number {
  const rect = el.getBoundingClientRect()
  const vh = window.innerHeight || 800
  const total = el.offsetHeight - vh
  return total > 0 ? clampN(-rect.top / total) : rect.top < vh * 0.55 ? 1 : 0
}

/**
 * Imperative scrub: calls `onUpdate(progress)` on scroll/resize for the element
 * `getEl()` returns, for scenes that drive the DOM/SVG directly via refs.
 * Reduced-motion fires once with `reduceP`. Returns a cleanup fn.
 */
export function scrubScroll(getEl: () => HTMLElement | null, onUpdate: (p: number) => void, reduceP = 1): () => void {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    onUpdate(reduceP)
    return () => {}
  }
  let last = -1
  const run = () => {
    const el = getEl()
    if (!el) return
    const p = progressOf(el)
    if (Math.abs(p - last) > 0.0004) {
      last = p
      onUpdate(p)
    }
  }
  run()
  window.addEventListener("scroll", run, { passive: true })
  window.addEventListener("resize", run)
  return () => {
    window.removeEventListener("scroll", run)
    window.removeEventListener("resize", run)
  }
}

/**
 * Scroll-scrub: returns the [0,1] progress of `ref` through the viewport,
 * rAF-throttled. Reduced-motion pins it at `reduceP` (default 1 = end state).
 */
export function useScrub<T extends HTMLElement>(ref: RefObject<T | null>, reduceP = 1): number {
  const [p, setP] = useState(0)
  const raf = useRef<number | null>(null)
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setP(reduceP)
      return
    }
    const update = () => {
      raf.current = null
      const el = ref.current
      if (el) setP(progressOf(el))
    }
    const onScroll = () => {
      if (raf.current == null) raf.current = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [ref, reduceP])
  return p
}
