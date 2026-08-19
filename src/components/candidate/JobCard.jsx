// src/components/candidate/JobCard.jsx
import { motion } from "framer-motion";
import { MapPin, Calendar, Wallet, Bookmark, BookmarkCheck, Sparkles, Check, Loader2 } from "lucide-react";
import SpotlightCard from "../fx/SpotlightCard";
import SkillPill from "./SkillPill";

/**
 * A job in the candidate's feed.
 *
 * When a match score is present the card switches on its orbiting border and
 * shows a match meter that fills on mount — a strong match should be visible
 * before you read a word of it.
 */
const JobCard = ({ job, matchScore, matchedSkills, isSaved, onApply, onSave, onView, applied, applying, saving }) => {
  const hasMatch = typeof matchScore === "number";
  const strong = hasMatch && matchScore >= 70;

  return (
    <SpotlightCard live={strong} padding={22} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
        <div style={{ minWidth: 0, cursor: onView ? "pointer" : "default" }} onClick={onView}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "var(--hs-text)", lineHeight: 1.3 }}>
            {job.title}
          </h3>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--hs-a2)", fontWeight: 700 }}>
            {job.company}
          </p>
        </div>

        {hasMatch && (
          <span
            style={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "11px",
              fontWeight: 800,
              color: strong ? "var(--hs-ok)" : "var(--hs-warn)",
              background: strong ? "rgba(var(--hs-ok-rgb),0.12)" : "rgba(var(--hs-warn-rgb),0.12)",
              border: `1px solid ${strong ? "rgba(var(--hs-ok-rgb),0.3)" : "rgba(var(--hs-warn-rgb),0.28)"}`,
              padding: "5px 11px",
              borderRadius: "var(--hs-r-full)",
            }}
          >
            <Sparkles size={11} /> {matchScore}%
          </span>
        )}
      </div>

      {/* Match meter — draws itself in on mount */}
      {hasMatch && (
        <div
          style={{
            marginTop: "13px",
            height: "4px",
            borderRadius: "var(--hs-r-full)",
            background: "rgba(255,255,255,0.07)",
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, matchScore))}%` }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="hs-sheen"
            style={{
              height: "100%",
              borderRadius: "inherit",
              background: strong
                ? "linear-gradient(90deg, rgba(var(--hs-ok-rgb),0.5), var(--hs-ok))"
                : "var(--hs-grad)",
            }}
          />
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          margin: "14px 0",
          fontSize: "12.5px",
          color: "var(--hs-muted)",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <MapPin size={13} style={{ color: "var(--hs-dim)" }} /> {job.location || "—"}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <Wallet size={13} style={{ color: "var(--hs-dim)" }} /> {job.salaryRange || "Not disclosed"}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <Calendar size={13} style={{ color: "var(--hs-dim)" }} />{" "}
          {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : "—"}
        </span>
      </div>

      {job.skillsRequired?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
          {job.skillsRequired.slice(0, 6).map((s) => (
            <SkillPill key={s} tone={matchedSkills?.includes(s.toLowerCase()) ? "green" : "violet"} small>
              {s}
            </SkillPill>
          ))}
          {job.skillsRequired.length > 6 && (
            <SkillPill tone="violet" small>
              +{job.skillsRequired.length - 6}
            </SkillPill>
          )}
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: "8px",
          marginTop: "auto",
          paddingTop: "14px",
          borderTop: "1px solid var(--hs-line)",
        }}
      >
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onApply}
          disabled={applied || applying}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "7px",
            border: applied ? "1px solid rgba(var(--hs-ok-rgb),0.32)" : "none",
            borderRadius: "var(--hs-r-full)",
            padding: "10px",
            fontSize: "12.5px",
            fontWeight: 700,
            color: applied ? "var(--hs-ok)" : "#fff",
            background: applied ? "rgba(var(--hs-ok-rgb),0.12)" : "var(--hs-a2)",
            cursor: applied || applying ? "not-allowed" : "pointer",
            opacity: applying ? 0.7 : 1,
          }}
        >
          {applied ? (
            <>
              <Check size={14} /> Applied
            </>
          ) : applying ? (
            <>
              <Loader2 size={14} style={{ animation: "hs-spin 1s linear infinite" }} /> Applying…
            </>
          ) : (
            "Apply now"
          )}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onSave}
          disabled={isSaved || saving}
          title={isSaved ? "Already saved" : "Save job"}
          aria-label={isSaved ? "Saved" : "Save job"}
          style={{
            width: "42px",
            display: "grid",
            placeItems: "center",
            border: `1px solid ${isSaved ? "rgba(var(--hs-a2-rgb),0.45)" : "var(--hs-line)"}`,
            borderRadius: "var(--hs-r-full)",
            background: isSaved ? "rgba(var(--hs-a2-rgb),0.12)" : "transparent",
            color: isSaved ? "var(--hs-a2)" : "var(--hs-muted)",
            cursor: isSaved ? "default" : "pointer",
            transition: "all 0.2s var(--hs-ease)",
          }}
        >
          {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
        </motion.button>
      </div>
    </SpotlightCard>
  );
};

export default JobCard;
