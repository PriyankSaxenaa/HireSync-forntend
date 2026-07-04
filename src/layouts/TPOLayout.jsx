// src/layouts/TPOLayout.jsx
import { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutGrid,
  GraduationCap,
  Users2,
  CalendarClock,
  School,
  LogOut,
  ChevronDown,
  Bell,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import api from "../api/axios";

const navItems = [
  { to: "/tpo/dashboard", label: "Overview", icon: LayoutGrid },
  { to: "/tpo/students", label: "Students", icon: GraduationCap },
  { to: "/tpo/placement-groups", label: "Groups", icon: Users2 },
  { to: "/tpo/drives", label: "Drives", icon: CalendarClock },
  { to: "/tpo/college", label: "College", icon: School },
];

const TPOLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const menuRef = useRef(null);
  const bellRef = useRef(null);
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

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/notifications");
      setNotifications(data.notifications || []);
      setUnread(data.unread || 0);
    } catch {
      // silent — bell just stays empty
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put("/notifications/read");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnread(0);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 45000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0714" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 40, padding: "18px 16px 0" }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            padding: "14px 18px",
            borderRadius: "20px",
            border: "1px solid rgba(216,180,254,0.12)",
            background: "rgba(30,17,51,0.85)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
          }}
        >
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "12px",
                background: "linear-gradient(135deg,#8b5cf6,#d946ef)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 20px rgba(217,70,239,0.35)",
                flexShrink: 0,
              }}
            >
              <School size={18} color="#fff" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                Hire<span style={{ color: "#e879f9" }}>Sync</span>
              </p>
              <span
                className="hidden sm:inline-block"
                style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", color: "#d8b4fe" }}
              >
                PLACEMENT CELL
              </span>
            </div>
          </div>

          {/* Segmented nav (desktop) */}
          <nav
            className="hidden md:flex"
            style={{
              position: "relative",
              alignItems: "center",
              gap: "2px",
              padding: "4px",
              borderRadius: "999px",
              background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(216,180,254,0.08)",
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
                  padding: "8px 16px",
                  fontSize: "13px",
                  fontWeight: 600,
                  textDecoration: "none",
                  color: activeIndex === i ? "#fff" : "#c4b5fd",
                  zIndex: 1,
                  whiteSpace: "nowrap",
                  transition: "color 0.2s",
                }}
              >
                {activeIndex === i && (
                  <motion.span
                    layoutId="tpo-nav-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "999px",
                      background: "linear-gradient(to right,#8b5cf6,#d946ef)",
                      zIndex: -1,
                    }}
                  />
                )}
                <Icon size={14} />
                {label}
              </NavLink>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            {/* Notification bell */}
            <div ref={bellRef} style={{ position: "relative" }}>
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => setBellOpen((o) => !o)}
                style={{
                  position: "relative",
                  width: "38px",
                  height: "38px",
                  borderRadius: "999px",
                  border: "1px solid rgba(216,180,254,0.15)",
                  background: "rgba(255,255,255,0.04)",
                  color: "#e9d5ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <Bell size={16} />
                {unread > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "3px",
                      right: "3px",
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#f472b6",
                      boxShadow: "0 0 0 2px rgba(30,17,51,1)",
                    }}
                  />
                )}
              </motion.button>

              <AnimatePresence>
                {bellOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: "absolute",
                      top: "calc(100% + 10px)",
                      right: 0,
                      width: "300px",
                      maxHeight: "360px",
                      overflowY: "auto",
                      background: "#1a1030",
                      border: "1px solid rgba(216,180,254,0.15)",
                      borderRadius: "16px",
                      padding: "10px",
                      boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
                      zIndex: 60,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 6px 10px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#e9d5ff" }}>Notifications</span>
                      {unread > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          style={{ border: "none", background: "transparent", color: "#f0abfc", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    {notifications.length === 0 && (
                      <p style={{ fontSize: "12px", color: "#7c6f93", textAlign: "center", padding: "20px 0" }}>You're all caught up.</p>
                    )}
                    {notifications.slice(0, 10).map((n) => (
                      <div
                        key={n._id}
                        style={{
                          padding: "10px",
                          borderRadius: "10px",
                          marginBottom: "4px",
                          background: n.read ? "transparent" : "rgba(217,70,239,0.08)",
                        }}
                      >
                        <p style={{ margin: 0, fontSize: "12.5px", color: "#f1e9ff", lineHeight: 1.4 }}>{n.message}</p>
                        <span style={{ fontSize: "10px", color: "#7c6f93" }}>
                          {new Date(n.createdAt).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar dropdown */}
            <div ref={menuRef} style={{ position: "relative" }}>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setMenuOpen((o) => !o)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  border: "1px solid rgba(216,180,254,0.15)",
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
                    background: "linear-gradient(135deg,#8b5cf6,#d946ef)",
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
                    color: "#f1e9ff",
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
                  <ChevronDown size={14} color="#c4b5fd" />
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
                      background: "#1a1030",
                      border: "1px solid rgba(216,180,254,0.15)",
                      borderRadius: "16px",
                      padding: "8px",
                      boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
                      transformOrigin: "top right",
                    }}
                  >
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
                            color: isActive ? "#fff" : "#e9d5ff",
                            background: isActive ? "linear-gradient(to right,#8b5cf6,#d946ef)" : "transparent",
                            marginBottom: "2px",
                          })}
                        >
                          <Icon size={14} />
                          {label}
                        </NavLink>
                      ))}
                      <div style={{ borderTop: "1px solid rgba(216,180,254,0.1)", margin: "6px 4px" }} />
                    </div>

                    <p style={{ margin: "2px 10px 8px", fontSize: "11px", color: "#7c6f93", fontWeight: 600, wordBreak: "break-all" }}>
                      {user?.email}
                    </p>
                    <motion.button
                      whileHover={{ background: "rgba(217,70,239,0.18)" }}
                      onClick={handleLogout}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        border: "none",
                        background: "rgba(217,70,239,0.1)",
                        color: "#f0abfc",
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
      </div>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "28px 24px 60px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default TPOLayout;