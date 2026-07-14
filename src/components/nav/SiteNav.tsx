import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { CALENDLY, APP_URL } from "@/lib/links"
import { ForgeDropdown } from "./ForgeDropdown"
import { MegaPanel } from "./MegaPanel"
import { MobileSheet } from "./MobileSheet"

const LOGO = "/logos/Lockup_Dark.svg"
type Menu = "how" | "forge" | null

/**
 * Zyou site navigation — floating glass pill with a "How it works" mega panel,
 * a "Forge" dropdown, a glass-teal CTA, and a fullscreen mobile sheet (<900px).
 * Hover opens menus, click toggles; Esc and pointer-leave close. CTAs scroll.
 */
export function SiteNav() {
  const [menu, setMenu] = useState<Menu>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const toggle = (name: Exclude<Menu, null>) => setMenu((cur) => (cur === name ? null : name))

  const seeItLive = () => {
    setMenu(null)
    window.open(APP_URL, "_blank", "noopener,noreferrer")
  }
  const gotoChat = () => {
    setMenu(null)
    setSheetOpen(false)
    window.open(CALENDLY, "_blank", "noopener,noreferrer")
  }

  // Esc closes any open menu / sheet
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(null)
        setSheetOpen(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // lock body scroll while the mobile sheet is open
  useEffect(() => {
    if (!sheetOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [sheetOpen])

  return (
    <header className="zy-sn" onMouseLeave={() => setMenu(null)}>
      <div className="zy-sn-in">
        <div className="zy-sn-bar">
          <Link className="zy-sn-logo" to="/" aria-label="Zyou home">
            <img src={LOGO} alt="Zyou" />
          </Link>

          <nav className="zy-sn-links" aria-label="Primary">
            <div className={`zy-sn-item ${menu === "how" ? "open" : ""}`} onMouseEnter={() => setMenu("how")}>
              <button type="button" className="zy-ui zy-sn-trig" aria-expanded={menu === "how"} aria-haspopup="true" onClick={() => toggle("how")}>
                How it works
                <span className="zy-sn-caret" aria-hidden="true">▼</span>
              </button>
            </div>

            <div className={`zy-sn-item ${menu === "forge" ? "open" : ""}`} onMouseEnter={() => setMenu("forge")}>
              <button type="button" className="zy-ui zy-sn-trig" aria-expanded={menu === "forge"} aria-haspopup="true" onClick={() => toggle("forge")}>
                Forge
                <span className="zy-sn-caret" aria-hidden="true">▼</span>
              </button>
              <ForgeDropdown onNavigate={() => setMenu(null)} />
            </div>
          </nav>

          <div className="zy-sn-actions">
            <Link className="zy-sn-cta zy-sn-cta--fill zy-sn-cta-desktop" to="/early-access" onClick={() => setMenu(null)}>
              Early Access
            </Link>
            <button type="button" className="zy-sn-cta zy-sn-cta-desktop" onClick={gotoChat}>
              Chat with founder
            </button>
            <button type="button" className="zy-sn-burger" aria-label="Open menu" aria-expanded={sheetOpen} onClick={() => setSheetOpen(true)}>
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        <MegaPanel open={menu === "how"} onMouseEnter={() => setMenu("how")} onNavigate={() => setMenu(null)} onSeeItLive={seeItLive} />
      </div>

      <MobileSheet open={sheetOpen} onClose={() => setSheetOpen(false)} onChat={gotoChat} />
    </header>
  )
}
