// src/components/fx/BarList.jsx
import { motion } from "framer-motion";

/**
 * Horizontal bar chart for ranked lists (applications per job, students per
 * group, …). Bars grow from zero on mount and carry a travelling sheen, so the
 * chart animates itself in rather than appearing fully formed.
 */
const BarList = ({ items = [], valueKey = "value", labelKey = "label", suffix = "", emptyLabel = "No data yet" }) => {
  if (items.length === 0) {
    return <p style={{ fontSize: "13px", color: "var(--hs-dim)", margin: 0 }}>{emptyLabel}</p>;
  }

  const max = Math.max(1, ...items.map((i) => Number(i[valueKey]) || 0));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      {items.map((item, i) => {
        const value = Number(item[valueKey]) || 0;
        const pct = (value / max) * 100;

        return (
          <div key={item.id || item.jobId || item[labelKey] || i}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "7px" }}>
              <span
                style={{
                  fontSize: "13px",
                  color: "var(--hs-text)",
                  fontWeight: 600,
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item[labelKey]}
              </span>
              <span
                style={{
                  fontSize: "13px",
                  color: "var(--hs-muted)",
                  fontWeight: 700,
                  flexShrink: 0,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {value}
                {suffix}
              </span>
            </div>

            <div
              style={{
                width: "100%",
                height: "8px",
                borderRadius: "var(--hs-r-full)",
                background: "rgba(255,255,255,0.055)",
                overflow: "hidden",
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ delay: Math.min(i * 0.07, 0.5), duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="hs-sheen"
                style={{
                  height: "100%",
                  borderRadius: "var(--hs-r-full)",
                  background: "var(--hs-grad)",
                  backgroundSize: "200% 100%",
                  boxShadow: "0 0 14px rgba(var(--hs-a2-rgb),0.35)",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BarList;
