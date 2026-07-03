// src/components/common/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Briefcase, School } from "lucide-react";

const links = [
  { to: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { to: "/admin/colleges", label: "Colleges", icon: School },
];

const Sidebar = () => (
  <aside
    style={{
      width: "260px",
      flexShrink: 0,
      minHeight: "100vh",
      background: "#0a0e1a",
      borderRight: "1px solid rgba(255,255,255,0.08)",
      padding: "28px 20px",
      boxSizing: "border-box",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "36px", paddingLeft: "8px" }}>
      <span style={{ fontSize: "20px", fontWeight: 900, color: "#fff" }}>
        Hire<span style={{ background: "linear-gradient(to right,#818cf8,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Sync</span>
      </span>
      <span
        style={{
          fontSize: "11px",
          fontWeight: 700,
          color: "#a5b4fc",
          background: "rgba(99,102,241,0.15)",
          padding: "2px 8px",
          borderRadius: "999px",
        }}
      >
        ADMIN
      </span>
    </div>

    <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "11px 14px",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: 600,
            textDecoration: "none",
            color: isActive ? "#c7d2fe" : "#94a3b8",
            background: isActive ? "rgba(99,102,241,0.15)" : "transparent",
            transition: "background 0.15s, color 0.15s",
          })}
          onMouseEnter={(e) => {
            if (!e.currentTarget.classList.contains("active")) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = e.currentTarget.getAttribute("aria-current") ? "rgba(99,102,241,0.15)" : "transparent";
          }}
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default Sidebar;