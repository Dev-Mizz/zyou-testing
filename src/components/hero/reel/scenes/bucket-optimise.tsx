import { FNT, INK7, MUT, ON, SIG, box, mono } from "./palette"
import { Card2, Dot, MiniSpark, Sub } from "./primitives"
import { Logo } from "./Logo"

const PORTFOLIO = [
  { brand: "Mondelez", sub: "US · snacks", logo: "meta", spend: "$96.2K", watch: true },
  { brand: "Kettl", sub: "UK · tea", logo: "google-ads", spend: "$18.4K" },
  { brand: "Verde", sub: "DE · plants", logo: "meta", spend: "$22.7K" },
  { brand: "Hana", sub: "JP · beauty", logo: "meta", spend: "$31.0K" },
  { brand: "Brava", sub: "BR · activewear", logo: "google-ads", spend: "$14.9K" },
]

const FATIGUE = [1.82, 1.78, 1.66, 1.6, 1.47, 1.36, 1.24, 1.16, 1.1]

export function OptInput() {
  return (
    <Card2 label="AGENCY · PORTFOLIO" status={<span style={mono(10, MUT)}>6 brands</span>}>
      <div style={{ padding: "12px 14px 14px" }}>
        {PORTFOLIO.map((r, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 11,
              padding: "9px 11px",
              borderRadius: 9,
              marginBottom: 7,
              border: `1px solid ${r.watch ? SIG : INK7}`,
              background: r.watch ? "rgba(0,224,213,0.06)" : "rgba(255,255,255,0.012)",
            }}
          >
            <Logo name={r.logo} size={16} />
            <span style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: ON }}>{r.brand}</span>
              <span style={mono(9.5, MUT)}>{r.sub}</span>
            </span>
            <span style={mono(10.5, MUT)}>{r.spend}</span>
            {r.watch ? (
              <span style={mono(9, SIG, { border: `1px solid ${SIG}`, borderRadius: 5, padding: "2px 7px" })}>WATCH</span>
            ) : null}
          </div>
        ))}
      </div>
    </Card2>
  )
}

export function OptOutput() {
  return (
    <Card2
      label="WATCH · ARMED"
      status={
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Dot on />
          <span style={mono(10, SIG)}>Mondelez · Meta</span>
        </span>
      }
    >
      <div style={{ padding: "14px" }}>
        <div style={{ display: "flex", gap: 9, marginBottom: 12 }}>
          {([["CTR drop", "> 30% WoW"], ["Frequency", "> 4.0"], ["Cadence", "Mon 08:00"]] as [string, string][]).map(([k, v], i) => (
            <div key={i} style={{ ...box, flex: 1, padding: "10px 11px" }}>
              <div style={mono(9, FNT, { letterSpacing: ".08em", marginBottom: 6 })}>{k}</div>
              <div style={mono(11.5, ON)}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ ...box, padding: "10px 13px 8px", marginBottom: 12 }}>
          <Sub right="1.10%">CTR · 7-DAY ROLLING · FATIGUE</Sub>
          <MiniSpark data={FATIGUE} />
        </div>
        <p style={mono(10, FNT, { margin: 0, lineHeight: 1.5 })}>
          alerts → email + <span style={{ color: SIG }}>#mondelez-perf</span> · budgets untouched · next run in 5 days
        </p>
      </div>
    </Card2>
  )
}
