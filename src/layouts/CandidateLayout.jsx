// src/layouts/CandidateLayout.jsx
import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  LayoutGrid,
  Search,
  FileText,
  Bookmark,
  School,
  UserCircle2,
  Bell,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { getNotifications, markNotificationsRead } from "../api/notifications.api";
import { connectSocket, disconnectSocket } from "../lib/socket";

const navItems = [
  { to: "/candidate/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/candidate/jobs", label: "Browse Jobs", icon: Search },
  { to: "/candidate/applications", label: "My Applications", icon: FileText },
  { to: "/candidate/saved", label: "Saved Jobs", icon: Bookmark },
  { to: "/candidate/campus", label: "Campus Drives", icon: School },
  { to: "/candidate/profile", label: "Profile", icon: UserCircle2 },
];

const CandidateLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef(null);

  const initials = (user?.name || "?").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  const fetchNotifications = async () => {
    try {
      const { data } = await getNotifications();
      setNotifications(data.notifications || []);
      setUnread(data.unread || 0);
    } catch {
      // silent — bell just stays empty
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnread(0);
    } catch {
      // ignore
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 45000);

    const socket = connectSocket();
    const bump = (message) => {
      toast.success(message, { icon: "🔔" });
      fetchNotifications();
    };
    socket.on("application:status", (p) => bump(`${p.jobTitle} at ${p.company}: ${p.status}`));
    socket.on("drive:new", (p) => bump(`New drive: ${p.title} at ${p.company}`));
    socket.on("drive:response:confirmed", () => fetchNotifications());

    return () => {
      clearInterval(interval);
      socket.off("application:status");
      socket.off("drive:new");
      socket.off("drive:response:confirmed");
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#07040f" }}>
      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside
        className="hidden md:flex"
        style={{
          width: "250px",
          flexShrink: 0,
          flexDirection: "column",
          padding: "26px 18px",
          borderRight: "1px solid rgba(216,180,254,0.1)",
          background: "rgba(15,10,26,0.6)",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "36px", paddingLeft: "6px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "11px",
              background: "linear-gradient(135deg,#8b5cf6,#d946ef)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(217,70,239,0.35)",
            }}
          >
            <Sparkles size={16} color="#fff" />
          </div>
          <span style={{ fontSize: "18px", fontWeight: 800, color: "#fff" }}>
            Hire<span style={{ color: "#e879f9" }}>Sync</span>
          </span>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "11px 14px",
                borderRadius: "13px",
                fontSize: "13.5px",
                fontWeight: 600,
                textDecoration: "none",
                color: isActive ? "#fff" : "#a897c9",
                background: isActive ? "linear-gradient(to right,rgba(139,92,246,0.25),rgba(217,70,239,0.15))" : "transparent",
                boxShadow: isActive ? "0 0 20px rgba(139,92,246,0.15)" : "none",
                transition: "background 0.15s, color 0.15s",
              })}
              onMouseEnter={(e) => {
                if (!e.currentTarget.getAttribute("aria-current")) e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.getAttribute("aria-current")) e.currentTarget.style.background = "transparent";
              }}
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div
          style={{
            marginTop: "16px",
            padding: "14px",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(216,180,254,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background: "linear-gradient(135deg,#8b5cf6,#d946ef)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 700,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</p>
              <p style={{ margin: 0, fontSize: "10.5px", color: "#7c6f93" }}>Candidate</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "7px",
              border: "1px solid rgba(251,113,133,0.25)",
              background: "rgba(251,113,133,0.08)",
              color: "#fda4af",
              padding: "9px",
              borderRadius: "10px",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <LogOut size={13} /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main column ─────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 28px",
            borderBottom: "1px solid rgba(216,180,254,0.08)",
            background: "rgba(7,4,15,0.75)",
            backdropFilter: "blur(14px)",
          }}
        >
          <span className="md:hidden" style={{ fontSize: "17px", fontWeight: 800, color: "#fff" }}>
            Hire<span style={{ color: "#e879f9" }}>Sync</span>
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "auto" }}>
            <div ref={bellRef} style={{ position: "relative" }}>
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => setBellOpen((o) => !o)}
                style={{
                  position: "relative",
                  width: "40px",
                  height: "40px",
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
                <Bell size={17} />
                {unread > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "4px",
                      right: "4px",
                      width: "9px",
                      height: "9px",
                      borderRadius: "50%",
                      background: "#f472b6",
                      boxShadow: "0 0 0 2px #07040f, 0 0 8px rgba(244,114,182,0.8)",
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
                    style={{
                      position: "absolute",
                      top: "calc(100% + 10px)",
                      right: 0,
                      width: "310px",
                      maxHeight: "380px",
                      overflowY: "auto",
                      background: "#160f28",
                      border: "1px solid rgba(216,180,254,0.15)",
                      borderRadius: "16px",
                      padding: "10px",
                      boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 6px 10px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#e9d5ff" }}>Notifications</span>
                      {unread > 0 && (
                        <button onClick={handleMarkAllRead} style={{ border: "none", background: "transparent", color: "#f0abfc", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>
                          Mark all read
                        </button>
                      )}
                    </div>
                    {notifications.length === 0 && (
                      <p style={{ fontSize: "12px", color: "#7c6f93", textAlign: "center", padding: "20px 0" }}>You're all caught up.</p>
                    )}
                    {notifications.slice(0, 12).map((n) => (
                      <div key={n._id} style={{ padding: "10px", borderRadius: "10px", marginBottom: "4px", background: n.read ? "transparent" : "rgba(217,70,239,0.08)" }}>
                        <p style={{ margin: 0, fontSize: "12.5px", color: "#f1e9ff", lineHeight: 1.4 }}>{n.message}</p>
                        <span style={{ fontSize: "10px", color: "#7c6f93" }}>{new Date(n.createdAt).toLocaleString()}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: "28px 32px 60px" }}>
          <Outlet />
        </main>

        {/* mobile bottom nav */}
        <nav
          className="md:hidden"
          style={{
            position: "sticky",
            bottom: 0,
            display: "flex",
            justifyContent: "space-around",
            padding: "10px 6px",
            background: "rgba(15,10,26,0.95)",
            borderTop: "1px solid rgba(216,180,254,0.1)",
          }}
        >
          {navItems.map(({ to, icon: Icon }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({ color: isActive ? "#f0abfc" : "#7c6f93" })}>
              <Icon size={20} />
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default CandidateLayout;