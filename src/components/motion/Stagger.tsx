import { Children, cloneElement, isValidElement } from "react"
import type { CSSProperties, ElementType, ReactNode } from "react"
import { useReveal } from "@/hooks/use-motion"

type StaggerProps = {
  as?: ElementType
  className?: string
  style?: CSSProperties
  immediate?: boolean
  children: ReactNode
}

/** Staggered reveal: children animate in sequence (0.1s each) via --i. */
export function Stagger({ as: Tag = "div", className = "", style, immediate = false, children, ...rest }: StaggerProps) {
  const [ref, inView] = useReveal<HTMLElement>({ immediate })
  return (
    <Tag ref={ref} className={`zy-stagger ${inView ? "in-view" : ""} ${className}`} style={style} {...rest}>
      {Children.toArray(children).map((c, i) =>
        isValidElement<{ style?: CSSProperties }>(c)
          ? cloneElement(c, { style: { ...(c.props.style || {}), ["--i" as string]: i } })
          : c,
      )}
    </Tag>
  )
}
