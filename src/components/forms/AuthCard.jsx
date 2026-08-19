// src/components/forms/AuthCard.jsx
import { motion } from "framer-motion";

/**
 * The panel every auth form sits in — a softly glassy surface with a violet
 * hairline, calm rather than busy: no orbiting border light, no scanline.
 */
const AuthCard = ({ title, subtitle, children, footer, width = 440 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    className="hs-glass"
    style={{
      width: "100%",
      maxWidth: `${width}px`,
      padding: "clamp(26px, 4vw, 40px)",
    }}
  >
    <div style={{ position: "relative", zIndex: 2 }}>
      <h1
        style={{
          margin: 0,
          fontSize: "clamp(23px, 3vw, 29px)",
          fontWeight: 900,
          letterSpacing: "-0.028em",
          color: "var(--hs-text)",
        }}
      >
        {title}
      </h1>

      {subtitle && (
        <p style={{ margin: "9px 0 28px", fontSize: "13.5px", lineHeight: 1.6, color: "var(--hs-muted)" }}>
          {subtitle}
        </p>
      )}

      {children}

      {footer && (
        <p
          style={{
            marginTop: "24px",
            textAlign: "center",
            fontSize: "13.5px",
            color: "var(--hs-muted)",
          }}
        >
          {footer}
        </p>
      )}
    </div>
  </motion.div>
);

export default AuthCard;
