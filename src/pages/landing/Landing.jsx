// src/pages/landing/Landing.jsx
import {
  Target,
  Radio,
  ShieldCheck,
  BarChart3,
  FileSearch,
  GraduationCap,
  Briefcase,
  School,
  ShieldHalf,
  ArrowRight,
  UserPlus,
  Send,
  CheckCircle2,
} from "lucide-react";

import Navbar from "../../components/common/Navbar";
import Hero from "../../components/common/Hero";
import Footer from "../../components/common/Footer";

import Aurora from "../../components/fx/Aurora";
import Reveal from "../../components/fx/Reveal";
import Marquee from "../../components/fx/Marquee";
import SpotlightCard from "../../components/fx/SpotlightCard";
import MagneticButton from "../../components/fx/MagneticButton";
import Counter from "../../components/fx/Counter";
import WordReveal from "../../components/fx/WordReveal";
import { platformFacts } from "../../constants/platformFacts";

/* ── Content ──────────────────────────────────────────────────────────── */

const features = [
  {
    icon: Target,
    title: "Skill-overlap matching",
    body: "Recommendations are scored on the actual intersection between a candidate's skills and a role's requirements — with the matched skills shown, not hidden behind a number.",
  },
  {
    icon: Radio,
    title: "Realtime everywhere",
    body: "Socket-backed notifications push status changes, new drives and confirmations the moment they happen. No refresh, no stale dashboard.",
  },
  {
    icon: FileSearch,
    title: "Resume intelligence",
    body: "Upload once. Skills are parsed straight out of the document and flow into matching, filters and recruiter search.",
  },
  {
    icon: School,
    title: "Campus drives, end to end",
    body: "Placement cells publish drives to targeted groups, students respond, and every confirmation lands back in one roster.",
  },
  {
    icon: ShieldCheck,
    title: "Role-scoped access",
    body: "Four separate workspaces behind guarded routes — students, recruiters, placement officers and admins each see only their own surface.",
  },
  {
    icon: BarChart3,
    title: "Analytics that answer",
    body: "Funnels, conversion and placement trends rendered live, so a hiring review starts from data instead of a spreadsheet.",
  },
];

const roles = [
  {
    key: "candidate",
    icon: GraduationCap,
    name: "Students",
    tagline: "Find it, apply, track it.",
    points: ["Personalised job matches", "One-tap apply & save", "Live application timeline", "Campus drive invites"],
  },
  {
    key: "recruiter",
    icon: Briefcase,
    name: "Recruiters",
    tagline: "Post once, shortlist faster.",
    points: ["Publish & manage roles", "Ranked applicant pools", "Inline status pipeline", "Resume-level detail"],
  },
  {
    key: "tpo",
    icon: School,
    name: "Placement cells",
    tagline: "Run the whole season.",
    points: ["Student roster & groups", "Targeted drive publishing", "Response tracking", "College-wide reporting"],
  },
  {
    key: "admin",
    icon: ShieldHalf,
    name: "Admins",
    tagline: "Keep the platform clean.",
    points: ["User & role oversight", "Job moderation", "College verification", "Platform-wide metrics"],
  },
];

const flow = [
  { icon: UserPlus, title: "Create your profile", body: "Pick a role, upload a resume, and your skills are parsed automatically." },
  { icon: Target, title: "Get matched", body: "Roles are ranked against your real skill set — with the overlap shown up front." },
  { icon: Send, title: "Apply & respond", body: "Apply to jobs or confirm campus drives. Every action lands in one timeline." },
  { icon: CheckCircle2, title: "Track to outcome", body: "Watch status move from applied to shortlisted to hired, live." },
];

// The real stack this app is built on — verified against package.json in
// both repos, not a generic skills list.
const tickerWords = [
  "REACT", "NODE.JS", "EXPRESS", "MONGODB", "SOCKET.IO", "TAILWIND CSS", "JWT AUTH", "REDIS",
];

/* ── Section wrapper — numbered index label, left-aligned, hairline rule ── */

const Section = ({ id, index, eyebrow, title, subtitle, children, style }) => (
  <section id={id} style={{ position: "relative", zIndex: 20, padding: "100px 28px", ...style }}>
    <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
      {(eyebrow || title) && (
        <Reveal style={{ marginBottom: "48px" }}>
          <div className="hs-index-rule" style={{ marginBottom: "20px" }}>
            <span className="hs-index-num">{index}</span>
            <span className="hs-index-line" />
            {eyebrow && (
              <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                {eyebrow}
              </span>
            )}
            <span className="hs-index-tick">+</span>
          </div>

          {title && (
            <h2
              className="hs-display"
              style={{
                margin: 0,
                fontSize: "clamp(30px, 5vw, 58px)",
                color: "var(--hs-text)",
                maxWidth: "900px",
              }}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p
              style={{
                margin: "18px 0 0",
                maxWidth: "560px",
                fontSize: "14.5px",
                lineHeight: 1.75,
                color: "var(--hs-muted)",
              }}
            >
              {subtitle}
            </p>
          )}
        </Reveal>
      )}
      {children}
    </div>
  </section>
);

/* ── Page ─────────────────────────────────────────────────────────────── */

const Landing = () => (
  <main data-hs-role="brand" style={{ position: "relative", overflowX: "hidden" }}>
    <Aurora fixed blobOpacity={1.5} intensity={1.15} />

    <Navbar />
    <Hero />

    {/* ── Skill ticker: two rows crawling in opposite directions ────────── */}
    <div
      style={{
        position: "relative",
        zIndex: 20,
        padding: "24px 0",
        borderTop: "1px solid var(--hs-line)",
        borderBottom: "1px solid var(--hs-line)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      {[false, true].map((reverse, row) => (
        <Marquee key={row} duration={reverse ? 44 : 36} reverse={reverse} gap={44}>
          {tickerWords.map((w) => (
            <span
              key={w}
              style={{
                fontSize: "16px",
                fontWeight: 800,
                letterSpacing: "0.05em",
                color: row === 0 ? "var(--hs-dim)" : "transparent",
                WebkitTextStroke: row === 1 ? "1px var(--hs-line-strong)" : undefined,
                whiteSpace: "nowrap",
              }}
            >
              {w}
            </span>
          ))}
        </Marquee>
      ))}
    </div>

    {/* ── Platform ──────────────────────────────────────────────────────── */}
    <Section
      id="platform"
      index="01"
      eyebrow="The platform"
      title="Everything a hiring cycle needs, in one place."
      subtitle="Six systems that normally live in six different tools, wired into one workspace that updates itself."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
          gap: "1px",
          background: "var(--hs-line)",
          border: "1px solid var(--hs-line)",
        }}
      >
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.05}>
            <div style={{ background: "var(--hs-bg)", padding: "30px 26px", height: "100%" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "var(--hs-r)",
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(var(--hs-a2-rgb),0.12)",
                  border: "1px solid rgba(var(--hs-a2-rgb),0.28)",
                  marginBottom: "20px",
                }}
              >
                <f.icon size={19} style={{ color: "var(--hs-a3)" }} />
              </div>
              <h3 style={{ margin: "0 0 9px", fontSize: "16px", fontWeight: 800, color: "var(--hs-text)" }}>
                {f.title}
              </h3>
              <p style={{ margin: 0, fontSize: "13.5px", lineHeight: 1.72, color: "var(--hs-muted)" }}>{f.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>

    {/* ── Roles — each card previews its own workspace palette ──────────── */}
    <Section
      id="roles"
      index="02"
      eyebrow="Four workspaces"
      title="One platform, four points of view."
      subtitle="Every role gets its own dashboard and its own permissions — hover a card to see its accent."
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(255px, 1fr))", gap: "1px" }}>
        {roles.map((r, i) => (
          <Reveal key={r.key} delay={i * 0.06}>
            {/* Re-scoping the role token re-skins the card's accent in one line */}
            <div data-hs-role={r.key} style={{ height: "100%" }}>
              <SpotlightCard hover={false} radius="0" padding={26} style={{ height: "100%" }}>
                <div
                  style={{
                    width: "46px",
                    height: "46px",
                    borderRadius: "var(--hs-r)",
                    display: "grid",
                    placeItems: "center",
                    background: "rgba(var(--hs-a2-rgb),0.14)",
                    border: "1px solid rgba(var(--hs-a2-rgb),0.3)",
                    marginBottom: "18px",
                  }}
                >
                  <r.icon size={20} style={{ color: "var(--hs-a3)" }} />
                </div>

                <h3 style={{ margin: "0 0 5px", fontSize: "18px", fontWeight: 800, color: "var(--hs-text)" }}>
                  {r.name}
                </h3>
                <p style={{ margin: "0 0 18px", fontSize: "12.5px", color: "var(--hs-muted)", fontWeight: 600 }}>
                  {r.tagline}
                </p>

                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {r.points.map((p) => (
                    <li
                      key={p}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "9px",
                        fontSize: "13px",
                        color: "var(--hs-muted)",
                      }}
                    >
                      <span
                        style={{
                          width: "4px",
                          height: "4px",
                          borderRadius: "50%",
                          flexShrink: 0,
                          background: "var(--hs-a3)",
                        }}
                      />
                      {p}
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>

    {/* ── Flow ──────────────────────────────────────────────────────────── */}
    <Section
      id="flow"
      index="03"
      eyebrow="How it works"
      title="From sign-up to signed offer."
      subtitle="Four steps — nothing hidden between them."
    >
      <div style={{ position: "relative" }}>
        <div
          aria-hidden="true"
          className="hidden lg:block"
          style={{
            position: "absolute",
            top: "27px",
            left: "8%",
            right: "8%",
            height: "1px",
            background:
              "repeating-linear-gradient(90deg, var(--hs-line-strong) 0 10px, transparent 10px 22px)",
          }}
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "26px" }}>
          {flow.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <div style={{ position: "relative", width: 54, height: 54, marginBottom: "20px" }}>
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    background: "var(--hs-bg-elev)",
                    border: "1px solid var(--hs-line-strong)",
                  }}
                >
                  <s.icon size={21} style={{ color: "var(--hs-a3)" }} />
                </div>
                <span
                  style={{
                    position: "absolute",
                    top: "-4px",
                    right: "-4px",
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    fontSize: "10px",
                    fontWeight: 800,
                    color: "#fff",
                    background: "var(--hs-a2)",
                  }}
                >
                  {i + 1}
                </span>
              </div>

              <h3 style={{ margin: "0 0 8px", fontSize: "15.5px", fontWeight: 800, color: "var(--hs-text)" }}>
                {s.title}
              </h3>
              <p
                style={{
                  margin: 0,
                  maxWidth: "250px",
                  fontSize: "13px",
                  lineHeight: 1.7,
                  color: "var(--hs-muted)",
                }}
              >
                {s.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>

    {/* ── The build — the one bright interlude on an otherwise dark page.
         No usage metrics: HireSync hasn't launched, so these are structural
         facts about the codebase itself, not traction. ─────────────────── */}
    <section id="impact" style={{ position: "relative", zIndex: 20, background: "var(--hs-light-bg)" }}>
      <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "100px 28px" }}>
        <Reveal style={{ marginBottom: "48px" }}>
          <div className="hs-index-rule" style={{ marginBottom: "20px", color: "var(--hs-light-muted)" }}>
            <span className="hs-index-num" style={{ color: "var(--hs-light-text)" }}>04</span>
            <span className="hs-index-line" style={{ background: "var(--hs-light-line)" }} />
            <span
              style={{
                fontFamily: "var(--hs-mono)",
                fontSize: "10.5px",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              The build
            </span>
            <span className="hs-index-tick">+</span>
          </div>

          <h2
            className="hs-display"
            style={{ margin: 0, fontSize: "clamp(30px, 5vw, 58px)", color: "var(--hs-light-text)", maxWidth: "820px" }}
          >
            What's actually running under the hood.
          </h2>
          <p
            style={{
              margin: "18px 0 0",
              maxWidth: "560px",
              fontSize: "14.5px",
              lineHeight: 1.75,
              color: "var(--hs-light-muted)",
            }}
          >
            HireSync hasn't launched — so instead of usage numbers, here's what's structurally true about the
            build itself.
          </p>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1px",
            background: "var(--hs-light-line)",
            border: "1px solid var(--hs-light-line)",
          }}
        >
          {platformFacts.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <div style={{ background: "var(--hs-light-bg)", padding: "34px 26px", height: "100%" }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: "clamp(38px, 5vw, 58px)",
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    color: "var(--hs-light-text)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  <Counter value={s.value} suffix={s.suffix} duration={1600} />
                </p>
                <p
                  style={{
                    margin: "8px 0 0",
                    fontFamily: "var(--hs-mono)",
                    fontSize: "11.5px",
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    color: "var(--hs-light-muted)",
                  }}
                >
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    {/* ── Closing CTA ───────────────────────────────────────────────────── */}
    <section style={{ position: "relative", zIndex: 20, padding: "20px 28px 100px" }}>
      <Reveal style={{ maxWidth: "1320px", margin: "0 auto" }}>
        <div
          style={{
            borderTop: "1px solid var(--hs-line)",
            paddingTop: "56px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "36px",
          }}
        >
          <div>
            <h2
              className="hs-display"
              style={{
                margin: 0,
                fontSize: "clamp(32px, 6vw, 76px)",
                color: "var(--hs-text)",
              }}
            >
              Start hiring
              <br />
              in <span className="hs-emphasis">sync</span>.
            </h2>
            <p style={{ margin: "18px 0 0", maxWidth: "440px" }}>
              <WordReveal
                text="Create an account, pick your role, and your workspace is ready in under a minute."
                style={{ fontSize: "14.5px", lineHeight: 1.75, color: "var(--hs-muted)" }}
              />
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            <MagneticButton to="/register" style={{ padding: "16px 32px", fontSize: "14px", borderRadius: "var(--hs-r-full)" }}>
              Create free account <ArrowRight size={16} />
            </MagneticButton>
            <MagneticButton
              to="/login"
              variant="ghost"
              style={{ padding: "16px 32px", fontSize: "14px", borderRadius: "var(--hs-r-full)" }}
            >
              I already have one
            </MagneticButton>
          </div>
        </div>
      </Reveal>
    </section>

    <div style={{ position: "relative", zIndex: 20 }}>
      <Footer />
    </div>
  </main>
);

export default Landing;
