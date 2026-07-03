import { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, LayoutGrid, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const navItems = [
  { to: "/recruiter/dashboard", label: "Overview", icon: LayoutGrid },
  { to: "/recruiter/jobs", label: "My Jobs", icon: Briefcase },
];

const RecruiterLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const activeIndex = navItems.findIndex((item) => location.pathname.startsWith(item.to));

  const initials = (user?.name || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0b0f17" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 40, padding: "18px 16px 0" }}>
        <div
          style={{
            maxWidth: "1160px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            padding: "14px 18px",
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(19,26,38,0.85)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
          }}
        >
          {/* Brand — full size */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "12px",
                background: "linear-gradient(135deg,#f59e0b,#f43f5e)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 20px rgba(244,63,94,0.35)",
                flexShrink: 0,
              }}
            >
              <Briefcase size={18} color="#fff" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                Hire<span style={{ color: "#fb923c" }}>Sync</span>
              </p>
              <span
                className="hidden sm:inline-block"
                style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", color: "#fca5a5" }}
              >
                RECRUITER
              </span>
            </div>
          </div>

          {/* Segmented-control style nav (desktop) */}
          <nav
            className="hidden md:flex"
            style={{
              position: "relative",
              alignItems: "center",
              gap: "2px",
              padding: "4px",
              borderRadius: "999px",
              background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {navItems.map(({ to, label, icon: Icon }, i) => (
              <NavLink
                key={to}
                to={to}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "8px 18px",
                  fontSize: "13.5px",
                  fontWeight: 600,
                  textDecoration: "none",
                  color: activeIndex === i ? "#fff" : "#94a3b8",
                  zIndex: 1,
                  transition: "color 0.2s",
                }}
              >
                {activeIndex === i && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "999px",
                      background: "linear-gradient(to right,#f59e0b,#f43f5e)",
                      zIndex: -1,
                    }}
                  />
                )}
                <Icon size={14} />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Avatar dropdown — handles nav (mobile) + logout (always) */}
          <div ref={menuRef} style={{ position: "relative", flexShrink: 0 }}>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setMenuOpen((o) => !o)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)",
                padding: "6px 12px 6px 6px",
                borderRadius: "999px",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#f59e0b,#f43f5e)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>
              <span
                className="hidden sm:inline-block"
                style={{
                  fontSize: "13px",
                  color: "#e2e8f0",
                  fontWeight: 600,
                  maxWidth: "110px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.name}
              </span>
              <motion.span animate={{ rotate: menuOpen ? 180 : 0 }} transition={{ duration: 0.15 }}>
                <ChevronDown size={14} color="#94a3b8" />
              </motion.span>
            </motion.button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  style={{
                    position: "absolute",
                    top: "calc(100% + 10px)",
                    right: 0,
                    width: "200px",
                    background: "#1a2231",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                    padding: "8px",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
                    transformOrigin: "top right",
                  }}
                >
                  {/* nav links — only shown on mobile, since desktop already has the segmented nav */}
                  <div className="md:hidden" style={{ marginBottom: "6px" }}>
                    {navItems.map(({ to, label, icon: Icon }) => (
                      <NavLink
                        key={to}
                        to={to}
                        onClick={() => setMenuOpen(false)}
                        style={({ isActive }) => ({
                          display: "flex",
                          alignItems: "center",
                          gap: "9px",
                          padding: "9px 10px",
                          borderRadius: "10px",
                          fontSize: "13px",
                          fontWeight: 600,
                          textDecoration: "none",
                          color: isActive ? "#fff" : "#cbd5e1",
                          background: isActive ? "linear-gradient(to right,#f59e0b,#f43f5e)" : "transparent",
                          marginBottom: "2px",
                        })}
                      >
                        <Icon size={14} />
                        {label}
                      </NavLink>
                    ))}
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", margin: "6px 4px" }} />
                  </div>

                  <p
                    style={{
                      margin: "2px 10px 8px",
                      fontSize: "11px",
                      color: "#64748b",
                      fontWeight: 600,
                      wordBreak: "break-all",
                    }}
                  >
                    {user?.email}
                  </p>
                  <motion.button
                    whileHover={{ background: "rgba(244,63,94,0.2)" }}
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      border: "none",
                      background: "rgba(244,63,94,0.12)",
                      color: "#fda4af",
                      padding: "9px 10px",
                      borderRadius: "9px",
                      fontSize: "13px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    <LogOut size={14} /> Logout
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px 60px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default RecruiterLayout;