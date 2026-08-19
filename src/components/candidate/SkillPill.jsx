// src/components/candidate/SkillPill.jsx

// Matched skills go green; everything else follows the active role accent.
const TONES = {
  violet: "var(--hs-a1-rgb)",
  fuchsia: "var(--hs-a2-rgb)",
  accent: "var(--hs-a2-rgb)",
  green: "var(--hs-ok-rgb)",
  amber: "var(--hs-warn-rgb)",
  rose: "var(--hs-bad-rgb)",
  info: "var(--hs-info-rgb)",
};

/**
 * Skill chip. Matched skills get a small solid dot so the overlap between a
 * candidate and a role reads instantly, without a pulsing glow.
 */
const SkillPill = ({ children, tone = "violet", small = false }) => {
  const rgb = TONES[tone] || TONES.violet;
  const matched = tone === "green";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        fontSize: small ? "10.5px" : "11.5px",
        fontWeight: 700,
        color: `rgb(${rgb})`,
        background: `rgba(${rgb},0.12)`,
        border: `1px solid rgba(${rgb},0.28)`,
        padding: small ? "3px 10px" : "5px 12px",
        borderRadius: "var(--hs-r-full)",
        whiteSpace: "nowrap",
      }}
    >
      {matched && (
        <span
          style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", flexShrink: 0 }}
        />
      )}
      {children}
    </span>
  );
};

export default SkillPill;
