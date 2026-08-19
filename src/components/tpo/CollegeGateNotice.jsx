// src/components/tpo/CollegeGateNotice.jsx
import { ArrowRight, ShieldAlert, ShieldQuestion } from "lucide-react";
import EmptyState from "../fx/EmptyState";
import MagneticButton from "../fx/MagneticButton";

// status: "none" (no college registered yet) | "unverified" (registered, awaiting admin)
const COPY = {
  none: {
    icon: ShieldQuestion,
    title: "Register your college first",
    body: "You need to register your college before you can do anything here.",
    cta: "Register college",
  },
  unverified: {
    icon: ShieldAlert,
    title: "Awaiting admin verification",
    body: "Your college is registered but hasn't been verified yet. Every placement-cell action stays locked until an admin approves it.",
    cta: "Check verification status",
  },
};

const CollegeGateNotice = ({ status = "none" }) => {
  const { icon, title, body, cta } = COPY[status] || COPY.none;

  return (
    <EmptyState
      icon={icon}
      title={title}
      subtitle={body}
      action={
        <MagneticButton to="/tpo/college">
          {cta} <ArrowRight size={16} />
        </MagneticButton>
      }
    />
  );
};

export default CollegeGateNotice;
