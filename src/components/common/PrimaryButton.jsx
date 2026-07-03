// src/components/common/PrimaryButton.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const MotionLink = motion(Link);

const base = `
  relative overflow-hidden rounded-full px-6 py-3 sm:px-8 sm:py-4
  text-sm sm:text-base font-semibold transition-all duration-300
`;

const styles = {
  primary:
    "bg-gradient-to-r from-indigo-500 to-cyan-400 text-white shadow-[0_0_35px_rgba(99,102,241,.4)] hover:shadow-[0_0_50px_rgba(99,102,241,.55)]",
  secondary:
    "border border-white/15 bg-white/5 text-white backdrop-blur-xl hover:border-white/30 hover:bg-white/10",
};

const PrimaryButton = ({ children, secondary = false, onClick, to, type = "button" }) => {
  const className = `${base} ${secondary ? styles.secondary : styles.primary}`;

  if (to) {
    return (
      <MotionLink
        to={to}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.96 }}
        className={className}
      >
        {children}
      </MotionLink>
    );
  }

  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
};

export default PrimaryButton;