// src/components/fx/LiveBadge.jsx

/**
 * A small marker for genuinely realtime surfaces — a static dot, no
 * perpetual ping ring or bouncing equalizer. Used sparingly, only where data
 * is actually streaming in (sockets, live counts) rather than on every page.
 */
const LiveBadge = ({ label = "LIVE", tone = "var(--hs-a3-rgb)", style }) => (
  <span
    className="hs-eyebrow"
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "7px",
      padding: "5px 11px",
      borderRadius: "var(--hs-r-full)",
      border: "1px solid var(--hs-line-strong)",
      color: "var(--hs-muted)",
      fontSize: "10px",
      ...style,
    }}
  >
    <span
      style={{
        width: 5,
        height: 5,
        borderRadius: "50%",
        background: `rgb(${tone})`,
        flexShrink: 0,
      }}
    />
    {label}
  </span>
);

export default LiveBadge;
