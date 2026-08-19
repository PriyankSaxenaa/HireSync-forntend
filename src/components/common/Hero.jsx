// src/components/common/Hero.jsx
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import MagneticButton from "../fx/MagneticButton";
import TypeCycle from "../fx/TypeCycle";

const trustPoints = ["Role-scoped workspaces", "Realtime status sync"];

// The tags double as "example matched skills" in the preview card — they're
// also, honestly, the real stack this app is built on.
const previewSkills = ["React", "Node.js", "MongoDB", "Socket.IO"];

/**
 * Two-column hero: badge, headline with one gradient emphasis phrase,
 * subtext, pill CTAs and a trust row on the left; a floating glass preview
 * card — clearly a stylised mockup (skeleton bars, generic initials), not a
 * data claim — on the right.
 */
const Hero = () => (
  <section
    style={{
      position: "relative",
      zIndex: 20,
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      padding: "150px 28px 90px",
    }}
  >
    <div
      style={{
        maxWidth: "1320px",
        margin: "0 auto",
        width: "100%",
        display: "grid",
        gap: "56px",
        alignItems: "center",
      }}
      className="grid-cols-1 md:grid-cols-[1.05fr_0.95fr]"
    >
      {/* ── Left: pitch ─────────────────────────────────────────────────── */}
      <div>
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="hs-pill-badge"
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--hs-a3)",
              flexShrink: 0,
            }}
          />
          SKILL-MATCHED HIRING
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          style={{
            margin: "22px 0 0",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            fontSize: "clamp(38px, 5.4vw, 66px)",
            color: "var(--hs-text)",
          }}
        >
          Hiring built around
          <br />
          <span className="hs-emphasis">real skill overlap.</span>
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18, duration: 0.5 }}
          style={{
            margin: "14px 0 0",
            fontSize: "clamp(15px, 1.6vw, 18px)",
            fontWeight: 600,
            color: "var(--hs-muted)",
            minHeight: "1.4em",
          }}
        >
          Built for{" "}
          <span style={{ color: "var(--hs-text)" }}>
            <TypeCycle words={["students.", "recruiters.", "placement cells.", "colleges."]} />
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.26, duration: 0.5 }}
          style={{
            margin: "20px 0 0",
            maxWidth: "480px",
            fontSize: "15px",
            lineHeight: 1.75,
            color: "var(--hs-muted)",
          }}
        >
          HireSync matches candidates to roles on actual skill overlap, runs campus drives end to end, and
          keeps everyone's application status in sync — all in one workspace.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34, duration: 0.5 }}
          style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "30px" }}
        >
          <MagneticButton to="/register" style={{ padding: "15px 30px", fontSize: "13.5px", borderRadius: "var(--hs-r-full)" }}>
            Get started <ArrowRight size={16} />
          </MagneticButton>
          <MagneticButton
            to="/login"
            variant="ghost"
            style={{ padding: "15px 30px", fontSize: "13.5px", borderRadius: "var(--hs-r-full)" }}
          >
            Sign in
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.44, duration: 0.5 }}
          style={{ display: "flex", flexWrap: "wrap", gap: "22px", marginTop: "28px" }}
        >
          {trustPoints.map((t) => (
            <span
              key={t}
              style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12.5px", color: "var(--hs-muted)" }}
            >
              <CheckCircle2 size={14} style={{ color: "var(--hs-ok)" }} />
              {t}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Right: floating preview card — a UI mockup, not live data ─────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:block"
        style={{ position: "relative" }}
      >
        <div className="hs-glass" style={{ padding: "26px", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "13px", marginBottom: "22px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                flexShrink: 0,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                fontSize: "13px",
                fontWeight: 800,
                color: "#fff",
                background: "var(--hs-a2)",
              }}
            >
              JD
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ width: "58%", height: "10px", borderRadius: "4px", background: "rgba(255,255,255,0.14)" }} />
              <div style={{ width: "38%", height: "8px", borderRadius: "4px", background: "rgba(255,255,255,0.08)", marginTop: "8px" }} />
            </div>
            <span
              style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--hs-ok)",
                background: "rgba(var(--hs-ok-rgb),0.14)",
                border: "1px solid rgba(var(--hs-ok-rgb),0.3)",
                padding: "5px 10px",
                borderRadius: "var(--hs-r-full)",
              }}
            >
              <CheckCircle2 size={12} /> Match 92%
            </span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginBottom: "20px" }}>
            {previewSkills.map((s) => (
              <span
                key={s}
                style={{
                  fontSize: "11.5px",
                  fontWeight: 600,
                  color: "var(--hs-a3)",
                  background: "rgba(var(--hs-a2-rgb),0.12)",
                  border: "1px solid rgba(var(--hs-a2-rgb),0.28)",
                  padding: "5px 11px",
                  borderRadius: "var(--hs-r-full)",
                }}
              >
                {s}
              </span>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {[0, 1].map((i) => (
              <div
                key={i}
                style={{
                  borderRadius: "var(--hs-r)",
                  border: "1px solid var(--hs-line)",
                  background: "rgba(255,255,255,0.03)",
                  padding: "14px",
                }}
              >
                <div style={{ width: "70%", height: "8px", borderRadius: "4px", background: "rgba(255,255,255,0.12)" }} />
                <div style={{ width: "45%", height: "8px", borderRadius: "4px", background: "rgba(255,255,255,0.07)", marginTop: "10px" }} />
              </div>
            ))}
          </div>

          {/* Floating badge chip clipping the card edge, Currix-style */}
          <span
            className="hidden lg:inline-flex"
            style={{
              position: "absolute",
              top: "-14px",
              right: "22px",
              alignItems: "center",
              gap: "6px",
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--hs-text)",
              background: "var(--hs-bg-elev)",
              border: "1px solid rgba(var(--hs-a2-rgb),0.4)",
              padding: "7px 14px",
              borderRadius: "var(--hs-r-full)",
              boxShadow: "var(--hs-shadow)",
            }}
          >
            <Sparkles size={12} style={{ color: "var(--hs-a3)" }} /> Skill match
          </span>
        </div>

        {/* Floating pill CTA overlapping the bottom-right corner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{ position: "absolute", bottom: "-18px", right: "18px" }}
        >
          <MagneticButton
            to="/register"
            strength={0.16}
            style={{ padding: "13px 22px", fontSize: "12.5px", borderRadius: "var(--hs-r-full)", boxShadow: "var(--hs-shadow-lg)" }}
          >
            <Sparkles size={14} /> View a match
          </MagneticButton>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default Hero;
