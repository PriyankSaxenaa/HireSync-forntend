// src/components/fx/BackLink.jsx
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

/** "Back" control whose arrow slides left on hover. */
const BackLink = ({ to, label = "Back", style }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => (to ? navigate(to) : navigate(-1))}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "7px",
        border: "1px solid var(--hs-line)",
        background: "var(--hs-surface)",
        color: "var(--hs-muted)",
        fontSize: "12.5px",
        fontWeight: 700,
        padding: "8px 15px",
        borderRadius: "var(--hs-r-full)",
        marginBottom: "18px",
        transition: "all 0.22s var(--hs-ease)",
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "var(--hs-text)";
        e.currentTarget.style.borderColor = "rgba(var(--hs-a2-rgb),0.45)";
        e.currentTarget.style.transform = "translateX(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--hs-muted)";
        e.currentTarget.style.borderColor = "var(--hs-line)";
        e.currentTarget.style.transform = "none";
      }}
    >
      <ArrowLeft size={14} /> {label}
    </button>
  );
};

export default BackLink;
