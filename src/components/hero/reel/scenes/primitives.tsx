import type { CSSProperties, ReactNode } from "react"
import { FNT, INK7, SIG, mono } from "./palette"

/** Shared card chrome: header label + status row over a tonal gradient body. */
export function Card2({
  children,
  label,
  status,
  breathe,
  style,
}: {
  children: ReactNode
  label?: string
  status?: ReactNode
  breathe?: boolean
  style?: CSSProperties
}) {
  return (
    <div
      className={breathe ? "uc-breathe" : ""}
      style={{
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: `1px solid var(--zy-ink-600)`,
        borderRadius: 14,
        overflow: "hidden",
        background: `linear-gradient(180deg, var(--zy-ink-800) 0%, rgba(7,19,38,0.6) 100%)`,
        ...style,
      }}
    >
      {label && (
        <div
          style={{
            flex: "0 0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "11px 14px",
            borderBottom: `1px solid ${INK7}`,
          }}
        >
          <span className="zy-data-mono" style={{ fontSize: 10.5, letterSpacing: ".14em", color: breathe ? SIG : FNT }}>
            {label}
          </span>
          {status}
        </div>
      )}
      {children}
    </div>
  )
}

/** Live/idle dot. */
export const Dot = ({ on }: { on: boolean }) => (
  <span
    style={{
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: on ? SIG : FNT,
      boxShadow: on ? "0 0 8px rgba(0,224,213,0.7)" : "none",
      flex: "0 0 auto",
    }}
  />
)

/** Small uppercase section heading inside a card body, optional right value. */
export function Sub({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0 0 8px" }}>
      <span style={mono(9.5, FNT, { letterSpacing: ".1em", textTransform: "uppercase" })}>{children}</span>
      {right ? <span style={mono(10.5, SIG)}>{right}</span> : null}
    </div>
  )
}

/** Auto-scaling sparkline (fills area + line + end dot). */
export function MiniSpark({ data, color = SIG, height = 30 }: { data: number[]; color?: string; height?: number }) {
  const w = 100
  const h = 28
  const lo = Math.min(...data)
  const hi = Math.max(...data)
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - ((v - lo) / (hi - lo || 1)) * h] as const)
  const line = pts.map((p) => p.join(",")).join(" ")
  const last = pts[pts.length - 1]
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: "100%", height, display: "block" }}>
      <polygon points={`0,${h} ${line} ${w},${h}`} fill="rgba(0,224,213,0.10)" />
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth="1.4"
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={last[0]} cy={last[1]} r="2" fill={color} />
    </svg>
  )
}
