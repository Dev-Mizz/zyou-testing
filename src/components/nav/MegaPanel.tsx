import { NavCard } from "./NavCard"
import { HOWITWORKS } from "./nav-data"

/** "How it works" mega panel — full-width sibling of the bar. */
export function MegaPanel({
  open,
  onMouseEnter,
  onNavigate,
  onSeeItLive,
}: {
  open: boolean
  onMouseEnter: () => void
  onNavigate: () => void
  onSeeItLive: () => void
}) {
  return (
    <div className={`zy-sn-panel ${open ? "open" : ""}`} onMouseEnter={onMouseEnter} role="region" aria-label="How it works">
      <div className="zy-sn-mega">
        <div className="zy-sn-mega-grid">
          {HOWITWORKS.map((it) => (
            <NavCard key={it.href} item={it} chipSize={38} onNavigate={onNavigate} />
          ))}
        </div>
        <div className="zy-sn-rail">
          <span>
            <span className="zy-sn-live">
              <span className="zy-sn-dot" />
              <span className="zy-label-mono" style={{ color: "var(--zy-on-dark)" }}>LIVE</span>
            </span>
            <span className="zy-body-sm zy-sn-rail-d">See the system run a real ad account, end to end.</span>
          </span>
          <button type="button" className="zy-sn-cta" onClick={onSeeItLive}>
            See it live
          </button>
        </div>
      </div>
    </div>
  )
}
