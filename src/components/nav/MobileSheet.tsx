import { Link } from "react-router-dom"
import { FORGE, HOWITWORKS } from "./nav-data"
import { NavCard } from "./NavCard"

const LOGO = "/logos/Lockup_Dark.svg"

/** Fullscreen glass menu sheet for < 900px. */
export function MobileSheet({ open, onClose, onChat }: { open: boolean; onClose: () => void; onChat: () => void }) {
  return (
    <div className={`zy-sn-sheet ${open ? "open" : ""}`} role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!open}>
      <div className="zy-sn-sheet-top">
        <img src={LOGO} alt="Zyou" />
        <button type="button" className="zy-sn-close" aria-label="Close menu" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
      <div className="zy-sn-sheet-body">
        <div>
          <div className="zy-label-mono zy-sn-sheet-h">How it works</div>
          <div className="zy-sn-sheet-col">
            {HOWITWORKS.map((it) => (
              <NavCard key={it.href} item={it} chipSize={38} onNavigate={onClose} />
            ))}
          </div>
        </div>
        <div>
          <div className="zy-label-mono zy-sn-sheet-h">Forge</div>
          <div className="zy-sn-sheet-col">
            {FORGE.map((it) => (
              <NavCard key={it.href} item={it} chipSize={38} onNavigate={onClose} />
            ))}
          </div>
        </div>
        <Link className="zy-sn-cta zy-sn-cta--fill zy-sn-cta-full" to="/early-access" onClick={onClose}>
          Early Access
        </Link>
        <button type="button" className="zy-sn-cta zy-sn-cta-full" onClick={onChat}>
          Chat with founder
        </button>
      </div>
    </div>
  )
}
