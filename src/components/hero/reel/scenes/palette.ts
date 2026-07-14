import type { CSSProperties } from "react"

/* Reel palette — the scenes carry their own literals (slightly brighter
   on-dark tiers than the global tokens) so they match the reference exactly. */
export const SIG = "#00E0D5"
export const INK = "#071326"
export const INK8 = "#0D2245"
export const INK7 = "#102A56"
export const INK6 = "#133267"
export const ON = "rgba(255,255,255,0.90)"
export const MUT = "rgba(255,255,255,0.60)"
export const FNT = "rgba(255,255,255,0.34)"

/** Monospace text style helper. */
export const mono = (size: number, color: string, extra: CSSProperties = {}): CSSProperties => ({
  fontFamily: "var(--zy-font-mono)",
  fontSize: size,
  color,
  ...extra,
})

/** Faint hairline-bordered inner box used across input/output cards. */
export const box: CSSProperties = {
  border: `1px solid ${INK7}`,
  borderRadius: 9,
  background: "rgba(255,255,255,0.012)",
}
