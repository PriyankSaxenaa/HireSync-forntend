import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import Logo from "./Logo";
const navLinks = [
  { name: "Features", href: "#" },
  { name: "About", href: "#" },
  { name: "Contact", href: "#" },
];

const Navbar = () => {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="fixed top-0 left-0 z-50 w-full px-4 py-5"
    >
      <div
        className="
        mx-auto
        flex
        max-w-7xl
        items-center
        justify-between
        rounded-2xl
        border
        border-white/10
        bg-white/5
        px-6
        py-4
        shadow-[0_8px_40px_rgba(0,0,0,.35)]
        backdrop-blur-2xl
      "
      >
        <Logo />

        {/* Desktop Menu */}

        <nav className="hidden items-center gap-10 lg:flex">
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="
                relative
                text-sm
                font-medium
                text-slate-300
                transition
                duration-300
                hover:text-white
                after:absolute
                after:left-0
                after:-bottom-1
                after:h-[2px]
                after:w-0
                after:bg-gradient-to-r
                after:from-pink-500
                after:via-violet-500
                after:to-cyan-400
                after:transition-all
                hover:after:w-full
              "
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Right Buttons */}

        <div className="hidden items-center gap-4 lg:flex">
          <button
            className="
              rounded-full
              border
              border-white/10
              bg-white/10
              px-6
              py-2.5
              text-sm
              font-semibold
              text-white
              backdrop-blur-xl
              transition
              duration-300
              hover:bg-white/20
            "
          >
            Login
          </button>

          <button
            className="
              rounded-full
              bg-gradient-to-r
              from-pink-500
              via-violet-500
              to-cyan-400
              px-6
              py-2.5
              text-sm
              font-semibold
              text-white
              shadow-lg
              transition
              duration-300
              hover:scale-105
            "
          >
            Register
          </button>
        </div>

        {/* Mobile */}

        <button
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            border
            border-white/10
            bg-white/10
            text-white
            backdrop-blur-xl
            lg:hidden
          "
        >
          <Menu size={22} />
        </button>
      </div>
    </motion.header>
  );
};

export default Navbar;