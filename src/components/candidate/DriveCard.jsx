// src/components/candidate/DriveCard.jsx
import { motion } from "framer-motion";
import { Building2, CalendarClock, ThumbsUp, ThumbsDown } from "lucide-react";
import SpotlightCard from "../fx/SpotlightCard";
import StatusPill from "../fx/StatusPill";

/**
 * A campus drive awaiting the candidate's response.
 *
 * While a drive is still open and unanswered the card keeps its orbiting
 * border running, so an outstanding decision is impossible to scroll past.
 */
const DriveCard = ({ drive, onView, onRespond, responding }) => {
  const isClosed = drive.status === "closed";
  const answered = Boolean(drive.myResponse);
  const awaiting = !isClosed && !answered;

  const respondBtn = (kind, Icon, label, tone) => {
    const chosen = drive.myResponse === kind;
    return (
      <motion.button
        whileTap={{ scale: 0.96 }}
        disabled={isClosed || responding}
        onClick={() => onRespond(kind)}
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          border: chosen ? "1px solid transparent" : `1px solid rgba(${tone},0.32)`,
          borderRadius: "var(--hs-r-full)",
          padding: "9px",
          fontSize: "12.5px",
          fontWeight: 700,
          color: chosen ? "#fff" : `rgb(${tone})`,
          background: chosen ? `rgb(${tone})` : "transparent",
          cursor: isClosed ? "not-allowed" : "pointer",
          opacity: isClosed ? 0.5 : 1,
          transition: "all 0.22s var(--hs-ease)",
        }}
      >
        <Icon size={13} /> {label}
      </motion.button>
    );
  };

  return (
    <SpotlightCard live={awaiting} padding={20} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", gap: "13px", alignItems: "flex-start" }}>
        <div
          style={{
            width: "42px",
            height: "42px",
            flexShrink: 0,
            borderRadius: "var(--hs-r)",
            display: "grid",
            placeItems: "center",
            background: "rgba(var(--hs-a2-rgb),0.14)",
            border: "1px solid rgba(var(--hs-a2-rgb),0.3)",
          }}
        >
          <Building2 size={18} style={{ color: "var(--hs-a3)" }} />
        </div>

        <div style={{ flex: 1, minWidth: 0, cursor: onView ? "pointer" : "default" }} onClick={onView}>
          <p style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: "var(--hs-text)", lineHeight: 1.3 }}>
            {drive.title}
          </p>
          <p style={{ margin: "3px 0 0", fontSize: "12.5px", color: "var(--hs-muted)" }}>{drive.company}</p>
        </div>

        <StatusPill status={drive.status} />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          margin: "14px 0",
          fontSize: "12px",
          color: awaiting ? "var(--hs-warn)" : "var(--hs-muted)",
          fontWeight: awaiting ? 600 : 400,
        }}
      >
        <CalendarClock size={13} />
        Respond before {drive.deadline ? new Date(drive.deadline).toLocaleString() : "—"}
      </div>

      <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
        {respondBtn("interested", ThumbsUp, "Interested", "var(--hs-ok-rgb)")}
        {respondBtn("not_interested", ThumbsDown, "Not interested", "var(--hs-bad-rgb)")}
      </div>
    </SpotlightCard>
  );
};

export default DriveCard;
