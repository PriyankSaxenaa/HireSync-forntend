import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import ColorBends from "../../components/common/ColorBends";

const Landing = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">

      {/* Background */}
      <div className="absolute inset-0">
        <ColorBends
          colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
          rotation={90}
          speed={0.2}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          noise={0.15}
          parallax={0.5}
          iterations={1}
          intensity={1.5}
          bandWidth={6}
          transparent
          autoRotate={0}
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" />

      {/* Navbar */}
      <header className="absolute left-0 top-0 z-50 w-full px-8 py-6">

        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-white/5 px-8 py-4 backdrop-blur-2xl">

          <h2 className="text-2xl font-black tracking-wide">

            <span className="text-white">Hire</span>

            <span className="bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-400 bg-clip-text text-transparent">
              Sync
            </span>

          </h2>

          <nav className="hidden gap-10 text-sm text-slate-300 lg:flex">

            <a href="#">Features</a>

            <a href="#">About</a>

            <a href="#">Contact</a>

          </nav>

          <button className="rounded-full border border-white/20 bg-white/10 px-6 py-2 backdrop-blur-xl transition hover:bg-white/20">
            Login
          </button>

        </div>

      </header>

      {/* Hero */}

      <section className="relative z-10 flex min-h-screen items-center justify-center px-6">

        <div className="mx-auto max-w-5xl text-center">

          <motion.h1
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-6xl font-black leading-tight md:text-8xl"
          >
            <span className="text-white">Hire</span>

            <span className="bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-400 bg-clip-text text-transparent">
              Sync
            </span>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .2 }}
            className="mt-8 text-2xl font-semibold md:text-4xl"
          >
            Connecting Talent with Opportunity.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: .45 }}
            className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-slate-300 md:text-xl"
          >
            HireSync is a modern campus placement platform that connects
            students, recruiters, placement officers and colleges through one
            intelligent hiring ecosystem.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .6 }}
            className="mt-14 flex flex-wrap items-center justify-center gap-6"
          >

            <button className="group flex items-center gap-3 rounded-full bg-gradient-to-r from-pink-500 via-violet-600 to-cyan-400 px-8 py-4 text-lg font-semibold shadow-[0_0_40px_rgba(139,92,246,.4)] transition duration-300 hover:scale-105">

              Get Started

              <ArrowRight
                size={20}
                className="transition group-hover:translate-x-1"
              />

            </button>

            <button className="rounded-full border border-white/20 bg-white/10 px-8 py-4 text-lg backdrop-blur-xl transition hover:bg-white/20">

              Login

            </button>

          </motion.div>

        </div>

      </section>

      {/* Scroll Indicator */}

      <motion.div

        animate={{ y: [0, 12, 0] }}

        transition={{

          repeat: Infinity,

          duration: 1.8

        }}

        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"

      >

        <ChevronDown size={36} className="text-white/70" />

      </motion.div>

    </main>
  );
};

export default Landing;