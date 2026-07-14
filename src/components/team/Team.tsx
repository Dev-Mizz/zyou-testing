import { useState, type ReactNode } from "react"
import { Reveal } from "@/components/motion/Reveal"
import { Stagger } from "@/components/motion/Stagger"
import { Button } from "@/components/ui/Button"
import { Icon, type IconName } from "@/components/ui/Icon"
import { BrandLogo } from "@/components/ui/BrandLogo"
import { useMediaQuery } from "@/hooks/use-motion"
import { SCENES } from "@/components/hero/reel/scenes"
import { ClaudeScene } from "@/components/hero/reel/scenes/ClaudeScene"

/* §4 Your Team — the one LIGHT band. Three selectable team cards swap a fanned
 * stack of static reel scenes: [INPUT] · [CLAUDE (forward, teal)] · [OUTPUT].
 * Scenes are reused verbatim from the hero reel (sceneIdx into SCENES). */
type TeamDef = { tab: string; icon: IconName; cardSub: string; headline: string; sub: string; sceneIdx: number; connectors: string[] }
const TEAMS: TeamDef[] = [
  {
    tab: "Analytics & Data",
    icon: "bar-chart",
    cardSub: "Five sources, one live view.",
    headline: "Your analysts stop reconciling and start reading.",
    sub: "Meta, Google, TikTok, GA4 and AppsFlyer, reconciled into one live view. Not three exports nobody opens.",
    sceneIdx: 0, // data
    connectors: ["ga4", "appsflyer", "meta", "google-ads", "tiktok"],
  },
  {
    tab: "Media Buying",
    icon: "target",
    cardSub: "Budgets that move daily.",
    headline: "Your buyers optimise while they sleep.",
    sub: "Budgets follow ROAS daily and fatigue is caught on the trend. Performance compounds between standups, not just during them.",
    sceneIdx: 2, // optimise
    connectors: ["meta", "google-ads", "tiktok", "dv360", "amazon"],
  },
  {
    tab: "Ad Operations",
    icon: "workflow",
    cardSub: "Live in under an hour.",
    headline: "Your ad ops ship without the copy-paste mistakes.",
    sub: "A 1,284-line media plan goes live across every platform in under an hour, with naming, UTMs and pacing validated before spend.",
    sceneIdx: 1, // execution
    connectors: ["sheets", "gmail", "slack", "meta", "google-ads"],
  },
]

/* grounding wrapper for a dark card on the light surface */
function CardBox({ children, w, h, teal }: { children: ReactNode; w: number | string; h: number | string; teal?: boolean }) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: teal ? "0 24px 60px rgba(7,19,38,0.32), 0 0 32px rgba(0,224,213,0.20)" : "0 18px 48px rgba(7,19,38,0.22)",
      }}
    >
      {children}
    </div>
  )
}

/* DESKTOP — fanned stack: input tilts left, Claude upright & forward, output tilts right */
function TeamFan({ team }: { team: TeamDef }) {
  const sc = SCENES[team.sceneIdx]
  const W = 272,
    H = 400
  const claude = <ClaudeScene {...sc.claude} typing={false} frozen />
  const cards = [
    { el: sc.input, transform: "translateX(-120px) translateY(30px) rotate(-8.5deg) scale(0.88)", z: 1, delay: "0s", teal: false },
    { el: claude, transform: "translateY(-8px) scale(1.03)", z: 3, delay: "-2.2s", teal: true },
    { el: sc.output, transform: "translateX(120px) translateY(30px) rotate(8.5deg) scale(0.88)", z: 2, delay: "-4.4s", teal: false },
  ]
  return (
    <div style={{ position: "relative", height: 470, display: "flex", alignItems: "center", justifyContent: "center", overflow: "visible" }}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "2%",
          top: "8%",
          width: "96%",
          height: "84%",
          borderRadius: "50%",
          zIndex: 0,
          background: "radial-gradient(ellipse at center, rgba(0,224,213,0.14), rgba(0,224,213,0.04) 46%, transparent 72%)",
          filter: "blur(10px)",
        }}
      />
      {cards.map((c, i) => (
        <div key={i} style={{ position: "absolute", zIndex: c.z, transform: c.transform }}>
          <div className="team-float" style={{ animationDelay: c.delay }}>
            <CardBox w={W} h={H} teal={c.teal}>
              {c.el}
            </CardBox>
          </div>
        </div>
      ))}
    </div>
  )
}

/* MOBILE — Claude card only (the reply is the moment) */
function TeamStack({ team }: { team: TeamDef }) {
  const sc = SCENES[team.sceneIdx]
  const claude = <ClaudeScene {...sc.claude} typing={false} frozen />
  return (
    <div style={{ position: "relative" }}>
      <div aria-hidden="true" style={{ position: "absolute", inset: "-6% -4%", borderRadius: 28, zIndex: 0, background: "radial-gradient(ellipse at center, rgba(0,224,213,0.10), transparent 70%)", filter: "blur(10px)" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <CardBox w="100%" h={420} teal>
          {claude}
        </CardBox>
      </div>
    </div>
  )
}

export function Team() {
  const [active, setActive] = useState(0)
  const team = TEAMS[active]
  const wide = useMediaQuery("(min-width: 1100px)")

  return (
    <section id="team" className="zy-on-light" style={{ background: "var(--zy-surface)", padding: "96px 24px", borderTop: "1px solid var(--zy-border-on-dark)" }}>
      <div style={{ maxWidth: "var(--zy-container)", margin: "0 auto" }}>
        <Reveal>
          <span className="zy-label-mono" style={{ display: "block", marginBottom: 16 }}>YOUR TEAM</span>
          <h2 className="zy-headline-lg" style={{ margin: "0 0 14px" }}>Your team, running on agents.</h2>
          <p className="zy-body-md" style={{ margin: "0 0 24px", color: "var(--zy-on-light-muted)" }}>Pick a team to see how its day changes.</p>
        </Reveal>

        {/* catalogue — three selectable cards */}
        <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 44 }}>
          {TEAMS.map((t, i) => {
            const on = i === active
            return (
              <button
                key={t.tab}
                onClick={() => setActive(i)}
                aria-pressed={on}
                style={{
                  appearance: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  background: on ? "var(--zy-paper)" : "transparent",
                  border: `1px solid ${on ? "var(--zy-on-light)" : "var(--zy-border-on-light)"}`,
                  borderRadius: "var(--zy-radius-lg)",
                  padding: "14px 16px",
                  boxShadow: on ? "0 10px 28px rgba(7,19,38,0.10)" : "none",
                  transform: on ? "translateY(-2px)" : "none",
                  transition: "box-shadow var(--dur-base) var(--ease-standard), transform var(--dur-base) var(--ease-standard), border-color var(--dur-base), background var(--dur-base)",
                  display: "flex",
                  flexDirection: "row",
                  gap: 14,
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    flex: "0 0 auto",
                    width: 44,
                    height: 44,
                    borderRadius: "var(--zy-radius-md)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: on ? "var(--zy-icon-chip-bg)" : "transparent",
                    border: `1px solid ${on ? "var(--zy-icon-chip-border)" : "var(--zy-border-on-light-strong)"}`,
                    color: on ? "var(--zy-icon-chip-fg)" : "var(--zy-on-light)",
                    transition: "background var(--dur-base), color var(--dur-base), border-color var(--dur-base)",
                  }}
                >
                  <Icon name={t.icon} size={22} stroke={1.7} />
                </span>
                <span style={{ minWidth: 0 }}>
                  <span className="zy-ui" style={{ display: "block", color: "var(--zy-on-light)", fontSize: 15, marginBottom: 3 }}>{t.tab}</span>
                  <span className="zy-body-sm" style={{ display: "block", color: "var(--zy-on-light-muted)", fontSize: 13 }}>{t.cardSub}</span>
                </span>
              </button>
            )
          })}
        </Stagger>

        {/* detail — fanned static cards (left) + connectors/headline/CTA (right) */}
        <div style={{ display: "grid", gridTemplateColumns: wide ? "1fr 1fr" : "1fr", gap: 40, alignItems: "center" }}>
          <div>{wide ? <TeamFan key={active} team={team} /> : <TeamStack key={active} team={team} />}</div>

          <Reveal key={active} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <span className="zy-label-mono" style={{ display: "block", marginBottom: 13, color: "var(--zy-on-light-muted)" }}>CONNECTS TO</span>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 18 }}>
                {team.connectors.map((n) => (
                  <BrandLogo key={n} name={n} size={24} />
                ))}
              </div>
            </div>
            <h3 className="zy-headline-sm" style={{ margin: "4px 0 0" }}>{team.headline}</h3>
            <p className="zy-body-md" style={{ margin: 0, color: "var(--zy-on-light-muted)", maxWidth: "46ch" }}>{team.sub}</p>
            <div style={{ marginTop: 6 }}>
              <Button variant="primary" on="light" size="md" href="/use-cases">
                See how your team runs
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
