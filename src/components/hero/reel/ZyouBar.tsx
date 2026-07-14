import { FNT, INK6, INK7, MUT, ON, SIG } from "./scenes"
import type { ZyouData } from "./scenes"

/** Desktop: full-width Zyou connector bar below the 3-up cards. */
export function ZyouBar({ data }: { data: ZyouData }) {
  return (
    <div
      className="uc-breathe"
      style={{
        flex: "0 0 auto",
        border: `1px solid ${INK6}`,
        borderRadius: 12,
        background: `linear-gradient(180deg, var(--zy-ink-800) 0%, rgba(7,19,38,0.6) 100%)`,
        padding: "9px 13px",
        display: "flex",
        alignItems: "center",
        gap: 13,
        flexWrap: "wrap",
        rowGap: 7,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: "0 0 auto", paddingRight: 13, borderRight: `1px solid ${INK7}` }}>
        <img src="/logos/Lockup_Dark.svg" alt="Zyou" style={{ height: 15, width: "auto", display: "block" }} />
        <span className="zy-data-mono" style={{ fontSize: 7.5, letterSpacing: ".05em", color: MUT }}>
          TYPE-SAFE CONNECTOR · done
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap", rowGap: 6, flex: "1 1 auto" }}>
        {data.steps.map(([k, v], j) => (
          <span key={j} style={{ display: "inline-flex", flexDirection: "column", gap: 1 }}>
            <span className="zy-data-mono" style={{ fontSize: 7.5, letterSpacing: ".08em", color: FNT }}>{k}</span>
            <span className="zy-data-mono" style={{ fontSize: 10, color: ON, whiteSpace: "nowrap" }}>
              {v} <span style={{ color: SIG }}>✓</span>
            </span>
          </span>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 9, flex: "0 0 auto", paddingLeft: 13, borderLeft: `1px solid ${INK7}` }}>
        <span className="zy-data-mono" style={{ fontSize: 7.5, letterSpacing: ".05em", color: FNT, textAlign: "right", maxWidth: 92, lineHeight: 1.3 }}>
          {data.cap}
        </span>
        <span style={{ color: SIG, fontWeight: 700, fontSize: 20, textShadow: "0 0 12px rgba(0,224,213,0.55)", lineHeight: 1 }}>{data.num}</span>
      </div>
    </div>
  )
}
