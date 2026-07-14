/* eslint-disable react-refresh/only-export-components --
   barrel + scene registry: it instantiates scene elements and re-exports data,
   so it is intentionally not a hot-reloadable component module. */
import { DashboardScene, SourcesScene } from "./bucket-data"
import { ExecInput, ExecOutput } from "./bucket-execution"
import { OptInput, OptOutput } from "./bucket-optimise"
import { AudInput, AudOutput } from "./bucket-audience"
import { GovInput, GovOutput } from "./bucket-governance"
import { AUD_CLAUDE, DATA_CLAUDE, EXEC_CLAUDE, GOV_CLAUDE, OPT_CLAUDE } from "./data"
import type { Scene } from "./types"

/** The five reel scenes, one per bucket, in order. Input/output are static. */
export const SCENES: Scene[] = [
  { input: <SourcesScene />, output: <DashboardScene />, claude: DATA_CLAUDE },
  { input: <ExecInput />, output: <ExecOutput />, claude: EXEC_CLAUDE },
  { input: <OptInput />, output: <OptOutput />, claude: OPT_CLAUDE },
  { input: <AudInput />, output: <AudOutput />, claude: AUD_CLAUDE },
  { input: <GovInput />, output: <GovOutput />, claude: GOV_CLAUDE },
]

export { BUCKETS, ZYOU } from "./data"
export { SIG, INK, INK8, INK7, INK6, ON, MUT, FNT, mono, box } from "./palette"
export type { Bucket, ClaudeContent, Scene, ZyouData } from "./types"
