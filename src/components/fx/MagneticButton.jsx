// src/components/fx/MagneticButton.jsx
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Hoisted: building this inside render would hand React a brand-new component
// type every pass, remounting the link and killing the spring mid-flight.
const MotionLink = motion.create(Link);

/**
 * A CTA that leans toward the cursor while it's nearby and springs back when
 * it leaves. Renders as a react-router <Link> when given `to`, an <a> when
 * given `href`, otherwise a <button>.
 */
const MagneticButton = ({
  children,
  to,
  href,
  onClick,
  variant = "solid", // solid | ghost | danger
  strength = 0.22,
  disabled = false,
  type = "button",
  className = "",
  style,
  ...rest
}) => {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    if (disabled) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setOffset({
      x: (e.clientX - (rect.left + rect.width / 2)) * strength,
      y: (e.clientY - (rect.top + rect.height / 2)) * strength,
    });
  };

  const variantClass =
    variant === "ghost" ? " hs-btn-ghost" : variant === "danger" ? " hs-btn-danger" : "";

  const inner = (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 8 }}>
      {children}
    </span>
  );

  const shared = {
    ref,
    onMouseMove: handleMove,
    onMouseLeave: () => setOffset({ x: 0, y: 0 }),
    animate: { x: offset.x, y: offset.y },
    transition: { type: "spring", stiffness: 260, damping: 18, mass: 0.5 },
    className: `hs-btn${variantClass} ${className}`,
    style,
    ...rest,
  };

  if (to && !disabled) {
    return (
      <MotionLink to={to} onClick={onClick} {...shared}>
        {inner}
      </MotionLink>
    );
  }

  if (href && !disabled) {
    return (
      <motion.a href={href} onClick={onClick} {...shared}>
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button type={type} onClick={onClick} disabled={disabled} {...shared}>
      {inner}
    </motion.button>
  );
};

export default MagneticButton;
