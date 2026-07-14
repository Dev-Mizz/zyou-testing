/* eslint-disable react-refresh/only-export-components --
   shared instrument kit: card/logo/spark components alongside token + helper exports. */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { BrandLogo } from "@/components/ui/BrandLogo"
import { usePrefersReducedMotion } from "@/hooks/use-motion"

/* Shared instrument kit for the "what it does" figures — tokens + card chrome
   lifted from the use-cases §2 language. */
export const SIG = "#00E0D5"
export const INK = "#071326"
export const INK8 = "#0D2245"
export const INK7 = "#102A56"
export const INK6 = "#133267"
export const ON = "rgba(255,255,255,0.90)"
export const MUT = "rgba(255,255,255,0.60)"
export const FNT = "rgba(255,255,255,0.34)"
export const AMBER = "#E8B33A"

export const mono = (size: number, color: string, extra: CSSProperties = {}): CSSProperties => ({ fontFamily: "var(--zy-font-mono)", fontSize: size, color, ...extra })
export const box: CSSProperties = { border: `1px solid ${INK7}`, borderRadius: 9, background: "rgba(255,255,255,0.012)" }

/* platform logo — colour, via the shared BrandLogo (tiktok forced white on dark). */
export function Logo({ name, size = 18, style }: { name: string; size?: number; style?: CSSProperties }) {
  return (
    <span style={{ display: "inline-flex", flex: "0 0 auto", ...style }}>
      <BrandLogo name={name} size={size} color={name === "tiktok" ? "#fff" : undefined} />
    </span>
  )
}

/* card chrome — matches use-cases Card2 */
export function Card({ children, label, status, breathe, style }: { children: ReactNode; label: string; status?: ReactNode; breathe?: boolean; style?: CSSProperties }) {
  return (
    <div
      className={breathe ? "aei-breathe" : ""}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${INK6}`,
        borderRadius: 14,
        overflow: "hidden",
        background: `linear-gradient(180deg, ${INK8} 0%, rgba(7,19,38,0.6) 100%)`,
        ...style,
      }}
    >
      <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 14px", borderBottom: `1px solid ${INK7}` }}>
        <span className="zy-data-mono" style={{ flex: "1 1 0", minWidth: 0, fontSize: 10.5, letterSpacing: ".14em", color: breathe ? SIG : FNT }}>{label}</span>
        <img src="/logos/Lockup_Dark.svg" alt="Zyou" style={{ flex: "0 0 auto", height: 17, width: "auto", display: "block" }} />
        <span style={{ flex: "1 1 0", minWidth: 0, display: "flex", justifyContent: "flex-end" }}>{status}</span>
      </div>
      {children}
    </div>
  )
}

export const dot = (on: boolean, color?: string) => (
  <span style={{ width: 6, height: 6, borderRadius: "50%", background: on ? color || SIG : FNT, boxShadow: on ? `0 0 8px ${color ? color + "99" : "rgba(0,224,213,0.7)"}` : "none", flex: "0 0 auto" }} />
)

export function Badge({ children, color = SIG }: { children: ReactNode; color?: string }) {
  return <span style={mono(9, color, { letterSpacing: ".08em", border: `1px solid ${color}`, borderRadius: 5, padding: "2px 7px", whiteSpace: "nowrap" })}>{children}</span>
}

export function Sub({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0 0 9px" }}>
      <span style={mono(9.5, FNT, { letterSpacing: ".1em", textTransform: "uppercase" })}>{children}</span>
      {right ? <span style={mono(10.5, SIG)}>{right}</span> : null}
    </div>
  )
}

export function Spark({ data, color = SIG, fill = "rgba(0,224,213,0.10)", h = 30 }: { data: number[]; color?: string; fill?: string; h?: number }) {
  const W = 100,
    H = 28,
    lo = Math.min(...data),
    hi = Math.max(...data)
  const pts = data.map((v, i) => [(i / (data.length - 1)) * W, H - ((v - lo) / (hi - lo || 1)) * H])
  const line = pts.map((p) => p.join(",")).join(" ")
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: "100%", height: h, display: "block" }}>
      <polygon points={`0,${H} ${line} ${W},${H}`} fill={fill} />
      <polyline points={line} fill="none" stroke={color} strokeWidth="1.4" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.2" fill={color} />
    </svg>
  )
}

/** Figures go active shortly after mount and loop continuously (scroll/IO is
 *  unreliable in embeds; they loop regardless). Reduced-motion = active at once. */
export function useInView(): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null)
  const [seen, setSeen] = useState(false)
  const reduce = usePrefersReducedMotion()
  useEffect(() => {
    if (reduce) {
      setSeen(true)
      return
    }
    const id = setTimeout(() => setSeen(true), 350)
    return () => clearTimeout(id)
  }, [reduce])
  return [ref, seen]
}
