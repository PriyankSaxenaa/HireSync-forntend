// src/components/common/StatusTicker.jsx
import Marquee from "../fx/Marquee";
import { capabilityTicker } from "../../constants/platformFacts";

/**
 * The thin technical strip above the nav — a status bar in spirit, listing
 * only capabilities that actually exist in the codebase. No usage claims,
 * no traffic numbers; just what's built.
 */
const StatusTicker = () => (
  <div
    style={{
      borderBottom: "1px solid var(--hs-line)",
      background: "var(--hs-bg)",
      overflow: "hidden",
    }}
  >
    <Marquee duration={32} gap={36} style={{ padding: "8px 0" }}>
      {capabilityTicker.map((c, i) => (
        <span
          key={c}
          className="hs-eyebrow"
          style={{ color: "var(--hs-dim)", paddingLeft: i === 0 ? "28px" : 0 }}
        >
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--hs-a3)", flexShrink: 0 }} />
          {c}
        </span>
      ))}
    </Marquee>
  </div>
);

export default StatusTicker;
