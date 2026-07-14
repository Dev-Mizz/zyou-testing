import { Stagger } from "@/components/motion/Stagger"
import { Button } from "@/components/ui/Button"
import { useMediaQuery } from "@/hooks/use-motion"
import { StackInfographic } from "@/components/stack/StackInfographic"
import { Ledger } from "@/components/stack/Ledger"

/**
 * §3 What Zyou is — the execution layer for advertising. Left: the precedent
 * narrative + ledger. Right: the L1–L5 stack.
 */
export function WhatIs() {
  const wide = useMediaQuery("(min-width: 960px)")
  return (
    <section id="whatis" style={{ position: "relative", overflow: "hidden", padding: "120px 24px", borderTop: "1px solid var(--zy-border-on-dark)" }}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background: "radial-gradient(40% 50% at 70% 40%, rgba(0,224,213,0.12), transparent 70%)",
          filter: "blur(120px)",
          animation: "zy-breathe 9s var(--ease-standard) infinite",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1180, margin: "0 auto" }}>
        <Stagger style={{ textAlign: "left" }}>
          <span className="zy-label-mono" style={{ display: "block", color: "var(--zy-signal)" }}>WHAT ZYOU IS</span>
          <h2 className="zy-headline-md" style={{ margin: "16px 0 0", fontSize: "clamp(21px, 3.2vw, 34px)" }}>
            Zyou is the <span style={{ color: "var(--zy-signal)" }}>execution layer</span> for advertising that we deploy and your ads team runs.
          </h2>
        </Stagger>

        <div style={{ display: "grid", gridTemplateColumns: wide ? "minmax(0,44%) minmax(0,56%)" : "1fr", gap: wide ? 52 : 40, alignItems: "center", marginTop: 40 }}>
          {/* LEFT — narrative + ledger */}
          <div>
            <p className="zy-body-lg" style={{ color: "var(--zy-on-dark-muted)", margin: 0, maxWidth: "46ch" }}>
              Stripe built it for payments. Twilio for communications. Unity for gaming. Salesforce for customer data. LangChain for agents.{" "}
              <span style={{ color: "var(--zy-on-dark)", fontWeight: 600 }}>Zyou builds it for advertising</span>, in the agentic era.
            </p>
            <Ledger />
            <div style={{ marginTop: 28 }}>
              <Button variant="secondary" size="lg" href="/modern-ai-stack">
                See the Modern AI Stack
              </Button>
            </div>
          </div>

          {/* RIGHT — the stack */}
          <div>
            <StackInfographic />
            <p className="zy-data-mono" style={{ fontSize: 12, lineHeight: 1.5, color: "var(--zy-on-dark-muted)", margin: "8px 0 0", textAlign: "center", letterSpacing: ".02em" }}>
              The execution layer that makes ad agents <span style={{ color: "var(--zy-signal)" }}>accurate, optimised and secure.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
