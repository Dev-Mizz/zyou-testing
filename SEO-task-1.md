# SEO Task 1 — Make zyou.ai Crawlable + Add Page Metadata

**Owner:** Web developer
**Repo:** `ZyouHQ/zyou-landing-page` (local: `Zyou Website 2.0 codebase`)
**Scope:** Fix the current website only. No new pages, no content rewrites, no design changes.
**Goal:** Make the existing pages visible to Google and AI crawlers, and give each page correct search metadata.

---

## 1. Context — why this task exists

The site currently ranks/appears nowhere because of two plumbing problems, not a content problem:

1. It's a **client-side-rendered SPA** — the HTML crawlers receive is an empty shell; all content is painted by JavaScript. Google renders JS slowly/partially; **AI crawlers (GPTBot, ClaudeBot, PerplexityBot) largely do not run JS at all**, so they see nothing.
2. **Every page except the homepage returns HTTP 404** to a direct request (crawler hit), because the server has no SPA fallback and nothing is prerendered.

The page copy itself is good and does not need changing. This task makes it *reachable and readable*, and adds per-page `<title>`/description so each page presents correctly in search results.

---

## 2. Stack (as found)

- **Frontend:** Vite 5, React 18, **React Router 7 (`BrowserRouter`)**, Tailwind 4, TypeScript. Package manager **Bun**.
- **Entry:** `src/main.tsx` → `ReactDOM.createRoot(...).render(<BrowserRouter><App/></BrowserRouter>)`. Pure CSR.
- **Routing:** `src/App.tsx` — `<Routes>` with `lazy()` route-level code splitting.
- **Meta:** single static `index.html` (one generic title/description for the whole app; no per-page meta library).
- **Deploy:** `.github/workflows/ci-cd.yml` → SSH to EC2 → `git pull` → `bun install --frozen-lockfile` → `bun run build`. Served by **nginx/1.28.3 (Ubuntu)** from the build output.
- **Already present (keep):** GSC verification (`google4169bd966cb490dc.html` + `google-site-verification` meta), Google Tag Manager (`GTM-MM3P7Q9S`), OG/Twitter tags in `index.html`, `public/sitemap.xml`.

---

## 3. Findings (verbatim evidence)

**3.1 Homepage is an empty shell (CSR).** `GET https://zyou.ai/` → `HTTP 200`, `Content-Length: 2304`. Body is:
```html
<body>
  <noscript>…GTM…</noscript>
  <div id="root"></div>
  <script type="module" src="/assets/index-*.js"></script>
</body>
```
No text content in the HTML.

**3.2 All sub-routes 404 to crawlers.** Direct requests (Googlebot UA):
```
/                    -> HTTP 200  (2304 bytes)
/forge               -> HTTP 404  (162 bytes)
/forge/brands        -> HTTP 404  (162 bytes)
/forge/agencies      -> HTTP 404  (162 bytes)
/forge/platforms     -> HTTP 404  (162 bytes)
/modern-ai-stack     -> HTTP 404  (162 bytes)
/use-cases           -> HTTP 404  (162 bytes)
/ads-engineer        -> HTTP 404  (162 bytes)
/early-access        -> HTTP 404  (162 bytes)
```
(nginx serves the SPA only at `/`; other paths have no file on disk and no fallback.)

**3.3 `robots.txt` is missing.** `GET /robots.txt` → `HTTP 404`.

**3.4 `sitemap.xml` exists but is stale/inconsistent.** It lists the 9 routes above (all of which 404), and is **missing** `/privacy-policy` and `/terms-of-use` which exist in `App.tsx`. It is hand-maintained in `public/`.

**3.5 One generic title/description for the whole app.** `index.html` has `title` = `description` = "Zyou | Your AI Team For Advertising" for every route.

**3.6 Content lives in JSX/canvas.** Hero reel (canvas), `StackInfographic`, `ads-engineer/figures.tsx` etc. Text-first extraction risk — key info inside visuals is invisible to crawlers unless mirrored as text.

---

## 4. Dev tasks

Ordered by priority. Do **T1** immediately (trivial, stops the bleeding). **T2** is the real fix.

### T1 — nginx SPA fallback (stop the 404s)
- **Why:** makes every route reachable instead of 404.
- **How (on EC2 nginx config for the site):**
  ```nginx
  location / {
    try_files $uri $uri/ /index.html;
  }
  ```
  Ensure `root` points at the build output and `index index.html;` is set.
- **Acceptance:** `curl -sI https://zyou.ai/forge` returns `HTTP 200` (not 404).
- **Note:** this alone still serves the empty JS shell; it is necessary but not sufficient. T2 is what puts content in the HTML. With T2 (prerender), `try_files` will serve the prerendered `/<route>/index.html` when present and fall back otherwise.

### T2 — Server-side render / prerender the pages (SSG)
- **Why:** bakes the real content into the HTML so Google **and** AI crawlers can read it. **No visual/design change** — the same React components are rendered to static HTML at build time.
- **Recommended approach:** **`vite-react-ssg`** — purpose-built for React Router 7, prerenders all routes during `bun run build`, minimal change to the CI/EC2 flow. High level:
  - `bun add vite-react-ssg`
  - Convert the entry from `ReactDOM.createRoot(...)` to the `ViteReactSSG` entry, exporting the route list (same routes as `App.tsx`).
  - Build now emits one static `index.html` per route under `dist/` (e.g. `dist/forge/index.html`).
- **Alternatives (dev's call):**
  - **`react-snap`** — post-build Puppeteer prerender; minimal refactor (add a `postbuild` script + switch to `hydrateRoot`). Faster to adopt, less actively maintained.
  - **Custom Playwright prerender step in CI** — render each route from the route list, write static HTML. Most control, more code.
- **Acceptance:** `curl -s https://zyou.ai/modern-ai-stack | grep -i "execution layer"` returns matching body text (content is in the raw HTML, no JS needed).

### T3 — Per-page title / meta description / canonical
- **Why:** every page currently shares one generic title/description. Each needs its own (Section 5).
- **How:** use `vite-react-ssg`'s `<Head>` (if T2 uses it) **or** `react-helmet-async`. Create a small reusable `Seo` component (`title`, `description`, `canonical`, and OG/Twitter) and drop it into each page with values from Section 5.
  - Canonical = the page's absolute URL (self-referencing).
  - OG/Twitter: reuse existing `og:image` (`https://zyou.ai/og-team.png`); set `og:title`/`og:description`/`og:url` = the page's title/description/canonical.
- **Acceptance:** `curl -s https://zyou.ai/forge | grep -i "<title>"` shows the Forge-specific title; each route has a unique title/description/canonical in raw HTML.

### T4 — Add `robots.txt`
- **Why:** currently 404. Provide crawl directive + point to sitemap.
- **How:** add `public/robots.txt`:
  ```
  User-agent: *
  Allow: /

  Sitemap: https://zyou.ai/sitemap.xml
  ```
  (`Allow: /` permits all crawlers including AI bots. Do not add `Disallow` for GPTBot/ClaudeBot/PerplexityBot/Google-Extended unless we deliberately want to block AI.)
- **Acceptance:** `GET https://zyou.ai/robots.txt` → `HTTP 200` with the above.

### T5 — Fix `sitemap.xml`
- **Why:** currently lists routes that 404 and omits two real routes.
- **How:** after T1/T2, ensure the sitemap lists **only reachable routes** and includes all 11 (add `/privacy-policy`, `/terms-of-use`). Prefer generating it at build from the route list so it can't drift; accurate `lastmod`.
- **Acceptance:** every `<loc>` in the sitemap returns `HTTP 200`.

### T6 — Text layer under infographics (lower priority, ongoing)
- **Why:** info locked inside canvas/images/JSX-only visuals isn't extractable.
- **How:** for the hero reel, `StackInfographic`, and `ads-engineer` figures, ensure the key claims also exist as real text/tables in the DOM, plus `alt` text on images. No design change — add an accompanying text/caption layer.
- **Acceptance:** the core claims of each infographic appear as text in the rendered HTML.

### T7 — Verify & submit
- After deploy: run the checks in Section 8.
- In **Google Search Console**: submit the sitemap; use URL Inspection → Request Indexing on the key routes.

---

## 5. Head-tag spec (title / meta / canonical per route)

These go into each page's `<head>` (T3). **Do not change visible copy or H1s.** Titles ≤ ~60 chars, descriptions ≤ ~160, no em dashes, `|` is a separator.

| Route | `<title>` | `<meta name="description">` | canonical |
|---|---|---|---|
| `/` | Zyou \| AI Team for Advertising Operations | Zyou is a forward deployed AI team for advertising operations. We build agents for media planning, campaign creation, analysis, and optimisation on our own infrastructure. | https://zyou.ai/ |
| `/modern-ai-stack` | Modern AI Stack: The Execution Layer for Ad Platforms \| Zyou | The middleware between AI agents and ad platforms like Meta and Google Ads. Zyou governs agents, secures execution, and cuts the cost of running them. | https://zyou.ai/modern-ai-stack |
| `/ads-engineer` | The Ads Engineer \| Directing AI Agents, Not Manual Campaigns | The role your ad team grows into: directing agents instead of running campaigns by hand, and how marketers use Claude for advertising. | https://zyou.ai/ads-engineer |
| `/use-cases` | Advertising Use Cases: AI Agents and Claude \| Zyou | How advertising teams use AI agents and Claude for data analysis, campaign creation, and optimisation, automating manual work to save 10x the time. | https://zyou.ai/use-cases |
| `/forge` | Forge: AI Agent Engineering for Marketing Teams \| Zyou | Forge is Zyou's forward deployed engineering team. We build and implement AI agents for brands, agencies, and enterprise marketing teams. | https://zyou.ai/forge |
| `/forge/brands` | AI Agents for Brands \| Zyou Forge | How Zyou builds and runs AI agents for brands, bringing every ad channel into one view your team can act on. | https://zyou.ai/forge/brands |
| `/forge/agencies` | AI Agents for Ad Agencies \| Zyou Forge | How Zyou builds AI agents for ad agencies, so you can run more accounts without adding headcount. | https://zyou.ai/forge/agencies |
| `/forge/platforms` | Adtech for Media & Commerce Platforms \| Zyou | How Zyou builds the adtech that runs your ad inventory, for media and commerce platforms. | https://zyou.ai/forge/platforms |
| `/early-access` | Request Early Access \| Zyou | Request early access to Zyou, an AI team for advertising operations. | https://zyou.ai/early-access |
| `/privacy-policy` | Privacy Policy \| Zyou | How Zyou collects, uses, and protects your data. | https://zyou.ai/privacy-policy |
| `/terms-of-use` | Terms of Use \| Zyou | The terms that govern your use of Zyou. | https://zyou.ai/terms-of-use |

---

## 6. Reference — actual on-page H1s (leave unchanged)

The `<title>` is **not** the H1. These H1s already exist and stay as-is; listed so you can confirm each title matches the page's real content.

| Route | Current visible H1 (in code) |
|---|---|
| `/` | Your AI Team for Advertising |
| `/modern-ai-stack` | The execution layer for advertising. |
| `/ads-engineer` | Your ad team doesn't need new tools. They need to operate like engineers. |
| `/use-cases` | The work your team does by hand. Running on its own. |
| `/forge` | We embed. We build. We train. When we leave, the system stays. |
| `/forge/brands` | See every channel as one number. Then act on it. |
| `/forge/agencies` | Run more accounts than you can staff. |
| `/forge/platforms` | Your inventory is a business. Make it autonomous. |
| `/early-access` | Request Early Access to Zyou. |
| `/privacy-policy` | Privacy Policy |
| `/terms-of-use` | Terms of Use |

---

## 7. Do NOT touch

- Visible page copy, H1s, layout, design, animations.
- GSC verification file/meta (`google4169bd966cb490dc.html`, `google-site-verification`).
- GTM (`GTM-MM3P7Q9S`).
- Existing OG image (`og-team.png`).

---

## 8. Verification checklist (run after deploy)

```bash
# 1. No route 404s (expect HTTP 200 for all)
for p in / /forge /forge/brands /forge/agencies /forge/platforms \
         /modern-ai-stack /use-cases /ads-engineer /early-access \
         /privacy-policy /terms-of-use; do
  echo -n "$p -> "; curl -sI "https://zyou.ai$p" | head -1
done

# 2. Content is in the raw HTML (no JS) — expect matches
curl -s https://zyou.ai/modern-ai-stack | grep -ic "execution layer"
curl -s https://zyou.ai/forge          | grep -ic "forward deployed"

# 3. Per-page title present — expect the page-specific title
curl -s https://zyou.ai/forge | grep -i "<title>"

# 4. robots.txt — expect HTTP 200 + Sitemap line
curl -s https://zyou.ai/robots.txt

# 5. Every sitemap URL resolves 200
curl -s https://zyou.ai/sitemap.xml | grep -oE "<loc>[^<]+</loc>"
```
- [ ] All routes return 200
- [ ] Body text present in raw HTML for each route
- [ ] Unique title/description/canonical per route
- [ ] robots.txt returns 200 and references the sitemap
- [ ] All sitemap URLs return 200
- [ ] GSC: sitemap submitted + key routes requested for indexing

---

## 9. Definition of done

Every route returns 200 with its real content and a unique title/description/canonical in the raw HTML; `robots.txt` and `sitemap.xml` are correct; GSC sitemap submitted. Design and copy unchanged.
