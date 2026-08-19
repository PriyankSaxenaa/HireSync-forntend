// src/layouts/DashboardLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";
import RoleShell from "../components/fx/RoleShell";
import PageTransition from "../components/fx/PageTransition";

const titles = {
  "/admin/dashboard": "Overview",
  "/admin/users": "Users",
  "/admin/jobs": "Jobs",
  "/admin/colleges": "Colleges",
};

const DashboardLayout = () => {
  const location = useLocation();
  const title = titles[location.pathname] || "Dashboard";

  return (
    <RoleShell role="admin">
      <div style={{ display: "flex", minHeight: "100vh", width: "100%" }}>
        <Sidebar />

        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <Topbar title={title} />
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

export default DashboardLayout;
