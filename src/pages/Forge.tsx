import { Link } from "react-router-dom"
import { ForgeLayout } from "@/components/forge/ForgeLayout"
import { ForgeSpine } from "@/components/forge/ForgeSpine"
import { ForgeCapstone } from "@/components/forge/ForgeCapstone"
import { Seo } from "@/components/ui/Seo"

const TYPES = [
  {
    to: "/forge/brands",
    label: "/forge/brands →",
    h: "Brands",
    p: "your spend lives across more channels than your visibility does.",
    icon: (
      <svg className="fg-icon" viewBox="0 0 24 24">
        <line x1="6" y1="15" x2="6" y2="18" />
        <line x1="12" y1="10" x2="12" y2="18" />
        <line x1="18" y1="6" x2="18" y2="18" />
      </svg>
    ),
  },
  {
    to: "/forge/agencies",
    label: "/forge/agencies →",
    h: "Agencies",
    p: "serve more clients without scaling headcount in step.",
    icon: (
      <svg className="fg-icon" viewBox="0 0 24 24">
        <rect x="4" y="7" width="11" height="11" rx="2" />
        <rect x="9" y="4" width="11" height="11" rx="2" />
      </svg>
    ),
  },
  {
    to: "/forge/platforms",
    label: "/forge/platforms →",
    h: "Media & Commerce Platforms",
    p: "your inventory is a business; we build the adtech that runs it.",
    icon: (
      <svg className="fg-icon" viewBox="0 0 24 24">
        <rect x="4" y="5" width="16" height="4" rx="1" />
        <rect x="4" y="11" width="16" height="4" rx="1" />
        <rect x="4" y="17" width="16" height="3" rx="1" />
      </svg>
    ),
  },
]

/** /forge — the Forge hub. */
export function Forge() {
  return (
    <ForgeLayout>
      <Seo
        title="Forge: AI Agent Engineering for Marketing Teams | Zyou"
        description="Forge is Zyou's forward deployed engineering team. We build and implement AI agents for brands, agencies, and enterprise marketing teams."
        canonical="https://zyou.ai/forge"
      />
      {/* §1 HERO */}
      <header className="fg-hero">
        <div className="fg-aurora" style={{ width: 760, height: 520, left: "50%", top: "14%", transform: "translateX(-50%)" }} />
        <div className="fg-wrap fg-hero-center">
          <p className="fg-eyebrow">Forge</p>
          <h1 className="fg-h1">We embed. We build. We train. When we leave, the system stays.</h1>
          <p className="fg-sub">Forward-deployed AI engineering for advertising. We come inside the building and do it with you, until your team runs it without us.</p>
          <div className="fg-cta-row">
            <a className="fg-btn primary" href="#types">Find where you fit ↓</a>
          </div>
          <ForgeSpine />
        </div>
      </header>

      {/* §2 TWO MODES */}
      <section className="fg-section">
        <div className="fg-wrap">
          <p className="fg-eyebrow">Two modes</p>
          <h2 className="fg-h2 wide">Two modes. Same promise.</h2>
          <div className="fg-modes">
            <div className="fg-mode">
              <div className="k">Demand side · teams that run ads</div>
              <h3>AI Operations</h3>
              <p>For teams that <i>run</i> ads. Your people operate like Ads Engineers on Claude Code and the Zyou stack.</p>
            </div>
            <div className="fg-mode">
              <div className="k">Supply side · platforms that sell inventory</div>
              <h3>AdTech Engineering</h3>
              <p>For platforms that <i>sell</i> ad inventory. We build the adtech your business runs on.</p>
            </div>
          </div>
          <p className="fg-modes-foot">Both: we embed, build, train, and <b>you own everything we leave behind.</b></p>
        </div>
      </section>

      {/* §3 FIND YOUR TEAM */}
      <section className="fg-section" id="types">
        <div className="fg-wrap">
          <p className="fg-eyebrow">Who we work with</p>
          <h2 className="fg-h2">Find where you fit.</h2>
          <div className="fg-types">
            {TYPES.map((t) => (
              <Link key={t.to} className="fg-type" to={t.to}>
                <span className="ic">{t.icon}</span>
                <h3>{t.h}</h3>
                <p>{t.p}</p>
                <span className="go">{t.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* §4 LEADERSHIP — LENS */}
      <section className="fg-section">
        <div className="fg-wrap fg-split">
          <div>
            <p className="fg-eyebrow">Through Lens · output per employee</p>
            <h2 className="fg-h2 wide">You watch the curve move.</h2>
            <p className="fg-sub">The engagement is measured: capacity reclaimed, errors down, throughput up. The outcome you report upward. <b>Lens</b> tracks output per employee, before and after Zyou.</p>
            <p className="fg-quote">“<b>Ops is now AI-native, and here's the proof.</b>”</p>
            <div className="fg-cta-row">
              <Link className="fg-btn" to="/use-cases">See the use cases ↗</Link>
            </div>
          </div>
          <div className="fg-lens">
            <div className="fg-lens-head">
              <span className="dot" />
              <span className="t">LENS · OUTPUT / EMPLOYEE</span>
              <span className="live">LIVE</span>
            </div>
            <div className="fg-lens-body">
              <svg viewBox="0 0 360 200" role="img" aria-label="Output per employee: a flat 'before' baseline rises sharply after Zyou.">
                <defs>
                  <path id="aftercurve" d="M150,132 C 205,120 255,72 334,30" />
                </defs>
                <line x1="22" y1="172" x2="346" y2="172" stroke="var(--zy-border-strong)" />
                <line x1="22" y1="20" x2="22" y2="172" stroke="var(--zy-border-strong)" />
                <g stroke="var(--zy-border-on-dark)" opacity="0.5">
                  <line x1="22" y1="120" x2="346" y2="120" />
                  <line x1="22" y1="70" x2="346" y2="70" />
                </g>
                <line x1="150" y1="20" x2="150" y2="172" stroke="var(--zy-signal)" strokeDasharray="3 5" opacity="0.55" />
                <text x="150" y="14" textAnchor="middle" fontFamily="var(--zy-font-mono)" fontSize="9" letterSpacing="0.1em" fill="var(--zy-signal)">ZYOU</text>
                <text x="14" y="96" textAnchor="middle" fontFamily="var(--zy-font-mono)" fontSize="8.5" letterSpacing="0.06em" fill="var(--zy-on-dark-faint)" transform="rotate(-90,14,96)">OUTPUT / EMPLOYEE</text>
                <path d="M150,132 L334,30 L334,172 L150,172 Z" fill="rgba(0,224,213,0.08)" />
                <polyline points="28,140 88,138 148,134" fill="none" stroke="var(--zy-on-dark-faint)" strokeWidth="2" strokeLinecap="round" />
                <path d="M150,132 C 205,120 255,72 334,30" fill="none" stroke="var(--zy-signal)" strokeWidth="2.5" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 7px rgba(0,224,213,0.55))" }} />
                <circle r="3.5" fill="var(--zy-signal)" style={{ filter: "drop-shadow(0 0 8px rgba(0,224,213,0.95))" }}>
                  <animateMotion dur="3.4s" repeatCount="indefinite">
                    <mpath href="#aftercurve" />
                  </animateMotion>
                </circle>
                <circle cx="334" cy="30" r="4.5" fill="var(--zy-ink)" stroke="var(--zy-signal)" strokeWidth="2">
                  <animate attributeName="r" values="4.5;6.5;4.5" dur="2.6s" repeatCount="indefinite" />
                </circle>
                <g fontFamily="var(--zy-font-mono)" fontSize="9" letterSpacing="0.06em">
                  <text x="70" y="190" textAnchor="middle" fill="var(--zy-on-dark-faint)">BEFORE</text>
                  <text x="250" y="190" textAnchor="middle" fill="var(--zy-signal)">AFTER ZYOU</text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* §5 WHY FORWARD-DEPLOYED */}
      <section className="fg-section">
        <div className="fg-wrap">
          <p className="fg-eyebrow">Why forward-deployed</p>
          <h2 className="fg-strike">Not a <s>deck</s>.<br />Not a <s>tool</s>.<br />Not a <s>dependency</s>.</h2>
          <div className="fg-strike-subs">
            <span>Not a six-month engagement that ends in a slide.</span>
          </div>
          <p className="fg-affirm">Forward-deployed engineering: <b>fixed scope, first ship in weeks, and you own everything we build.</b></p>
        </div>
      </section>

      {/* §6 CAPSTONE */}
      <ForgeCapstone headStyle={{ fontSize: "clamp(28px,3.4vw,42px)" }}>
        Tell us where your team loses the most time. We'll show you what speed looks like.
      </ForgeCapstone>
    </ForgeLayout>
  )
}
