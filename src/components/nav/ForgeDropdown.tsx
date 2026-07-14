import { NavCard } from "./NavCard"
import { FORGE } from "./nav-data"

/** Forge dropdown column. Visibility is driven by the parent item's `.open`
 *  class (see .zy-sn-item.open .zy-sn-drop in index.css). */
export function ForgeDropdown({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="zy-sn-drop">
      <div className="zy-sn-drop-col">
        {FORGE.map((it) => (
          <NavCard key={it.href} item={it} chipSize={34} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  )
}
