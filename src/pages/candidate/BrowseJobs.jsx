// src/pages/candidate/BrowseJobs.jsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Search, MapPin, Sparkles, Briefcase } from "lucide-react";
import JobCard from "../../components/candidate/JobCard";
import EmptyState from "../../components/fx/EmptyState";
import PageHeader from "../../components/fx/PageHeader";
import SearchField from "../../components/fx/SearchField";
import Pagination from "../../components/fx/Pagination";
import Counter from "../../components/fx/Counter";
import { SkeletonGrid } from "../../components/fx/Skeleton";
import { getAllJobs } from "../../api/jobs.api";
import { applyToJob, saveJob, getMyApplications, getSavedJobs } from "../../api/applications.api";

const BrowseJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [savedIds, setSavedIds] = useState(new Set());
  const [actioningId, setActioningId] = useState(null);
  const limit = 9;

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getAllJobs({ keyword, location, page, limit });
      setJobs(data.jobs || []);
      setTotal(data.total || 0);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [keyword, location, page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    (async () => {
      try {
        const [appsRes, savedRes] = await Promise.allSettled([getMyApplications(), getSavedJobs()]);
        if (appsRes.status === "fulfilled") {
          setAppliedIds(new Set((appsRes.value.data.applications || []).map((a) => a.job?._id).filter(Boolean)));
        }
        if (savedRes.status === "fulfilled") {
          setSavedIds(new Set((savedRes.value.data.savedJobs || []).map((j) => j._id)));
        }
      } catch {
        // non-critical
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

  const handleSave = async (jobId) => {
    try {
      await saveJob(jobId);
      toast.success("Job saved");
      setSavedIds((prev) => new Set(prev).add(jobId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save job");
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const filtering = Boolean(keyword || location);

  return (
    <div>
      <PageHeader
        eyebrow="Job board"
        icon={Briefcase}
        title="Browse open roles"
        liveLabel="HIRING NOW"
        subtitle={
          <>
            <b style={{ color: "var(--hs-text)" }}>
              <Counter value={total} />
            </b>{" "}
            open position{total === 1 ? "" : "s"} right now — filtered live as you type.
          </>
        }
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "11px" }}>
          <SearchField
            icon={Search}
            value={keyword}
            onChange={(e) => {
              setPage(1);
              setKeyword(e.target.value);
            }}
            onClear={() => {
              setPage(1);
              setKeyword("");
            }}
            placeholder="Search title or company…"
          />
          <SearchField
            icon={MapPin}
            flex="1 1 200px"
            value={location}
            onChange={(e) => {
              setPage(1);
              setLocation(e.target.value);
            }}
            onClear={() => {
              setPage(1);
              setLocation("");
            }}
            placeholder="Location…"
          />
        </div>
      </PageHeader>

      {loading ? (
        <SkeletonGrid count={6} />
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title={filtering ? "No jobs match your search" : "No open roles right now"}
          subtitle={
            filtering
              ? "Try a broader keyword or clear the location filter."
              : "New roles land here the moment recruiters publish them."
          }
        />
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "18px",
            }}
          >
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                isSaved={savedIds.has(job._id)}
                applied={appliedIds.has(job._id)}
                applying={actioningId === job._id}
                onApply={() => handleApply(job._id)}
                onSave={() => handleSave(job._id)}
                onView={() => navigate(`/candidate/jobs/${job._id}`)}
              />
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} total={total} label="jobs" onChange={setPage} />
        </>
      )}
    </div>
  );
};

export default BrowseJobs;
