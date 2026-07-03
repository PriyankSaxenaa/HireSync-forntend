// src/pages/dashboard/Jobs.jsx
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Search, MapPin, Calendar } from "lucide-react";
import { getAllJobsAdmin } from "../../api/admin.api";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getAllJobsAdmin();
        setJobs(data.jobs || []);
      } catch {
        toast.error("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return jobs.filter(
      (j) => !q || j.title?.toLowerCase().includes(q) || j.company?.toLowerCase().includes(q)
    );
  }, [jobs, search]);

  if (loading) return <p style={{ color: "#94a3b8" }}>Loading jobs...</p>;

  return (
    <div>
      <div style={{ position: "relative", maxWidth: "360px", marginBottom: "20px" }}>
        <Search size={16} color="#64748b" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search jobs or companies..."
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "10px 14px 10px 40px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "#0c1120",
            color: "#fff",
            fontSize: "14px",
            outline: "none",
          }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
        {filtered.map((j) => (
          <div
            key={j._id}
            style={{
              background: "#0c1120",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "20px",
              transition: "border-color 0.15s, transform 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#fff" }}>{j.title}</h3>
            <p style={{ margin: "4px 0 14px", fontSize: "13px", color: "#818cf8", fontWeight: 600 }}>{j.company}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#94a3b8" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <MapPin size={13} /> {j.location || "—"}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Calendar size={13} />
                {j.applicationDeadline ? new Date(j.applicationDeadline).toLocaleDateString() : "—"}
              </span>
            </div>

            <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: "12px", color: "#64748b" }}>
              Posted by <span style={{ color: "#cbd5e1", fontWeight: 600 }}>{j.recruiter?.name || "Unknown"}</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p style={{ color: "#475569", gridColumn: "1 / -1", textAlign: "center", padding: "40px" }}>
            No jobs found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Jobs;