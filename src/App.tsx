import { useEffect, lazy, Suspense } from "react"
import { Routes, Route, useLocation } from "react-router-dom"
import { SiteNav } from "@/components/nav/SiteNav"
import { SiteFooter } from "@/components/footer/SiteFooter"
import { Home } from "@/pages/Home"

// Route-level code splitting: only the homepage ships in the initial bundle;
// the deeper pages (and their heavy CSS/animations) load on navigation.
const Forge = lazy(() => import("@/pages/Forge").then((m) => ({ default: m.Forge })))
const ForgeBrands = lazy(() => import("@/pages/ForgeBrands").then((m) => ({ default: m.ForgeBrands })))
const ForgeAgencies = lazy(() => import("@/pages/ForgeAgencies").then((m) => ({ default: m.ForgeAgencies })))
const ForgePlatforms = lazy(() => import("@/pages/ForgePlatforms").then((m) => ({ default: m.ForgePlatforms })))
const ModernAiStack = lazy(() => import("@/pages/ModernAiStack").then((m) => ({ default: m.ModernAiStack })))
const UseCases = lazy(() => import("@/pages/UseCases").then((m) => ({ default: m.UseCases })))
const AdsEngineer = lazy(() => import("@/pages/AdsEngineer").then((m) => ({ default: m.AdsEngineer })))
const EarlyAccess = lazy(() => import("@/pages/EarlyAccess").then((m) => ({ default: m.EarlyAccess })))
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy").then((m) => ({ default: m.PrivacyPolicy })))
const TermsOfUse = lazy(() => import("@/pages/TermsOfUse").then((m) => ({ default: m.TermsOfUse })))

function App() {
  // dark-dominant site shell: nav + footer wrap every route, like the reference's shared chrome.
  const { pathname } = useLocation()
  // Fresh-page feel on route change (hash links keep their own scroll).
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return (
    <div style={{ background: "var(--zy-ink)", minHeight: "100dvh" }}>
      <SiteNav />
      <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forge" element={<Forge />} />
          <Route path="/forge/brands" element={<ForgeBrands />} />
          <Route path="/forge/agencies" element={<ForgeAgencies />} />
          <Route path="/forge/platforms" element={<ForgePlatforms />} />
          <Route path="/modern-ai-stack" element={<ModernAiStack />} />
          <Route path="/use-cases" element={<UseCases />} />
          <Route path="/ads-engineer" element={<AdsEngineer />} />
          <Route path="/early-access" element={<EarlyAccess />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
        </Routes>
      </Suspense>
      <SiteFooter />
    </div>
  )
}

export default App
