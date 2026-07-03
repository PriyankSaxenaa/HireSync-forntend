// src/components/common/Navbar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "16px" }}>
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 24px",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(15,23,42,0.7)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
        }}
      >
        <Link to="/" style={{ display: "flex", flexShrink: 0 }}>
          <Logo />
        </Link>

        {/* Desktop nav links */}
        <nav
          style={{
            display: "none",
            alignItems: "center",
            gap: "40px",
          }}
          className="lg:flex"
        >
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              style={{ fontSize: "14px", fontWeight: 500, color: "#cbd5e1", textDecoration: "none" }}
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Desktop buttons */}
        <div style={{ display: "none", alignItems: "center", gap: "12px" }} className="lg:flex">
          <Link
            to="/login"
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "9999px",
              padding: "10px 24px",
              fontSize: "14px",
              fontWeight: 600,
              color: "#fff",
            }}
          >
            Login
          </Link>
          <Link
            to="/register"
            style={{
              borderRadius: "9999px",
              padding: "10px 24px",
              fontSize: "14px",
              fontWeight: 600,
              color: "#fff",
              background: "linear-gradient(to right, #6366f1, #22d3ee)",
              boxShadow: "0 0 25px rgba(99,102,241,0.45)",
            }}
          >
            Register
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          className="lg:hidden"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
            borderRadius: "9999px",
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.05)",
            color: "#fff",
          }}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="lg:hidden"
          style={{
            maxWidth: "1280px",
            margin: "12px auto 0",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(15,23,42,0.9)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
            padding: "24px",
          }}
        >
          <nav style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{ fontSize: "15px", fontWeight: 500, color: "#cbd5e1", textDecoration: "none" }}
              >
                {item.name}
              </a>
            ))}
          </nav>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "24px" }}>
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              style={{
                borderRadius: "9999px",
                border: "1px solid rgba(255,255,255,0.15)",
                padding: "12px",
                textAlign: "center",
                fontSize: "14px",
                fontWeight: 600,
                color: "#fff",
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setOpen(false)}
              style={{
                borderRadius: "9999px",
                padding: "12px",
                textAlign: "center",
                fontSize: "14px",
                fontWeight: 600,
                color: "#fff",
                background: "linear-gradient(to right, #6366f1, #22d3ee)",
              }}
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;