import { lazy, Suspense } from "react"
import { Hero } from "@/components/hero/Hero"
import { Seo } from "@/components/ui/Seo"
import { CALENDLY } from "@/lib/links"

// Hero ships in the initial bundle; everything below it (and its heavier deps)
// loads as a separate chunk so first paint on mobile is fast.
const HomeBelow = lazy(() => import("./HomeBelow"))

/** Homepage — the dark-dominant long scroll. */
export function Home() {
  const onChat = () => window.open(CALENDLY, "_blank", "noopener,noreferrer")
  return (
    <>
      <Seo
        title="Zyou | AI Team for Advertising Operations"
        description="Zyou is a forward deployed AI team for advertising operations. We build agents for media planning, campaign creation, analysis, and optimisation on our own infrastructure."
        canonical="https://zyou.ai/"
      />
      <Hero />
      <Suspense fallback={null}>
        <HomeBelow onChat={onChat} />
      </Suspense>
    </>
  )
}

