// src/components/fx/PageTransition.jsx
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

/**
 * Wraps a layout's <Outlet/>. Keying on the pathname makes React remount the
 * subtree on every navigation, so each route blurs and lifts into place
 * instead of snapping.
 */
const PageTransition = ({ children }) => {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 16, filter: "blur(7px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{ minHeight: "50vh" }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
