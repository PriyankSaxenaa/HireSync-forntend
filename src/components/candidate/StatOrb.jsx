// src/components/candidate/StatOrb.jsx
import StatCard from "../fx/StatCard";

// Legacy call sites pass a CSS gradient string; the new tile is driven by an
// "r,g,b" tone instead, so pull the first colour out of the gradient.
const HEX = /#([0-9a-f]{6}|[0-9a-f]{3})/i;

const toneFromGradient = (gradient) => {
  const hex = String(gradient || "").match(HEX)?.[1];
  if (!hex) return undefined;
  const full = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
  const n = parseInt(full, 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
};

/**
 * Candidate KPI tile — a thin adapter over the shared StatCard so the
 * dashboard's existing props keep working.
 */
const StatOrb = ({ icon, label, value, gradient, delay = 0, suffix = "", hint, progress }) => (
  <StatCard
    icon={icon}
    label={label}
    value={value}
    suffix={suffix}
    hint={hint}
    progress={progress}
    delay={delay}
    tone={toneFromGradient(gradient)}
  />
);

export default StatOrb;
