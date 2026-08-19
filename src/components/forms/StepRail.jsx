// src/components/forms/StepRail.jsx
import { motion } from "framer-motion";
import { Check } from "lucide-react";

/**
 * Progress rail for the multi-step auth flows. Completed segments fill with
 * the accent gradient, and the segment you're currently on keeps a light
 * sweeping through it so the form always reads as "in progress".
 */
const StepRail = ({ step = 1, steps = ["Email", "Verify", "Details"], style }) => (
  <div style={{ marginBottom: "28px", ...style }}>
    <div style={{ display: "flex", gap: "7px", marginBottom: "12px" }}>
      {steps.map((_, i) => {
        const n = i + 1;
        const done = n < step;
        const current = n === step;

        return (
          <div
            key={n}
            style={{
              flex: 1,
              height: "3px",
              borderRadius: "var(--hs-r-full)",
              overflow: "hidden",
              background: "rgba(255,255,255,0.09)",
            }}
          >
            <motion.div
              initial={false}
              animate={{ width: done || current ? "100%" : "0%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                height: "100%",
                borderRadius: "inherit",
                background: "var(--hs-a2)",
              }}
            />
          </div>
        );
      })}
    </div>

    <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
      {steps.map((label, i) => {
        const n = i + 1;
        const done = n < step;
        const current = n === step;

        return (
          <span
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "10.5px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: current ? "var(--hs-a2)" : done ? "var(--hs-muted)" : "var(--hs-dim)",
              transition: "color 0.3s var(--hs-ease)",
            }}
          >
            {done && <Check size={11} />}
            {label}
          </span>
        );
      })}
    </div>
  </div>
);

export default StepRail;
