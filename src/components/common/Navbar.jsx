// src/components/common/Navbar.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import MagneticButton from "../fx/MagneticButton";
import StatusTicker from "./StatusTicker";

const navLinks = [
  { name: "Platform", href: "#platform" },
  { name: "Roles", href: "#roles" },
  { name: "Flow", href: "#flow" },
  { name: "Impact", href: "#impact" },
];

/**
 * A flat bar sitting directly on the canvas — text links, no floating glass
 * pill. A hairline border fades in underneath once the page scrolls, the
 * only concession to state.
 */
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        borderBottom: `1px solid ${scrolled ? "var(--hs-line)" : "transparent"}`,
        background: scrolled ? "rgba(6,6,7,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(10px)" : "none",
        transition: "background 0.3s var(--hs-ease), border-color 0.3s var(--hs-ease)",
      }}
    >
      <StatusTicker />

      <div
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "18px",
          padding: "18px 28px",
        }}
      >
        <Link to="/" style={{ flexShrink: 0 }}>
          <Logo size="sm" />
        </Link>

        <nav className="hidden lg:flex" style={{ alignItems: "center", gap: "34px" }}>
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              style={{
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.01em",
                color: "var(--hs-muted)",
                transition: "color 0.2s var(--hs-ease)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--hs-text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--hs-muted)")}
            >
              {item.name}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex" style={{ alignItems: "center", gap: "20px", flexShrink: 0 }}>
          <Link
            to="/login"
            style={{ fontSize: "13px", fontWeight: 600, color: "var(--hs-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--hs-text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--hs-muted)")}
          >
            Sign in
          </Link>
          <MagneticButton
            to="/register"
            strength={0.14}
            style={{ padding: "10px 20px", fontSize: "13px", borderRadius: "var(--hs-r-full)" }}
          >
            Get started
          </MagneticButton>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
          // Display must come from a class, not inline — an inline `display`
          // would outrank `lg:hidden` and leave this visible on desktop.
          className="grid lg:hidden"
          style={{
            placeItems: "center",
            width: "38px",
            height: "38px",
            flexShrink: 0,
            borderRadius: "var(--hs-r)",
            border: "1px solid var(--hs-line-strong)",
            background: "transparent",
            color: "var(--hs-text)",
          }}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden"
            style={{ overflow: "hidden", borderTop: "1px solid var(--hs-line)", background: "var(--hs-bg-elev)" }}
          >
            <nav style={{ display: "flex", flexDirection: "column", padding: "10px 28px 20px" }}>
              {navLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  style={{
                    padding: "13px 0",
                    borderBottom: "1px solid var(--hs-line)",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "var(--hs-text)",
                  }}
                >
                  {item.name}
                </a>
              ))}
            </nav>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "0 28px 24px" }}>
              <MagneticButton
                to="/login"
                variant="ghost"
                onClick={() => setOpen(false)}
                style={{ width: "100%", borderRadius: "var(--hs-r-full)" }}
              >
                Sign in
              </MagneticButton>
              <MagneticButton
                to="/register"
                onClick={() => setOpen(false)}
                style={{ width: "100%", borderRadius: "var(--hs-r-full)" }}
              >
                Get started
              </MagneticButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
