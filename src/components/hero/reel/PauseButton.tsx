import { INK6, ON } from "./scenes"

/**
 * Corner pause/play control. The visual circle stays 30px (matches the ref),
 * but the button itself is a 44×44 hit area for touch accessibility.
 */
export function PauseButton({ paused, onToggle }: { paused: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
      aria-label={paused ? "Play demo" : "Pause demo"}
      style={{
        position: "absolute",
        bottom: 4,
        right: 4,
        zIndex: 9,
        width: 44,
        height: 44,
        display: "grid",
        placeItems: "center",
        padding: 0,
        background: "transparent",
        border: "none",
        cursor: "pointer",
      }}
    >
      <span
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(7,19,38,0.74)",
          border: `1px solid ${INK6}`,
          color: ON,
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
        }}
      >
        {paused ? (
          <svg width="11" height="12" viewBox="0 0 11 12" fill="none" aria-hidden="true">
            <path d="M1 1.2 9.6 6 1 10.8z" fill="currentColor" />
          </svg>
        ) : (
          <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true">
            <rect x="0.5" width="3" height="12" rx="1" fill="currentColor" />
            <rect x="6.5" width="3" height="12" rx="1" fill="currentColor" />
          </svg>
        )}
      </span>
    </button>
  )
}
