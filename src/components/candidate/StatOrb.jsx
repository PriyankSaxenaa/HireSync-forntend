// src/components/candidate/StatOrb.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function CountUp({ value = 0, duration = 800 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf;
    let start = null;
    const to = Number(value) || 0;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setDisplay(Math.round(to * progress));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{display}</>;
}

const StatOrb = ({ icon: Icon, label, value, gradient, delay = 0, suffix = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 16, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.4, type: "spring" }}
    whileHover={{ y: -5, scale: 1.02 }}
    style={{
      position: "relative",
      background: "rgba(20,14,35,0.7)",
      border: "1px solid rgba(216,180,254,0.12)",
      borderRadius: "20px",
      padding: "20px",
      display: "flex",
      alignItems: "center",
      gap: "14px",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: "-30px",
        right: "-30px",
        width: "90px",
        height: "90px",
        borderRadius: "50%",
        background: gradient,
        opacity: 0.18,
        filter: "blur(10px)",
      }}
    />
    <div
      style={{
        width: "44px",
        height: "44px",
        borderRadius: "14px",
        background: gradient,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: "0 0 20px rgba(139,92,246,0.3)",
      }}
    >
      <Icon size={19} color="#fff" />
    </div>
    <div style={{ position: "relative" }}>
      <p style={{ margin: 0, fontSize: "22px", fontWeight: 800, color: "#fff" }}>
        <CountUp value={value} />
        {suffix}
      </p>
      <p style={{ margin: 0, fontSize: "12.5px", color: "#a897c9" }}>{label}</p>
    </div>
  </motion.div>
);

export default StatOrb;