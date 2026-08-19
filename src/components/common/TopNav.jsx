// src/components/common/TopNav.jsx
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "./Logo";

/**
 * Floating pill navigation used by the recruiter and TPO shells.
 *
 * The active indicator is a single element moved between links with
 * `layoutId`, so it physically slides across on navigation instead of
 * cross-fading. `pillId` keeps each layout's indicator independent.
 */
const TopNav = ({ navItems = [], tag, pillId = "hs-top-pill", right, maxWidth = 1200 }) => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Longest matching prefix wins, so /tpo/drives doesn't also light /tpo.
  const activeIndex = navItems.reduce(
    (best, item, i) =>
      location.pathname.startsWith(item.to) && item.to.length > (navItems[best]?.to.length || 0) ? i : best,
    navItems.findIndex((item) => location.pathname.startsWith(item.to))
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 50, padding: "16px 16px 0" }}>
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="hs-card"
        style={{
          maxWidth: `${maxWidth}px`,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          padding: "11px 14px 11px 18px",
          borderRadius: "var(--hs-r-lg)",
          background: scrolled ? "var(--hs-bg-elev)" : "var(--hs-surface)",
          boxShadow: scrolled ? "var(--hs-shadow)" : "var(--hs-shadow-sm)",
          transition: "background 0.35s var(--hs-ease), box-shadow 0.35s var(--hs-ease)",
        }}
      >
        <NavLink to={navItems[0]?.to || "/"} style={{ flexShrink: 0 }}>
          <Logo size="sm" tag={tag} />
        </NavLink>

        <nav
          className="hidden md:flex"
          style={{
            position: "relative",
            alignItems: "center",
            gap: "2px",
            padding: "4px",
            borderRadius: "var(--hs-r-full)",
            background: "rgba(0,0,0,0.32)",
            border: "1px solid var(--hs-line)",
          }}
        >
          {navItems.map(({ to, label, icon: Icon }, i) => {
            const active = activeIndex === i;
            return (
              <NavLink
                key={to}
                to={to}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "8px 16px",
                  fontSize: "13px",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  color: active ? "#fff" : "var(--hs-muted)",
                  transition: "color 0.24s var(--hs-ease)",
                }}
              >
                {active && (
                  <motion.span
                    layoutId={pillId}
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "var(--hs-r-full)",
                      background: "var(--hs-a2)",
                    }}
                  />
                )}
                <span style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: "7px" }}>
                  {Icon && <Icon size={14} />}
                  {label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>{right}</div>
      </motion.div>
    </div>
  );
};

export default TopNav;
