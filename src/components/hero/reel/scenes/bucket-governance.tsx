import { FNT, INK7, MUT, ON, SIG, box, mono } from "./palette"
import { Card2, Dot, Sub } from "./primitives"

const ROLES = [
  { r: "Ads Engineer", perm: "build · launch · optimize", tone: "ok" },
  { r: "Planner", perm: "build · propose", tone: "mid" },
  { r: "Analyst", perm: "read-only", tone: "dim" },
  { r: "Client", perm: "read-only · own brand", tone: "dim" },
]

const FEED = [
  { who: "Meera", sub: "Ads Eng · Mondelez", act: "Paused 3 fatigued ad sets", status: "ALLOWED", st2: "", tone: SIG },
  { who: "agent", sub: "Mondelez", act: "+$6K/day → Prospecting", status: "HELD", st2: "needs approval · +25%", tone: "#E8B33A" },
  { who: "Aditya", sub: "Planner · Verde", act: "Launch “Prospecting”", status: "DENIED", st2: "no launch permission", tone: MUT },
  { who: "agent", sub: "Brava", act: "Raise CPA cap 5×", status: "BLOCKED", st2: "hard budget guardrail", tone: MUT },
]

export function GovInput() {
  return (
    <Card2 label="POLICY · GUARDRAILS" status={<span style={mono(10, MUT)}>admin-set</span>}>
      <div style={{ padding: "14px" }}>
        <Sub>ROLES</Sub>
        {ROLES.map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 11px", ...box, marginBottom: 6, opacity: r.tone === "dim" ? 0.55 : 1 }}>
            <span style={{ fontSize: 12.5, fontWeight: 500, color: ON, flex: "0 0 96px" }}>{r.r}</span>
            <span style={mono(10.5, r.tone === "ok" ? SIG : MUT, { flex: 1 })}>{r.perm}</span>
          </div>
        ))}
        <Sub>GUARDS</Sub>
        {([["Budget cap", "per-account · hard"], ["Approval", "> +25% / $5K/day"], ["Brand isolation", "token scoped · 1 brand"]] as [string, string][]).map(([k, v], i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 11px", marginBottom: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: SIG, boxShadow: "0 0 7px rgba(0,224,213,0.6)" }} />
            <span style={{ fontSize: 12, color: ON, flex: "0 0 110px" }}>{k}</span>
            <span style={mono(10.5, MUT, { flex: 1 })}>{v}</span>
          </div>
        ))}
      </div>
    </Card2>
  )
}

export function GovOutput() {
  return (
    <Card2
      label="AUDIT · LEDGER"
      status={
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Dot on />
          <span style={mono(10, SIG)}>live</span>
        </span>
      }
    >
      <div style={{ padding: "12px 14px 14px" }}>
        {FEED.map((f, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 4, padding: "9px 0", borderTop: i ? `1px solid ${INK7}` : "none" }}>
            <span style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
              <span style={{ fontSize: 12.5, color: ON }}>{f.act}</span>
              <span style={mono(9.5, FNT)}>
                {f.who} · {f.sub}
              </span>
            </span>
            <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
              <span style={mono(9.5, f.tone, { letterSpacing: ".08em", border: `1px solid ${f.tone}`, borderRadius: 5, padding: "2px 7px" })}>{f.status}</span>
              {f.st2 ? <span style={mono(9, FNT, { textAlign: "right" })}>{f.st2}</span> : null}
            </span>
          </div>
        ))}
      </div>
    </Card2>
  )
}
