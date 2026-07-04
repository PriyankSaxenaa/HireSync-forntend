// src/pages/candidate/BrowseJobs.jsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Search, MapPin, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import JobCard from "../../components/candidate/JobCard";
import EmptyState from "../../components/candidate/EmptyState";
import { getAllJobs } from "../../api/jobs.api";
import { applyToJob, saveJob, getMyApplications, getSavedJobs } from "../../api/applications.api";

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  borderRadius: "12px",
  padding: "12px 14px 12px 40px",
  fontSize: "13.5px",
  background: "rgba(255,255,255,0.03)",
  color: "#fff",
  border: "1px solid rgba(216,180,254,0.15)",
  outline: "none",
};

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

  return (
    <div>
      <div style={{ marginBottom: "22px" }}>
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: "#fff" }}>Browse Jobs</h1>
        <p style={{ margin: "6px 0 0", fontSize: "13.5px", color: "#a897c9" }}>{total} open positions right now.</p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}>
        <div style={{ position: "relative", flex: "1 1 260px" }}>
          <Search size={16} color="#7c6f93" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={keyword}
            onChange={(e) => {
              setPage(1);
              setKeyword(e.target.value);
            }}
            placeholder="Search title or company..."
            style={inputStyle}
          />
        </div>
        <div style={{ position: "relative", flex: "1 1 200px" }}>
          <MapPin size={16} color="#7c6f93" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={location}
            onChange={(e) => {
              setPage(1);
              setLocation(e.target.value);
            }}
            placeholder="Location..."
            style={inputStyle}
          />
        </div>
      </div>

      {loading ? (
        <p style={{ color: "#a897c9" }}>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <EmptyState icon={Sparkles} title="No jobs match your search" subtitle="Try a broader keyword or clear the location filter." />
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "18px", marginBottom: "24px" }}>
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

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px" }}>
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              style={{ display: "flex", alignItems: "center", gap: "4px", border: "1px solid rgba(216,180,254,0.15)", background: "transparent", color: "#fff", padding: "8px 14px", borderRadius: "10px", cursor: page <= 1 ? "not-allowed" : "pointer", opacity: page <= 1 ? 0.4 : 1 }}
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <span style={{ fontSize: "13px", color: "#a897c9" }}>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              style={{ display: "flex", alignItems: "center", gap: "4px", border: "1px solid rgba(216,180,254,0.15)", background: "transparent", color: "#fff", padding: "8px 14px", borderRadius: "10px", cursor: page >= totalPages ? "not-allowed" : "pointer", opacity: page >= totalPages ? 0.4 : 1 }}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BrowseJobs;