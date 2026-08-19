// src/pages/landing/NotFound.jsx
import { motion } from "framer-motion";
import { Home, ArrowLeft, Compass } from "lucide-react";
import Aurora from "../../components/fx/Aurora";
import MagneticButton from "../../components/fx/MagneticButton";
import Marquee from "../../components/fx/Marquee";
import Logo from "../../components/common/Logo";

const NotFound = () => (
  <main
    data-hs-role="brand"
    style={{
      position: "relative",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      overflow: "hidden",
    }}
  >
    <Aurora fixed blobOpacity={0.45} intensity={1.2} />

    {/* A "404" strip drifting behind the card, forever */}
    <div
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", opacity: 0.05 }}
    >
      <Marquee duration={26} gap={60} fade={false} pauseOnHover={false}>
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} style={{ fontSize: "clamp(90px, 18vw, 220px)", fontWeight: 900, whiteSpace: "nowrap" }}>
            404
          </span>
        ))}
      </Marquee>
    </div>

    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: "460px" }}
    >
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
        <Logo />
      </div>

      <div
        style={{
          width: "68px",
          height: "68px",
          margin: "0 auto 22px",
          borderRadius: "var(--hs-r-lg)",
          display: "grid",
          placeItems: "center",
          background: "rgba(var(--hs-a2-rgb),0.14)",
          border: "1px solid rgba(var(--hs-a2-rgb),0.3)",
        }}
      >
        <Compass size={30} style={{ color: "var(--hs-a3)" }} />
      </div>

      <h1
        className="hs-gradient-text"
        style={{
          margin: 0,
          fontSize: "clamp(70px, 14vw, 118px)",
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: "-0.05em",
        }}
      >
        404
      </h1>

      <h2 style={{ margin: "14px 0 10px", fontSize: "22px", fontWeight: 800, color: "var(--hs-text)" }}>
        Page not found
      </h2>
      <p style={{ margin: "0 0 32px", fontSize: "14px", color: "var(--hs-muted)", lineHeight: 1.7 }}>
        The page you&apos;re looking for doesn&apos;t exist, or it may have moved somewhere else.
      </p>

      <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
        <MagneticButton variant="ghost" onClick={() => window.history.back()}>
          <ArrowLeft size={16} /> Go back
        </MagneticButton>
        <MagneticButton to="/">
          <Home size={16} /> Go home
        </MagneticButton>
      </div>
    </motion.div>
  </main>
);

export default NotFound;
