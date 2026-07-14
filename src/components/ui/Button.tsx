import type { CSSProperties, ReactNode } from "react"
import { cn } from "@/lib/utils"

type ButtonProps = {
  variant?: "primary" | "secondary"
  size?: "md" | "lg"
  /** "light" restyles for light surfaces (Team band) — accent fails on white. */
  on?: "light"
  /** When set, renders an <a>; otherwise a <button>. */
  href?: string
  target?: string
  rel?: string
  onClick?: () => void
  className?: string
  style?: CSSProperties
  children: ReactNode
}

/** Token-driven CTA. Mirrors the reference design-system Button. */
export function Button({ variant = "primary", size = "md", on, href, target, rel, onClick, className, style, children }: ButtonProps) {
  const cls = cn(
    "zy-btn",
    `zy-btn--${variant}`,
    size === "lg" && "zy-btn--lg",
    on === "light" && "zy-btn-on-light",
    className,
  )
  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={cls} style={style}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" className={cls} style={style} onClick={onClick}>
      {children}
    </button>
  )
}
