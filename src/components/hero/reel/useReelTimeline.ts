import { useEffect, useRef, useState } from "react"

export type ReelMode = "broll" | "demo"

const N = 5 // buckets
// per-bucket beat timing (ms): broll → input → claude(typing) → output
const T_BROLL = 1500
const T_INPUT = 1400
const T_CLAUDE = 3000
const T_OUTPUT = 2600
const LOOP = T_BROLL + T_INPUT + T_CLAUDE + T_OUTPUT // 8500
// Cap per-frame virtual advance. After jank / a backgrounded tab, dt can be
// seconds; left unclamped it overshoots LOOP and rapid-fires multiple buckets
// (the "jumps to 05, skipping 02-04" bug). 250ms ≪ smallest keyframe gap (1400),
// so a single stalled frame can never skip a beat. ponytail: clamp, not a fixed timestep.
const MAX_DT = 250

/**
 * One pausable virtual clock driving the reel: advances beats within a bucket,
 * then rolls to the next bucket and loops. `active` gates and resets the timeline;
 * `reduce` freezes it on a calm end-state (output of bucket 0).
 */
export function useReelTimeline(active: boolean, reduce: boolean) {
  const [bucket, setBucket] = useState(0)
  const [mode, setMode] = useState<ReelMode>("broll")
  const [beat, setBeat] = useState(0) // 0 input · 1 claude · 2 output
  const [paused, setPaused] = useState(false)

  const vt = useRef(0) // virtual ms within the current bucket
  const kfi = useRef(0) // next keyframe index
  const last = useRef<number | null>(null)
  const raf = useRef<number | null>(null)

  // active flips → restart clean from bucket 0 / beat 0
  useEffect(() => {
    vt.current = 0
    kfi.current = 0
    last.current = null
    setBucket(0)
    setMode("broll")
    setBeat(0)
    if (!active) setPaused(false)
  }, [active])

  useEffect(() => {
    if (reduce) {
      setMode("demo")
      setBeat(2)
      return
    }
    // Off-screen or paused: don't schedule rAF at all (no idle main-thread churn).
    if (!active || paused) return
    const KF: [number, () => void][] = [
      [0, () => { setMode("broll"); setBeat(0) }],
      [T_BROLL, () => { setMode("demo"); setBeat(0) }],
      [T_BROLL + T_INPUT, () => setBeat(1)],
      [T_BROLL + T_INPUT + T_CLAUDE, () => setBeat(2)],
    ]
    const frame = (ts: number) => {
      if (last.current == null) last.current = ts
      const dt = Math.min(ts - last.current, MAX_DT)
      last.current = ts
      vt.current += dt
      while (kfi.current < KF.length && vt.current >= KF[kfi.current][0]) {
        KF[kfi.current][1]()
        kfi.current++
      }
      if (vt.current >= LOOP) {
        vt.current -= LOOP
        kfi.current = 0
        setBucket((b) => (b + 1) % N)
      }
      raf.current = requestAnimationFrame(frame)
    }
    raf.current = requestAnimationFrame(frame)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
      last.current = null
    }
  }, [reduce, active, paused])

  return { bucket, mode, beat, paused, setPaused }
}
