// src/components/common/Footer.jsx
import { Link } from "react-router-dom";
// lucide dropped its brand glyphs in v1, so the socials use generic marks.
import { Code2, ArrowUpRight } from "lucide-react";
import Logo from "./Logo";
import Marquee from "../fx/Marquee";

const columns = [
  {
    title: "Platform",
    links: [
      { label: "Browse Jobs", to: "/login" },
      { label: "Campus Drives", to: "/login" },
      { label: "For Recruiters", to: "/register" },
      { label: "For Colleges", to: "/register" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign In", to: "/login" },
      { label: "Create Account", to: "/register" },
      { label: "Reset Password", to: "/forgot-password" },
    ],
  },
];

// Only real, verifiable links — no placeholder domain or unmanned inbox.
const socials = [{ icon: Code2, label: "GitHub", href: "https://github.com/PriyankSaxenaa" }];

const Footer = () => (
  <footer style={{ position: "relative", marginTop: "90px", overflow: "hidden" }}>
    <div aria-hidden="true" style={{ height: "1px", background: "var(--hs-line-strong)" }} />

    {/* Ticker strip so even the footer is never static */}
    <div style={{ padding: "16px 0", borderBottom: "1px solid var(--hs-line)" }}>
      <Marquee duration={38}>
        {["HIRE FASTER", "SYNC CAMPUSES", "TRACK EVERY APPLICATION", "ONE PLACEMENT ECOSYSTEM", "BUILT FOR SCALE"].map(
          (word) => (
            <span
              key={word}
              className="hs-eyebrow"
              style={{ fontSize: "12px", color: "var(--hs-dim)", letterSpacing: "0.26em" }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "var(--hs-a2)",
                  display: "inline-block",
                }}
              />
              {word}
            </span>
          )
        )}
      </Marquee>
    </div>

    <div
      style={{
        maxWidth: "1240px",
        margin: "0 auto",
        padding: "48px 24px 32px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
        gap: "40px",
      }}
    >
      <div style={{ gridColumn: "span 1", minWidth: 0 }}>
        <Logo />
        <p
          style={{
            margin: "16px 0 20px",
            fontSize: "13px",
            lineHeight: 1.7,
            color: "var(--hs-muted)",
            maxWidth: "300px",
          }}
        >
          One hiring ecosystem for students, recruiters and placement cells — from the first application to the
          signed offer.
        </p>
        <div style={{ display: "flex", gap: "9px" }}>
          {socials.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "grid",
                placeItems: "center",
                width: "38px",
                height: "38px",
                borderRadius: "var(--hs-r-full)",
                border: "1px solid var(--hs-line)",
                background: "var(--hs-surface)",
                color: "var(--hs-muted)",
                transition: "all 0.22s var(--hs-ease)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.borderColor = "var(--hs-line-strong)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--hs-muted)";
                e.currentTarget.style.borderColor = "var(--hs-line)";
              }}
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>

      {columns.map((col) => (
        <div key={col.title}>
          <p className="hs-eyebrow" style={{ margin: "0 0 16px", fontSize: "10.5px" }}>
            {col.title}
          </p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "11px" }}>
            {col.links.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "13.5px",
                    color: "var(--hs-muted)",
                    transition: "color 0.2s, gap 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--hs-text)";
                    e.currentTarget.style.gap = "8px";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--hs-muted)";
                    e.currentTarget.style.gap = "4px";
                  }}
                >
                  {l.label}
                  <ArrowUpRight size={13} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div>
        <p className="hs-eyebrow" style={{ margin: "0 0 16px", fontSize: "10.5px" }}>
          Status
        </p>
        <div className="hs-card" style={{ padding: "16px" }}>
          <p
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              margin: 0,
              fontSize: "12.5px",
              fontWeight: 700,
              color: "var(--hs-info)",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", flexShrink: 0 }} />
            Pre-launch build
          </p>
          <p style={{ margin: "8px 0 0", fontSize: "11.5px", color: "var(--hs-dim)", lineHeight: 1.6 }}>
            Core workflows — matching, notifications, campus drives — are implemented end to end.
          </p>
        </div>
      </div>
    </div>

    <div
      style={{
        borderTop: "1px solid var(--hs-line)",
        padding: "18px 24px",
        textAlign: "center",
        fontSize: "12px",
        color: "var(--hs-dim)",
      }}
    >
      © {new Date().getFullYear()} HireSync · Connecting talent with opportunity.
    </div>
  </footer>
);

export default Footer;
