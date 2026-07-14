import { useEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"
import { Seo } from "@/components/ui/Seo"

/**
 * Early Access — single Ink section, split: founder video carousel (left) +
 * intent-capture form (right). Faithful port of the reference early-access page.
 * Form is client-only (no backend) — wire submit() to your API when it exists.
 */

const SIG = "var(--zy-signal)"
// WhatsApp community link — must be VITE_-prefixed to reach the browser bundle.
const WHATSAPP_URL = import.meta.env.VITE_WHATSAPP_URL ?? "#"
// Cloudflare Turnstile site key (public). Override via VITE_TURNSTILE_SITE_KEY.
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? ""

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string
      reset: (id?: string) => void
      remove: (id: string) => void
    }
  }
}
const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false

/* ── carousel ─────────────────────────────────────────────────── */
type EAVideo = { n: string; tag: string; title: string; time: string; yt?: string; comingSoon?: boolean }
const EA_VIDEOS: EAVideo[] = [
  { n: "01", tag: "ANALYTICS BRAIN · RELAY", title: "The Analytics Brain → Slack, Email & WhatsApp", time: "01:32", yt: "nla1Ps8WTJg" },
  { n: "02", tag: "ANALYTICS · DASHBOARD", title: "Building a complex analytics dashboard on Zyou", time: "", comingSoon: true },
  { n: "03", tag: "AD OPS · AUTOMATION", title: "Automating ad operations with Zyou", time: "", comingSoon: true },
]

function Chevron({ dir = "right", size = 16 }: { dir?: "left" | "right"; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "block" }}>
      {dir === "right" ? <polyline points="9 6 15 12 9 18" /> : <polyline points="15 6 9 12 15 18" />}
    </svg>
  )
}

function EAScreen({ v }: { v: EAVideo }) {
  if (v.yt) {
    return (
      <iframe
        id="ea-yt-player"
        title={v.title}
        src={`https://www.youtube.com/embed/${v.yt}?enablejsapi=1&autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1`}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        onLoad={(e) => e.currentTarget.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: "ea-yt-player", channel: "widget" }), "*")}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, display: "block", background: "#04101f" }}
      />
    )
  }
  return (
    <div aria-label={v.title} role="img" style={{
      position: "absolute", inset: 0,
      background: "radial-gradient(120% 90% at 50% 0%, rgba(0,224,213,0.10), transparent 60%), linear-gradient(180deg, #071b32 0%, #04101f 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, opacity: 0.5,
        backgroundImage: "radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)",
        backgroundSize: "26px 26px",
        maskImage: "radial-gradient(80% 80% at 50% 40%, #000 30%, transparent 85%)",
        WebkitMaskImage: "radial-gradient(80% 80% at 50% 40%, #000 30%, transparent 85%)",
      }} />
      {v.comingSoon ? (
        <span className="zy-label-mono" style={{ position: "relative", zIndex: 1, padding: "9px 18px", borderRadius: 999, border: "1px solid var(--zy-border-strong)", background: "rgba(7,19,38,0.6)", color: "var(--zy-on-dark-muted)", letterSpacing: ".16em", fontSize: 12 }}>COMING SOON</span>
      ) : null}
    </div>
  )
}

function EACarousel() {
  const reduce = prefersReduced()
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const active = EA_VIDEOS[idx]
  const hasVideo = Boolean(active.yt)

  useEffect(() => {
    if (reduce || paused || hasVideo || active.comingSoon) return
    const t = setTimeout(() => setIdx((i) => (i + 1) % EA_VIDEOS.length), 7000)
    return () => clearTimeout(t)
  }, [idx, paused, reduce, hasVideo])

  const go = (d: number) => setIdx((i) => (i + d + EA_VIDEOS.length) % EA_VIDEOS.length)

  // when the YouTube clip ends, advance to the second clip
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (typeof e.origin !== "string" || !e.origin.includes("youtube.com")) return
      let data: unknown
      try { data = typeof e.data === "string" ? JSON.parse(e.data) : e.data } catch { return }
      const d = data as { event?: string; info?: unknown }
      const state = d?.event === "onStateChange" ? (d.info as number)
        : d?.event === "infoDelivery" ? (d.info as { playerState?: number } | undefined)?.playerState
        : undefined
      if (state === 0) setIdx(1) // 0 = ended
    }
    window.addEventListener("message", onMsg)
    return () => window.removeEventListener("message", onMsg)
  }, [])

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span className="ea-rec-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: SIG, boxShadow: "var(--zy-glow)", animation: "ea-rec 2s ease-in-out infinite" }} />
        <span className="zy-label-mono" style={{ color: "var(--zy-on-dark-muted)", whiteSpace: "nowrap" }}>SEE IT REAL</span>
      </div>

      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{
          position: "relative", width: "100%", aspectRatio: "16 / 9", borderRadius: 12, overflow: "hidden",
          border: "1px solid rgba(0,224,213,0.22)",
          boxShadow: "0 0 0 1px rgba(0,224,213,0.16), 0 30px 70px rgba(0,0,0,0.5)", background: "#04101f",
        }}>
        <EAScreen v={active} />

        {!hasVideo && (
          <>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, padding: "14px", background: "linear-gradient(180deg, rgba(4,16,31,0.8), transparent)", pointerEvents: "none" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span className="zy-data-mono" style={{ fontSize: 10, letterSpacing: ".06em", color: "var(--zy-on-dark-faint)" }}>{active.tag}</span>
              </span>
              <span className="zy-data-mono" style={{ fontSize: 10, letterSpacing: ".08em", color: "var(--zy-on-dark-faint)" }}>{active.n} / 0{EA_VIDEOS.length}</span>
            </div>

            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "28px 16px 16px", background: "linear-gradient(0deg, rgba(4,16,31,0.9), transparent)", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
              <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span className="zy-data-mono" style={{ fontSize: 11, color: SIG, letterSpacing: ".06em" }}>{active.n}</span>
                <span style={{ fontFamily: "var(--zy-font-sans)", fontWeight: 700, fontSize: "clamp(15px, 2.1vw, 19px)", color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.2, maxWidth: "30ch" }}>{active.title}</span>
              </span>
              <span style={{ display: "flex", gap: 6, flex: "0 0 auto" }}>
                {(["left", "right"] as const).map((d) => (
                  <button key={d} type="button" onClick={() => go(d === "right" ? 1 : -1)} aria-label={d === "right" ? "Next clip" : "Previous clip"}
                    style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", padding: 0, cursor: "pointer", color: "var(--zy-on-dark)", background: "rgba(7,19,38,0.72)", border: "1px solid var(--zy-border-strong)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}>
                    <Chevron dir={d} />
                  </button>
                ))}
              </span>
            </div>
          </>
        )}
      </div>

      <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
        {EA_VIDEOS.map((v, i) => {
          const on = i === idx
          return (
            <button key={v.n} type="button" onClick={() => setIdx(i)}
              style={{
                display: "flex", alignItems: "center", gap: 14, textAlign: "left", cursor: "pointer", width: "100%",
                padding: "12px 14px", borderRadius: 10,
                background: on ? "rgba(0,224,213,0.05)" : "linear-gradient(180deg, var(--zy-ink-800) 0%, rgba(7,19,38,0.6) 100%)",
                border: `1px solid ${on ? SIG : "var(--zy-border-strong)"}`,
                boxShadow: on ? "var(--zy-glow)" : "none",
                transition: "border-color .2s ease, box-shadow .2s ease, background .2s ease",
              }}>
              <span className="zy-data-mono" style={{ fontSize: 13, fontWeight: 500, color: on ? SIG : "var(--zy-on-dark-faint)", flex: "0 0 auto" }}>{v.n}</span>
              <span className="zy-body-sm" style={{ color: on ? "var(--zy-on-dark)" : "var(--zy-on-dark-muted)", flex: 1, lineHeight: 1.35 }}>{v.title}</span>
              {on ? <span style={{ width: 7, height: 7, borderRadius: "50%", background: SIG, boxShadow: "var(--zy-glow)", flex: "0 0 auto" }} /> : <span className="zy-data-mono" style={{ fontSize: 10, color: "var(--zy-on-dark-faint)", flex: "0 0 auto" }}>{v.comingSoon ? "SOON" : v.time}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ── form ─────────────────────────────────────────────────────── */
const EA_INTENTS = [
  { key: "team", title: "Implement Zyou for my Ads Team", cta: "Meet Forge, our forward-deployed AI team", href: "/forge" },
  { key: "solo", title: "Learn how to use AI for Advertising", cta: "Meet the Ads Engineer", href: "/ads-engineer" },
] as const

function CheckMark() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
}

function WhatsAppMark({ size = 40 }: { size?: number }) {
  return (
    <span style={{ width: size, height: size, flex: "0 0 auto", borderRadius: 9, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#25D366" }}>
      <svg width={Math.round(size * 0.62)} height={Math.round(size * 0.62)} viewBox="0 0 24 24" fill="#fff" aria-label="WhatsApp" role="img">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.148-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.892c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a11.882 11.882 0 005.71 1.454h.005c6.582 0 11.945-5.361 11.948-11.896A11.821 11.821 0 0020.52 3.449" />
      </svg>
    </span>
  )
}

function IntentBox({ intent, checked, onToggle }: { intent: (typeof EA_INTENTS)[number]; checked: boolean; onToggle: () => void }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      role="checkbox" aria-checked={checked} tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); onToggle() } }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", gap: 13, alignItems: "flex-start", cursor: "pointer", padding: "13px 14px", borderRadius: 10,
        background: checked ? "rgba(0,224,213,0.05)" : "var(--zy-ink)",
        border: `1px solid ${checked ? SIG : hover ? "var(--zy-border-strong)" : "var(--zy-border-on-dark)"}`,
        boxShadow: checked ? "var(--zy-glow)" : "none",
        transition: "border-color .18s ease, box-shadow .18s ease, background .18s ease",
      }}>
      <span style={{
        width: 20, height: 20, flex: "0 0 auto", marginTop: 1, borderRadius: 5,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        background: checked ? "var(--zy-paper)" : "transparent", color: "var(--zy-ink)",
        border: `1.5px solid ${checked ? "var(--zy-paper)" : "var(--zy-border-strong)"}`,
        transition: "background .15s ease, border-color .15s ease",
      }}>{checked ? <CheckMark /> : null}</span>
      <span style={{ display: "flex", flexDirection: "column", gap: 5, minWidth: 0 }}>
        <span className="zy-body-sm" style={{ color: "var(--zy-on-dark)", fontWeight: 500, lineHeight: 1.35 }}>{intent.title}</span>
        <a href={intent.href} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
          className="zy-data-mono" style={{ fontSize: 11, color: SIG, textDecoration: "none", width: "fit-content" }}>{intent.cta} →</a>
      </span>
    </div>
  )
}

function WhatsAppRow({ emphasized = false }: { emphasized?: boolean }) {
  const [hover, setHover] = useState(false)
  return (
    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", gap: 13, textDecoration: "none", borderRadius: 10, padding: emphasized ? "14px" : "12px 2px",
        background: emphasized ? "rgba(0,224,213,0.05)" : "transparent",
        border: emphasized ? `1px solid ${SIG}` : "1px solid transparent",
        boxShadow: emphasized && hover ? "var(--zy-glow)" : "none", transition: "box-shadow .2s ease",
      }}>
      <WhatsAppMark size={emphasized ? 42 : 40} />
      <span style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1, minWidth: 0 }}>
        <span className="zy-label-mono" style={{ color: "var(--zy-on-dark-faint)" }}>COMMUNITY</span>
        <span className="zy-body-sm" style={{ color: "var(--zy-on-dark)" }}>Connect with like-minded Ads Engineers on WhatsApp</span>
      </span>
      <span style={{ color: SIG, flex: "0 0 auto", transform: hover ? "translateX(2px)" : "none", transition: "transform .15s ease" }} aria-hidden="true">→</span>
    </a>
  )
}

const LABEL: CSSProperties = { display: "block", fontFamily: "var(--zy-font-mono)", fontSize: 11, letterSpacing: ".1em", color: "var(--zy-on-dark-faint)", marginBottom: 7 }

function Field({ label, error, ...props }: { label: string; error?: string | null } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label style={{ display: "block" }}>
      <span style={LABEL}>{label}</span>
      <input
        {...props}
        className="ea-input"
        style={{ borderColor: error ? "#ff5a52" : undefined }}
      />
      {error ? <span className="zy-data-mono" style={{ display: "block", fontSize: 11, color: "#ff5a52", marginTop: 6 }}>{error}</span> : null}
    </label>
  )
}

type Errs = { name?: string | null; email?: string | null; phone?: string | null }

function EAForm() {
  const [intents, setIntents] = useState<{ team: boolean; solo: boolean }>({ team: false, solo: false })
  const [vals, setVals] = useState({ name: "", email: "", phone: "" })
  const [errs, setErrs] = useState<Errs>({})
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formErr, setFormErr] = useState<string | null>(null)
  const [hp, setHp] = useState("") // honeypot — bots fill it, humans never see it
  const [token, setToken] = useState("") // Turnstile token
  const tsRef = useRef<HTMLDivElement>(null)
  const tsId = useRef<string>()

  useEffect(() => {
    const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
    const render = () => {
      if (!tsRef.current || tsId.current || !window.turnstile) return
      tsId.current = window.turnstile.render(tsRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: "dark",
        callback: (t: string) => setToken(t),
        "expired-callback": () => setToken(""),
        "error-callback": () => setToken(""),
      })
    }
    if (window.turnstile) return render()
    let s = document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`)
    if (!s) { s = document.createElement("script"); s.src = SRC; s.async = true; document.head.appendChild(s) }
    s.addEventListener("load", render)
    return () => s?.removeEventListener("load", render)
  }, [])

  const resetTs = () => { setToken(""); if (tsId.current) window.turnstile?.reset(tsId.current) }

  const toggle = (k: "team" | "solo") => setIntents((s) => ({ ...s, [k]: !s[k] }))
  const set = (k: "name" | "email" | "phone") => (e: React.ChangeEvent<HTMLInputElement>) => {
    setVals((s) => ({ ...s, [k]: e.target.value }))
    if (errs[k]) setErrs((s) => ({ ...s, [k]: null }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const next: Errs = {}
    if (!vals.name.trim()) next.name = "Please enter your name."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email.trim())) next.email = "Enter a valid email address."
    // phone: allow +, digits, spaces, () . - ; require 8–15 digits (E.164 range)
    const digits = vals.phone.replace(/\D/g, "")
    if (!/^\+?[\d\s().-]+$/.test(vals.phone.trim()) || digits.length < 8 || digits.length > 15)
      next.phone = "Enter a valid phone number, including country code."
    setErrs(next)
    if (Object.keys(next).length) return
    if (!token) { setFormErr("Please complete the verification below."); return }

    const url = import.meta.env.VITE_SUPABASE_URL
    if (!url) { setFormErr("Sign-ups aren’t configured yet — please try again shortly."); return }

    setSubmitting(true); setFormErr(null)
    try {
      // Zero-key: hit the Edge Function, which holds the only credentials
      // (service_role + Gmail) server-side. No Supabase key ships to the browser.
      const res = await fetch(`${url}/functions/v1/early-access-lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: vals.name.trim(),
          email: vals.email.trim().toLowerCase(),
          phone: vals.phone.trim(),
          intents: (["team", "solo"] as const).filter((k) => intents[k]),
          company: hp, // honeypot
          turnstileToken: token,
        }),
      })
      if (res.ok) { setSent(true); return }
      throw new Error(await res.text())
    } catch {
      setFormErr("Something went wrong. Please try again.")
      resetTs() // token is single-use — get a fresh one for the retry
    } finally {
      setSubmitting(false)
    }
  }

  const cardStyle: CSSProperties = {
    background: "linear-gradient(180deg, var(--zy-ink-800) 0%, var(--zy-ink) 100%)",
    border: "1px solid var(--zy-border-strong)", borderRadius: 16, padding: "clamp(22px, 3vw, 32px)",
  }

  if (sent) {
    return (
      <div style={cardStyle}>
        <span style={{ width: 54, height: 54, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: SIG, border: `1.5px solid ${SIG}`, boxShadow: "var(--zy-glow)", marginBottom: 20 }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
        </span>
        <span className="zy-label-mono" style={{ display: "block", color: "var(--zy-on-dark-muted)", marginBottom: 10 }}>EARLY ACCESS · YOU’RE IN</span>
        <h2 className="zy-headline-md" style={{ margin: "0 0 10px" }}>You’re on the list.</h2>
        <p className="zy-body-md" style={{ color: "var(--zy-on-dark-muted)", margin: "0 0 24px", maxWidth: "40ch" }}>
          We review every request personally and will reach out on your phone shortly. In the meantime, jump into the community.
        </p>
        <div style={{ height: 1, background: "var(--zy-border-on-dark)", margin: "0 0 20px" }} />
        <WhatsAppRow emphasized />
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate style={cardStyle}>
      {/* honeypot — off-screen, hidden from AT + tab order; only bots fill it */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true"
        value={hp} onChange={(e) => setHp(e.target.value)}
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
      <span className="zy-label-mono" style={{ display: "block", color: "var(--zy-on-dark-muted)", marginBottom: 12 }}>EARLY ACCESS</span>
      <h1 className="zy-headline-md" style={{ margin: "0 0 22px", fontSize: "clamp(28px, 3.4vw, 38px)", lineHeight: 1.12 }}>
        Request <span style={{ color: SIG }}>Early Access</span> to Zyou.
      </h1>

      <span className="zy-label-mono" style={{ display: "block", color: "var(--zy-on-dark-faint)", marginBottom: 10 }}>WHAT ARE YOU HERE FOR? · PICK ONE OR BOTH</span>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
        {EA_INTENTS.map((it) => (
          <IntentBox key={it.key} intent={it} checked={intents[it.key]} onToggle={() => toggle(it.key)} />
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 180px", minWidth: 0 }}>
            <Field label="FULL NAME" placeholder="Priya Nair" value={vals.name} onChange={set("name")} error={errs.name} autoComplete="name" />
          </div>
          <div style={{ flex: "1 1 180px", minWidth: 0 }}>
            <Field label="WORK EMAIL" type="email" placeholder="priya@acme.com" value={vals.email} onChange={set("email")} error={errs.email} autoComplete="email" />
          </div>
        </div>
        <Field label="PHONE NUMBER" type="tel" placeholder="+1 555 000 0000" value={vals.phone} onChange={set("phone")} error={errs.phone} autoComplete="tel" />
      </div>

      <div ref={tsRef} style={{ marginTop: 18 }} />

      <div style={{ marginTop: 18 }}>
        <button type="submit" className="zy-btn zy-btn--paper zy-btn--lg" style={{ width: "100%", opacity: submitting ? 0.7 : 1, pointerEvents: submitting ? "none" : "auto" }} disabled={submitting}>
          {submitting ? "Requesting…" : <>Request early access <span aria-hidden="true">→</span></>}
        </button>
      </div>
      {formErr ? (
        <p className="zy-data-mono" style={{ textAlign: "center", fontSize: 12, color: "#ff5a52", margin: "12px 0 0" }}>{formErr}</p>
      ) : (
        <p className="zy-data-mono" style={{ textAlign: "center", fontSize: 11, letterSpacing: ".08em", color: "var(--zy-on-dark-faint)", margin: "12px 0 0" }}>
          WE REPLY PERSONALLY · NO SPAM
        </p>
      )}
    </form>
  )
}

/* ── page ─────────────────────────────────────────────────────── */
export function EarlyAccess() {
  return (
    <main>
      <Seo
        title="Request Early Access | Zyou"
        description="Request early access to Zyou, an AI team for advertising operations."
        canonical="https://zyou.ai/early-access"
      />
      <section className="ea-section" id="early-access">
        <div aria-hidden="true" style={{
          position: "absolute", inset: "-10% -5% auto -5%", height: "70%", zIndex: 0, pointerEvents: "none",
          background: "radial-gradient(50% 60% at 22% 18%, rgba(0,224,213,0.14), transparent 70%), radial-gradient(46% 54% at 82% 8%, rgba(0,224,213,0.06), transparent 72%)",
          filter: "blur(120px)", opacity: 0.9,
        }} />
        <div className="ea-grid">
          <div>
            <EACarousel />
            <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid var(--zy-border-on-dark)" }}>
              <WhatsAppRow emphasized />
            </div>
          </div>
          <div><EAForm /></div>
        </div>
      </section>
    </main>
  )
}
