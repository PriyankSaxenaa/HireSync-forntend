// src/layouts/DashboardLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";

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
    <div style={{ display: "flex", minHeight: "100vh", background: "#05070f" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Topbar title={title} />
        <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;