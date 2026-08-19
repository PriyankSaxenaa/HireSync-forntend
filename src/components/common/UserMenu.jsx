// src/components/common/UserMenu.jsx
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LogOut } from "lucide-react";

/** Two-letter initials, falling back to "?" for an unnamed account. */
export const initialsOf = (name) =>
  (name || "?")
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

/**
 * Avatar dropdown used across the top-bar layouts. On mobile it doubles as the
 * nav menu, since the segmented desktop nav is hidden at that width.
 */
const UserMenu = ({ user, roleLabel, navItems = [], onLogout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Account menu"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          border: "1px solid var(--hs-line)",
          background: "var(--hs-surface)",
          padding: "5px 12px 5px 5px",
          borderRadius: "var(--hs-r-full)",
          transition: "border-color 0.2s var(--hs-ease)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(var(--hs-a2-rgb),0.45)")}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--hs-line)")}
      >
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              fontSize: "11.5px",
              fontWeight: 800,
              color: "#fff",
              background: "var(--hs-a2)",
            }}
          >
            {initialsOf(user?.name)}
          </div>
          {/* Presence dot */}
          <span
            style={{
              position: "absolute",
              bottom: "-1px",
              right: "-1px",
              width: "9px",
              height: "9px",
              borderRadius: "50%",
              background: "var(--hs-ok)",
              border: "2px solid var(--hs-bg-elev)",
            }}
          />
        </div>

        <span
          className="hidden sm:inline-block"
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--hs-text)",
            maxWidth: "120px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {user?.name}
        </span>

        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18 }} style={{ display: "grid" }}>
          <ChevronDown size={14} style={{ color: "var(--hs-dim)" }} />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="hs-card"
            style={{
              position: "absolute",
              top: "calc(100% + 12px)",
              right: 0,
              width: "224px",
              padding: "9px",
              zIndex: 70,
              transformOrigin: "top right",
              background: "var(--hs-bg-elev)",
              boxShadow: "var(--hs-shadow-lg)",
            }}
          >
            <div style={{ padding: "8px 10px 12px", borderBottom: "1px solid var(--hs-line)", marginBottom: "8px" }}>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "var(--hs-text)" }}>{user?.name}</p>
              <p style={{ margin: "2px 0 0", fontSize: "11px", color: "var(--hs-dim)", wordBreak: "break-all" }}>
                {user?.email}
              </p>
              {roleLabel && (
                <span className="hs-chip" style={{ marginTop: "9px", fontSize: "9.5px", padding: "3px 9px" }}>
                  {roleLabel}
                </span>
              )}
            </div>

            {/* Nav links only surface on mobile — desktop already has the pill nav */}
            {navItems.length > 0 && (
              <div className="md:hidden" style={{ marginBottom: "8px" }}>
                {navItems.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setOpen(false)}
                    style={({ isActive }) => ({
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 11px",
                      borderRadius: "var(--hs-r-sm)",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: isActive ? "#fff" : "var(--hs-muted)",
                      background: isActive ? "var(--hs-a2)" : "transparent",
                      marginBottom: "2px",
                    })}
                  >
                    {Icon && <Icon size={14} />}
                    {label}
                  </NavLink>
                ))}
                <div style={{ borderTop: "1px solid var(--hs-line)", margin: "8px 4px" }} />
              </div>
            )}

            <button
              onClick={() => {
                setOpen(false);
                onLogout?.();
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "9px",
                border: "1px solid rgba(var(--hs-bad-rgb),0.24)",
                background: "rgba(var(--hs-bad-rgb),0.1)",
                color: "var(--hs-bad)",
                padding: "10px 11px",
                borderRadius: "var(--hs-r-full)",
                fontSize: "13px",
                fontWeight: 700,
                transition: "background 0.2s var(--hs-ease)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(var(--hs-bad-rgb),0.2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(var(--hs-bad-rgb),0.1)")}
            >
              <LogOut size={14} /> Log out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
