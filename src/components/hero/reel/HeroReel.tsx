import { usePrefersReducedMotion, useMediaQuery } from "@/hooks/use-motion"
import { ClaudeScene } from "./scenes/ClaudeScene"
import { BUCKETS, SCENES, ZYOU } from "./scenes"
import { useReelTimeline } from "./useReelTimeline"
import { ZyouBar } from "./ZyouBar"
import { ZyouStrip } from "./ZyouStrip"
import { Broll } from "./Broll"
import { PauseButton } from "./PauseButton"

const REEL_BG = "#04101f" // reel inner background — a touch darker than --zy-ink

/**
 * Homepage hero reel — stitches the five bucket demos into one loop.
 * Desktop: Input · Claude · Output side-by-side, active card lit per beat,
 * full-width Zyou bar, centred B-roll between buckets.
 * Mobile (<760px): Claude card only + thin Zyou strip. Corner pause/play.
 */
export function HeroReel({ active = true }: { active?: boolean }) {
  const reduce = usePrefersReducedMotion()
  const mobile = useMediaQuery("(max-width: 759px)")
  const { bucket, mode, beat, paused, setPaused } = useReelTimeline(active, reduce)

  const sc = SCENES[bucket]
  const b = BUCKETS[bucket]
  const z = ZYOU[b.key]
  if (!sc) return null

  const claude = <ClaudeScene prompt={sc.claude.prompt} reply={sc.claude.reply} chips={sc.claude.chips} typing={mode === "demo" && beat === 1} />

  if (mobile) {
    return (
      <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", flexDirection: "column", gap: 10, padding: 12, boxSizing: "border-box", background: REEL_BG, textAlign: "left" }}>
        <div style={{ position: "relative", flex: "1 1 auto", minHeight: 0 }}>
          <div style={{ position: "absolute", inset: 0, transform: "scale(0.84)", transformOrigin: "top left", width: "calc(100% / 0.84)", height: "calc(100% / 0.84)" }}>
            {claude}
          </div>
        </div>
        <ZyouStrip data={z} />
        <Broll bucket={b} show={mode === "broll"} />
        {!reduce && <PauseButton paused={paused} onToggle={() => setPaused((p) => !p)} />}
      </div>
    )
  }

  const cards = [sc.input, claude, sc.output]
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", flexDirection: "column", gap: 10, padding: 14, boxSizing: "border-box", background: REEL_BG, textAlign: "left" }}>
      <div style={{ flex: "1 1 auto", minHeight: 0, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "minmax(0, 1fr)", gap: 10 }}>
        {cards.map((c, i) => {
          const lit = mode === "demo" && beat === i
          return (
            <div
              key={i}
              style={{
                position: "relative",
                minHeight: 0,
                height: "100%",
                overflow: "hidden",
                borderRadius: 14,
                opacity: mode === "demo" ? (lit ? 1 : 0.42) : 0.3,
                boxShadow: lit ? `0 0 0 1px var(--zy-signal), 0 0 26px rgba(0,224,213,0.22)` : "none",
                transform: lit ? "translateY(-2px)" : "none",
                transition: "opacity .5s var(--ease-standard), box-shadow .5s, transform .5s",
              }}
            >
              {c}
            </div>
          )
        })}
      </div>
      <ZyouBar data={z} />
      <Broll bucket={b} show={mode === "broll"} />
      {!reduce && <PauseButton paused={paused} onToggle={() => setPaused((p) => !p)} />}
    </div>
  )
}
