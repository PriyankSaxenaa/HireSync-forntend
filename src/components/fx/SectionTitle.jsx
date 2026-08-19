// src/components/fx/SectionTitle.jsx
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/**
 * Section heading with an accent bar that keeps its gradient flowing, and an
 * optional "see all" link whose arrow nudges on hover.
 */
const SectionTitle = ({ title, subtitle, icon: Icon, to, actionLabel = "View all", action, style }) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: "16px",
      flexWrap: "wrap",
      marginBottom: "16px",
      ...style,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
      <span
        aria-hidden="true"
        style={{
          width: "3px",
          height: "22px",
          borderRadius: "var(--hs-r-full)",
          flexShrink: 0,
          background: "var(--hs-a2)",
        }}
      />
      <div style={{ minWidth: 0 }}>
        <h2
          style={{
            margin: 0,
            fontSize: "17.5px",
            fontWeight: 800,
            color: "var(--hs-text)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {Icon && <Icon size={17} style={{ color: "var(--hs-a2)" }} />}
          {title}
        </h2>
        {subtitle && (
          <p style={{ margin: "3px 0 0", fontSize: "12.5px", color: "var(--hs-dim)" }}>{subtitle}</p>
        )}
      </div>
    </div>

    {action ||
      (to && (
        <Link
          to={to}
          className="hs-chip"
          style={{ fontSize: "12px", transition: "gap 0.2s var(--hs-ease)" }}
          onMouseEnter={(e) => (e.currentTarget.style.gap = "10px")}
          onMouseLeave={(e) => (e.currentTarget.style.gap = "6px")}
        >
          {actionLabel} <ArrowRight size={13} />
        </Link>
      ))}
  </div>
);

export default SectionTitle;
