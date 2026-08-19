// src/components/fx/EmptyState.jsx
import { motion } from "framer-motion";

/**
 * "Nothing here yet" — a dashed frame and a solid icon mark. No pinging
 * radar rings, no floating loop; the emptiness is the message.
 */
const EmptyState = ({ icon: Icon, title, subtitle, action, compact = false }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    style={{
      textAlign: "center",
      padding: compact ? "40px 22px" : "64px 26px",
      border: "1px dashed var(--hs-line-strong)",
      borderRadius: "var(--hs-r-lg)",
      background: "rgba(255,255,255,0.015)",
    }}
  >
    {Icon && (
      <div
        style={{
          width: 56,
          height: 56,
          margin: "0 auto 18px",
          borderRadius: "var(--hs-r)",
          display: "grid",
          placeItems: "center",
          background: "rgba(var(--hs-a2-rgb),0.12)",
          border: "1px solid rgba(var(--hs-a2-rgb),0.3)",
        }}
      >
        <Icon size={24} style={{ color: "var(--hs-a3)" }} />
      </div>
    )}

    <p style={{ margin: "0 0 7px", fontSize: "15.5px", fontWeight: 800, color: "var(--hs-text)" }}>{title}</p>

    {subtitle && (
      <p
        style={{
          margin: "0 auto 20px",
          fontSize: "13px",
          lineHeight: 1.65,
          color: "var(--hs-muted)",
          maxWidth: "420px",
        }}
      >
        {subtitle}
      </p>
    )}

    {action}
  </motion.div>
);

export default EmptyState;
