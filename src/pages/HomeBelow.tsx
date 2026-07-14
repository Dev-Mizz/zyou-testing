import { SiteMoment } from "@/components/site-moment/SiteMoment"
import { WhatIs } from "@/components/what-is/WhatIs"
import { Team } from "@/components/team/Team"
import { HowWeWork } from "@/components/how-we-work/HowWeWork"
import { SiteCapstone } from "@/components/site-capstone/SiteCapstone"

/**
 * Everything below the homepage hero. Lazy-loaded as its own chunk so the
 * hero paints immediately on mobile; these sections (and react-icons / the
 * stack / scroll engines they pull in) stream in right after.
 */
export default function HomeBelow({ onChat }: { onChat: () => void }) {
  return (
    <>
      <SiteMoment />
      <WhatIs />
      <Team />
      <HowWeWork />
      <SiteCapstone onChat={onChat} />
    </>
  )
}
