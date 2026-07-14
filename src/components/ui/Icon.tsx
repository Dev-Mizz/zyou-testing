import { LuRoute, LuLayers, LuCpu, LuShield, LuWorkflow, LuZap, LuTarget, LuChartColumn, LuPaintbrush, LuLock } from "react-icons/lu"

/* Section glyphs — Lucide via react-icons, names matching the reference. */
const MAP = {
  route: LuRoute,
  layers: LuLayers,
  cpu: LuCpu,
  shield: LuShield,
  workflow: LuWorkflow,
  zap: LuZap,
  target: LuTarget,
  "bar-chart": LuChartColumn,
  paintbrush: LuPaintbrush,
  lock: LuLock,
}

export type IconName = keyof typeof MAP

export function Icon({ name, size = 22, stroke = 1.7 }: { name: IconName; size?: number; stroke?: number }) {
  const C = MAP[name]
  return <C size={size} strokeWidth={stroke} aria-hidden />
}
