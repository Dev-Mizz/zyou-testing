import { BrandLogo } from "@/components/ui/BrandLogo"

/* Precedent ledger — every category has its execution layer; advertising's is Zyou.
   Shared by the homepage (WhatIs) and /modern-ai-stack §2. */
const PRECEDENT: [string, string, string][] = [
  ["Stripe", "payments", "stripe"],
  ["Twilio", "communications", "twilio"],
  ["Unity", "gaming", "unity"],
  ["Salesforce", "customer data", "salesforce"],
  ["LangChain", "agents", "langchain"],
]

export function Ledger() {
  const row = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 18,
    padding: "11px 18px",
    borderTop: "1px solid var(--zy-ink-700)",
  } as const
  return (
    <div style={{ border: "1px solid var(--zy-ink-700)", borderRadius: "var(--zy-radius-lg)", background: "rgba(255,255,255,.012)", overflow: "hidden", marginTop: 24 }}>
      {PRECEDENT.map(([co, ind, logo], i) => (
        <div key={co} style={{ ...row, borderTop: i === 0 ? "none" : row.borderTop }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 14 }}>
            <span style={{ flex: "0 0 auto", width: 42, height: 26, display: "inline-flex", alignItems: "center", justifyContent: "flex-start" }}>
              <BrandLogo name={logo} size={22} />
            </span>
            <span className="zy-data-mono" style={{ fontSize: 13, color: "var(--zy-on-dark-muted)" }}>
              {co}
            </span>
          </span>
          <span className="zy-data-mono" style={{ fontSize: 11.5, color: "var(--zy-on-dark-faint)", textTransform: "uppercase", letterSpacing: ".06em" }}>
            {ind}
          </span>
        </div>
      ))}
      <div style={{ ...row, background: "rgba(0,224,213,.06)" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 14 }}>
          <span style={{ flex: "0 0 auto", width: 42, display: "inline-flex", alignItems: "center", justifyContent: "flex-start" }}>
            <img src="/logos/Logo_Dark.svg" alt="" style={{ height: 31, width: "auto", display: "block" }} />
          </span>
          <img src="/logos/zyou-wordmark-dark.svg" alt="Zyou" style={{ height: 19, width: "auto", display: "block" }} />
        </span>
        <span className="zy-data-mono" style={{ fontSize: 14, color: "var(--zy-signal)", textTransform: "uppercase", letterSpacing: ".06em" }}>
          advertising
        </span>
      </div>
    </div>
  )
}
