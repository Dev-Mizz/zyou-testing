import { useEffect, useState } from "react"
import { usePrefersReducedMotion } from "@/hooks/use-motion"

export type Beat = { at: number; hold: number }

/**
 * Looping "beat" clock for the Ads Engineer instrument figures. Advances to step
 * `idx` at `steps[idx].at` ms, then loops after the last step's at+hold.
 * `active` gates the loop (figures start once in view). Reduced-motion / inactive
 * rests on the final step (everything lit). `steps` must be a stable reference.
 */
export function useBeat(steps: Beat[], active: boolean): number {
  const reduce = usePrefersReducedMotion()
  const [i, setI] = useState(0)

  useEffect(() => {
    if (reduce || !active) {
      setI(reduce ? steps.length - 1 : 0)
      return
    }
    const last = steps[steps.length - 1]
    const total = last.at + last.hold
    let timers: ReturnType<typeof setTimeout>[] = []
    const run = () => {
      timers.forEach(clearTimeout)
      timers = []
      steps.forEach((s, idx) => timers.push(setTimeout(() => setI(idx), s.at)))
      timers.push(setTimeout(run, total))
    }
    run()
    return () => timers.forEach(clearTimeout)
  }, [reduce, active, steps])

  return i
}
