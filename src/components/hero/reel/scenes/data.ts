import type { Bucket, BucketKey, ClaudeContent, ZyouData } from "./types"

/** The five buckets — canonical content (copy is fixed). */
export const BUCKETS: Bucket[] = [
  {
    n: "01",
    id: "b1",
    key: "data",
    name: "Data Unification",
    full: "Data Unification & Intelligence",
    q: "What is actually happening across all my accounts?",
    h: "One live view your team trusts.",
    work: [
      "Meta, Google and TikTok each report differently. So do GA4, Shopify and your CRM. No single source of truth.",
      "Meta says 4× ROAS but revenue did not move. The workflow reconciles which number is real.",
      "Spend drifts from the media plan all month. The variance surfaces now, not at month-end.",
    ],
    out: "One live view your team trusts, instead of three exports nobody opens.",
    proof: "Claude → platform API calls: 0",
  },
  {
    n: "02",
    id: "b2",
    key: "execution",
    name: "Execution",
    full: "Execution Automation",
    q: "Can we do what we decided, without a human doing it by hand?",
    h: "What we decided actually ships.",
    work: [
      "A media plan in a spreadsheet becomes live campaigns across three platforms in under an hour.",
      "Naming and pixels verified before launch, not discovered wrong after spend.",
      "New-client account structure stood up in hours, the same way every time.",
    ],
    out: "What the team decided actually ships, to the plan, validated before spend.",
    proof: "Validated before launch · 0 unchecked writes",
  },
  {
    n: "03",
    id: "b3",
    key: "optimise",
    name: "Optimise",
    full: "Optimisation Loops",
    q: "Can we improve performance without waiting for a human to notice?",
    h: "Performance compounds between standups.",
    work: [
      "Budget reallocated to top performers daily, by ROAS — winners funded, drains paused.",
      "An ad set runs 2× over target CPA for three days: it pauses itself, and logs why.",
      "Creative fatigue caught on the CTR trend, not after the crash.",
    ],
    out: "Performance compounds between standups, not just during them.",
    proof: "Every move inside guardrails · logged",
  },
  {
    n: "04",
    id: "b4",
    key: "audience",
    name: "Audience",
    full: "Audience Management",
    q: "Are we reaching the right people, and not paying for the wrong ones?",
    h: "Spend lands on the people worth reaching.",
    work: [
      "CRM audiences synced daily, so you stop serving acquisition ads to existing customers.",
      "Lookalikes seeded from your best 20% of converters, not from everyone who ever bought.",
      "Churned and converted users suppressed from acquisition — automatically.",
    ],
    out: "Spend lands on the people worth reaching, and stops chasing the rest.",
    proof: "PII hashed in Zyou · never seen by Claude",
  },
  {
    n: "05",
    id: "b5",
    key: "governance",
    name: "Governance",
    full: "Governance, Audit & Compliance",
    q: "Can we prove what happened, who authorised it, and that no money was wasted?",
    h: "Control your leadership can report on.",
    work: [
      "Spend over a set threshold needs approval before launch — enforced, not on the honour system.",
      "Every change logged: what moved, who authorised it, when.",
      "A campaign spending 5× its cap is caught and paused in minutes, not hours.",
    ],
    out: "Control your leadership can report on, and an audit trail that exists before finance asks.",
    proof: "Approval enforced · full audit ledger",
  },
]

/** Zyou connector data, keyed by bucket. */
export const ZYOU: Record<BucketKey, ZyouData> = {
  data: {
    steps: [["QUERY", "typed"], ["SCAN", "1.28M rows"], ["NORMALIZE", "USD · tz"], ["DEDUPE", "vs GA4+CRM"], ["RETURN", "480 tok"]],
    cap: "Claude → platform API calls",
    num: "0",
  },
  execution: {
    steps: [["VALIDATE", "vs plan"], ["NAMING", "23 fixed"], ["UTMS", "6 added"], ["PACING", "checked"], ["LAUNCH", "1,284 live"]],
    cap: "unchecked writes shipped",
    num: "0",
  },
  optimise: {
    steps: [["SKILL", "fatigue"], ["SCOPE", "act_4471"], ["SCHEDULE", "Mon 08:00"], ["THRESHOLDS", "CTR · freq"], ["ARM", "watch live"]],
    cap: "budgets touched on your behalf",
    num: "0",
  },
  audience: {
    steps: [["BUILD", "CRM + GA4"], ["HYDRATE", "CDP"], ["HASH", "PII"], ["MIRROR", "Meta + Google"], ["SYNC", "hourly"]],
    cap: "raw PII seen by Claude",
    num: "0",
  },
  governance: {
    steps: [["POLICY", "roles"], ["CHECK", "each action"], ["APPROVAL", "> +25%"], ["SCOPE", "1 brand"], ["LOG", "ledger"]],
    cap: "out-of-policy actions allowed",
    num: "0",
  },
}

/* Claude exchange content per bucket (prompt / reply / tool chips). */
export const DATA_CLAUDE: ClaudeContent = {
  prompt:
    "Pull last 7 days across Meta, Google, and TikTok. Give me blended ROAS, spend, and CAC, and flag anything that moved more than 20% week over week.",
  reply:
    "Across all three platforms (Jun 1–7): $148.2K spend, 3.42× blended ROAS, and $38.50 CAC on 3,847 conversions, reconciled against GA4 + CRM.\n\nOne flag: TikTok CAC is up 24% WoW ($35 → $44) while Google ROAS climbed to 4.2×. Worth shifting budget toward Google.",
  chips: [
    ["→ Zyou · metrics.query", "(typed)"],
    ["→ Zyou · reconcile + dedupe", ""],
  ],
}

export const EXEC_CLAUDE: ClaudeContent = {
  prompt:
    "Here's the Q3 always-on plan for VF 6, VF 8 and VF 9 in Sheets. 1,284 line items across Meta and Google. Build them all live exactly as specified: structure, UTMs, budgets, flighting and pacing. Validate everything before anything goes live.",
  reply:
    "All 1,284 line items launched across Meta and Google, exactly per the plan. Naming, UTMs, budgets, flighting and pacing validated against the contract.\n\nZyou auto-corrected 23 naming mismatches and added 6 missing UTMs before launch. Nothing shipped that didn't match.",
  chips: [
    ["→ Zyou · plan.validate", "(typed)"],
    ["→ Zyou · naming + UTMs", ""],
  ],
}

export const OPT_CLAUDE: ClaudeContent = {
  prompt:
    "Watch Mondelez's Meta creative for fatigue. If week-over-week CTR drops more than 30% or frequency passes 4, email me and post to #mondelez-perf, and check every Monday. Don't touch the budgets; just alert me.",
  reply:
    "Done. I pulled the creative-fatigue skill from Zyou and deployed it as a managed service scoped to Mondelez · Meta (act_4471). It runs every Monday 08:00, watching rolling 7-day CTR and frequency against your thresholds.\n\nIt alerts by email and in #mondelez-perf, and never changes budgets without you. Watch armed, next run in 5 days.",
  chips: [
    ["→ Zyou · skill.creativeFatigue", "(typed)"],
    ["→ Zyou · deploy watch", ""],
  ],
}

export const AUD_CLAUDE: ClaudeContent = {
  prompt:
    "Everyone who bought ACV in the last 90 days but hasn't tried Glow: retarget them with the Glow bundle on Meta and Google. The moment someone buys Glow, drop them from the audience everywhere.",
  reply:
    "Done. I built one audience from your CRM and GA4 (bought ACV in the last 90 days, no Glow yet): 41,100 people after dropping the 11,200 who already own it. Zyou hydrated it through the CDP and pushed the same membership to Meta and Google, with the Glow-bundle retargeting live on both.\n\nIt stays in sync: the moment someone buys Glow they fall out of the audience on both platforms within the hour, so you never pay to retarget a customer you've already converted.",
  chips: [
    ["→ Zyou · audience.build", "(typed)"],
    ["→ Zyou · hash + mirror", ""],
  ],
}

export const GOV_CLAUDE: ClaudeContent = {
  prompt:
    "Optimise Mondelez this week: reallocate budget to the winners and pause the drains. Stay inside our policy: anything over +25% or $5K/day needs my sign-off, and don't go near another brand's accounts.",
  reply:
    "Rebalanced Mondelez for the week: shifted spend to the top ad sets by ROAS and paused three fatigued ones, all within policy and logged.\n\nOne change needed you: moving another $6K/day into Prospecting crosses your +25% approval threshold, so I held it for your sign-off rather than pushing it. I'm scoped to Mondelez only; I didn't, and can't, touch another brand's accounts.",
  chips: [
    ["→ Zyou · policy.check", "(typed)"],
    ["→ Zyou · approval gate", ""],
  ],
}
