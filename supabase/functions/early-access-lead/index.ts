import nodemailer from "npm:nodemailer@6"

// Early Access — public lead endpoint (zero-key).
// The browser POSTs here with NO Supabase key. This function is the trust
// boundary: it holds the only credentials (service_role + Gmail SMTP), server-side.
//
// Recognises legit callers by layers (a public browser can't hold a secret):
//   1. Origin allowlist   (ALLOWED_ORIGIN, comma-separated)
//   2. Honeypot field      (`company` must be empty)
//   3. (upgrade) Cloudflare Turnstile — verify a token here with the secret.
//
// Requires verify_jwt = false (see supabase/config.toml).
// Auto-injected env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
// Set yourself:  supabase secrets set GMAIL_USER=you@gmail.com GMAIL_APP_PASSWORD="xxxxxxxxxxxxxxxx" TEAM_EMAIL=... ALLOWED_ORIGIN=https://zyou.ai,http://localhost:5173
//   GMAIL_APP_PASSWORD is a Google App Password (needs 2-Step Verification on), NOT your login password.

const ALLOWED = (Deno.env.get("ALLOWED_ORIGIN") ?? "").split(",").map((s) => s.trim()).filter(Boolean)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// WhatsApp community link shown in the welcome email (set as a secret to change).
const WHATSAPP_URL = Deno.env.get("WHATSAPP_URL") ?? "https://chat.whatsapp.com/"
// Logo in the email header. NOTE: SVG doesn't render in Gmail/Outlook — those
// clients will show the alt text. A hosted PNG (public/logos/lockup-email.png)
// renders everywhere; set LOGO_URL to it if you want the logo in every client.
const LOGO_URL = Deno.env.get("LOGO_URL") ?? "https://zyou.ai/logos/Logo_Dark.svg"

// escape user input before it goes into HTML emails
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!))
const intentLabel = (k: string) => (k === "team" ? "Implement Zyou for my Ads Team" : k === "solo" ? "Learn how to use AI for Advertising" : k)

/* ══════════════════════════════════════════════════════════════════════
   EMAIL TEMPLATES — edit freely. Both are plain inline-CSS HTML (the only
   thing email clients reliably render). {name} etc. are escaped for you.
   ══════════════════════════════════════════════════════════════════════ */
// exact app tokens (index.css), flattened to solid hex — email clients drop rgba().
const BRAND = { ink: "#071326", ink800: "#0D2245", border: "#102A56", signal: "#00E0D5", paper: "#FFFFFF", text: "#E6ECF3", muted: "#93A2B5", faint: "#5E6E82" }
const MONO = "font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.12em;"

const logoMark = () =>
  LOGO_URL
    ? `<img src="${LOGO_URL}" alt="Zyou" height="26" style="display:inline-block;height:26px;width:auto;border:0;">`
    : `<span style="font-weight:800;font-size:20px;letter-spacing:-0.02em;color:${BRAND.text};">Zyou</span>`

const shell = (inner: string) => `
<div style="margin:0;padding:32px 16px;background:${BRAND.ink};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:520px;margin:0 auto;background:${BRAND.ink800};border:1px solid ${BRAND.border};border-radius:16px;overflow:hidden;">
    <div style="height:3px;background:${BRAND.signal};"></div>
    <div style="padding:32px;">
      <div style="text-align:center;margin-bottom:26px;">${logoMark()}</div>
      ${inner}
    </div>
  </div>
  <div style="max-width:520px;margin:16px auto 0;text-align:center;color:${BRAND.faint};font-size:12px;">Zyou · The AI Ads Engineer</div>
</div>`

const WELCOME = {
  subject: () => "You’re in — Zyou early access",
  html: ({ name, intents }: { name: string; intents: string[] }) => shell(`
    <div style="${MONO}font-size:11px;color:${BRAND.muted};margin-bottom:14px;">EARLY ACCESS · YOU’RE IN</div>
    <h1 style="margin:0 0 12px;font-size:26px;line-height:1.15;color:${BRAND.text};">You’re on the list, ${esc(name.split(" ")[0] || name)}.</h1>
    <p style="margin:0 0 18px;font-size:15px;line-height:1.65;color:${BRAND.muted};">
      We review every request personally and will reach out on your phone shortly to get you set up.
    </p>
    ${intents.length ? `<p style="margin:0 0 24px;font-size:14px;line-height:1.65;color:${BRAND.muted};">You’re here to <span style="color:${BRAND.text};">${intents.map((i) => esc(intentLabel(i))).join("</span> and <span style=\"color:" + BRAND.text + ";\">")}</span> — we’ll point you at the right place.</p>` : ""}
    <a href="${WHATSAPP_URL}" style="display:inline-block;background:${BRAND.paper};color:${BRAND.ink};font-weight:700;font-size:14px;text-decoration:none;padding:13px 24px;border-radius:10px;">Connect with like-minded Ads Engineers →</a>
    <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:${BRAND.faint};">If you didn’t request this, you can ignore this email.</p>
  `),
}

const NOTIFY = {
  subject: (name: string) => `New early-access request — ${name}`,
  html: ({ name, email, phone, intents }: { name: string; email: string; phone: string; intents: string[] }) => shell(`
    <div style="${MONO}font-size:11px;color:${BRAND.muted};margin-bottom:14px;">NEW EARLY-ACCESS REQUEST</div>
    <h1 style="margin:0 0 20px;font-size:22px;line-height:1.2;color:${BRAND.text};">${esc(name)} wants in.</h1>
    <table style="width:100%;border-collapse:collapse;font-size:14px;color:${BRAND.text};">
      ${[["Name", name], ["Email", email], ["Phone", phone], ["Intent", intents.map(intentLabel).join(", ") || "—"]]
      .map(([k, v]) => `<tr><td style="padding:11px 0;border-bottom:1px solid ${BRAND.border};color:${BRAND.muted};width:84px;vertical-align:top;">${k}</td><td style="padding:11px 0;border-bottom:1px solid ${BRAND.border};">${esc(String(v))}</td></tr>`)
      .join("")}
    </table>
    <p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:${BRAND.faint};">Reply to this email to reach ${esc(name)} directly.</p>
  `),
}

function cors(origin: string) {
  const allow = ALLOWED.includes(origin) ? origin : (ALLOWED[0] ?? "*")
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  }
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin") ?? ""
  const headers = cors(origin)

  if (req.method === "OPTIONS") return new Response("ok", { headers })
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "method" }), { status: 405, headers })
  if (ALLOWED.length && !ALLOWED.includes(origin)) return new Response(JSON.stringify({ error: "forbidden" }), { status: 403, headers })

  let body: Record<string, unknown>
  try { body = await req.json() } catch { return new Response(JSON.stringify({ error: "bad json" }), { status: 400, headers }) }

  // honeypot — pretend success so bots don't retry
  if (typeof body.company === "string" && body.company.trim()) return new Response(JSON.stringify({ ok: true }), { headers })

  // Cloudflare Turnstile — the real, unforgeable bot wall. Skipped if secret unset.
  const TURNSTILE_SECRET = Deno.env.get("TURNSTILE_SECRET_KEY")
  if (TURNSTILE_SECRET) {
    const form = new FormData()
    form.append("secret", TURNSTILE_SECRET)
    form.append("response", String(body.turnstileToken ?? ""))
    const ip = req.headers.get("cf-connecting-ip")
    if (ip) form.append("remoteip", ip)
    const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form })
      .then((r) => r.json()).catch(() => ({ success: false }))
    if (!verify.success) {
      console.warn("turnstile failed:", verify["error-codes"])
      return new Response(JSON.stringify({ error: "captcha" }), { status: 403, headers })
    }
  }

  const name = String(body.name ?? "").trim()
  const email = String(body.email ?? "").trim().toLowerCase()
  const phone = String(body.phone ?? "").trim()
  const digits = phone.replace(/\D/g, "")
  const intents = Array.isArray(body.intents) ? body.intents.filter((x) => x === "team" || x === "solo") : []
  if (!name || !EMAIL_RE.test(email) || digits.length < 8 || digits.length > 15)
    return new Response(JSON.stringify({ error: "invalid" }), { status: 422, headers })

  // insert with service_role (bypasses RLS; RLS stays enabled to block every other path)
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  const ins = await fetch(`${SUPABASE_URL}/rest/v1/early_access_leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SERVICE_ROLE, Authorization: `Bearer ${SERVICE_ROLE}`, Prefer: "return=minimal" },
    body: JSON.stringify({ name, email, phone, intents }),
  })
  if (ins.status !== 409 && !ins.ok) return new Response(await ins.text(), { status: 502, headers })
  // 409 = already on the list → treat as success

  // two emails via Gmail SMTP, best-effort (a mail hiccup must never fail the signup):
  //   1. welcome  -> the person who signed up
  //   2. notify   -> the founders
  const GMAIL_USER = Deno.env.get("GMAIL_USER")
  const GMAIL_APP_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD")
  const TEAM_EMAIL = Deno.env.get("TEAM_EMAIL")
  // Gmail requires the From address to be the authenticated account (a display name is fine).
  const FROM_EMAIL = Deno.env.get("FROM_EMAIL") ?? (GMAIL_USER ? `Zyou <${GMAIL_USER}>` : undefined)
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.warn("email skipped — GMAIL_USER or GMAIL_APP_PASSWORD not set", { hasUser: !!GMAIL_USER, hasPass: !!GMAIL_APP_PASSWORD })
  } else if (ins.ok) {
    try {
      const tx = nodemailer.createTransport({
        host: "smtp.gmail.com", port: 465, secure: true,
        auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
      })
      await tx.verify().then(() => console.log("smtp verify ok")).catch((e: unknown) => console.error("smtp verify FAILED:", (e as Error)?.message || String(e)))
      const results = await Promise.allSettled([
        tx.sendMail({ from: FROM_EMAIL, to: email, replyTo: TEAM_EMAIL, subject: WELCOME.subject(), html: WELCOME.html({ name, intents }) }),
        ...(TEAM_EMAIL ? [tx.sendMail({ from: FROM_EMAIL, to: TEAM_EMAIL, replyTo: email, subject: NOTIFY.subject(name), html: NOTIFY.html({ name, email, phone, intents }) })] : []),
      ])
      results.forEach((r, i) => {
        const which = i === 0 ? "welcome→user" : "notify→team"
        if (r.status === "fulfilled") console.log(`mail ${which} sent:`, JSON.stringify({ accepted: r.value?.accepted, rejected: r.value?.rejected, response: r.value?.response }))
        else console.error(`mail ${which} FAILED:`, r.reason?.message || String(r.reason))
      })
    } catch (e) {
      console.error("email step crashed:", (e as Error)?.message || String(e))
    }
  }

  return new Response(JSON.stringify({ ok: true }), { headers })
})
