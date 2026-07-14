import { SIG } from "./scenes"
import type { Bucket } from "./scenes"

/** Bucket transition overlay — big number + bucket name, fades in/out. */
export function Broll({ bucket, show }: { bucket: Bucket; show: boolean }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        background: "rgba(4,16,31,0.82)",
        backdropFilter: "blur(3px)",
        WebkitBackdropFilter: "blur(3px)",
        opacity: show ? 1 : 0,
        pointerEvents: "none",
        transition: "opacity .5s var(--ease-standard)",
      }}
    >
      <span className="zy-data-mono" style={{ fontSize: "clamp(26px, 6vw, 48px)", color: SIG, letterSpacing: ".04em", textShadow: "0 0 24px rgba(0,224,213,0.4)" }}>
        {bucket.n}
      </span>
      <span style={{ fontFamily: "var(--zy-font-sans)", fontWeight: 700, fontSize: "clamp(17px, 3vw, 28px)", color: "#fff", letterSpacing: "-.01em", textAlign: "center", maxWidth: "20ch" }}>
        {bucket.full}
      </span>
    </div>
  )
}
