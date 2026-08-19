// src/components/common/Logo.jsx
import { motion } from "framer-motion";

/**
 * The mark: a solid square with the sync glyph, next to a tight wordmark.
 * No spinning rings, no pulsing dot — a confident, static mark that only
 * moves once, on entrance.
 */
const Logo = ({ size = "md", tag, showMark = true }) => {
  const scale = { sm: 0.8, md: 1, lg: 1.25 }[size] || 1;
  const box = Math.round(34 * scale);
  const type = Math.round(19 * scale);

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: "flex", alignItems: "center", gap: `${9 * scale}px`, userSelect: "none" }}
    >
      {showMark && (
        <div
          style={{
            width: box,
            height: box,
            flexShrink: 0,
            borderRadius: `${6 * scale}px`,
            background: "var(--hs-a2)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <svg width={box * 0.5} height={box * 0.5} viewBox="0 0 24 24" fill="none">
            <path
              d="M4 9a8 8 0 0 1 13.5-5.8L20 5.5"
              stroke="#fff"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20 15A8 8 0 0 1 6.5 20.8L4 18.5"
              stroke="#fff"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="20" cy="4" r="1.8" fill="#fff" />
            <circle cx="4" cy="20" r="1.8" fill="#fff" />
          </svg>
        </div>
      )}

      <div style={{ lineHeight: 1 }}>
        <p
          style={{
            margin: 0,
            fontSize: `${type}px`,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "var(--hs-text)",
          }}
        >
          Hire<span style={{ color: "var(--hs-a3)" }}>Sync</span>
        </p>
        {tag && (
          <span
            style={{
              display: "inline-block",
              marginTop: "3px",
              fontSize: `${9 * scale}px`,
              fontWeight: 700,
              letterSpacing: "0.18em",
              color: "var(--hs-dim)",
            }}
          >
            {tag}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default Logo;
