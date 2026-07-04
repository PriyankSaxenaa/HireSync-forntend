// src/components/candidate/JobCard.jsx
import { motion } from "framer-motion";
import { MapPin, Calendar, Wallet, Bookmark, BookmarkCheck, Sparkles } from "lucide-react";
import GlowCard from "./GlowCard";
import SkillPill from "./SkillPill";

const JobCard = ({ job, matchScore, matchedSkills, isSaved, onApply, onSave, onView, applied, applying, saving }) => {
  return (
    <GlowCard glow="139,92,246" style={{ padding: "22px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
        <div style={{ minWidth: 0, cursor: "pointer" }} onClick={onView}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#fff" }}>{job.title}</h3>
          <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#c4b5fd", fontWeight: 600 }}>{job.company}</p>
        </div>
        {typeof matchScore === "number" && (
          <span
            style={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "11px",
              fontWeight: 800,
              color: "#fde68a",
              background: "rgba(251,191,36,0.12)",
              border: "1px solid rgba(251,191,36,0.25)",
              padding: "5px 10px",
              borderRadius: "999px",
            }}
          >
            <Sparkles size={11} /> {matchScore}% match
          </span>
        )}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", margin: "14px 0", fontSize: "12.5px", color: "#a897c9" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <MapPin size={13} /> {job.location}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <Wallet size={13} /> {job.salaryRange || "Not Disclosed"}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <Calendar size={13} /> {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : "—"}
        </span>
      </div>

      {job.skillsRequired?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
          {job.skillsRequired.slice(0, 6).map((s) => (
            <SkillPill key={s} tone={matchedSkills?.includes(s.toLowerCase()) ? "green" : "violet"} small>
              {s}
            </SkillPill>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: "8px", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onApply}
          disabled={applied || applying}
          style={{
            flex: 1,
            border: "none",
            borderRadius: "10px",
            padding: "10px",
            fontSize: "12.5px",
            fontWeight: 700,
            color: "#fff",
            background: applied ? "rgba(52,211,153,0.15)" : "linear-gradient(to right,#8b5cf6,#d946ef)",
            cursor: applied || applying ? "not-allowed" : "pointer",
            opacity: applying ? 0.7 : 1,
            boxShadow: applied ? "none" : "0 0 20px rgba(217,70,239,0.25)",
          }}
        >
          {applied ? "Applied ✓" : applying ? "Applying..." : "Apply Now"}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onSave}
          disabled={isSaved || saving}
          title={isSaved ? "Already saved" : "Save job"}
          style={{
            width: "42px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(216,180,254,0.18)",
            borderRadius: "10px",
            background: "transparent",
            color: isSaved ? "#f0abfc" : "#c4b5fd",
            cursor: isSaved ? "default" : "pointer",
          }}
        >
          {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
        </motion.button>
      </div>
    </GlowCard>
  );
};

export default JobCard;