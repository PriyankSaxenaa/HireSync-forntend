// src/components/fx/FilterChips.jsx
import { motion } from "framer-motion";

/**
 * Row of single-select filter chips. The active highlight is one element moved
 * with `layoutId`, so selecting a different chip slides the pill across rather
 * than swapping backgrounds. `layoutId` must be unique per row on a page.
 */
const FilterChips = ({ options = [], value, onChange, layoutId = "hs-filter-pill", style }) => (
  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", ...style }}>
    {options.map((opt) => {
      const key = typeof opt === "string" ? opt : opt.key;
      const label = typeof opt === "string" ? opt : opt.label;
      const count = typeof opt === "string" ? undefined : opt.count;
      const active = value === key;

      return (
        <button
          key={key}
          onClick={() => onChange(key)}
          aria-pressed={active}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "8px 16px",
            borderRadius: "var(--hs-r-full)",
            fontSize: "12.5px",
            fontWeight: 700,
            textTransform: "capitalize",
            whiteSpace: "nowrap",
            color: active ? "#fff" : "var(--hs-muted)",
            background: active ? "transparent" : "var(--hs-surface)",
            border: `1px solid ${active ? "transparent" : "var(--hs-line)"}`,
            transition: "color 0.24s var(--hs-ease)",
          }}
        >
          {active && (
            <motion.span
              layoutId={layoutId}
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "var(--hs-r-full)",
                background: "var(--hs-a2)",
              }}
            />
          )}
          <span style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: "7px" }}>
            {label}
            {count !== undefined && <span style={{ fontSize: "11px", opacity: 0.8 }}>{count}</span>}
          </span>
        </button>
      );
    })}
  </div>
);

export default FilterChips;
