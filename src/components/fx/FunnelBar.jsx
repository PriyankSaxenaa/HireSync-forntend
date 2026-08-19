// src/components/fx/FunnelBar.jsx
import { motion } from "framer-motion";
import Counter from "./Counter";

/**
 * Single stacked bar showing how a total splits across statuses, with a legend
 * underneath. Segments grow into place on mount and each keeps a light sweep
 * running.
 */
const FunnelBar = ({ segments = [], total = 0, emptyLabel = "No data yet" }) => {
  if (!total) {
    return <p style={{ fontSize: "13px", color: "var(--hs-dim)", margin: 0 }}>{emptyLabel}</p>;
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "3px",
          width: "100%",
          height: "14px",
          borderRadius: "var(--hs-r-full)",
          overflow: "hidden",
          background: "rgba(255,255,255,0.055)",
          marginBottom: "18px",
        }}
      >
        {segments.map((s, i) => {
          const pct = (s.value / total) * 100;
          if (!pct) return null;
          return (
            <motion.div
              key={s.label}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ delay: i * 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              title={`${s.label}: ${s.value}`}
              className="hs-sheen"
              style={{
                background: `rgb(${s.tone})`,
                borderRadius: "var(--hs-r-full)",
                boxShadow: `0 0 14px rgba(${s.tone},0.4)`,
              }}
            />
          );
        })}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "22px" }}>
        {segments.map((s) => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: `rgb(${s.tone})`, display: "grid", placeItems: "center" }}>
              <span className="hs-pulse-dot" style={{ width: 8, height: 8 }} />
            </span>
            {s.icon && <s.icon size={14} style={{ color: `rgb(${s.tone})` }} />}
            <span style={{ fontSize: "13px", color: "var(--hs-muted)" }}>{s.label}</span>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 800,
                color: "var(--hs-text)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <Counter value={s.value} />
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default FunnelBar;
