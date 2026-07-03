// src/layouts/AuthLayout.jsx
import { Link } from "react-router-dom";
import Logo from "../components/common/Logo";

const AuthLayout = ({ children }) => {
  return (
    <main style={{ minHeight: "100vh", background: "#05070f", display: "flex", flexDirection: "column" }}>
      <header style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", flexShrink: 0 }}>
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <Link to="/" style={{ display: "flex" }}>
            <Logo />
          </Link>

          <nav style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link
              to="/login"
              className="hover:bg-white/10"
              style={{
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "9999px",
                padding: "8px 20px",
                fontSize: "14px",
                fontWeight: 600,
                color: "#fff",
                transition: "background 0.2s",
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{
                borderRadius: "9999px",
                padding: "8px 20px",
                fontSize: "14px",
                fontWeight: 600,
                color: "#fff",
                background: "linear-gradient(to right, #6366f1, #22d3ee)",
              }}
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 16px",
        }}
      >
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;