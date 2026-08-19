// src/layouts/TPOLayout.jsx
import { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { LayoutGrid, GraduationCap, Users2, CalendarClock, School } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import api from "../api/axios";
import RoleShell from "../components/fx/RoleShell";
import PageTransition from "../components/fx/PageTransition";
import TopNav from "../components/common/TopNav";
import UserMenu from "../components/common/UserMenu";
import NotificationBell from "../components/common/NotificationBell";

const navItems = [
  { to: "/tpo/dashboard", label: "Overview", icon: LayoutGrid },
  { to: "/tpo/students", label: "Students", icon: GraduationCap },
  { to: "/tpo/placement-groups", label: "Groups", icon: Users2 },
  { to: "/tpo/drives", label: "Drives", icon: CalendarClock },
  { to: "/tpo/college", label: "College", icon: School },
];

const TPOLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await api.get("/notifications");
      setNotifications(data.notifications || []);
      setUnread(data.unread || 0);
    } catch {
      // silent — the bell just stays empty rather than nagging on every poll
    }
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.put("/notifications/read");
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
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return (
    <RoleShell role="tpo">
      <TopNav
        navItems={navItems}
        tag="PLACEMENT CELL"
        pillId="hs-tpo-pill"
        maxWidth={1240}
        right={
          <>
            <NotificationBell
              notifications={notifications}
              unread={unread}
              onMarkAllRead={handleMarkAllRead}
              limit={10}
            />
            <UserMenu user={user} roleLabel="Placement Officer" navItems={navItems} onLogout={handleLogout} />
          </>
        }
      />

      <main style={{ maxWidth: "1240px", margin: "0 auto", padding: "30px 24px 70px" }}>
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
    </RoleShell>
  );
};

export default TPOLayout;
