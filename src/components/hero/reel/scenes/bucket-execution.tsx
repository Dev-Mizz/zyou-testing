import { FNT, INK7, MUT, ON, SIG, box, mono } from "./palette"
import { Card2, Dot } from "./primitives"
import { Logo } from "./Logo"

const PLAN = [
  { camp: "VF8 · Prospecting · US", logo: "meta", daily: "$4,200", flight: "Jul–Sep" },
  { camp: "VF8 · Search · Brand", logo: "google-ads", daily: "$1,800", flight: "Jul–Sep" },
  { camp: "VF6 · Reservations", logo: "meta", daily: "$3,500", flight: "Jul–Aug" },
  { camp: "VF9 · Awareness · CA", logo: "meta", daily: "$2,600", flight: "Jul–Sep" },
  { camp: "VF8 · Search · Non-brand", logo: "google-ads", daily: "$5,400", flight: "Jul–Sep" },
]

const LIVE = [
  { camp: "VF 8 · Prospecting", logo: "meta", detail: "Lookalike 1% · 14 ad sets" },
  { camp: "VF 8 · Search", logo: "google-ads", detail: "Brand + Non-brand · 9 groups" },
  { camp: "VF 6 · Reservations", logo: "meta", detail: "Retargeting · 6 ad sets" },
]

export function ExecInput() {
  return (
    <Card2
      label="SOURCE · MEDIA PLAN"
      status={
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Logo name="sheets" size={13} />
          <span style={mono(10, MUT)}>read-only</span>
        </span>
      }
    >
      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "0 2px 11px" }}>
          <Logo name="sheets" size={16} />
          <span style={{ fontSize: 13.5, fontWeight: 600, color: ON, flex: 1 }}>Q3 Always-On Plan</span>
          <span style={mono(10.5, SIG)}>1,284 rows</span>
        </div>
        <div style={{ ...box, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.7fr 0.5fr 0.8fr 0.8fr", background: "rgba(255,255,255,0.03)", borderBottom: `1px solid ${INK7}` }}>
            {["CAMPAIGN", "PLAT", "DAILY", "FLIGHT"].map((h, i) => (
              <span key={i} style={mono(9, FNT, { letterSpacing: ".07em", padding: "8px 9px", textAlign: i >= 2 ? "right" : "left" })}>
                {h}
              </span>
            ))}
          </div>
          {PLAN.map((r, i) => (
            <div
              key={i}
              style={{ display: "grid", gridTemplateColumns: "1.7fr 0.5fr 0.8fr 0.8fr", alignItems: "center", borderBottom: i < PLAN.length - 1 ? `1px solid ${INK7}` : "none" }}
            >
              <span style={mono(10.5, ON, { padding: "8px 9px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" })}>{r.camp}</span>
              <span style={{ padding: "8px 9px", display: "flex" }}>
                <Logo name={r.logo} size={13} />
              </span>
              <span style={mono(10.5, MUT, { padding: "8px 9px", textAlign: "right" })}>{r.daily}</span>
              <span style={mono(10.5, MUT, { padding: "8px 9px", textAlign: "right" })}>{r.flight}</span>
            </div>
          ))}
        </div>
        <div style={mono(10, FNT, { padding: "9px 4px 0" })}>+ 1,279 more rows</div>
        <p style={mono(10, FNT, { margin: "10px 4px 0", lineHeight: 1.5 })}>
          the plan as the team approved it. Claude builds from this, never edits it.
        </p>
      </div>
    </Card2>
  )
}

export function ExecOutput() {
  return (
    <Card2
      label="LAUNCHED · LIVE"
      status={
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Dot on />
          <span style={mono(10, SIG)}>1,284 live</span>
        </span>
      }
    >
      <div style={{ padding: "14px" }}>
        {LIVE.map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 12px", ...box, marginBottom: 9 }}>
            <Logo name={r.logo} size={18} />
            <span style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: ON }}>{r.camp}</span>
              <span style={mono(10, MUT)}>{r.detail}</span>
            </span>
            <Dot on />
            <span style={mono(10, SIG)}>Live</span>
          </div>
        ))}
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginTop: 12, paddingTop: 12, borderTop: `1px solid ${INK7}` }}>
          {([["23", "naming fixes"], ["6", "UTMs added"], ["100%", "validated"]] as [string, string][]).map(([n, l], i) => (
            <span key={i} style={{ display: "inline-flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 17, fontWeight: 700, color: SIG, fontFamily: "var(--zy-font-sans)" }}>{n}</span>
              <span style={mono(9.5, FNT, { letterSpacing: ".06em" })}>{l}</span>
            </span>
          ))}
        </div>
      </div>
    </Card2>
  )
}
