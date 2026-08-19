// src/pages/candidate/CandidateDashboard.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Sparkles,
  FileText,
  Bookmark,
  School,
  UploadCloud,
  CheckCircle2,
  Search,
  TrendingUp,
} from "lucide-react";
import StatCard from "../../components/fx/StatCard";
import SectionTitle from "../../components/fx/SectionTitle";
import EmptyState from "../../components/fx/EmptyState";
import PageHeader from "../../components/fx/PageHeader";
import MagneticButton from "../../components/fx/MagneticButton";
import Marquee from "../../components/fx/Marquee";
import Loader from "../../components/fx/Loader";
import JobCard from "../../components/candidate/JobCard";
import DriveCard from "../../components/candidate/DriveCard";
import { useAuth } from "../../hooks/useAuth";
import { getMyProfile } from "../../api/candidate.api";
import { getMyApplications, getSavedJobs, applyToJob, saveJob } from "../../api/applications.api";
import { getRecommendedJobs } from "../../api/recommendations.api";
import { getCampusDrives, respondToDrive } from "../../api/campus.api";

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [savedCount, setSavedCount] = useState(0);
  const [recommended, setRecommended] = useState([]);
  const [drives, setDrives] = useState([]);
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [savedIds, setSavedIds] = useState(new Set());
  const [actioningId, setActioningId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [profileRes, appsRes, savedRes, drivesRes] = await Promise.allSettled([
        getMyProfile(),
        getMyApplications(),
        getSavedJobs(),
        getCampusDrives(),
      ]);

      if (profileRes.status === "fulfilled") setProfile(profileRes.value.data.user);
      if (appsRes.status === "fulfilled") {
        const apps = appsRes.value.data.applications || [];
        setApplications(apps);
        setAppliedIds(new Set(apps.map((a) => a.job?._id).filter(Boolean)));
      }
      if (savedRes.status === "fulfilled") {
        const saved = savedRes.value.data.savedJobs || [];
        setSavedCount(saved.length);
        setSavedIds(new Set(saved.map((j) => j._id)));
      }
      if (drivesRes.status === "fulfilled") setDrives(drivesRes.value.data.drives || []);

      // Recommendations depend on having skills — a 400 here is an expected,
      // honest state, not an error to surface loudly.
      try {
        const { data } = await getRecommendedJobs();
        setRecommended((data.recommendations || []).slice(0, 3));
      } catch {
        setRecommended([]);
      }
    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleApply = async (jobId) => {
    setActioningId(jobId);
    try {
      await applyToJob(jobId);
      toast.success("Application submitted!");
      setAppliedIds((prev) => new Set(prev).add(jobId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply");
    } finally {
      setActioningId(null);
    }
  };

  const handleSave = async (jobId) => {
    try {
      await saveJob(jobId);
      toast.success("Job saved");
      setSavedIds((prev) => new Set(prev).add(jobId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save job");
    }
  };

  const handleRespond = async (driveId, response) => {
    try {
      await respondToDrive(driveId, response);
      toast.success("Response recorded");
      setDrives((prev) => prev.map((d) => (d.id === driveId ? { ...d, myResponse: response } : d)));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to respond");
    }
  };

  if (loading) return <Loader label="Building your dashboard" full />;

  const profileComplete = Boolean(profile?.resumeUrl && profile?.skills?.length);
  const profileScore = profileComplete ? 100 : profile?.skills?.length ? 60 : 20;
  const firstName = user?.name?.split(" ")[0] || "there";
  const accepted = applications.filter((a) => a.status === "accepted").length;

  return (
    <div>
      <PageHeader
        eyebrow="Candidate home"
        icon={Sparkles}
        title={`Hey ${firstName} 👋`}
        liveLabel="SYNCED"
        subtitle="Your next opportunity is one application away. Everything below updates in realtime."
        actions={
          <MagneticButton to="/candidate/jobs">
            <Search size={15} /> Find roles
          </MagneticButton>
        }
      />

      {/* Nudge to finish the profile — the thing that unlocks matching */}
      {!profileComplete && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="hs-card hs-sheen"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
            padding: "16px 20px",
            marginBottom: "22px",
            background: "rgba(var(--hs-warn-rgb),0.07)",
            borderColor: "rgba(var(--hs-warn-rgb),0.24)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "13px", position: "relative" }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                flexShrink: 0,
                borderRadius: "var(--hs-r)",
                display: "grid",
                placeItems: "center",
                background: "rgba(var(--hs-warn-rgb),0.16)",
                border: "1px solid rgba(var(--hs-warn-rgb),0.32)",
              }}
            >
              <UploadCloud size={17} style={{ color: "var(--hs-warn)" }} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "13.5px", fontWeight: 800, color: "var(--hs-warn)" }}>
                Complete your profile
              </p>
              <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: "var(--hs-muted)" }}>
                Upload a resume so we can match you to roles that fit your skills.
              </p>
            </div>
          </div>

          <MagneticButton to="/candidate/profile" style={{ position: "relative", fontSize: "12.5px" }}>
            Complete now
          </MagneticButton>
        </motion.div>
      )}

      {/* ── KPI row ───────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "16px",
          marginBottom: "26px",
        }}
      >
        <StatCard
          icon={FileText}
          label="Applications"
          value={applications.length}
          hint={accepted > 0 ? `${accepted} accepted` : "Track them live"}
          tone="var(--hs-a1-rgb)"
          delay={0}
          live={accepted > 0}
        />
        <StatCard icon={Bookmark} label="Saved jobs" value={savedCount} tone="var(--hs-a2-rgb)" delay={0.06} />
        <StatCard icon={School} label="Campus drives" value={drives.length} tone="var(--hs-a3-rgb)" delay={0.12} />
        <StatCard
          icon={CheckCircle2}
          label="Profile strength"
          value={profileScore}
          suffix="%"
          progress={profileScore}
          tone="var(--hs-ok-rgb)"
          delay={0.18}
        />
      </div>

      {/* ── Skill ticker — a permanent readout of what you match on ───────── */}
      {profile?.skills?.length > 0 && (
        <div
          className="hs-card"
          style={{ padding: "13px 0", marginBottom: "26px", display: "flex", alignItems: "center", gap: "16px" }}
        >
          <span
            className="hs-eyebrow"
            style={{ paddingLeft: "20px", fontSize: "10px", color: "var(--hs-a2)", flexShrink: 0 }}
          >
            <TrendingUp size={12} /> Matching on
          </span>
          <Marquee duration={30} gap={26} style={{ flex: 1, minWidth: 0 }}>
            {profile.skills.map((s) => (
              <span
                key={s}
                style={{
                  fontSize: "12.5px",
                  fontWeight: 700,
                  color: "var(--hs-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  whiteSpace: "nowrap",
                }}
              >
                {s}
              </span>
            ))}
          </Marquee>
        </div>
      )}

      {/* ── Recommended ───────────────────────────────────────────────────── */}
      <div style={{ marginBottom: "32px" }}>
        <SectionTitle
          title="Recommended for you"
          subtitle="Ranked on real overlap with your skills"
          icon={Sparkles}
          to="/candidate/jobs"
          actionLabel="Browse all"
        />

        {recommended.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="No recommendations yet"
            subtitle="Add skills or upload a resume to unlock personalised matches based on what you already know."
            action={<MagneticButton to="/candidate/profile">Update profile</MagneticButton>}
          />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
            {recommended.map((r) => (
              <JobCard
                key={r.job._id}
                job={r.job}
                matchScore={r.matchScore}
                matchedSkills={r.matchedSkills}
                isSaved={savedIds.has(r.job._id)}
                applied={appliedIds.has(r.job._id)}
                applying={actioningId === r.job._id}
                onApply={() => handleApply(r.job._id)}
                onSave={() => handleSave(r.job._id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Campus drives ─────────────────────────────────────────────────── */}
      <div>
        <SectionTitle
          title="Campus drives"
          subtitle="Posted by your placement cell"
          icon={School}
          to="/candidate/campus"
        />

        {drives.length === 0 ? (
          <EmptyState
            icon={School}
            title="No campus drives yet"
            subtitle="Drives posted by your college's placement cell will show up here."
            compact
          />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
            {drives.slice(0, 3).map((d) => (
              <DriveCard key={d.id} drive={d} onRespond={(r) => handleRespond(d.id, r)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;
