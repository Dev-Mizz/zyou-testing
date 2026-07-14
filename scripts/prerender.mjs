/**
 * scripts/prerender.mjs — T2: Custom Playwright Prerender Pipeline
 *
 * Mentor task: SSG-like static HTML generation for all 11 routes.
 * Strategy: spin up `vite preview` → crawl each route with Playwright Chromium →
 * wait for React to fully settle → write `dist/<route>/index.html`.
 *
 * EC2 CI requires: `npx playwright install chromium --with-deps` before `bun run build && node scripts/prerender.mjs`
 * Local Windows: `npx playwright install chromium` (no --with-deps needed)
 *
 * Why NOT postbuild hook: we want the CI workflow to be explicit about the
 * two-step (build → prerender) so failures are clearly scoped.
 */

import { chromium } from 'playwright'
import { spawn } from 'child_process'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

// ── Config ──────────────────────────────────────────────────────────────────

const ROUTES = [
  '/',
  '/forge',
  '/forge/brands',
  '/forge/agencies',
  '/forge/platforms',
  '/modern-ai-stack',
  '/use-cases',
  '/ads-engineer',
  '/early-access',
  '/privacy-policy',
  '/terms-of-use',
]

const PORT = 4173                   // vite preview default
const BASE = `http://localhost:${PORT}`
const DIST = 'dist'

// ── Helpers ──────────────────────────────────────────────────────────────────

async function waitForServer(url, timeout = 30_000) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url)
      if (res.ok) return
    } catch { /* not ready yet */ }
    await new Promise(r => setTimeout(r, 500))
  }
  throw new Error(`Preview server did not respond within ${timeout}ms`)
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔨 Starting vite preview server…')

  const isWin = process.platform === 'win32'
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: isWin,
  })

  server.stdout.on('data', d => process.stdout.write(d))
  server.stderr.on('data', d => process.stderr.write(d))

  try {
    await waitForServer(`${BASE}/`)
    console.log('✅ Preview server ready\n')

    const browser = await chromium.launch()
    const context = await browser.newContext({
      // Disable service workers — they can return cached 200s masking real errors
      serviceWorkers: 'block',
    })

    for (const route of ROUTES) {
      const page = await context.newPage()

      try {
        await page.goto(`${BASE}${route}`, {
          waitUntil: 'networkidle',
          timeout: 45_000,
        })

        // Extra settle time for any delayed React state / animations
        await page.waitForTimeout(600)

        const html = await page.content()

        // Route → output path:
        //   /           → dist/index.html         (rewrite Vite's SPA shell)
        //   /forge      → dist/forge/index.html
        //   /forge/brands → dist/forge/brands/index.html
        const relPath = route === '/' ? '' : route
        const outDir  = relPath ? join(DIST, relPath) : DIST
        mkdirSync(outDir, { recursive: true })
        writeFileSync(join(outDir, 'index.html'), html, 'utf-8')

        console.log(`  ✓ ${route}`)
      } catch (err) {
        console.error(`  ✗ ${route}  →  ${err.message}`)
        process.exitCode = 1           // mark failure but continue other routes
      } finally {
        await page.close()
      }
    }

    await browser.close()
    console.log('\n🎉 Prerender complete!')
  } finally {
    server.kill()
  }
}

main().catch(err => {
  console.error('Prerender fatal error:', err)
  process.exit(1)
})
