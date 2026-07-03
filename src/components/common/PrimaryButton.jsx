import { motion } from "framer-motion";

const PrimaryButton = ({
  children,
  secondary = false,
  onClick,
}) => {
  return (
    <motion.button
      whileHover={{
        scale: 1.05,
        y: -2,
      }}
      whileTap={{
        scale: 0.96,
      }}
      onClick={onClick}
      className={`

      relative

      overflow-hidden

      rounded-full

      px-8

      py-4

      font-semibold

      transition-all

      duration-300

      ${
        secondary
          ? `
          border
          border-white/10
          bg-white/10
          text-white
          backdrop-blur-xl
          hover:bg-white/20
        `
          : `
          bg-gradient-to-r
          from-pink-500
          via-violet-500
          to-cyan-400
          text-white
          shadow-[0_0_40px_rgba(139,92,246,.45)]
        `
      }
      `}
    >
      {children}
    </motion.button>
  );
};

export default PrimaryButton;