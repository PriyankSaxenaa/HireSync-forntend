// src/components/fx/Drawer.jsx
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

/**
 * Right-hand slide-over panel for detail views. Same dismissal rules as Modal
 * (backdrop click, Escape) plus a body-scroll lock while open.
 */
const Drawer = ({ open, onClose, title, subtitle, icon: Icon, children, footer, width = 460 }) => {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onEsc);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            display: "flex",
            justifyContent: "flex-end",
            background: "rgba(3,2,8,0.68)",
            backdropFilter: "blur(7px)",
            WebkitBackdropFilter: "blur(7px)",
          }}
        >
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: `${width}px`,
              height: "100%",
              overflowY: "auto",
              padding: "26px",
              background: "var(--hs-bg-elev)",
              borderLeft: "1px solid var(--hs-line)",
              boxShadow: "-24px 0 70px rgba(0,0,0,0.6)",
            }}
          >
            {/* A single static accent rail down the leading edge */}
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "2px",
                background: "var(--hs-a2)",
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "14px",
                marginBottom: "22px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                {Icon && (
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      flexShrink: 0,
                      borderRadius: "var(--hs-r)",
                      display: "grid",
                      placeItems: "center",
                      background: "rgba(var(--hs-a2-rgb),0.14)",
                      border: "1px solid rgba(var(--hs-a2-rgb),0.3)",
                    }}
                  >
                    <Icon size={18} style={{ color: "var(--hs-a3)" }} />
                  </div>
                )}
                <div style={{ minWidth: 0 }}>
                  {title && (
                    <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "var(--hs-text)" }}>{title}</h3>
                  )}
                  {subtitle && (
                    <p style={{ margin: "3px 0 0", fontSize: "12px", color: "var(--hs-muted)" }}>{subtitle}</p>
                  )}
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label="Close"
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: "32px",
                  height: "32px",
                  flexShrink: 0,
                  border: "1px solid var(--hs-line)",
                  borderRadius: "var(--hs-r-full)",
                  background: "transparent",
                  color: "var(--hs-muted)",
                  transition: "all 0.2s var(--hs-ease)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(var(--hs-bad-rgb),0.14)";
                  e.currentTarget.style.color = "var(--hs-bad)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--hs-muted)";
                }}
              >
                <X size={16} />
              </button>
            </div>

            {children}

            {footer && <div style={{ marginTop: "22px" }}>{footer}</div>}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Drawer;
