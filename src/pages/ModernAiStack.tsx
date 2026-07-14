import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { StackInfographic } from "@/components/stack/StackInfographic"
import { Ledger } from "@/components/stack/Ledger"
import { ScrollWords } from "@/components/motion/ScrollWords"
import { Compare } from "@/components/mas/Compare"
import { BrandLogo } from "@/components/ui/BrandLogo"
import { usePrefersReducedMotion } from "@/hooks/use-motion"
import { CALENDLY } from "@/lib/links"
import { Seo } from "@/components/ui/Seo"
import "@/components/mas/mas.css"

/* ── §2 "why agents fail" cards ── */
const FAILS = [
  {
    h: "It drowns in data.",
    body: (
      <>A raw connector dumps <span className="strong">~90–100K tokens</span> into the agent's context. It runs out of room and starts making mistakes within a couple of prompts.</>
    ),
    icon: (
      <svg className="ic" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="5" y="6" width="22" height="4" rx="1" /><rect x="5" y="13" width="22" height="4" rx="1" /><rect x="5" y="20" width="22" height="4" rx="1" /><path d="M3 27h26" strokeDasharray="2 2" /><path d="M16 23v7M13 28l3 2 3-2" /></svg>
    ),
  },
  {
    h: "It guesses, fails, retries until blocked.",
    body: (
      <>An agent half-remembers hundreds of fields and parameters. There is <span className="strong">no ads library</span> the model was trained on. So it guesses, gets rejected, and retries until the account is rate-limited or flagged.</>
    ),
    icon: (
      <svg className="ic" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M25 9a11 11 0 1 0 2.5 9" /><path d="M25 4v6h-6" /><path d="M14 13l4 3-4 3" /></svg>
    ),
  },
  {
    h: "It silently works with half the data.",
    body: (
      <>A timeout caused <span className="strong">200/500 rows being pulled</span>. But the agent finishes confidently and reports a clean answer. No one can tell which rows went missing.</>
    ),
    icon: (
      <svg className="ic" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="5" y="7" width="22" height="18" rx="2" /><path d="M5 16h13" stroke="currentColor" /><path d="M18 7v18" strokeDasharray="2 2" /></svg>
    ),
  },
]

/* connector chip: BrandLogo + name; `light` renders the mark white (dark-on-dark marks). */
function Chip({ name, label, light }: { name: string; label: string; light?: boolean }) {
  return (
    <div className="cchip">
      <BrandLogo name={name} size={21} color={light ? "#fff" : undefined} />
      <span className="nm">{label}</span>
    </div>
  )
}

function MasErrorDiff() {
  return (
    <div className="mas-err">
      <div className="ide">
        <div className="titlebar">
          <span className="lights"><i /><i /><i /></span>
          <span className="fname">create_adset.py · token expired mid-run</span>
          <span className="run">▶ run</span>
        </div>
        <Compare labelA="raw connector" labelB="Zyou · engine"
          first={
            <div className="cmp-pane raw">
              <div className="term">
                <div className="prompt ln">$ python create_adset.py</div>
                <pre><span className="ln"><span className="k">Message:</span> Call was not successful</span><span className="ln"><span className="k">Method:</span>  GET</span><span className="ln"><span className="k">Path:</span>    https://graph.facebook.com/v23.0/me/</span><span className="ln"><span className="k">Params:</span>  {"{'fields': 'id,name'}"}</span><span className="ln"> </span><span className="ln"><span className="k">Status:</span>  <span className="status">400</span></span><span className="ln"><span className="k">Response:</span></span><span className="ln">  {"{"}</span><span className="ln">    "error": {"{"}</span><span className="ln">      "message": "Got unexpected null",</span><span className="ln">      "type": "OAuthException",</span><span className="ln">      "code": 190,</span><span className="ln">      "fbtrace_id": "AAiPVXeNypq48ztGa30906U"</span><span className="ln">    {"}"}</span><span className="ln">  {"}"}</span></pre>
              </div>
            </div>
          }
          second={
            <div className="cmp-pane zyou">
              <div className="term">
                <div className="prompt ln"><span className="ok">$ python create_adset.py</span></div>
                <pre><span className="ln err">zyou_facebook.core.exceptions.AuthenticationError:</span><span className="ln msg">  Your Facebook access token is invalid or has expired.</span><span className="ln"> </span><span className="ln fix"><span className="lbl">→ Fix:</span> Generate a new token at</span><span className="ln fix">     https://developers.facebook.com/tools/explorer/</span><span className="ln fix">     Required permissions: ads_management, ads_read,</span><span className="ln fix">     pages_read_engagement</span><span className="ln"> </span><span className="ln dim">→ FB Error Code: 190</span><span className="ln dim">→ Trace ID: ArOuKnJhD4dKNpZJa88HCgL</span></pre>
              </div>
            </div>
          }
        />
        <div className="cmp-verdicts">
          <div className="raw"><div className="verdict"><span className="mk">✗</span><span>A status code and a trace ID. <b>What actually broke, and how to fix it? Go dig.</b></span></div></div>
          <div className="zyou"><div className="verdict"><span className="mk">✓</span><span>The exact failure, in plain words, <b>plus the fix and the permissions needed.</b> Resolved in one step.</span></div></div>
        </div>
      </div>
      <p className="ig-explainer">Same expired token, two outcomes. <b>Zyou's core engine turns every platform error into a typed, human-readable failure with the fix attached</b>, so the agent recovers instead of guessing.</p>
    </div>
  )
}

function MasConnectors() {
  return (
    <div className="mas-conn">
      <div className="cgroup">
        <div className="glabel">Ad platforms · spoken in depth</div>
        <div className="crow">
          <Chip name="meta" label="Meta" />
          <Chip name="google-ads" label="Google Ads" />
          <Chip name="amazon" label="Amazon Ads" />
          <Chip name="dv360" label="DV360" />
          <Chip name="ttd" label="The Trade Desk" />
          <Chip name="tiktok" label="TikTok" light />
        </div>
      </div>
      <div className="cgroup">
        <div className="glabel">Analytics · attribution · CRM</div>
        <div className="crow">
          <Chip name="ga4" label="GA4" />
          <Chip name="appsflyer" label="AppsFlyer" light />
          <Chip name="hubspot" label="HubSpot" />
        </div>
      </div>
      <div className="cgroup">
        <div className="glabel">Commerce · SEO · workplace</div>
        <div className="crow">
          <Chip name="shopify" label="Shopify" />
          <Chip name="semrush" label="Semrush" />
          <Chip name="slack" label="Slack" />
          <Chip name="gmail" label="Gmail" />
          <div className="cchip ghost"><span className="nm">+ your SSP / DSP / adex</span></div>
        </div>
      </div>
      <div className="combos">
        <div className="glabel">Combined where it counts</div>
        <div className="combo-row">
          <div className="combo">
            <div className="pair"><BrandLogo name="google-ads" size={22} /><span className="plus">+</span><BrandLogo name="semrush" size={22} /></div>
            <div className="ct"><b>Search + SEO.</b> Paid and organic share one view.</div>
          </div>
          <div className="combo">
            <div className="pair"><BrandLogo name="meta" size={22} /><span className="plus">+</span><BrandLogo name="appsflyer" size={22} color="#fff" /></div>
            <div className="ct"><b>Social + attribution.</b> Spend reconciled to installs.</div>
          </div>
          <div className="combo">
            <div className="pair"><BrandLogo name="shopify" size={22} /><span className="plus">+</span><BrandLogo name="ga4" size={22} /></div>
            <div className="ct"><b>Commerce + analytics.</b> Revenue tied back to channel.</div>
          </div>
        </div>
      </div>
      <p className="connfoot">A new source is <span className="a">a connector, not a rebuild.</span></p>
    </div>
  )
}

function MasPullPush() {
  const reduce = usePrefersReducedMotion()
  const vizRef = useRef<HTMLDivElement>(null)
  const [n, setN] = useState(reduce ? 500 : 0)

  useEffect(() => {
    if (reduce) return
    const el = vizRef.current
    if (!el) return
    let ran = false
    const run = () => {
      if (ran) return
      ran = true
      let v = 0
      const iv = setInterval(() => {
        v += Math.ceil((500 - v) / 10) || 1
        if (v >= 500) {
          v = 500
          clearInterval(iv)
        }
        setN(v)
      }, 45)
    }
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { run(); io.disconnect() } }),
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduce])

  return (
    <div className="mas-pp">
      <div className="tiles">
        <div className="tile">
          <div className="tile-head"><span className="dir">PULL ↓</span><span className="t">Pulled data is optimised</span></div>
          <div className="viz" ref={vizRef}>
            <div className="scan" />
            <div className="rows">
              <div className="rrow" /><div className="rrow" /><div className="rrow" /><div className="rrow" /><div className="rrow" /><div className="rrow" /><div className="rrow" />
            </div>
            <div className="badge"><span>{n}</span> / 500 rows · validated ✓</div>
          </div>
          <p className="cap">The agent asks an exact question; Zyou returns the exact answer: <b>queried, completeness-checked, processed locally.</b> Answers, not data dumps.</p>
          <p className="note">vs a raw pull that quietly returns 200 / 500 (see "why it fails")</p>
        </div>
        <div className="tile">
          <div className="tile-head"><span className="dir">PUSH ↑</span><span className="t">Pushed actions are validated</span></div>
          <div className="viz">
            <div className="checks">
              <div className="ck"><span className="mk">✓</span>type-safe<span className="gate">args checked</span></div>
              <div className="ck"><span className="mk">✓</span>schema-validated<span className="gate">real platform schema</span></div>
              <div className="ck"><span className="mk">✓</span>API success<span className="gate">deterministic call</span></div>
              <div className="ck"><span className="mk">✓</span>governed<span className="gate">within budget &amp; role</span></div>
            </div>
          </div>
          <p className="cap"><b>Zyou makes the platform call, never the agent.</b> Claude supplies the arguments; Zyou validates them against the real schema and executes. Nothing reaches a platform unchecked.</p>
        </div>
      </div>
      <p className="ppfoot">Clean data in. Validated actions out. <span className="a">Nothing the agent isn't supposed to do.</span></p>
    </div>
  )
}

function MasPayload() {
  const reduce = usePrefersReducedMotion()
  const [raw, setRaw] = useState(reduce ? 124 : 0)
  useEffect(() => {
    if (reduce) return
    let c = 0
    const iv = setInterval(() => {
      c += Math.ceil((124 - c) / 12) || 1
      if (c >= 124) {
        c = 124
        clearInterval(iv)
      }
      setRaw(c)
    }, 60)
    return () => clearInterval(iv)
  }, [reduce])

  return (
    <div className="mas-pay">
      <div className="ide">
        <div className="titlebar">
          <span className="lights"><i /><i /><i /></span>
          <span className="fname">create_adset.py · the same ad set, two ways</span>
          <span className="run">▶ run</span>
        </div>
        <Compare height="clamp(320px, 52vh, 420px)" labelA="raw connector" labelB="Zyou · engine"
          first={
            <div className="cmp-pane raw">
            <div className="count">assembling payload… <span>{raw}</span> lines · 40+ fields hand-typed</div>
            <div className="scrollwrap">
              <div className="scrollinner">
                <pre>{`from facebook_business.api import FacebookAdsApi
from facebook_business.adobjects.adaccount import AdAccount
from facebook_business.adobjects.adset import AdSet
from facebook_business.adobjects.targeting import Targeting
import time

APP_ID        = "your_app_id"
APP_SECRET    = "your_app_secret"
ACCESS_TOKEN  = "your_access_token"
AD_ACCOUNT_ID = "act_your_account_id"
CAMPAIGN_ID   = "your_campaign_id"

FacebookAdsApi.init(APP_ID, APP_SECRET, ACCESS_TOKEN)

targeting = {
    Targeting.Field.geo_locations: {
        "countries": ["US"],
        "regions": [{"key": "4081"}],
    },
    Targeting.Field.age_min: 25,
    Targeting.Field.age_max: 55,
    Targeting.Field.genders: [1, 2],
    Targeting.Field.publisher_platforms: ["facebook", "instagram"],
    Targeting.Field.facebook_positions: ["feed", "story"],
    Targeting.Field.instagram_positions: ["stream"],
    Targeting.Field.device_platforms: ["mobile", "desktop"],
    Targeting.Field.flexible_spec: [
        {"interests": [
            {"id": "6003139266461", "name": "Technology"},
            {"id": "6003020834693", "name": "E-commerce"},
        ]},
    ],
}

start_time = int(time.time()) + 3600
end_time   = start_time + (7 * 24 * 3600)

account = AdAccount(AD_ACCOUNT_ID)
params = {
    AdSet.Field.name:              "My Python Ad Set",
    AdSet.Field.campaign_id:       CAMPAIGN_ID,
    AdSet.Field.status:            AdSet.Status.paused,
    AdSet.Field.daily_budget:      5000,
    AdSet.Field.billing_event:     AdSet.BillingEvent.impressions,
    AdSet.Field.optimization_goal: AdSet.OptimizationGoal.reach,
    AdSet.Field.start_time:        start_time,
    AdSet.Field.end_time:          end_time,
    AdSet.Field.targeting:         targeting,
    AdSet.Field.attribution_spec: [
        {"event_type": "CLICK_THROUGH", "window_days": 7},
        {"event_type": "VIEW_THROUGH",  "window_days": 1},
    ],
}

try:
    adset = account.create_ad_set(
        fields=[AdSet.Field.id, AdSet.Field.name],
        params=params,
    )
    print("Ad Set created:", adset[AdSet.Field.id])
except Exception as e:
    print("Error creating Ad Set:", e)`}</pre>
              </div>
            </div>
            </div>
          }
          second={
            <div className="cmp-pane zyou">
            <div className="count"><span>12</span> lines · typed &amp; validated before send</div>
            <div className="staticwrap">
              <pre><span className="ln"><span className="tl">import</span> zyou_facebook</span>{"\n"}<span className="ln"><span className="tl">from</span> zyou_facebook <span className="tl">import</span> Adset</span>{"\n"}<span className="ln"> </span>{"\n"}<span className="ln">zyou_facebook.init(ACCESS_TOKEN, AD_ACCOUNT_ID)</span>{"\n"}<span className="ln">params = <span className="tl">AdsetModel</span>(</span>{"\n"}<span className="ln">    <span className="arg">campaign_id</span>       = campaign_result["campaign_id"],</span>{"\n"}<span className="ln">    <span className="arg">adset_name</span>        = "TRMNL Adset",</span>{"\n"}<span className="ln">    <span className="arg">targeting_params</span>  = targeting_params,</span>{"\n"}<span className="ln">    <span className="arg">conversion_location</span> = ConversionLocation.ON_AD,</span>{"\n"}<span className="ln">    <span className="arg">bid_strategy</span>      = BidStrategy.HIGHEST_VOLUME,</span>{"\n"}<span className="ln">    <span className="arg">is_dynamic_creative</span> = True,</span>{"\n"}<span className="ln">)</span>{"\n"}<span className="ln"> </span>{"\n"}<span className="ln">adset_response = adset_svc.<span className="tl">create_adset</span>(params=params)</span></pre>
            </div>
            </div>
          }
        />
        <div className="cmp-verdicts">
          <div className="raw"><div className="verdict"><span className="mk">✗</span><span>40+ fields, hand-assembled from memory. <b>One wrong key, one stale enum → rejected.</b></span></div></div>
          <div className="zyou"><div className="verdict"><span className="mk">✓</span><span>Named, typed arguments. <b>Zyou validates against the real schema, then ships the call.</b></span></div></div>
        </div>
      </div>
      <p className="ig-explainer">A single campaign change is hundreds of fields against the raw API, every key and enum typed by hand, in the dark. <b>The agent supplies a handful of named arguments; Zyou builds the full payload, validates it against the platform's real schema, and ships it.</b></p>
    </div>
  )
}

/** /modern-ai-stack — the execution layer, deep-dive. */
export function ModernAiStack() {
  return (
    <div className="mas-page">
      <Seo
        title="Modern AI Stack: The Execution Layer for Ad Platforms | Zyou"
        description="The middleware between AI agents and ad platforms like Meta and Google Ads. Zyou governs agents, secures execution, and cuts the cost of running them."
        canonical="https://zyou.ai/modern-ai-stack"
      />
      {/* §1 HERO */}
      <section className="hero">
        <div className="bloom" />
        <div className="shell">
          <div className="hero-grid">
            <div className="hero-text">
              <span className="eyebrow">Modern AI Stack</span>
              <h1>The execution layer for advertising.</h1>
              <p className="lead">The execution layer is the missing last mile, where a decision becomes money spent on Meta, Google, and TikTok. We build it.</p>
            </div>
            <div className="hero-vis">
              <StackInfographic />
              <p className="vis-cap">The execution layer that makes ad agents <b>accurate, optimised and secure.</b></p>
            </div>
          </div>
        </div>
      </section>

      {/* §2 THE MISSING LAYER */}
      <section id="gap" className="divide sec-pad">
        <div className="shell">
          <div className="gap-grid">
            <div>
              <span className="eyebrow">The gap</span>
              <h2 style={{ marginTop: 14 }}>The missing layer of advertising that other industries have.</h2>
              <p className="body" style={{ marginTop: 20 }}>Stripe built it for payments. Twilio for communications. Unity for gaming. Salesforce for customer data. LangChain for agents. <span className="strong">Zyou builds it for advertising</span>, in the agentic era.</p>
            </div>
            <Ledger />
          </div>

          <h3 style={{ marginTop: 64 }}>Why agents fail when pointed at raw platform endpoints.</h3>
          <div className="failgrid">
            {FAILS.map((f) => (
              <div key={f.h} className="fail">
                {f.icon}
                <h4>{f.h}</h4>
                <p>{f.body}</p>
              </div>
            ))}
          </div>

          <MasErrorDiff />
        </div>
      </section>

      {/* §3 THE STACK */}
      <section id="stack" className="divide sec-pad">
        <div className="shell">
          <span className="eyebrow">The answer</span>
          <h2 style={{ marginTop: 14 }}>Not a connector. A stack.</h2>
          <p className="body" style={{ marginTop: 20 }}>Existing connectors are the raw platform with a wrapper. Zyou is the <span className="strong">five layers</span> that make an agent safe and useful on live spend. Your team sees "connectors." What sits underneath is an <span className="strong">invisible execution layer</span>. And that layer is <span className="strong">your moat</span>.</p>

          <h3 style={{ marginTop: 54 }}>What we connect.</h3>
          <p className="body" style={{ marginTop: 12 }}>L1 is more than the places you spend, it's every source that tells you whether the spend worked.</p>

          <MasConnectors />
        </div>
      </section>

      {/* §4 GOVERNED, BOTH WAYS */}
      <section id="control" className="divide sec-pad">
        <div className="shell">
          <span className="eyebrow">Control</span>
          <h2 style={{ marginTop: 14, maxWidth: "24ch" }}>Everything in is optimised. Everything out is validated.</h2>

          <MasPullPush />

          <h3 style={{ marginTop: 56 }}>Your team sets the limits. The system enforces them.</h3>
          <p className="lead" style={{ marginTop: 10 }}>Governance lives in the runtime, not in a policy document.</p>
          <div className="chips">
            <div className="chip"><span className="k">Roles</span><p><b>Every agent acts within its user's permission.</b> A planner can plan; it can't launch.</p></div>
            <div className="chip"><span className="k">Approvals</span><p><b>Actions above a threshold</b> (budget increases, launches, audience changes) stop and route to a human. One click to proceed.</p></div>
            <div className="chip"><span className="k">Audit</span><p><b>Every action logged:</b> what changed, who authorized it, when.</p></div>
          </div>
          <p className="body" style={{ marginTop: 26 }}><span className="strong">The agent cannot self-authorize anything above its scope.</span> That isn't a promise. It's the design.</p>
        </div>
      </section>

      {/* §5 THE DIFFERENCE, MEASURED */}
      <section id="proof" className="divide sec-pad">
        <div className="shell">
          <span className="eyebrow">Proof</span>
          <h2 style={{ marginTop: 14 }}>What Zyou actually buys you.</h2>
          <div className="stats">
            <div className="stat"><div className="v">150 <span className="vs">vs ~4,000</span></div><div className="k">TOKENS per tool description: context spent on the work, not the overhead.</div></div>
            <div className="stat"><div className="v">3–4 <span className="vs">vs 12–18</span></div><div className="k">CALLS to finish a workflow: fewer steps, less cost, less room for error.</div></div>
            <div className="stat"><div className="v">15–20 <span className="vs">vs 2–3</span></div><div className="k">PROMPTS before the agent loses track: finishing a task vs abandoning it.</div></div>
          </div>

          <MasPayload />
        </div>
      </section>

      {/* §6 CAPSTONE */}
      <section id="chat" className="divide capstone">
        <div className="bloom" />
        <div className="shell" style={{ position: "relative", zIndex: 1 }}>
          <ScrollWords
            text="None of this is a product you install. It's a system we build with you, that compounds."
            start={0.92}
            end={0.3}
            lead={0.18}
            window={0.18}
            dim={0.15}
            range={0.82}
          />
          <div className="cap-cta">
            <Link className="cta solid" to="/forge">How we build it with you ↗</Link>
            <a className="cta" href={CALENDLY} target="_blank" rel="noopener noreferrer">Chat with founder</a>
          </div>
        </div>
      </section>
    </div>
  )
}
