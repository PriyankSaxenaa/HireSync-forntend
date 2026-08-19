// src/components/fx/SpotlightCard.jsx
import { useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * The app's standard surface: soft glass with an accent-tinted hairline, the
 * same polish as the landing/auth panels. On hover the border deepens into
 * the role accent and a very soft white highlight follows the cursor — a
 * restrained cue, not a colored glow bloom. `live` swaps in a stronger,
 * more saturated accent border for genuinely active state (an open drive, a
 * pending review).
 *
 * `tilt` adds a subtle 3D lean toward the pointer for hero-level cards.
 */
const SpotlightCard = ({
  children,
  live = false,
  tilt = false,
  hover = true,
  glow, // "r,g,b" — defaults to the active role's accent, only used when `live`
  padding = 20,
  radius = "var(--hs-r-lg)",
  onClick,
  className = "",
  style,
  ...rest
}) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [lean, setLean] = useState({ rx: 0, ry: 0 });
  const [active, setActive] = useState(false);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setPos({ x: px * 100, y: py * 100 });
    if (tilt) setLean({ rx: (0.5 - py) * 6, ry: (px - 0.5) * 6 });
  };

  const reset = () => {
    setActive(false);
    setLean({ rx: 0, ry: 0 });
  };

  const tint = glow || "var(--hs-a2-rgb)";

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={reset}
      onClick={onClick}
      animate={tilt ? { rotateX: lean.rx, rotateY: lean.ry } : undefined}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      whileHover={hover ? { y: -2 } : undefined}
      className={`hs-card${live ? " hs-live-border" : ""} ${className}`}
      style={{
        padding,
        borderRadius: radius,
        cursor: onClick ? "pointer" : undefined,
        transformStyle: tilt ? "preserve-3d" : undefined,
        borderColor: !live && active ? `rgba(${tint},0.4)` : undefined,
        overflow: "hidden",
        ...style,
      }}
      {...rest}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: hover && active ? 1 : 0,
          transition: "opacity 0.3s var(--hs-ease)",
          background: `radial-gradient(360px circle at ${pos.x}% ${pos.y}%, rgba(255,255,255,0.05), transparent 62%)`,
        }}
      />
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </motion.div>
  );
};

export default SpotlightCard;
