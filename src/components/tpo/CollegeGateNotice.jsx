// src/components/tpo/CollegeGateNotice.jsx
import { Link } from "react-router-dom";
import { ArrowRight, ShieldAlert, ShieldQuestion } from "lucide-react";

// status: "none" (no college registered yet) | "unverified" (registered, awaiting admin)
const COPY = {
  none: {
    icon: ShieldQuestion,
    title: "Register your college first",
    body: "You need to register your college before you can do anything here.",
    cta: "Register College",
  },
  unverified: {
    icon: ShieldAlert,
    title: "Awaiting admin verification",
    body: "Your college is registered but hasn't been verified yet. Every TPO action is locked until an admin approves it.",
    cta: "Check Verification Status",
  },
};

const CollegeGateNotice = ({ status = "none" }) => {
  const { icon: Icon, title, body, cta } = COPY[status] || COPY.none;

  return (
    <div
      style={{
        background: "#170f28",
        border: "1px dashed rgba(216,180,254,0.25)",
        borderRadius: "24px",
        padding: "60px 30px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "64px",
          height: "64px",
          margin: "0 auto 20px",
          borderRadius: "18px",
          background: "linear-gradient(135deg,#8b5cf6,#d946ef)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={28} color="#fff" />
      </div>
      <h2 style={{ margin: "0 0 8px", fontSize: "19px", fontWeight: 800, color: "#fff" }}>{title}</h2>
      <p style={{ margin: "0 0 24px", fontSize: "13.5px", color: "#a897c9", maxWidth: "420px", marginLeft: "auto", marginRight: "auto" }}>
        {body}
      </p>
      <Link
        to="/tpo/college"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          borderRadius: "999px",
          padding: "12px 26px",
          fontSize: "14px",
          fontWeight: 700,
          color: "#fff",
          background: "linear-gradient(to right,#8b5cf6,#d946ef)",
          textDecoration: "none",
        }}
      >
        {cta} <ArrowRight size={16} />
      </Link>
    </div>
  );
};

export default CollegeGateNotice;