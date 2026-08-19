// src/pages/candidate/SavedJobs.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Bookmark } from "lucide-react";
import JobCard from "../../components/candidate/JobCard";
import EmptyState from "../../components/fx/EmptyState";
import PageHeader from "../../components/fx/PageHeader";
import MagneticButton from "../../components/fx/MagneticButton";
import { SkeletonGrid } from "../../components/fx/Skeleton";
import { getSavedJobs, applyToJob, getMyApplications } from "../../api/applications.api";

const SavedJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [actioningId, setActioningId] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [savedRes, appsRes] = await Promise.allSettled([getSavedJobs(), getMyApplications()]);
        if (savedRes.status === "fulfilled") setJobs(savedRes.value.data.savedJobs || []);
        if (appsRes.status === "fulfilled") {
          setAppliedIds(new Set((appsRes.value.data.applications || []).map((a) => a.job?._id).filter(Boolean)));
        }
      } catch {
        toast.error("Failed to load saved jobs");
      } finally {
        setLoading(false);
      }
    })();
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

  return (
    <div>
      <PageHeader
        eyebrow="Shortlist"
        icon={Bookmark}
        title="Saved jobs"
        live={false}
        subtitle={`${jobs.length} job${jobs.length === 1 ? "" : "s"} bookmarked for later.`}
        actions={
          <MagneticButton to="/candidate/jobs" variant="ghost" style={{ fontSize: "13px" }}>
            Browse more
          </MagneticButton>
        }
      />

      {loading ? (
        <SkeletonGrid count={3} />
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="Nothing saved yet"
          subtitle="Bookmark roles while browsing to build a shortlist you can come back to."
          action={<MagneticButton to="/candidate/jobs">Browse jobs</MagneticButton>}
        />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "18px" }}>
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              isSaved
              applied={appliedIds.has(job._id)}
              applying={actioningId === job._id}
              onApply={() => handleApply(job._id)}
              onSave={() => {}}
              onView={() => navigate(`/candidate/jobs/${job._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
