// src/components/candidate/DriveCard.jsx
import { motion } from "framer-motion";
import { Building2, CalendarClock, ThumbsUp, ThumbsDown } from "lucide-react";
import GlowCard from "./GlowCard";

const STATUS = {
  upcoming: { bg: "rgba(251,191,36,0.15)", color: "#fcd34d" },
  ongoing: { bg: "rgba(217,70,239,0.15)", color: "#f0abfc" },
  closed: { bg: "rgba(148,163,184,0.15)", color: "#cbd5e1" },
};

const DriveCard = ({ drive, onView, onRespond, responding }) => {
  const status = STATUS[drive.status] || STATUS.ongoing;
  const isClosed = drive.status === "closed";

  return (
    <GlowCard glow="217,70,239" style={{ padding: "20px" }}>
      <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            background: "linear-gradient(135deg,#8b5cf6,#d946ef)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Building2 size={18} color="#fff" />
        </div>
        <div style={{ flex: 1, minWidth: 0, cursor: "pointer" }} onClick={onView}>
          <p style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#fff" }}>{drive.title}</p>
          <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: "#a897c9" }}>{drive.company}</p>
        </div>
        <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "capitalize", color: status.color, background: status.bg, padding: "4px 10px", borderRadius: "999px", flexShrink: 0 }}>
          {drive.status}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "6px", margin: "14px 0", fontSize: "12px", color: "#a897c9" }}>
        <CalendarClock size={13} /> Respond before {new Date(drive.deadline).toLocaleString()}
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <motion.button
          whileTap={{ scale: 0.96 }}
          disabled={isClosed || responding}
          onClick={() => onRespond("interested")}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            border: drive.myResponse === "interested" ? "none" : "1px solid rgba(52,211,153,0.3)",
            borderRadius: "10px",
            padding: "9px",
            fontSize: "12.5px",
            fontWeight: 700,
            color: drive.myResponse === "interested" ? "#fff" : "#6ee7b7",
            background: drive.myResponse === "interested" ? "linear-gradient(to right,#34d399,#10b981)" : "transparent",
            cursor: isClosed ? "not-allowed" : "pointer",
            opacity: isClosed ? 0.5 : 1,
          }}
        >
          <ThumbsUp size={13} /> Interested
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          disabled={isClosed || responding}
          onClick={() => onRespond("not_interested")}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            border: drive.myResponse === "not_interested" ? "none" : "1px solid rgba(251,113,133,0.3)",
            borderRadius: "10px",
            padding: "9px",
            fontSize: "12.5px",
            fontWeight: 700,
            color: drive.myResponse === "not_interested" ? "#fff" : "#fda4af",
            background: drive.myResponse === "not_interested" ? "linear-gradient(to right,#fb7185,#f43f5e)" : "transparent",
            cursor: isClosed ? "not-allowed" : "pointer",
            opacity: isClosed ? 0.5 : 1,
          }}
        >
          <ThumbsDown size={13} /> Not Interested
        </motion.button>
      </div>
    </GlowCard>
  );
};

export default DriveCard;