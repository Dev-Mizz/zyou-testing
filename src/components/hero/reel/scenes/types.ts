import type { ReactNode } from "react"

export type BucketKey = "data" | "execution" | "optimise" | "audience" | "governance"

export type Bucket = {
  n: string
  id: string
  key: BucketKey
  name: string
  full: string
  q: string
  h: string
  work: string[]
  out: string
  proof: string
}

/** Claude card content for one scene. chips = [label, suffix][]. */
export type ClaudeContent = {
  prompt: string
  reply: string
  chips: [string, string][]
}

/** A reel scene: the input + output cards and the Claude exchange. */
export type Scene = {
  input: ReactNode
  output: ReactNode
  claude: ClaudeContent
}

/** Zyou connector bar/strip data per bucket. steps = [label, value][]. */
export type ZyouData = {
  steps: [string, string][]
  cap: string
  num: string
}
