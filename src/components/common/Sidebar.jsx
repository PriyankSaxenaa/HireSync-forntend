// src/components/common/Sidebar.jsx
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Briefcase, School } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import SideNav from "./SideNav";

export const adminNavItems = [
  { to: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { to: "/admin/colleges", label: "Colleges", icon: School },
];

/** Admin sidebar — a thin wrapper binding the admin nav to the shared SideNav. */
const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <SideNav
      navItems={adminNavItems}
      user={user}
      roleLabel="Administrator"
      tag="ADMIN"
      pillId="hs-admin-pill"
      onLogout={handleLogout}
    />
  );
};

export default Sidebar;
