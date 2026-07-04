// src/pages/candidate/CandidateDashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Sparkles,
  FileText,
  Bookmark,
  School,
  ArrowRight,
  UploadCloud,
  CheckCircle2,
} from "lucide-react";
import ColorBends from "../../components/common/ColorBends";
import StatOrb from "../../components/candidate/StatOrb";
import JobCard from "../../components/candidate/JobCard";
import DriveCard from "../../components/candidate/DriveCard";
import EmptyState from "../../components/candidate/EmptyState";
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

  const profileComplete = !!(profile?.resumeUrl && profile?.skills?.length);

  if (loading) return <p style={{ color: "#a897c9" }}>Loading your dashboard...</p>;

  return (
    <div>
      {/* Hero */}
      <div style={{ position: "relative", borderRadius: "28px", overflow: "hidden", height: "210px", marginBottom: "26px", border: "1px solid rgba(216,180,254,0.12)" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <ColorBends colors={["#8b5cf6", "#d946ef", "#f472b6"]} rotation={30} speed={0.14} scale={1.1} frequency={1} warpStrength={1} mouseInfluence={1.3} noise={0.07} parallax={0.7} iterations={1} intensity={1} bandWidth={6} transparent />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(7,4,15,0.9), rgba(7,4,15,0.35))" }} />
        <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 34px" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: "#f0abfc", marginBottom: "8px" }}>
            <Sparkles size={14} /> CANDIDATE HOME
          </span>
          <h1 style={{ margin: 0, fontSize: "clamp(22px,3vw,32px)", fontWeight: 800, color: "#fff" }}>
            Hey {user?.name?.split(" ")[0]} 👋
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#e9d5ff", maxWidth: "480px" }}>
            Your next opportunity is one application away. Let's find it.
          </p>
        </div>
      </div>

      {!profileComplete && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px", flexWrap: "wrap", padding: "16px 20px", borderRadius: "18px", background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", marginBottom: "24px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <UploadCloud size={20} color="#fcd34d" />
            <div>
              <p style={{ margin: 0, fontSize: "13.5px", fontWeight: 700, color: "#fcd34d" }}>Complete your profile</p>
              <p style={{ margin: 0, fontSize: "12.5px", color: "#a897c9" }}>Upload your resume so we can recommend jobs that fit your skills.</p>
            </div>
          </div>
          <Link to="/candidate/profile" style={{ fontSize: "12.5px", fontWeight: 700, color: "#fff", background: "linear-gradient(to right,#f59e0b,#f43f5e)", padding: "9px 18px", borderRadius: "999px", textDecoration: "none", whiteSpace: "nowrap" }}>
            Complete now
          </Link>
        </motion.div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        <StatOrb icon={FileText} label="Applications" value={applications.length} gradient="linear-gradient(135deg,#8b5cf6,#a78bfa)" delay={0} />
        <StatOrb icon={Bookmark} label="Saved Jobs" value={savedCount} gradient="linear-gradient(135deg,#d946ef,#f472b6)" delay={0.05} />
        <StatOrb icon={School} label="Campus Drives" value={drives.length} gradient="linear-gradient(135deg,#06b6d4,#22d3ee)" delay={0.1} />
        <StatOrb icon={CheckCircle2} label="Profile" value={profileComplete ? 100 : profile?.skills?.length ? 60 : 20} suffix="%" gradient="linear-gradient(135deg,#34d399,#10b981)" delay={0.15} />
      </div>

      {/* Recommended */}
      <div style={{ marginBottom: "30px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: "#fff" }}>Recommended for You</h2>
          <Link to="/candidate/jobs" style={{ fontSize: "12.5px", fontWeight: 700, color: "#f0abfc", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
            Browse all <ArrowRight size={13} />
          </Link>
        </div>
        {recommended.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="No recommendations yet"
            subtitle="Add skills or upload a resume to unlock personalized job matches based on what you already know."
            action={
              <Link to="/candidate/profile" style={{ fontSize: "13px", fontWeight: 700, color: "#fff", background: "linear-gradient(to right,#8b5cf6,#d946ef)", padding: "10px 20px", borderRadius: "999px", textDecoration: "none" }}>
                Update Profile
              </Link>
            }
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
                onView={() => {}}
              />
            ))}
          </div>
        )}
      </div>

      {/* Campus drives */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: "#fff" }}>Campus Drives</h2>
          <Link to="/candidate/campus" style={{ fontSize: "12.5px", fontWeight: 700, color: "#f0abfc", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
            View all <ArrowRight size={13} />
          </Link>
        </div>
        {drives.length === 0 ? (
          <EmptyState icon={School} title="No campus drives yet" subtitle="Drives posted by your college's placement cell will show up here." />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
            {drives.slice(0, 3).map((d) => (
              <DriveCard key={d.id} drive={d} onView={() => {}} onRespond={(r) => handleRespond(d.id, r)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;