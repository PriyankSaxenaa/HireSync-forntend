// src/components/common/Topbar.jsx
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const Topbar = ({ title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = (user?.name || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "22px 32px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        background: "#0a0e1a",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 800, color: "#fff" }}>{title}</h1>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: "linear-gradient(135deg,#6366f1,#22d3ee)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: 700,
              color: "#fff",
            }}
          >
            {initials}
          </div>
          <span style={{ fontSize: "14px", color: "#e2e8f0", fontWeight: 600 }}>{user?.name}</span>
        </div>

        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "transparent",
            color: "#fff",
            padding: "9px 18px",
            borderRadius: "999px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <LogOut size={15} /> Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;