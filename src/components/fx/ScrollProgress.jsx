// src/components/fx/ScrollProgress.jsx
import { motion, useScroll, useSpring } from "framer-motion";

/** A gradient rail across the top of the viewport tracking scroll depth. */
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{
        scaleX: width,
        transformOrigin: "0% 50%",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "2.5px",
        zIndex: 9997,
        background: "var(--hs-grad)",
        boxShadow: "0 0 12px rgba(var(--hs-a2-rgb),0.7)",
      }}
    />
  );
};

export default ScrollProgress;
