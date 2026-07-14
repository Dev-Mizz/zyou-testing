import { useEffect, useRef, type ReactNode } from "react"
import { usePrefersReducedMotion } from "@/hooks/use-motion"
import "./forge.css"

/** Forge page shell: dot-grid backdrop + reduced-motion SVG (SMIL) pause. */
export function ForgeLayout({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = usePrefersReducedMotion()

  // CSS can't stop SMIL — pause it directly when reduced-motion is set (mirrors forge.js).
  useEffect(() => {
    if (!reduce) return
    ref.current?.querySelectorAll("svg").forEach((s) => s.pauseAnimations?.())
  }, [reduce])

  return (
    <div className="fg-page" ref={ref}>
      <div className="fg-grid" />
      {children}
    </div>
  )
}
