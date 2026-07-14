export type NavIconName = "cpu" | "target" | "layers" | "zap" | "building"

export type NavItem = {
  icon: NavIconName
  title: string
  desc: string
  href: string
}

/* Copy is fixed (from the reference). hrefs are root-relative — they 404 until
   the corresponding pages/routes exist; swap here when a router is added. */
export const HOWITWORKS: NavItem[] = [
  { icon: "cpu", title: "The Ads Engineer", desc: "The role your team grows into: directing agents, not running campaigns by hand.", href: "/ads-engineer" },
  { icon: "target", title: "Use Cases", desc: "The work your team does by hand, running on its own, by the 5 buckets.", href: "/use-cases" },
  { icon: "layers", title: "Modern AI Stack", desc: "The execution layer beneath the agents: connectors, guardrails, audit.", href: "/modern-ai-stack" },
]

export const FORGE: NavItem[] = [
  { icon: "zap", title: "Forge", desc: "We embed, build, train, and leave the system running.", href: "/forge" },
  { icon: "target", title: "Brands", desc: "One system that makes your spend work harder.", href: "/forge/brands" },
  { icon: "building", title: "Agencies", desc: "2× the clients without 2× the headcount.", href: "/forge/agencies" },
  { icon: "layers", title: "Media & Commerce Platforms", desc: "We build the adtech that runs your inventory.", href: "/forge/platforms" },
]
