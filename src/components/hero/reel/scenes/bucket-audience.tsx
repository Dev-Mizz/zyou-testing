import { FNT, INK7, MUT, ON, SIG, box, mono } from "./palette"
import { Card2, Dot, Sub } from "./primitives"
import { Logo } from "./Logo"

const TARGETS = [
  { logo: "meta", name: "Meta Ads", kind: "Custom Audience", matched: "31,200", rate: "76% match", camp: "Glow Bundle · Retargeting" },
  { logo: "google-ads", name: "Google Ads", kind: "Customer Match", matched: "28,900", rate: "70% match", camp: "Glow Bundle · Demand Gen" },
]

export function AudInput() {
  return (
    <Card2 label="SEGMENT · RULE">
      <div style={{ padding: "14px" }}>
        <Sub>INCLUDE</Sub>
        {([["Bought ACV · ≤ 90 days", "52,300"], ["No Glow purchase yet", ""]] as [string, string][]).map(([r, n], i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 11px", ...box, marginBottom: 7 }}>
            <span style={{ width: 6, height: 6, borderRadius: 2, background: SIG }} />
            <span style={{ fontSize: 12.5, color: ON, flex: 1 }}>{r}</span>
            {n ? <span style={mono(11, MUT)}>{n}</span> : null}
          </div>
        ))}
        <Sub>SUPPRESS</Sub>
        {([["Already own Glow", "−11,200"], ["Purchased · ≤ 14 days", "recent"]] as [string, string][]).map(([r, n], i) => (
          <div
            key={i}
            style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 11px", borderRadius: 9, marginBottom: 7, border: `1px solid ${INK7}`, background: "rgba(255,90,90,0.04)" }}
          >
            <span style={{ width: 8, height: 2, background: MUT }} />
            <span style={{ fontSize: 12.5, color: MUT, flex: 1 }}>{r}</span>
            <span style={mono(11, MUT)}>{n}</span>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "baseline", gap: 9, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${INK7}` }}>
          <span style={mono(9.5, FNT, { letterSpacing: ".08em" })}>NET AUDIENCE</span>
          <span style={{ fontSize: 22, fontWeight: 700, color: ON, fontFamily: "var(--zy-font-sans)" }}>41,100</span>
          <span style={mono(10, MUT)}>people</span>
        </div>
      </div>
    </Card2>
  )
}

export function AudOutput() {
  return (
    <Card2
      label="AUDIENCE · SYNCED"
      status={
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Dot on />
          <span style={mono(10, SIG)}>mirrored</span>
        </span>
      }
    >
      <div style={{ padding: "14px" }}>
        {TARGETS.map((t, i) => (
          <div key={i} style={{ ...box, padding: "12px 13px", marginBottom: 9 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <Logo name={t.logo} size={17} />
              <span style={{ fontSize: 13, fontWeight: 600, color: ON, flex: 1 }}>{t.name}</span>
              <span style={mono(10, MUT)}>{t.kind}</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: SIG, fontFamily: "var(--zy-font-sans)" }}>{t.matched}</span>
              <span style={mono(10, MUT)}>matched · {t.rate}</span>
            </div>
            <span style={mono(10.5, MUT)}>{t.camp}</span>
          </div>
        ))}
        <p style={mono(10, FNT, { margin: "4px 0 0", lineHeight: 1.5 })}>drops on Glow purchase within the hour. No PII leaves Zyou</p>
      </div>
    </Card2>
  )
}
