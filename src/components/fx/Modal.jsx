// src/components/fx/Modal.jsx
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

/**
 * Centred dialog on a blurred scrim. Closes on backdrop click or Escape, and
 * locks body scroll while it's open.
 */
const Modal = ({ open, onClose, title, subtitle, icon: Icon, children, footer, width = 460 }) => {
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
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            background: "rgba(3,2,8,0.72)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 18 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 12 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="hs-card"
            style={{
              width: "100%",
              maxWidth: `${width}px`,
              maxHeight: "88vh",
              overflowY: "auto",
              borderRadius: "var(--hs-r-lg)",
              padding: "26px",
              background: "var(--hs-bg-elev)",
              boxShadow: "var(--hs-shadow-lg)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "14px",
                marginBottom: children ? "20px" : 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                {Icon && (
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      flexShrink: 0,
                      borderRadius: "var(--hs-r)",
                      display: "grid",
                      placeItems: "center",
                      background: "rgba(var(--hs-a2-rgb),0.14)",
                      border: "1px solid rgba(var(--hs-a2-rgb),0.3)",
                    }}
                  >
                    <Icon size={17} style={{ color: "var(--hs-a3)" }} />
                  </div>
                )}
                <div style={{ minWidth: 0 }}>
                  {title && (
                    <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: "var(--hs-text)" }}>
                      {title}
                    </h3>
                  )}
                  {subtitle && (
                    <p style={{ margin: "3px 0 0", fontSize: "12.5px", color: "var(--hs-muted)" }}>{subtitle}</p>
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

            {footer && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "9px",
                  marginTop: "22px",
                  paddingTop: "18px",
                  borderTop: "1px solid var(--hs-line)",
                }}
              >
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
