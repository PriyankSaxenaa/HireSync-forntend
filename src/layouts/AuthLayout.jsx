// src/layouts/AuthLayout.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, Zap, Target } from "lucide-react";
import Logo from "../components/common/Logo";
import Aurora from "../components/fx/Aurora";
import Marquee from "../components/fx/Marquee";
import Counter from "../components/fx/Counter";
import LiveBadge from "../components/fx/LiveBadge";
import { platformFacts } from "../constants/platformFacts";

const highlights = [
  { icon: Target, title: "Matched on real skills", body: "Roles ranked by actual overlap with your profile." },
  { icon: Zap, title: "Live status updates", body: "Shortlists and drive invites arrive the moment they happen." },
  { icon: ShieldCheck, title: "Role-scoped workspaces", body: "Students, recruiters and placement cells stay separated." },
];

/**
 * Split-screen auth shell: a living brand panel on the left, the form on the
 * right. Below the `lg` breakpoint the panel drops away and the form centres.
 */
const AuthLayout = ({ children }) => (
  <main
    data-hs-role="brand"
    style={{ position: "relative", minHeight: "100vh", display: "flex", overflow: "hidden" }}
  >
    <Aurora fixed blobOpacity={1.3} intensity={1.2} />

    {/* ── Brand panel — a translucent tint, not a solid fill, so the violet
         spotlight behind it stays visible ─────────────────────────────── */}
    <aside
      className="hidden lg:flex"
      style={{
        position: "relative",
        width: "46%",
        maxWidth: "620px",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "42px 48px",
        borderRight: "1px solid var(--hs-line)",
        background: "rgba(6, 6, 7, 0.5)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        zIndex: 2,
      }}
    >
      <Link to="/">
        <Logo size="md" />
      </Link>

      <div>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <LiveBadge label="REALTIME HIRING" />
          <h2
            style={{
              margin: "20px 0 14px",
              fontSize: "clamp(28px, 3.2vw, 42px)",
              fontWeight: 900,
              letterSpacing: "-0.032em",
              lineHeight: 1.08,
              color: "var(--hs-text)",
            }}
          >
            Where talent and
            <br />
            opportunity <span className="hs-emphasis">sync</span>.
          </h2>
          <p style={{ margin: 0, fontSize: "14.5px", lineHeight: 1.75, color: "var(--hs-muted)", maxWidth: "400px" }}>
            One workspace for students, recruiters and placement cells — matching, drives and outcomes all in
            the same place.
          </p>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "11px", marginTop: "34px" }}>
          {highlights.map((h, i) => (
            <motion.div
              key={h.title}
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="hs-glass"
              style={{ display: "flex", alignItems: "center", gap: "14px", padding: "15px 17px" }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  flexShrink: 0,
                  borderRadius: "var(--hs-r)",
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(var(--hs-a2-rgb),0.14)",
                  border: "1px solid rgba(var(--hs-a2-rgb),0.3)",
                }}
              >
                <h.icon size={17} style={{ color: "var(--hs-a3)" }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: "13.5px", fontWeight: 700, color: "var(--hs-text)" }}>{h.title}</p>
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--hs-muted)" }}>{h.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Structural facts about the build — no usage claims, since the
          platform hasn't launched. */}
      <div style={{ borderTop: "1px solid var(--hs-line)", paddingTop: "20px" }}>
        <Marquee duration={26} gap={38}>
          {platformFacts.map((p) => (
            <span
              key={p.label}
              style={{ display: "flex", alignItems: "baseline", gap: "7px", whiteSpace: "nowrap" }}
            >
              <b style={{ fontSize: "19px", fontWeight: 800, color: "var(--hs-text)" }}>
                <Counter value={p.value} suffix={p.suffix} duration={1600} />
              </b>
              <span style={{ fontFamily: "var(--hs-mono)", fontSize: "11px", color: "var(--hs-dim)", fontWeight: 600 }}>
                {p.label.toLowerCase()}
              </span>
            </span>
          ))}
        </Marquee>
      </div>
    </aside>

    {/* ── Form panel ──────────────────────────────────────────────────── */}
    <section
      style={{
        position: "relative",
        zIndex: 2,
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        padding: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <Link to="/" className="lg:hidden">
          <Logo size="sm" />
        </Link>

        <Link
          to="/"
          className="hs-chip"
          style={{ marginLeft: "auto", fontSize: "12px", transition: "gap 0.2s var(--hs-ease)" }}
          onMouseEnter={(e) => (e.currentTarget.style.gap = "10px")}
          onMouseLeave={(e) => (e.currentTarget.style.gap = "6px")}
        >
          <ArrowLeft size={13} /> Back to site
        </Link>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 0 40px" }}>
        {children}
      </div>
    </section>
  </main>
);

export default AuthLayout;
