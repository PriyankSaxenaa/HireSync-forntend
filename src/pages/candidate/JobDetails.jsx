// src/pages/candidate/JobDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ArrowLeft, MapPin, Calendar, Wallet, Bookmark, BookmarkCheck } from "lucide-react";
import GlowCard from "../../components/candidate/GlowCard";
import SkillPill from "../../components/candidate/SkillPill";
import { getJobById } from "../../api/jobs.api";
import { applyToJob, saveJob, getMyApplications, getSavedJobs } from "../../api/applications.api";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [applying, setApplying] = useState(false);
  const [savingJob, setSavingJob] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [jobRes, appsRes, savedRes] = await Promise.allSettled([
          getJobById(id),
          getMyApplications(),
          getSavedJobs(),
        ]);
        if (jobRes.status === "fulfilled") setJob(jobRes.value.data.job);
        else toast.error("Job not found");
        if (appsRes.status === "fulfilled") {
          setApplied((appsRes.value.data.applications || []).some((a) => a.job?._id === id));
        }
        if (savedRes.status === "fulfilled") {
          setSaved((savedRes.value.data.savedJobs || []).some((j) => j._id === id));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await applyToJob(id);
      toast.success("Application submitted!");
      setApplied(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    setSavingJob(true);
    try {
      await saveJob(id);
      toast.success("Job saved");
      setSaved(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save job");
    } finally {
      setSavingJob(false);
    }
  };

  if (loading) return <p style={{ color: "#a897c9" }}>Loading job...</p>;
  if (!job) return <p style={{ color: "#a897c9" }}>Job not found.</p>;

  return (
    <div style={{ maxWidth: "760px" }}>
      <button
        onClick={() => navigate(-1)}
        style={{ display: "flex", alignItems: "center", gap: "6px", border: "none", background: "transparent", color: "#a897c9", fontSize: "13px", fontWeight: 600, cursor: "pointer", marginBottom: "18px", padding: 0 }}
      >
        <ArrowLeft size={14} /> Back
      </button>

      <GlowCard style={{ padding: "30px" }} hoverLift={false}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "14px", marginBottom: "18px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: "#fff" }}>{job.title}</h1>
            <p style={{ margin: "6px 0 0", fontSize: "15px", color: "#c4b5fd", fontWeight: 600 }}>{job.company}</p>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "18px", marginBottom: "20px", fontSize: "13.5px", color: "#a897c9" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><MapPin size={14} /> {job.location}</span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Wallet size={14} /> {job.salaryRange || "Not Disclosed"}</span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Calendar size={14} /> Apply before {new Date(job.applicationDeadline).toLocaleDateString()}</span>
        </div>

        {job.skillsRequired?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
            {job.skillsRequired.map((s) => <SkillPill key={s}>{s}</SkillPill>)}
          </div>
        )}

        <p style={{ fontSize: "14px", lineHeight: 1.7, color: "#e9d5ff", whiteSpace: "pre-wrap", marginBottom: "26px" }}>{job.description}</p>

        <div style={{ display: "flex", gap: "10px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleApply}
            disabled={applied || applying}
            style={{
              flex: 1,
              border: "none",
              borderRadius: "12px",
              padding: "13px",
              fontSize: "14px",
              fontWeight: 700,
              color: "#fff",
              background: applied ? "rgba(52,211,153,0.15)" : "linear-gradient(to right,#8b5cf6,#d946ef)",
              cursor: applied || applying ? "not-allowed" : "pointer",
              boxShadow: applied ? "none" : "0 0 25px rgba(217,70,239,0.3)",
            }}
          >
            {applied ? "Applied ✓" : applying ? "Applying..." : "Apply Now"}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSave}
            disabled={saved || savingJob}
            style={{ width: "52px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(216,180,254,0.18)", borderRadius: "12px", background: "transparent", color: saved ? "#f0abfc" : "#c4b5fd", cursor: saved ? "default" : "pointer" }}
          >
            {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </motion.button>
        </div>
      </GlowCard>
    </div>
  );
};

export default JobDetails;