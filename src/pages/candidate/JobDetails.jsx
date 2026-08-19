// src/pages/candidate/JobDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { MapPin, Calendar, Wallet, Bookmark, BookmarkCheck, Building2, Check, Loader2, Briefcase } from "lucide-react";
import SpotlightCard from "../../components/fx/SpotlightCard";
import SkillPill from "../../components/candidate/SkillPill";
import BackLink from "../../components/fx/BackLink";
import Loader from "../../components/fx/Loader";
import EmptyState from "../../components/fx/EmptyState";
import Aurora from "../../components/fx/Aurora";
import { getJobById } from "../../api/jobs.api";
import { applyToJob, saveJob, getMyApplications, getSavedJobs } from "../../api/applications.api";

const Meta = ({ icon: Icon, label, value }) => (
  <div
    style={{
      flex: "1 1 150px",
      padding: "13px 15px",
      borderRadius: "var(--hs-r)",
      background: "rgba(255,255,255,0.035)",
      border: "1px solid var(--hs-line)",
    }}
  >
    <p
      className="hs-eyebrow"
      style={{ margin: "0 0 5px", fontSize: "9.5px", color: "var(--hs-dim)" }}
    >
      <Icon size={11} /> {label}
    </p>
    <p style={{ margin: 0, fontSize: "13.5px", fontWeight: 700, color: "var(--hs-text)" }}>{value}</p>
  </div>
);

const JobDetails = () => {
  const { id } = useParams();
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

  if (loading) return <Loader label="Loading role" full />;

  if (!job) {
    return (
      <div style={{ maxWidth: "760px" }}>
        <BackLink />
        <EmptyState icon={Briefcase} title="Job not found" subtitle="This role may have been closed or removed." />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "820px" }}>
      <BackLink />

      <SpotlightCard hover={false} live padding={0} style={{ overflow: "hidden" }}>
        {/* Hero strip with its own drifting aurora */}
        <div style={{ position: "relative", padding: "30px 30px 24px", overflow: "hidden" }}>
          <Aurora particles={false} grain={false} blobOpacity={0.42} intensity={0.7} />

          <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "flex-start", gap: "16px" }}>
            <div
              style={{
                width: "54px",
                height: "54px",
                flexShrink: 0,
                borderRadius: "var(--hs-r-lg)",
                display: "grid",
                placeItems: "center",
                background: "rgba(var(--hs-a2-rgb),0.14)",
                border: "1px solid rgba(var(--hs-a2-rgb),0.3)",
              }}
            >
              <Building2 size={23} style={{ color: "var(--hs-a3)" }} />
            </div>

            <div style={{ minWidth: 0 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(21px, 3vw, 27px)",
                  fontWeight: 900,
                  color: "var(--hs-text)",
                  letterSpacing: "-0.025em",
                }}
              >
                {job.title}
              </h1>
              <p style={{ margin: "6px 0 0", fontSize: "14.5px", color: "var(--hs-a2)", fontWeight: 700 }}>
                {job.company}
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: "0 30px 30px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "24px" }}>
            <Meta icon={MapPin} label="Location" value={job.location || "—"} />
            <Meta icon={Wallet} label="Compensation" value={job.salaryRange || "Not disclosed"} />
            <Meta
              icon={Calendar}
              label="Apply before"
              value={job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : "—"}
            />
          </div>

          {job.skillsRequired?.length > 0 && (
            <>
              <p className="hs-eyebrow" style={{ margin: "0 0 11px", fontSize: "10px", color: "var(--hs-dim)" }}>
                Skills required
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "26px" }}>
                {job.skillsRequired.map((s) => (
                  <SkillPill key={s}>{s}</SkillPill>
                ))}
              </div>
            </>
          )}

          {job.description && (
            <>
              <p className="hs-eyebrow" style={{ margin: "0 0 11px", fontSize: "10px", color: "var(--hs-dim)" }}>
                About the role
              </p>
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: 1.78,
                  color: "var(--hs-muted)",
                  whiteSpace: "pre-wrap",
                  marginBottom: "26px",
                }}
              >
                {job.description}
              </p>
            </>
          )}

          <div style={{ display: "flex", gap: "10px", paddingTop: "20px", borderTop: "1px solid var(--hs-line)" }}>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleApply}
              disabled={applied || applying}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                border: applied ? "1px solid rgba(var(--hs-ok-rgb),0.32)" : "none",
                borderRadius: "var(--hs-r-full)",
                padding: "14px",
                fontSize: "14px",
                fontWeight: 700,
                color: applied ? "var(--hs-ok)" : "#fff",
                background: applied ? "rgba(var(--hs-ok-rgb),0.12)" : "var(--hs-a2)",
                cursor: applied || applying ? "not-allowed" : "pointer",
              }}
            >
              {applied ? (
                <>
                  <Check size={16} /> Applied
                </>
              ) : applying ? (
                <>
                  <Loader2 size={16} style={{ animation: "hs-spin 1s linear infinite" }} /> Applying…
                </>
              ) : (
                "Apply now"
              )}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSave}
              disabled={saved || savingJob}
              aria-label={saved ? "Saved" : "Save job"}
              style={{
                width: "54px",
                display: "grid",
                placeItems: "center",
                border: `1px solid ${saved ? "rgba(var(--hs-a2-rgb),0.45)" : "var(--hs-line)"}`,
                borderRadius: "var(--hs-r-full)",
                background: saved ? "rgba(var(--hs-a2-rgb),0.12)" : "transparent",
                color: saved ? "var(--hs-a2)" : "var(--hs-muted)",
                cursor: saved ? "default" : "pointer",
                transition: "all 0.2s var(--hs-ease)",
              }}
            >
              {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </motion.button>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
};

export default JobDetails;
