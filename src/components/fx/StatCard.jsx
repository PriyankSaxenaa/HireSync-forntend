// src/components/fx/StatCard.jsx
import { motion } from "framer-motion";
import SpotlightCard from "./SpotlightCard";
import Counter from "./Counter";

/**
 * The KPI tile used on every dashboard: a solid icon mark, an animated
 * count-up, and an optional progress rail. No drifting glow bloom behind
 * it — the number and label carry the weight.
 */
const StatCard = ({
  icon: Icon,
  label,
  value = 0,
  suffix = "",
  prefix = "",
  hint,
  tone = "var(--hs-a2-rgb)",
  progress,
  delay = 0,
  live = false,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
  >
    <SpotlightCard live={live} glow={tone} padding={0} style={{ height: "100%" }}>
      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
          {Icon && (
            <div
              style={{
                width: "42px",
                height: "42px",
                flexShrink: 0,
                borderRadius: "var(--hs-r)",
                display: "grid",
                placeItems: "center",
                background: `rgba(${tone},0.14)`,
                border: `1px solid rgba(${tone},0.3)`,
              }}
            >
              <Icon size={18} style={{ color: `rgb(${tone})` }} />
            </div>
          )}

          <div style={{ minWidth: 0, flex: 1 }}>
            <p
              style={{
                margin: 0,
                fontSize: "26px",
                fontWeight: 800,
                color: "var(--hs-text)",
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <Counter value={value} prefix={prefix} suffix={suffix} />
            </p>
            <p style={{ margin: "3px 0 0", fontSize: "12.5px", color: "var(--hs-muted)", fontWeight: 600 }}>
              {label}
            </p>
            {hint && (
              <p style={{ margin: "5px 0 0", fontSize: "11px", color: "var(--hs-dim)" }}>{hint}</p>
            )}
          </div>
        </div>

        {typeof progress === "number" && (
          <div
            style={{
              marginTop: "16px",
              height: "3px",
              borderRadius: "var(--hs-r-full)",
              background: "rgba(255,255,255,0.07)",
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
              transition={{ delay: delay + 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                height: "100%",
                borderRadius: "inherit",
                background: `rgb(${tone})`,
              }}
            />
          </div>
        )}
      </div>
    </SpotlightCard>
  </motion.div>
);

export default StatCard;
