import { Reveal } from "@/components/motion/Reveal"
import { ScrollWords } from "@/components/motion/ScrollWords"
import { Button } from "@/components/ui/Button"

const CAPSTONE_MANIFESTO = "The shift is here. Cross it with a team that runs it with you."

/**
 * §6 Capstone — the closing line + the single conversion CTA, the exhale.
 */
export function SiteCapstone({ onChat }: { onChat: () => void }) {
  return (
    <section id="capstone" style={{ position: "relative", overflow: "hidden", borderTop: "1px solid var(--zy-border-on-dark)" }}>
      {/* faint vortex exhale bloom behind the capstone line */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "0 0 -10% 0",
          zIndex: 0,
          pointerEvents: "none",
          background: "radial-gradient(46% 55% at 50% 32%, rgba(0,224,213,0.12), transparent 70%)",
          filter: "blur(110px)",
          transformOrigin: "50% 32%",
          animation: "zy-breathe 11s var(--ease-standard) infinite",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <Reveal style={{ maxWidth: 880, margin: "0 auto", textAlign: "center", padding: "120px 24px 110px" }}>
          <ScrollWords text={CAPSTONE_MANIFESTO} className="zy-headline-lg" style={{ margin: "0 auto 36px", maxWidth: "20ch" }} />
          <Button variant="primary" size="lg" onClick={onChat} className="zy-shine" style={{ position: "relative", overflow: "hidden" }}>
            Chat with founder
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
