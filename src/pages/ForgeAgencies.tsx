import { ForgeLayout } from "@/components/forge/ForgeLayout"
import { ForgeHero } from "@/components/forge/ForgeHero"
import { ForgeCapstone } from "@/components/forge/ForgeCapstone"
import { Seo } from "@/components/ui/Seo"

const DRAINS = [
  "Pull from 3+ platforms by hand",
  "Reconcile CPL · ROAS · CRM",
  "Catch errors when the client calls",
  "Hire to scale, not compound",
]

const CAPSTACK = [
  {
    h: "Data unification",
    p: "Meta, Google, GA4 normalised into one source of truth, per account.",
    lv: "foundation",
    top: false,
    icon: (
      <svg className="fg-icon" viewBox="0 0 24 24">
        <circle cx="8" cy="8" r="3" />
        <circle cx="16" cy="8" r="3" />
        <path d="M8 11 V14 H16 V11" />
        <line x1="12" y1="14" x2="12" y2="18" />
      </svg>
    ),
  },
  {
    h: "Automated reports",
    p: "client-ready, auto-refreshed, any breakdown in minutes.",
    lv: "·",
    top: false,
    icon: (
      <svg className="fg-icon" viewBox="0 0 24 24">
        <rect x="5" y="4" width="14" height="16" rx="2" />
        <line x1="8" y1="9" x2="16" y2="9" />
        <line x1="8" y1="13" x2="14" y2="13" />
      </svg>
    ),
  },
  {
    h: "Intelligent alerts",
    p: "spend anomalies, CPL drift, zero-delivery, pacing breaches, surfaced to Slack before the client notices.",
    lv: "·",
    top: false,
    icon: (
      <svg className="fg-icon" viewBox="0 0 24 24">
        <path d="M12 4 L21 19 H3 Z" />
        <line x1="12" y1="10" x2="12" y2="14" />
        <line x1="12" y1="16.5" x2="12" y2="16.6" />
      </svg>
    ),
  },
  {
    h: "Agentic workflows",
    p: (
      <>budget reallocation, optimisation, anomaly response that <i>acts</i>, not just surfaces.</>
    ),
    lv: "action",
    top: true,
    icon: (
      <svg className="fg-icon" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 4v3M12 17v3M4 12h3M17 12h3" />
      </svg>
    ),
  },
]

/** /forge/agencies — AI Operations for agencies. */
export function ForgeAgencies() {
  return (
    <ForgeLayout>
      <Seo
        title="AI Agents for Ad Agencies | Zyou Forge"
        description="How Zyou builds AI agents for ad agencies, so you can run more accounts without adding headcount."
        canonical="https://zyou.ai/forge/agencies"
      />
      <ForgeHero
        eyebrow="Forge · Agencies · AI Operations"
        title="Run more accounts than you can staff."
        sub="We embed with your team. We automate what's manual, fragile, or slow. We ship in weeks, not quarters."
      />

      {/* A2 THE SHIFT */}
      <section className="fg-section tight">
        <div className="fg-wrap">
          <h2 className="fg-h2 wide">Every serious marketing org is building an AI operations layer. Most are stuck figuring out how.</h2>
          <p className="fg-lead">Agencies that build a process around AI serve more clients without scaling headcount in step. The operating layer is the moat. The rest hire to keep up.</p>
        </div>
      </section>

      {/* A3 DIAGNOSIS */}
      <section className="fg-section">
        <div className="fg-wrap">
          <p className="fg-eyebrow">The diagnosis</p>
          <h2 className="fg-h2 wide">The expectations changed. The ops model didn't.</h2>
          <div className="fg-metric">
            <div className="big">10–15<small>HOURS / ACCOUNT / WEEK</small></div>
            <div className="txt">lost to data work before any thinking, optimising, or client conversation begins. <b>Multiplied across every retainer.</b> The analyst's week: a third gone to manual pull, reconcile, and error-catching.</div>
          </div>
          <div className="fg-drain">
            {DRAINS.map((d) => (
              <span key={d} className="fg-dchip">{d}</span>
            ))}
          </div>
          <p className="fg-invite">Tell us where we're wrong.</p>
        </div>
      </section>

      {/* A4 CAPABILITY STACK */}
      <section className="fg-section">
        <div className="fg-wrap">
          <p className="fg-eyebrow">Where we start · the capability stack</p>
          <h2 className="fg-h2">A system that compounds, foundation to action.</h2>
          <div className="fg-capstack">
            {CAPSTACK.map((c) => (
              <div key={c.h} className={`fg-caplayer ${c.top ? "top" : ""}`}>
                <span className="ic">{c.icon}</span>
                <div>
                  <h4>{c.h}</h4>
                  <p>{c.p}</p>
                </div>
                <span className="lv">{c.lv}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* A5 PROOF */}
      <section className="fg-section tight">
        <div className="fg-wrap">
          <p className="fg-proof"><b>Built on real accounts, under real pressure.</b></p>
        </div>
      </section>

      {/* A6 CAPSTONE */}
      <ForgeCapstone>Start with a conversation. We'll show you where the hours go back.</ForgeCapstone>
    </ForgeLayout>
  )
}
