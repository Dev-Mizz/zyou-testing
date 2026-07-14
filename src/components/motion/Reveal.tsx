import type { ElementType, ReactNode } from "react"
import { useReveal } from "@/hooks/use-motion"

type RevealProps = {
  as?: ElementType
  className?: string
  style?: React.CSSProperties
  immediate?: boolean
  children: ReactNode
}

/** Single reveal block: opacity 0→1 + translateY(20px)→0, once. */
export function Reveal({ as: Tag = "div", className = "", style, immediate = false, children, ...rest }: RevealProps) {
  const [ref, inView] = useReveal<HTMLElement>({ immediate })
  return (
    <Tag ref={ref} className={`zy-reveal ${inView ? "in-view" : ""} ${className}`} style={style} {...rest}>
      {children}
    </Tag>
  )
}
