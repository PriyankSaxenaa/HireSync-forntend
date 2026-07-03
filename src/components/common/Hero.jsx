// src/components/common/Hero.jsx
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const sectionRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-4, 4]);
  const translateX = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);
  const translateY = useTransform(smoothY, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e) => {
    const rect = sectionRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      style={{
        position: "relative",
        zIndex: 20,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 24px",
      }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          x: translateX,
          y: translateY,
          maxWidth: "900px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            margin: 0,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            fontSize: "clamp(48px, 9vw, 112px)",
            lineHeight: 1,
          }}
        >
          <span style={{ color: "#fff" }}>Hire</span>
          <span
            style={{
              background: "linear-gradient(to right, #818cf8, #a78bfa, #22d3ee)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Sync
          </span>
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            marginTop: "24px",
            fontWeight: 600,
            color: "#f1f5f9",
            fontSize: "clamp(20px, 3vw, 40px)",
          }}
        >
          Connecting Talent with Opportunity.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            margin: "24px auto 0",
            maxWidth: "700px",
            fontSize: "clamp(15px, 1.5vw, 18px)",
            lineHeight: 1.7,
            color: "#94a3b8",
          }}
        >
          HireSync brings together students, recruiters, placement officers
          and colleges through one intelligent hiring ecosystem.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            marginTop: "40px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          <Link
            to="/register"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              borderRadius: "9999px",
              padding: "16px 32px",
              fontSize: "16px",
              fontWeight: 700,
              color: "#fff",
              background: "linear-gradient(to right, #6366f1, #22d3ee)",
              boxShadow: "0 0 35px rgba(99,102,241,0.4)",
            }}
          >
            Get Started <ArrowRight size={18} />
          </Link>

          <Link
            to="/login"
            style={{
              borderRadius: "9999px",
              padding: "16px 32px",
              fontSize: "16px",
              fontWeight: 700,
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.05)",
            }}
          >
            Login
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
        style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)" }}
      >
        <ChevronDown color="rgba(255,255,255,0.6)" size={34} />
      </motion.div>
    </section>
  );
};

export default Hero;