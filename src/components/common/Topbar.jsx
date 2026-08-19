// src/components/common/Topbar.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import UserMenu from "./UserMenu";
import LiveBadge from "../fx/LiveBadge";
import Logo from "./Logo";

/**
 * Admin top bar. Alongside the page title it runs a live clock, which keeps a
 * visible tick going on even the quietest admin screen.
 */
const Topbar = ({ title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
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

      <div className="hidden md:flex" style={{ alignItems: "center", gap: "14px", minWidth: 0 }}>
        <h1
          style={{
            margin: 0,
            fontSize: "19px",
            fontWeight: 800,
            color: "var(--hs-text)",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </h1>
        <LiveBadge label="MONITORING" />
        <span
          style={{
            fontSize: "12.5px",
            color: "var(--hs-dim)",
            fontVariantNumeric: "tabular-nums",
            fontWeight: 600,
          }}
        >
          {now.toLocaleTimeString()}
        </span>
      </div>

      <div style={{ marginLeft: "auto" }}>
        <UserMenu user={user} roleLabel="Administrator" onLogout={handleLogout} />
      </div>
    </header>
  );
};

export default Topbar;
