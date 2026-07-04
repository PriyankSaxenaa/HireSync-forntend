// src/components/candidate/GlowCard.jsx
import { useRef, useState } from "react";
import { motion } from "framer-motion";

// A card that tracks the mouse and renders a soft radial glow following the
// cursor, on top of a glassmorphism dark surface. Used as the base surface
// for every candidate-side card so the whole dashboard feels alive.
const GlowCard = ({ children, style, glow = "139,92,246", onClick, hoverLift = true }) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [hovering, setHovering] = useState(false);

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={onClick}
      whileHover={hoverLift ? { y: -4 } : undefined}
      style={{
        position: "relative",
        borderRadius: "20px",
        border: "1px solid rgba(216,180,254,0.12)",
        background: "rgba(20,14,35,0.7)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        transition: "border-color 0.2s",
        borderColor: hovering ? `rgba(${glow},0.4)` : "rgba(216,180,254,0.12)",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: hovering ? 1 : 0,
          transition: "opacity 0.25s",
          background: `radial-gradient(280px circle at ${pos.x}% ${pos.y}%, rgba(${glow},0.16), transparent 65%)`,
        }}
      />
      <div style={{ position: "relative" }}>{children}</div>
    </motion.div>
  );
};

export default GlowCard;