// src/components/fx/Pagination.jsx
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Prev / next pager with a progress rail showing how far through the result
 * set you are. Renders nothing when there's only one page.
 */
const Pagination = ({ page, totalPages, onChange, total, label = "results" }) => {
  if (totalPages <= 1) return null;

  const btn = (disabled) => ({
    display: "flex",
    alignItems: "center",
    gap: "5px",
    border: "1px solid var(--hs-line)",
    background: "var(--hs-surface)",
    color: disabled ? "var(--hs-dim)" : "var(--hs-text)",
    padding: "9px 16px",
    borderRadius: "var(--hs-r-full)",
    fontSize: "12.5px",
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    transition: "all 0.2s var(--hs-ease)",
  });

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", marginTop: "28px" }}>
      <div
        style={{
          width: "min(320px, 100%)",
          height: "3px",
          borderRadius: "var(--hs-r-full)",
          background: "rgba(255,255,255,0.07)",
          overflow: "hidden",
        }}
      >
        <motion.div
          animate={{ width: `${(page / totalPages) * 100}%` }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="hs-sheen"
          style={{ height: "100%", borderRadius: "inherit", background: "var(--hs-grad)" }}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap", justifyContent: "center" }}>
        <button disabled={prevDisabled} onClick={() => onChange(page - 1)} style={btn(prevDisabled)}>
          <ChevronLeft size={14} /> Prev
        </button>

        <span style={{ fontSize: "12.5px", color: "var(--hs-muted)", fontWeight: 600 }}>
          Page <b style={{ color: "var(--hs-text)" }}>{page}</b> of {totalPages}
          {typeof total === "number" && (
            <span style={{ color: "var(--hs-dim)" }}>
              {" · "}
              {total} {label}
            </span>
          )}
        </span>

        <button disabled={nextDisabled} onClick={() => onChange(page + 1)} style={btn(nextDisabled)}>
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
