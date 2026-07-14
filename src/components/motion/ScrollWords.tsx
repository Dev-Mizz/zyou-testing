import { useEffect, useRef, useState, type CSSProperties, type ElementType } from "react"
import { usePrefersReducedMotion } from "@/hooks/use-motion"

/**
 * Word-by-word scroll illumination — each word lights dim → bright as the scroll
 * "reading cursor" travels left→right. Shared by the homepage capstone,
 * /modern-ai-stack capstone, and the Ads Engineer "Become it" headline.
 *
 * `as` picks the heading tag (default h2). Tunables match the references:
 *   start/end = viewport fractions the head travels between (default .92 → .20)
 *   lead/window = per-word offset + ramp width (default .16 / .16)
 *   dim/range = resting alpha + lit gain (default .13 / .75)
 */
export function ScrollWords({
  text = "",
  as: Tag = "h2" as ElementType,
  className,
  style,
  start = 0.92,
  end = 0.2,
  lead = 0.16,
  window: win = 0.16,
  dim = 0.13,
  range = 0.75,
}: {
  text?: string
  as?: ElementType
  className?: string
  style?: CSSProperties
  start?: number
  end?: number
  lead?: number
  window?: number
  dim?: number
  range?: number
}) {
  const ref = useRef<HTMLHeadingElement>(null)
  const reduce = usePrefersReducedMotion()
  const [p, setP] = useState(0)

  useEffect(() => {
    if (reduce) {
      setP(1)
      return
    }
    const el = ref.current
    if (!el) return
    let raf: number | null = null
    const update = () => {
      raf = null
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight || 800
      const s = vh * start,
        e = vh * end
      setP(Math.max(0, Math.min(1, (s - r.top) / (s - e))))
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
  }, [reduce, start, end])

  const words = text.split(" ")
  const n = words.length
  return (
    <Tag ref={ref} className={className} style={style}>
      {words.map((word, i) => {
        const wordPos = n > 1 ? i / (n - 1) : 0
        const wp = Math.max(0, Math.min(1, (p - wordPos + lead) / win))
        const alpha = (dim + wp * range).toFixed(3)
        return (
          <span key={i}>
            <span style={{ color: `rgba(255,255,255,${alpha})` }}>{word}</span>
            {i < n - 1 ? " " : ""}
          </span>
        )
      })}
    </Tag>
  )
}
