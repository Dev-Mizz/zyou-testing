import { useEffect, useRef, useState } from "react"
import { usePrefersReducedMotion } from "@/hooks/use-motion"

/* The four engagement beats, with the exact reference icons. */
const BEATS: { lab: string; desc: string; icon: React.ReactNode }[] = [
  {
    lab: "Embed",
    desc: "we sit with your team",
    icon: (
      <svg className="fg-icon" viewBox="0 0 24 24">
        <circle cx="6" cy="19" r="2.4" />
        <circle cx="18" cy="5" r="2.4" />
        <path d="M6 16.5V13a4 4 0 0 1 4-4h4a4 4 0 0 0 4-4" />
      </svg>
    ),
  },
  {
    lab: "Build",
    desc: "ship on real accounts",
    icon: (
      <svg className="fg-icon" viewBox="0 0 24 24">
        <path d="M12 3 3 8l9 5 9-5-9-5Z" />
        <path d="m3 13 9 5 9-5" />
        <path d="m3 18 9 5 9-5" />
      </svg>
    ),
  },
  {
    lab: "Train",
    desc: "your people run it",
    icon: (
      <svg className="fg-icon" viewBox="0 0 24 24">
        <rect x="6" y="6" width="12" height="12" rx="2" />
        <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
        <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
      </svg>
    ),
  },
  {
    lab: "When we leave",
    desc: "the system stays — you own it",
    icon: (
      <svg className="fg-icon" viewBox="0 0 24 24">
        <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
      </svg>
    ),
  },
]

const DUR = 2800
const STEPS = [0, 933, 1867, 2800]

/** Hero engagement spine — plays left→right on enter, replays on re-entry. */
export function ForgeSpine() {
  const ref = useRef<HTMLDivElement>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const reduce = usePrefersReducedMotion()
  const [phase, setPhase] = useState<"idle" | "play" | "done">("idle")
  const [lit, setLit] = useState(0) // how many beats are lit (0..4)

  useEffect(() => {
    if (reduce) {
      setPhase("done")
      setLit(BEATS.length)
      return
    }
    const el = ref.current
    if (!el) return
    let armed = true
    const clear = () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
    const play = () => {
      clear()
      setPhase("idle")
      setLit(0)
      // next frame so the rail-fill transition restarts from 0
      requestAnimationFrame(() => {
        setPhase("play")
        STEPS.forEach((t, i) => timers.current.push(setTimeout(() => setLit(i + 1), t)))
        timers.current.push(setTimeout(() => setPhase("done"), DUR + 150))
      })
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && armed) {
            armed = false
            play()
          } else if (!e.isIntersecting) {
            armed = true
            clear()
            setPhase("idle")
            setLit(0)
          }
        })
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      clear()
    }
  }, [reduce])

  // .play drives the rail fill + dot; .done fades the dot; .lit is the reduced-motion resting state.
  const spineCls = reduce ? "fg-spine lit" : `fg-spine ${phase === "play" ? "play" : phase === "done" ? "play done" : ""}`
  const on = (i: number) => (i < lit ? "on" : "")

  return (
    <div ref={ref} className={spineCls} role="img" aria-label="The engagement, left to right: embed — we sit with your team; build — ship on real accounts; train — your people run it; when we leave, the system stays and you own it.">
      <div className="fg-row fg-row-lab">
        {BEATS.map((b, i) => (
          <span key={b.lab} className={`fg-lab ${on(i)}`} data-i={i}>{b.lab}</span>
        ))}
      </div>
      <div className="fg-row fg-row-ic">
        <span className="fg-rail" aria-hidden="true">
          <span className="fg-rail-fill" />
          <span className="fg-rail-dot" />
        </span>
        {BEATS.map((b, i) => (
          <span key={b.lab} className={`fg-circle ${on(i)}`} data-i={i}>{b.icon}</span>
        ))}
      </div>
      <div className="fg-row fg-row-desc">
        {BEATS.map((b, i) => (
          <span key={b.lab} className={`fg-desc ${on(i)}`} data-i={i}>{b.desc}</span>
        ))}
      </div>
    </div>
  )
}
