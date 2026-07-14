import { useEffect, useRef, useState } from "react"
import { Stagger } from "@/components/motion/Stagger"
import { useMediaQuery } from "@/hooks/use-motion"
import { HeroAurora } from "./HeroAurora"
import { HeroReel } from "./reel/HeroReel"

/**
 * §1 Hero — headline + subheadline fixed above the live infographic reel.
 * A self-contained dark (ink) section so it doesn't depend on the global
 * theme. Soft radial base glow + a masked canvas aurora behind the copy.
 */
export function Hero() {
  const mobile = !useMediaQuery("(min-width: 640px)")
  // Pause the live reel (its rAF + re-renders) whenever it scrolls out of view.
  const reelRef = useRef<HTMLDivElement>(null)
  const [reelVisible, setReelVisible] = useState(true)
  useEffect(() => {
    const el = reelRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setReelVisible(e.isIntersecting), { threshold: 0.01 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <section
      id="top"
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: mobile ? "104px 20px 56px" : "120px 24px 72px",
        boxSizing: "border-box",
        background: "var(--zy-ink)",
        fontFamily: "var(--zy-font-sans)",
      }}
    >
      {/* soft radial base glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "-20% -10% auto -10%",
          height: "70%",
          zIndex: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(60% 70% at 50% 12%, rgba(0,224,213,0.16), transparent 70%), " +
            "radial-gradient(50% 60% at 30% 0%, rgba(0,224,213,0.07), transparent 70%)",
          filter: "blur(120px)",
          opacity: 0.9,
          animation: "zy-aurora-drift 15s var(--ease-standard) infinite",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 1120, margin: "0 auto", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* flowing teal aurora behind only the headline + subheadline, masked to fade at its edges */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -40,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: -1,
            width: "min(1180px, 100vw)",
            height: 320,
            pointerEvents: "none",
            opacity: 0.85,
            WebkitMaskImage: "radial-gradient(72% 80% at 50% 42%, #000 35%, transparent 78%)",
            maskImage: "radial-gradient(72% 80% at 50% 42%, #000 35%, transparent 78%)",
          }}
        >
          {/* canvas aurora is decorative + a per-frame cost; skip it on phones */}
          {!mobile && <HeroAurora />}
        </div>

        <Stagger immediate>
          <h1 className="zy-headline-xl" style={{ margin: "0 auto", whiteSpace: mobile ? "normal" : "nowrap", fontSize: "clamp(28px, 5.4vw, 60px)", lineHeight: 1.08 }}>
            Your AI Team for <span style={{ color: "var(--zy-signal)" }}>Advertising</span>
          </h1>
        </Stagger>
        <p className="zy-headline-sm" style={{ margin: mobile ? "18px auto 0" : "20px auto 0", maxWidth: "52ch", fontSize: mobile ? 18 : undefined }}>
          <span style={{ color: "var(--zy-on-dark)" }}>Your ad team will run on AI. </span>
          <span style={{ color: "#fff" }}>Zyou makes the transition.</span>
        </p>

        {/* live infographic — wide on desktop, taller on mobile so the reel reads */}
        <div
          ref={reelRef}
          style={{
            marginTop: mobile ? 36 : 44,
            width: mobile ? "96vw" : "min(900px, 94vw)",
            aspectRatio: mobile ? "10 / 13" : "16 / 10",
            borderRadius: 10,
            overflow: "hidden",
            border: "1px solid rgba(0,224,213,0.22)",
            boxShadow: "0 0 0 1px rgba(0,224,213,0.18), 0 30px 70px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ width: "100%", height: "100%" }}>
            <HeroReel active={reelVisible} />
          </div>
        </div>

        <p className="zy-data-mono" style={{ margin: "14px auto 0", fontSize: 12, letterSpacing: ".04em", color: "var(--zy-on-dark-muted)", textAlign: "center" }}>
          A live view of how your ads team will work with AI.
        </p>
      </div>
    </section>
  )
}
