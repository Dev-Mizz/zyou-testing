import { Link } from "react-router-dom"
import { NavIcon } from "./NavIcon"
import type { NavItem } from "./nav-data"

/** Icon chip + title + description card, shared by the mega panel, the Forge
 *  dropdown, and the mobile sheet. Chip size differs per surface. */
export function NavCard({ item, chipSize = 38, onNavigate }: { item: NavItem; chipSize?: number; onNavigate?: () => void }) {
  return (
    <Link className="zy-sn-card" to={item.href} onClick={onNavigate}>
      <span className="zy-sn-chip" style={{ width: chipSize, height: chipSize }}>
        <NavIcon name={item.icon} size={Math.round(chipSize * 0.5)} />
      </span>
      <span className="zy-sn-card-tx">
        <span className="zy-ui zy-sn-card-t">{item.title}</span>
        <span className="zy-body-sm zy-sn-card-d">{item.desc}</span>
      </span>
    </Link>
  )
}
