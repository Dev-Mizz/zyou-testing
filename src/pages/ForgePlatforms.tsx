import { ForgeLayout } from "@/components/forge/ForgeLayout"
import { ForgeHero } from "@/components/forge/ForgeHero"
import { ForgeCapstone } from "@/components/forge/ForgeCapstone"
import { Seo } from "@/components/ui/Seo"

const PRINCIPLES = [
  { h: "Built on your platform", p: "a typed, governed layer over your own APIs, not a wrapper bolted on top." },
  { h: "The control your scale needs", p: "where the work needs a custom surface and granular control, we build it; the agent works underneath, not as the front door." },
  { h: "Yours to own", p: "every automation becomes permanent infrastructure that compounds. Built on your AdTech stack, owned by you, maintained by us." },
]

/** /forge/platforms — AdTech Engineering for media & commerce platforms. */
export function ForgePlatforms() {
  return (
    <ForgeLayout>
      <Seo
        title="Adtech for Media & Commerce Platforms | Zyou"
        description="How Zyou builds the adtech that runs your ad inventory, for media and commerce platforms."
        canonical="https://zyou.ai/forge/platforms"
      />
      <ForgeHero
        eyebrow="Forge · Platforms · AdTech Engineering"
        title="Your inventory is a business. Make it autonomous."
        sub={
          <>
            For retail-media networks, marketplaces, and publishers. The same agentic layer runs <i>your own</i> ad ops and powers the advertising you <i>sell</i> to your partners. Built on your platform, owned by you.
          </>
        }
      />

      {/* P2 THE OPPORTUNITY */}
      <section className="fg-section tight">
        <div className="fg-wrap">
          <p className="fg-eyebrow">The opportunity</p>
          <h2 className="fg-h2 wide">Advantage+ grew ad revenue by removing buying friction. Spend followed. Your retail media has the same opening.</h2>
          <p className="fg-lead">Your platform already has the inventory, the first-party data, and the advertiser demand. What's missing is the layer that lets a partner go from intent to a live, in-stock, on-target campaign without weeks of manual ops. Remove that friction and the spend follows.</p>
        </div>
      </section>

      {/* P3 TWO MOTIONS */}
      <section className="fg-section">
        <div className="fg-wrap">
          <p className="fg-eyebrow">Two motions, one stack</p>
          <h2 className="fg-h2">One core. Two revenue motions.</h2>
          <div className="fg-twoflow">
            <div className="fg-flowcard">
              <div className="k">↓ inward · your ops</div>
              <h3>You buy ads. Automate your own ops.</h3>
              <p>Connect your live inventory to campaign logic: scale what's in stock, suppress what isn't, launch one brief across every market and language on day one.</p>
            </div>
            <div className="fg-core">
              <svg viewBox="0 0 150 130" role="img" aria-label="One core, your adex, with an inward flow (your ops) and an outward flow (partners' ads).">
                <defs>
                  <path id="inpath" d="M6,40 L52,62" />
                  <path id="outpath" d="M98,62 L144,40" />
                </defs>
                <line x1="6" y1="40" x2="52" y2="62" stroke="var(--zy-ink-700)" strokeWidth="1.5" />
                <line x1="98" y1="62" x2="144" y2="40" stroke="rgba(0,224,213,.45)" strokeWidth="2" />
                <text x="14" y="30" fontFamily="var(--zy-font-mono)" fontSize="8" fill="var(--zy-on-dark-faint)" letterSpacing=".06em">YOUR OPS</text>
                <text x="136" y="30" textAnchor="end" fontFamily="var(--zy-font-mono)" fontSize="8" fill="var(--zy-signal)" letterSpacing=".06em">PARTNERS</text>
                <circle cx="75" cy="68" r="24" fill="none" stroke="var(--zy-signal)" strokeWidth="1" opacity="0.4">
                  <animate attributeName="r" values="24;34;24" dur="3.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="3.2s" repeatCount="indefinite" />
                </circle>
                <circle cx="75" cy="68" r="20" fill="var(--zy-ink)" stroke="var(--zy-signal)" strokeWidth="2" style={{ filter: "drop-shadow(0 0 14px rgba(0,224,213,.5))" }} />
                <text x="75" y="65" textAnchor="middle" fontFamily="var(--zy-font-mono)" fontSize="9" fill="var(--zy-signal)">adex</text>
                <text x="75" y="76" textAnchor="middle" fontFamily="var(--zy-font-mono)" fontSize="6.5" fill="var(--zy-on-dark-muted)">your APIs</text>
                <circle r="3" fill="var(--zy-signal)" style={{ filter: "drop-shadow(0 0 6px rgba(0,224,213,.9))" }}>
                  <animateMotion dur="2.2s" repeatCount="indefinite">
                    <mpath href="#inpath" />
                  </animateMotion>
                </circle>
                <circle r="3" fill="var(--zy-signal)" style={{ filter: "drop-shadow(0 0 6px rgba(0,224,213,.9))" }}>
                  <animateMotion dur="2.2s" begin="1.1s" repeatCount="indefinite">
                    <mpath href="#outpath" />
                  </animateMotion>
                </circle>
              </svg>
            </div>
            <div className="fg-flowcard">
              <div className="k">↑ outward · your partners</div>
              <h3>You sell ads. Power your partners.</h3>
              <p>A partner picks product, budget, and zone; the campaign launches. Guardrails set once, run at scale. The self-serve backbone your managed-service team can't staff for.</p>
            </div>
          </div>
        </div>
      </section>

      {/* P4 HOW WE BUILD */}
      <section className="fg-section">
        <div className="fg-wrap">
          <p className="fg-eyebrow">How we build it · AdTech Engineering</p>
          <h2 className="fg-h2 wide">We built the Zyou SDK on Meta and Google. For a platform, we build it on yours.</h2>
          <p className="fg-lead">Your inventory and adex APIs, because that's how an agent acts on your stack safely and the same way every time.</p>
          <div className="fg-prins">
            {PRINCIPLES.map((p) => (
              <div key={p.h} className="fg-prin">
                <h4>{p.h}</h4>
                <p>{p.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* P5 PROOF */}
      <section className="fg-section tight">
        <div className="fg-wrap">
          <p className="fg-proof"><b>Built on real accounts, under real pressure.</b></p>
        </div>
      </section>

      {/* P6 CAPSTONE */}
      <ForgeCapstone>Bring one real problem. We'll build it on your own data.</ForgeCapstone>
    </ForgeLayout>
  )
}
