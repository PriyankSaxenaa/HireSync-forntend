// src/components/candidate/SkillPill.jsx
const SkillPill = ({ children, tone = "violet", small = false }) => {
  const tones = {
    violet: { bg: "rgba(139,92,246,0.14)", color: "#c4b5fd", border: "rgba(139,92,246,0.25)" },
    fuchsia: { bg: "rgba(217,70,239,0.14)", color: "#f0abfc", border: "rgba(217,70,239,0.25)" },
    green: { bg: "rgba(52,211,153,0.14)", color: "#6ee7b7", border: "rgba(52,211,153,0.25)" },
    amber: { bg: "rgba(251,191,36,0.14)", color: "#fcd34d", border: "rgba(251,191,36,0.25)" },
    rose: { bg: "rgba(251,113,133,0.14)", color: "#fda4af", border: "rgba(251,113,133,0.25)" },
  };
  const t = tones[tone] || tones.violet;
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: small ? "10.5px" : "11.5px",
        fontWeight: 700,
        color: t.color,
        background: t.bg,
        border: `1px solid ${t.border}`,
        padding: small ? "3px 9px" : "5px 12px",
        borderRadius: "999px",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
};

export default SkillPill;