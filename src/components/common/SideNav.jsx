// src/components/common/SideNav.jsx
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import Logo from "./Logo";
import { initialsOf } from "./UserMenu";

/**
 * Sticky glass sidebar shared by the candidate and admin shells, plus the
 * matching bottom bar for small screens.
 *
 * The active row's background is a single `layoutId` element, so it slides
 * between items as you navigate rather than blinking on and off.
 */
const SideNav = ({ navItems = [], user, roleLabel, onLogout, pillId = "hs-side-pill", tag, footer }) => {
  const location = useLocation();

  const activeTo = navItems.reduce(
    (best, item) =>
      location.pathname.startsWith(item.to) && item.to.length > (best?.length || 0) ? item.to : best,
    null
  );

  return (
    <>
      <aside
        className="hidden md:flex"
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "254px",
          flexShrink: 0,
          flexDirection: "column",
          padding: "24px 16px",
          borderRight: "1px solid var(--hs-line)",
          background: "var(--hs-bg-elev)",
        }}
      >
        <div style={{ padding: "0 6px", marginBottom: "30px" }}>
          <Logo size="sm" tag={tag} />
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "3px", flex: 1 }}>
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = activeTo === to;
            return (
              <NavLink
                key={to}
                to={to}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "11px 14px",
                  borderRadius: "var(--hs-r)",
                  fontSize: "13.5px",
                  fontWeight: 600,
                  color: active ? "#fff" : "var(--hs-muted)",
                  transition: "color 0.22s var(--hs-ease)",
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.color = "var(--hs-text)";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.color = "var(--hs-muted)";
                }}
              >
                {active && (
                  <motion.span
                    layoutId={pillId}
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "var(--hs-r)",
                      background: "var(--hs-surface-2)",
                      border: "1px solid var(--hs-line-strong)",
                    }}
                  />
                )}

                {/* Accent tab on the active row */}
                {active && (
                  <motion.span
                    layoutId={`${pillId}-bar`}
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    style={{
                      position: "absolute",
                      left: "-16px",
                      top: "50%",
                      marginTop: "-11px",
                      width: "3px",
                      height: "22px",
                      borderRadius: "0 4px 4px 0",
                      background: "var(--hs-a2)",
                    }}
                  />
                )}

                <span style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: "12px" }}>
                  <Icon size={17} style={{ color: active ? "var(--hs-a2)" : "inherit" }} />
                  {label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {footer}

        <div
          className="hs-card"
          style={{ marginTop: "14px", padding: "14px", borderRadius: "var(--hs-r)" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "11px", marginBottom: "12px" }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "12px",
                  fontWeight: 800,
                  color: "#fff",
                  background: "var(--hs-a2)",
                }}
              >
                {initialsOf(user?.name)}
              </div>
              <span
                style={{
                  position: "absolute",
                  bottom: "-1px",
                  right: "-1px",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "var(--hs-ok)",
                  border: "2px solid var(--hs-bg-elev)",
                }}
              />
            </div>

            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "var(--hs-text)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.name}
              </p>
              <p style={{ margin: 0, fontSize: "10.5px", color: "var(--hs-dim)" }}>{roleLabel}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "7px",
              border: "1px solid rgba(var(--hs-bad-rgb),0.24)",
              background: "rgba(var(--hs-bad-rgb),0.09)",
              color: "var(--hs-bad)",
              padding: "9px",
              borderRadius: "var(--hs-r-full)",
              fontSize: "12px",
              fontWeight: 700,
              transition: "background 0.2s var(--hs-ease)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(var(--hs-bad-rgb),0.2)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(var(--hs-bad-rgb),0.09)")}
          >
            <LogOut size={13} /> Log out
          </button>
        </div>
      </aside>

      {/* ── Mobile bottom bar ────────────────────────────────────────────── */}
      <nav
        // Display comes from the class so `md:hidden` can actually win — an
        // inline `display` would keep this bar on screen at desktop widths.
        className="flex md:hidden"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 60,
          justifyContent: "space-around",
          padding: "9px 6px calc(9px + env(safe-area-inset-bottom))",
          background: "var(--hs-bg-elev)",
          borderTop: "1px solid var(--hs-line)",
        }}
      >
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = activeTo === to;
          return (
            <NavLink
              key={to}
              to={to}
              aria-label={label}
              style={{
                position: "relative",
                display: "grid",
                placeItems: "center",
                width: "46px",
                height: "42px",
                borderRadius: "var(--hs-r-sm)",
                color: active ? "var(--hs-a2)" : "var(--hs-dim)",
                transition: "color 0.2s var(--hs-ease)",
              }}
            >
              {active && (
                <motion.span
                  layoutId={`${pillId}-mobile`}
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "var(--hs-r-sm)",
                    background: "rgba(var(--hs-a2-rgb),0.14)",
                  }}
                />
              )}
              <Icon size={19} style={{ position: "relative" }} />
            </NavLink>
          );
        })}
      </nav>
    </>
  );
};

export default SideNav;
