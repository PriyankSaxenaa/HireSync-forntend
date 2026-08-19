// src/components/fx/ProgressRing.jsx
import { motion } from "framer-motion";

/**
 * Circular progress with a gradient stroke that draws itself in, plus a
 * dashed guide ring rotating slowly behind it.
 */
const ProgressRing = ({
  value = 0,
  size = 96,
  stroke = 7,
  label,
  gradientId = "hs-ring",
  children,
}) => {
  const clamped = Math.max(0, Math.min(100, Number(value) || 0));
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const uid = `${gradientId}-${size}-${stroke}`;

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id={uid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--hs-a2)" />
            <stop offset="100%" stopColor="var(--hs-a3)" />
          </linearGradient>
        </defs>

        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />

        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${uid})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (clamped / 100) * circumference }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          textAlign: "center",
        }}
      >
        {children || (
          <div>
            <p style={{ margin: 0, fontSize: size > 80 ? "20px" : "15px", fontWeight: 800, color: "var(--hs-text)" }}>
              {Math.round(clamped)}%
            </p>
            {label && (
              <p style={{ margin: 0, fontSize: "9.5px", color: "var(--hs-dim)", fontWeight: 700, letterSpacing: "0.06em" }}>
                {label}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressRing;
