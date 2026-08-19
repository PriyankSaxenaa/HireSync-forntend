// src/components/fx/PageHeader.jsx
import { motion } from "framer-motion";
import LiveBadge from "./LiveBadge";

/**
 * The banner that opens every dashboard page. A soft glass panel (via
 * .hs-card) with a plain uppercase eyebrow and a confident white title — the
 * page background's spotlight bleeds through it, so this doesn't need one
 * of its own.
 */
const PageHeader = ({
  eyebrow,
  title,
  subtitle,
  icon: Icon,
  actions,
  live = false,
  liveLabel = "LIVE",
  compact = false,
  children,
}) => (
  <motion.header
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    className="hs-card"
    style={{
      position: "relative",
      borderRadius: "var(--hs-r-lg)",
      padding: compact ? "22px 24px" : "28px 30px 26px",
      marginBottom: "24px",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "20px",
        flexWrap: "wrap",
      }}
    >
      <div style={{ minWidth: 0, flex: "1 1 340px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "11px" }}>
          {eyebrow && (
            <span className="hs-eyebrow">
              {Icon && <Icon size={13} />}
              {eyebrow}
            </span>
          )}
          {live && <LiveBadge label={liveLabel} />}
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: compact ? "clamp(19px,2.2vw,24px)" : "clamp(23px,3vw,32px)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "var(--hs-text)",
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            style={{
              margin: "9px 0 0",
              fontSize: "13.5px",
              lineHeight: 1.65,
              color: "var(--hs-muted)",
              maxWidth: "620px",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", flexShrink: 0 }}>
          {actions}
        </div>
      )}
    </div>

    {children && <div style={{ marginTop: "20px" }}>{children}</div>}
  </motion.header>
);

export default PageHeader;
