// src/layouts/CandidateLayout.jsx
import { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  LayoutGrid,
  Search,
  FileText,
  Bookmark,
  School,
  UserCircle2,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { getNotifications, markNotificationsRead } from "../api/notifications.api";
import { connectSocket, disconnectSocket } from "../lib/socket";
import RoleShell from "../components/fx/RoleShell";
import PageTransition from "../components/fx/PageTransition";
import LiveBadge from "../components/fx/LiveBadge";
import SideNav from "../components/common/SideNav";
import NotificationBell from "../components/common/NotificationBell";
import Logo from "../components/common/Logo";

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

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await getNotifications();
      setNotifications(data.notifications || []);
      setUnread(data.unread || 0);
    } catch {
      // silent — the bell just stays empty rather than nagging on every poll
    }
  }, []);

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
  }, [fetchNotifications]);

  return (
    <RoleShell role="candidate" style={{ display: "flex" }}>
      <div style={{ display: "flex", minHeight: "100vh", width: "100%" }}>
        <SideNav
          navItems={navItems}
          user={user}
          roleLabel="Candidate"
          tag="CANDIDATE"
          pillId="hs-candidate-pill"
          onLogout={handleLogout}
        />

        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <header
            style={{
              position: "sticky",
              top: 0,
              zIndex: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "14px",
              padding: "14px 26px",
              borderBottom: "1px solid var(--hs-line)",
              background: "rgba(6,6,7,0.82)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
            }}
          >
            <div className="md:hidden">
              <Logo size="sm" />
            </div>

            <div
              className="hidden md:flex"
              style={{ alignItems: "center", gap: "10px" }}
            >
              <LiveBadge label="SYNCED" />
              <span style={{ fontSize: "12.5px", color: "var(--hs-dim)" }}>
                Realtime updates are on — new matches and drive invites arrive instantly.
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "auto" }}>
              <NotificationBell
                notifications={notifications}
                unread={unread}
                onMarkAllRead={handleMarkAllRead}
              />
            </div>
          </header>

          <main style={{ flex: 1, padding: "26px 28px 90px" }}>
            <PageTransition>
              <Outlet />
            </PageTransition>
          </main>
        </div>
      </div>
    </RoleShell>
  );
};

export default CandidateLayout;
