// src/components/candidate/EmptyState.jsx
import { motion } from "framer-motion";

const EmptyState = ({ icon: Icon, title, subtitle, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    style={{
      textAlign: "center",
      padding: "70px 24px",
      border: "1px dashed rgba(216,180,254,0.18)",
      borderRadius: "24px",
      background: "rgba(255,255,255,0.02)",
    }}
  >
    {Icon && (
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
        style={{
          width: "60px",
          height: "60px",
          margin: "0 auto 18px",
          borderRadius: "18px",
          background: "linear-gradient(135deg,#8b5cf6,#d946ef)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 30px rgba(217,70,239,0.35)",
        }}
      >
        <Icon size={26} color="#fff" />
      </motion.div>
    )}
    <p style={{ margin: "0 0 6px", fontSize: "15px", fontWeight: 700, color: "#fff" }}>{title}</p>
    {subtitle && <p style={{ margin: "0 0 18px", fontSize: "13px", color: "#a897c9", maxWidth: "380px", marginLeft: "auto", marginRight: "auto" }}>{subtitle}</p>}
    {action}
  </motion.div>
);

export default EmptyState;