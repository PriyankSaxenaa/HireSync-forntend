// src/components/dashboard/StatsCard.jsx
import StatCard from "../fx/StatCard";

// Legacy call sites pass a CSS gradient string; the shared tile takes an
// "r,g,b" tone instead, so lift the first colour out of the gradient.
const HEX = /#([0-9a-f]{6}|[0-9a-f]{3})/i;

const toneFromGradient = (gradient) => {
  const hex = String(gradient || "").match(HEX)?.[1];
  if (!hex) return undefined;
  const full = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
  const n = parseInt(full, 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
};

/** Admin KPI tile — an adapter over the shared StatCard. */
const StatsCard = ({ icon, label, value, color, hint, progress, delay = 0, live }) => (
  <StatCard
    icon={icon}
    label={label}
    value={value}
    hint={hint}
    progress={progress}
    delay={delay}
    live={live}
    tone={toneFromGradient(color)}
  />
);

export default StatsCard;
