import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import PrimaryButton from "./PrimaryButton";

const Hero = () => {
  return (
    <section className="relative z-20 flex min-h-screen items-center justify-center px-6">

      <div className="mx-auto max-w-5xl text-center">

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .8 }}
          className="text-6xl font-black md:text-8xl"
        >
          <span className="text-white">
            Hire
          </span>

          <span className="bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-400 bg-clip-text text-transparent">
            Sync
          </span>
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: .2 }}
          className="mt-8 text-2xl font-semibold md:text-4xl"
        >
          Connecting Talent with Opportunity.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: .4 }}
          className="mx-auto mt-8 max-w-3xl text-lg text-slate-300 leading-9"
        >
          HireSync brings together students, recruiters,
          placement officers and colleges through one
          intelligent hiring ecosystem.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: .6 }}
          className="mt-12 flex justify-center gap-5"
        >

          <PrimaryButton>

            <div className="flex items-center gap-2">

              Get Started

              <ArrowRight size={18} />

            </div>

          </PrimaryButton>

          <PrimaryButton secondary>

            Login

          </PrimaryButton>

        </motion.div>

      </div>

      <motion.div
        animate={{ y:[0,12,0] }}
        transition={{
          repeat:Infinity,
          duration:1.8
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown
          className="text-white/70"
          size={34}
        />
      </motion.div>

    </section>
  );
};

export default Hero;