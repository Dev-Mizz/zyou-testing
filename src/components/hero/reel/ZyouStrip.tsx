import { INK6, MUT, SIG } from "./scenes"
import type { ZyouData } from "./scenes"

/** Mobile: thin Zyou strip below the Claude card. */
export function ZyouStrip({ data }: { data: ZyouData }) {
  return (
    <div
      className="uc-breathe"
      style={{
        flex: "0 0 auto",
        border: `1px solid ${INK6}`,
        borderRadius: 10,
        background: `linear-gradient(180deg, var(--zy-ink-800) 0%, rgba(7,19,38,0.6) 100%)`,
        padding: "9px 13px",
        display: "flex",
        alignItems: "center",
        gap: 11,
      }}
    >
      <img src="/logos/Lockup_Dark.svg" alt="Zyou" style={{ height: 15, width: "auto" }} />
      <span className="zy-data-mono" style={{ fontSize: 9.5, color: MUT, flex: 1, lineHeight: 1.3 }}>{data.cap}</span>
      <span style={{ color: SIG, fontWeight: 700, fontSize: 18, textShadow: "0 0 12px rgba(0,224,213,0.55)" }}>{data.num}</span>
    </div>
  )
}
