import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"

const LOCKUP = "/logos/Lockup_Dark.svg"
const LK_BASE = "#28436e" // resting navy hairline
const LK_SETTLED = "rgba(0,224,213,0.22)" // soft-lit teal after the sweep
const NS = "http://www.w3.org/2000/svg"

/* Footer columns mirror the site nav 1:1 (internal routes → <Link>). */
const COLUMNS: { h: string; links: [string, string][] }[] = [
  {
    h: "How it works",
    links: [
      ["The Ads Engineer", "/ads-engineer"],
      ["Use Cases", "/use-cases"],
      ["Modern AI Stack", "/modern-ai-stack"],
    ],
  },
  {
    h: "Forge",
    links: [
      ["Forge", "/forge"],
      ["Brands", "/forge/brands"],
      ["Agencies", "/forge/agencies"],
      ["Media & Commerce Platforms", "/forge/platforms"],
    ],
  },
]

const SOCIALS: [string, string, string][] = [
  ["LinkedIn", "#", "M4.98 3.5C4.98 4.88 3.87 6 2.49 6 1.12 6 0 4.88 0 3.5 0 2.12 1.12 1 2.49 1 3.87 1 4.98 2.12 4.98 3.5zM.22 8h4.55V24H.22V8zm7.5 0h4.36v2.19h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 6.99V24h-4.55v-7.09c0-1.69-.03-3.87-2.36-3.87-2.36 0-2.72 1.84-2.72 3.74V24H7.72V8z"],
  ["X", "#", "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"],
  ["YouTube", "#", "M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.08 0 12 0 12s0 3.92.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"],
]

const LEGAL: [string, string][] = [
  ["Privacy Policy", "/privacy-policy"],
  ["Terms of Service", "/terms-of-use"],
]

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

/**
 * Site-wide footer (mirrors the reference site-footer.js): nav-mirrored link
 * columns, socials, legal, and the giant hairline ZYOU lockup that lights
 * left→right once on entry. Sits below each page's own capstone.
 */
export function SiteFooter() {
  const hostRef = useRef<HTMLDivElement>(null)

  // Giant hairline lockup + one-time left→right teal sweep (ported from site-footer.js).
  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

    const fallbackImg = () => {
      host.innerHTML =
        `<img src="${LOCKUP}" alt="Zyou" style="width:100%;height:100%;object-fit:contain;` +
        `filter:drop-shadow(0 0 10px rgba(0,224,213,0.12));">`
    }

    let raf: number | null = null
    let io: IntersectionObserver | null = null
    let cancelled = false

    fetch(LOCKUP)
      .then((r) => r.text())
      .then((txt) => {
        if (cancelled) return
        host.innerHTML = txt
        const svg = host.querySelector("svg")
        const path = svg?.querySelector("path")
        const g = svg?.querySelector("g")
        if (!svg || !path) {
          fallbackImg()
          return
        }

        svg.removeAttribute("width")
        svg.removeAttribute("height")
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet")
        if (g) {
          g.setAttribute("fill", "none")
          g.removeAttribute("stroke")
        }
        path.setAttribute("fill", "none")
        path.setAttribute("vector-effect", "non-scaling-stroke")
        path.setAttribute("stroke-width", "2.4")
        path.setAttribute("stroke-linejoin", "round")
        path.setAttribute("stroke-linecap", "round")

        const defs = document.createElementNS(NS, "defs")
        const grad = document.createElementNS(NS, "linearGradient")
        grad.setAttribute("id", "zy-sf-sweep")
        grad.setAttribute("gradientUnits", "objectBoundingBox")
        grad.setAttribute("x1", "0")
        grad.setAttribute("y1", "0")
        grad.setAttribute("x2", "1")
        grad.setAttribute("y2", "0")
        grad.setAttribute("spreadMethod", "pad")
        ;([
          ["0", LK_BASE],
          ["0.40", "#34567f"],
          ["0.47", "#2fb8c4"],
          ["0.50", "#bafffb"],
          ["0.53", "#2fb8c4"],
          ["0.60", "#34567f"],
          ["1", LK_BASE],
        ] as [string, string][]).forEach(([offset, color]) => {
          const s = document.createElementNS(NS, "stop")
          s.setAttribute("offset", offset)
          s.setAttribute("stop-color", color)
          grad.appendChild(s)
        })
        defs.appendChild(grad)
        svg.insertBefore(defs, svg.firstChild)

        if (reduce) {
          path.setAttribute("stroke", LK_SETTLED)
          svg.style.filter = "drop-shadow(0 0 10px rgba(0,224,213,0.12))"
          return
        }

        path.setAttribute("stroke", "url(#zy-sf-sweep)")
        grad.setAttribute("gradientTransform", "translate(-0.6,0)")
        svg.style.filter = "drop-shadow(0 0 6px rgba(0,224,213,0.04))"

        const DUR = 1500
        let armed = true
        const run = () => {
          const t0 = performance.now()
          const step = (now: number) => {
            const p = Math.min(1, (now - t0) / DUR)
            const e = easeInOut(p)
            grad.setAttribute("gradientTransform", `translate(${(-0.6 + e * 1.22).toFixed(4)},0)`)
            const bell = Math.sin(Math.PI * p)
            const a = (0.05 + bell * 0.42).toFixed(3)
            const blur = (8 + bell * 18).toFixed(1)
            svg.style.filter = `drop-shadow(0 0 ${blur}px rgba(0,224,213,${a}))`
            if (p < 1) {
              raf = requestAnimationFrame(step)
            } else {
              path.setAttribute("stroke", LK_SETTLED)
              svg.style.filter = "drop-shadow(0 0 10px rgba(0,224,213,0.12))"
            }
          }
          raf = requestAnimationFrame(step)
        }

        if (!("IntersectionObserver" in window)) {
          run()
          return
        }
        io = new IntersectionObserver(
          (entries) => {
            entries.forEach((en) => {
              if (en.isIntersecting && en.intersectionRatio > 0.35 && armed) {
                armed = false
                run()
              } else if (en.intersectionRatio === 0) {
                armed = true
                if (raf) {
                  cancelAnimationFrame(raf)
                  raf = null
                }
                path.setAttribute("stroke", "url(#zy-sf-sweep)")
                grad.setAttribute("gradientTransform", "translate(-0.6,0)")
                svg.style.filter = "drop-shadow(0 0 6px rgba(0,224,213,0.04))"
              }
            })
          },
          { threshold: [0, 0.35] },
        )
        io.observe(host)
      })
      .catch(fallbackImg)

    return () => {
      cancelled = true
      if (raf) cancelAnimationFrame(raf)
      if (io) io.disconnect()
    }
  }, [])

  return (
    <footer className="zy-sf">
      <div className="zy-sf-in">
        <div className="zy-sf-top">
          <div className="zy-sf-cols">
            {COLUMNS.map((c) => (
              <div key={c.h} className="zy-sf-col">
                <span className="zy-label-mono zy-sf-h">{c.h}</span>
                <nav className="zy-sf-nav">
                  {c.links.map(([label, to]) => (
                    <Link key={to} className="zy-body-sm zy-sf-link" to={to}>
                      {label}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>
          <div className="zy-sf-social">
            <span className="zy-label-mono zy-sf-h">Follow</span>
            <div className="zy-sf-social-row">
              {SOCIALS.map(([name, href, d]) => (
                <a key={name} className="zy-sf-soc" href={href} aria-label={name} title={name}>
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="zy-sf-lockup">
          <div ref={hostRef} className="zy-sf-host" role="img" aria-label="Zyou" />
        </div>

        <div className="zy-sf-legal">
          <span className="zy-data-mono zy-sf-copy">© 2026 Zyou</span>
          <div className="zy-sf-legal-links">
            {LEGAL.map(([label, to]) => (
              <Link key={label} className="zy-body-sm zy-sf-legal-link" to={to}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
