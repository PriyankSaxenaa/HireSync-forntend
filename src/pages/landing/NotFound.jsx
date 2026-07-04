// src/pages/landing/NotFound.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#040611",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ textAlign: "center", maxWidth: "420px" }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(72px, 14vw, 120px)",
            fontWeight: 900,
            lineHeight: 1,
            background: "linear-gradient(to right, #818cf8, #a78bfa, #22d3ee)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </h1>

        <h2 style={{ margin: "16px 0 8px", fontSize: "22px", fontWeight: 800, color: "#fff" }}>
          Page not found
        </h2>
        <p style={{ margin: "0 0 32px", fontSize: "14px", color: "#94a3b8", lineHeight: 1.6 }}>
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => window.history.back()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.05)",
              color: "#fff",
              borderRadius: "9999px",
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={16} /> Go Back
          </button>

          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              borderRadius: "9999px",
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: 700,
              color: "#fff",
              textDecoration: "none",
              background: "linear-gradient(to right, #6366f1, #22d3ee)",
              boxShadow: "0 0 25px rgba(99,102,241,0.35)",
            }}
          >
            <Home size={16} /> Go Home
          </Link>
        </div>
      </motion.div>
    </main>
  );
};

export default NotFound;