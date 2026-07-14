import { Fragment } from "react"
import { FNT, INK7, MUT, ON, SIG } from "./palette"
import { Card2, Dot } from "./primitives"
import { Logo } from "./Logo"

const B01 = {
  sources: [
    { name: "Meta Ads", logo: "meta" },
    { name: "Google Ads", logo: "google-ads" },
    { name: "TikTok Ads", logo: "tiktok" },
  ],
  truth: { name: "GA4 · CRM", logo: "ga4" },
  kpis: [
    { k: "SPEND", v: "$148.2K", d: "▲ +6%" },
    { k: "BLENDED ROAS", v: "3.42×", d: "▲ +0.31" },
    { k: "BLENDED CAC", v: "$38.50", d: "▽ +4%" },
    { k: "CONVERSIONS", v: "3,847", d: "▲ +11%" },
  ],
  rows: [
    { p: "Meta", logo: "meta", spend: "$82.4K", roas: "3.10×", cac: "$41", conv: "2,010" },
    { p: "Google", logo: "google-ads", spend: "$44.8K", roas: "4.20× ↑", cac: "$33", conv: "1,358", flagRoas: true },
    { p: "TikTok", logo: "tiktok", spend: "$21.0K", roas: "3.00×", cac: "$44", conv: "479", flagCac: true },
  ] as { p: string; logo: string; spend: string; roas: string; cac: string; conv: string; flagRoas?: boolean; flagCac?: boolean }[],
}

const SPARK01 = [3.02, 3.1, 2.94, 3.18, 3.27, 3.36, 3.42]

/** Fixed-scale ROAS sparkline (2.8–3.5 band) used in the unified dashboard. */
function Spark2({ data }: { data: number[] }) {
  const w = 100
  const h = 30
  const min = 2.8
  const max = 3.5
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - ((v - min) / (max - min)) * h] as const)
  const line = pts.map((p) => p.join(",")).join(" ")
  const last = pts[pts.length - 1]
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: "100%", height: 36, display: "block" }}>
      <polygon points={`0,${h} ${line} ${w},${h}`} fill="rgba(0,224,213,0.10)" />
      <polyline points={line} fill="none" stroke={SIG} strokeWidth="1.4" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r="2" fill={SIG} />
    </svg>
  )
}

/** Input: connected platform sources + truth source. */
export function SourcesScene() {
  return (
    <Card2 label="SOURCES · CONNECTED" status={<span className="zy-data-mono" style={{ fontSize: 10, color: MUT }}>read-only</span>}>
      <div style={{ padding: "14px 14px 16px", display: "flex", flexDirection: "column", height: "100%" }}>
        {B01.sources.map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 12px",
              border: `1px solid ${INK7}`,
              borderRadius: 10,
              marginBottom: 9,
              background: "rgba(255,255,255,0.015)",
            }}
          >
            <Logo name={s.logo} size={20} />
            <span style={{ fontSize: 14, fontWeight: 500, color: ON, flex: 1 }}>{s.name}</span>
            <Dot on />
            <span className="zy-data-mono" style={{ fontSize: 11, color: SIG }}>Connected</span>
          </div>
        ))}
        <div style={{ height: 1, background: INK7, margin: "8px 2px 12px" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 12px" }}>
          <Logo name={B01.truth.logo} size={18} />
          <span style={{ fontSize: 13.5, fontWeight: 500, color: MUT, flex: 1 }}>{B01.truth.name}</span>
          <span className="zy-data-mono" style={{ fontSize: 10, color: FNT }}>truth source</span>
        </div>
        <div style={{ flex: 1 }} />
        <p className="zy-data-mono" style={{ margin: "12px 12px 0", fontSize: 10.5, lineHeight: 1.5, color: FNT }}>
          normalized & deduped by Zyou. Claude never reads raw rows.
        </p>
      </div>
    </Card2>
  )
}

/** Output: the unified 7-day dashboard (KPIs + ROAS trend + per-platform table). */
export function DashboardScene() {
  return (
    <Card2
      label="UNIFIED VIEW · LAST 7 DAYS"
      status={
        <span className="zy-data-mono" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: SIG }}>
          <Dot on />
          JUN 1–7 · LIVE
        </span>
      }
    >
      <div style={{ padding: 14, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 11 }}>
          {B01.kpis.map((kp, i) => (
            <div key={i} style={{ border: `1px solid ${INK7}`, borderRadius: 10, padding: "10px 13px", background: "rgba(255,255,255,0.015)" }}>
              <div className="zy-data-mono" style={{ fontSize: 9.5, letterSpacing: ".1em", color: FNT, marginBottom: 6 }}>{kp.k}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 22, fontWeight: 700, color: ON, letterSpacing: "-.01em", fontFamily: "var(--zy-font-sans)" }}>{kp.v}</span>
                <span className="zy-data-mono" style={{ fontSize: 10, color: MUT }}>{kp.d}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ border: `1px solid ${INK7}`, borderRadius: 10, padding: "9px 13px 7px", marginBottom: 11, background: "rgba(255,255,255,0.015)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
            <span className="zy-data-mono" style={{ fontSize: 9.5, letterSpacing: ".1em", color: FNT }}>BLENDED ROAS · 7-DAY</span>
            <span className="zy-data-mono" style={{ fontSize: 10.5, color: SIG }}>3.42×</span>
          </div>
          <Spark2 data={SPARK01} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 0.9fr 0.9fr", gap: "0 6px", alignItems: "center" }}>
          {["PLATFORM", "SPEND", "ROAS", "CAC", "CONV"].map((hh, i) => (
            <span key={i} className="zy-data-mono" style={{ fontSize: 9, letterSpacing: ".07em", color: FNT, textAlign: i ? "right" : "left", paddingBottom: 6 }}>
              {hh}
            </span>
          ))}
          {B01.rows.map((r, i) => {
            const cell = (txt: string, fl?: boolean) => (
              <span className="zy-data-mono" style={{ textAlign: "right", fontSize: 11.5, color: fl ? SIG : ON, fontWeight: fl ? 600 : 400 }}>
                {txt}
              </span>
            )
            return (
              <Fragment key={i}>
                <span style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 0", borderTop: `1px solid ${INK7}` }}>
                  <Logo name={r.logo} size={15} />
                  <span style={{ color: ON, fontWeight: 500, fontSize: 12 }}>{r.p}</span>
                </span>
                <span style={{ borderTop: `1px solid ${INK7}`, padding: "8px 0", textAlign: "right" }}>{cell(r.spend)}</span>
                <span style={{ borderTop: `1px solid ${INK7}`, padding: "8px 0", textAlign: "right" }}>{cell(r.roas, r.flagRoas)}</span>
                <span style={{ borderTop: `1px solid ${INK7}`, padding: "8px 0", textAlign: "right" }}>{cell(r.cac, r.flagCac)}</span>
                <span style={{ borderTop: `1px solid ${INK7}`, padding: "8px 0", textAlign: "right" }}>{cell(r.conv)}</span>
              </Fragment>
            )
          })}
        </div>
        <p className="zy-data-mono" style={{ margin: "10px 0 0", fontSize: 9.5, color: SIG }}>↑ TikTok CAC +24% WoW · flagged</p>
      </div>
    </Card2>
  )
}
