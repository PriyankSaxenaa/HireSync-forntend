import { motion } from "framer-motion";

const Logo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.6,
      }}
      className="select-none cursor-pointer"
    >
      <h1 className="text-3xl font-black tracking-tight md:text-4xl">

        <span className="text-white">
          Hire
        </span>

        <span
          className="
          bg-gradient-to-r
          from-pink-500
          via-violet-500
          to-cyan-400
          bg-clip-text
          text-transparent
          "
        >
          Sync
        </span>

      </h1>
    </motion.div>
  );
};

export default Logo;