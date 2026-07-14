import { useEffect, useState } from "react"
import { usePrefersReducedMotion } from "@/hooks/use-motion"
import { INK, INK7, INK8, MUT, ON, SIG } from "./palette"
import { Logo } from "./Logo"
import type { ClaudeContent } from "./types"

type ClaudeSceneProps = ClaudeContent & { typing: boolean; frozen?: boolean }

/**
 * The Claude exchange card: user prompt bubble, tool chips, then the reply
 * typed in over ~2.4s while `typing` is true (instant under reduced-motion).
 * `frozen` shows the full reply with no caret (static reuse, e.g. Team).
 */
export function ClaudeScene({ prompt, reply, chips = [], typing, frozen = false }: ClaudeSceneProps) {
  const reduce = usePrefersReducedMotion()
  const [len, setLen] = useState(frozen ? reply.length : 0)

  useEffect(() => {
    if (frozen) {
      setLen(reply.length)
      return
    }
    if (!typing) {
      setLen(0)
      return
    }
    if (reduce) {
      setLen(reply.length)
      return
    }
    let raf = 0
    let t0: number | null = null
    const total = 2400
    const tick = (t: number) => {
      if (t0 == null) t0 = t
      const p = Math.min(1, (t - t0) / total)
      setLen(Math.round(reply.length * p))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [typing, reply, reduce, frozen])

  const shown = reply.slice(0, len)
  const done = len >= reply.length

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        borderRadius: 16,
        padding: 1,
        background: "linear-gradient(180deg, rgba(0,224,213,0.45), rgba(0,224,213,0.12))",
        boxShadow: "0 0 30px rgba(0,224,213,0.16)",
      }}
    >
      <div
        style={{
          height: "100%",
          borderRadius: 15,
          background: `linear-gradient(180deg, ${INK8} 0%, ${INK} 100%)`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flex: "0 0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 9,
            padding: "13px 16px",
            borderBottom: `1px solid ${INK7}`,
          }}
        >
          <Logo name="claude" size={18} />
          <span style={{ fontSize: 14.5, fontWeight: 600, color: "#fff" }}>Claude Code</span>
        </div>

        <div style={{ flex: 1, minHeight: 0, overflow: "hidden", padding: "16px 18px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
            <p
              style={{
                margin: 0,
                maxWidth: "88%",
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${INK7}`,
                borderRadius: "12px 12px 4px 12px",
                padding: "11px 14px",
                fontSize: 13.5,
                lineHeight: 1.5,
                color: ON,
              }}
            >
              {prompt}
            </p>
          </div>

          <div className="zy-data-mono" style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12, fontSize: 11.5 }}>
            {chips.map(([t, sfx], i) => (
              <span key={i} style={{ color: i === chips.length - 1 ? (done ? SIG : MUT) : SIG }}>
                {t}
                {sfx ? <span style={{ color: MUT }}>&nbsp;{sfx}</span> : null}
              </span>
            ))}
          </div>

          <div style={{ flex: 1, minHeight: 0, fontSize: 14, lineHeight: 1.58, color: ON, whiteSpace: "pre-wrap", overflow: "hidden" }}>
            {shown}
            {!done && <span className="uc-caret" />}
          </div>
        </div>
      </div>
    </div>
  )
}
